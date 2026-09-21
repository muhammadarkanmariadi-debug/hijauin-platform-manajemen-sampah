# AGENT.md — Context for AI Agents Working on Hijauin

Read this first. Then read `PRD.md` (what we're building), `TRD.md` (how it's
architected), and `SCHEMA.md` (data layer) before writing code.

## What Hijauin Is
A multi-tenant digital waste-bank platform. Nasabah submit recyclable waste for
weighing and earn points; unit admins verify submissions and manage their
unit's catalog. Each waste-bank branch (`bank_sampah_units`) is an independent
tenant on one shared platform.

## Non-Negotiable Rules (violating these breaks the product, not just style)

1. **Tenancy is enforced server-side via `unit_id`, derived from the
   authenticated user's `user_roles` row — never from a client-supplied
   parameter or header.** If you're writing a query and the `unit_id` came
   from the request body/query string instead of the JWT-resolved session,
   that's a data-leak bug. Stop and fix it.
2. **There is exactly one status enum per entity.** `status_setoran` and
   `status_penukaran` are defined once in `SCHEMA.md`/the SQL DDL. Do not
   introduce a new spelling, casing, or synonym for a status value anywhere
   (API docs, frontend constants, tests). If you need a new status, add it to
   the enum in the schema first.
3. **Point totals are computed at verification, not at submission.**
   `detail_setor.berat_kg_estimasi` / the submission-time estimate is for
   nasabah UI only. `subtotal_poin` is null until an admin verifies. Never
   backfill a "final" total before verification happens.
4. **All list endpoints are paginated.** Do not add a list endpoint that
   returns an unbounded array. Use the `{ data, meta: { page, pageSize, total } }`
   envelope from `TRD.md`.
5. **Point-mutating writes (submit waste, redeem points) require idempotency
   key handling.** Do not implement these as fire-and-forget inserts.
6. **DTOs use one field name per concept across create/update/response for the
   same entity.** Do not introduce `namaLengkap` alongside an existing
   `namaNasabah` for the same field, or similar drift.
7. **Photo/file fields must go through real object storage**, not placeholder
   URLs. If you're stubbing this during early development, mark it clearly
   with a `// TODO(real-storage)` comment, don't ship a hardcoded image URL.

## Where Things Live
- `docs/PRD.md` — product scope, features, personas, success metrics, open product questions.
- `docs/TRD.md` — technical architecture, RBAC model, API conventions, non-functional requirements.
- `docs/SCHEMA.md` — table-by-table explanation of the data model and why it's shaped that way.
- `docs/ARCHITECTURE.md` — full system architecture, frontend/backend topology, data flows, and route maps.
- `docs/RULES.md` — coding conventions, service/controller boundaries, state management, and Git standards.
- `docs/DESIGN.md` — editorial & cinematic design tokens, photographic overlays, and scroll motion.
- `docs/SCRUM.md` — frontend agile backlog, epics, sprint breakdown, and acceptance criteria.
- `hijauin_schema_rbac.sql` — the actual DDL. This is the source of truth for table/column names.

## Tech Stack Reference
- **Backend (`hijauin-backend`)**: Laravel 13, PHP 8.2+, Laravel Sanctum (token auth), SQLite (dev) / PostgreSQL (prod).
- **Frontend (`hijauin-frontend`)**: Next.js 16 (App Router), React 19, TypeScript.
  - **State & Data Fetching**: `@tanstack/react-query` (server state), `zustand` (client/auth state), `axios` (HTTP client with interceptors).
  - **Validation & Forms**: `zod` (v4 schemas in `lib/schemas/`), `react-hook-form` + `@hookform/resolvers`.
  - **Cinematic Marketing (`(marketing)`)**: `lenis` (smooth scroll), `gsap` + `@gsap/react` (ScrollTrigger timelines), `three` + `@react-three/fiber` + `@react-three/drei` (WebGL particle field).
  - **Product UI (`(nasabah)`, `(admin)`)**: `framer-motion` (micro-interactions, page fade transitions, hover states).


## RBAC Quick Reference
- Roles live in `roles.code`: `nasabah`, `admin_unit`, `platform_ops` (future).
- A user's role assignment is scoped via `user_roles.unit_id` (null = global,
  used only by future `platform_ops`).
- Permission checks belong in one shared middleware/guard layer, not
  duplicated per controller. When adding a new protected action, add a
  `permissions` row and wire it into `role_permissions` — don't hardcode a
  role-name check (`if role == 'admin_unit'`) in business logic; check the
  permission code instead, so role/permission mapping stays data-driven.

## Known Historical Bugs (do not reintroduce)
These came out of reviewing an earlier version of this spec — they're listed
here so an agent doesn't accidentally recreate them while refactoring:
- Three different spellings of the same submission-status enum existing
  simultaneously across DB/API/docs.
- Estimated and final point totals for the same transaction disagreeing
  depending on which endpoint returned them.
- `login` returning HTTP `201`.
- An update DTO requiring a field (`tanggalLahir`) that didn't exist anywhere
  else in the system.
- No pagination on any list endpoint.
- Decorative placeholder photo URLs returned regardless of actual upload.

## Working Conventions
- Prefer small, reviewable changes over large refactors — flag schema changes
  explicitly since they cascade into `SCHEMA.md` and `TRD.md`.
- If a request conflicts with something in `PRD.md`/`TRD.md`/`SCHEMA.md`,
  say so explicitly rather than silently picking one interpretation.
- When adding an endpoint, follow the conventions in `TRD.md` §3 exactly
  (status codes, error envelope, pagination shape) rather than matching
  whatever the nearest existing endpoint happens to do, in case that endpoint
  predates these conventions.
