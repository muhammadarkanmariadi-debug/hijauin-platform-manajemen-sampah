'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useOpsUsers,
  useCreateOpsUser,
  useUpdateOpsUser,
  useDeleteOpsUser,
  useOpsUnits,
} from '@/lib/queries/ops.queries';
import { DataTableToolbar } from '@/components/common/DataTableToolbar';
import { Pagination } from '@/components/ui/Pagination';
import Combobox, { type ComboboxOption } from '@/components/common/Combobox';
import type { User } from '@/lib/types';

const ROLE_OPTIONS: ComboboxOption[] = [
  {
    value: 'nasabah',
    label: 'Nasabah (Customer)',
    description: 'Buku tabungan bank sampah digital & penyetor sampah',
    badge: { text: 'NASABAH', color: '#1F6B3F', bgColor: '#1F6B3F15' },
  },
  {
    value: 'admin_unit',
    label: 'Admin Unit (Branch Staff)',
    description: 'Pengelola operasional penimbangan & verifikasi unit cabang',
    badge: { text: 'ADMIN UNIT', color: '#0B3D26', bgColor: '#0B3D2615' },
  },
  {
    value: 'platform_ops',
    label: 'Platform Ops (Superuser)',
    description: 'Akses tingkat sistem, kelola seluruh unit, pengguna, dan RBAC',
    badge: { text: 'SUPERUSER', color: '#B8873A', bgColor: '#B8873A15' },
  },
];

const ROLE_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Role' },
  { value: 'platform_ops', label: 'Platform Ops (Superuser)' },
  { value: 'admin_unit', label: 'Admin Unit' },
  { value: 'nasabah', label: 'Nasabah' },
];

const SORT_OPTIONS = [
  { value: 'id', label: 'ID Pengguna' },
  { value: 'full_name', label: 'Nama Lengkap' },
  { value: 'email', label: 'Alamat Email' },
  { value: 'created_at', label: 'Tanggal Registrasi' },
];

