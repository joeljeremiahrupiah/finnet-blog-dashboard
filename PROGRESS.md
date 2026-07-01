# Progress Tracker

Working checklist for the build.

## Git Workflow Convention

One short-lived branch per phase below, merged back into `main` via a (self-reviewed) Pull Request:

```bash
git checkout main
git pull
git checkout -b feat/<phase-name>
# work, commit incrementally as sub-steps within the phase are completed
git push -u origin feat/<phase-name>
# open a PR on GitHub, add a short description of what/why, merge it
git checkout main
git pull
git branch -d feat/<phase-name>
```

Branch naming mirrors the phase, e.g. `feat/scaffold`, `feat/users-slice`,
`feat/posts-feed-slice`, `feat/create-post-slice`, `feat/live-updates`,
`chore/dockerize`, `fix/accessibility-responsive`, `style/polish`,
`chore/deployment`, `docs/finalize-readme`.

## Phase 1: Planning
- [x] Read and understand the assessment brief
- [x] Decide tech stack (Spring Boot, Angular, PostgreSQL, Docker)
- [x] Decide architecture (modular monolith, `user`/`post`/`live` modules)
- [x] Decide live-update mechanism (`ApplicationEventPublisher` + SSE)
- [x] Write `ARCHITECTURE.md` (design decisions, DB design, scaling strategy)
- [x] Write stub `README.md`
- [x] Create repo, first commit, push
- [x] Lock API/DTO contract (`API_CONTRACT.md`)

## Phase 2: Scaffold
- [x] `server/`: Spring Boot project generated, builds and runs locally
- [x] `client/`: Angular project generated, builds and serves locally
- [x] Postgres running locally, backend connects successfully

## Phase 3: Database
- [ ] Flyway `V1__init.sql`: users, posts tables (UUID PKs, created_at/updated_at)
- [ ] Flyway `V2__seed.sql`: 5 users, 3+ posts each
- [ ] Commit: "feat: add database schema and seed data"

## Phase 4: Users slice
- [ ] Backend: entity, repository, DTO, `GET /api/users`, `GET /api/users/:id`
- [ ] Backend: global exception handler skeleton
- [ ] Frontend: `UserService`, user list/sidebar, user detail card
- [ ] Frontend wired to real API, CORS confirmed working
- [ ] Commit: "feat: user listing and detail"

## Phase 5: Posts feed slice
- [ ] Backend: `GET /api/users/:userId/posts`, 404 for unknown user
- [ ] Frontend: feed component, expand/collapse
- [ ] Frontend: skeleton loader, empty state, retry mechanism (reusable pattern)
- [ ] Commit: "feat: posts feed with loading/error states"

## Phase 6: Create post slice
- [ ] Backend: `POST /api/users/:userId/posts`, validation, structured 400 errors
- [ ] Frontend: reactive form, client + server validation display
- [ ] Frontend: optimistic prepend to feed on success
- [ ] Commit: "feat: create post"

## Phase 7: Live updates
- [ ] Backend: `PostCreatedEvent`, `@TransactionalEventListener(AFTER_COMMIT)`
- [ ] Backend: SSE endpoint + emitter registry
- [ ] Frontend: `EventSource` subscription, live prepend
- [ ] Commit: "feat: live post updates via SSE"

## Phase 8: Dockerize
- [ ] `server/Dockerfile` (multi-stage)
- [ ] `client/Dockerfile` (multi-stage, nginx)
- [ ] `docker-compose.yml` (postgres, backend, frontend, healthchecks)
- [ ] Verified: `git clone` → `docker-compose up` → working app
- [ ] Commit: "chore: dockerize backend, frontend, and database"

## Phase 9: Accessibility & responsive pass
- [ ] Semantic landmarks, `aria-expanded` on collapse toggles
- [ ] Keyboard-only run-through (tab through app, submit form via keyboard)
- [ ] Color contrast check
- [ ] Mobile / tablet / desktop breakpoints tested
- [ ] Commit: "fix: accessibility and responsive improvements"

## Phase 10: Polish pass
- [ ] Hover states, transitions, expand/collapse animation
- [ ] Button loading spinners, empty-state copy/illustration
- [ ] Commit: "style: micro-interactions and polish"

## Phase 11: Deploy
- [ ] Backend deployed (Render): live URL working
- [ ] Frontend deployed (Vercel): live URL working
- [ ] Postgres provisioned on deploy platform
- [ ] Commit (if config changes needed): "chore: deployment configuration"

## Phase 12: Documentation
- [ ] Fill in `README.md`: setup instructions (tested on clean clone)
- [ ] Add screenshots + live demo links to `README.md`
- [ ] Final read-through of `ARCHITECTURE.md` for accuracy vs. final build
- [ ] Commit: "docs: finalize README with setup, screenshots, and demo links"

## Phase 13: Submit
- [ ] Add `hr@finnettrust.com` as collaborator (if repo is private)
- [ ] Send submission email (subject: `Full-Stack Assessment Submission - [Name]`)
