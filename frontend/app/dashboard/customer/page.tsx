'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Link from 'next/link'
import { Package, Award, MapPin, Clock } from 'lucide-react'
import apiService from '../../services/api.service'

export default function CustomerDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    hijauPoints: 0,
  })

  useEffect(() => {
    // In a real app, this might be a single /dashboard/stats endpoint
    // We'll fetch active orders and points to show basic stats
    const fetchDashboardData = async () => {
      try {
        const res = await apiService.get('/customer/orders?status=pending')
        if (res.success) {
          setStats(prev => ({ ...prev, activeOrders: res.data.total || res.data.data?.length || 0 }))
        }
        
        // Use user object for points if available
        if (user && user.hijau_points) {
          setStats(prev => ({ ...prev, hijauPoints: user.hijau_points || 0 }))
        }
      } catch (e) {
        console.error('Failed to fetch stats', e)
      }
    }

    fetchDashboardData()
  }, [user])

  if (!user) return null

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Selamat datang, {user.name}!</h1>
        <p className="text-gray-500 mt-1">Kelola sampah Anda dan kumpulkan Poin Hijau.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Pesanan Aktif</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.activeOrders}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Pesanan</p>
            <h3 className="text-2xl font-bold text-gray-800">Lihat Riwayat</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Poin Hijau</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.hijauPoints}</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/customer/orders/create" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center group">
          <div className="w-12 h-12 mx-auto rounded-full bg-green-50 text-green-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Package size={24} />
          </div>
          <h3 className="font-bold text-gray-800">Buat Pesanan</h3>
          <p className="text-xs text-gray-500 mt-1">Jemput sampah sekarang</p>
        </Link>
        
        <Link href="/dashboard/customer/addresses" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center group">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <MapPin size={24} />
          </div>
          <h3 className="font-bold text-gray-800">Kelola Alamat</h3>
          <p className="text-xs text-gray-500 mt-1">Atur lokasi penjemputan</p>
        </Link>
      </div>
    </div>
  )
}
