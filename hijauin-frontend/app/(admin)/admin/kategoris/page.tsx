'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminKategoris, useCreateKategori, useDeleteKategori } from '@/lib/queries/admin.queries';
import { DataTableToolbar } from '@/components/common/DataTableToolbar';
import { Pagination } from '@/components/ui/Pagination';
import CloudinaryImageUpload from '@/components/common/CloudinaryImageUpload';
import Combobox, { type ComboboxOption } from '@/components/common/Combobox';
import RupiahInput from '@/components/ui/RupiahInput';
import type { JenisSampah } from '@/lib/types';

const MATERIAL_OPTIONS: ComboboxOption[] = [
  {
    value: 'plastik',
    label: 'Plastik (Polymer)',
    description: 'PET, HDPE, LDPE, PP, multilayer',
    image: 'https://images.unsplash.com/photo-1526951521990-620dc14c214b?w=120&auto=format&fit=crop&q=80',
    badge: {
      text: 'PLASTIK',
      color: '#2F7DB8',
      bgColor: '#2F7DB815',
    },
  },
  {
    value: 'kertas',
    label: 'Kertas (Fiber)',
    description: 'Kardus, kertas putih, koran, duplex',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=120&auto=format&fit=crop&q=80',
    badge: {
      text: 'KERTAS',
      color: '#B8873A',
      bgColor: '#B8873A15',
    },
  },
  {
    value: 'logam',
    label: 'Logam (Metal)',
    description: 'Kaleng aluminium, besi padu, seng, tembaga',
    image: 'https://images.unsplash.com/photo-1599818816949-c18751846b41?w=120&auto=format&fit=crop&q=80',
    badge: {
      text: 'LOGAM',
      color: '#8A94A0',
      bgColor: '#8A94A015',
    },
  },
  {
    value: 'kaca',
    label: 'Kaca (Glass)',
    description: 'Botol kaca sirup, toples, pecahan kaca',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=120&auto=format&fit=crop&q=80',
    badge: {
      text: 'KACA',
      color: '#4FA6A0',
      bgColor: '#4FA6A015',
    },
  },
];

const JENIS_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Klasifikasi' },
  { value: 'plastik', label: 'Plastik' },
  { value: 'kertas', label: 'Kertas' },
  { value: 'logam', label: 'Logam' },
  { value: 'kaca', label: 'Kaca' },
];

const SORT_OPTIONS = [
  { value: 'nama', label: 'Nama Material' },
  { value: 'poin_per_kg', label: 'Poin / kg' },
  { value: 'harga_per_kg', label: 'Tarif Rupiah / kg' },
  { value: 'created_at', label: 'Tanggal Dibuat' },
];

