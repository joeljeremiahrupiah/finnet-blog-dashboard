# Finnet Dashboard & Post Manager

A full-stack User Dashboard & Post Manager built as a technical assessment for Finnet Trust. Users can be browsed, their posts viewed in a live-updating feed, and new posts created all backed by a custom REST API.

> See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full reasoning behind the
> technology choices, database design, and scaling strategy.

---

## Status

Planning complete, implementation in progress.

---

## Project Structure

```
finnet-blog-dashboard/
  server/     Spring Boot backend (REST API, PostgreSQL, Flyway)
  client/     Angular frontend
  docker-compose.yml
  ARCHITECTURE.md
  README.md
```

_(Structure will be filled in as each part is built.)_

## Tech Stack

- **Backend:** Java, Spring Boot, PostgreSQL, Flyway
- **Boilerplate reduction:** Lombok (used selectively never `@Data` on JPA entities; see `ARCHITECTURE.md`)
- **Entity/DTO mapping:** MapStruct (compile-time generated)
- **API documentation:** springdoc-openapi, interactive Swagger UI at `/swagger-ui.html` once the backend is running locally or deployed
- **Frontend:** Angular (standalone components, signals)
- **Live updates:** Spring `ApplicationEventPublisher` + Server-Sent Events
- **Infra:** Docker, Docker Compose
- **Deployment:** Render (backend), Vercel (frontend)

## Prerequisites & Setup

_(To be completed once the backend and frontend are scaffolded.)_

## Seed Data

_(To be completed: 5 sample users, 3+ posts each, seeded via Flyway migration.)_

## Live Demo

_(To be added once deployed.)_

## Design Decisions & Trade-offs

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full write-up. In short:

- **Modular monolith** over microservices right-sized for current scale, with module boundaries drawn where a future service split would occur.
- **`ApplicationEventPublisher`** over Kafka for live-update events, same decoupling benefit without broker overhead, with a named upgrade path if the backend is ever horizontally scaled.
- **Flyway migrations** over `ddl-auto` explicit, versioned schema changes.

## Screenshots

_(To be added.)_
