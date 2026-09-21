'use client';

import { useState, useMemo } from 'react';
import { useOpsRoles } from '@/lib/queries/ops.queries';
import { motion } from 'framer-motion';

interface PermissionMatrixRow {
  module: string;
  action: string;
  nasabah: boolean;
  admin_unit: boolean;
  platform_ops: boolean;
}

const PERMISSIONS_MATRIX: PermissionMatrixRow[] = [
  { module: 'Autentikasi & Akun', action: 'Buka Buku Rekening & Profil', nasabah: true, admin_unit: true, platform_ops: true },
  { module: 'Setoran Sampah', action: 'Ajukan Penyerahan Sampah Online', nasabah: true, admin_unit: false, platform_ops: false },
  { module: 'Setoran Sampah', action: 'Timbang & Verifikasi Fisik Sampah', nasabah: false, admin_unit: true, platform_ops: true },
  { module: 'Katalog Hadiah', action: 'Tukar Saldo Poin dengan Reward', nasabah: true, admin_unit: false, platform_ops: false },
  { module: 'Katalog Hadiah', action: 'Kelola Stok Sembako & Tarif Poin', nasabah: false, admin_unit: true, platform_ops: true },
  { module: 'Kategori Sampah', action: 'Atur Tarif Beli Rupiah & Poin per kg', nasabah: false, admin_unit: true, platform_ops: true },
  { module: 'Pelaporan & Rekap', action: 'Unduh Neraca Massa Unit Bulanan', nasabah: false, admin_unit: true, platform_ops: true },
  { module: 'Direktori Unit', action: 'Buka Cabang Bank Sampah Baru', nasabah: false, admin_unit: false, platform_ops: true },
  { module: 'Manajemen RBAC', action: 'Kelola Pengguna, Peran, & Hak Akses', nasabah: false, admin_unit: false, platform_ops: true },
];

export default function OpsRolesPage() {
  const { data: roles, isLoading } = useOpsRoles();
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const uniqueModules = useMemo(() => {
    return Array.from(new Set(PERMISSIONS_MATRIX.map((p) => p.module)));
  }, []);

  const filteredMatrix = useMemo(() => {
    return PERMISSIONS_MATRIX.filter((item) => {
      const matchModule = moduleFilter === 'all' || item.module === moduleFilter;
      const matchSearch =
        search === '' ||
        item.action.toLowerCase().includes(search.toLowerCase()) ||
        item.module.toLowerCase().includes(search.toLowerCase());
      return matchModule && matchSearch;
    });
  }, [search, moduleFilter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-2">
          RBAC Security Matrix
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3D26] tracking-tight">
          Peran & Hak Akses (RBAC)
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 font-sans">
          Arsitektur kontrol akses berbasis peran (Role-Based Access Control) multi-tenant Hijauin.
        </p>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-3 p-8 text-center text-xs text-stone-400 bg-white rounded border border-stone-200">
            Memuat daftar peran...
          </div>
        ) : (
          roles?.map((role) => {
            const isOps = role.code === 'platform_ops';
            const isAdmin = role.code === 'admin_unit';

            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[4px] border border-stone-200 bg-white p-6 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        isOps
                          ? 'bg-amber-50 text-amber-900 border-amber-200'
                          : isAdmin
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {role.code}
                    </span>

                    <span className="text-xs font-semibold text-stone-500">
                      {role.user_roles_count ?? 0} akun
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-stone-900">
                    {role.name}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {role.description || 'Hak akses tingkat sistem.'}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 text-[11px] text-[#7C8574] flex items-center justify-between">
                  <span>Scope Tenancy:</span>
                  <span className="font-semibold text-stone-800">
                    {isOps ? 'Global (Multi-Unit)' : 'Single Branch Unit'}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Permissions Matrix Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-[#0B3D26]">
            Matriks Otorisasi Fitur Platform
          </h2>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari izin fitur..."
                aria-label="Cari izin fitur"
                className="w-48 sm:w-64 rounded-[4px] border border-stone-300 bg-white py-1.5 pl-3 pr-8 text-xs text-stone-900 placeholder-stone-400 focus:border-[#0B3D26] focus:outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <label htmlFor="module-filter-select" className="sr-only">
              Filter Modul
            </label>
            <select
              id="module-filter-select"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              aria-label="Filter Modul"
              className="rounded-[4px] border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:border-[#0B3D26] focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Modul</option>
              {uniqueModules.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-[4px] border border-stone-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Modul</th>
                  <th className="px-5 py-3">Fitur / Tindakan</th>
                  <th className="px-5 py-3 text-center">Nasabah</th>
                  <th className="px-5 py-3 text-center">Admin Unit</th>
                  <th className="px-5 py-3 text-center">Platform Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMatrix.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-stone-400">
                      Tidak ada izin fitur yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredMatrix.map((perm, i) => (
                    <tr key={i} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-stone-900">
                        {perm.module}
                      </td>
                      <td className="px-5 py-3.5 text-stone-700">
                        {perm.action}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {perm.nasabah ? (
                          <span className="inline-flex w-5 h-5 rounded-full bg-green-100 text-[#1F6B3F] items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="text-stone-300 font-bold">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {perm.admin_unit ? (
                          <span className="inline-flex w-5 h-5 rounded-full bg-green-100 text-[#1F6B3F] items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="text-stone-300 font-bold">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {perm.platform_ops ? (
                          <span className="inline-flex w-5 h-5 rounded-full bg-amber-100 text-amber-900 items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="text-stone-300 font-bold">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
