-- V2__seed.sql
-- Seed data: 5 sample users, 3 posts each.
-- Fixed UUIDs used so seed data is deterministic and referenceable
INSERT INTO users (
        id,
        name,
        email,
        company_name,
        address_city,
        address_street
    )
VALUES (
        '11111111-1111-1111-1111-111111111111',
        'Jane Doe',
        'jane.doe@example.com',
        'Acme Corp',
        'Springfield',
        '12 Maple Street'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'John Smith',
        'john.smith@example.com',
        'Globex Inc',
        'Riverside',
        '48 Oak Avenue'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Alice Johnson',
        'alice.johnson@example.com',
        'Initech',
        'Fairview',
        '7 Birch Lane'
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Michael Brown',
        'michael.brown@example.com',
        'Umbrella Corp',
        'Lakeside',
        '90 Cedar Road'
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'Emily Davis',
        'emily.davis@example.com',
        'Stark Industries',
        'Hillcrest',
        '23 Pine Court'
    );
INSERT INTO posts (id, user_id, title, body)
VALUES -- Jane Doe
    (
        'a1111111-0001-0001-0001-000000000001',
        '11111111-1111-1111-1111-111111111111',
        'Getting Started with Spring Boot',
        'Spring Boot removes a lot of the boilerplate that comes with setting up a Java web application. In this post I walk through my first project setup and what surprised me along the way.'
    ),
    (
        'a1111111-0001-0001-0001-000000000002',
        '11111111-1111-1111-1111-111111111111',
        'Why I Switched to PostgreSQL',
        'After years of using a NoSQL store by default, I moved a recent project to PostgreSQL for the stronger consistency guarantees and mature tooling around migrations and indexing.'
    ),
    (
        'a1111111-0001-0001-0001-000000000003',
        '11111111-1111-1111-1111-111111111111',
        'Notes on API Design',
        'A short list of conventions I try to stick to when designing REST APIs: consistent error shapes, predictable status codes, and versioning from day one even if you never expect to need it.'
    ),
    -- John Smith
    (
        'a2222222-0002-0002-0002-000000000001',
        '22222222-2222-2222-2222-222222222222',
        'A Weekend with Docker Compose',
        'Spent the weekend containerizing a side project. Docker Compose made it trivial to bring up a database, backend, and frontend together with a single command.'
    ),
    (
        'a2222222-0002-0002-0002-000000000002',
        '22222222-2222-2222-2222-222222222222',
        'Thoughts on Modular Monoliths',
        'Microservices get a lot of attention, but for small teams a well-structured modular monolith often gets you most of the benefits without the operational overhead.'
    ),
    (
        'a2222222-0002-0002-0002-000000000003',
        '22222222-2222-2222-2222-222222222222',
        'Debugging a Tricky Race Condition',
        'Spent most of yesterday tracking down a race condition in an event listener. The fix ended up being a single annotation, but finding it took much longer than fixing it.'
    ),
    -- Alice Johnson
    (
        'a3333333-0003-0003-0003-000000000001',
        '33333333-3333-3333-3333-333333333333',
        'Accessibility Is Not Optional',
        'Revisited an old project this week and ran a full keyboard-only pass over it. Found several places where focus states and ARIA attributes were missing entirely.'
    ),
    (
        'a3333333-0003-0003-0003-000000000002',
        '33333333-3333-3333-3333-333333333333',
        'First Impressions of Angular Signals',
        'Signals make state management feel a lot more predictable than the RxJS-heavy patterns I was used to. Still adjusting, but the mental model is simpler.'
    ),
    (
        'a3333333-0003-0003-0003-000000000003',
        '33333333-3333-3333-3333-333333333333',
        'A Simple Retry Pattern for Failed Requests',
        'Instead of reaching for a library, a small wrapper around the HTTP client with exponential backoff covered everything this project needed.'
    ),
    -- Michael Brown
    (
        'a4444444-0004-0004-0004-000000000001',
        '44444444-4444-4444-4444-444444444444',
        'Choosing Between SSE and WebSockets',
        'For one-directional server-to-client updates, Server-Sent Events are simpler to reason about than WebSockets and need far less client-side plumbing.'
    ),
    (
        'a4444444-0004-0004-0004-000000000002',
        '44444444-4444-4444-4444-444444444444',
        'Flyway vs. Auto-Generated Schemas',
        'Letting an ORM manage schema changes is convenient until it silently does something you did not expect. Versioned migrations are worth the small amount of extra setup.'
    ),
    (
        'a4444444-0004-0004-0004-000000000003',
        '44444444-4444-4444-4444-444444444444',
        'A Checklist Before Every Deploy',
        'Wrote up the checklist I run through before deploying anything to production. Small things like confirming environment variables are set save a lot of debugging later.'
    ),
    -- Emily Davis
    (
        'a5555555-0005-0005-0005-000000000001',
        '55555555-5555-5555-5555-555555555555',
        'Learning to Write Better Commit Messages',
        'Started treating commit messages as documentation rather than an afterthought. Future me reading the log has already said thank you more than once.'
    ),
    (
        'a5555555-0005-0005-0005-000000000002',
        '55555555-5555-5555-5555-555555555555',
        'UUIDs vs. Auto-Increment IDs',
        'Weighed the tradeoffs recently for a new project. UUIDs won out for avoiding sequential ID leakage and for being safe to generate independently across services.'
    ),
    (
        'a5555555-0005-0005-0005-000000000003',
        '55555555-5555-5555-5555-555555555555',
        'Small Habits That Improved My Code Reviews',
        'Leaving a short summary at the top of every pull request has made reviews noticeably faster, both for me and for whoever is reviewing.'
    );