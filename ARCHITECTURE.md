# Architecture & Design Decisions

This document explains **why** the system is built the way it is, the technology choices, the database design, and how each layer is expected to scale. It was written before implementation began, as part of the planning phase.

---

## 1. Tech Stack

| Layer            | Choice                                                        |
| ---------------- | ------------------------------------------------------------- |
| Backend          | Java, Spring Boot                                             |
| Frontend         | Angular (standalone components, signals)                      |
| Database         | PostgreSQL                                                    |
| Migrations       | Flyway                                                        |
| Live updates     | Spring `ApplicationEventPublisher` + Server-Sent Events (SSE) |
| Containerization | Docker, Docker Compose                                        |
| Deployment       | Backend on Render, Frontend on Vercel                         |

---

## 2. Why These Choices

### Why Spring Boot?

The framework provides validation, JPA, transactional event handling, and REST support out of the box, with strong conventions. For a time-boxed assessment, that means less time wiring infrastructure and more time on the features being graded.

### Why Angular?

Angular is opinionated and batteries-included: routing, forms, HTTP client, and dependency injection are all built in, which removes a layer of "which router/state library" decisions that would otherwise eat into an MVP release window.
Signals provide fine-grained reactive state without needing a separate state management library (e.g. NgRx) at this scale.

### Why PostgreSQL over MongoDB/SQLite?

The data is inherently relational, a post belongs to a user via a clear foreign key and referential integrity should be enforced at the database level, not just in application code (a post cannot be created for a non-existent user, the database rejects it). Postgres also has a real, well-understood path for scaling (read replicas, partitioning), which SQLite structurally does not offer, and pairs naturally with Spring Data JPA.

### Why a Modular Monolith, not Microservices?

Microservices solve organizational and independent-scaling problems that don't exist yet at this stage (one team, one deployable, modest traffic). Splitting into services now would introduce distributed transactions and network calls where a function call would do, for no real benefit.

A _modular_ monolith gets the main benefit people actually want from microservices (enforced boundaries between domains) without the distributed-systems tax. The module boundaries (`user`, `post`, `live`) are drawn exactly where a future service split would happen, so migrating later is a matter of extracting a module behind a network call, not a redesign.

### Why `ApplicationEventPublisher` instead of Kafka?

Kafka was considered, since it's a natural fit for decoupling "post created" from "notify live listeners." However, for a single-instance application, an in-process event bus provides the same decoupling benefit (the write path doesn't know about the live-update path) without the operational overhead of running and coordinating a broker.

The trade-off: `ApplicationEventPublisher` only works within a single JVM. If this service were ever scaled to multiple instances, an event published on instance A would not reach a client connected via SSE to instance B. That is the specific point at which this would be swapped for Kafka or Redis Pub/Sub, the `PostCreatedEvent` publish call itself would not need to change, only what listens on the other side.

`@TransactionalEventListener(phase = AFTER_COMMIT)` is used rather than a plain `@EventListener`, so that the live-update broadcast only fires after the database transaction has actually committed, avoiding a race where a client is notified of a post that isn't durably saved yet.

### Why a custom exception hierarchy instead of throwing built-in exceptions?

Throwing bare `RuntimeException` or `IllegalArgumentException` directly from business logic is avoided throughout this codebase (and is flagged by static analysis tools such as Codacy) because those types carry no domain meaning. A caller catching `RuntimeException` learns nothing about what actually went wrong. Instead, every exception extends a single `ApplicationException` base class that pairs a message with the HTTP status it should produce (e.g. `ResourceNotFoundException` → 404). `GlobalExceptionHandler` (`@RestControllerAdvice`) catches this base type once, in one place, and translates it into a consistent `ErrorResponse`. Individual controllers and services never construct HTTP responses or know about status codes themselves.

A second, deliberate rule: **exception messages never include the identifier that was looked up.** A message like `"User with id 550e8400-... was not found"` leaks internal identifiers into logs, browser dev tools, and error trackers for no benefit to the caller, who already knows which ID it sent. `ResourceNotFoundException` instead exposes fixed factory methods (`ResourceNotFoundException.user()`, `.post()`) that return a generic message such as `"User not found"`. When the actual ID is useful for debugging, it is logged via SLF4J at the point of failure, server-side only, never in the response body.

`GlobalExceptionHandler` also has a final catch-all for any unanticipated `Exception`: the real exception (with full stack trace) is logged in full on the server, but the client only ever receives a generic `"An unexpected error occurred"` message. Internal implementation details are never leaked over the API.

### Why Lombok?

Lombok removes constructor/getter/setter boilerplate via annotations. It is used selectively, not blanket-applied:

- Entities use `@Getter`/`@Setter`/`@NoArgsConstructor`/`@AllArgsConstructor`/`@Builder`, but deliberately **not** `@Data`. `@Data` generates `equals()`/`hashCode()` from every field, which is unsafe on JPA entities (it can trigger unwanted lazy-loading and produces an inconsistent contract once an entity is persisted and its ID is assigned).
- Service classes use `@RequiredArgsConstructor` for constructor injection of `final` dependency fields, and `@Slf4j` for a ready-made logger, both standard, low-risk uses.
- DTOs are plain Java `record`s, not Lombok classes, since DTOs should be immutable, behavior-free value objects, exactly what a record already is, with no annotation needed.

### Why MapStruct?

Entity to DTO mapping is handled by MapStruct rather than hand-written mapper methods or a reflection-based library (e.g. ModelMapper). MapStruct generates the mapping implementation at **compile time**, there is no runtime reflection cost, and critically, the build fails immediately if a field cannot be mapped, rather than silently producing a `null` discovered only later at runtime. This is the standard choice in most enterprise Spring Boot codebases once a project has more than one or two DTOs to maintain.

