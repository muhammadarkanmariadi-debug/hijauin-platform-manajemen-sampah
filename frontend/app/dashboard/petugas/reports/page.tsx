'use client'

import React, { useEffect, useState, useRef } from 'react'
import apiService from '../../../services/api.service'
import { MapPin, Clock, Camera, CheckCircle2, AlertTriangle, User, Image as ImageIcon } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export default function PetugasReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'active' | 'resolved'>('active')
  const [actionLoading, setActionLoading] = useState(false)
  
  // Modal State for Resolving
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchReports()
  }, [statusFilter])

  const fetchReports = async () => {
    try {
      setLoading(true)
      let url = '/petugas/reports'
      if (statusFilter === 'resolved') {
        url += '?status=resolved'
      } // default is active (assigned + in_progress)

      const res = await apiService.get(url)
      if (res.success) {
        setReports(res.data.data)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (id: number) => {
    if (!confirm('Terima laporan ini dan mulai menuju lokasi?')) return
    try {
      setActionLoading(true)
      const res = await apiService.post(`/petugas/reports/${id}/accept`, {})
      if (res.success) {
        fetchReports()
      } else {
        alert(res.message || 'Gagal menerima laporan')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setActionLoading(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReport) return
    if (!photoPreview) {
      alert('Mohon unggah foto bukti penyelesaian')
      return
    }

    try {
      setActionLoading(true)
      const payload = {
        resolution_notes: resolutionNotes,
        resolution_photo: photoPreview
      }
      
      const res = await apiService.post(`/petugas/reports/${selectedReport.id}/resolve`, payload)
      if (res.success) {
        // Reset modal
        setSelectedReport(null)
        setPhotoPreview(null)
        setResolutionNotes('')
        // Refresh list
        fetchReports()
      } else {
        alert(res.message || 'Gagal menyelesaikan laporan')
      }
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan')
    } finally {
      setActionLoading(false)
    }
  }

  const openResolveModal = (report: any) => {
    setSelectedReport(report)
    setPhotoPreview(null)
    setResolutionNotes('')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tugas Laporan Sampah Liar</h1>
        <p className="text-gray-500">Kelola dan selesaikan laporan tumpukan sampah liar yang ditugaskan ke Anda.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setStatusFilter('active')}
          className={`pb-4 px-6 font-medium text-sm transition-colors border-b-2 ${
            statusFilter === 'active' 
              ? 'border-red-600 text-red-700' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Tugas Aktif
        </button>
        <button
          onClick={() => setStatusFilter('resolved')}
          className={`pb-4 px-6 font-medium text-sm transition-colors border-b-2 ${
            statusFilter === 'resolved' 
              ? 'border-green-600 text-green-700' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Riwayat Selesai
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-600 border-t-transparent"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Bersih!</h3>
          <p className="text-gray-500">Tidak ada tugas laporan sampah liar di kategori ini.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {reports.map(report => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-gray-400 text-xs font-bold">LAPORAN #{report.id}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    report.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
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
                    <span>{report.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Clock size={16} className="mt-0.5 text-gray-400 shrink-0" />
                    <span>Dibuat: {format(new Date(report.created_at), 'dd MMM yyyy', { locale: idLocale })}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-5 bg-gray-50 mt-auto flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User size={16} />
                  <span>Pelapor: {report.reporter?.name || 'Anonim'}</span>
                </div>
                
                <div>
                  {report.status === 'assigned' && (
                    <button 
                      onClick={() => handleAccept(report.id)}
                      disabled={actionLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      Terima Laporan
                    </button>
                  )}
                  {report.status === 'in_progress' && (
                    <button 
                      onClick={() => openResolveModal(report)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      Selesaikan
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolve Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Selesaikan Laporan #{selectedReport.id}</h2>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                Tutup
              </button>
            </div>
            
            <form onSubmit={handleResolve} className="p-6 space-y-4">
              <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-2">
                Unggah foto bukti bahwa area tersebut sudah dibersihkan.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Bukti Pembersihan *</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {photoPreview ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <img src={photoPreview} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="py-6">
                      <Camera size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Klik untuk ambil foto/upload</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Penyelesaian</label>
                <textarea 
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  rows={3}
                  placeholder="Opsional: Tumpukan sampah telah dibersihkan dan diangkut ke TPA."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !photoPreview}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading ? 'Memproses...' : <><CheckCircle2 size={18} /> Selesai</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
