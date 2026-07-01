# API Contract

Locked before implementation so backend and frontend are built against the same shapes from the start.

Base path: `/api`

---

## User

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "companyName": "Acme Corp",
  "addressCity": "Nairobi",
  "addressStreet": "Kimathi Street",
  "createdAt": "2026-06-28T10:15:30Z",
  "updatedAt": "2026-06-28T10:15:30Z"
}
```

### `GET /api/users`
- 200 → `User[]`

### `GET /api/users/:userId`
- 200 → `User`
- 404 → `ApiError` (unknown userId)

---

## Post

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "My First Post",
  "body": "This is the body of the post.",
  "createdAt": "2026-06-28T10:20:00Z",
  "updatedAt": "2026-06-28T10:20:00Z"
}
```

### `GET /api/users/:userId/posts`
- 200 → `Post[]` (sorted `createdAt` descending — newest first)
- 404 → `ApiError` (unknown userId)

### `POST /api/users/:userId/posts`
Request body:
```json
{
  "title": "My First Post",
  "body": "This is the body of the post."
}
```
- 201 → `Post` (the newly created post, with generated `id`, `createdAt`, `updatedAt`)
- 400 → `ValidationError` (empty/missing `title` or `body`)
- 404 → `ApiError` (unknown userId)

---

## Error Shapes

### `ApiError`: general errors (404, 500, etc.)
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "User not found",
  "timestamp": "2026-06-28T10:22:00Z"
}
```

### `ValidationError`: 400 responses with field-level detail
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "timestamp": "2026-06-28T10:22:00Z",
  "fieldErrors": {
    "title": "must not be blank",
    "body": "must not be blank"
  }
}
```

Frontend maps `fieldErrors` keys directly onto the corresponding reactive form control to show inline messages.

---

## Live Updates (SSE)

### `GET /api/live/posts`
Server-Sent Events stream. Each event's `data` payload is a `Post` JSON object (same shape as above), sent whenever a new post is created anywhere in the system.

```
event: post-created
data: {"id":"...","userId":"...","title":"...","body":"...","createdAt":"...","updatedAt":"..."}
```

Frontend behavior: on receiving `post-created`, if the event's `userId` matches the currently viewed user, prepend the post to the visible feed.
Otherwise ignore (or optionally show a lightweight "new post" indicator, not required).

---

## Conventions

- All timestamps: ISO-8601 UTC (`TIMESTAMPTZ` serialized as `...Z`).
- All IDs: UUID strings.
- JSON field naming: `camelCase` on the wire (Java `snake_case`/DB columns are mapped to camelCase in DTOs, never expose raw entity/column names).
- CORS: backend allows the frontend's origin(s) for local dev and the deployed Vercel URL in production.
