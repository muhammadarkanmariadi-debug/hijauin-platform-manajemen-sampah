'use client'

import React, { useEffect, useState } from 'react'
import apiService from '../../../services/api.service'
import { Users, Search, Edit2, Check, X, Shield, ShieldAlert, User, Truck } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await apiService.get('/admin/users?per_page=100')
      if (res.success) {
        setUsers(res.data.data || res.data) // handle pagination vs all
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (id: number, currentStatus: string) => {
    if (!confirm(`Anda yakin ingin mengubah status pengguna ini?`)) return
    
    try {
      setActionLoading(id)
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const res = await apiService.put(`/admin/users/${id}/status`, { status: newStatus })
      
      if (res.success) {
        // Update local state
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u))
      } else {
        alert(res.message || 'Gagal mengubah status')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       u.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchRole && matchSearch
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield size={16} className="text-red-600" />
      case 'petugas': return <Truck size={16} className="text-orange-600" />
      case 'partner': return <ShieldAlert size={16} className="text-purple-600" />
      default: return <User size={16} className="text-blue-600" />
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
          <p className="text-gray-500">Kelola akses dan status seluruh pengguna platform.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama/email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-sm"
            />
          </div>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-sm bg-white"
          >
            <option value="all">Semua Role</option>
            <option value="customer">Customer</option>
            <option value="petugas">Petugas (Kurir)</option>
            <option value="admin">Admin</option>
            <option value="partner">Partner</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Poin & Saldo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Bergabung</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada pengguna yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-gray-500 text-xs">{u.email}</p>
                          {u.phone && <p className="text-gray-400 text-xs">{u.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 capitalize font-medium text-gray-700">
                        {getRoleIcon(u.role)}
                        {u.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.role === 'customer' ? (
                        <div>
                          <p className="font-bold text-green-600">{u.hijau_points || 0} PTS</p>
                          <p className="text-xs text-gray-500">Saldo: Rp {u.wallet_balance || 0}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.status === 'active' ? 'Aktif' : 'Suspend'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {format(new Date(u.created_at), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => toggleUserStatus(u.id, u.status)}
                          disabled={actionLoading === u.id}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                            u.status === 'active' 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                          title={u.status === 'active' ? 'Suspend User' : 'Activate User'}
                        >
                          {actionLoading === u.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : u.status === 'active' ? (
                            <X size={16} />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
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
  )
}
