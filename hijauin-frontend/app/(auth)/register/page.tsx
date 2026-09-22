'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { registerSchema, type RegisterInput } from '@/lib/schemas/auth.schema';
import { useRegister, useUnits } from '@/lib/queries/auth.queries';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import Combobox, { type ComboboxOption } from '@/components/common/Combobox';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useAuthStore, getDefaultDashboard } from '@/lib/auth';

/**
 * Editorial Nasabah Registration Screen.
 * Conforms to docs/DESIGN.md:
 * - Fraunces display typography
 * - Dynamic Bank Sampah Unit selection via Combobox
 * - Google Auth instant onboarding
 * - 4px radius controls
 */
export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const { data: units, isLoading: loadingUnits } = useUnits();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      unit_id: 1,
    },
  });

  const selectedUnitId = watch('unit_id');

  const unitOptions: ComboboxOption[] = useMemo(() => {
    if (!units) return [];
    return units.map((u) => ({
      value: u.id,
      label: u.nama,
      description: u.alamat || undefined,
      badge: {
        text: 'UNIT RESMI',
        color: '#1F6B3F',
        bgColor: '#1F6B3F15',
      },
      meta: u.telepon ? `Kontak: ${u.telepon}` : undefined,
    }));
  }, [units]);

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerMutation.mutateAsync({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        unit_id: Number(data.unit_id),
        phone: data.phone || undefined,
        alamat: data.alamat || undefined,
      }); 
      const currentUser = useAuthStore.getState().user;
      router.push(getDefaultDashboard(currentUser));
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3D26] tracking-tight">
          Daftar Jadi Nasabah
        </h1>
        <p className="text-sm text-stone-600 font-sans">
          Buka buku rekening bank sampah digital dan mulai menabung dari sampah terpilah.
        </p>
      </div>

      {/* Google Auth Quick Sign-Up */}
      <div className="space-y-3">
        <GoogleAuthButton mode="register" unitId={selectedUnitId} />

        {/* Hairline Divider */}
        <div className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-stone-200" />
          <span className="text-xs text-[#7C8574] font-medium uppercase tracking-wider whitespace-nowrap">
            atau lengkapi formulir
          </span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>
      </div>

      {/* Error Banner */}
      {registerMutation.error && (
        <div className="rounded-[4px] border border-[#C1441F]/30 bg-red-50/80 p-3.5 text-xs text-[#C1441F] font-medium">
          {(registerMutation.error as { message?: string })?.message ||
            'Pendaftaran gagal. Pastikan email belum pernah terdaftar sebelumnya.'}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nama Lengkap */}
        <div className="space-y-1.5">
          <label htmlFor="full_name" className="block text-xs font-semibold text-stone-800">
            Nama Lengkap Sesuai KTP
          </label>
          <input
            id="full_name"
            type="text"
            {...register('full_name')}
            placeholder="Contoh: Budi Santoso"
            className={`w-full rounded-[4px] border bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] transition-colors ${
              errors.full_name ? 'border-[#C1441F]' : 'border-stone-300'
            }`}
          />
          {errors.full_name && (
            <p className="text-xs text-[#C1441F]">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email & Telepon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-stone-800">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              placeholder="nasabah@gmail.com"
              className={`w-full rounded-[4px] border bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] transition-colors ${
                errors.email ? 'border-[#C1441F]' : 'border-stone-300'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-[#C1441F]">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-xs font-semibold text-stone-800">
              No. Telepon / WhatsApp
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="0812-xxxx-xxxx"
              className="w-full rounded-[4px] border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] transition-colors"
            />
          </div>
        </div>

        {/* Pilihan Unit Bank Sampah */}
        <div className="space-y-1.5">
          <label htmlFor="unit_id" className="block text-xs font-semibold text-stone-800">
            Pilih Unit Bank Sampah Terdekat
          </label>
          <Combobox
            options={unitOptions}
            value={selectedUnitId}
            onChange={(val) => setValue('unit_id', Number(val), { shouldValidate: true })}
            placeholder={loadingUnits ? 'Memuat unit bank sampah...' : 'Pilih unit bank sampah terdekat...'}
            searchPlaceholder="Cari berdasarkan nama atau lokasi unit..."
            error={errors.unit_id?.message}
          />
        </div>

        {/* Alamat Domisili */}
        <div className="space-y-1.5">
          <label htmlFor="alamat" className="block text-xs font-semibold text-stone-800">
            Alamat Domisili (RT / RW / Kelurahan)
          </label>
          <input
            id="alamat"
            type="text"
            {...register('alamat')}
            placeholder="Contoh: Jl. Melati No. 12, RT 03/RW 05"
            className="w-full rounded-[4px] border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] transition-colors"
          />
        </div>

        {/* Password & Konfirmasi Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PasswordInput
            id="password"
            label="Password"
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            showStrength
            error={errors.password?.message}
            {...register('password')}
          />

          <PasswordInput
            id="password_confirmation"
            label="Konfirmasi Password"
            autoComplete="new-password"
            placeholder="Ulangi password"
            error={errors.password_confirmation?.message}
            {...register('password_confirmation')}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || registerMutation.isPending}
          className="w-full rounded-[4px] bg-[#0B3D26] py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#1F6B3F] active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
        >
          {registerMutation.isPending ? 'Mendaftarkan Akun...' : 'Daftar Sebagai Nasabah'}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="pt-2 text-center text-xs text-stone-600">
        Sudah memiliki akun nasabah?{' '}
        <Link
          href="/login"
          className="font-semibold text-[#0B3D26] hover:text-[#1F6B3F] underline underline-offset-2 transition-colors"
        >
          Masuk ke Portal
        </Link>
      </div>
    </motion.div>
  );
}
