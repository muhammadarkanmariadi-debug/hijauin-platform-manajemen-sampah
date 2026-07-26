'use client'

import React, { useEffect, useState } from 'react'
import apiService from '../../services/api.service'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Users, Truck, AlertTriangle, Wallet, Package, LineChart, 
  ChevronRight, Calendar
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const res = await apiService.get('/admin/dashboard')
      if (res.success) {
        setData(res.data)
      }
    } catch (error) {
      console.error('Error fetching admin dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
      </div>
    )
  }

  const stats = data?.statistics || {}
  const recentOrders = data?.recent_orders || []
  const recentReports = data?.recent_reports || []

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Control Center</h1>
          <p className="text-gray-500">Overview sistem Hijauin. Selamat datang kembali, {user?.name}.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <Calendar size={18} className="text-green-600" />
          <span className="font-medium text-gray-700 text-sm">
            {format(new Date(), 'dd MMMM yyyy', { locale: idLocale })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded">Pengguna</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.total_users || 0}</h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            <span className="text-blue-600">{stats.total_customers || 0}</span> Cust • <span className="text-green-600">{stats.total_petugas || 0}</span> Kurir
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Truck size={24} />
            </div>
            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-0.5 rounded">Penjemputan</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.total_orders || 0}</h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            <span className="text-red-500">{stats.pending_orders || 0}</span> Menunggu Assign
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded">Sampah Liar</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.total_reports || 0}</h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            <span className="text-red-500">{stats.pending_reports || 0}</span> Laporan Baru
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <Package size={24} />
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded">Total Sampah</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.total_waste_collected || 0} <span className="text-lg">Kg</span></h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Telah berhasil didaur ulang
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 text-lg">Penjemputan Terbaru</h2>
            <Link href="/dashboard/admin/orders" className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Belum ada data penjemputan.</div>
            ) : (
              recentOrders.map((order: any) => (
                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-bold text-gray-900">{order.customer?.name}</p>
                    <p className="text-xs text-gray-500">{order.waste_type?.name} • Est. {order.estimated_weight} Kg</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md mb-1 inline-block ${
                      order.status === 'pending' ? 'bg-red-100 text-red-700' :
                      order.status === 'assigned' ? 'bg-orange-100 text-orange-700' :
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-500">
                      {order.petugas ? `Kurir: ${order.petugas.name}` : 'Belum di-assign'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 text-lg">Laporan Sampah Liar</h2>
            <Link href="/dashboard/admin/reports" className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentReports.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Belum ada data laporan.</div>
            ) : (
              recentReports.map((report: any) => (
                <div key={report.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="pr-4">
                    <p className="font-bold text-gray-900 line-clamp-1">{report.title}</p>
                    <p className="text-xs text-gray-500">Oleh: {report.reporter?.name || 'Anonim'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      report.status === 'pending' ? 'bg-red-100 text-red-700' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {report.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
