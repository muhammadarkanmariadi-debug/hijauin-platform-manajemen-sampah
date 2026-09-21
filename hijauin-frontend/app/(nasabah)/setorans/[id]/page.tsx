'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSetoran } from '@/lib/queries/setoran.queries';
import type { StatusSetoran } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SetoranDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);
  const { data: setoran, isLoading, error } = useSetoran(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-[#0B3D26] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-stone-500">Memuat rincian setoran...</p>
        </div>
      </div>
    );
  }

  if (error || !setoran) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-stone-600">Data setoran tidak ditemukan atau terjadi kesalahan.</p>
        <Link
          href="/setorans"
          className="inline-block text-xs font-semibold text-[#1F6B3F] hover:underline"
        >
          ← Kembali ke Daftar Setoran
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: StatusSetoran) => {
    switch (status) {
      case 'diverifikasi':
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-[4px] bg-[#1F6B3F]/10 text-[#0B3D26] border border-[#1F6B3F]/20">
            <span className="w-2 h-2 rounded-full bg-[#1F6B3F]" />
            Terverifikasi & Poin Diterima
          </span>
        );
      case 'menunggu_konfirmasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-[4px] bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Menunggu Penimbangan di Unit
          </span>
        );
      case 'ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-[4px] bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            Setoran Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-[4px] bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  const totalKgEstimasi =
    setoran.details?.reduce((acc, d) => acc + Number(d.berat_kg_estimasi || 0), 0) ?? 0;
  const totalKgReal =
    setoran.details?.reduce((acc, d) => acc + Number(d.berat_kg_real || 0), 0) ?? 0;
  const totalPoin =
    setoran.details?.reduce((acc, d) => acc + Number(d.subtotal_poin || 0), 0) ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Breadcrumb */}
      <div>
        <Link
          href="/setorans"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#1F6B3F] hover:text-[#0B3D26] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Riwayat Setoran
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold text-stone-500">
              Transaksi #{setoran.id}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-[#7C8574]">
              {new Intl.DateTimeFormat('id-ID', {
                dateStyle: 'full',
              }).format(new Date(setoran.tanggal))}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Rincian Setoran Sampah
          </h1>
        </div>

        <div>{getStatusBadge(setoran.status)}</div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[4px] bg-white border border-stone-200 p-4">
          <span className="text-[11px] font-semibold text-[#7C8574] uppercase tracking-wider">
            Total Poin Diperoleh
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-[#0B3D26]">
              {totalPoin > 0 ? `+${totalPoin}` : '—'}
            </span>
            <span className="text-xs text-[#1F6B3F]">Poin</span>
          </div>
          <p className="mt-1 text-[11px] text-[#7C8574]">
            {setoran.status === 'diverifikasi'
              ? 'Poin telah ditambahkan ke saldo akun'
              : 'Poin dihitung setelah penimbangan'}
          </p>
        </div>

        <div className="rounded-[4px] bg-white border border-stone-200 p-4">
          <span className="text-[11px] font-semibold text-[#7C8574] uppercase tracking-wider">
            Total Bobot Riil
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-stone-900">
              {totalKgReal > 0 ? totalKgReal.toFixed(1) : totalKgEstimasi.toFixed(1)}
            </span>
            <span className="text-xs text-stone-500">
              kg {totalKgReal > 0 ? '(Riil)' : '(Estimasi)'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#7C8574]">
            Timbangan akurat terkalibrasi unit bank sampah.
          </p>
        </div>

        <div className="rounded-[4px] bg-white border border-stone-200 p-4">
          <span className="text-[11px] font-semibold text-[#7C8574] uppercase tracking-wider">
            Unit Penerima
          </span>
          <p className="mt-2 text-sm font-semibold text-stone-900">
            {setoran.nasabah_profile?.unit?.nama || 'Bank Sampah Unit Induk'}
          </p>
          <p className="mt-1 text-[11px] text-[#7C8574]">
            {setoran.nasabah_profile?.unit?.alamat || 'Wilayah Layanan Terpadu'}
          </p>
        </div>
      </div>

      {/* Items Breakdown Table */}
      <div className="rounded-[4px] bg-white border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <h3 className="font-display text-sm font-semibold text-stone-900">
            Daftar Material Sampah
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#7C8574] font-semibold border-b border-stone-200">
              <tr>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Jenis</th>
                <th className="px-5 py-3 text-right">Estimasi (kg)</th>
                <th className="px-5 py-3 text-right">Berat Riil (kg)</th>
                <th className="px-5 py-3 text-right">Tarif / kg</th>
                <th className="px-5 py-3 text-right">Subtotal Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {setoran.details?.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50">
                  <td className="px-5 py-3.5 font-medium text-stone-900">
                    {item.kategori_sampah?.nama ?? 'Material'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-[2px] bg-stone-100 text-stone-700">
                      {item.kategori_sampah?.jenis ?? 'Umum'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-stone-500">
                    {item.berat_kg_estimasi} kg
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-stone-900 font-mono">
                    {item.berat_kg_real !== null ? `${item.berat_kg_real} kg` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right text-stone-600">
                    Rp {item.kategori_sampah?.harga_per_kg?.toLocaleString('id-ID') ?? 0}
                  </td>
                  <td className="px-5 py-3.5 text-right font-display font-semibold text-[#0B3D26]">
                    {item.subtotal_poin ? `+${item.subtotal_poin}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Notes, Proof Photo & Verification Logs */}
      {(() => {
        const photoMatch = setoran.catatan?.match(/\[Foto Bukti:\s*(https?:\/\/[^\]]+)\]/);
        const proofPhotoUrl = photoMatch ? photoMatch[1] : null;
        const cleanCatatan = setoran.catatan
          ?.replace(/\[Foto Bukti:\s*https?:\/\/[^\]]+\]/, '')
          .trim();

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-[4px] bg-white border border-stone-200 space-y-3">
              <div>
                <span className="font-semibold text-stone-800">Catatan dari Nasabah</span>
                <p className="text-stone-600 leading-relaxed italic mt-1">
                  {cleanCatatan || 'Tidak ada catatan tertulis.'}
                </p>
              </div>

              {proofPhotoUrl && (
                <div>
                  <span className="text-[11px] font-semibold text-[#1F6B3F] block mb-1.5">
                    Foto Bukti Sampah
                  </span>
                  <div className="relative w-full h-44 rounded-[4px] overflow-hidden border border-stone-200 bg-stone-100">
                    <Image
                      src={proofPhotoUrl}
                      alt="Foto bukti setoran"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-[4px] bg-white border border-stone-200 space-y-1.5">
              <span className="font-semibold text-stone-800">Verifikasi Petugas</span>
              {setoran.verified_at ? (
                <p className="text-stone-600 leading-relaxed">
                  Diverifikasi pada{' '}
                  <span className="font-medium text-stone-900">
                    {new Intl.DateTimeFormat('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(setoran.verified_at))}
                  </span>{' '}
                  {setoran.verified_by && (
                    <>oleh <span className="font-medium text-stone-900">{setoran.verified_by.full_name}</span></>
                  )}
                </p>
              ) : (
                <p className="text-stone-500 leading-relaxed">
                  Belum ditimbang oleh petugas unit bank sampah.
                </p>
              )}
            </div>
          </div>
        );
      })()}
    </motion.div>
  );
}
