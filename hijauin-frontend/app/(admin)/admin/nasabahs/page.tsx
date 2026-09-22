'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminNasabahs, useCreateNasabah, useDeleteNasabah } from '@/lib/queries/admin.queries';
import { DataTableToolbar } from '@/components/common/DataTableToolbar';
import { Pagination } from '@/components/ui/Pagination';
import { PasswordInput } from '@/components/ui/PasswordInput';

const BALANCE_OPTIONS = [
  { value: 'all', label: 'Semua Saldo' },
  { value: 'has_balance', label: 'Saldo Aktif (>0 Poin)' },
  { value: 'zero_balance', label: 'Saldo Nol (0 Poin)' },
];

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Tanggal Terdaftar' },
  { value: 'full_name', label: 'Nama Nasabah' },
  { value: 'saldo_poin', label: 'Saldo Poin' },
];

export default function AdminNasabahsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [balanceFilter, setBalanceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('');
  const [alamat, setAlamat] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Queries & Mutations
  const { data: nasabahsData, isLoading } = useAdminNasabahs({
    page,
    pageSize,
    search,
    balanceFilter: balanceFilter !== 'all' ? balanceFilter : undefined,
    sortBy,
    sortDir,
  });

  const createNasabah = useCreateNasabah();
  const deleteNasabah = useDeleteNasabah();

  const nasabahs = nasabahsData?.data ?? [];
  const meta = nasabahsData?.meta;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleBalanceChange = (val: string) => {
    setBalanceFilter(val);
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
    setBalanceFilter('all');
    setSortBy('created_at');
    setSortDir('desc');
    setPage(1);
  };

  const hasActiveFilters = search !== '' || balanceFilter !== 'all' || sortBy !== 'created_at' || sortDir !== 'desc';

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await createNasabah.mutateAsync({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        alamat: alamat.trim() || undefined,
      });

      setIsCreateModalOpen(false);
      setFullName('');
      setEmail('');
      setPassword('password123');
      setPhone('');
      setAlamat('');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal menambahkan nasabah.';
      setErrorMsg(message);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Hapus akun nasabah "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await deleteNasabah.mutateAsync(id);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Gagal menghapus nasabah.';
        alert(message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Buku Tabungan Nasabah
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Direktori warga penyetor sampah terdaftar dan saldo poin mutasi unit
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-[4px] bg-[#0B3D26] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1F6B3F] active:translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Daftarkan Nasabah Baru</span>
        </button>
      </div>

      {/* ── Toolbar: Search, Filter, Sort, Page Size ───────────── */}
      <DataTableToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari nama, email, telepon, atau alamat..."
        filters={[
          {
            id: 'balance',
            label: 'Filter Saldo Poin',
            value: balanceFilter,
            options: BALANCE_OPTIONS,
            onChange: handleBalanceChange,
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

      {/* ── Data Table ────────────────────────────────────────── */}
      <div className="rounded-[4px] border border-stone-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Nasabah & Akun</th>
                <th className="px-5 py-3">Kontak & Alamat</th>
                <th className="px-5 py-3 text-right">Saldo Poin</th>
                <th className="px-5 py-3">Terdaftar</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-stone-400">
                    Memuat data nasabah unit...
                  </td>
                </tr>
              ) : nasabahs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-stone-800">
                      {hasActiveFilters ? 'Tidak ada nasabah yang cocok dengan kriteria filter' : 'Belum ada nasabah terdaftar di unit ini'}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {hasActiveFilters ? 'Coba ubah kata kunci atau reset filter pencarian.' : 'Klik "Daftarkan Nasabah Baru" untuk menambahkan nasabah pertama.'}
                    </p>
                  </td>
                </tr>
              ) : (
                nasabahs.map((profile) => {
                  const initial = (profile.user?.full_name || 'N').charAt(0).toUpperCase();

                  return (
                    <tr key={profile.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0B3D26]/10 text-[#0B3D26] font-bold flex items-center justify-center shrink-0 text-xs">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 truncate">
                              {profile.user?.full_name || '—'}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">
                              {profile.user?.email || '—'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <p className="text-stone-800 font-medium">
                          {profile.user?.phone || '—'}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate max-w-xs">
                          {profile.alamat || 'Alamat belum diatur'}
                        </p>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-sm text-[#1F6B3F] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {Number(profile.saldo_poin ?? 0).toLocaleString('id-ID')}
                          <span className="text-[10px] uppercase font-sans text-emerald-800">poin</span>
                        </span>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          ± Rp {Number(profile.saldo_poin ?? 0).toLocaleString('id-ID')}
                        </p>
                      </td>

                      <td className="px-5 py-3.5 text-stone-500 text-[11px]">
                        {profile.user?.created_at
                          ? new Intl.DateTimeFormat('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }).format(new Date(profile.user.created_at))
                          : '—'}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(profile.id, profile.user?.full_name || 'Nasabah')}
                          className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          title="Hapus nasabah"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ─────────────────────────────── */}
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {/* ── Modal: Tambah Nasabah ─────────────────────────────── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-[4px] border border-stone-200 bg-white p-6 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-display text-lg font-bold text-stone-900">
                  Daftarkan Nasabah Unit
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {errorMsg && (
                <div className="mt-3 p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full rounded-[4px] border border-stone-300 px-3 py-2 text-xs text-stone-900 shadow-xs focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-[4px] border border-stone-300 px-3 py-2 text-xs text-stone-900 shadow-xs focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26]"
                  />
                </div>

                <PasswordInput
                  label="Password Awal"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  helperText="Minimal 8 karakter untuk keamanan akun."
                />

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full rounded-[4px] border border-stone-300 px-3 py-2 text-xs text-stone-900 shadow-xs focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Alamat Domisili / RT-RW
                  </label>
                  <textarea
                    rows={2}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Jl. Mawar No. 12, RT 03/RW 04"
                    className="w-full rounded-[4px] border border-stone-300 px-3 py-2 text-xs text-stone-900 shadow-xs focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26]"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-[4px] border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={createNasabah.isPending}
                    className="rounded-[4px] bg-[#0B3D26] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1F6B3F] disabled:opacity-50 cursor-pointer"
                  >
                    {createNasabah.isPending ? 'Menyimpan...' : 'Daftarkan Nasabah'}
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
