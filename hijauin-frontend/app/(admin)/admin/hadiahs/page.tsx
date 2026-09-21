'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminHadiahs, useCreateHadiah, useDeleteHadiah } from '@/lib/queries/admin.queries';
import { DataTableToolbar } from '@/components/common/DataTableToolbar';
import { Pagination } from '@/components/ui/Pagination';
import CloudinaryImageUpload from '@/components/common/CloudinaryImageUpload';

const STOCK_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Stok' },
  { value: 'tersedia', label: 'Stok Tersedia (>0)' },
  { value: 'habis', label: 'Stok Habis (0)' },
];

const SORT_OPTIONS = [
  { value: 'poin_diperlukan', label: 'Poin Diperlukan' },
  { value: 'stok', label: 'Jumlah Stok' },
  { value: 'nama', label: 'Nama Hadiah' },
  { value: 'created_at', label: 'Tanggal Ditambahkan' },
];

export default function AdminHadiahsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [stockStatus, setStockStatus] = useState('all');
  const [sortBy, setSortBy] = useState('poin_diperlukan');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [poinDiperlukan, setPoinDiperlukan] = useState('100');
  const [stok, setStok] = useState('20');
  const [fotoUrl, setFotoUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: hadiahsData, isLoading } = useAdminHadiahs({
    page,
    pageSize,
    search,
    stockStatus: stockStatus !== 'all' ? stockStatus : undefined,
    sortBy,
    sortDir,
  });
  const createHadiah = useCreateHadiah();
  const deleteHadiah = useDeleteHadiah();

  const hadiahs = hadiahsData?.data ?? [];
  const meta = hadiahsData?.meta;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStockStatusChange = (val: string) => {
    setStockStatus(val);
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
    setStockStatus('all');
    setSortBy('poin_diperlukan');
    setSortDir('asc');
    setPage(1);
  };

  const hasActiveFilters = search !== '' || stockStatus !== 'all' || sortBy !== 'poin_diperlukan' || sortDir !== 'asc';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await createHadiah.mutateAsync({
        nama: nama.trim(),
        deskripsi: deskripsi.trim() || undefined,
        poin_diperlukan: parseInt(poinDiperlukan, 10),
        stok: parseInt(stok, 10),
        foto_url: fotoUrl.trim() || undefined,
      });

      setIsModalOpen(false);
      // Reset form
      setNama('');
      setDeskripsi('');
      setPoinDiperlukan('100');
      setStok('20');
      setFotoUrl('');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal menyimpan hadiah baru.';
      setErrorMsg(message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus item hadiah ini dari katalog unit?')) {
      await deleteHadiah.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F6B3F]">
              Inventaris Unit
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-[#7C8574]">Total {meta?.total ?? hadiahs.length} hadiah</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-stone-900">
            Katalog Hadiah Bank Sampah
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-[#F1ECDF] text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Hadiah Baru
        </button>
      </div>

      {/* Search, Filter & Sort Toolbar */}
      <DataTableToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari nama atau deskripsi hadiah..."
        filters={[
          {
            id: 'stock_status',
            label: 'Filter Ketersediaan Stok',
            value: stockStatus,
            options: STOCK_FILTER_OPTIONS,
            onChange: handleStockStatusChange,
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
            <p className="mt-3 text-xs text-stone-500">Memuat katalog hadiah...</p>
          </div>
        ) : hadiahs.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <p className="font-display text-sm font-semibold text-stone-900">
              {hasActiveFilters ? 'Tidak Ada Hadiah Sesuai Filter' : 'Belum Ada Hadiah Didaftarkan'}
            </p>
            <p className="text-xs text-[#7C8574] max-w-sm mx-auto">
              {hasActiveFilters
                ? 'Coba sesuaikan kata kunci pencarian atau filter status stok Anda.'
                : 'Tambahkan item sembako atau barang kebutuhan warga yang dapat ditukar dengan poin.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[#7C8574] font-semibold border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3">Foto</th>
                  <th className="px-5 py-3">Nama Hadiah</th>
                  <th className="px-5 py-3 text-right">Poin Dibutuhkan</th>
                  <th className="px-5 py-3 text-right">Stok Tersedia</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {hadiahs.map((h) => (
                  <tr key={h.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="relative w-12 h-12 rounded-[4px] overflow-hidden border border-stone-200 bg-stone-100">
                        {h.foto_url ? (
                          <Image
                            src={h.foto_url}
                            alt={h.nama}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-stone-900">{h.nama}</p>
                      <p className="text-[11px] text-[#7C8574] line-clamp-1">{h.deskripsi}</p>
                    </td>
                    <td className="px-5 py-3 text-right font-display font-semibold text-[#0B3D26] whitespace-nowrap">
                      {h.poin_diperlukan} Poin
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded-[2px] font-semibold text-[11px] ${h.stok > 10 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                        }`}>
                        {h.stok} unit
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDelete(h.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {/* Modal Tambah Hadiah */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-white rounded-[4px] shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-stone-900">
                  Tambah Item Hadiah Baru
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-[4px] border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-500"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-4">
                {errorMsg && (
                  <div className="p-3 text-xs bg-rose-50 text-rose-800 border border-rose-200 rounded-[4px]">
                    {errorMsg}
                  </div>
                )}

                {/* Cloudinary Image Upload */}
                <CloudinaryImageUpload
                  label="Foto Produk Hadiah"
                  value={fotoUrl}
                  onChange={(url) => setFotoUrl(url)}
                  onRemove={() => setFotoUrl('')}
                  folder="hijauin/hadiahs"
                />

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Nama Hadiah / Sembako
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    placeholder="Contoh: Beras Ramos 2.5 kg"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Poin Diperlukan
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={poinDiperlukan}
                      onChange={(e) => setPoinDiperlukan(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Stok Awal
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={stok}
                      onChange={(e) => setStok(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={2}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Keterangan merk, volume, atau kemasan produk..."
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={createHadiah.isPending}
                    className="px-5 py-2 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {createHadiah.isPending ? 'Menyimpan...' : 'Simpan Hadiah'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
