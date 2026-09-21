# RULES.md — Coding Conventions & Standards for Hijauin

This document defines the development rules, architectural conventions, and code standards for the Hijauin monorepo. Every contributor and AI agent must adhere to these rules.

---

## 1. Golden Rules (Non-Negotiable)

1. **Multi-Tenancy Isolation (`unit_id`)**:
   - Every tenant data access must be scoped to the authenticated user's `unit_id`.
   - Never trust client-supplied `unit_id` parameters in request bodies, query strings, or headers for tenant scoping.
   - On the backend, rely on `ResolveUnitScope` middleware which attaches `unit_id` from the resolved user role to `$request->attributes`.
   - On the frontend, do not allow switching units without backend authorization.

2. **Single Source of Truth for Enums**:
   - Statuses and types are defined once in backend PHP Enums (`app/Enums/`):
     - `StatusSetoran`: `draft`, `submitted`, `in_review`, `verified`, `rejected`, `cancelled`
     - `StatusPenukaran`: `pending`, `ready`, `completed`, `cancelled`
     - `JenisSampah`: `plastik`, `kertas`, `logam`, `kaca`
   - Frontend mirrors these in `lib/constants.ts` and `lib/types.ts`. Never introduce alternate spellings, casing, or aliases (e.g. do not use `menunggu`, `selesai`, or `CONFIRMED` in API envelopes or state).

3. **Points Computation at Verification Only**:
   - During initial submission (`POST /nasabah/setorans`), `berat_kg_estimasi` is recorded for nasabah reference only. `subtotal_poin` and `subtotal_rp` are `null`.
   - Points are calculated and awarded **only** when an `admin_unit` verifies actual weights (`POST /admin/setorans/{id}/verify`).
   - Never credit points prior to verification.

4. **Idempotency for Mutating Writes**:
   - Financial/point mutations (`POST /nasabah/setorans` and `POST /nasabah/penukarans`) require an `Idempotency-Key` HTTP header (UUID v4).
   - Backend checks and caches transactions by key to prevent double-crediting or double-redemption on network retries.

5. **Paginated List Responses**:
   - Unbounded list endpoints are forbidden.
   - All collection responses must follow the envelope:
     ```json
     {
       "data": [...],
       "meta": {
         "page": 1,
         "pageSize": 15,
         "total": 42
       }
     }
     ```

---

## 2. Backend Conventions (Laravel 13)

### 2.1 File Organization & Responsibilities

```
app/
├── Http/
│   ├── Controllers/       ← Thin: validate request, delegate to Service, return Resource
│   ├── Requests/          ← Form Request classes containing rules() and messages()
│   ├── Resources/         ← JsonResource transformers (exact API contract)
│   └── Middleware/        ← Cross-cutting concerns (Auth, Tenancy, Permissions)
├── Services/              ← Business logic, transactions, points calculation
├── Models/                ← Eloquent models: relationships, scopes, casts (no heavy business logic)
├── Enums/                 ← Pure PHP backed enums (string)
└── Traits/                ← Reusable traits (ApiResponse)
```

### 2.2 Controllers vs Services
- **Controllers**:
  - Max 30–50 lines per method.
  - Do NOT execute raw DB transactions or point computations inside controller methods.
  - Inject the corresponding Service class.
  - Return responses using `ApiResponse` trait: `return $this->success($data, $message, $code)` or `return $this->paginated(...)`.

- **Services**:
  - Encapsulate write operations within `DB::transaction(...)`.
  - Handle domain event dispatching and ledger updates.
  - Throw domain-specific exceptions (`ValidationException`, `InsufficientPointsException`, etc.) caught by the exception handler.

### 2.3 Form Requests
- Every `POST`, `PUT`, `PATCH` endpoint must have a dedicated `FormRequest` class in `app/Http/Requests/`.
- Validation messages must be provided in Indonesian.
- Use PHP Enums in rules: `Rule::enum(StatusSetoran::class)`.

### 2.4 Models & Database
- Foreign keys must always have indexes and cascade constraints matching `SCHEMA.md`.
- Soft deletes (`use SoftDeletes`) must be used for recoverable records (`nasabah_profiles`, `kategori_sampahs`, `hadiahs`).
- Cast enum columns to their respective PHP enum classes (`protected function casts(): array { return ['status' => StatusSetoran::class]; }`).
- Scope queries by tenant using Eloquent local scopes: `scopeForUnit($query, int $unitId)`.

---

