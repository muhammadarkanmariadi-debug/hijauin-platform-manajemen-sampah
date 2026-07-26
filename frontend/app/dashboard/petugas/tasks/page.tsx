'use client'

import React, { useEffect, useState } from 'react'
import apiService from '../../../services/api.service'
import { MapPin, Clock, Truck, CheckCircle2, ChevronRight, Package, User } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import Link from 'next/link'

export default function PetugasTasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'active' | 'assigned' | 'on_the_way' | 'completed'>('active')

  useEffect(() => {
    fetchTasks()
  }, [statusFilter])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      
      let url = '/petugas/tasks'
      if (statusFilter !== 'active') {
        url += `?status=${statusFilter}`
      }

      // If completed is selected, we might want to use history endpoint instead
      if (statusFilter === 'completed') {
        url = '/petugas/history'
      }

      const res = await apiService.get(url)
      if (res.success) {
        setTasks(res.data.data) // Assuming pagination
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'assigned':
        return <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-md">Menunggu</span>
      case 'on_the_way':
        return <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">Menuju Lokasi</span>
      case 'collected':
        return <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-md">Diangkut</span>
      case 'completed':
        return <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md">Selesai</span>
      case 'cancelled':
      case 'failed':
        return <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-md">Gagal/Batal</span>
      default:
        return <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-md">{status}</span>
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Penjemputan</h1>
        <p className="text-gray-500">Kelola tugas penjemputan sampah Anda.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
        {[
          { id: 'active', label: 'Tugas Aktif' },
          { id: 'assigned', label: 'Baru Masuk' },
          { id: 'on_the_way', label: 'Sedang Jalan' },
          { id: 'completed', label: 'Riwayat Selesai' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`whitespace-nowrap pb-4 px-6 font-medium text-sm transition-colors border-b-2 ${
              statusFilter === tab.id 
                ? 'border-green-600 text-green-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Package size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Tidak ada tugas</h3>
          <p className="text-gray-500">Belum ada tugas penjemputan di kategori ini.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tasks.map(task => (
            <Link 
              href={`/dashboard/petugas/tasks/${task.id}`}
              key={task.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-green-400 hover:shadow-md transition-all group flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-gray-400 text-xs font-bold block mb-1">ORDER #{task.id}</span>
                  {getStatusBadge(task.status)}
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                  <Truck size={20} />
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                {task.customer?.name}
              </h3>
              
              <div className="space-y-2 mt-4 grow">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Clock size={16} className="mt-0.5 text-gray-400 shrink-0" />
                  <span>
                    {task.scheduled_at 
                      ? format(new Date(task.scheduled_at), 'dd MMM yyyy, HH:mm', { locale: idLocale })
                      : format(new Date(task.completed_at), 'dd MMM yyyy, HH:mm', { locale: idLocale })
                    } WIB
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="mt-0.5 text-gray-400 shrink-0" />
                  <span className="line-clamp-2">{task.address?.full_address || '-'}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Package size={16} className="mt-0.5 text-gray-400 shrink-0" />
                  <span>{task.waste_type?.name} (Est. {task.estimated_weight} kg)</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-sm font-semibold text-green-600">
                Lihat Detail
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
