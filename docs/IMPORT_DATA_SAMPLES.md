# 📊 Panduan & Sampel Data Impor (CSV & Excel .xlsx)

Hijauin v2 menyediakan fitur **Impor Data Batch** menggunakan file spreadsheet (**CSV** maupun **Excel .xlsx**) yang dilengkapi dengan antarmuka interaktif: pemetaan kolom otomatis, validasi real-time, eliminasi baris keliru, dan penambahan baris manual sebelum disimpan ke database.

---

## 📁 Lokasi Berkas Sampel Template

Semua template sampel siap pakai tersedia dalam format **CSV (UTF-8 with BOM)** dan **Microsoft Excel (.xlsx)** di direktori:
- `docs/samples/`
- `hijauin-frontend/public/samples/`
- `data/samples/`

---

## 📋 Daftar & Spesifikasi Setiap Template Impor

### 1. Template Kategori Sampah (`template_kategori_sampah`)
Digunakan pada menu **Admin Unit ➜ Kategori Sampah ➜ Impor Data**.

- **File CSV**: [`template_kategori_sampah.csv`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/samples/template_kategori_sampah.csv)
- **File Excel**: [`template_kategori_sampah.xlsx`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/samples/template_kategori_sampah.xlsx)

#### Spesifikasi Kolom:
| Header Kolom | Tipe Data | Wajib? | Nilai Yang Diizinkan | Contoh Nilai | Keterangan |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `Nama Kategori` | Teks | ✅ Ya | String (maks 100 karakter) | `Botol Plastik PET Bening` | Nama spesifik jenis sampah |
| `Jenis Material` | Pilihan | ✅ Ya | `plastik`, `kertas`, `logam`, `kaca` | `plastik` | Klasifikasi material utama |
| `Harga per kg (Rp)` | Angka | ✅ Ya | Angka desimal $\ge 0$ | `4500` | Nilai konversi rupiah per kilogram |
| `Poin per kg` | Angka | ✅ Ya | Integer $\ge 0$ | `45` | Poin reward per kilogram |
| `Deskripsi` | Teks | ❌ Opsional | String | `Botol air mineral bersih tanpa label` | Petunjuk pemilahan nasabah |

---

### 2. Template Katalog Hadiah (`template_katalog_hadiah`)
Digunakan pada menu **Admin Unit ➜ Katalog Hadiah ➜ Impor Data**.

- **File CSV**: [`template_katalog_hadiah.csv`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/samples/template_katalog_hadiah.csv)
- **File Excel**: [`template_katalog_hadiah.xlsx`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/samples/template_katalog_hadiah.xlsx)

#### Spesifikasi Kolom:
| Header Kolom | Tipe Data | Wajib? | Nilai Yang Diizinkan | Contoh Nilai | Keterangan |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `Nama Hadiah` | Teks | ✅ Ya | String (maks 150 karakter) | `Minyak Goreng 1 Liter Pouch` | Nama barang hadiah reward |
| `Poin Dibutuhkan` | Angka | ✅ Ya | Integer $\ge 1$ | `150` | Jumlah poin yang dikurangkan |
| `Stok` | Angka | ✅ Ya | Integer $\ge 0$ | `30` | Jumlah kuota fisik barang |
| `Deskripsi` | Teks | ❌ Opsional | String | `Minyak goreng kelapa sawit pouch 1L` | Deskripsi spesifikasi barang |

---

### 3. Template Data Nasabah (`template_data_nasabah`)
Digunakan untuk migrasi data buku tabungan nasabah awal ke dalam sistem per unit.

- **File CSV**: [`template_data_nasabah.csv`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/samples/template_data_nasabah.csv)
- **File Excel**: [`template_data_nasabah.xlsx`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/samples/template_data_nasabah.xlsx)

