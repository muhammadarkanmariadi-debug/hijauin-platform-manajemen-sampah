'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMe, useUnits, useUpdateProfile } from '@/lib/queries/auth.queries';
import { useAuthStore, getDefaultDashboard } from '@/lib/auth';
import Combobox, { type ComboboxOption } from '@/components/common/Combobox';

export default function OnboardingPage() {
  const router = useRouter();
  const { user: authUser } = useAuthStore();
  const { data: meUser, isLoading: isMeLoading } = useMe();
  const { data: units = [], isLoading: isUnitsLoading } = useUnits();
  const updateProfileMutation = useUpdateProfile();

  const currentUser = meUser || authUser;

  const [selectedUnitId, setSelectedUnitId] = useState<number | undefined>(undefined);
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [alamat, setAlamat] = useState(currentUser?.nasabah_profile?.alamat || '');
  const [errorMessage, setErrorMessage] = useState('');

  const effectiveUnitId =
    selectedUnitId ??
    currentUser?.nasabah_profile?.unit_id ??
    currentUser?.user_roles?.[0]?.unit_id ??
    (units.length > 0 ? units[0].id : undefined);

  // Transform units to rich Combobox options
  const unitOptions: ComboboxOption[] = useMemo(() => {
    return units.map((u) => ({
      value: u.id,
      label: u.nama,
      description: u.alamat ? `${u.alamat} (${u.telepon || 'Tanpa Kontak'})` : u.deskripsi || '',
      badge: {
        text: 'UNIT TERVERIFIKASI',
        color: '#1F6B3F',
        bgColor: '#1F6B3F15',
      },
    }));
  }, [units]);

  const selectedUnit = useMemo(() => {
    return units.find((u) => u.id === effectiveUnitId);
  }, [units, effectiveUnitId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!effectiveUnitId) {
      setErrorMessage('Silakan pilih salah satu Unit Bank Sampah terdekat.');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        unit_id: Number(effectiveUnitId),
        phone: phone.trim() || undefined,
        alamat: alamat.trim() || undefined,
      });

      // Navigate to dashboard
      const updatedUser = useAuthStore.getState().user;
      router.push(getDefaultDashboard(updatedUser));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal memperbarui profil bank sampah. Silakan coba kembali.';
      setErrorMessage(msg);
    }
  };

  const handleSkip = () => {
    router.push(getDefaultDashboard(currentUser));
  };

  if (isMeLoading && !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
        <div className="w-6 h-6 border-2 border-[#0B3D26] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Memuat profil akun Anda...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full space-y-6"
    >
      {/* Title & Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#1F6B3F]/10 border border-[#1F6B3F]/20 text-[11px] font-semibold text-[#1F6B3F]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Langkah Terakhir: Penugasan Unit
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3D26] tracking-tight">
          Pilih Unit Bank Sampah Anda
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
          Akun Google Anda telah terdaftar. Tentukan unit bank sampah terdekat untuk menampung setoran sampah daur ulang dan klaim hadiah sembako Anda.
        </p>
      </div>

      {/* Verified Google Account Summary Card */}
      <div className="p-3.5 rounded-[4px] bg-stone-50 border border-stone-200/80 flex items-center gap-3">
        {currentUser?.photo_url ? (
          <Image
            src={currentUser.photo_url}
            alt={currentUser.full_name || 'User Profile'}
            width={44}
            height={44}
            className="rounded-full object-cover border border-stone-200"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#0B3D26]/10 border border-[#0B3D26]/20 flex items-center justify-center text-sm font-bold text-[#0B3D26]">
            {currentUser?.full_name?.charAt(0) || 'N'}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold text-stone-900 truncate">
              {currentUser?.full_name || 'Nasabah Baru'}
            </p>
            <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-100 text-emerald-800">
              Google Verified
            </span>
          </div>
          <p className="text-[11px] text-stone-500 truncate">{currentUser?.email}</p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 rounded-[4px] bg-red-50 border border-red-200 text-xs text-[#C1441F] font-medium flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-[#C1441F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Onboarding Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank Sampah Unit Combobox */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-stone-800">
            Unit Bank Sampah Terdekat <span className="text-[#C1441F]">*</span>
          </label>
          {isUnitsLoading ? (
            <div className="w-full h-10 rounded-[4px] border border-stone-200 bg-stone-100 animate-pulse" />
          ) : (
            <Combobox
              options={unitOptions}
              value={effectiveUnitId ?? ''}
              onChange={(val) => setSelectedUnitId(val ? Number(val) : undefined)}
              placeholder="Cari atau pilih unit bank sampah..."
              searchPlaceholder="Ketik nama unit atau alamat cabang..."
            />
          )}

          {selectedUnit && (
            <div className="p-2.5 rounded-[4px] bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-0.5">
              <p className="font-semibold text-stone-800">{selectedUnit.nama}</p>
              {selectedUnit.alamat && <p>📍 {selectedUnit.alamat}</p>}
              {selectedUnit.telepon && <p>📞 {selectedUnit.telepon}</p>}
            </div>
          )}
        </div>

        {/* Nomor WhatsApp */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-xs font-semibold text-stone-800">
            Nomor WhatsApp / HP <span className="text-stone-400 font-normal">(Opsional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="w-full rounded-[4px] border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] transition-colors"
          />
          <p className="text-[10px] text-stone-500">
            Digunakan untuk konfirmasi setoran & notifikasi pengambilan hadiah.
          </p>
        </div>

        {/* Alamat Domisili */}
        <div className="space-y-1.5">
          <label htmlFor="alamat" className="block text-xs font-semibold text-stone-800">
            Alamat Domisili Tempat Tinggal <span className="text-stone-400 font-normal">(Opsional)</span>
          </label>
          <textarea
            id="alamat"
            rows={2}
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            placeholder="Contoh: RT 03/RW 05, Kelurahan Cilandak Barat"
            className="w-full rounded-[4px] border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] transition-colors resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending || !effectiveUnitId}
            className="w-full rounded-[4px] bg-[#0B3D26] py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#1F6B3F] active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {updateProfileMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan Pengaturan...</span>
              </>
            ) : (
              <span>Selesai & Masuk ke Dashboard</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-2 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
          >
            Lewati & Atur Nanti di Profil
          </button>
        </div>
      </form>
    </motion.div>
  );
}