export default function OpsUsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states for creating new user
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('');
  const [roleCode, setRoleCode] = useState('admin_unit');
  const [unitId, setUnitId] = useState<number | ''>(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Queries & Mutations
  const { data: usersData, isLoading } = useOpsUsers({
    page,
    pageSize,
    search,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    unitId: unitFilter !== 'all' ? Number(unitFilter) : undefined,
    sortBy,
    sortDir,
  });
  const { data: units } = useOpsUnits();
  const createUser = useCreateOpsUser();
  const updateUser = useUpdateOpsUser();
  const deleteUser = useDeleteOpsUser();

  const users = usersData?.data ?? [];
  const meta = usersData?.meta;

  const unitFilterOptions = [
    { value: 'all', label: 'Semua Unit Cabang' },
    ...(units ?? []).map((u) => ({
      value: String(u.id),
      label: `Unit #${u.id} - ${u.nama}`,
    })),
  ];

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleFilterChange = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handleUnitFilterChange = (val: string) => {
    setUnitFilter(val);
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
    setRoleFilter('all');
    setUnitFilter('all');
    setSortBy('id');
    setSortDir('desc');
    setPage(1);
  };

  const hasActiveFilters = search !== '' || roleFilter !== 'all' || unitFilter !== 'all' || sortBy !== 'id' || sortDir !== 'desc';

  const unitOptions: ComboboxOption[] = (units ?? []).map((u) => ({
    value: u.id,
    label: u.nama,
    description: u.alamat || undefined,
    badge: { text: 'UNIT', color: '#1F6B3F', bgColor: '#1F6B3F15' },
  }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await createUser.mutateAsync({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        role_code: roleCode,
        unit_id: unitId ? Number(unitId) : null,
      });

      setIsCreateModalOpen(false);
      setFullName('');
      setEmail('');
      setPassword('password123');
      setPhone('');
      setRoleCode('admin_unit');
      setUnitId(1);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal menambahkan akun pengguna.';
      setErrorMsg(message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setErrorMsg('');

    try {
      await updateUser.mutateAsync({
        id: editingUser.id,
        payload: {
          full_name: fullName.trim(),
          phone: phone.trim() || undefined,
          role_code: roleCode,
          unit_id: unitId ? Number(unitId) : null,
        },
      });

      setEditingUser(null);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal memperbarui data pengguna.';
      setErrorMsg(message);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun "${name}"?`)) {
      try {
        await deleteUser.mutateAsync(id);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Gagal menghapus pengguna.';
        alert(message);
      }
    }
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFullName(u.full_name);
    setPhone(u.phone || '');
    const currentRole = u.user_roles?.[0]?.role?.code || 'nasabah';
    setRoleCode(currentRole);
    const currentUnit = u.user_roles?.[0]?.unit_id || 1;
    setUnitId(currentUnit);
    setErrorMsg('');
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'platform_ops':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Platform Ops
          </span>
        );
      case 'admin_unit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Admin Unit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
            Nasabah
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-2">
            Superuser Access
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3D26] tracking-tight">
            Kelola Pengguna & Akun
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-sans">
            Manajemen direktori akun pengguna, hak akses level unit, dan superuser platform.
          </p>
        </div>

        <button
          onClick={() => {
            setFullName('');
            setEmail('');
            setPassword('password123');
            setPhone('');
            setRoleCode('admin_unit');
            setUnitId(1);
            setErrorMsg('');
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-[4px] bg-[#0B3D26] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1F6B3F] active:translate-y-0.5 transition-all cursor-pointer shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Search, Filter & Sort Toolbar */}
      <DataTableToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari berdasarkan nama, email, atau telepon..."
        filters={[
          {
            id: 'role',
            label: 'Filter Peran (Role)',
            value: roleFilter,
            options: ROLE_FILTER_OPTIONS,
            onChange: handleRoleFilterChange,
          },
          {
            id: 'unit',
            label: 'Filter Unit Cabang',
            value: unitFilter,
            options: unitFilterOptions,
            onChange: handleUnitFilterChange,
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

      {/* Users Table */}
      <div className="rounded-[4px] border border-stone-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Pengguna</th>
                <th className="px-5 py-3">Peran / Role</th>
                <th className="px-5 py-3">Penugasan Unit</th>
                <th className="px-5 py-3">Kontak</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-stone-400">
                    Memuat daftar pengguna...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-stone-400">
                    Tidak ada data pengguna yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const role = u.user_roles?.[0]?.role?.code;
                  const unit = u.user_roles?.[0]?.unit?.nama || (role === 'platform_ops' ? 'Global (Semua Unit)' : '—');

                  return (
                    <tr key={u.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0B3D26] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                            {u.full_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-900 truncate">
                              {u.full_name}
                            </p>
                            <p className="text-[11px] text-stone-400 truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {getRoleBadge(role)}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-stone-800 font-medium truncate max-w-[200px]">
                          {unit}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-stone-500">
                        {u.phone || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer"
                        >
                          Ubah
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.full_name)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded border border-red-200 bg-red-50/50 hover:bg-red-100 text-[#C1441F] cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {/* ── Modal Tambah Pengguna ───────────────────────────────── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-[4px] bg-white border border-stone-200 p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-display text-lg font-bold text-[#0B3D26]">
                  Tambah Pengguna Baru
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
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
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Rahmat Subagyo"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@unit.test"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      No. Telepon / WA
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Password Sementara
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Peran / Role
                  </label>
                  <Combobox
                    options={ROLE_OPTIONS}
                    value={roleCode}
                    onChange={(val) => setRoleCode(String(val))}
                    placeholder="Pilih peran pengguna..."
                  />
                </div>

                {roleCode !== 'platform_ops' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Penugasan Unit Bank Sampah
                    </label>
                    <Combobox
                      options={unitOptions}
                      value={unitId}
                      onChange={(val) => setUnitId(Number(val))}
                      placeholder="Pilih unit bank sampah..."
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium rounded border border-stone-200 text-stone-600 hover:bg-stone-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={createUser.isPending}
                    className="px-4 py-2 text-xs font-semibold rounded bg-[#0B3D26] text-white hover:bg-[#1F6B3F] disabled:opacity-50"
                  >
                    {createUser.isPending ? 'Menyimpan...' : 'Simpan Pengguna'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal Edit Pengguna ─────────────────────────────────── */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-[4px] bg-white border border-stone-200 p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-display text-lg font-bold text-[#0B3D26]">
                  Ubah Akses Pengguna
                </h3>
                <button
                  onClick={() => setEditingUser(null)}
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

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    No. Telepon / WA
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Peran / Role
                  </label>
                  <Combobox
                    options={ROLE_OPTIONS}
                    value={roleCode}
                    onChange={(val) => setRoleCode(String(val))}
                    placeholder="Pilih peran pengguna..."
                  />
                </div>

                {roleCode !== 'platform_ops' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Penugasan Unit Bank Sampah
                    </label>
                    <Combobox
                      options={unitOptions}
                      value={unitId}
                      onChange={(val) => setUnitId(Number(val))}
                      placeholder="Pilih unit bank sampah..."
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 text-xs font-medium rounded border border-stone-200 text-stone-600 hover:bg-stone-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={updateUser.isPending}
                    className="px-4 py-2 text-xs font-semibold rounded bg-[#0B3D26] text-white hover:bg-[#1F6B3F] disabled:opacity-50"
                  >
                    {updateUser.isPending ? 'Menyimpan...' : 'Perbarui Pengguna'}
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
