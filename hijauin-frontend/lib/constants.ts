/**
 * Constants shared across the frontend.
 * Mirrors backend Enums — keep in sync.
 */

// ── Status Labels ──────────────────────────────────────

export const STATUS_SETORAN_LABELS: Record<string, string> = {
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  diverifikasi: 'Diverifikasi',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
} as const;

export const STATUS_PENUKARAN_LABELS: Record<string, string> = {
  diproses: 'Diproses',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
} as const;

export const JENIS_SAMPAH_LABELS: Record<string, string> = {
  plastik: 'Plastik',
  kertas: 'Kertas',
  logam: 'Logam',
  kaca: 'Kaca',
} as const;

// ── Material Colors (from DESIGN.md §3) ────────────────

export const JENIS_SAMPAH_COLORS: Record<string, string> = {
  plastik: '#2F7DB8',
  kertas: '#B8873A',
  logam: '#8A94A0',
  kaca: '#4FA6A0',
} as const;

// ── Status Colors ──────────────────────────────────────

export const STATUS_SETORAN_COLORS: Record<string, string> = {
  menunggu_konfirmasi: '#B8873A', // Amber/pending
  diverifikasi: '#2F7DB8',       // Blue/processing
  selesai: '#4FA65C',            // Green/success
  ditolak: '#C1441F',            // Red/rejected
} as const;

export const STATUS_PENUKARAN_COLORS: Record<string, string> = {
  diproses: '#2F7DB8',
  selesai: '#4FA65C',
  dibatalkan: '#C1441F',
} as const;

// ── Pagination ─────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 15;
