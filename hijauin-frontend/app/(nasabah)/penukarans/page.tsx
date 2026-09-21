'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useHadiahs, usePenukarans } from '@/lib/queries/penukaran.queries';
import { useAuthStore } from '@/lib/auth';
import { DataTableToolbar } from '@/components/common/DataTableToolbar';
import { Pagination } from '@/components/ui/Pagination';
import TukarHadiahModal from '@/components/nasabah/TukarHadiahModal';
import type { Hadiah, StatusPenukaran } from '@/lib/types';

const PENUKARAN_STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'diproses', label: 'Siap Diambil' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'dibatalkan', label: 'Dibatalkan' },
];

const PENUKARAN_SORT_OPTIONS = [
  { value: 'created_at', label: 'Waktu Penukaran' },
  { value: 'poin_ditukar', label: 'Poin Ditukar' },
  { value: 'status', label: 'Status' },
];

const KATALOG_SORT_OPTIONS = [
  { value: 'poin_asc', label: 'Poin: Terendah ke Tertinggi' },
  { value: 'poin_desc', label: 'Poin: Tertinggi ke Terendah' },
  { value: 'nama_asc', label: 'Nama Hadiah (A-Z)' },
  { value: 'stok_desc', label: 'Stok Terbanyak' },
];

export default function PenukaransPage() {
  const { user, refreshUser } = useAuthStore();
  const currentPoints = user?.nasabah_profile?.saldo_poin ?? 0;

  const [activeTab, setActiveTab] = useState<'katalog' | 'riwayat'>('katalog');
  const [selectedHadiah, setSelectedHadiah] = useState<Hadiah | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Katalog filter & sort states
  const [katalogSearch, setKatalogSearch] = useState('');
  const [katalogAffordFilter, setKatalogAffordFilter] = useState<'all' | 'can_afford' | 'not_enough'>('all');
  const [katalogSort, setKatalogSort] = useState('poin_asc');

  // Riwayat Penukaran query & filter states
  const [riwayatPage, setRiwayatPage] = useState(1);
  const [riwayatPageSize, setRiwayatPageSize] = useState(15);
  const [riwayatSearch, setRiwayatSearch] = useState('');
  const [riwayatStatus, setRiwayatStatus] = useState('all');
  const [riwayatSortBy, setRiwayatSortBy] = useState('created_at');
  const [riwayatSortDir, setRiwayatSortDir] = useState<'asc' | 'desc'>('desc');

  // Queries
  const { data: hadiahs = [], isLoading: isLoadingHadiahs, refetch: refetchHadiahs } = useHadiahs();
  const {
    data: penukaransData,
    isLoading: isLoadingPenukarans,
    refetch: refetchPenukarans,
  } = usePenukarans({
    page: riwayatPage,
    pageSize: riwayatPageSize,
    search: riwayatSearch,
    status: riwayatStatus !== 'all' ? riwayatStatus : undefined,
    sortBy: riwayatSortBy,
    sortDir: riwayatSortDir,
  });

  const penukarans = penukaransData?.data ?? [];
  const meta = penukaransData?.meta;

  // Filter & Sort Katalog Hadiah Client-side
  const filteredHadiahs = useMemo(() => {
    return hadiahs
      .filter((h) => {
        const matchesSearch =
          katalogSearch === '' ||
          h.nama.toLowerCase().includes(katalogSearch.toLowerCase()) ||
          (h.deskripsi && h.deskripsi.toLowerCase().includes(katalogSearch.toLowerCase()));

        const matchesAfford =
          katalogAffordFilter === 'all' ||
          (katalogAffordFilter === 'can_afford' && currentPoints >= h.poin_diperlukan) ||
          (katalogAffordFilter === 'not_enough' && currentPoints < h.poin_diperlukan);

        return matchesSearch && matchesAfford;
      })
      .sort((a, b) => {
        if (katalogSort === 'poin_asc') return a.poin_diperlukan - b.poin_diperlukan;
        if (katalogSort === 'poin_desc') return b.poin_diperlukan - a.poin_diperlukan;
        if (katalogSort === 'nama_asc') return a.nama.localeCompare(b.nama);
        if (katalogSort === 'stok_desc') return b.stok - a.stok;
        return 0;
      });
  }, [hadiahs, katalogSearch, katalogAffordFilter, katalogSort, currentPoints]);

  const handleOpenTukar = (hadiah: Hadiah) => {
    setSelectedHadiah(hadiah);
    setIsModalOpen(true);
  };

  const handleRiwayatSearchChange = (val: string) => {
    setRiwayatSearch(val);
    setRiwayatPage(1);
  };

  const handleRiwayatStatusChange = (val: string) => {
    setRiwayatStatus(val);
    setRiwayatPage(1);
  };

  const handleRiwayatSortChange = (newSortBy: string, newSortDir: 'asc' | 'desc') => {
    setRiwayatSortBy(newSortBy);
    setRiwayatSortDir(newSortDir);
    setRiwayatPage(1);
  };

  const handleRiwayatPageSizeChange = (size: number) => {
    setRiwayatPageSize(size);
    setRiwayatPage(1);
  };

  const handleRiwayatReset = () => {
    setRiwayatSearch('');
    setRiwayatStatus('all');
    setRiwayatSortBy('created_at');
    setRiwayatSortDir('desc');
    setRiwayatPage(1);
  };

  const hasActiveRiwayatFilters =
    riwayatSearch !== '' || riwayatStatus !== 'all' || riwayatSortBy !== 'created_at' || riwayatSortDir !== 'desc';

  const getStatusBadge = (status: StatusPenukaran) => {
    switch (status) {
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-[4px] bg-[#1F6B3F]/10 text-[#0B3D26] border border-[#1F6B3F]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F6B3F]" />
            Selesai Diambil
          </span>
        );
      case 'diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-[4px] bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Siap Diambil di Unit
          </span>
        );
      case 'dibatalkan':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-[4px] bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Dibatalkan
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
      className="space-y-6"
    >
      {/* Header & Balance Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[4px] bg-[#0B3D26] text-[#F1ECDF] border border-[#1F6B3F]/40 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full border border-white/5 pointer-events-none -mr-12 -mt-12" />

        <div>
          <span className="text-[11px] font-semibold text-[#4FA65C] uppercase tracking-wider">
            Katalog & Penukaran Hadiah
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Tukar Poin Tabungan Sampah
          </h1>
          <p className="text-xs text-[#7C8574] mt-1 max-w-lg leading-relaxed">
            Tukarkan poin hasil pilah sampah anorganik Anda dengan sembako, voucher listrik, atau produk ramah lingkungan di unit bank sampah.
          </p>
        </div>

        <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center border-t md:border-t-0 md:border-l border-[#1F6B3F]/40 pt-4 md:pt-0 md:pl-8">
          <span className="text-xs text-stone-300">Saldo Poin Anda</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-display text-3xl sm:text-4xl font-bold text-white">
              {currentPoints.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-semibold text-[#4FA65C]">POIN</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-1">
        <button
          onClick={() => setActiveTab('katalog')}
          className={`px-4 py-2 text-xs font-semibold rounded-[4px] transition-all ${
            activeTab === 'katalog'
              ? 'bg-[#0B3D26] text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          Katalog Hadiah Tersedia ({hadiahs.length})
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`px-4 py-2 text-xs font-semibold rounded-[4px] transition-all ${
            activeTab === 'riwayat'
              ? 'bg-[#0B3D26] text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          Riwayat Penukaran ({penukarans.length})
        </button>
      </div>

      {/* Tab 1: Katalog Hadiah */}
      {activeTab === 'katalog' && (
        <div className="space-y-4">
          {/* Katalog Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-[4px] bg-white border border-stone-200 shadow-xs">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={katalogSearch}
                onChange={(e) => setKatalogSearch(e.target.value)}
                placeholder="Cari nama hadiah atau sembako..."
                aria-label="Cari nama hadiah atau sembako"
                className="w-full pl-3 pr-8 py-1.5 text-xs rounded-[4px] border border-stone-300 bg-white placeholder-stone-400 focus:border-[#0B3D26] focus:outline-none"
              />
              {katalogSearch && (
                <button
                  type="button"
                  onClick={() => setKatalogSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <label htmlFor="katalog-afford-filter" className="sr-only">
                Filter Kemampuan Poin
              </label>
              <select
                id="katalog-afford-filter"
                value={katalogAffordFilter}
                onChange={(e) => setKatalogAffordFilter(e.target.value as 'all' | 'can_afford' | 'not_enough')}
                aria-label="Filter Kemampuan Poin"
                className="px-2.5 py-1.5 text-xs font-medium rounded-[4px] border border-stone-300 bg-white text-stone-800 focus:border-[#0B3D26] focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Hadiah</option>
                <option value="can_afford">Poin Cukup Ditukar</option>
                <option value="not_enough">Poin Belum Cukup</option>
              </select>

              <label htmlFor="katalog-sort-select" className="sr-only">
                Urutan Katalog
              </label>
              <select
                id="katalog-sort-select"
                value={katalogSort}
                onChange={(e) => setKatalogSort(e.target.value)}
                aria-label="Urutan Katalog"
                className="px-2.5 py-1.5 text-xs font-medium rounded-[4px] border border-stone-300 bg-white text-stone-800 focus:border-[#0B3D26] focus:outline-none cursor-pointer"
              >
                {KATALOG_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoadingHadiahs ? (
            <div className="p-16 text-center bg-white rounded-[4px] border border-stone-200">
              <div className="w-6 h-6 border-2 border-[#0B3D26] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-3 text-xs text-stone-500">Memuat katalog hadiah...</p>
            </div>
          ) : filteredHadiahs.length === 0 ? (
            <div className="p-16 text-center border border-stone-200 bg-white rounded-[4px] space-y-2">
              <p className="font-display text-sm font-semibold text-stone-900">
                {katalogSearch || katalogAffordFilter !== 'all'
                  ? 'Tidak Ada Hadiah Sesuai Filter'
                  : 'Belum Ada Hadiah yang Tersedia'}
              </p>
              <p className="text-xs text-[#7C8574]">
                {katalogSearch || katalogAffordFilter !== 'all'
                  ? 'Coba sesuaikan kata kunci pencarian atau pilihan filter kemampuan poin.'
                  : 'Katalog hadiah untuk unit bank sampah Anda sedang diperbarui oleh petugas.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredHadiahs.map((hadiah) => {
                const canAfford = currentPoints >= hadiah.poin_diperlukan;
                const isOutOfStock = hadiah.stok <= 0;

                return (
                  <div
                    key={hadiah.id}
                    className="rounded-[4px] bg-white border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between hover:border-stone-300 transition-all"
                  >
                    <div>
                      {/* Photo */}
                      <div className="relative w-full h-44 bg-stone-100 border-b border-stone-100 overflow-hidden">
                        {hadiah.foto_url ? (
                          <Image
                            src={hadiah.foto_url}
                            alt={hadiah.nama}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                          </div>
                        )}
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-semibold rounded-[2px] bg-white/90 backdrop-blur-sm text-stone-700 shadow-sm">
                          Stok: {hadiah.stok}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-4 space-y-1.5">
                        <h3 className="font-display text-sm font-semibold text-stone-900 line-clamp-1">
                          {hadiah.nama}
                        </h3>
                        <p className="text-xs text-[#7C8574] line-clamp-2 leading-relaxed">
                          {hadiah.deskripsi || 'Hadiah resmi bank sampah mitra.'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="p-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-3 bg-[#FAF8F5]/50">
                      <div>
                        <span className="font-display text-base font-bold text-[#0B3D26]">
                          {hadiah.poin_diperlukan}
                        </span>
                        <span className="text-[11px] font-semibold text-[#1F6B3F] ml-1">POIN</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenTukar(hadiah)}
                        disabled={!canAfford || isOutOfStock}
                        className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                          isOutOfStock
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : canAfford
                            ? 'bg-[#0B3D26] hover:bg-[#1F6B3F] text-[#F1ECDF]'
                            : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                        }`}
                      >
                        {isOutOfStock
                          ? 'Stok Habis'
                          : canAfford
                          ? 'Tukar Hadiah'
                          : `Kurang ${hadiah.poin_diperlukan - currentPoints} Poin`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Riwayat Penukaran */}
      {activeTab === 'riwayat' && (
        <div className="space-y-4">
          {/* Search, Filter & Sort Toolbar */}
          <DataTableToolbar
            searchValue={riwayatSearch}
            onSearchChange={handleRiwayatSearchChange}
            searchPlaceholder="Cari nama hadiah yang pernah ditukar..."
            filters={[
              {
                id: 'status',
                label: 'Filter Status Penukaran',
                value: riwayatStatus,
                options: PENUKARAN_STATUS_OPTIONS,
                onChange: handleRiwayatStatusChange,
              },
            ]}
            sortOptions={PENUKARAN_SORT_OPTIONS}
            sortBy={riwayatSortBy}
            sortDir={riwayatSortDir}
            onSortChange={handleRiwayatSortChange}
            pageSize={riwayatPageSize}
            onPageSizeChange={handleRiwayatPageSizeChange}
            totalCount={meta?.total}
            hasActiveFilters={hasActiveRiwayatFilters}
            onReset={handleRiwayatReset}
          />

          <div className="rounded-[4px] bg-white border border-stone-200 overflow-hidden shadow-xs">
            {isLoadingPenukarans ? (
              <div className="p-16 text-center">
                <div className="w-6 h-6 border-2 border-[#0B3D26] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-3 text-xs text-stone-500">Memuat riwayat penukaran...</p>
              </div>
            ) : penukarans.length === 0 ? (
              <div className="p-16 text-center space-y-2">
                <div className="w-12 h-12 rounded-[4px] bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="font-display text-sm font-semibold text-stone-900">
                  {hasActiveRiwayatFilters ? 'Tidak Ada Riwayat Sesuai Filter' : 'Belum Pernah Menukar Poin'}
                </h3>
                <p className="text-xs text-[#7C8574] max-w-sm mx-auto">
                  {hasActiveRiwayatFilters
                    ? 'Coba sesuaikan kata kunci pencarian atau filter status penukaran Anda.'
                    : 'Tukarkan poin Anda dengan berbagai pilihan hadiah di tab Katalog Hadiah.'}
                </p>
                {!hasActiveRiwayatFilters && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('katalog')}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-[#F1ECDF] text-xs font-semibold transition-all cursor-pointer"
                  >
                    Buka Katalog Hadiah
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-[#7C8574] font-semibold border-b border-stone-200">
                    <tr>
                      <th className="px-5 py-3">ID Penukaran</th>
                      <th className="px-5 py-3">Nama Hadiah</th>
                      <th className="px-5 py-3 text-right">Poin Ditukar</th>
                      <th className="px-5 py-3 text-center">Status</th>
                      <th className="px-5 py-3 text-right">Petunjuk Pengambilan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {penukarans.map((penukaran) => (
                      <tr key={penukaran.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-stone-500 whitespace-nowrap">
                          #{penukaran.id}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-stone-900">
                          {penukaran.hadiah?.nama ?? 'Hadiah Terpilih'}
                        </td>
                        <td className="px-5 py-3.5 text-right font-display font-semibold text-rose-700 whitespace-nowrap">
                          -{penukaran.poin_ditukar} Poin
                        </td>
                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          {getStatusBadge(penukaran.status)}
                        </td>
                        <td className="px-5 py-3.5 text-right text-stone-500 whitespace-nowrap">
                          Tunjukkan kode ID ke petugas unit bank sampah
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <Pagination meta={meta} onPageChange={setRiwayatPage} />
          </div>
        </div>
      )}

      {/* Tukar Hadiah Modal */}
      <TukarHadiahModal
        hadiah={selectedHadiah}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedHadiah(null);
        }}
        onSuccess={() => {
          refreshUser();
          refetchHadiahs();
          refetchPenukarans();
        }}
      />
    </motion.div>
  );
}
