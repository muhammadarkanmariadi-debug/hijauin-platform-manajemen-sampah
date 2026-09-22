<?php

namespace App\Http\Controllers\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '2.0.0',
    title: 'Hijauin v2 API Documentation',
    description: 'Dokumentasi Resmi & Lengkap RESTful API Hijauin v2 - Platform Manajemen Bank Sampah Digital Multi-Unit. Mendukung otentikasi Sanctum Bearer Token, multi-unit scoping, batch import CSV/XLSX, dan operasional bank sampah terintegrasi.',
    contact: new OA\Contact(
        name: 'Tim Hijauin Developer',
        email: 'dev@hijauin.id',
        url: 'https://hijauin.id'
    ),
    license: new OA\License(
        name: 'MIT / Proprietary',
        url: 'https://opensource.org/licenses/MIT'
    )
)]
#[OA\Server(
    url: '/',
    description: 'Current Environment Host'
)]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Gunakan Bearer Token yang didapatkan dari login/register (contoh: Authorization: Bearer 1|abcdef123456...)'
)]
#[OA\Tag(
    name: 'Auth',
    description: 'Otentikasi publik, registrasi pengguna (Nasabah/Petugas/Admin), login kredensial, Google OAuth, daftar unit, dan pengecekan sesi (/me).'
)]
#[OA\Tag(
    name: 'Upload',
    description: 'Unggah berkas / gambar (bukti setoran, foto kategori sampah, foto hadiah, avatar) ke storage S3/MinIO atau lokal.'
)]
#[OA\Tag(
    name: 'Nasabah - Profil & Katalog',
    description: 'Fitur nasabah: profil pengguna, katalog kategori sampah unit, dan katalog hadiah penukaran poin.'
)]
#[OA\Tag(
    name: 'Nasabah - Setoran & Penukaran',
    description: 'Fitur nasabah: pengajuan setoran sampah, riwayat setoran, serta penukaran saldo poin hadiah.'
)]
#[OA\Tag(
    name: 'Admin - Kategori Sampah',
    description: 'Manajemen master kategori sampah unit, harga per kg, poin per kg, dan impor batch spreadsheet CSV/XLSX.'
)]
#[OA\Tag(
    name: 'Admin - Katalog Hadiah',
    description: 'Manajemen master katalog hadiah unit, stok, poin yang dibutuhkan, dan impor batch spreadsheet CSV/XLSX.'
)]
#[OA\Tag(
    name: 'Admin - Nasabah & Verifikasi',
    description: 'Manajemen data nasabah, verifikasi penimbangan setoran sampah, dan rekapitulasi data periodik.'
)]
#[OA\Tag(
    name: 'Platform Ops - Superadmin',
    description: 'Operasional superuser platform: dashboard metrik global, kelola seluruh unit bank sampah, dan pengguna lintas unit.'
)]

// ── SCHEMAS ─────────────────────────────────────────────────────────────

