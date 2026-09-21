/**
 * Shared TypeScript types matching backend API Resources.
 * Keep in sync with backend Enums and Models.
 */

// ── Enums (mirrors backend App\Enums) ──────────────────

export type StatusSetoran = 'menunggu_konfirmasi' | 'diverifikasi' | 'selesai' | 'ditolak';
export type StatusPenukaran = 'diproses' | 'selesai' | 'dibatalkan';
export type JenisSampah = 'plastik' | 'kertas' | 'logam' | 'kaca';
export type RoleCode = 'nasabah' | 'admin_unit' | 'platform_ops';

// ── API Envelope (TRD §3) ──────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  statusCode: number;
  success: false;
  message: string;
  errors: FieldError[];
  timestamp: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

// ── Auth ────────────────────────────────────────────────

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  created_at?: string;
  user_roles?: UserRole[];
  nasabah_profile?: NasabahProfile | null;
}

export interface UserRole {
  id: number;
  user_id: number;
  role_id: number;
  unit_id: number | null;
  role?: Role;
  unit?: BankSampahUnit;
}

export interface Permission {
  id: number;
  code: string;
  name: string;
  module?: string;
  description?: string | null;
}

export interface Role {
  id: number;
  code: RoleCode;
  name: string;
  description?: string | null;
  permissions?: Permission[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ── Domain Entities ─────────────────────────────────────

export interface BankSampahUnit {
  id: number;
  nama: string;
  alamat: string | null;
  telepon: string | null;
  deskripsi: string | null;
}

export interface NasabahProfile {
  id: number;
  user_id: number;
  unit_id: number;
  alamat: string | null;
  saldo_poin: number;
  user?: User;
  unit?: BankSampahUnit;
}

export interface KategoriSampah {
  id: number;
  unit_id: number;
  nama: string;
  jenis: JenisSampah;
  harga_per_kg: number;
  poin_per_kg: number;
  deskripsi: string | null;
  foto_url: string | null;
}

export interface SetorSampah {
  id: number;
  nasabah_profile_id: number;
  tanggal: string;
  status: StatusSetoran;
  catatan: string | null;
  verified_by_user_id: number | null;
  verified_at: string | null;
  details?: DetailSetor[];
  nasabah_profile?: NasabahProfile;
  verified_by?: User;
}

export interface DetailSetor {
  id: number;
  setor_sampah_id: number;
  kategori_sampah_id: number;
  berat_kg_estimasi: number;
  berat_kg_real: number | null;
  subtotal_poin: number | null;
  kategori_sampah?: KategoriSampah;
}

export interface Hadiah {
  id: number;
  unit_id: number;
  nama: string;
  deskripsi: string | null;
  poin_diperlukan: number;
  stok: number;
  foto_url: string | null;
}

export interface PenukaranPoin {
  id: number;
  nasabah_profile_id: number;
  hadiah_id: number;
  poin_ditukar: number;
  status: StatusPenukaran;
  idempotency_key: string;
  hadiah?: Hadiah;
}

// ── Recap ───────────────────────────────────────────────

export interface RekapBreakdown {
  jenis: JenisSampah;
  total_kg: number;
  total_poin: number;
  jumlah_item: number;
}

export interface RekapMonthlyTrend {
  month: number;
  year: number;
  label: string;
  total_kg: number;
  total_poin: number;
  jumlah_setoran: number;
  breakdown: Record<JenisSampah, number>;
}

export interface RekapGrowth {
  kg_growth_percent: number | null;
  poin_growth_percent: number | null;
  prev_total_kg: number;
  prev_total_poin: number;
}

export interface RekapResponse {
  period: { month: number; year: number };
  totals: {
    total_kg: number;
    total_poin: number;
    jumlah_setoran: number;
    avg_kg_per_setoran: number;
  };
  growth?: RekapGrowth;
  breakdown: RekapBreakdown[];
  trend?: RekapMonthlyTrend[];
}

