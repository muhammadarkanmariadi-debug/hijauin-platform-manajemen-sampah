# SCHEMA.md — Hijauin Data Model

Source of truth DDL: `hijauin_schema_rbac.sql`. This document explains the
tables, relationships, and *why* they're shaped this way — read this before
modifying the schema.

## 1. Entity Overview

```
users ──< user_roles >── roles ──< role_permissions >── permissions
  │             │
  │             └── unit_id (nullable) ──> bank_sampah_units
  │
  └──< nasabah_profiles >── unit_id ──> bank_sampah_units

bank_sampah_units ──< kategori_sampah
bank_sampah_units ──< hadiah

nasabah_profiles ──< setor_sampah ──< detail_setor >── kategori_sampah
nasabah_profiles ──< penukaran_poin >── hadiah
```

## 2. Table Reference

### `users`
One row per person, regardless of role. Common fields (`full_name`, `phone`,
`photo_url`) live here so they are never duplicated per role — this replaced
the earlier design where `nasabah` and `admin_bank` each stored their own copy
of phone/photo.

### `roles`, `permissions`, `role_permissions`
Standard RBAC. `roles.code` is the stable identifier code should check against
(`nasabah`, `admin_unit`, `platform_ops`), not the numeric `id`. Add new
permissions here rather than adding boolean flags to `users`.

### `user_roles`
Junction table binding a user to a role, optionally scoped to a `unit_id`.
- Nasabah role: `unit_id` is set (which unit they belong to).
- Admin role: `unit_id` is set (which unit they administer).
- Future `platform_ops` role: `unit_id` is NULL — global scope, gated entirely
  by permission checks, not by unit membership.

This table is why a user *can* hold multiple roles (e.g., an admin who is also
a nasabah at their own unit) without schema changes.

### `bank_sampah_units`
The tenant/organization entity — a physical waste-bank branch. Replaces the
exam spec's `admin_bank` (which incorrectly modeled "the unit" as a 1:1
attribute of a single admin user) and replaces the "App Maker" app-key
mechanism entirely; tenancy is now a real, permanent business concept instead
of exam-grading scaffolding.

### `nasabah_profiles`
Role-specific fields only: `alamat`, `saldo_poin`. Everything person-level
(name, phone, photo) is on `users`. One nasabah profile belongs to exactly one
unit (`unit_id NOT NULL`), matching the PRD v1 constraint that nasabah don't
span multiple units.

### `kategori_sampah`
Master data of waste material types, **scoped per unit** (`unit_id`) since
price/point rates are set independently by each waste bank. `jenis` is a fixed
enum (`plastik`, `kertas`, `logam`, `kaca`) — extend via migration, not by
loosening the type to a free-text string.

### `setor_sampah` / `detail_setor`
- `setor_sampah` is the submission header: status, dates, notes, and who
  verified it (`verified_by_user_id`).
- `detail_setor` is the line-item table: one row per waste category in a
  submission, holding both `berat_kg_estimasi` (set at submission) and
  `berat_kg_real` / `subtotal_poin` (set only at verification).
- **Do not compute `subtotal_poin` at submission time.** This was the root
  cause of the "totals disagree across endpoints" bug found in the spec
  review — estimated and final numbers must stay in clearly separate columns.

Status values are the single canonical enum `status_setoran`:
`menunggu_konfirmasi | diverifikasi | selesai | ditolak`. This is the only
place this enum is defined — API docs and frontend code must reference these
exact string values, not a re-typed equivalent.

### `hadiah`
Reward/voucher catalog, scoped per unit (`unit_id`). `stok` must be decremented
transactionally on redemption (see TRD.md §3 on concurrency).

### `penukaran_poin`
Redemption transactions. `idempotency_key` is unique and required by the API
layer to prevent double-redemption on client retry (see TRD.md §3).
Status enum `status_penukaran`: `diproses | selesai | dibatalkan`.

## 3. Deliberately Removed / Not Carried Over
| Exam-spec concept | Status | Reason |
|---|---|---|
| `x-app-key` / "App Maker" tenant table | Removed | Was exam-grading isolation, not a real product concept — replaced by `unit_id` scoping via `user_roles`. |
| `users.role` enum column | Removed | Replaced by `user_roles` join table for multi-role and unit-scoped support. |
| Duplicate `telp`/`foto` on `nasabah`/`admin_bank` | Removed | Consolidated onto `users`. |
| Three conflicting status vocabularies | Collapsed to one enum | See `status_setoran` above. |

## 4. Migration Notes
- `bank_sampah_units` must be created before `user_roles` (FK dependency) —
  see comment in the SQL file if using a tool that doesn't resolve ordering
  automatically.
- Any new role-specific profile fields belong on that role's profile table
  (e.g., `nasabah_profiles`), not on `users` — keep `users` role-agnostic.
- Any new enum value must be added in exactly one place and reflected in
  TRD.md's API conventions section, not redefined per consumer.

## 5. Indexing Guidance (not yet in DDL — add before production load)
- `setor_sampah(unit_id, tanggal)` via join to `nasabah_profiles` — for monthly
  recap queries.
- `nasabah_profiles(unit_id)`.
- `kategori_sampah(unit_id)`, `hadiah(unit_id)`.
- `user_roles(user_id)`, `user_roles(unit_id)`.