#[OA\Schema(
    schema: 'ApiResponseSuccess',
    type: 'object',
    properties: [
        new OA\Property(property: 'success', type: 'boolean', example: true),
        new OA\Property(property: 'message', type: 'string', example: 'Operasi berhasil.'),
        new OA\Property(property: 'data', type: 'object')
    ]
)]
#[OA\Schema(
    schema: 'ApiResponseError',
    type: 'object',
    properties: [
        new OA\Property(property: 'success', type: 'boolean', example: false),
        new OA\Property(property: 'message', type: 'string', example: 'Validasi gagal atau data tidak ditemukan.'),
        new OA\Property(property: 'errors', type: 'object', nullable: true)
    ]
)]
#[OA\Schema(
    schema: 'PaginationMeta',
    type: 'object',
    properties: [
        new OA\Property(property: 'page', type: 'integer', example: 1),
        new OA\Property(property: 'pageSize', type: 'integer', example: 15),
        new OA\Property(property: 'total', type: 'integer', example: 42)
    ]
)]
#[OA\Schema(
    schema: 'UnitBankSampah',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Bank Sampah Sukamaju'),
        new OA\Property(property: 'kode', type: 'string', example: 'BSS-01'),
        new OA\Property(property: 'alamat', type: 'string', nullable: true, example: 'Jl. Merdeka No. 45, Jakarta'),
        new OA\Property(property: 'telepon', type: 'string', nullable: true, example: '081234567890'),
        new OA\Property(property: 'is_active', type: 'boolean', example: true)
    ]
)]
#[OA\Schema(
    schema: 'User',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 10),
        new OA\Property(property: 'name', type: 'string', example: 'Budi Santoso'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'budi@example.com'),
        new OA\Property(property: 'phone', type: 'string', nullable: true, example: '081298765432'),
        new OA\Property(property: 'role', type: 'string', enum: ['nasabah', 'admin_unit', 'petugas', 'superadmin'], example: 'nasabah'),
        new OA\Property(property: 'unit_id', type: 'integer', example: 1),
        new OA\Property(property: 'avatar_url', type: 'string', nullable: true, example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-03-01T08:00:00Z')
    ]
)]
#[OA\Schema(
    schema: 'KategoriSampah',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 5),
        new OA\Property(property: 'unit_id', type: 'integer', example: 1),
        new OA\Property(property: 'nama', type: 'string', example: 'Botol Plastik PET Bersih'),
        new OA\Property(property: 'jenis', type: 'string', enum: ['plastik', 'kertas', 'logam', 'kaca'], example: 'plastik'),
        new OA\Property(property: 'harga_per_kg', type: 'number', format: 'float', example: 4500),
        new OA\Property(property: 'poin_per_kg', type: 'integer', example: 45),
        new OA\Property(property: 'deskripsi', type: 'string', nullable: true, example: 'Botol air mineral transparan tanpa tutup dan label'),
        new OA\Property(property: 'foto_url', type: 'string', nullable: true, example: 'https://images.unsplash.com/photo-1526951521990-620dc14c214b'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-03-01T09:30:00Z')
    ]
)]
#[OA\Schema(
    schema: 'Hadiah',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 8),
        new OA\Property(property: 'unit_id', type: 'integer', example: 1),
        new OA\Property(property: 'nama', type: 'string', example: 'Minyak Goreng 1 Liter'),
        new OA\Property(property: 'poin_diperlukan', type: 'integer', example: 150),
        new OA\Property(property: 'stok', type: 'integer', example: 25),
        new OA\Property(property: 'deskripsi', type: 'string', nullable: true, example: 'Minyak goreng kelapa sawit higienis pouch 1L'),
        new OA\Property(property: 'foto_url', type: 'string', nullable: true, example: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-03-01T10:00:00Z')
    ]
)]
#[OA\Schema(
    schema: 'SetoranSampah',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 120),
        new OA\Property(property: 'unit_id', type: 'integer', example: 1),
        new OA\Property(property: 'user_id', type: 'integer', example: 10),
        new OA\Property(property: 'kategori_id', type: 'integer', example: 5),
        new OA\Property(property: 'berat_estimasi', type: 'number', format: 'float', example: 3.5),
        new OA\Property(property: 'berat_aktual', type: 'number', format: 'float', nullable: true, example: 3.6),
        new OA\Property(property: 'total_poin', type: 'integer', nullable: true, example: 162),
        new OA\Property(property: 'total_rupiah', type: 'number', format: 'float', nullable: true, example: 16200),
        new OA\Property(property: 'status', type: 'string', enum: ['menunggu', 'diterima', 'ditolak'], example: 'menunggu'),
        new OA\Property(property: 'catatan', type: 'string', nullable: true, example: 'Sudah dipilah dan dibersihkan'),
        new OA\Property(property: 'catatan_petugas', type: 'string', nullable: true, example: 'Kondisi bersih dan kering'),
        new OA\Property(property: 'foto_url', type: 'string', nullable: true, example: 'https://storage.hijauin.id/setorans/sample.jpg'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-03-15T14:20:00Z')
    ]
)]
#[OA\Schema(
    schema: 'PenukaranHadiah',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 44),
        new OA\Property(property: 'unit_id', type: 'integer', example: 1),
        new OA\Property(property: 'user_id', type: 'integer', example: 10),
        new OA\Property(property: 'hadiah_id', type: 'integer', example: 8),
        new OA\Property(property: 'jumlah', type: 'integer', example: 1),
        new OA\Property(property: 'total_poin', type: 'integer', example: 150),
        new OA\Property(property: 'status', type: 'string', enum: ['pending', 'diproses', 'selesai', 'dibatalkan'], example: 'selesai'),
        new OA\Property(property: 'catatan', type: 'string', nullable: true, example: 'Diambil saat jadwal operasional'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-03-18T10:15:00Z')
    ]
)]
class OpenApiSpec
{
    // ═══════════════════════════════════════════════════════════════════════
    // 1. AUTHENTICATION & SESSIONS
    // ═══════════════════════════════════════════════════════════════════════

