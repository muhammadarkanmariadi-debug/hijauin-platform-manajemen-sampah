'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore, getUserRole } from '@/lib/auth';
import {
  useAdminNasabahs,
  useAdminSetorans,
  useAdminKategoris,
  useAdminHadiahs,
} from '@/lib/queries/admin.queries';
import { useOpsDashboard } from '@/lib/queries/ops.queries';
import type { JenisSampah } from '@/lib/types';

/**
 * Editorial Admin Dashboard Screen.
 *
 * Stylistically aligned with Nasabah Dashboard:
 * - Fraunces display typography for headers and key metrics
 * - Warm bone background canvas (#FAF8F5) with crisp white cards
 * - Hairline borders (border-stone-200) and 4px radius controls
 * - Adaptive layout:
 *   - For Platform Ops: Global multi-unit overview, RBAC & user management quick actions, branch directory
 *   - For Admin Unit: Branch-scoped operations, local deposit queue, category and reward controls
 */
export default function AdminDashboard() {
  const { user } = useAuthStore();
  const currentRole = getUserRole(user);
  const isSuperOps = currentRole === 'platform_ops';

  // Live queries for unit data
  const { data: nasabahsData, isLoading: loadingNasabahs } = useAdminNasabahs(1, 1);
  const { data: setoransData, isLoading: loadingSetorans } = useAdminSetorans(1, 30);
  const { data: kategorisData, isLoading: loadingKategoris } = useAdminKategoris(1, 50);
  const { data: hadiahsData } = useAdminHadiahs(1, 50);
  const { data: opsDashboard, isLoading: loadingOps } = useOpsDashboard();

  const setorans = useMemo(() => setoransData?.data ?? [], [setoransData]);
  const totalNasabahs = isSuperOps ? (opsDashboard?.total_nasabahs ?? 0) : (nasabahsData?.meta?.total ?? 0);
  const totalKategoris = kategorisData?.meta?.total ?? kategorisData?.data?.length ?? 0;
  const totalHadiahs = hadiahsData?.meta?.total ?? hadiahsData?.data?.length ?? 0;

  // Aggregate setoran statistics
  const stats = useMemo(() => {
    let pendingCount = 0;
    let verifiedCount = 0;
    let totalTonaseKg = 0;
    const materialKg: Record<JenisSampah, number> = {
      plastik: 0,
      kertas: 0,
      logam: 0,
      kaca: 0,
    };

    setorans.forEach((setoran) => {
      if (setoran.status === 'menunggu_konfirmasi') {
        pendingCount += 1;
      } else if (setoran.status === 'diverifikasi' || setoran.status === 'selesai') {
        verifiedCount += 1;
      }

      setoran.details?.forEach((detail) => {
        const kg = Number(detail.berat_kg_real ?? detail.berat_kg_estimasi ?? 0);
        const jenis = detail.kategori_sampah?.jenis;
        if (jenis && materialKg[jenis] !== undefined) {
          materialKg[jenis] += kg;
        }
        totalTonaseKg += kg;
      });
    });

    return {
      pendingCount: isSuperOps ? (opsDashboard?.pending_setorans ?? pendingCount) : pendingCount,
      verifiedCount,
      totalTonaseKg: isSuperOps ? (opsDashboard?.total_kg ?? Number(totalTonaseKg.toFixed(1))) : Number(totalTonaseKg.toFixed(1)),
      materialKg,
    };
  }, [setorans, isSuperOps, opsDashboard]);

  // Urgent pending submissions waiting for verification
  const pendingSetorans = useMemo(() => {
    return setorans
      .filter((s) => s.status === 'menunggu_konfirmasi')
      .slice(0, 5);
  }, [setorans]);

  // Canonical material definition cards
  const materialCards = [
    {
      jenis: 'plastik' as JenisSampah,
      nama: 'Plastik',
      color: '#2F7DB8',
      bgTint: 'rgba(47, 125, 184, 0.08)',
      borderColor: 'rgba(47, 125, 184, 0.25)',
      description: 'Botol PET, kresek, jeriken HDPE',
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
      description: 'Kardus, kertas duplex, arsip',
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
      description: 'Aluminium, kaleng, besi terpilah',
      weight: stats.materialKg.logam,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      jenis: 'kaca' as JenisSampah,
      nama: 'Kaca & Beling',
      color: '#4FA6A0',
      bgTint: 'rgba(79, 166, 160, 0.08)',
      borderColor: 'rgba(79, 166, 160, 0.25)',
      description: 'Botol kaca utuh, toples kemasan',
      weight: stats.materialKg.kaca,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const unitName =
    user?.user_roles?.[0]?.unit?.nama ||
    (isSuperOps ? 'Platform Hijauin Indonesia' : 'Bank Sampah Unit Induk');

  const unitAddress =
    user?.user_roles?.[0]?.unit?.alamat ||
    (isSuperOps ? 'Operasional Seluruh Wilayah Nasional' : 'Layanan Wilayah Terpadu');

  // Quick actions adapted for Platform Ops vs Admin Unit
  const quickActions = isSuperOps
    ? [
        {
          title: 'Kelola Pengguna',
          desc: 'Manajemen direktori akun pengguna & role staff',
          href: '/admin/users',
          badge: `${opsDashboard?.total_users ?? 0} Akun`,
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: (
            <svg className="w-5 h-5 text-[#0B3D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
        },
        {
          title: 'Peran & Hak Akses',
          desc: 'Matriks otorisasi RBAC sistem platform',
          href: '/admin/roles',
          badge: '3 Peran',
          badgeColor: 'bg-stone-100 text-stone-800 border-stone-200',
          icon: (
            <svg className="w-5 h-5 text-[#0B3D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
        },
        {
          title: 'Unit Bank Sampah',
          desc: 'Kelola dan daftarkan cabang operasional baru',
          href: '/admin/units',
          badge: `${opsDashboard?.total_units ?? 0} Cabang`,
          badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: (
            <svg className="w-5 h-5 text-[#0B3D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
        {
          title: 'Verifikasi Setoran',
          desc: 'Tinjau setoran sampah masuk dari nasabah',
          href: '/admin/setorans',
          badge: `${stats.pendingCount} Menunggu`,
          badgeColor: stats.pendingCount > 0 ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-green-100 text-green-900 border-green-300',
          icon: (
            <svg className="w-5 h-5 text-[#0B3D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          title: 'Rekap Nasional',
          desc: 'Neraca massa gabungan dan perputaran poin',
          href: '/admin/rekap',
          badge: 'Laporan Siap',
          badgeColor: 'bg-stone-100 text-stone-800 border-stone-200',
          icon: (
            <svg className="w-5 h-5 text-[#0B3D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
      ]
    : [
        {
          title: 'Verifikasi Setoran',
          desc: 'Timbang dan setujui kiriman sampah nasabah',
          href: '/admin/setorans',
          badge: stats.pendingCount > 0 ? `${stats.pendingCount} Perlu Ditimbang` : 'Tuntas',
          badgeColor: stats.pendingCount > 0 ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-green-100 text-green-900 border-green-300',
          icon: (
            <svg className="w-5 h-5 text-[#0B3D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          title: 'Kelola Nasabah',
          desc: 'Buku tabungan digital & mutasi nasabah',
          href: '/admin/nasabahs',
          badge: `${totalNasabahs} Terdaftar`,
          badgeColor: 'bg-stone-100 text-stone-800 border-stone-200',
          icon: (
            <svg className="w-5 h-5 text-[#0B3D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
        },
        {
          title: 'Kategori & Tarif',
          desc: 'Atur jenis sampah dan nominal harga/kg',
          href: '/admin/kategoris',
          badge: `${totalKategoris} Kategori`,
          badgeColor: 'bg-stone-100 text-stone-800 border-stone-200',
          icon: (
            <svg className="w-5 h-5 text-[#0B3D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          ),
        },
        {
          title: 'Katalog Hadiah',
          desc: 'Tambah sembako, voucher, dan reward poin',
          href: '/admin/hadiahs',
          badge: `${totalHadiahs} Item`,
          badgeColor: 'bg-stone-100 text-stone-800 border-stone-200',
          icon: (
            <svg className="w-5 h-5 text-[#0B3D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 13l-4-4m4 4l4-4m-9-5h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          title: 'Rekap & Neraca',
          desc: 'Laporan neraca massa bulanan & perputaran poin',
          href: '/admin/rekap',
          badge: 'Laporan Siap',
          badgeColor: 'bg-stone-100 text-stone-800 border-stone-200',
          icon: (
            <svg className="w-5 h-5 text-[#0B3D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
      ];

  return (
    <div className="space-y-8">
      {/* ── 1. Hero Overview Card (Editorial Forest Green) ───────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[4px] border border-stone-200 bg-[#0B3D26] p-7 md:p-9 text-white shadow-sm"
      >
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#1F6B3F]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-[#D4A373]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-[4px] bg-white/10 px-3 py-1 text-xs text-[#E8EDEA] backdrop-blur-xs border border-white/15">
              <span className={`w-2 h-2 rounded-full ${isSuperOps ? 'bg-amber-400' : 'bg-[#4FA65C]'}`} />
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                {isSuperOps ? 'Platform Ops (Superuser Console)' : 'Pengelola Bank Sampah Unit'}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
              {isSuperOps ? 'Konsol Superuser Platform' : `Konsol Operasional ${unitName}`}
            </h1>

            <p className="text-sm text-stone-300 font-sans leading-relaxed">
              {unitAddress} • {isSuperOps ? 'Kelola seluruh cabang bank sampah, otorisasi RBAC, akun pengguna, dan agregasi tonase nasional.' : 'Pantau penimbangan terverifikasi, mutasi poin nasabah, serta distribusi material sirkular.'}
            </p>
          </div>

          <div className="flex flex-row md:flex-col sm:items-end gap-2.5 shrink-0">
            {isSuperOps ? (
              <>
                <Link
                  href="/admin/users"
                  className="inline-flex items-center gap-2 rounded-[4px] bg-white px-4 py-2.5 text-xs font-semibold text-[#0B3D26] hover:bg-stone-100 active:translate-y-0.5 transition-all shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#0B3D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Kelola Pengguna ({opsDashboard?.total_users ?? 0})</span>
                </Link>

                <Link
                  href="/admin/units"
                  className="inline-flex items-center gap-2 rounded-[4px] border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:bg-white/10 active:translate-y-0.5 transition-all"
                >
                  <span>Direktori Cabang Unit</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/admin/setorans"
                  className="inline-flex items-center gap-2 rounded-[4px] bg-white px-4 py-2.5 text-xs font-semibold text-[#0B3D26] hover:bg-stone-100 active:translate-y-0.5 transition-all shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#0B3D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Verifikasi Setoran ({stats.pendingCount})</span>
                </Link>

                <Link
                  href="/admin/nasabahs"
                  className="inline-flex items-center gap-2 rounded-[4px] border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:bg-white/10 active:translate-y-0.5 transition-all"
                >
                  <span>Data Nasabah Unit</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── 2. Primary Metric Stats (Editorial 4-Grid) ─────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Nasabah or Units */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="rounded-[4px] border border-stone-200 bg-white p-5 shadow-xs hover:border-stone-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {isSuperOps ? 'Cabang Bank Sampah' : 'Total Nasabah'}
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#0B3D26]/5 flex items-center justify-center text-[#0B3D26]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-display text-3xl font-bold text-stone-900 tracking-tight">
              {isSuperOps ? (loadingOps ? '...' : (opsDashboard?.total_units ?? 0)) : (loadingNasabahs ? '...' : totalNasabahs)}
            </p>
            <span className="text-xs font-medium text-stone-500">
              {isSuperOps ? 'cabang aktif' : 'anggota aktif'}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#7C8574]">
            {isSuperOps ? `${totalNasabahs} nasabah di semua unit` : 'Buku tabungan terdaftar di unit ini'}
          </p>
        </motion.div>

        {/* Metric 2: Antrean Timbang / Setoran Pending */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className={`rounded-[4px] border p-5 shadow-xs transition-colors ${
            stats.pendingCount > 0
              ? 'border-amber-300 bg-amber-50/40'
              : 'border-stone-200 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Antrean Timbang
            </span>
            <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center ${
              stats.pendingCount > 0 ? 'bg-amber-100 text-amber-900' : 'bg-[#0B3D26]/5 text-[#0B3D26]'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className={`font-display text-3xl font-bold tracking-tight ${
              stats.pendingCount > 0 ? 'text-amber-950' : 'text-stone-900'
            }`}>
              {loadingSetorans ? '...' : stats.pendingCount}
            </p>
            <span className="text-xs font-medium text-stone-500">setoran</span>
          </div>
          <p className="mt-2 text-[11px] text-[#7C8574]">
            {stats.pendingCount > 0 ? 'Perlu penimbangan fisik segera' : 'Semua setoran telah diverifikasi'}
          </p>
        </motion.div>

        {/* Metric 3: Total Tonase Terkumpul */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="rounded-[4px] border border-stone-200 bg-white p-5 shadow-xs hover:border-stone-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {isSuperOps ? 'Tonase Nasional' : 'Total Tonase Unit'}
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#1F6B3F]/10 flex items-center justify-center text-[#1F6B3F]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-display text-3xl font-bold text-stone-900 tracking-tight">
              {loadingSetorans ? '...' : stats.totalTonaseKg}
            </p>
            <span className="text-xs font-medium text-stone-500">kg material</span>
          </div>
          <p className="mt-2 text-[11px] text-[#7C8574]">
            Akumulasi sampah terpilah terkelola
          </p>
        </motion.div>

        {/* Metric 4: Master Material & Hadiah / Pengguna */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          className="rounded-[4px] border border-stone-200 bg-white p-5 shadow-xs hover:border-stone-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {isSuperOps ? 'Akun Terdaftar' : 'Katalog Aktif'}
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#D4A373]/15 flex items-center justify-center text-[#B8873A]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-display text-3xl font-bold text-stone-900 tracking-tight">
              {isSuperOps ? (loadingOps ? '...' : (opsDashboard?.total_users ?? 0)) : (loadingKategoris ? '...' : totalKategoris)}
            </p>
            <span className="text-xs font-medium text-stone-500">
              {isSuperOps ? 'pengguna sistem' : `kategori • ${totalHadiahs} hadiah`}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#7C8574]">
            {isSuperOps ? 'Seluruh nasabah & staff pengelola' : 'Katalog sampah dan sembako/hadiah'}
          </p>
        </motion.div>
      </div>

      {/* ── 3. Canonical Material Distribution (§3 DESIGN.md) ────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[#0B3D26]">
            Neraca Material Masuk
          </h2>
          <Link
            href="/admin/kategoris"
            className="text-xs font-medium text-[#1F6B3F] hover:underline"
          >
            Atur Tarif Kategori →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {materialCards.map((mat) => (
            <div
              key={mat.jenis}
              className="rounded-[4px] border bg-white p-5 shadow-xs transition-all hover:shadow-sm"
              style={{ borderColor: mat.borderColor }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: mat.bgTint, color: mat.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: mat.color }} />
                  {mat.nama}
                </span>
                <div style={{ color: mat.color }}>{mat.icon}</div>
              </div>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-stone-900">
                  {mat.weight.toFixed(1)}
                </span>
                <span className="text-xs font-medium text-stone-500">kg</span>
              </div>

              <p className="mt-1 text-[11px] text-stone-500">
                {mat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Urgent Pending Setorans / Units Directory & Quick Actions ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-[#0B3D26]">
                {isSuperOps ? 'Direktori Cabang Terhubung' : 'Antrean Setoran Masuk'}
              </h2>
              <p className="text-xs text-stone-500">
                {isSuperOps
                  ? 'Cabang bank sampah aktif yang melayani penimbangan warga'
                  : 'Kiriman sampah nasabah yang membutuhkan penimbangan fisik di unit'}
              </p>
            </div>
            <Link
              href={isSuperOps ? '/admin/units' : '/admin/setorans'}
              className="text-xs font-medium text-[#1F6B3F] hover:underline"
            >
              {isSuperOps ? `Semua Cabang (${opsDashboard?.units?.length ?? 0}) →` : `Semua Setoran (${setorans.length}) →`}
            </Link>
          </div>

          {isSuperOps ? (
            /* Multi-Unit Overview Table for Platform Ops */
            <div className="rounded-[4px] border border-stone-200 bg-white shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Nama Unit Cabang</th>
                    <th className="px-5 py-3">Lokasi / Alamat</th>
                    <th className="px-5 py-3">Kontak</th>
                    <th className="px-5 py-3 text-right">Nasabah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {opsDashboard?.units?.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-stone-900">
                        {u.nama}
                      </td>
                      <td className="px-5 py-3.5 text-stone-600 truncate max-w-[200px]">
                        {u.alamat || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-stone-500">
                        {u.telepon || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-[#0B3D26]">
                        {u.nasabah_profiles_count ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Local Pending Queue for Branch Admin */
            <div className="rounded-[4px] border border-stone-200 bg-white shadow-xs divide-y divide-stone-100 overflow-hidden">
              {loadingSetorans ? (
                <div className="p-8 text-center text-xs text-stone-500">
                  Memuat antrean setoran...
                </div>
              ) : pendingSetorans.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-green-50 text-[#1F6B3F] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-stone-800">
                    Tidak ada setoran menunggu timbang
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Semua sampah nasabah yang masuk telah selesai diverifikasi.
                  </p>
                </div>
              ) : (
                pendingSetorans.map((setoran) => {
                  const totalKg = setoran.details?.reduce(
                    (sum, d) => sum + Number(d.berat_kg_estimasi || 0),
                    0
                  );
                  const firstDetail = setoran.details?.[0];
                  const fotoUrl = firstDetail?.kategori_sampah?.foto_url;

                  return (
                    <div
                      key={setoran.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5]/60 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {fotoUrl ? (
                          <div className="relative w-12 h-12 rounded-[4px] overflow-hidden border border-stone-200 shrink-0">
                            <Image
                              src={fotoUrl}
                              alt="Sampah"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-[4px] bg-[#0B3D26]/5 text-[#0B3D26] flex items-center justify-center shrink-0 border border-stone-200">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
                            </svg>
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-stone-900 truncate">
                              {setoran.nasabah_profile?.user?.full_name || 'Nasabah Unit'}
                            </p>
                            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-amber-50 text-amber-800 border border-amber-200">
                              Menunggu Timbang
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {new Intl.DateTimeFormat('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }).format(new Date(setoran.tanggal))} • {setoran.details?.length || 1} item sampah
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-xs font-bold text-stone-900">
                            ±{totalKg?.toFixed(1) || 0} kg
                          </p>
                          <p className="text-[10px] text-stone-400">Estimasi</p>
                        </div>

                        <Link
                          href={`/admin/setorans/${setoran.id}/verify`}
                          className="rounded-[4px] bg-[#0B3D26] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#1F6B3F] active:translate-y-0.5 transition-colors shadow-xs"
                        >
                          Timbang Sekarang
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Right Col: Menu Operasional Cepat */}
        <div className="space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold text-[#0B3D26]">
              Aksi Operasional
            </h2>
            <p className="text-xs text-stone-500">
              {isSuperOps ? 'Pintas manajemen kontrol platform' : 'Pintas modul pengelolaan unit bank sampah'}
            </p>
          </div>

          <div className="space-y-2.5">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group block rounded-[4px] border border-stone-200 bg-white p-4 shadow-xs hover:border-[#0B3D26]/40 hover:bg-[#FAF8F5]/80 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-[4px] bg-[#FAF8F5] group-hover:bg-white border border-stone-200 transition-colors">
                      {action.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900 group-hover:text-[#0B3D26] transition-colors">
                        {action.title}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {action.desc}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${action.badgeColor}`}>
                    {action.badge}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
