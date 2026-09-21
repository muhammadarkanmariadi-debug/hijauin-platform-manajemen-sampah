import { z } from 'zod';

/**
 * Admin CRUD validation schemas.
 */

// ── Nasabah ─────────────────────────────────────────────

export const createNasabahSchema = z.object({
  full_name: z.string().min(1, 'Nama wajib diisi').max(255),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  phone: z.string().max(20).optional().or(z.literal('')),
  alamat: z.string().optional().or(z.literal('')),
});

export const updateNasabahSchema = z.object({
  full_name: z.string().min(1).max(255).optional(),
  phone: z.string().max(20).optional().or(z.literal('')),
  alamat: z.string().optional().or(z.literal('')),
});

export type CreateNasabahInput = z.infer<typeof createNasabahSchema>;
export type UpdateNasabahInput = z.infer<typeof updateNasabahSchema>;

// ── Kategori Sampah ─────────────────────────────────────

export const kategoriSchema = z.object({
  nama: z.string().min(1, 'Nama kategori wajib diisi').max(255),
  jenis: z.enum(['plastik', 'kertas', 'logam', 'kaca'], {
    message: 'Jenis sampah wajib dipilih',
  }),
  harga_per_kg: z.number().min(0, 'Harga tidak boleh negatif'),
  poin_per_kg: z.number().int().min(0, 'Poin tidak boleh negatif'),
  deskripsi: z.string().optional().or(z.literal('')),
  foto_url: z.string().optional().or(z.literal('')),
});

export type KategoriInput = z.infer<typeof kategoriSchema>;

// ── Hadiah ──────────────────────────────────────────────

export const hadiahSchema = z.object({
  nama: z.string().min(1, 'Nama hadiah wajib diisi').max(255),
  deskripsi: z.string().optional().or(z.literal('')),
  poin_diperlukan: z.number().int().min(1, 'Poin minimal 1'),
  stok: z.number().int().min(0, 'Stok tidak boleh negatif'),
  foto_url: z.string().optional().or(z.literal('')),
});

export type HadiahInput = z.infer<typeof hadiahSchema>;
