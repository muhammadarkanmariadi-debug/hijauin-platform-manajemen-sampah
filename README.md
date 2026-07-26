# Hijauin — Platform Manajemen Sampah & Daur Ulang Modern

<div align="center">

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-000000.svg?logo=next.js&logoColor=white)
![Laravel](https://img.shields.io/badge/Backend-Laravel%2011-FF2D20.svg?logo=laravel&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC.svg?logo=tailwind-css&logoColor=white)

**Platform Digital Pintar untuk Penjemputan Sampah, Pelaporan Sampah Liar, Edukasi Lingkungan, dan Ekonomi Sirkular di Indonesia**

</div>

---

## 📑 Table of Contents (Daftar Isi)

- [BAB I — Pendahuluan (Non-Teknis)](#bab-i---pendahuluan-non-teknis)
  - [1.1 Latar Belakang](#11-latar-belakang)
  - [1.2 Problem Statement](#12-problem-statement)
  - [1.3 Rumusan Masalah (Research Question)](#13-rumusan-masalah-research-question)
  - [1.4 Mengapa Proyek Ini Dibuat (Why This Project)](#14-mengapa-proyek-ini-dibuat-why-this-project)
- [BAB II — Tentang Hijauin (Non-Teknis)](#bab-ii---tentang-hijauin-non-teknis)
  - [2.1 Deskripsi Produk & Fungsi Utama](#21-deskripsi-produk--fungsi-utama)
  - [2.2 Masalah yang Diselesaikan](#22-masalah-yang-diselesaikan)
  - [2.3 Fitur Utama](#23-fitur-utama)
- [BAB III — Alur Sistem & Proses Bisnis (Semi-Teknis)](#bab-iii---alur-sistem--proses-bisnis-semi-teknis)
  - [3.1 Gambaran Umum Alur](#31-gambaran-umum-alur)
  - [3.2 Siklus Penjemputan Sampah (Order Lifecycle)](#32-siklus-penjemputan-sampah-order-lifecycle)
- [BAB IV — Role & Hak Akses Pengguna (Semi-Teknis)](#bab-iv---role--hak-akses-pengguna-semi-teknis)
  - [4.1 Daftar Role](#41-daftar-role)
  - [4.2 Interaksi Antar Role](#42-interaksi-antar-role)
- [BAB V — Arsitektur Teknis (Teknis)](#bab-v---arsitektur-teknis-teknis)
  - [5.1 Gambaran Arsitektur](#51-gambaran-arsitektur)
  - [5.2 Tech Stack](#52-tech-stack)
  - [5.3 Struktur Direktori Repository](#53-struktur-direktori-repository)
- [BAB VI — Instalasi & Menjalankan Aplikasi (Teknis)](#bab-vi---instalasi--menjalankan-aplikasi-teknis)
  - [6.1 Prasyarat](#61-prasyarat)
  - [6.2 Langkah Instalasi Local](#62-langkah-instalasi-local)
  - [6.3 Endpoint Layanan](#63-endpoint-layanan)
  - [6.4 Kredensial Demo](#64-kredensial-demo)
- [BAB VII — Studi Kasus (Non-Teknis)](#bab-vii---studi-kasus-non-teknis)
  - [7.1 Profil Lingkungan](#71-profil-lingkungan)
  - [7.2 Bagaimana Hijauin Menyelesaikannya](#72-bagaimana-hijauin-menyelesaikannya)
- [BAB VIII — Rencana Pengembangan / Roadmap (Non-Teknis)](#bab-viii---rencana-pengembangan--roadmap-non-teknis)
- [BAB IX — Lisensi & Kontribusi (Teknis)](#bab-ix---lisensi--kontribusi-teknis)
  - [9.1 Lisensi](#91-lisensi)
  - [9.2 Panduan Kontribusi](#92-panduan-kontribusi)

---

## BAB I — Pendahuluan (Non-Teknis)

### 1.1 Latar Belakang
Manajemen persampahan di Indonesia merupakan salah satu tantangan lingkungan dan infrastruktur terbesar. Sebagian besar rumah tangga dan bisnis masih membuang sampah secara konvensional yang berujung pada penumpukan di Tempat Pembuangan Akhir (TPA) yang sudah melebihi kapasitas operasionalnya. Di sisi lain, ekosistem ekonomi sirkular (daur ulang) yang berpotensi menghasilkan nilai ekonomi dari limbah terkendala oleh rantai pasok sampah yang tidak terorganisir dengan baik antara masyarakat, pengumpul, dan pabrik daur ulang.

### 1.2 Problem Statement
Permasalahan utama terletak pada kurangnya infrastruktur digital yang menjembatani masyarakat yang ingin mendaur ulang sampah dengan pihak pengelola/pengumpul sampah secara mudah. Masyarakat seringkali tidak memiliki waktu untuk memilah dan mengantar sampah daur ulang ke bank sampah. Selain itu, banyaknya titik tumpukan sampah liar di fasilitas umum tidak terlaporkan dengan baik kepada pihak yang berwenang karena tidak adanya saluran komunikasi langsung yang transparan dan *real-time*.

### 1.3 Rumusan Masalah (Research Question)
Dari latar belakang di atas, rumusan masalah utama yang ingin dijawab adalah:
> *"Bagaimana merancang sebuah sistem informasi digital terintegrasi yang dapat mempermudah masyarakat menyetorkan sampah daur ulang, melaporkan sampah liar, sekaligus menciptakan insentif ekonomi yang menguntungkan bagi warga dan kurir kebersihan secara berkelanjutan?"*

### 1.4 Mengapa Proyek Ini Dibuat (Why This Project)
Proyek **Hijauin** diinisiasi untuk memberikan solusi *all-in-one* yang modern, intuitif, dan responsif. Aplikasi ini mengubah proses pembuangan sampah yang merepotkan menjadi sebuah pengalaman transaksi yang bernilai (mendapatkan koin/rupiah). Hijauin hadir bukan hanya sebagai *software*, tetapi sebagai inisiatif digital untuk menciptakan lingkungan yang lebih bersih sambil memberdayakan para pengepul dan petugas kebersihan melalui sistem *On-Demand* (seperti halnya layanan *ride-hailing*).

---

## BAB II — Tentang Hijauin (Non-Teknis)

### 2.1 Deskripsi Produk & Fungsi Utama
**Hijauin** adalah platform inovatif berbasis web (*Full-Stack Web App*) yang menghubungkan masyarakat (Customer), kurir sampah (*Petugas fastCOPICK*), pengelola daur ulang (*Partner*), dan *Admin* pengawas dalam satu ekosistem pengelolaan sampah yang cerdas. Hijauin memfasilitasi penjemputan sampah dari rumah tangga secara terjadwal maupun kilat, serta menerima pelaporan penumpukan sampah liar di ruang publik untuk segera dieksekusi.

### 2.2 Masalah yang Diselesaikan
Platform ini memberikan solusi untuk masalah nyata di lapangan:

| Permasalahan | Solusi dari Hijauin |
| :--- | :--- |
| **Tidak ada layanan jemput sampah daur ulang terpadu.** | **Layanan fastCOPICK (On-Demand Pickup)**<br>Masyarakat bisa memesan penjemputan sampah dari rumah. Petugas akan datang, menimbang, dan membayar menggunakan Poin Hijau. |
| **Tumpukan sampah liar tidak teratasi.** | **Sistem Laporan Sampah Liar Terbuka**<br>Masyarakat bisa memotret tumpukan sampah liar dan membagikan titik lokasinya. Admin akan menugaskan kurir untuk membersihkannya dengan lampiran foto bukti selesai. |
| **Kurangnya motivasi memilah sampah.** | **Gamifikasi & Insentif (HijauPoints)**<br>Setiap setoran sampah bernilai ekonomi (poin atau saldo uang) yang bisa dicairkan ke *e-wallet*, meningkatkan minat warga untuk memilah sampah dari rumah. |

### 2.3 Fitur Utama
1. **Request Penjemputan Sampah (Orders)**: Pelanggan dapat membuat jadwal *pickup*, memperkirakan berat sampah (Plastik, Kertas, Organik, dll), dan menunggu petugas datang.
2. **Pelaporan Sampah Liar (Reports)**: Fitur *crowdsourcing* masyarakat untuk melaporkan tumpukan sampah liar dilengkapi geolokasi dan foto.
3. **Sistem Dompet & HijauPoints (Wallet)**: Sistem *reward* yang mengonversi berat sampah yang disetorkan menjadi nilai mata uang/poin digital untuk pencairan.
4. **Dashboard Petugas (Kurir fastCOPICK)**: Aplikasi khusus kurir untuk memantau rute tugas, menimbang berat aktual saat di lokasi, dan mengunggah foto bukti pengangkutan.
5. **Dashboard Admin (Control Center)**: Pusat kontrol sistem (*Assign* petugas, validasi laporan, master data jenis sampah, dan manajemen *user*).
6. **Edukasi Lingkungan**: Pusat literasi artikel ramah lingkungan dan tutorial daur ulang.

---

## BAB III — Alur Sistem & Proses Bisnis (Semi-Teknis)

### 3.1 Gambaran Umum Alur
Sistem bekerja layaknya aplikasi logistik on-demand. Masyarakat membuat *order* penjemputan atau pelaporan; *Admin* mengoordinasikan pesanan yang belum terdistribusi; *Petugas* lapangan mengeksekusi pesanan dengan melakukan validasi berat dan bukti foto; lalu *Customer* menerima kompensasi poin setelah tugas selesai diangkut.

### 3.2 Siklus Penjemputan Sampah (Order Lifecycle)
Siklus status dari setiap penjemputan (order) dikontrol ketat untuk transparansi:

1. **`pending`**: Customer membuat order. Menunggu Admin menunjuk kurir (*Assign Petugas*).
2. **`assigned`**: Order sudah diserahkan ke spesifik Petugas, menunggu Petugas mengonfirmasi keberangkatan.
3. **`on_the_way`**: Petugas menerima tugas dan sedang dalam perjalanan ke alamat Customer.
4. **`collected`**: Petugas tiba di lokasi, memasukkan berat aktual (*actual weight*), dan mengunggah foto bukti pengambilan. Sistem menghitung ulang total hadiah poin berdasarkan berat tersebut.
5. **`completed`**: Transaksi final. Poin ditransfer secara otomatis ke dompet Customer, dan tugas dicatat dalam histori Petugas.

---

## BAB IV — Role & Hak Akses Pengguna (Semi-Teknis)

### 4.1 Daftar Role
Hijauin memiliki 4 profil peran pengguna yang bekerja dalam sebuah simfoni:

1. **Admin (Super User)**: Memegang kendali atas master data jenis sampah, harga per kg, validasi pengguna, dan mendistribusikan *Order* serta *Report* kepada para Petugas.
2. **Petugas (fastCOPICK / Kurir)**: Pihak operasional lapangan yang menjemput sampah, memverifikasi kualitas/kuantitas sampah di lokasi, serta menyelesaikan pembersihan sampah liar.
3. **Customer (Pelanggan/Masyarakat)**: Pengguna umum yang menyetorkan sampah dari rumah tangga, melapor sampah liar, dan mengelola pendapatan *HijauPoints* mereka.
4. **Partner (Pengepul / Pabrik Daur Ulang)**: Mitra bisnis tingkat lanjut yang menerima sampah dalam skala besar dari gudang pengepulan *Hijauin*. *(Dalam pengembangan)*

### 4.2 Interaksi Antar Role
- **Customer** -> `Request Order` -> **Admin** -> `Assign Order` -> **Petugas**.
- **Petugas** -> `Input Actual Weight & Photo` -> **System** -> `Pay Points` -> **Customer**.

---

## BAB V — Arsitektur Teknis (Teknis)

### 5.1 Gambaran Arsitektur
Arsitektur **Hijauin** mengadopsi pola **Decoupled Monorepo** di mana lapisan presentasi (*Frontend App*) dan logika bisnis RESTful (*Backend API*) dipisah secara struktur direktori namun berada dalam satu *repository* untuk kemudahan kontrol versi.

```
+-------------------------------------------------------------+
|               USER BROWSER / MOBILE DEVICE                  |
|          (Frontend - Next.js 15 App Router)                 |
+-------------------------------------------------------------+
         ^                                        ^
         | REST API (JSON)                        |
         v                                        v
+-------------------------------------------------------------+
|                    CORE BACKEND API                         |
|                 (Laravel 11 REST API)                       |
|  - JWT Auth (Tymon)         - Spatie Role & Permissions     |
|  - Eloquent ORM             - File System (Storage)         |
+-------------------------------------------------------------+
         ^
         |
         v
+------------------+
|   MySQL 8.0 DB   |
+------------------+
```

### 5.2 Tech Stack
| Lapisan | Teknologi Utama | Keterangan |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 15 (App Router)** | React 19, TypeScript, Tailwind CSS, Lucide Icons, Date-fns, Axios API Service |
| **Backend** | **Laravel 11 (PHP 8.2+)** | REST API, Tymon JWT Auth, Spatie Permissions, MySQL |
| **Database** | **MySQL** | Relational Database Management System |

### 5.3 Struktur Direktori Repository
```
hijauin-fullstack/
├── frontend/                    # Source code Frontend Web Application
│   ├── app/
│   │   ├── (auth)/              # Halaman Login, Register, Forgot Password
│   │   ├── dashboard/           # Sub-routing dashboard per Role (Admin, Customer, Petugas)
│   │   ├── components/          # Reusable UI components
│   │   ├── contexts/            # React Context (AuthContext)
│   │   └── services/            # API interceptors & HTTP Client (axios)
│   ├── public/                  # Aset statis, logo, ilustrasi
│   └── package.json
├── backend/                     # Source code Backend REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/# Logika controller API (Order, Report, Petugas, Admin)
│   │   └── Models/              # Eloquent Models & relasi DB
│   ├── database/                # Schema Migrations & Seeder data
│   └── routes/
│       └── api.php              # Definisi endpoint (Route API)
├── SKILL.md                     # File dokumentasi memori AI (Conventions & Patterns)
└── README.md                    # File dokumentasi utama ini
```

---

## BAB VI — Instalasi & Menjalankan Aplikasi (Teknis)

### 6.1 Prasyarat
- **Node.js** (v18 atau terbaru) & npm/yarn/pnpm.
- **PHP** (v8.2 atau terbaru) & Composer.
- **MySQL** (v8.0) terinstal lokal atau menggunakan XAMPP/Docker.

### 6.2 Langkah Instalasi Local

#### A. Setup Backend (Laravel)
1. Masuk ke folder backend: `cd backend`
2. Install dependensi: `composer install`
3. Salin `.env.example` ke `.env`: `cp .env.example .env`
4. Sesuaikan konfigurasi koneksi *database* (DB_DATABASE, DB_USERNAME, DB_PASSWORD) di file `.env`.
5. Generate key dan JWT secret:
   ```bash
   php artisan key:generate
   php artisan jwt:secret
   ```
6. Jalankan migrasi dan seeder:
   ```bash
   php artisan migrate --seed
   ```
7. Jalankan server lokal: `php artisan serve`

#### B. Setup Frontend (Next.js)
1. Masuk ke folder frontend: `cd frontend`
2. Install dependensi: `npm install`
3. Sesuaikan URL backend (jika berbeda dari `http://localhost:8000/api`) di file `app/services/api.service.ts` atau `.env.local`.
4. Jalankan *development server*: `npm run dev`

### 6.3 Endpoint Layanan
| Layanan | URL Local | Keterangan |
| :--- | :--- | :--- |
| **Frontend Web** | `http://localhost:3000` | Tampilan UI aplikasi. |
| **Backend API** | `http://localhost:8000/api` | Endpoint data JSON dari Laravel. |

### 6.4 Kredensial Demo
Setelah menjalankan seeder (`php artisan db:seed`), Anda dapat *login* di `http://localhost:3000/login` dengan akun demo berikut:

- **Admin**: `admin@hijauin.com` (Pass: `password`)
- **Customer**: `customer@hijauin.com` (Pass: `password`)
- **Petugas**: `petugas@hijauin.com` (Pass: `password`)

*(Tergantung konfigurasi seeder, pastikan merujuk ke file `DatabaseSeeder.php` jika akun demo berubah).*

---

## BAB VII — Studi Kasus (Non-Teknis)

### 7.1 Profil Lingkungan
Di sebuah perumahan padat, pengelolaan sampah sangat berantakan karena tukang angkut sampah keliling sering telat. Banyak area lahan kosong (fasilitas sosial perumahan) yang dijadikan tempat pembuangan sampah liar oleh warga tak bertanggung jawab. Warga lain resah namun bingung harus melapor ke siapa, sedangkan pengumpul rongsok (pengepul) kebingungan mencari rumah yang menjual botol plastik secara pasti tanpa harus keliling harian.

### 7.2 Bagaimana Hijauin Menyelesaikannya
- Warga yang resah dapat memfoto tumpukan sampah di lahan kosong dan mengirimkannya ke menu **Lapor Sampah Liar** di aplikasi Hijauin. Admin sistem meneruskan foto tersebut ke **Petugas fastCOPICK** di area itu.
- Petugas membersihkan lahan tersebut dan mengunggah **Foto Bukti Selesai**, menciptakan lingkungan bersih yang dipantau real-time.
- Ibu-ibu rumah tangga tidak lagi menumpuk kardus dan botol sembarangan; mereka menyusun jadwal **Pickup Order**. Kurir fastCOPICK tiba di depan pagar, menimbang berat dengan presisi, dan ibu rumah tangga tersebut langsung mendapat **HijauPoints** ke akunnya, yang kelak bisa dibelikan token listrik. Win-win solution!

---

## BAB VIII — Rencana Pengembangan / Roadmap (Non-Teknis)

Untuk memperluas dampak lingkungan, berikut peta jalan pengembangan fitur Hijauin:

| Fase | Fokus Pengembangan | Keterangan |
| :---: | :--- | :--- |
| **Tahap 1** | **Core Transaction Loop** | Stabilisasi alur *Order*, *Assign*, *Collect*, dan *Reports* (Sudah berjalan). |
| **Tahap 2** | **Marketplace Daur Ulang & Partner** | Mengaktifkan role **Partner** agar pabrik daur ulang dapat membeli agregasi sampah (ribuan kilogram) langsung dari gudang sistem Hijauin. |
| **Tahap 3** | **Sistem Subscription & IoT** | Langganan jemput sampah berkala mingguan otomatis. Integrasi timbangan digital IoT (*Internet of Things*) milik petugas langsung ke aplikasi tanpa input manual. |
| **Tahap 4** | **Pencairan & PPOB Wallet** | Integrasi HijauPoints dengan *Payment Gateway* pihak ketiga agar poin bisa dicairkan langsung ke GoPay/OVO/Pulsa langsung dari aplikasi. |

---

## BAB IX — Lisensi & Kontribusi (Teknis)

### 9.1 Lisensi
Proyek perangkat lunak ini dilisensikan di bawah **MIT License**. Anda diizinkan menggunakan dan memodifikasi aplikasi ini selama menyertakan pemberitahuan hak cipta asli. 

### 9.2 Panduan Kontribusi
Kami menyambut kontribusi (*Pull Requests*) dari masyarakat pengembang untuk memperbaiki algoritma, merapikan UI, maupun optimasi beban server. Harap patuhi kaidah *clean code* TypeScript untuk *Frontend* dan kaidah PSR (PHP Standard Recommendation) untuk repositori *Backend* sebelum melakukan `git push`.

---

<div align="center">

**© 2026 Hijauin Team — Digitalisasi untuk Bumi yang Lebih Hijau.**

</div>
