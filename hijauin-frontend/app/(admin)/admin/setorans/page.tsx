'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminSetorans, useVerifySetoran } from '@/lib/queries/admin.queries';
import { DataTableToolbar } from '@/components/common/DataTableToolbar';
import { Pagination } from '@/components/ui/Pagination';
import type { SetorSampah, StatusSetoran } from '@/lib/types';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'menunggu_konfirmasi', label: 'Menunggu Verifikasi' },
  { value: 'diverifikasi', label: 'Terverifikasi' },
  { value: 'ditolak', label: 'Ditolak' },
  { value: 'selesai', label: 'Selesai' },
];

const SORT_OPTIONS = [
  { value: 'tanggal', label: 'Tanggal Setoran' },
  { value: 'created_at', label: 'Waktu Pengajuan' },
  { value: 'status', label: 'Status' },
  { value: 'id', label: 'Nomor Antrean ID' },
];

export default function AdminSetoransPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('tanggal');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Verification Modal State
  const [selectedSetoran, setSelectedSetoran] = useState<SetorSampah | null>(null);
  const [verifyItems, setVerifyItems] = useState<{ detail_setor_id: number; berat_kg_real: number; accepted: boolean }[]>([]);
  const [verifyError, setVerifyError] = useState('');

  const { data: setoransData, isLoading } = useAdminSetorans({
    page,
    pageSize,
    search,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sortBy,
    sortDir,
  });

  const verifyMutation = useVerifySetoran();

  const setorans = setoransData?.data ?? [];
  const meta = setoransData?.meta;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
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
    setStatusFilter('all');
    setSortBy('tanggal');
    setSortDir('desc');
    setPage(1);
  };

  const hasActiveFilters = search !== '' || statusFilter !== 'all' || sortBy !== 'tanggal' || sortDir !== 'desc';

  const openVerifyModal = (setoran: SetorSampah) => {
    setSelectedSetoran(setoran);
    setVerifyError('');
    // Pre-populate verify items
    const initialItems = (setoran.details ?? []).map((d) => ({
      detail_setor_id: d.id,
      berat_kg_real: d.berat_kg_real ? Number(d.berat_kg_real) : Number(d.berat_kg_estimasi),
      accepted: true,
    }));
    setVerifyItems(initialItems);
  };

  const handleItemWeightChange = (detailId: number, weight: number) => {
    setVerifyItems((prev) =>
      prev.map((item) =>
        item.detail_setor_id === detailId ? { ...item, berat_kg_real: Math.max(0, weight) } : item
      )
    );
  };

  const handleItemAcceptedToggle = (detailId: number) => {
    setVerifyItems((prev) =>
      prev.map((item) =>
        item.detail_setor_id === detailId ? { ...item, accepted: !item.accepted } : item
      )
    );
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSetoran) return;
    setVerifyError('');

    try {
      await verifyMutation.mutateAsync({
        id: selectedSetoran.id,
        input: {
          items: verifyItems,
        },
      });
      setSelectedSetoran(null);
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setVerifyError(errorResponse.response?.data?.message || 'Gagal memverifikasi setoran.');
    }
  };

  const getStatusBadge = (status: StatusSetoran) => {
    switch (status) {
      case 'diverifikasi':
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[3px] text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Terverifikasi
          </span>
        );
      case 'menunggu_konfirmasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[3px] text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Menunggu Timbang
          </span>
        );
      case 'ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[3px] text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-[3px] text-[11px] font-semibold bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F6B3F]">
              Operasional Penimbangan
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-[#7C8574]">Total {meta?.total ?? setorans.length} data setoran</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-stone-900">
            Verifikasi & Penimbangan Sampah
          </h1>
        </div>
      </div>

      {/* Search, Filter & Sort Toolbar */}
      <DataTableToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari nama nasabah, kontak, atau catatan setoran..."
        filters={[
          {
            id: 'status',
            label: 'Filter Status Setoran',
            value: statusFilter,
            options: STATUS_FILTER_OPTIONS,
            onChange: handleStatusChange,
          },
        ]}
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

      {/* Table */}
      <div className="rounded-[4px] bg-white border border-stone-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-16 text-center">
            <div className="w-6 h-6 border-2 border-[#0B3D26] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-xs text-stone-500">Memuat data setoran...</p>
          </div>
        ) : setorans.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <p className="font-display text-sm font-semibold text-stone-900">
              {hasActiveFilters ? 'Tidak Ada Setoran Sesuai Filter' : 'Belum Ada Antrean Setoran'}
            </p>
            <p className="text-xs text-[#7C8574] max-w-sm mx-auto">
              {hasActiveFilters
                ? 'Coba sesuaikan kata kunci pencarian atau filter status yang Anda pilih.'
                : 'Setoran yang diajukan oleh nasabah unit Anda akan muncul di antrean ini.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[#7C8574] font-semibold border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3">ID / Tanggal</th>
                  <th className="px-5 py-3">Nasabah</th>
                  <th className="px-5 py-3">Rincian Material</th>
                  <th className="px-5 py-3 text-right">Berat (Est / Real)</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {setorans.map((s) => {
                  const estKg = s.details?.reduce((acc, d) => acc + Number(d.berat_kg_estimasi || 0), 0) ?? 0;
                  const realKg = s.details?.reduce((acc, d) => acc + (d.berat_kg_real ? Number(d.berat_kg_real) : 0), 0) ?? 0;
                  const totalPoin = s.details?.reduce((acc, d) => acc + (d.subtotal_poin ?? 0), 0) ?? 0;
                  const isPending = s.status === 'menunggu_konfirmasi';

                  return (
                    <tr key={s.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="font-mono text-[11px] font-bold text-stone-800">
                          #{s.id}
                        </span>
                        <p className="text-[11px] text-[#7C8574] mt-0.5">
                          {new Date(s.tanggal).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-stone-900">
                          {s.nasabah_profile?.user?.full_name || 'Nasabah'}
                        </p>
                        <p className="text-[11px] text-[#7C8574]">
                          {s.nasabah_profile?.user?.phone || s.nasabah_profile?.user?.email || '-'}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {s.details?.map((d) => (
                            <span
                              key={d.id}
                              className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-stone-100 text-stone-700 border border-stone-200"
                            >
                              {d.kategori_sampah?.nama || 'Material'}: {d.berat_kg_real ?? d.berat_kg_estimasi}kg
                            </span>
                          ))}
                        </div>
                        {s.catatan && (
                          <p className="text-[11px] text-stone-500 italic mt-1 line-clamp-1">
                            &quot;{s.catatan}&quot;
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <p className="font-semibold text-stone-900">
                          {s.status === 'menunggu_konfirmasi' ? `${estKg.toFixed(1)} kg (Est)` : `${realKg.toFixed(1)} kg`}
                        </p>
                        {totalPoin > 0 && (
                          <p className="font-display text-[11px] font-bold text-[#0B3D26]">
                            +{totalPoin} Poin
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center whitespace-nowrap">
                        {getStatusBadge(s.status)}
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {isPending ? (
                          <button
                            type="button"
                            onClick={() => openVerifyModal(s)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
                          >
                            <span>Timbang Fisik</span>
                            <span>→</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openVerifyModal(s)}
                            className="text-xs text-stone-500 hover:text-stone-800 font-medium cursor-pointer"
                          >
                            Lihat Rincian
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {/* Modal Timbang & Verifikasi Setoran */}
      <AnimatePresence>
        {selectedSetoran && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-xl bg-white rounded-[4px] shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F6B3F]">
                    Verifikasi Penimbangan #{selectedSetoran.id}
                  </span>
                  <h2 className="font-display text-lg font-bold text-stone-900">
                    {selectedSetoran.nasabah_profile?.user?.full_name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSetoran(null)}
                  className="w-8 h-8 rounded-[4px] border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-500 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleVerifySubmit} className="p-6 overflow-y-auto space-y-4">
                {verifyError && (
                  <div className="p-3 text-xs bg-rose-50 text-rose-800 border border-rose-200 rounded-[4px]">
                    {verifyError}
                  </div>
                )}

                <div className="p-3 rounded bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
                  <p className="font-semibold">Aturan Verifikasi:</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Masukkan timbangan berat riil aktual material. Poin nasabah akan dihitung otomatis saat Anda menyimpan hasil timbangan.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-stone-800">
                    Daftar Material yang Diserahkan
                  </h3>

                  {(selectedSetoran.details ?? []).map((d) => {
                    const itemState = verifyItems.find((v) => v.detail_setor_id === d.id);
                    const isAccepted = itemState?.accepted ?? true;
                    const realWeight = itemState?.berat_kg_real ?? Number(d.berat_kg_estimasi);
                    const isLocked = selectedSetoran.status !== 'menunggu_konfirmasi';

                    return (
                      <div
                        key={d.id}
                        className={`p-3.5 rounded-[4px] border transition-colors ${
                          isAccepted
                            ? 'bg-[#FAF8F5] border-stone-200'
                            : 'bg-rose-50/40 border-rose-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div>
                            <span className="font-bold text-xs text-stone-900">
                              {d.kategori_sampah?.nama}
                            </span>
                            <span className="text-[10px] text-stone-500 uppercase tracking-wider ml-2">
                              ({d.kategori_sampah?.jenis})
                            </span>
                          </div>

                          {!isLocked && (
                            <button
                              type="button"
                              onClick={() => handleItemAcceptedToggle(d.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                                isAccepted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isAccepted ? '✓ Diterima' : '✕ Ditolak'}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[11px] text-stone-500 block">Estimasi Nasabah:</span>
                            <span className="font-medium text-stone-800">
                              {d.berat_kg_estimasi} kg
                            </span>
                          </div>

                          <div>
                            <label htmlFor={`item-weight-${d.id}`} className="text-[11px] text-stone-500 block">
                              Berat Aktual (kg):
                            </label>
                            {isLocked ? (
                              <span className="font-bold text-stone-900">
                                {d.berat_kg_real ?? d.berat_kg_estimasi} kg
                              </span>
                            ) : (
                              <input
                                id={`item-weight-${d.id}`}
                                type="number"
                                step="0.01"
                                min="0"
                                value={realWeight}
                                onChange={(e) =>
                                  handleItemWeightChange(d.id, parseFloat(e.target.value) || 0)
                                }
                                disabled={!isAccepted}
                                className="w-full mt-0.5 px-2.5 py-1 text-xs font-semibold bg-white border border-stone-300 rounded focus:border-[#0B3D26] focus:outline-none"
                              />
                            )}
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-[#7C8574]">
                          <span>Tarif Unit: Rp {d.kategori_sampah?.harga_per_kg?.toLocaleString('id-ID')} / kg</span>
                          <span className="font-semibold text-[#0B3D26]">
                            +{Math.round(realWeight * (d.kategori_sampah?.poin_per_kg ?? 0))} Poin
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setSelectedSetoran(null)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Tutup
                  </button>

                  {selectedSetoran.status === 'menunggu_konfirmasi' && (
                    <button
                      type="submit"
                      disabled={verifyMutation.isPending}
                      className="px-5 py-2 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      {verifyMutation.isPending ? 'Memproses...' : 'Simpan Hasil Verifikasi'}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
