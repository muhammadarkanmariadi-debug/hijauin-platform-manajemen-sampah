'use client'

import React, { useEffect, useState } from 'react'
import apiService from '../../services/api.service'
import { useAuth } from '../../contexts/AuthContext'
import { Truck, CheckCircle2, AlertTriangle, Scale, Calendar, MapPin, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import Link from 'next/link'

export default function PetugasDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const res = await apiService.get('/petugas/dashboard')
      if (res.success) {
        setData(res.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
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
  const schedule = data?.today_schedule || []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Halo, {user?.name}! 👋</h1>
        <p className="text-gray-500">Berikut adalah ringkasan tugas Anda hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Menunggu Dijemput</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.pending_tasks || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Truck size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Selesai Hari Ini</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.completed_today || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Berat (Kg)</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.total_weight_collected || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Scale size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Laporan Sampah Liar</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.assigned_reports || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <Calendar className="text-green-600" size={20} />
              Jadwal Penjemputan Hari Ini
            </h2>
            <p className="text-gray-500 text-sm mt-1">{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: idLocale })}</p>
          </div>
          <Link href="/dashboard/petugas/tasks" className="text-sm font-semibold text-green-600 hover:text-green-700">
            Lihat Semua Tugas
          </Link>
        </div>

        {schedule.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Semua tugas selesai!</h3>
            <p className="text-gray-500">Anda tidak memiliki jadwal penjemputan tersisa untuk hari ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {schedule.map((task: any) => (
              <div key={task.id} className="p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-md">
                      #{task.id}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                      task.status === 'on_the_way' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {task.status === 'on_the_way' ? 'Menuju Lokasi' : 'Menunggu'}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-lg">{task.customer?.name}</h3>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Clock size={16} className="mt-0.5 text-gray-400 shrink-0" />
                      <span>{format(new Date(task.scheduled_at), 'HH:mm', { locale: idLocale })} WIB</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="mt-0.5 text-gray-400 shrink-0" />
                      <span className="line-clamp-2">{task.address?.full_address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
                    <p className="text-xs text-green-800 mb-1">Estimasi Sampah</p>
                    <p className="font-bold text-green-700">{task.waste_type?.name}</p>
                    <p className="text-sm font-medium text-green-600">{task.estimated_weight} Kg</p>
                  </div>
                  <Link 
                    href={`/dashboard/petugas/tasks/${task.id}`}
                    className="w-full bg-gray-900 text-white hover:bg-black text-center py-2.5 rounded-lg font-medium text-sm transition-colors"
                  >
                    Buka Detail Tugas
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
