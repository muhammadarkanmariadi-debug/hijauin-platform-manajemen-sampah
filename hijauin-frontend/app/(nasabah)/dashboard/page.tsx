'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/auth';
import { useSetorans } from '@/lib/queries/setoran.queries';
import SetorModal from '@/components/nasabah/SetorModal';
import type { JenisSampah } from '@/lib/types';

/**
 * Editorial Nasabah Dashboard.
 *
 * Implements docs/DESIGN.md:
 * - Editorial typography: Fraunces display font for balance & titles, clean humanist for UI
 * - Canonical material color tokens (§3): Plastik (#2F7DB8), Kertas (#B8873A), Logam (#8A94A0), Kaca (#4FA6A0)
 * - Restrained palette: --forest-950 (#0B3D26), --bone-100 (#F1ECDF), hairline borders
 * - Subtle low-motion staggered reveals (150-200ms)
 * - Real API integration with useSetorans() and interactive SetorModal
 */
export default function NasabahDashboard() {
  const { user, refreshUser } = useAuthStore();
  const profile = user?.nasabah_profile;
  const [isSetorModalOpen, setIsSetorModalOpen] = useState(false);

  // Fetch recent submissions (first page, 10 items)
  const { data: setoransData, isLoading: isLoadingSetorans, refetch: refetchSetorans } = useSetorans(1, 10);
  const setorans = useMemo(() => setoransData?.data ?? [], [setoransData]);

  // Compute material breakdowns & stats from verified or estimated submissions
  const stats = useMemo(() => {
    let totalKg = 0;
    let totalPoinEarned = 0;
    const materialKg: Record<JenisSampah, number> = {
      plastik: 0,
      kertas: 0,
      logam: 0,
      kaca: 0,
    };

    setorans.forEach((setoran) => {
      setoran.details?.forEach((detail) => {
        const kg = Number(detail.berat_kg_real ?? detail.berat_kg_estimasi ?? 0);
        const jenis = detail.kategori_sampah?.jenis;
        if (jenis && materialKg[jenis] !== undefined) {
          materialKg[jenis] += kg;
        }
        totalKg += kg;
        if (detail.subtotal_poin) {
          totalPoinEarned += Number(detail.subtotal_poin);
        }
      });
    });

    return {
      totalSubmissions: setoransData?.meta?.total ?? setorans.length,
      totalKg: Number(totalKg.toFixed(1)),
      totalPoinEarned,
      materialKg,
    };
  }, [setorans, setoransData?.meta?.total]);

  const unitName =
    profile?.unit?.nama ||
    user?.user_roles?.[0]?.unit?.nama ||
    'Bank Sampah Unit Induk';

  const unitAddress = profile?.unit?.alamat || 'Wilayah Layanan Terpadu';

  // Canonical material definitions matching docs/DESIGN.md §3
  const materialCards = [
    {
      jenis: 'plastik' as JenisSampah,
      nama: 'Plastik',
      color: '#2F7DB8',
      bgTint: 'rgba(47, 125, 184, 0.08)',
      borderColor: 'rgba(47, 125, 184, 0.25)',
      description: 'Botol PET, kresek, wadah HDPE',
      weight: stats.materialKg.plastik,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      jenis: 'kertas' as JenisSampah,
      nama: 'Kertas & Karton',
      color: '#B8873A',
      bgTint: 'rgba(184, 135, 58, 0.08)',
      borderColor: 'rgba(184, 135, 58, 0.25)',
      description: 'Kardus cokelat, arsip, koran',
      weight: stats.materialKg.kertas,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      jenis: 'logam' as JenisSampah,
      nama: 'Logam & Kaleng',
      color: '#8A94A0',
      bgTint: 'rgba(138, 148, 160, 0.08)',
      borderColor: 'rgba(138, 148, 160, 0.25)',
      description: 'Kaleng aluminium, besi scrap',
      weight: stats.materialKg.logam,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      jenis: 'kaca' as JenisSampah,
      nama: 'Kaca & Botol',
      color: '#4FA6A0',
      bgTint: 'rgba(79, 166, 160, 0.08)',
      borderColor: 'rgba(79, 166, 160, 0.25)',
      description: 'Botol kaca sirup, kecap, beling',
      weight: stats.materialKg.kaca,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const currentDateFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'diverifikasi':
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-[4px] bg-[#1F6B3F]/10 text-[#0B3D26] border border-[#1F6B3F]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F6B3F]" />
            Terverifikasi
          </span>
        );
      case 'menunggu_konfirmasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-[4px] bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Menunggu Timbang
          </span>
        );
      case 'ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-[4px] bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      {/* ── Editorial Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F6B3F]">
              Dashboard Nasabah
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-[#7C8574]">{currentDateFormatted}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Halo, {user?.full_name?.split(' ')[0] || 'Nasabah'}
          </h1>
          <p className="mt-1 text-xs text-[#7C8574]">
            Terdaftar di <span className="font-medium text-stone-800">{unitName}</span> ({unitAddress})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSetorModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-[#F1ECDF] text-xs font-medium tracking-wide transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Setor Sampah
          </button>
          <Link
            href="/penukarans"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] border border-stone-300 hover:border-stone-400 bg-white text-stone-800 text-xs font-medium transition-all"
          >
            Katalog Hadiah
          </Link>
        </div>
      </div>

      {/* ── Top Grid: Hero Balance & Quick Impact ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hero Balance Card (7 cols) */}
        <div className="lg:col-span-7 rounded-[4px] bg-[#0B3D26] text-[#F1ECDF] p-6 sm:p-7 relative overflow-hidden border border-[#1F6B3F]/40 shadow-sm flex flex-col justify-between min-h-[220px]">
          {/* Subtle geometric watermark */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full border border-[#4FA65C]/15 pointer-events-none" />
          <div className="absolute right-8 bottom-6 w-32 h-32 rounded-full border border-[#4FA65C]/10 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4FA65C] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider text-[#4FA65C] uppercase">
                  Saldo Poin Tersedia
                </span>
              </div>
              <span className="text-[11px] text-[#7C8574] font-mono">ID: #{profile?.id ?? '—'}</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F1ECDF]">
                {profile?.saldo_poin?.toLocaleString('id-ID') ?? 0}
              </span>
              <span className="text-sm font-medium text-[#4FA65C]">POIN</span>
            </div>

            <p className="mt-1 text-xs text-[#7C8574]">
              Nilai estimasi penukaran:{' '}
              <span className="text-stone-300 font-medium">
                Rp {((profile?.saldo_poin ?? 0) * 100).toLocaleString('id-ID')}
              </span>
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-[#1F6B3F]/30 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] text-[#7C8574] max-w-xs">
              Kumpulkan poin dari setiap kilogram sampah anorganik terpilah yang Anda setorkan.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/penukarans"
                className="px-3.5 py-1.5 rounded-[4px] bg-[#F1ECDF] hover:bg-white text-[#0B3D26] text-xs font-semibold transition-all shadow-sm"
              >
                Tukar Poin
              </Link>
              <Link
                href="/setorans"
                className="px-3.5 py-1.5 rounded-[4px] border border-[#F1ECDF]/30 hover:bg-white/5 text-[#F1ECDF] text-xs font-medium transition-all"
              >
                Riwayat
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Impact Metrics (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="rounded-[4px] bg-white border border-stone-200 p-5 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#7C8574] uppercase tracking-wider">
                Total Setoran
              </span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
                  {stats.totalSubmissions}
                </span>
                <span className="text-xs text-stone-500">kali</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-[#7C8574]">
              Frekuensi penyerahan sampah ke unit bank sampah.
            </p>
          </div>

          <div className="rounded-[4px] bg-white border border-stone-200 p-5 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#7C8574] uppercase tracking-wider">
                Total Bobot
              </span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#0B3D26]">
                  {stats.totalKg}
                </span>
                <span className="text-xs font-medium text-[#1F6B3F]">kg</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-[#7C8574]">
              Total timbulan anorganik yang berhasil diselamatkan dari TPA.
            </p>
          </div>

          <div className="col-span-2 rounded-[4px] bg-stone-50 border border-stone-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[4px] bg-[#1F6B3F]/10 flex items-center justify-center text-[#0B3D26] shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-900">Kontribusi Lingkungan Anda</p>
                <p className="text-[11px] text-[#7C8574]">
                  Estimasi reduksi emisi karbon: {(stats.totalKg * 1.8).toFixed(1)} kg CO₂e
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#1F6B3F]">Aktif</span>
          </div>
        </div>
      </div>

      {/* ── Material Palette Breakdown Cards (§3) ───────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="font-display text-base font-semibold text-stone-900">
              Rincian Material Terpilah
            </h2>
            <p className="text-xs text-[#7C8574]">
              Volume sampah anorganik berdasarkan empat klasifikasi standar
            </p>
          </div>
          <span className="text-[11px] font-medium text-stone-500">
            Total {stats.totalKg} kg
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {materialCards.map((item) => (
            <div
              key={item.jenis}
              className="rounded-[4px] bg-white border border-stone-200 p-4 transition-all hover:border-stone-300 relative overflow-hidden"
              style={{ borderTop: `3px solid ${item.color}` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[2px]"
                    style={{ color: item.color, backgroundColor: item.bgTint }}
                  >
                    {item.jenis}
                  </span>
                  <h3 className="mt-1.5 text-xs font-semibold text-stone-900">{item.nama}</h3>
                  <p className="text-[10px] text-stone-500 leading-tight mt-0.5">{item.description}</p>
                </div>
                <div
                  className="w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0"
                  style={{ color: item.color, backgroundColor: item.bgTint }}
                >
                  {item.icon}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-baseline justify-between">
                <span className="text-[11px] text-stone-500">Terkumpul</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl font-bold text-stone-900">
                    {item.weight.toFixed(1)}
                  </span>
                  <span className="text-xs font-medium text-stone-500">kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Activity Table ──────────────────────────────── */}
      <div className="rounded-[4px] bg-white border border-stone-200 overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-stone-900">
              Riwayat Setoran Terbaru
            </h2>
            <p className="text-xs text-[#7C8574]">
              Daftar penyerahan sampah yang telah Anda catat ke sistem
            </p>
          </div>
          <Link
            href="/setorans"
            className="text-xs font-medium text-[#1F6B3F] hover:text-[#0B3D26] transition-colors"
          >
            Lihat Semua Setoran
          </Link>
        </div>

        {isLoadingSetorans ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-[#0B3D26] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-xs text-stone-500">Memuat data setoran...</p>
          </div>
        ) : setorans.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-[4px] bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-display text-sm font-semibold text-stone-900">
              Belum Ada Catatan Setoran
            </h3>
            <p className="mt-1 text-xs text-[#7C8574] max-w-sm mx-auto">
              Anda belum melakukan penyetoran sampah anorganik. Bawa sampah yang telah dipilah ke unit bank sampah Anda.
            </p>
            <button
              type="button"
              onClick={() => setIsSetorModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-[#F1ECDF] text-xs font-medium transition-all"
            >
              + Mulai Setor Pertama
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[#7C8574] font-semibold border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Rincian Material</th>
                  <th className="px-5 py-3 text-right">Bobot</th>
                  <th className="px-5 py-3 text-right">Poin</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {setorans.slice(0, 5).map((setoran) => {
                  const totalKgItem =
                    setoran.details?.reduce(
                      (acc, d) => acc + Number(d.berat_kg_real ?? d.berat_kg_estimasi ?? 0),
                      0
                    ) ?? 0;
                  const totalPoinItem =
                    setoran.details?.reduce((acc, d) => acc + Number(d.subtotal_poin ?? 0), 0) ?? 0;

                  return (
                    <tr key={setoran.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-stone-900 whitespace-nowrap">
                        {new Intl.DateTimeFormat('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }).format(new Date(setoran.tanggal))}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {setoran.details?.map((detail) => (
                            <span
                              key={detail.id}
                              className="inline-block px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-stone-100 text-stone-700"
                            >
                              {detail.kategori_sampah?.nama ?? 'Material'} (
                              {detail.berat_kg_real ?? detail.berat_kg_estimasi} kg)
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-stone-900 whitespace-nowrap">
                        {totalKgItem.toFixed(1)} kg
                      </td>
                      <td className="px-5 py-3.5 text-right font-display font-semibold text-[#0B3D26] whitespace-nowrap">
                        {totalPoinItem > 0 ? `+${totalPoinItem}` : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        {getStatusBadge(setoran.status)}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <Link
                          href={`/setorans/${setoran.id}`}
                          className="text-[#1F6B3F] hover:text-[#0B3D26] font-medium text-xs transition-colors"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Setor Modal */}
      <SetorModal
        isOpen={isSetorModalOpen}
        onClose={() => setIsSetorModalOpen(false)}
        onSuccess={() => {
          refetchSetorans();
          refreshUser();
        }}
      />
    </motion.div>
  );
}
