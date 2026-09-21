'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreatePenukaran } from '@/lib/queries/penukaran.queries';
import { useAuthStore } from '@/lib/auth';
import type { Hadiah } from '@/lib/types';

interface TukarHadiahModalProps {
  hadiah: Hadiah | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TukarHadiahModal({
  hadiah,
  isOpen,
  onClose,
  onSuccess,
}: TukarHadiahModalProps) {
  const { user } = useAuthStore();
  const currentPoints = user?.nasabah_profile?.saldo_poin ?? 0;
  const createPenukaran = useCreatePenukaran();

  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !hadiah) return null;

  const pointsAfter = currentPoints - hadiah.poin_diperlukan;
  const isEnough = pointsAfter >= 0;

  const handleRedeem = async () => {
    if (!isEnough) {
      setErrorMsg('Saldo poin Anda belum mencukupi untuk menukar hadiah ini.');
      return;
    }

    setErrorMsg('');
    try {
      await createPenukaran.mutateAsync({ hadiah_id: hadiah.id });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess?.();
        onClose();
      }, 1400);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal menukar poin. Silakan coba beberapa saat lagi.';
      setErrorMsg(message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-md bg-white rounded-[4px] shadow-2xl border border-stone-200 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#1F6B3F] uppercase tracking-wider">
                Konfirmasi Penukaran
              </span>
              <h2 className="font-display text-lg font-bold text-stone-900">
                Tukar Poin Hadiah
              </h2>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-[4px] border border-stone-200 hover:bg-stone-200/50 flex items-center justify-center text-stone-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {isSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1F6B3F]/10 text-[#0B3D26] flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-semibold text-stone-900">
                  Penukaran Berhasil!
                </h3>
                <p className="text-xs text-[#7C8574] max-w-xs mx-auto">
                  Voucher/hadiah Anda telah tercatat dan dapat diambil di kantor unit bank sampah.
                </p>
              </div>
            ) : (
              <>
                {errorMsg && (
                  <div className="p-3 text-xs bg-rose-50 text-rose-800 border border-rose-200 rounded-[4px]">
                    {errorMsg}
                  </div>
                )}

                {/* Hadiah Card Preview */}
                <div className="flex gap-4 p-3.5 border border-stone-200 rounded-[4px] bg-[#FAF8F5]">
                  {hadiah.foto_url && (
                    <div className="relative w-20 h-20 rounded-[4px] overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                      <Image
                        src={hadiah.foto_url}
                        alt={hadiah.nama}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">{hadiah.nama}</h4>
                    <p className="text-[11px] text-[#7C8574] mt-0.5 line-clamp-2 leading-relaxed">
                      {hadiah.deskripsi}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-[#0B3D26]">
                        {hadiah.poin_diperlukan} POIN
                      </span>
                      <span className="text-[11px] text-stone-400">• Stok: {hadiah.stok}</span>
                    </div>
                  </div>
                </div>

                {/* Point Balance Breakdown */}
                <div className="space-y-2 border border-stone-200 rounded-[4px] p-3.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Saldo Poin Anda Saat Ini:</span>
                    <span className="font-semibold text-stone-900">{currentPoints} Poin</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Poin yang Ditukarkan:</span>
                    <span className="font-semibold text-rose-700">-{hadiah.poin_diperlukan} Poin</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between font-semibold">
                    <span className="text-stone-900">Sisa Saldo Poin:</span>
                    <span className={isEnough ? 'text-[#0B3D26]' : 'text-rose-600'}>
                      {isEnough ? `${pointsAfter} Poin` : 'Poin Kurang'}
                    </span>
                  </div>
                </div>

                {!isEnough && (
                  <p className="text-[11px] text-rose-600 bg-rose-50 p-2.5 rounded-[4px] border border-rose-200">
                    Kumpulkan {hadiah.poin_diperlukan - currentPoints} poin lagi dengan menyetorkan sampah anorganik ke unit bank sampah Anda.
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleRedeem}
                    disabled={!isEnough || createPenukaran.isPending}
                    className="px-5 py-2 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-[#F1ECDF] text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {createPenukaran.isPending ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Konfirmasi & Tukar'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
