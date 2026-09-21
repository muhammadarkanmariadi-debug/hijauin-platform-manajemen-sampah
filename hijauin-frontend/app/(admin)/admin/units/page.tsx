'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOpsUnitsPaginated, useCreateOpsUnit } from '@/lib/queries/ops.queries';
import { DataTableToolbar } from '@/components/common/DataTableToolbar';
import { Pagination } from '@/components/ui/Pagination';

const SORT_OPTIONS = [
  { value: 'id', label: 'ID Unit' },
  { value: 'nama', label: 'Nama Cabang' },
  { value: 'nasabah_profiles_count', label: 'Jumlah Nasabah' },
  { value: 'created_at', label: 'Tanggal Bergabung' },
];

export default function OpsUnitsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [telepon, setTelepon] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: unitsData, isLoading } = useOpsUnitsPaginated({
    page,
    pageSize,
    search,
    sortBy,
    sortDir,
  });
  const createUnit = useCreateOpsUnit();

  const units = unitsData?.data ?? [];
  const meta = unitsData?.meta;

  const handleSearchChange = (val: string) => {
    setSearch(val);
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
    setSortBy('id');
    setSortDir('asc');
    setPage(1);
  };

  const hasActiveFilters = search !== '' || sortBy !== 'id' || sortDir !== 'asc';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await createUnit.mutateAsync({
        nama: nama.trim(),
        alamat: alamat.trim() || undefined,
        telepon: telepon.trim() || undefined,
        deskripsi: deskripsi.trim() || undefined,
      });

      setIsModalOpen(false);
      setNama('');
      setAlamat('');
      setTelepon('');
      setDeskripsi('');
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setErrorMsg(errorResponse.response?.data?.message || 'Gagal menambahkan unit bank sampah.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-2">
            Multi-Tenant Branches
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3D26] tracking-tight">
            Direktori Unit Bank Sampah
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-sans">
            Cabang operasional bank sampah komunitas yang terhubung dalam platform Hijauin.
          </p>
        </div>

        <button
          onClick={() => {
            setNama('');
            setAlamat('');
            setTelepon('');
            setDeskripsi('');
            setErrorMsg('');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-[4px] bg-[#0B3D26] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1F6B3F] active:translate-y-0.5 transition-all cursor-pointer shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Cabang Unit</span>
        </button>
      </div>

      {/* Search & Sort Toolbar */}
      <DataTableToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari nama cabang unit, alamat, atau nomor telepon..."
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

      {/* Units Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <div className="col-span-full p-16 text-center text-xs text-stone-400 bg-white rounded border border-stone-200">
              <div className="w-6 h-6 border-2 border-[#0B3D26] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Memuat direktori unit...
            </div>
          ) : units.length === 0 ? (
            <div className="col-span-full p-16 text-center text-xs text-stone-500 bg-white rounded border border-stone-200">
              {hasActiveFilters ? 'Tidak ada cabang unit yang sesuai dengan pencarian.' : 'Belum ada cabang unit bank sampah terdaftar.'}
            </div>
          ) : (
            units.map((unit) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[4px] border border-stone-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200">
                      ID UNIT #{unit.id}
                    </span>

                    <span className="text-xs font-semibold text-stone-600">
                      {unit.nasabah_profiles_count ?? 0} Nasabah
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-stone-900 leading-snug">
                    {unit.nama}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {unit.alamat || 'Alamat cabang belum ditentukan'}
                  </p>

                  {unit.deskripsi && (
                    <p className="text-[11px] text-stone-500 italic bg-[#FAF8F5] p-2.5 rounded border border-stone-100">
                      &ldquo;{unit.deskripsi}&rdquo;
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{unit.telepon || '—'}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B3D26]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Aktif
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="rounded-[4px] border border-stone-200 overflow-hidden">
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      </div>

      {/* ── Modal Tambah Unit Baru ─────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-[4px] bg-white border border-stone-200 p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-display text-lg font-bold text-[#0B3D26]">
                  Tambah Cabang Bank Sampah Baru
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 text-xs bg-red-50 text-[#C1441F] border border-red-200 rounded">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Nama Bank Sampah Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Bank Sampah Harapan Mulia (RW 03)"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Alamat Lengkap Cabang
                  </label>
                  <textarea
                    rows={2}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Jl. Kenanga No. 10, RT 02/RW 03, Kelurahan..."
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    No. Telepon / Layanan Kontak Unit
                  </label>
                  <input
                    type="text"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Deskripsi / Catatan Wilayah
                  </label>
                  <textarea
                    rows={2}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Unit pelayanan komunitas terpadu mandiri..."
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium rounded border border-stone-200 text-stone-600 hover:bg-stone-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={createUnit.isPending}
                    className="px-4 py-2 text-xs font-semibold rounded bg-[#0B3D26] text-white hover:bg-[#1F6B3F] disabled:opacity-50"
                  >
                    {createUnit.isPending ? 'Menyimpan...' : 'Simpan Cabang Unit'}
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
