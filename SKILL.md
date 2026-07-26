---
# SKILL: Hijauin Project Context

## 1. Ringkasan Arsitektur
- **Frontend**: Next.js 14+ (App Router) menggunakan TypeScript. Terletak di folder `/frontend`. Command run: `npm run dev`.
- **Backend**: Laravel 11.x (PHP 8.2+). Terletak di folder `/backend`.
- **Konsep Repository**: Full-stack codebase dipisah dalam folder `frontend` dan `backend` pada root directory.

## 2. Konvensi Backend (Laravel)
- **Auth**: Menggunakan JWT Authentication (`tymon/jwt-auth`). Token diproses lewat `Authenticate` middleware.
- **Routing**: API tersentralisasi di `routes/api.php` dan dilindungi oleh `RoleMiddleware` dengan prefix group yang rapi (`/customer`, `/petugas`, `/admin`, `/partner`).
- **Controller Pattern**: Ditempatkan dalam `app/Http/Controllers/Api/`. Menggunakan pola resource controller (`apiResource`).
- **Models & Relasi Utama**: 
  - `User`, `Order`, `Address`, `Report`, `Review`, `Subscription`, `WasteType`, `HijauPoint`, `EducationalContent`, `PaymentTransaction`. 
  - Menggunakan Soft Deletes dan relasi Polymorphic (contohnya di `HijauPoint` dan `PaymentTransaction`).
- **Response Format**: Menggunakan standar format JSON `response()->json(['success' => boolean, 'data' => mixed, 'message' => string])`.
- **Endpoint Aktif**: CRUD Orders, Auth (Login/Register/Profile), Addresses, Subscriptions, Tasks (Petugas), dan Admin dashboard/CMS (seluruhnya MVP BE sudah rampung 100%).

## 3. Konvensi Frontend (Next.js)
- **Routing**: Menggunakan App Router (`app/`). Folder membedakan rute publik (`/`), auth (`/auth/login`), dan protected dashboard (`/dashboard/[role]/`).
- **State Management & Auth**: Menggunakan React Context API (`AuthContext.tsx`). Token JWT dan object `user` disimpan di `localStorage`.
- **Data Fetching**: Dikelola secara terpusat melalui service layer (`services/api.service.ts`) menggunakan Axios/native fetch.
- **Struktur Komponen**: Reusable komponen UI ditaruh di `/app/components/`.

## 4. Base Style Guide (WAJIB Diikuti untuk Komponen Baru)
- **Styling Engine**: Tailwind CSS v4 (`@tailwindcss/postcss`). Menggunakan utilitas standar Tailwind tanpa library komponen tambahan seperti Shadcn atau MUI sejauh ini.
- **Warna Brand**: Hijauin Core (`green-50` to `green-900`).
- **Status Colors Mapping**: 
  - Menunggu (`yellow`), Dijadwalkan (`blue`), Dalam Perjalanan (`purple`), Terkumpul (`indigo`), Selesai (`green`), Dibatalkan/Gagal (`red`).
- **Reference Style Pages**: 
  - *Navbar Desktop/Mobile*: Lihat `/app/components/Navbar.tsx` (Logic max-width dinamis `max-w-7xl` ke `max-w-[1500px]` dengan shadow lg pada saat scroll).
  - *Landing Page*: Lihat `/app/components/Hero.tsx` dan `page.tsx` root.
- **Daftar Komponen Reusable yang Tersedia**: `Navbar.tsx`, `Footer.tsx`, `Hero.tsx`, `LiveLocation.tsx`, `Fitur.tsx` (Semua ada di `/app/components/`). *Jangan membuat duplikat form atau card sebelum memeriksa folder ini.*

## 5. Role & Akses
Sistem ini membedakan 4 role (Customer, Petugas, Admin, Partner):
- **Di Backend**: Dipisah dengan middleware `role:customer`, `role:petugas`, `role:admin`, `role:partner`.
- **Di Frontend**: Dipecah menjadi dashboard yang berbeda, misal `/dashboard/customer/`, `/dashboard/petugas/`, `/dashboard/admin/`. Redirect dilakukan di dalam `AuthContext.tsx` saat login berhasil.
- **Customer**: Order jemput sampah, berlangganan, lapor, kumpul poin.
- **Petugas**: Terima order di zonanya, kelola status pickup, upload foto bukti pickup.
- **Admin**: Dashboard monitor dan kelola data master.

## 6. Status Fitur vs Dokumen Produk
*(Mengacu dari `frontend/PAGES_STRUCTURE.md` & `backend/PROJECT_STATUS.md`)*

| Fitur / Halaman | Backend (API) | Frontend (UI) |
|---|---|---|
| **Auth (Login/Register)** | ✅ Sudah (JWT) | ✅ Sudah |
| **Customer: Create Order** | ✅ Sudah | ✅ Sudah |
| **Customer: Order History / Detail** | ✅ Sudah | ❌ Belum (TODO) |
| **Customer: Address, Report, Subscriptions** | ✅ Sudah | ❌ Belum (TODO) |
| **Petugas: Dashboard & Tasks Action** | ✅ Sudah | ❌ Belum (TODO) |
| **Admin: Semua Fitur Dashboard & CMS** | ✅ Sudah 100% | ❌ Belum (TODO) |
| **Educational & Public Pages** | ✅ Sudah | ⚠️ Sebagian |

## 7. Catatan Teknis Lain
- **Maps**: FE menggunakan library `leaflet` dan `react-leaflet` (kemungkinan dipakai di komponen `LiveLocation.tsx` dan create address).
- **Icons**: FE memakai `@fortawesome/react-fontawesome` dan `lucide-react`.
- **Business Logic Khusus (Backend)**: Backend sudah memiliki algoritma auto-assignment petugas berdasarkan zona dan workload secara otomatis, sehingga FE hanya perlu call API tanpa perlu logika kompleks untuk assign order di sisi customer.
---
