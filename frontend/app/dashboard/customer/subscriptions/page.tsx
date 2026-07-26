'use client'

import React, { useEffect, useState } from 'react'
import apiService from '../../../services/api.service'
import { CalendarDays, Plus, Play, Pause, XCircle, Clock, MapPin, Package } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const res = await apiService.get('/customer/subscriptions')
      if (res.success) {
        setSubscriptions(res.data.data) // Assuming pagination structure
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: number, action: 'pause' | 'resume' | 'cancel') => {
    let confirmMsg = ''
    if (action === 'pause') confirmMsg = 'Apakah Anda yakin ingin menjeda langganan ini?'
    if (action === 'resume') confirmMsg = 'Lanjutkan langganan?'
    if (action === 'cancel') confirmMsg = 'Apakah Anda yakin ingin membatalkan langganan ini secara permanen?'
    
    if (!confirm(confirmMsg)) return

    try {
      setActionLoading(id)
      const res = await apiService.post(`/customer/subscriptions/${id}/${action}`, {})
      if (res.success) {
        fetchSubscriptions()
      } else {
        alert(res.message || `Gagal melakukan aksi ${action}`)
      }
    } catch (error) {
      alert('Terjadi kesalahan pada sistem')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, any> = {
      active: { color: 'bg-green-100 text-green-800', label: 'Aktif' },
      paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Dijeda' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Dibatalkan' },
    }
    const badge = badges[status] || { color: 'bg-gray-100 text-gray-800', label: status }
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDays = (daysArray: number[]) => {
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    return daysArray.map(d => dayNames[d]).join(', ')
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Berlangganan</h1>
          <p className="text-gray-500">Kelola jadwal penjemputan rutin Anda</p>
        </div>
        <button 
          onClick={() => alert('Fitur buat langganan akan segera hadir!')}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
        >
          <Plus size={20} />
          Buat Langganan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700">
            <CalendarDays size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Belum ada langganan aktif</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Atur penjemputan sampah otomatis secara rutin (mingguan/bulanan) tanpa perlu repot memesan setiap kali.</p>
          <button 
            onClick={() => alert('Fitur buat langganan akan segera hadir!')}
            className="inline-block bg-green-700 text-white hover:bg-green-800 px-6 py-2.5 rounded-lg transition-colors font-medium"
          >
            Mulai Berlangganan
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
              {/* Info Section */}
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                      <CalendarDays size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Paket Rutin {sub.plan_type.replace('_', ' ').toUpperCase()}</h3>
                      <p className="text-sm text-gray-500">Mulai: {format(new Date(sub.start_date), 'dd MMM yyyy', { locale: idLocale })}</p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(sub.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Clock size={16} className="mt-0.5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Jadwal Penjemputan</p>
                        <p>Setiap {formatDays(sub.pickup_days)} jam {sub.preferred_time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Package size={16} className="mt-0.5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Detail Sampah</p>
                        <p>{sub.waste_type?.name} (Est. {sub.estimated_weight_per_pickup}kg / jemput)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="mt-0.5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Alamat Penjemputan</p>
                        <p className="line-clamp-2">{sub.address?.full_address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm pt-2">
                      <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 flex-1">
                        <p className="text-xs text-gray-500">Estimasi Biaya / Bulan</p>
                        <p className="font-bold text-green-700">{formatCurrency(sub.monthly_price)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="bg-gray-50 p-6 md:w-64 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center gap-3">
                {sub.status === 'active' && (
                  <>
                    <button 
                      onClick={() => handleAction(sub.id, 'pause')}
                      disabled={actionLoading === sub.id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors font-medium text-sm"
                    >
                      {actionLoading === sub.id ? 'Memproses...' : <><Pause size={16} /> Jeda Sementara</>}
                    </button>
                    <button 
                      onClick={() => handleAction(sub.id, 'cancel')}
                      disabled={actionLoading === sub.id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
                    >
                      <XCircle size={16} /> Batalkan Langganan
                    </button>
                  </>
                )}

                {sub.status === 'paused' && (
                  <>
                    <button 
                      onClick={() => handleAction(sub.id, 'resume')}
                      disabled={actionLoading === sub.id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors font-medium text-sm"
                    >
                      {actionLoading === sub.id ? 'Memproses...' : <><Play size={16} /> Lanjutkan</>}
                    </button>
                    <button 
                      onClick={() => handleAction(sub.id, 'cancel')}
                      disabled={actionLoading === sub.id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
                    >
                      <XCircle size={16} /> Batalkan Langganan
                    </button>
                  </>
                )}

                {sub.status === 'cancelled' && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Langganan ini sudah tidak aktif</p>
                    <button 
                      onClick={() => alert('Fitur buat ulang langganan akan segera hadir!')}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
                    >
                      Buat Langganan Baru
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