### Why springdoc-openapi (Swagger UI)?

The API is self-documenting via `springdoc-openapi`, which generates an OpenAPI 3 spec from controller annotations and serves an interactive Swagger UI at `/swagger-ui.html`. This gives reviewers (and future developers) a way to explore and test every endpoint directly in the browser. No Postman collection or curl commands required to verify the API works as documented.

### Why Flyway migrations instead of `ddl-auto: update`?

`ddl-auto` is convenient for a throwaway prototype but risky in a real system, it can silently alter or drop columns based on entity changes. Flyway migrations are explicit, versioned, and reviewable in a diff, this is what a real team would use, and using it here is a deliberate signal of production habits rather than prototype habits.

---

## 3. Database Design

```
users
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid()
  name           VARCHAR NOT NULL
  email          VARCHAR NOT NULL UNIQUE
  company_name   VARCHAR
  address_city   VARCHAR
  address_street VARCHAR
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()

posts
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
  title       VARCHAR NOT NULL
  body        TEXT NOT NULL
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()

INDEX idx_posts_user_id ON posts(user_id)
```

**Design rationale:**

- **UUID primary keys instead of auto-incrementing `BIGSERIAL`:** IDs are generated via Postgres's built-in `gen_random_uuid()`, which matters for a few concrete reasons:
  - **No sequential ID leakage:** Sequential integer IDs expose internal volume and ordering (`/api/users/17` implies "the 17th user ever created"), a minor but real information leak. UUIDs don't reveal this.
  - **Safe for future distributed writes:** If `posts` is ever partitioned, or the `post` module extracted into its own service with its own database (see Scaling Strategy below), UUIDs can be generated independently on any node without coordinating a single shared sequence, auto-increment IDs cannot do this without risking collisions.
  - **Safe to expose in URLs/APIs and usable client-side:**, e.g. for optimistic UI updates before a server round-trip completes.
  - Trade-off: UUIDs are larger (16 bytes vs 8) and less human-readable when debugging than a sequential integer. At this application's scale that cost is negligible next to the benefits above.
- **`created_at` and `updated_at` on every table, for auditing:** `created_at` is set once at insert time; `updated_at` is refreshed on every write (handled at the application layer via JPA's `@PrePersist` / `@PreUpdate`).
  This gives a basic audit trail for free when a record was first created and when it last changed even though the brief doesn't explicitly require it.
- `ON DELETE CASCADE`: deleting a user removes their posts automatically, no orphaned rows, no application-level cleanup code required.
- Index on `posts.user_id`: every posts query filters by this column (`GET /api/users/:userId/posts`), without it, this becomes a full table scan as data grows.
- `email UNIQUE`: a reasonable real-world constraint beyond the minimum spec, showing attention to data integrity.
- Feed ordering uses `created_at`, not ID, UUIDs (unlike auto-increment integers) carry no inherent chronological ordering, so sorting posts newest-first must rely on the timestamp column.
- Flat `company_name` / `address_*` columns instead of separate tables: a deliberate choice not to over-normalize. Nothing else in the system references "company" or "address" independently, so a join would add cost with no corresponding benefit at this scale.

---

## 4. Scaling Strategy

### Infrastructure layer

- **Today:** one backend container, one frontend container, one Postgres instance, coordinated via Docker Compose.
- **Next:** the backend is stateless by design (no in-memory session state), so it can be horizontally scaled to N instances behind a load balancer. This is exactly where the `ApplicationEventPublisher` limitation applies, and where live updates would move to Kafka or Redis Pub/Sub.
- **Beyond that:** the Angular build output is static and can be served from a CDN, scaling independently of the backend. Hot read endpoints (e.g. `GET /api/users`) become candidates for a Redis cache in front of the read path.

### Database layer

- **Today:** a single Postgres instance handles both reads and writes.
- **Next:** since this application is read-heavy (browsing far outweighs creating posts), read replicas can serve `GET` traffic while writes stay on the primary, no schema change required.
- **Beyond that:** if a single table grows very large, Postgres native partitioning on `posts` by `user_id` works without an application rewrite, since queries are already scoped by `user_id`. Full sharding would be a last resort, and is exactly where the `post` module's clean boundary pays off. It could become its own service with its own database, since nothing else reaches into its tables directly.
- Connection pooling (HikariCP, Spring Boot's default) is sized appropriately to avoid exhausting Postgres connections under concurrent load.

### Application layer

- **Today:** a modular monolith with clear internal boundaries (`user`, `post`, `live`), communicating via service interfaces and Spring events never reaching across module boundaries into another module's repository.
- **Next:** because those boundaries already exist, extracting a module into its own service means giving it its own database/schema, replacing the in-process call with an HTTP/gRPC call or async message, and replacing `ApplicationEventPublisher` with Kafka/Redis Pub/Sub for that module's events. The domain logic inside each module does not need to change, only how modules communicate changes.
- Application-level caching (`@Cacheable`) is a cheap lever to reach for before any infrastructure-level scaling.

---

## 5. Build Order (for reference)

1. Repo & folder scaffold (`/server`, `/client`)
2. Backend skeleton + Flyway migrations (schema + seed data)
3. Angular skeleton
4. Vertical feature slices, backend then frontend for each:
   - Users (list + detail)
   - Posts feed
   - Create post
   - Live updates (`ApplicationEventPublisher` -> SSE)
5. Dockerize (Dockerfiles + docker-compose.yml)
6. Accessibility & responsive pass
7. Micro-interaction polish pass
8. Deploy (Render + Vercel)
9. Finalize README with screenshots and live URLs
