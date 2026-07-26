'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Clock, MapPin, Search, Package } from 'lucide-react'
import apiService from '../../../services/api.service'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const query = filter !== 'all' ? `?status=${filter}` : ''
      const res = await apiService.get(`/customer/orders${query}`)
      if (res.success) {
        setOrders(res.data.data) // Laravel pagination
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      on_the_way: 'bg-purple-100 text-purple-800',
      collected: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Pesanan</h1>
          <p className="text-gray-500">Pantau status penjemputan sampah Anda</p>
        </div>
        <Link 
          href="/dashboard/customer/orders/create"
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
        >
          <Plus size={20} />
          Buat Pesanan
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-2">
        {['all', 'pending', 'assigned', 'on_the_way', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === status 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
            }`}
          >
            {status === 'all' ? 'Semua Status' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Belum ada pesanan</h3>
          <p className="text-gray-500 mb-6">Anda belum pernah membuat pesanan dengan status ini.</p>
          <Link 
            href="/dashboard/customer/orders/create"
            className="inline-block bg-white border border-green-700 text-green-700 hover:bg-green-50 px-5 py-2.5 rounded-lg transition-colors font-medium"
          >
            Mulai Pesan Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/dashboard/customer/orders/${order.id}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-800">
                        {order.order_number || `ORD-${order.id.toString().padStart(5, '0')}`}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Clock size={14} />
                      {format(new Date(order.scheduled_time), 'dd MMMM yyyy • HH:mm', { locale: idLocale })}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-lg font-bold text-green-700">{formatCurrency(order.price || 0)}</p>
                    <p className="text-sm text-green-600 font-medium">+{order.points_awarded || 0} Poin Hijau</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Package size={16} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">{order.waste_type?.name || 'Tipe Sampah'}</p>
                      <p>Est. {order.estimated_weight_kg} kg</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="mt-0.5 text-gray-400 flex-shrink-0" />
                    <p className="line-clamp-2">
                      {order.address?.full_address || 'Alamat tidak ditemukan'}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
