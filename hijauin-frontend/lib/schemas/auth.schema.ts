import { z } from 'zod';

/**
 * Auth form validation schemas.
 */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi'),
});

export const registerSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Nama lengkap wajib diisi')
    .max(255, 'Nama terlalu panjang'),
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter'),
  password_confirmation: z
    .string()
    .min(1, 'Konfirmasi password wajib diisi'),
  unit_id: z
    .number({ message: 'Unit wajib dipilih' })
    .int()
    .positive('Unit wajib dipilih'),
  phone: z
    .string()
    .max(20, 'Nomor telepon terlalu panjang')
    .optional()
    .or(z.literal('')),
  alamat: z
    .string()
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Password tidak cocok',
  path: ['password_confirmation'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
