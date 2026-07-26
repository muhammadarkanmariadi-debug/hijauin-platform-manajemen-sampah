'use client'

import React, { useEffect, useState } from 'react'
import apiService from '../../../services/api.service'
import { AlertTriangle, MapPin, Clock, Calendar, CheckCircle2, User, Truck, Image as ImageIcon } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [petugasList, setPetugasList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  
  // Assign Modal State
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [selectedPetugasId, setSelectedPetugasId] = useState('')

  // View Photo Modal State
  const [viewPhoto, setViewPhoto] = useState<string | null>(null)

  useEffect(() => {
    fetchReports()
    fetchPetugas()
  }, [])
  s

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await apiService.get('/admin/reports?per_page=100')
      if (res.success) {
        setReports(res.data.data || res.data)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
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
    if (!selectedReport || !selectedPetugasId) return
    
    try {
      setActionLoading(selectedReport.id)
      const res = await apiService.post(`/admin/reports/${selectedReport.id}/assign`, {
        petugas_id: parseInt(selectedPetugasId)
      })
      
      if (res.success) {
        setSelectedReport(null)
        setSelectedPetugasId('')
        fetchReports() // Refresh
      } else {
        alert(res.message || 'Gagal menetapkan kurir')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredReports = reports.filter(r => {
    return statusFilter === 'all' || r.status === statusFilter
  })

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Sampah Liar</h1>
          <p className="text-gray-500">Monitor pelaporan dari masyarakat dan tugaskan kurir untuk pembersihan.</p>
        </div>
        
        <div className="flex gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-sm bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Review (Pending)</option>
            <option value="assigned">Telah di-Assign (Assigned)</option>
            <option value="in_progress">Sedang Ditangani (In Progress)</option>
            <option value="resolved">Selesai (Resolved)</option>
            <option value="rejected">Ditolak (Rejected)</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
            Tidak ada laporan yang ditemukan.
          </div>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-gray-400 text-xs font-bold">#{report.id}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    report.status === 'rejected' ? 'bg-gray-100 text-gray-700' :
                    report.status === 'pending' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {report.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-2">{report.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{report.description}</p>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="mt-0.5 text-gray-400 shrink-0" />
                    <span className="line-clamp-2">{report.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <User size={16} className="mt-0.5 text-gray-400 shrink-0" />
                    <span>Oleh: {report.reporter?.name || 'Anonim'}</span>
                  </div>
                </div>

                {report.photo_url && (
                  <button 
                    onClick={() => setViewPhoto(report.photo_url)}
                    className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <ImageIcon size={16} /> Lihat Foto Laporan
                  </button>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 mt-auto flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Dibuat: {format(new Date(report.created_at), 'dd MMM yyyy', { locale: idLocale })}</span>
                  {report.assigned_to_user ? (
                    <span className="font-medium text-orange-600 flex items-center gap-1">
                      <Truck size={12} /> {report.assigned_to_user.name}
                    </span>
                  ) : (
                    <span className="text-red-500 italic">Belum di-assign</span>
                  )}
                </div>
                
                {['pending', 'assigned'].includes(report.status) && (
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Assign / Re-assign Petugas
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Assign Petugas Pembersih</h2>
              <button 
                onClick={() => {
                  setSelectedReport(null)
                  setSelectedPetugasId('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                X
              </button>
            </div>
            
            <form onSubmit={handleAssign} className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm mb-4">
                <p className="font-bold text-gray-900 mb-1">{selectedReport.title}</p>
                <p className="text-gray-500 mb-3">{selectedReport.address}</p>
                {selectedReport.assigned_to_user && (
                  <p className="text-orange-600 font-medium">Petugas saat ini: {selectedReport.assigned_to_user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Petugas *</label>
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
                  <p className="text-xs text-red-500 mt-1">Tidak ada petugas yang aktif.</p>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReport(null)
                    setSelectedPetugasId('')
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedPetugasId || actionLoading === selectedReport.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2.5 rounded-xl font-bold transition-colors flex items-center justify-center"
                >
                  {actionLoading === selectedReport.id ? 'Memproses...' : 'Tugaskan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Photo Modal */}
      {viewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75" onClick={() => setViewPhoto(null)}>
          <div className="relative max-w-3xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img src={viewPhoto} alt="Foto Laporan" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
            <button 
              onClick={() => setViewPhoto(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-100"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