## 3. Frontend Conventions (Next.js 16 TypeScript)

### 3.1 Architecture Layers

```
hijauin-frontend/
├── app/
│   ├── (marketing)/       ← Public awareness site: Lenis, GSAP, WebGL
│   ├── (auth)/            ← Auth flows: login, register
│   ├── (nasabah)/         ← Nasabah portal: dashboard, setorans, penukarans, profil
│   └── (admin)/admin/     ← Admin portal: /admin/dashboard, /admin/setorans, etc.
├── components/
│   ├── ui/                ← Generic primitives (Button, Input, Badge, Card, Modal)
│   ├── domain/            ← Domain-specific components (PointBalanceCard, SetoranStatusBadge)
│   └── marketing/         ← Cinematic & WebGL components (ParticleField, LenisProvider)
└── lib/
    ├── api.ts             ← Axios instance with interceptors
    ├── auth.ts            ← Zustand store for auth state & token persistence
    ├── constants.ts       ← Design tokens, status definitions, categories
    ├── types.ts           ← TypeScript DTO definitions (mirrors backend)
    ├── schemas/           ← Zod validation schemas
    └── queries/           ← TanStack Query hooks (queries & mutations)
```

### 3.2 State Management & Data Fetching
- **Server State**: Always use TanStack React Query (`@tanstack/react-query`).
  - Queries belong in `lib/queries/*.queries.ts`.
  - Query keys must follow hierarchical arrays: `['setorans', { page, pageSize }]`, `['admin', 'nasabahs', id]`.
  - Mutations must invalidate affected query keys in `onSuccess`.
- **Client / Session State**: Use Zustand (`useAuthStore`).
  - Persist tokens via `persist` middleware in `localStorage`.
  - Do NOT store large server data sets in Zustand; let TanStack Query handle server caching.
- **Forms**: Use `react-hook-form` paired with `@hookform/resolvers/zod` and Zod schemas from `lib/schemas/`.

### 3.3 Motion & Animation Guidelines
- **Cinematic / Marketing (`app/(marketing)`)**:
  - Use Lenis for smooth scroll, synced with GSAP ticker (`gsap.ticker.add`).
  - Use GSAP ScrollTrigger for narrative scroll sequences.
  - Three.js / R3F is reserved for the marketing hero and data visualization; always provide graceful fallbacks if WebGL is unsupported.
  - Respect `prefers-reduced-motion` at all times.
- **Product UI (`app/(nasabah)`, `app/(admin)`)**:
  - Never use heavy scroll-jacking or full-screen WebGL in dashboards.
  - Use lightweight Framer Motion (`framer-motion`) only for subtle micro-interactions:
    - Page fade/slide-in transitions (<= 200ms)
    - Hover scale/shifts on actionable cards/buttons (<= 150ms)
    - Dropdown / modal mount/unmount animations

### 3.4 TypeScript Conventions
- Strict mode is enabled (`"strict": true`).
- Do not use `any`. Use `unknown` with type narrowing or define explicit interfaces.
- Component props must be typed using `interface Props` or type aliases.

---

## 4. API Envelope & Error Handling

### 4.1 Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Operasi berhasil"
}
```

### 4.2 Error Envelope
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "email": ["Format email tidak valid"]
  }
}
```
HTTP status codes must be semantically accurate:
- `200 OK` — Standard read/update success
- `201 Created` — Resource created (e.g. `POST /nasabah/setorans`)
- `400 Bad Request` — Client semantic error
- `401 Unauthorized` — Missing or expired token
- `403 Forbidden` — Valid token, but lacks required permission or tenant scope
- `404 Not Found` — Resource not found
- `422 Unprocessable Entity` — Form validation errors

---

## 5. Git & Workflow Standards

### 5.1 Commit Message Format
Follow Conventional Commits:
- `feat(domain)`: New feature (e.g. `feat(nasabah): add waste submission flow`)
- `fix(scope)`: Bug fix (e.g. `fix(auth): correct token refresh interceptor`)
- `refactor(scope)`: Code refactoring without behavior change
- `docs(scope)`: Documentation updates
- `test(scope)`: Adding or updating tests

### 5.2 Code Review Checklist
- [ ] Multi-tenancy check: is `unit_id` server-resolved?
- [ ] Validation check: are all inputs validated by FormRequest/Zod?
- [ ] No hardcoded role strings in business logic (use permissions).
- [ ] Error handling matches standard envelope.
- [ ] Types are shared and consistent across frontend and backend.
