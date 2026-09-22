'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth.schema';
import { useLogin } from '@/lib/queries/auth.queries';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { PasswordInput } from '@/components/ui/PasswordInput';

import { useAuthStore, getDefaultDashboard } from '@/lib/auth';

/**
 * Editorial Login Screen.
 * Conforms to docs/DESIGN.md:
 * - Fraunces display typography for headline
 * - Crisp grotesk for labels and inputs
 * - 4px radius controls
 * - Google Auth integration
 */
export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginMutation.mutateAsync(data);
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
      {/* Title & Introduction */}
      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3D26] tracking-tight">
          Masuk ke Portal
        </h1>
        <p className="text-sm text-stone-600 font-sans">
          Akses buku tabungan digital, pantau saldo poin, dan ajukan penukaran hadiah.
        </p>
      </div>

      {/* Google Sign-in */}
      <div className="space-y-3">
        <GoogleAuthButton mode="login" />

        {/* Hairline Divider */}
        <div className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-stone-200" />
          <span className="text-xs text-[#7C8574] font-medium uppercase tracking-wider whitespace-nowrap">
            atau gunakan email
          </span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>
      </div>

      {/* Error Banner */}
      {loginMutation.error && (
        <div className="rounded-[4px] border border-[#C1441F]/30 bg-red-50/80 p-3.5 text-xs text-[#C1441F] font-medium">
          {(loginMutation.error as { message?: string })?.message ||
            'Email atau password yang Anda masukkan tidak sesuai.'}
        </div>
      )}

      {/* Form Credentials */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-stone-800"
          >
            Alamat Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            placeholder="nasabah@contoh.id"
            className={`w-full rounded-[4px] border bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] transition-colors ${
              errors.email ? 'border-[#C1441F]' : 'border-stone-300'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-[#C1441F]">{errors.email.message}</p>
          )}
        </div>

        <PasswordInput
          id="password"
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <button
          type="submit"
          disabled={isSubmitting || loginMutation.isPending}
          className="w-full rounded-[4px] bg-[#0B3D26] py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#1F6B3F] active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loginMutation.isPending ? 'Memverifikasi...' : 'Masuk ke Akun'}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="pt-2 text-center text-xs text-stone-600">
        Belum memiliki akun nasabah?{' '}
        <Link
          href="/register"
          className="font-semibold text-[#0B3D26] hover:text-[#1F6B3F] underline underline-offset-2 transition-colors"
        >
          Daftar Sekarang
        </Link>
      </div>
    </motion.div>
  );
}
