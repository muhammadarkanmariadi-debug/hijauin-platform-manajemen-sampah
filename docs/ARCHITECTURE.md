# ARCHITECTURE.md — Hijauin Technical Architecture

This document describes the current implementation architecture. For *what*
we're building, see `PRD.md`. For API conventions and business rules, see
`TRD.md`. For the data model, see `SCHEMA.md`.

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────┐
│                    Clients                           │
├──────────────────────┬──────────────────────────────┤
│  (marketing)         │  (nasabah) / (admin)          │
│  Editorial & Cinema  │  Product dashboards           │
│  Lenis + GSAP        │  Framer Motion                │
│  ScrollTrigger       │  (micro-animations only)      │
│  Image Overlays      │  Client Components            │
└──────────┬───────────┴──────────┬───────────────────┘
           │                      │
           │   Axios TanStack   │
           │   React Query        │
           └──────────┬───────────┘
                      │
              ┌───────▼────────┐
              │   REST API     │
              │   Laravel 13   │
              │   Sanctum      │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │   SQLite (dev) │
              │   PostgreSQL   │
              │   (production) │
              └────────────────┘
```

---

## 2. Repository Structure

```
Hijauinv2/                          ← Monorepo root
├── AGENT.md                         Agent context (read-first for AI)
├── package.json                     Root dev scripts (npm run dev)
├── .gitignore                       Covers both sub-projects
├── docs/
│   ├── PRD.md                       Product requirements
│   ├── TRD.md                       Technical requirements & API conventions
│   ├── SCHEMA.md                    Data model reference
│   ├── DESIGN.md                    Editorial & cinematic design tokens & motion
│   ├── ARCHITECTURE.md              ← This file
│   ├── RULES.md                     Coding conventions
│   └── SCRUM.md                     Frontend agile revision backlog & stories
│
├── hijauin-backend/                 Laravel 13
│   ├── app/
│   │   ├── Console/Commands/        Artisan commands (make:domain)
│   │   ├── Enums/                   Status/type enums (single source of truth)
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Auth/            Login, register, me, logout
│   │   │   │   ├── Nasabah/         Setoran, penukaran, profil
│   │   │   │   └── Admin/           Nasabah CRUD, kategori, hadiah, verifikasi, rekap
│   │   │   ├── Middleware/          ResolveUnitScope, CheckPermission
│   │   │   ├── Requests/            Form request validation (per endpoint)
│   │   │   └── Resources/           API resource transformers (response DTOs)
│   │   ├── Models/                  Eloquent models (1 per SCHEMA table)
│   │   ├── Services/                Business logic (setoran, penukaran, points)
│   │   ├── Traits/                  ApiResponse envelope
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/              Schema in FK-dependency order
│   │   └── seeders/                 RbacSeeder (roles + permissions)
│   ├── routes/
│   │   ├── api.php                  All API routes (31 endpoints)
│   │   └── web.php                  Web routes (minimal)
│   └── bootstrap/app.php           Middleware registration
│
└── hijauin-frontend/                Next.js 16 (App Router)
    ├── app/
    │   ├── (marketing)/             Cinematic awareness site
    │   ├── (auth)/                  Login, register
    │   ├── (nasabah)/               Nasabah dashboard
    │   ├── (admin)/                 Admin console
    │   ├── layout.tsx               Root layout (QueryProvider)
    │   └── page.tsx                 → re-exports (marketing)/page
    ├── components/
    │   ├── ui/                      Generic primitives (Button, Input, Badge, Card, Pagination)
    │   ├── domain/                  Domain composites (SetoranStatusBadge, PointBalanceCard, KategoriIcon)
    │   └── marketing/               Cinematic components (LenisProvider, ParticleField)
    └── lib/
        ├── api.ts                   Axios client with auth interceptor
        ├── auth.ts                  Zustand auth store
        ├── constants.ts             Status labels, material colors
        ├── types.ts                 TypeScript interfaces (mirrors backend)
        ├── providers.tsx            QueryProvider (TanStack React Query)
        ├── schemas/                 Zod validation schemas
        │   ├── auth.schema.ts
        │   ├── setoran.schema.ts
        │   ├── penukaran.schema.ts
        │   └── admin.schema.ts
        └── queries/                 TanStack Query hooks
            ├── auth.queries.ts
            ├── setoran.queries.ts
            ├── penukaran.queries.ts
            └── admin.queries.ts
