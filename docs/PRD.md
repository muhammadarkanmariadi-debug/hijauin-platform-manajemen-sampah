# PRD.md — Hijauin

## 1. Product Summary
Hijauin is a digital platform that lets waste-bank ("bank sampah") units digitize
their operations: nasabah (customers/members) submit recyclable waste for weighing,
earn points based on weight and material type, and redeem those points for goods
or vouchers. Admins run day-to-day operations for their unit — verifying
submissions, managing catalogs, and reporting.

Hijauin is multi-tenant: one platform instance serves many independent waste-bank
units, each with its own nasabah, categories, catalog, and reporting.

## 2. Problem Statement
Most waste banks in Indonesia run on paper ledgers or spreadsheets. This causes:
- No reliable audit trail between what a nasabah submits and what's actually paid out.
- Manual point calculation errors.
- No visibility for nasabah into their balance or submission status.
- No aggregate reporting for units (tonnage collected, payout estimates) or for
  local government/environmental partners who want collection data.

## 3. Goals
- Give nasabah self-service visibility into submissions, balance, and redemptions.
- Give unit admins a reliable verification and reporting workflow.
- Produce clean, exportable tonnage/payout data per unit per month.
- Support many independent units on one platform without data leakage between them.

### Non-goals (out of scope for v1)
- Payment processing / actual cash disbursement (points are tracked, not paid out, in v1).
- Logistics/pickup scheduling and routing.
- Public leaderboard or gamification beyond point balance.
- Cross-unit nasabah accounts (a nasabah belongs to exactly one unit in v1).

## 4. Users / Roles
| Role | Description |
|---|---|
| **Nasabah** | Individual or household submitting waste and redeeming points. |
| **Admin Unit** | Staff of a specific waste-bank branch; verifies submissions, manages that unit's catalog and nasabah. |
| **Platform Ops** *(future)* | Hijauin-side staff with cross-unit visibility for support and analytics. |

## 5. Features

### 5.1 Nasabah
1. Register an account under a specific unit.
2. Log in.
3. View waste categories with price/kg and points/kg for their unit.
4. Submit a waste drop-off request (multiple item types, estimated weight, date, notes).
5. Track submission status: `menunggu_konfirmasi → diverifikasi → selesai` or `ditolak`.
6. View point balance and submission history, filterable by month.
7. Redeem points for a catalog item/voucher.
8. View/print a receipt for both submissions and redemptions.

### 5.2 Admin Unit
1. Register their unit (onboarding).
2. Log in to the admin console.
3. Update unit profile (name, address, phone).
4. CRUD nasabah records for their unit.
5. CRUD waste categories and their point/price weighting.
6. CRUD reward catalog items.
7. Verify submissions: confirm, re-weigh, and set final status.
8. View all submission and redemption transactions, filterable by month.
9. View monthly recap: total tonnage collected and estimated payout, broken down by material type.

## 6. Success Metrics
- % of submissions that reach `selesai` within 48 hours of admin confirmation.
- Nasabah retention: % of nasabah who submit more than once within 30 days.
- Data integrity: 0 discrepancies between submitted item subtotals and unit-level monthly recap totals.
- Admin task time: average time to verify a submission.

## 7. Key Constraints & Assumptions
- Points are the unit's own currency; conversion rates (Rp/point) are set per unit, not platform-wide.
- A nasabah belongs to exactly one unit; an admin can be scoped to one or more units (see TRD.md).
- Photo upload is required for real product use (not decorative — see TRD.md file storage notes).

## 8. Open Questions
- Do redemptions need a delivery/pickup flow, or are all rewards self-collect at the unit? (Affects `penukaran_poin` schema — currently no fulfillment fields.)
- Should point-to-Rupiah conversion be shown to nasabah, or only internal to unit accounting?
- Multi-unit nasabah membership — is this ever needed, or is one-nasabah-one-unit a permanent constraint?
