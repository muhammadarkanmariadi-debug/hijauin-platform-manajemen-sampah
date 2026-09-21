/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/auth';
import { useUpdateProfile } from '@/lib/queries/auth.queries';
import CloudinaryImageUpload from '@/components/common/CloudinaryImageUpload';

/**
 * Editorial Nasabah Profile & Account Settings Page.
 *
 * Implements docs/DESIGN.md:
 * - Editorial typography with Fraunces headline
 * - Editable profile information (full_name, phone, alamat, photo_url)
 * - Cloudinary image upload integration
 * - Bank sampah unit membership card
 */
export default function ProfilPage() {
  const { user, refreshUser } = useAuthStore();
  const profile = user?.nasabah_profile;
  const unit = profile?.unit || user?.user_roles?.[0]?.unit;

  const updateProfileMutation = useUpdateProfile();

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [alamat, setAlamat] = useState(profile?.alamat ?? '');
  const [photoUrl, setPhotoUrl] = useState(user?.photo_url ?? '');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? '');
      setPhone(user.phone ?? '');
      setAlamat(profile?.alamat ?? '');
      setPhotoUrl(user.photo_url ?? '');
    }
  }, [user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateProfileMutation.mutateAsync({
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
        alamat: alamat.trim() || undefined,
        photo_url: photoUrl.trim() || null,
      });

      setSuccessMsg('Profil akun Anda berhasil diperbarui!');
      setTimeout(() => setSuccessMsg(''), 4000);
      refreshUser();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal memperbarui profil. Silakan coba lagi.';
      setErrorMsg(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-8 max-w-4xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F6B3F]">
              Akun & Keanggotaan
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-[#7C8574]">Portal Nasabah</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Profil Nasabah
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-[4px] bg-[#1F6B3F]/10 border border-[#1F6B3F]/20 text-xs font-semibold text-[#0B3D26] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1F6B3F]" />
            Status: Nasabah Aktif
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Edit Profile (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[4px] bg-white border border-stone-200 p-6 shadow-sm">
            <h2 className="font-display text-base font-semibold text-stone-900 mb-1">
              Data Pribadi Nasabah
            </h2>
            <p className="text-xs text-[#7C8574] mb-6">
              Perbarui informasi kontak untuk mempermudah konfirmasi penjemputan atau pengambilan hadiah.
            </p>

            {successMsg && (
              <div className="mb-5 p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[4px] flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="mb-5 p-3 text-xs bg-rose-50 text-rose-800 border border-rose-200 rounded-[4px]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Photo / Avatar Upload */}
              <CloudinaryImageUpload
                label="Foto Profil Nasabah"
                value={photoUrl}
                onChange={(url) => setPhotoUrl(url)}
                onRemove={() => setPhotoUrl('')}
                folder="hijauin/profiles"
              />

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Alamat Email (Akun Utama)
                </label>
                <input
                  type="email"
                  value={user?.email ?? ''}
                  disabled
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-200 rounded-[4px] bg-stone-100 text-stone-500 cursor-not-allowed"
                />
                <p className="mt-1 text-[11px] text-stone-400">
                  Email akun terhubung dengan autentikasi utama dan tidak dapat diubah di sini.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Alamat Domisili Lengkap
                </label>
                <textarea
                  rows={3}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Jl. Mawar No. 12, RT 02/RW 04, Kelurahan..."
                  className="w-full text-xs p-3.5 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-6 py-2.5 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-[#F1ECDF] text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menyimpan Perubahan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Info: Unit & Account Membership (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Unit Card */}
          <div className="rounded-[4px] bg-white border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4FA65C]" />
              <h3 className="font-display text-sm font-semibold text-stone-900">
                Unit Bank Sampah Terdaftar
              </h3>
            </div>

            <div className="p-4 rounded-[4px] bg-[#FAF8F5] border border-stone-200 space-y-2">
              <p className="text-xs font-bold text-[#0B3D26]">
                {unit?.nama || 'Bank Sampah Hijau Lestari (Pusat)'}
              </p>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {unit?.alamat || 'Jl. Boulevard Hijau No. 12, Bekasi'}
              </p>
              {unit?.telepon && (
                <p className="text-[11px] font-medium text-stone-800">
                  Kontak Unit: {unit.telepon}
                </p>
              )}
            </div>

            <p className="text-[11px] text-[#7C8574] leading-relaxed">
              Semua penyetoran dan penukaran hadiah Anda diproses oleh petugas di unit bank sampah di atas.
            </p>
          </div>

          {/* Account Summary Card */}
          <div className="rounded-[4px] bg-white border border-stone-200 p-6 shadow-sm space-y-3 text-xs">
            <h3 className="font-display text-sm font-semibold text-stone-900">
              Ringkasan Akun
            </h3>
            <div className="divide-y divide-stone-100">
              <div className="py-2.5 flex justify-between">
                <span className="text-stone-500">ID Nasabah</span>
                <span className="font-mono font-medium text-stone-900">#{profile?.id ?? '—'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-stone-500">Saldo Poin Saat Ini</span>
                <span className="font-display font-bold text-[#0B3D26]">
                  {profile?.saldo_poin?.toLocaleString('id-ID') ?? 0} Poin
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-stone-500">Peran Sistem</span>
                <span className="font-medium text-stone-900">Nasabah Warga</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
