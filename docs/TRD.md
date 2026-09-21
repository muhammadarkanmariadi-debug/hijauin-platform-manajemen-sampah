# TRD.md — Hijauin Technical Requirements

Companion to `PRD.md` (what to build) and `SCHEMA.md` (data layer). This document
covers architecture, API conventions, and non-functional requirements.

## 1. Architecture Overview

```
[Nasabah Web/Mobile] ─┐
                       ├──> [REST API] ──> [PostgreSQL]
[Admin Web Console] ───┘         │
                                  └──> [Object storage] (photos)
```

- Single backend API (Laravel 13) serves both nasabah-facing and admin-facing clients.
- Multi-tenancy is enforced at the data layer via `unit_id`, not via a separate
  tenant-key header. Tenant scope is derived from the authenticated user's role
  assignment (see `user_roles.unit_id` in SCHEMA.md), not passed by the client.
- No client should ever be able to pass an arbitrary `unit_id` and get another
  unit's data — this must be enforced server-side, every request, from the authenticated token session.

### 1.1 Frontend Client Architecture
- Framework: Next.js 16 (App Router), React 19, TypeScript.
- Data Fetching & Server Cache: TanStack React Query (`@tanstack/react-query`) with automatic cache invalidation and query keys.
- Client State: Zustand (`useAuthStore`) with localStorage persistence for token management.
- HTTP Client: Axios with request interceptor (attaches `Bearer <token>`) and response interceptor (standardizes errors to `ApiError`).
- Form Management & Validation: `react-hook-form` integrated with `zod` schemas (`lib/schemas/`).
- Motion & Visuals:
  - Awareness / Marketing (`(marketing)`): Lenis smooth scrolling, GSAP ScrollTrigger timelines, Three.js / React Three Fiber particle field.
  - Dashboard UI (`(nasabah)`, `(admin)`): Framer Motion for subtle micro-interactions (page transitions, card hover).

## 2. Auth & RBAC

- Auth: Laravel Sanctum bearer tokens issued on login (`POST /auth/login`). Token represents the authenticated user session; roles/permissions are looked up server-side per request (via `user_roles` and `role_permissions`), so permission changes take effect immediately without requiring re-login.
- RBAC model: `users → user_roles → roles → role_permissions → permissions`
  (see SCHEMA.md for full DDL). A user's effective permissions for a request are
  the union of permissions across all roles they hold, scoped to the relevant
  `unit_id` where applicable.
- Every admin-scoped endpoint must resolve `unit_id` from `user_roles`, not from
  a request parameter or header.
- Permission checks happen in middleware (`CheckPermission`), not scattered in controllers — one
  place to audit "who can do what."

## 3. API Design Conventions

These conventions were established after reviewing an earlier spec that had
inconsistent enums, field names, and status codes across endpoints (see review
notes). All new endpoints must follow these:

- **Status codes**: `200` for reads/updates, `201` only for actual resource
  creation, `204` for deletes with no body. Login/auth actions return `200`, not `201`.
- **One canonical status enum per entity**, defined once and reused everywhere
  (docs, DB, API responses). No entity should have narrative-doc status names
  that differ from DB enum values.
- **Consistent DTO field names** across create/update/response for the same
  entity — no `namaLengkap` on update vs `namaNasabah` on create for the same field.
- **Pagination required** on all list endpoints from day one:
  `?page=&pageSize=`, response includes `{ data, meta: { page, pageSize, total } }`.
- **Standard error envelope**, including realistic field-level validation errors:
  ```json
  {
    "statusCode": 422,
    "success": false,
    "message": "Validation failed",
    "errors": [
      { "field": "beratKg", "message": "must be greater than 0" }
    ],
    "timestamp": "2026-09-15T00:00:00.000Z"
  }
  ```
- **Idempotency**: any point-mutating POST (submit waste, redeem points) accepts
  an `Idempotency-Key` header; the server must reject/replay-safe duplicate keys
  rather than double-processing. This was a gap in the earlier spec and is a
  hard requirement now, given mobile clients on unreliable connections.
- **Optimistic concurrency on stock**: redeeming a catalog item decrements stock
  inside the same transaction as the status check (`SELECT ... FOR UPDATE` or
  equivalent) to prevent overselling limited rewards.

## 4. Key Business Logic Rules

- **Point calculation happens once, at verification, not at submission.**
  Submission stores *estimated* weight/points for nasabah visibility; the
  authoritative subtotal is computed only when an admin verifies and records
  real weight. This fixes a bug class found in the earlier spec where estimated
  and final totals disagreed across endpoints.
- **Partial verification**: the verify endpoint must support per-item outcomes
  (accept item A, reject item B within the same submission), not just one
  status for the whole submission.
- **Redemption requires sufficient balance at time of redemption**, checked and
  decremented atomically with the points debit.

## 5. Non-Functional Requirements

- **Multi-tenancy isolation**: automated tests must assert that a user scoped
  to Unit A can never read or write Unit B's data, for every endpoint.
- **File storage**: uploaded photos (nasabah profile, waste category, reward
  catalog) go to real object storage (e.g., S3-compatible) with generated URLs —
  not hardcoded placeholder images. Validate file type/size server-side.
- **Auditability**: every status change on `setor_sampah` and `penukaran_poin`
  should be logged with who changed it and when (consider an `audit_log` table
  if not already covered by `verified_by_user_id`).
- **Performance**: list/report endpoints should support the data volumes of a
  multi-unit platform, not just a single unit's demo data — hence pagination
  and indexed `unit_id`/`tanggal` columns are mandatory, not optional.

## 6. Deployment Notes
- Environment config (DB connection, JWT secret, object storage credentials)
  via environment variables, never committed.
- Migrations are additive/versioned; do not hand-edit schema in production —
  see SCHEMA.md for the source of truth DDL.

## 7. Open Technical Risks
- Point-to-Rupiah conversion consistency if a unit changes its rate mid-month
  (affects recap accuracy for in-flight submissions).
- Whether `platform_ops` role needs read access across all units for support —
  if so, this must be an explicit permission, not a bypass of `unit_id` scoping.
