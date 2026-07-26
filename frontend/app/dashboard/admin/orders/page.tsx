'use client'

import React, { useEffect, useState } from 'react'
import apiService from '../../../services/api.service'
import { Package, Search, Truck, MapPin, Clock, Calendar, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [petugasList, setPetugasList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  
  // Assign Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [selectedPetugasId, setSelectedPetugasId] = useState('')

  useEffect(() => {
    fetchOrders()
    fetchPetugas()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await apiService.get('/admin/orders?per_page=100')
      if (res.success) {
        setOrders(res.data.data || res.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPetugas = async () => {
    try {
      const res = await apiService.get('/admin/users?per_page=100')
      if (res.success) {
        const users = res.data.data || res.data
        const couriers = users.filter((u: any) => u.role === 'petugas' && u.status === 'active')
        setPetugasList(couriers)
      }
    } catch (error) {
      console.error('Error fetching petugas:', error)
    }
  }

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder || !selectedPetugasId) return
    
    try {
      setActionLoading(selectedOrder.id)
      const res = await apiService.post(`/admin/orders/${selectedOrder.id}/assign`, {
        petugas_id: parseInt(selectedPetugasId)
      })
      
      if (res.success) {
        setSelectedOrder(null)
        setSelectedPetugasId('')
        fetchOrders() // Refresh
      } else {
        alert(res.message || 'Gagal menetapkan kurir')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredOrders = orders.filter(o => {
    return statusFilter === 'all' || o.status === statusFilter
  })

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Penjemputan</h1>
          <p className="text-gray-500">Monitor seluruh transaksi dan tetapkan kurir untuk penjemputan.</p>
        </div>
        
        <div className="flex gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-sm bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Assign (Pending)</option>
            <option value="assigned">Telah di-Assign (Assigned)</option>
            <option value="on_the_way">Menuju Lokasi (On the way)</option>
            <option value="collected">Selesai Diangkut (Collected)</option>
            <option value="completed">Selesai (Completed)</option>
            <option value="cancelled">Batal (Cancelled)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Detail Sampah</th>
                <th className="px-6 py-4">Jadwal Penjemputan</th>
                <th className="px-6 py-4">Status & Kurir</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada pesanan yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{order.customer?.name}</p>
                      <p className="text-gray-500 text-xs mt-1 max-w-[200px] truncate" title={order.address?.full_address}>
                        {order.address?.full_address}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-700 mb-1">
                        {order.waste_type?.name}
                      </span>
                      <p className="text-gray-600 text-xs mt-1">Est. {order.estimated_weight} Kg</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-1">
                        <Calendar size={14} />
                        {order.scheduled_at ? format(new Date(order.scheduled_at), 'dd MMM yyyy', { locale: idLocale }) : '-'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <Clock size={14} />
                        {order.scheduled_at ? format(new Date(order.scheduled_at), 'HH:mm', { locale: idLocale }) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block mb-2 ${
                        order.status === 'pending' ? 'bg-red-100 text-red-700' :
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'cancelled' ? 'bg-gray-200 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {order.petugas ? (
                        <p className="text-xs text-gray-600 font-medium flex items-center gap-1">
                          <Truck size={12} className="text-orange-500" />
                          {order.petugas.name}
                        </p>
                      ) : (
                        <p className="text-xs text-red-500 italic">Belum di-assign</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {['pending', 'assigned'].includes(order.status) && (
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          Assign Kurir
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

      {/* Assign Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Assign Petugas</h2>
              <button 
                onClick={() => {
                  setSelectedOrder(null)
                  setSelectedPetugasId('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                X
              </button>
            </div>
            
            <form onSubmit={handleAssign} className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm mb-4">
                <p className="text-gray-500 mb-1">Pelanggan:</p>
                <p className="font-bold text-gray-900 mb-3">{selectedOrder.customer?.name}</p>
                
                <p className="text-gray-500 mb-1">Alamat Penjemputan:</p>
                <p className="font-medium text-gray-800">{selectedOrder.address?.full_address}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Petugas (Kurir) *</label>
                <select 
                  required
                  value={selectedPetugasId}
                  onChange={(e) => setSelectedPetugasId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="" disabled>-- Pilih Petugas --</option>
                  {petugasList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                  ))}
                </select>
                {petugasList.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">Tidak ada petugas yang aktif. Silakan tambahkan user dengan role Petugas.</p>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrder(null)
                    setSelectedPetugasId('')
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedPetugasId || actionLoading === selectedOrder.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2.5 rounded-xl font-bold transition-colors flex items-center justify-center"
                >
                  {actionLoading === selectedOrder.id ? 'Memproses...' : 'Tugaskan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
