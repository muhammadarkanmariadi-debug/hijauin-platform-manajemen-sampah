'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSetorans } from '@/lib/queries/setoran.queries';
import { useAuthStore } from '@/lib/auth';
import { DataTableToolbar } from '@/components/common/DataTableToolbar';
import { Pagination } from '@/components/ui/Pagination';
import SetorModal from '@/components/nasabah/SetorModal';
import type { StatusSetoran } from '@/lib/types';

const STATUS_TABS = [
  { id: 'all', label: 'Semua Setoran' },
  { id: 'menunggu_konfirmasi', label: 'Menunggu Timbang' },
  { id: 'diverifikasi', label: 'Terverifikasi' },
  { id: 'ditolak', label: 'Ditolak' },
];

const SORT_OPTIONS = [
  { value: 'tanggal', label: 'Tanggal Setoran' },
  { value: 'created_at', label: 'Waktu Pengajuan' },
  { value: 'status', label: 'Status' },
];

export default function SetoransPage() {
  const { refreshUser } = useAuthStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState('tanggal');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: setoransData, isLoading, refetch } = useSetorans({
    page,
    pageSize,
    search,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    sortBy,
    sortDir,
  });

  const setorans = setoransData?.data ?? [];
  const meta = setoransData?.meta;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (statusId: string) => {
    setSelectedStatus(statusId);
    setPage(1);
  };

  const handleSortChange = (newSortBy: string, newSortDir: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedStatus('all');
    setSortBy('tanggal');
    setSortDir('desc');
    setPage(1);
  };

  const hasActiveFilters = search !== '' || selectedStatus !== 'all' || sortBy !== 'tanggal' || sortDir !== 'desc';

  const getStatusBadge = (status: StatusSetoran) => {
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
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F6B3F]">
              Riwayat Penyetoran
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-[#7C8574]">
              Total {meta?.total ?? setorans.length} kali penyetoran
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Daftar Setoran Sampah
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-[#F1ECDF] text-xs font-semibold tracking-wide transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Setor Sampah Baru
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-1 overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const isActive = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleStatusChange(tab.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-[4px] transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#0B3D26] text-white font-semibold shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Sort Toolbar */}
      <DataTableToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari catatan atau jenis material sampah..."
        sortOptions={SORT_OPTIONS}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        totalCount={meta?.total}
        hasActiveFilters={hasActiveFilters}
        onReset={handleResetFilters}
      />

      {/* Content Table */}
      <div className="rounded-[4px] bg-white border border-stone-200 overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center">
            <div className="w-6 h-6 border-2 border-[#0B3D26] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-xs text-stone-500">Memuat data setoran...</p>
          </div>
        ) : setorans.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-[4px] bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-display text-sm font-semibold text-stone-900">
              Tidak Ada Data Setoran
            </h3>
            <p className="text-xs text-[#7C8574] max-w-sm mx-auto">
              {hasActiveFilters
                ? 'Tidak ada setoran yang sesuai dengan filter pencarian Anda.'
                : 'Anda belum memiliki riwayat setoran. Klik tombol di bawah untuk membuat setoran baru.'}
            </p>
            {!hasActiveFilters && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-[#F1ECDF] text-xs font-semibold transition-all cursor-pointer"
              >
                + Mulai Setor Sekarang
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[#7C8574] font-semibold border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3">No. Ref</th>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Detail Material & Berat</th>
                  <th className="px-5 py-3 text-right">Total Berat</th>
                  <th className="px-5 py-3 text-right">Poin Diperoleh</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {setorans.map((setoran) => {
                  const totalKg =
                    setoran.details?.reduce(
                      (acc, d) => acc + Number(d.berat_kg_real ?? d.berat_kg_estimasi ?? 0),
                      0
                    ) ?? 0;
                  const totalPoin =
                    setoran.details?.reduce((acc, d) => acc + Number(d.subtotal_poin ?? 0), 0) ?? 0;

                  return (
                    <tr key={setoran.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                        #{setoran.id}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-stone-900 whitespace-nowrap">
                        {new Intl.DateTimeFormat('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }).format(new Date(setoran.tanggal))}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1.5 max-w-sm">
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
                        {totalKg.toFixed(1)} kg
                      </td>
                      <td className="px-5 py-3.5 text-right font-display font-semibold text-[#0B3D26] whitespace-nowrap">
                        {totalPoin > 0 ? `+${totalPoin}` : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        {getStatusBadge(setoran.status)}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <Link
                          href={`/setorans/${setoran.id}`}
                          className="px-3 py-1.5 rounded-[4px] border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-xs font-medium text-stone-800 transition-colors"
                        >
                          Lihat Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {/* Setor Modal */}
      <SetorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch();
          refreshUser();
        }}
      />
    </motion.div>
  );
}