#### Spesifikasi Kolom:
| Header Kolom | Tipe Data | Wajib? | Nilai Yang Diizinkan | Contoh Nilai | Keterangan |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `Nama Lengkap` | Teks | ✅ Ya | String nama | `Budi Santoso` | Nama lengkap nasabah |
| `Email` | Email | ✅ Ya | Format email valid | `budi.santoso@gmail.com` | Digunakan untuk login akun |
| `No Telepon` | Teks | ❌ Opsional | Format nomor HP (08...) | `081234567801` | Nomor kontak aktif WhatsApp |
| `Alamat` | Teks | ❌ Opsional | String alamat / RT-RW | `Jl. Merdeka RT 01 / RW 03 No. 12` | Alamat domisili |
| `Saldo Poin Awal` | Angka | ❌ Opsional | Integer $\ge 0$ | `150` | Saldo poin bawaan jika migrasi |

---

### 4. Template Batch Setoran Sampah (`template_batch_setoran_sampah`)
Digunakan untuk mencatat data setoran sampah massal saat kegiatan penimbangan lapangan offline.

- **File CSV**: [`template_batch_setoran_sampah.csv`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/samples/template_batch_setoran_sampah.csv)
- **File Excel**: [`template_batch_setoran_sampah.xlsx`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/samples/template_batch_setoran_sampah.xlsx)

#### Spesifikasi Kolom:
| Header Kolom | Tipe Data | Wajib? | Nilai Yang Diizinkan | Contoh Nilai | Keterangan |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `Identifier Nasabah` | Teks | ✅ Ya | Email atau No Telepon | `budi.santoso@gmail.com` | Pengidentifikasi nasabah di unit |
| `Kategori Sampah` | Teks | ✅ Ya | Nama kategori terdaftar | `Botol Plastik PET Bening` | Harus sesuai kategori unit |
| `Berat (kg)` | Angka | ✅ Ya | Angka desimal $> 0$ | `3.5` | Berat timbangan dalam kilogram |
| `Status Setoran` | Teks | ✅ Ya | `menunggu`, `diterima`, `ditolak` | `diterima` | Status transaksi timbangan |
| `Catatan` | Teks | ❌ Opsional | String | `Botol bersih kering tanpa label` | Keterangan tambahan |

---

### 5. Template Data Petugas & Pengguna (`template_pengguna_petugas`)
Digunakan oleh Superadmin / Platform Ops untuk penambahan staf unit.

- **File CSV**: [`template_pengguna_petugas.csv`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/samples/template_pengguna_petugas.csv)
- **File Excel**: [`template_pengguna_petugas.xlsx`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/samples/template_pengguna_petugas.xlsx)

#### Spesifikasi Kolom:
| Header Kolom | Tipe Data | Wajib? | Nilai Yang Diizinkan | Contoh Nilai |
| :--- | :--- | :---: | :--- | :--- |
| `Nama Lengkap` | Teks | ✅ Ya | String nama | `Bambang Trihatmojo` |
| `Email` | Email | ✅ Ya | Format email valid | `petugas.bambang@banksampah.id` |
| `Role / Peran` | Pilihan | ✅ Ya | `petugas`, `admin_unit`, `nasabah` | `petugas` |
| `No Telepon` | Teks | ❌ Opsional | Nomor HP | `082111223344` |
| `Status Akun` | Teks | ❌ Opsional | `aktif`, `nonaktif` | `aktif` |

---

## 💡 Panduan Penggunaan di Antarmuka Web (Frontend)

1. **Buka Halaman Terkait** (misal: Halaman Kategori Sampah atau Katalog Hadiah pada Panel Admin).
2. **Klik Tombol "Impor Data" / "Import Batch"**.
3. Pada modal yang terbuka:
   - Jika belum memiliki format yang sesuai, klik tombol **Unduh CSV** atau **Unduh Excel (.xlsx)** di bagian bawah dropzone.
   - Buka file sampel tersebut menggunakan Excel, Google Sheets, atau text editor, lalu isi data Anda.
   - Seret atau pilih file spreadsheet Anda ke dalam area unggah.
4. **Pratinjau & Edit di Staging**:
   - Seluruh baris data akan dipetakan ke dalam tabel interaktif.
   - Baris yang memiliki kesalahan format akan ditandai dengan warna merah. Anda dapat langsung mengedit isi sel di tempat atau mencentang/membatalkan baris yang diinginkan.
5. Klik **Impor Data Terpilih** untuk menyimpan data ke server dalam 1 transaksi aman.