export default function AdminKategorisPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [jenisFilter, setJenisFilter] = useState('all');
  const [sortBy, setSortBy] = useState('nama');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState<JenisSampah>('plastik');
  const [hargaPerKg, setHargaPerKg] = useState('3000');
  const [poinPerKg, setPoinPerKg] = useState('30');
  const [deskripsi, setDeskripsi] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: kategorisData, isLoading } = useAdminKategoris({
    page,
    pageSize,
    search,
    jenis: jenisFilter !== 'all' ? jenisFilter : undefined,
    sortBy,
    sortDir,
  });
  const createKategori = useCreateKategori();
  const deleteKategori = useDeleteKategori();

  const kategoris = kategorisData?.data ?? [];
  const meta = kategorisData?.meta;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleJenisChange = (val: string) => {
    setJenisFilter(val);
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
    setJenisFilter('all');
    setSortBy('nama');
    setSortDir('asc');
    setPage(1);
  };

  const hasActiveFilters = search !== '' || jenisFilter !== 'all' || sortBy !== 'nama' || sortDir !== 'asc';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await createKategori.mutateAsync({
        nama: nama.trim(),
        jenis,
        harga_per_kg: parseFloat(hargaPerKg),
        poin_per_kg: parseInt(poinPerKg, 10),
        deskripsi: deskripsi.trim() || undefined,
        foto_url: fotoUrl.trim() || undefined,
      });

      setIsModalOpen(false);
      // Reset form
      setNama('');
      setJenis('plastik');
      setHargaPerKg('3000');
      setPoinPerKg('30');
      setDeskripsi('');
      setFotoUrl('');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal menyimpan kategori material baru.';
      setErrorMsg(message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus kategori sampah ini?')) {
      await deleteKategori.mutateAsync(id);
    }
  };

  const getMaterialColor = (j: JenisSampah) => {
    switch (j) {
      case 'plastik':
        return '#2F7DB8';
      case 'kertas':
        return '#B8873A';
      case 'logam':
        return '#8A94A0';
      case 'kaca':
        return '#4FA6A0';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F6B3F]">
              Standarisasi Material
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-[#7C8574]">
              Total {meta?.total ?? kategoris.length} kategori
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-stone-900">
            Daftar Kategori Sampah Unit
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
          Tambah Kategori Baru
        </button>
      </div>

      {/* Search, Filter & Sort Toolbar */}
      <DataTableToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari nama atau deskripsi kategori material..."
        filters={[
          {
            id: 'jenis',
            label: 'Filter Klasifikasi',
            value: jenisFilter,
            options: JENIS_FILTER_OPTIONS,
            onChange: handleJenisChange,
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
            <p className="mt-3 text-xs text-stone-500">Memuat kategori sampah...</p>
          </div>
        ) : kategoris.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <p className="font-display text-sm font-semibold text-stone-900">
              {hasActiveFilters ? 'Tidak Ada Kategori Sesuai Filter' : 'Belum Ada Kategori Didaftarkan'}
            </p>
            <p className="text-xs text-[#7C8574] max-w-sm mx-auto">
              {hasActiveFilters
                ? 'Coba sesuaikan kata kunci pencarian atau filter klasifikasi material Anda.'
                : 'Daftarkan kategori sampah anorganik agar nasabah dapat mulai melakukan penyetoran.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[#7C8574] font-semibold border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3">Foto</th>
                  <th className="px-5 py-3">Kategori</th>
                  <th className="px-5 py-3">Klasifikasi</th>
                  <th className="px-5 py-3 text-right">Tarif / kg</th>
                  <th className="px-5 py-3 text-right">Poin / kg</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {kategoris.map((k) => (
                  <tr key={k.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="relative w-12 h-12 rounded-[4px] overflow-hidden border border-stone-200 bg-stone-100">
                        {k.foto_url ? (
                          <Image
                            src={k.foto_url}
                            alt={k.nama}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-stone-900">{k.nama}</p>
                      <p className="text-[11px] text-[#7C8574] line-clamp-1">{k.deskripsi}</p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span
                        className="inline-block px-2 py-0.5 rounded-[2px] font-bold text-[10px] uppercase tracking-wide"
                        style={{
                          color: getMaterialColor(k.jenis),
                          backgroundColor: `${getMaterialColor(k.jenis)}15`,
                        }}
                      >
                        {k.jenis}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-stone-900 whitespace-nowrap">
                      Rp {Number(k.harga_per_kg ?? 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-3 text-right font-display font-semibold text-[#0B3D26] whitespace-nowrap">
                      +{Number(k.poin_per_kg ?? 0)} Poin
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDelete(k.id)}
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

      {/* Modal Tambah Kategori */}
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
                  Tambah Kategori Sampah Baru
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
                  label="Foto Contoh Fisik Material"
                  value={fotoUrl}
                  onChange={(url) => setFotoUrl(url)}
                  onRemove={() => setFotoUrl('')}
                  folder="hijauin/kategoris"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Nama Kategori
                    </label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      required
                      placeholder="Contoh: Botol PET Bening"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Klasifikasi Material
                    </label>
                    <Combobox
                      options={MATERIAL_OPTIONS}
                      value={jenis}
                      onChange={(val) => setJenis(val as JenisSampah)}
                      placeholder="Pilih klasifikasi material..."
                      searchPlaceholder="Cari material..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <RupiahInput
                      label="Tarif Rupiah per kg"
                      value={hargaPerKg}
                      onValueChange={(rawVal) => setHargaPerKg(String(rawVal))}
                      suffix="/ kg"
                      inputSize="sm"
                      placeholder="Contoh: 3.000"
                      quickAmounts={[1000, 2500, 5000]}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      Poin per kg
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={poinPerKg}
                      onChange={(e) => setPoinPerKg(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Petunjuk Pemilahan
                  </label>
                  <textarea
                    rows={2}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Contoh: Bersih dari cairan dan tutup botol dilepas..."
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
                    disabled={createKategori.isPending}
                    className="px-5 py-2 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {createKategori.isPending ? 'Menyimpan...' : 'Simpan Kategori'}
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