    #[OA\Post(
        path: '/api/auth/register',
        summary: 'Registrasi Pengguna Baru (Nasabah / Petugas / Admin)',
        description: 'Mendaftarkan akun baru dan langsung menghasilkan Sanctum Bearer Token.',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'email', 'password', 'password_confirmation', 'unit_id'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Ahmad Nasabah'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'ahmad.nasabah@example.com'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', minLength: 8, example: 'Secret123!'),
                    new OA\Property(property: 'password_confirmation', type: 'string', format: 'password', example: 'Secret123!'),
                    new OA\Property(property: 'unit_id', type: 'integer', example: 1),
                    new OA\Property(property: 'phone', type: 'string', nullable: true, example: '081234567890'),
                    new OA\Property(property: 'address', type: 'string', nullable: true, example: 'Jl. Melati No. 15'),
                    new OA\Property(property: 'role', type: 'string', enum: ['nasabah', 'admin_unit', 'petugas'], default: 'nasabah', example: 'nasabah')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Registrasi berhasil',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Registrasi berhasil.'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                                new OA\Property(property: 'token', type: 'string', example: '1|2zYwXYZabc123456...')
                            ]
                        )
                    ]
                )
            ),
            new OA\Response(response: 422, description: 'Validasi gagal', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseError'))
        ]
    )]
    public function register() {}

    #[OA\Post(
        path: '/api/auth/login',
        summary: 'Login Pengguna dengan Email & Password',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'admin@bankhijau.id'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password123'),
                    new OA\Property(property: 'device_name', type: 'string', nullable: true, example: 'Web Browser')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Login berhasil',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Login berhasil.'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                                new OA\Property(property: 'token', type: 'string', example: '2|8hJkLmnOpQrStUvw...')
                            ]
                        )
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Kredensial tidak valid', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseError'))
        ]
    )]
    public function login() {}

    #[OA\Post(
        path: '/api/auth/google',
        summary: 'Login / Registrasi Melalui Google OAuth',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['id_token'],
                properties: [
                    new OA\Property(property: 'id_token', type: 'string', example: 'eyJhbGciOiJSUzI1NiIs...'),
                    new OA\Property(property: 'unit_id', type: 'integer', nullable: true, example: 1)
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Google Auth berhasil diverifikasi',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                                new OA\Property(property: 'token', type: 'string', example: '3|googleAuthToken123...')
                            ]
                        )
                    ]
                )
            )
        ]
    )]
    public function google() {}

    #[OA\Get(
        path: '/api/auth/units',
        summary: 'Daftar Unit Bank Sampah Publik',
        description: 'Digunakan saat registrasi nasabah dan onboarding untuk memilih unit bank sampah.',
        tags: ['Auth'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Daftar unit aktif',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/UnitBankSampah'))
                    ]
                )
            )
        ]
    )]
    public function units() {}

    #[OA\Get(
        path: '/api/auth/me',
        summary: 'Informasi Akun Pengguna Sesi Saat Ini',
        tags: ['Auth'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Data profil, role, unit, dan saldo poin pengguna',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                                new OA\Property(property: 'unit', ref: '#/components/schemas/UnitBankSampah'),
                                new OA\Property(property: 'saldo_poin', type: 'integer', example: 450),
                                new OA\Property(property: 'saldo_rupiah', type: 'number', example: 45000)
                            ]
                        )
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Unauthenticated')
        ]
    )]
    public function me() {}

    #[OA\Post(
        path: '/api/auth/logout',
        summary: 'Logout & Mencabut Token Sanctum',
        tags: ['Auth'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Berhasil logout',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Berhasil logout.')
                    ]
                )
            )
        ]
    )]
    public function logout() {}

    // ═══════════════════════════════════════════════════════════════════════
    // 2. STORAGE UPLOAD
    // ═══════════════════════════════════════════════════════════════════════

    #[OA\Post(
        path: '/api/upload',
        summary: 'Unggah Gambar / Bukti ke Penyimpanan Cloud S3 / Lokal',
        tags: ['Upload'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    required: ['file'],
                    properties: [
                        new OA\Property(property: 'file', type: 'string', format: 'binary', description: 'File gambar (JPG, PNG, WEBP, maks 5MB)'),
                        new OA\Property(property: 'folder', type: 'string', enum: ['kategoris', 'hadiahs', 'setorans', 'avatars'], default: 'setorans', example: 'setorans')
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Unggah berkas berhasil',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'url', type: 'string', example: 'https://storage.hijauin.id/setorans/img-20260301.jpg'),
                                new OA\Property(property: 'path', type: 'string', example: 'setorans/img-20260301.jpg'),
                                new OA\Property(property: 'filename', type: 'string', example: 'img-20260301.jpg'),
                                new OA\Property(property: 'size', type: 'integer', example: 204850)
                            ]
                        )
                    ]
                )
            )
        ]
    )]
    public function upload() {}

    // ═══════════════════════════════════════════════════════════════════════
    // 3. NASABAH MODULE
    // ═══════════════════════════════════════════════════════════════════════

    #[OA\Get(
        path: '/api/nasabah/profil',
        summary: 'Profil & Saldo Nasabah',
        tags: ['Nasabah - Profil & Katalog'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Data profil nasabah dan total setoran',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                                new OA\Property(property: 'total_setoran_kg', type: 'number', example: 48.5),
                                new OA\Property(property: 'total_setoran_count', type: 'integer', example: 12),
                                new OA\Property(property: 'saldo_poin', type: 'integer', example: 750),
                                new OA\Property(property: 'saldo_rupiah', type: 'number', example: 75000)
                            ]
                        )
                    ]
                )
            )
        ]
    )]
    public function nasabahProfilShow() {}

    #[OA\Put(
        path: '/api/nasabah/profil',
        summary: 'Perbarui Data Profil Nasabah',
        tags: ['Nasabah - Profil & Katalog'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Budi Santoso'),
                    new OA\Property(property: 'phone', type: 'string', example: '081298765432'),
                    new OA\Property(property: 'address', type: 'string', example: 'Jl. Anggrek No. 10'),
                    new OA\Property(property: 'avatar_url', type: 'string', example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Profil berhasil diperbarui', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function nasabahProfilUpdate() {}

    #[OA\Get(
        path: '/api/nasabah/kategoris',
        summary: 'Daftar Kategori Sampah Pada Unit Nasabah',
        tags: ['Nasabah - Profil & Katalog'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Daftar kategori sampah dan tarif harga/poin',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/KategoriSampah'))
                    ]
                )
            )
        ]
    )]
    public function nasabahKategoris() {}

    #[OA\Get(
        path: '/api/nasabah/hadiahs',
        summary: 'Katalog Hadiah Poin Unit Nasabah',
        tags: ['Nasabah - Profil & Katalog'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Daftar hadiah yang dapat ditukarkan',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Hadiah'))
                    ]
                )
            )
        ]
    )]
    public function nasabahHadiahs() {}

    #[OA\Get(
        path: '/api/nasabah/setorans',
        summary: 'Riwayat Setoran Sampah Nasabah',
        tags: ['Nasabah - Setoran & Penukaran'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'pageSize', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 10)),
            new OA\Parameter(name: 'status', in: 'query', required: false, schema: new OA\Schema(type: 'string', enum: ['all', 'menunggu', 'diterima', 'ditolak']))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Daftar setoran sampah nasabah',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/SetoranSampah')),
                        new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta')
                    ]
                )
            )
        ]
    )]
    public function nasabahSetoransIndex() {}

    #[OA\Post(
        path: '/api/nasabah/setorans',
        summary: 'Mengajukan Setoran Sampah Baru',
        tags: ['Nasabah - Setoran & Penukaran'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['kategori_id', 'berat_estimasi'],
                properties: [
                    new OA\Property(property: 'kategori_id', type: 'integer', example: 5),
                    new OA\Property(property: 'berat_estimasi', type: 'number', format: 'float', example: 3.5),
                    new OA\Property(property: 'catatan', type: 'string', nullable: true, example: 'Botol plastik kering'),
                    new OA\Property(property: 'foto_url', type: 'string', nullable: true, example: 'https://storage.hijauin.id/setorans/foto1.jpg')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Pengajuan setoran berhasil dibuat dengan status menunggu',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'data', ref: '#/components/schemas/SetoranSampah')
                    ]
                )
            )
        ]
    )]
    public function nasabahSetoransStore() {}

    #[OA\Get(
        path: '/api/nasabah/setorans/{id}',
        summary: 'Detail Setoran Sampah',
        tags: ['Nasabah - Setoran & Penukaran'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Detail setoran sampah', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function nasabahSetoransShow() {}

    #[OA\Get(
        path: '/api/nasabah/penukarans',
        summary: 'Riwayat Penukaran Hadiah Nasabah',
        tags: ['Nasabah - Setoran & Penukaran'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'pageSize', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 10))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Riwayat penukaran hadiah nasabah',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/PenukaranHadiah')),
                        new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta')
                    ]
                )
            )
        ]
    )]
    public function nasabahPenukaransIndex() {}

    #[OA\Post(
        path: '/api/nasabah/penukarans',
        summary: 'Menukarkan Poin dengan Hadiah',
        tags: ['Nasabah - Setoran & Penukaran'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['hadiah_id', 'jumlah'],
                properties: [
                    new OA\Property(property: 'hadiah_id', type: 'integer', example: 8),
                    new OA\Property(property: 'jumlah', type: 'integer', minimum: 1, example: 1),
                    new OA\Property(property: 'catatan', type: 'string', nullable: true, example: 'Diambil Sabtu pagi')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Penukaran poin berhasil', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess')),
            new OA\Response(response: 400, description: 'Saldo poin kurang atau stok tidak cukup', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseError'))
        ]
    )]
    public function nasabahPenukaransStore() {}

    // ═══════════════════════════════════════════════════════════════════════
    // 4. ADMIN UNIT: KATEGORI SAMPAH & BULK IMPORT
    // ═══════════════════════════════════════════════════════════════════════

    #[OA\Get(
        path: '/api/admin/kategoris',
        summary: 'Daftar Kategori Sampah Unit (Admin Unit)',
        tags: ['Admin - Kategori Sampah'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'search', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'jenis', in: 'query', required: false, schema: new OA\Schema(type: 'string', enum: ['all', 'plastik', 'kertas', 'logam', 'kaca'])),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'pageSize', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 15)),
            new OA\Parameter(name: 'sort_by', in: 'query', required: false, schema: new OA\Schema(type: 'string', enum: ['nama', 'harga_per_kg', 'poin_per_kg', 'created_at'])),
            new OA\Parameter(name: 'sort_dir', in: 'query', required: false, schema: new OA\Schema(type: 'string', enum: ['asc', 'desc']))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Daftar kategori sampah unit',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/KategoriSampah')),
                        new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta')
                    ]
                )
            )
        ]
    )]
    public function adminKategorisIndex() {}

    #[OA\Post(
        path: '/api/admin/kategoris',
        summary: 'Tambah Kategori Sampah Baru',
        tags: ['Admin - Kategori Sampah'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['nama', 'jenis', 'harga_per_kg', 'poin_per_kg'],
                properties: [
                    new OA\Property(property: 'nama', type: 'string', example: 'Kardus & Karton Dupleks'),
                    new OA\Property(property: 'jenis', type: 'string', enum: ['plastik', 'kertas', 'logam', 'kaca'], example: 'kertas'),
                    new OA\Property(property: 'harga_per_kg', type: 'number', format: 'float', example: 2500),
                    new OA\Property(property: 'poin_per_kg', type: 'integer', example: 25),
                    new OA\Property(property: 'deskripsi', type: 'string', nullable: true, example: 'Kardus cokelat kemasan kering terlipat rapi'),
                    new OA\Property(property: 'foto_url', type: 'string', nullable: true, example: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Kategori berhasil dibuat', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function adminKategorisStore() {}

    #[OA\Post(
        path: '/api/admin/kategoris/bulk',
        summary: 'Impor Batch Kategori Sampah (CSV / XLSX Parsed Rows)',
        description: 'Endpoint penerima array kategori hasil unggahan spreadsheet CSV / Excel dari modal import frontend.',
        tags: ['Admin - Kategori Sampah'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['items'],
                properties: [
                    new OA\Property(
                        property: 'items',
                        type: 'array',
                        items: new OA\Items(
                            type: 'object',
                            required: ['nama', 'jenis', 'harga_per_kg', 'poin_per_kg'],
                            properties: [
                                new OA\Property(property: 'nama', type: 'string', example: 'Kaleng Aluminium Minuman'),
                                new OA\Property(property: 'jenis', type: 'string', enum: ['plastik', 'kertas', 'logam', 'kaca'], example: 'logam'),
                                new OA\Property(property: 'harga_per_kg', type: 'number', example: 14000),
                                new OA\Property(property: 'poin_per_kg', type: 'integer', example: 140),
                                new OA\Property(property: 'deskripsi', type: 'string', nullable: true, example: 'Kaleng soda bersih dan kempes'),
                                new OA\Property(property: 'foto_url', type: 'string', nullable: true, example: '')
                            ]
                        )
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Semua baris kategori sampah berhasil diimpor',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/KategoriSampah'))
                    ]
                )
            ),
            new OA\Response(response: 422, description: 'Validasi baris spreadsheet gagal', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseError'))
        ]
    )]
    public function adminKategorisBulk() {}

    #[OA\Get(
        path: '/api/admin/kategoris/{id}',
        summary: 'Detail Kategori Sampah',
        tags: ['Admin - Kategori Sampah'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Detail kategori', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function adminKategorisShow() {}

    #[OA\Put(
        path: '/api/admin/kategoris/{id}',
        summary: 'Memperbarui Kategori Sampah',
        tags: ['Admin - Kategori Sampah'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'nama', type: 'string', example: 'Botol PET Bening Super'),
                    new OA\Property(property: 'harga_per_kg', type: 'number', example: 5000),
                    new OA\Property(property: 'poin_per_kg', type: 'integer', example: 50)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Kategori berhasil diupdate', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function adminKategorisUpdate() {}

    #[OA\Delete(
        path: '/api/admin/kategoris/{id}',
        summary: 'Menghapus Kategori Sampah',
        tags: ['Admin - Kategori Sampah'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 204, description: 'Kategori berhasil dihapus')
        ]
    )]
    public function adminKategorisDestroy() {}

    // ═══════════════════════════════════════════════════════════════════════
    // 5. ADMIN UNIT: KATALOG HADIAH & BULK IMPORT
    // ═══════════════════════════════════════════════════════════════════════

    #[OA\Get(
        path: '/api/admin/hadiahs',
        summary: 'Daftar Katalog Hadiah Unit (Admin Unit)',
        tags: ['Admin - Katalog Hadiah'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'search', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'stock_status', in: 'query', required: false, schema: new OA\Schema(type: 'string', enum: ['all', 'tersedia', 'habis'])),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'pageSize', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 15))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Daftar katalog hadiah unit',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Hadiah')),
                        new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta')
                    ]
                )
            )
        ]
    )]
    public function adminHadiahsIndex() {}

    #[OA\Post(
        path: '/api/admin/hadiahs',
        summary: 'Tambah Hadiah Baru',
        tags: ['Admin - Katalog Hadiah'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['nama', 'poin_diperlukan', 'stok'],
                properties: [
                    new OA\Property(property: 'nama', type: 'string', example: 'Beras Premium 2.5 kg'),
                    new OA\Property(property: 'poin_diperlukan', type: 'integer', example: 300),
                    new OA\Property(property: 'stok', type: 'integer', example: 15),
                    new OA\Property(property: 'deskripsi', type: 'string', nullable: true, example: 'Beras putih pulen')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Hadiah berhasil ditambahkan', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function adminHadiahsStore() {}

    #[OA\Post(
        path: '/api/admin/hadiahs/bulk',
        summary: 'Impor Batch Katalog Hadiah (CSV / XLSX Parsed Rows)',
        tags: ['Admin - Katalog Hadiah'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['items'],
                properties: [
                    new OA\Property(
                        property: 'items',
                        type: 'array',
                        items: new OA\Items(
                            type: 'object',
                            required: ['nama', 'poin_diperlukan', 'stok'],
                            properties: [
                                new OA\Property(property: 'nama', type: 'string', example: 'Gula Pasir 1 kg'),
                                new OA\Property(property: 'poin_diperlukan', type: 'integer', example: 120),
                                new OA\Property(property: 'stok', type: 'integer', example: 30),
                                new OA\Property(property: 'deskripsi', type: 'string', nullable: true, example: 'Gula tebu murni 1 kg')
                            ]
                        )
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Semua baris hadiah berhasil diimpor', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function adminHadiahsBulk() {}

    #[OA\Get(
        path: '/api/admin/hadiahs/{id}',
        summary: 'Detail Hadiah',
        tags: ['Admin - Katalog Hadiah'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Detail hadiah', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function adminHadiahsShow() {}

    #[OA\Put(
        path: '/api/admin/hadiahs/{id}',
        summary: 'Perbarui Hadiah',
        tags: ['Admin - Katalog Hadiah'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'stok', type: 'integer', example: 45),
                    new OA\Property(property: 'poin_diperlukan', type: 'integer', example: 115)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Hadiah berhasil diupdate', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function adminHadiahsUpdate() {}

    #[OA\Delete(
        path: '/api/admin/hadiahs/{id}',
        summary: 'Hapus Hadiah',
        tags: ['Admin - Katalog Hadiah'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 204, description: 'Hadiah berhasil dihapus')
        ]
    )]
    public function adminHadiahsDestroy() {}

    // ═══════════════════════════════════════════════════════════════════════
    // 6. ADMIN UNIT: NASABAH, VERIFIKASI & REKAP
    // ═══════════════════════════════════════════════════════════════════════

    #[OA\Get(
        path: '/api/admin/nasabahs',
        summary: 'Daftar Nasabah Terdaftar Pada Unit',
        tags: ['Admin - Nasabah & Verifikasi'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'search', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'pageSize', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 15))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Daftar nasabah unit', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function adminNasabahsIndex() {}

    #[OA\Post(
        path: '/api/admin/nasabahs',
        summary: 'Pendaftaran Manual Nasabah oleh Admin Unit',
        tags: ['Admin - Nasabah & Verifikasi'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'email', 'password'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Siti Rahma'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'siti.rahma@example.com'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'PassNasabah123!'),
                    new OA\Property(property: 'phone', type: 'string', example: '082188997766'),
                    new OA\Property(property: 'address', type: 'string', example: 'RT 04 / RW 02')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Nasabah berhasil didaftarkan', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function adminNasabahsStore() {}

    #[OA\Get(
        path: '/api/admin/nasabahs/{id}',
        summary: 'Detail Informasi & Riwayat Nasabah',
        tags: ['Admin - Nasabah & Verifikasi'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Detail nasabah', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function adminNasabahsShow() {}

    #[OA\Put(
        path: '/api/admin/nasabahs/{id}',
        summary: 'Perbarui Data Nasabah',
        tags: ['Admin - Nasabah & Verifikasi'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Siti Rahmawati'),
                    new OA\Property(property: 'phone', type: 'string', example: '082188997700')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Nasabah berhasil diupdate', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function adminNasabahsUpdate() {}

    #[OA\Delete(
        path: '/api/admin/nasabahs/{id}',
        summary: 'Hapus / Nonaktifkan Nasabah',
        tags: ['Admin - Nasabah & Verifikasi'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 204, description: 'Nasabah berhasil dihapus')
        ]
    )]
    public function adminNasabahsDestroy() {}

    #[OA\Get(
        path: '/api/admin/setorans',
        summary: 'Daftar Setoran Masuk untuk Verifikasi Petugas',
        tags: ['Admin - Nasabah & Verifikasi'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'status', in: 'query', required: false, schema: new OA\Schema(type: 'string', enum: ['all', 'menunggu', 'diterima', 'ditolak'])),
            new OA\Parameter(name: 'search', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'pageSize', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 15))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Daftar setoran untuk diverifikasi',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/SetoranSampah')),
                        new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta')
                    ]
                )
            )
        ]
    )]
    public function adminSetoransIndex() {}

    #[OA\Post(
        path: '/api/admin/setorans/{setoran}/verify',
        summary: 'Verifikasi dan Penimbangan Setoran Sampah',
        description: 'Petugas memasukkan berat aktual hasil penimbangan dan memvalidasi setoran.',
        tags: ['Admin - Nasabah & Verifikasi'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'setoran', in: 'path', required: true, description: 'ID Setoran', schema: new OA\Schema(type: 'integer'))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['status'],
                properties: [
                    new OA\Property(property: 'status', type: 'string', enum: ['diterima', 'ditolak'], example: 'diterima'),
                    new OA\Property(property: 'berat_aktual', type: 'number', format: 'float', example: 4.2, description: 'Wajib diisi jika status diterima'),
                    new OA\Property(property: 'catatan_petugas', type: 'string', nullable: true, example: 'Sampah sudah dipilah bersih')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Setoran berhasil diverifikasi dan poin nasabah bertambah', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function adminSetoransVerify() {}

    #[OA\Get(
        path: '/api/admin/rekap',
        summary: 'Rekapitulasi Laporan & Statistik Bank Sampah Unit',
        tags: ['Admin - Nasabah & Verifikasi'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'period', in: 'query', required: false, schema: new OA\Schema(type: 'string', enum: ['daily', 'weekly', 'monthly', 'yearly'], default: 'monthly')),
            new OA\Parameter(name: 'start_date', in: 'query', required: false, schema: new OA\Schema(type: 'string', format: 'date', example: '2026-01-01')),
            new OA\Parameter(name: 'end_date', in: 'query', required: false, schema: new OA\Schema(type: 'string', format: 'date', example: '2026-03-31'))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Statistik agregasi rekapitulasi',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'total_berat_kg', type: 'number', example: 1450.8),
                                new OA\Property(property: 'total_transaksi', type: 'integer', example: 312),
                                new OA\Property(property: 'total_poin_dikeluarkan', type: 'integer', example: 48200),
                                new OA\Property(property: 'total_nasabah_aktif', type: 'integer', example: 128)
                            ]
                        )
                    ]
                )
            )
        ]
    )]
    public function adminRekap() {}

    // ═══════════════════════════════════════════════════════════════════════
    // 7. PLATFORM OPS / SUPERADMIN MODULE
    // ═══════════════════════════════════════════════════════════════════════

    #[OA\Get(
        path: '/api/ops/dashboard',
        summary: 'Dashboard Global Metrik Platform (Superadmin)',
        tags: ['Platform Ops - Superadmin'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Metrik global platform seluruh unit',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'total_units', type: 'integer', example: 14),
                                new OA\Property(property: 'total_users', type: 'integer', example: 1840),
                                new OA\Property(property: 'total_sampah_kg', type: 'number', example: 12540.5),
                                new OA\Property(property: 'total_penukaran_poin', type: 'integer', example: 240100)
                            ]
                        )
                    ]
                )
            )
        ]
    )]
    public function opsDashboard() {}

    #[OA\Get(
        path: '/api/ops/users',
        summary: 'Daftar Pengguna Seluruh Unit',
        tags: ['Platform Ops - Superadmin'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'search', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'role', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'unit_id', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'pageSize', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 20))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Daftar seluruh pengguna sistem', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function opsUsersIndex() {}

    #[OA\Post(
        path: '/api/ops/users',
        summary: 'Buat Pengguna Baru Lintas Unit',
        tags: ['Platform Ops - Superadmin'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'email', 'password', 'role', 'unit_id'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Koordinator Unit Baru'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'koordinator@banksampah.id'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'PassMaster123!'),
                    new OA\Property(property: 'role', type: 'string', enum: ['nasabah', 'admin_unit', 'petugas', 'superadmin'], example: 'admin_unit'),
                    new OA\Property(property: 'unit_id', type: 'integer', example: 2)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Pengguna berhasil dibuat', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function opsUsersStore() {}

    #[OA\Put(
        path: '/api/ops/users/{user}',
        summary: 'Perbarui Pengguna & Role / Unit',
        tags: ['Platform Ops - Superadmin'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'user', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'role', type: 'string', example: 'petugas'),
                    new OA\Property(property: 'unit_id', type: 'integer', example: 3)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Pengguna berhasil diupdate', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function opsUsersUpdate() {}

    #[OA\Delete(
        path: '/api/ops/users/{user}',
        summary: 'Hapus Pengguna',
        tags: ['Platform Ops - Superadmin'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'user', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 204, description: 'Pengguna berhasil dihapus')
        ]
    )]
    public function opsUsersDestroy() {}

    #[OA\Get(
        path: '/api/ops/roles',
        summary: 'Daftar Peran Sistem',
        tags: ['Platform Ops - Superadmin'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Daftar peran yang didukung', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function opsRoles() {}

    #[OA\Get(
        path: '/api/ops/units',
        summary: 'Daftar Seluruh Unit Bank Sampah',
        tags: ['Platform Ops - Superadmin'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Daftar semua unit bank sampah', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function opsUnitsIndex() {}

    #[OA\Post(
        path: '/api/ops/units',
        summary: 'Pendaftaran Unit Bank Sampah Baru',
        tags: ['Platform Ops - Superadmin'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'kode'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Bank Sampah Berkah Hijau'),
                    new OA\Property(property: 'kode', type: 'string', example: 'BSBH-02'),
                    new OA\Property(property: 'alamat', type: 'string', nullable: true, example: 'Jl. Kamboja No. 10'),
                    new OA\Property(property: 'telepon', type: 'string', nullable: true, example: '085612345678')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Unit bank sampah berhasil didaftarkan', content: new OA\JsonContent(ref: '#/components/schemas/ApiResponseSuccess'))
        ]
    )]
    public function opsUnitsStore() {}
}
