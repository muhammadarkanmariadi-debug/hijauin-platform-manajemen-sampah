# 📖 Dokumentasi API Hijauin v2 (Swagger & OpenAPI 3.0)

Selamat datang di Dokumentasi Resmi RESTful API **Hijauin v2** — Platform Manajemen Bank Sampah Digital Multi-Unit Terintegrasi.

---

## 🚀 Mengakses Swagger UI Interaktif

Dokumentasi API interaktif dapat diakses langsung melalui peramban (browser) saat server backend berjalan:

| Layanan | URL Akses | Deskripsi |
| :--- | :--- | :--- |
| **Swagger UI Interaktif** | `http://localhost:8000/api/documentation` | Tampilan visual interaktif untuk mencoba semua endpoint |
| **OpenAPI 3.0 JSON Spec** | `http://localhost:8000/docs/api-docs.json` | Dokumen spesifikasi format OpenAPI JSON |
| **OpenAPI 3.0 YAML Spec** | `http://localhost:8000/docs/api-docs.yaml` | Dokumen spesifikasi format OpenAPI YAML |

> [!NOTE]
> Pastikan backend Laravel berjalan dengan menjalankan perintah `php artisan serve` pada direktori `hijauin-backend`.

---

## 🔐 Panduan Otentikasi (Bearer Token Sanctum)

Hampir seluruh endpoint operasional (Nasabah, Admin Unit, Petugas, dan Platform Ops) dilindungi oleh middleware `auth:sanctum` dan `unit.scope`.

### Langkah Melakukan Otentikasi di Swagger UI:
1. Jalankan endpoint **`POST /api/auth/login`** atau **`POST /api/auth/register`** di Swagger UI.
2. Salin nilai token dari respons JSON (contoh: `1|2zYwXYZabc123456...`).
3. Klik tombol **`Authorize` 🔓** di bagian kanan atas Swagger UI.
4. Pada kolom `bearerAuth (http, Bearer)`, masukkan token Anda.
5. Klik **`Authorize`** lalu **`Close`**. Semua permintaan selanjutnya akan secara otomatis menyertakan header `Authorization: Bearer <token>`.

---

## 📑 Ringkasan Kelompok Endpoint (API Index)

### 1. 🔑 Otentikasi (`Auth`)
- `POST /api/auth/register` — Registrasi akun baru (Nasabah, Admin Unit, atau Petugas) beserta penetapan unit bank sampah.
- `POST /api/auth/login` — Otentikasi kredensial (Email & Password).
- `POST /api/auth/google` — Verifikasi token OAuth Google untuk login/registrasi instan.
- `GET /api/auth/units` & `GET /api/units` — Daftar unit bank sampah aktif untuk onboarding/registrasi.
- `GET /api/auth/me` — Mendapatkan profil, role, unit, dan saldo pengguna yang sedang login.
- `POST /api/auth/logout` — Mencabut access token sesi saat ini.

### 2. ☁️ Unggah Berkas & Gambar (`Upload`)
- `POST /api/upload` — Mengunggah gambar (bukti setoran, foto kategori sampah, foto hadiah, atau avatar) ke penyimpanan S3/MinIO atau lokal.

### 3. 👤 Nasabah (`Nasabah`)
- `GET /api/nasabah/profil` — Profil nasabah, akumulasi total setoran (kg), dan saldo poin.
- `PUT /api/nasabah/profil` — Memperbarui data kontak nasabah.
- `GET /api/nasabah/kategoris` — Daftar kategori sampah aktif beserta harga/kg dan poin/kg pada unit nasabah.
- `GET /api/nasabah/hadiahs` — Katalog hadiah yang tersedia untuk ditukarkan poin.
- `GET /api/nasabah/setorans` — Riwayat setoran sampah nasabah (terpaginasi, filter status).
- `POST /api/nasabah/setorans` — Mengajukan setoran sampah baru.
- `GET /api/nasabah/setorans/{id}` — Detail setoran sampah.
- `GET /api/nasabah/penukarans` — Riwayat penukaran hadiah nasabah.
- `POST /api/nasabah/penukarans` — Menukarkan saldo poin dengan hadiah.

### 4. 🏢 Admin Unit (`Admin`)
- **Kategori Sampah**:
  - `GET /api/admin/kategoris` — Daftar kategori sampah unit (filter klasifikasi plastik/kertas/logam/kaca).
  - `POST /api/admin/kategoris` — Tambah kategori sampah baru.
  - `POST /api/admin/kategoris/bulk` — **Impor Batch Kategori Sampah dari CSV / XLSX**.
  - `GET /api/admin/kategoris/{id}` — Detail kategori sampah.
  - `PUT /api/admin/kategoris/{id}` — Memperbarui tarif harga/poin kategori sampah.
  - `DELETE /api/admin/kategoris/{id}` — Menghapus kategori sampah.
- **Katalog Hadiah**:
  - `GET /api/admin/hadiahs` — Daftar hadiah unit (filter stok tersedia/habis).
  - `POST /api/admin/hadiahs` — Tambah hadiah baru.
  - `POST /api/admin/hadiahs/bulk` — **Impor Batch Katalog Hadiah dari CSV / XLSX**.
  - `GET /api/admin/hadiahs/{id}` — Detail hadiah.
  - `PUT /api/admin/hadiahs/{id}` — Memperbarui stok dan poin hadiah.
  - `DELETE /api/admin/hadiahs/{id}` — Menghapus hadiah.
- **Nasabah & Verifikasi**:
  - `GET /api/admin/nasabahs` — Daftar nasabah unit.
  - `POST /api/admin/nasabahs` — Pendaftaran manual nasabah oleh admin unit.
  - `GET /api/admin/nasabahs/{id}` — Detail nasabah & statistik.
  - `PUT /api/admin/nasabahs/{id}` — Update profil nasabah.
  - `DELETE /api/admin/nasabahs/{id}` — Hapus / nonaktifkan nasabah.
  - `GET /api/admin/setorans` — Daftar setoran masuk yang menunggu verifikasi penimbangan.
  - `POST /api/admin/setorans/{setoran}/verify` — **Verifikasi & Timbang Setoran** (perhitungan poin otomatis).
  - `GET /api/admin/rekap` — Rekapitulasi laporan tonase dan transaksi periodik.

### 5. 🛡️ Platform Ops / Superadmin (`Platform Ops`)
- `GET /api/ops/dashboard` — Metrik global platform seluruh unit bank sampah.
- `GET /api/ops/users` — Kelola pengguna lintas seluruh unit.
- `POST /api/ops/users` — Buat pengguna baru dengan penugasan unit dan peran.
- `PUT /api/ops/users/{user}` — Ubah hak akses dan unit pengguna.
- `DELETE /api/ops/users/{user}` — Hapus pengguna.
- `GET /api/ops/roles` — Daftar peran sistem.
- `GET /api/ops/units` — Daftar seluruh unit bank sampah terdaftar.
- `POST /api/ops/units` — Daftarkan unit bank sampah baru.

---

## 🛠️ Meregenerasi Dokumentasi Swagger

Jika terdapat penambahan atau perubahan anotasi endpoint di masa mendatang, jalankan perintah berikut di direktori `hijauin-backend`:

```bash
php artisan l5-swagger:generate
```
Dokumen `storage/api-docs/api-docs.json` dan antarmuka Swagger UI akan langsung terbarui secara otomatis.
