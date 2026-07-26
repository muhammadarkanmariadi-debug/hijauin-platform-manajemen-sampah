'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, MapPin, Package, AlertCircle, CheckCircle2, User, Phone, FileText, Award } from 'lucide-react'
import apiService from '../../../../services/api.service'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchOrderDetail()
  }, [params.id])

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      const res = await apiService.get(`/customer/orders/${params.id}`)
      if (res.success) {
        setOrder(res.data)
      } else {
        router.push('/dashboard/customer/orders')
      }
    } catch (error) {
      console.error('Error fetching order detail:', error)
      router.push('/dashboard/customer/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return
    
    try {
      setCancelling(true)
      const res = await apiService.put(`/customer/orders/${params.id}/cancel`, {})
      if (res.success) {
        fetchOrderDetail()
      } else {
        alert(res.message || 'Gagal membatalkan pesanan')
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('Terjadi kesalahan sistem')
    } finally {
      setCancelling(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, any> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={16} /> },
      assigned: { color: 'bg-blue-100 text-blue-800', icon: <User size={16} /> },
      on_the_way: { color: 'bg-purple-100 text-purple-800', icon: <Package size={16} /> },
      collected: { color: 'bg-indigo-100 text-indigo-800', icon: <CheckCircle2 size={16} /> },
      completed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 size={16} /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <AlertCircle size={16} /> },
      failed: { color: 'bg-red-100 text-red-800', icon: <AlertCircle size={16} /> },
    }
    const badge = badges[status] || { color: 'bg-gray-100 text-gray-800', icon: <Clock size={16} /> }
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm ${badge.color}`}>
        {badge.icon}
        {status.replace('_', ' ').toUpperCase()}
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!order) return null

  const orderNumber = order.order_number || `ORD-${order.id.toString().padStart(5, '0')}`

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/customer/orders" className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 mb-4 font-medium">
            <ArrowLeft size={20} />
            Kembali ke Daftar Pesanan
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">{orderNumber}</h1>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-gray-500 mt-1 flex items-center gap-1.5">
            <Clock size={16} />
            Dibuat pada {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
          </p>
        </div>
        
        {/* Actions based on status */}
        <div className="flex gap-2">
          {['pending', 'assigned'].includes(order.status) && (
            <button 
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              {cancelling ? 'Membatalkan...' : 'Batalkan Pesanan'}
            </button>
          )}
          {order.status === 'completed' && !order.review && (
            <button className="px-4 py-2 bg-green-700 text-white hover:bg-green-800 rounded-lg font-medium transition-colors">
              Beri Ulasan
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Petugas Info (If Assigned) */}
          {order.assigned_petugas && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xl">
                {order.assigned_petugas.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Petugas Penjemput</p>
                <h3 className="font-bold text-gray-800 text-lg">{order.assigned_petugas.name}</h3>
                <p className="text-gray-600 flex items-center gap-1.5 text-sm mt-1">
                  <Phone size={14} />
                  {order.assigned_petugas.phone || '-'}
                </p>
              </div>
            </div>
          )}

          {/* Waste & Schedule Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-800">Detail Penjemputan</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Jenis Sampah</p>
                  <p className="font-bold text-gray-800">{order.waste_type?.name}</p>
                  <p className="text-sm text-gray-600 mt-1">Estimasi Berat: {order.estimated_weight_kg} kg</p>
                  {order.actual_weight && (
                    <p className="text-sm font-medium text-green-700 mt-1 bg-green-50 inline-block px-2 py-1 rounded">
                      Berat Aktual: {order.actual_weight} kg
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Jadwal Penjemputan</p>
                  <p className="font-bold text-gray-800">
                    {format(new Date(order.scheduled_time), 'EEEE, dd MMMM yyyy', { locale: idLocale })}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {format(new Date(order.scheduled_time), 'HH:mm', { locale: idLocale })} WIB
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Alamat Penjemputan</p>
                  <p className="font-bold text-gray-800">{order.address?.label || 'Alamat'}</p>
                  <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                    {order.address?.full_address}
                  </p>
                </div>
              </div>

              {order.customer_notes && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Catatan Tambahan</p>
                    <p className="text-gray-800 text-sm">{order.customer_notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-800">Rincian Pembayaran</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Metode Pembayaran</span>
                  <span className="font-medium text-gray-800 capitalize">
                    {order.payment_method === 'cash' ? 'Tunai (Bayar di tempat)' : order.payment_method}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Harga per kg</span>
                  <span className="font-medium text-gray-800">{formatCurrency(order.waste_type?.price_per_kg || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Berat</span>
                  <span className="font-medium text-gray-800">{order.actual_weight || order.estimated_weight_kg} kg</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total Biaya</span>
                  <span className="text-xl font-bold text-green-700">{formatCurrency(order.price || 0)}</span>
                </div>
                {['pending', 'assigned', 'on_the_way'].includes(order.status) && (
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    *Harga final akan disesuaikan dengan berat aktual
                  </p>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between border border-green-100">
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-green-600" />
                  <span className="text-sm font-bold text-green-800">Poin Hijau</span>
                </div>
                <span className="font-bold text-green-700">+{order.points_awarded || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