```

---

## 3. Frontend Stack

| Library | Role | Used In |
|---|---|---|
| **Next.js 16** | Framework, App Router, SSR | Everywhere |
| **TypeScript** | Type safety | Everywhere |
| **Tailwind CSS 4** | Styling | Everywhere |
| **Axios** | HTTP client with interceptors | `lib/api.ts` |
| **Zustand** | Auth state management | `lib/auth.ts` |
| **TanStack React Query** | Server state, caching, mutations | `lib/queries/` |
| **Zod** | Schema validation | `lib/schemas/` |
| **React Hook Form** | Form state + Zod resolver | All form pages |
| **Framer Motion** | Product UI micro-animations | `(nasabah)`, `(admin)` layouts/pages |
| **GSAP + ScrollTrigger** | Scroll-driven cinematic motion | `(marketing)` only |
| **Lenis** | Smooth scroll | `(marketing)` only |
| **Three.js + R3F** | WebGL particle scenes | `(marketing)` hero/crisis only |

### Separation: Marketing vs Product UI

The cinematic marketing site and the product dashboards share **color tokens
and typography** but have completely different motion systems:

- **Marketing**: Lenis smooth scroll → GSAP ScrollTrigger → Three.js WebGL.
  Heavy, immersive, scroll-driven. Code-split from product bundle.
- **Product UI**: Framer Motion only. Short (150–200ms) state transitions
  (hover, expand, page enter). No scroll hijacking.

This separation is enforced by the route group structure — `(marketing)/layout.tsx`
wraps with `LenisProvider`, the other layouts do not.

---

## 4. Backend Stack

| Library | Role |
|---|---|
| **Laravel 13** | Framework |
| **PHP 8.3** | Language (backed enums, typed properties) |
| **Sanctum** | API token auth (Bearer tokens) |
| **SQLite** (dev) / **PostgreSQL** (prod) | Database |

---

## 5. Data Flow

### Auth Flow
```
Client                    API                         DB
  │                        │                           │
  ├──POST /auth/login────►│                           │
  │  { email, password }   ├──verify credentials─────►│
  │                        │◄─user row────────────────┤
  │                        ├──create Sanctum token────►│
  │◄─{ user, token }──────┤                           │
  │                        │                           │
  │  (stores token in      │                           │
  │   localStorage via     │                           │
  │   Zustand persist)     │                           │
  │                        │                           │
  ├──GET /auth/me────────►│                           │
  │  Authorization: Bearer ├──lookup user + roles─────►│
  │◄─{ user, roles }──────┤                           │
```

### Unit-Scoped Request Flow (AGENT.md Rule #1)
```
Client                    Middleware                   Controller
  │                        │                           │
  ├──GET /api/nasabah/*──►│                           │
  │  Bearer token          ├──ResolveUnitScope         │
  │                        │  1. Get user from JWT     │
  │                        │  2. Lookup user_roles     │
  │                        │  3. Extract unit_id       │
  │                        │  4. Merge into request    │
  │                        ├──$request->unit_id───────►│
  │                        │                           ├──Query with unit_id
  │◄─{ data, meta }───────┤◄──────────────────────────┤
```

### Verification Flow (AGENT.md Rule #3)
```
Admin verifies submission:

1. Admin hits POST /admin/setorans/{id}/verify
   with per-item outcomes: { items: [{ detail_setor_id, berat_kg_real, accepted }] }

2. SetoranService.verify() runs in a DB transaction:
   - For each accepted item: sets berat_kg_real + computes subtotal_poin
   - For rejected items: sets berat_kg_real=0, subtotal_poin=0
   - Updates submission status (selesai or ditolak)
   - Credits nasabah's saldo_poin with total earned points

3. Points are ONLY computed here, never at submission time.
```

### Redemption Flow (TRD §3 Concurrency)
```
Nasabah redeems points:

1. Client sends POST /nasabah/penukarans
   with Idempotency-Key header (auto-generated by useCreatePenukaran hook)

2. Controller checks for replay (existing idempotency_key → return cached)

3. PenukaranService.redeem() runs in a DB transaction:
   - SELECT ... FOR UPDATE on hadiah row (lock stock)
   - SELECT ... FOR UPDATE on nasabah_profile row (lock balance)
   - Verify: balance >= poin_diperlukan AND stok > 0
   - Atomic decrement of both
   - Create penukaran_poin record

4. TanStack Query invalidates both ['penukarans'] and ['auth', 'me']
   so the UI reflects the new balance immediately.
```

---

## 6. RBAC Model

```
users ──< user_roles >── roles ──< role_permissions >── permissions
              │
              └── unit_id (nullable) ──> bank_sampah_units
```

- **Permission checks happen in middleware**, not in controllers.
- Route-level: `->middleware('permission:verify_setoran')`
- Unit scoping: `->middleware('unit.scope')` resolves `unit_id` from JWT.
- Controllers read `$request->unit_id` — they never accept it from client input.

---

## 7. TanStack Query Key Convention

Consistent key structure for cache invalidation:

| Key Pattern | Used By |
|---|---|
| `['auth', 'me']` | Current user |
| `['setorans', { page, pageSize }]` | Nasabah submission list |
| `['setorans', id]` | Single submission |
| `['penukarans', { page, pageSize }]` | Nasabah redemption list |
| `['admin', 'nasabahs', { page, pageSize }]` | Admin nasabah list |
| `['admin', 'kategoris', { page, pageSize }]` | Admin kategori list |
| `['admin', 'hadiahs', { page, pageSize }]` | Admin hadiah list |
| `['admin', 'setorans', { page, pageSize }]` | Admin verification queue |
| `['admin', 'setorans', id]` | Single submission (admin) |
| `['admin', 'rekap', { month, year }]` | Monthly recap |
