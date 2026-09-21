import { z } from 'zod';

/**
 * Waste submission validation schemas.
 */

const setoranItemSchema = z.object({
  kategori_sampah_id: z
    .number({ message: 'Kategori wajib dipilih' })
    .int()
    .positive(),
  berat_kg_estimasi: z
    .number({ message: 'Berat estimasi wajib diisi' })
    .positive('Berat harus lebih dari 0'),
});

export const createSetoranSchema = z.object({
  tanggal: z
    .string()
    .min(1, 'Tanggal wajib diisi'),
  catatan: z
    .string()
    .optional()
    .or(z.literal('')),
  items: z
    .array(setoranItemSchema)
    .min(1, 'Minimal 1 item sampah'),
});

export type CreateSetoranInput = z.infer<typeof createSetoranSchema>;

/**
 * Verification schema — admin verifies with per-item outcomes (TRD §4).
 */
const verifyItemSchema = z.object({
  detail_setor_id: z.number().int().positive(),
  berat_kg_real: z
    .number({ message: 'Berat aktual wajib diisi' })
    .min(0, 'Berat tidak boleh negatif'),
  accepted: z.boolean(),
});

export const verifySetoranSchema = z.object({
  items: z
    .array(verifyItemSchema)
    .min(1, 'Minimal 1 item untuk diverifikasi'),
});

export type VerifySetoranInput = z.infer<typeof verifySetoranSchema>;
