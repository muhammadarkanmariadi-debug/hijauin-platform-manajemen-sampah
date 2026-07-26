'use client'

import React, { useEffect, useState, useRef } from 'react'
import apiService from '../../../services/api.service'
import { AlertTriangle, Plus, X, Upload, MapPin, Clock, CheckCircle2, User } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_address: '',
    kelurahan: '',
    kecamatan: '',
    city: '',
    priority: 'medium'
  })

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await apiService.get('/customer/reports')
      if (res.success) {
        setReports(res.data.data) // Pagination
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert('Harap unggah foto sampah liar')
      return
    }

    setSaving(true)
    
    try {
      const formPayload = new FormData()
      formPayload.append('title', formData.title)
      formPayload.append('description', formData.description)
      formPayload.append('location_address', formData.location_address)
      formPayload.append('kelurahan', formData.kelurahan)
      formPayload.append('kecamatan', formData.kecamatan)
      formPayload.append('city', formData.city)
      formPayload.append('priority', formData.priority)
      formPayload.append('photo', selectedFile)

      const res = await apiService.post('/customer/reports', formPayload)
      
      if (res.success) {
        setShowForm(false)
        setFormData({
          title: '',
          description: '',
          location_address: '',
          kelurahan: '',
          kecamatan: '',
          city: '',
          priority: 'medium'
        })
        setSelectedFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        fetchReports()
        alert('Laporan berhasil dikirim!')
      } else {
        alert(res.message || 'Gagal mengirim laporan')
      }
    } catch (error) {
      alert('Terjadi kesalahan pada sistem')
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, any> = {
      open: { color: 'bg-red-100 text-red-800', label: 'Terbuka' },
      assigned: { color: 'bg-blue-100 text-blue-800', label: 'Diproses' },
      resolved: { color: 'bg-green-100 text-green-800', label: 'Selesai' },
      closed: { color: 'bg-gray-100 text-gray-800', label: 'Ditutup' },
    }
    const badge = badges[status] || { color: 'bg-gray-100 text-gray-800', label: status }
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lapor Sampah Liar</h1>
          <p className="text-gray-500">Bantu kami menjaga kebersihan lingkungan sekitar</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
          >
            <Plus size={20} />
            Buat Laporan Baru
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 animate-in fade-in slide-in-from-top-4 duration-300 border-t-4 border-t-red-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Form Laporan Baru</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto Kejadian *</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="relative w-full max-w-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <span className="text-white font-medium flex items-center gap-2">
                        <Upload size={16} /> Ubah Foto
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Klik untuk unggah foto</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, image/jpg"
                  className="hidden" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Laporan *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Contoh: Tumpukan sampah di pinggir jalan"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Prioritas</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  <option value="low">Rendah</option>
                  <option value="medium">Menengah</option>
                  <option value="high">Tinggi (Menutupi jalan/Berbau menyengat)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Detail *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Jelaskan kondisi secara spesifik..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              ></textarea>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium text-gray-800">Detail Lokasi</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap Kejadian *</label>
                <textarea
                  name="location_address"
                  value={formData.location_address}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  placeholder="Nama jalan, patokan..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan</label>
                  <input
                    type="text"
                    name="kelurahan"
                    value={formData.kelurahan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                  <input
                    type="text"
                    name="kecamatan"
                    value={formData.kecamatan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kota *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors min-w-[150px] flex justify-center items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Mengirim...
                  </>
                ) : 'Kirim Laporan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reports List */}
      {loading && !showForm ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-600 border-t-transparent"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Belum ada laporan</h3>
          <p className="text-gray-500 mb-6">Anda belum pernah melaporkan sampah liar.</p>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="inline-block bg-white border border-red-600 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-lg transition-colors font-medium"
            >
              Buat Laporan Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              {report.photo_url ? (
                <div className="h-40 bg-gray-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={report.photo_url.startsWith('http') ? report.photo_url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${report.photo_url}`} 
                    alt={report.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f3f4f6/a1a1aa?text=Image+Not+Found'
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(report.status)}
                  </div>
                </div>
              ) : (
                <div className="h-40 bg-gray-100 flex flex-col items-center justify-center text-gray-400 relative">
                  <AlertTriangle size={32} className="mb-2" />
                  <span className="text-sm">Tidak ada foto</span>
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(report.status)}
                  </div>
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">{report.title}</h3>
                
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <Clock size={14} />
                  <span>{format(new Date(report.created_at), 'dd MMM yyyy', { locale: idLocale })}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                  {report.description}
                </p>
                
                <div className="pt-3 border-t border-gray-100 mt-auto">
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{report.location_address}, {report.city}</span>
                  </div>
                  
                  {report.assigned_to && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 mt-2 font-medium">
                      <User size={14} />
                      <span>Dikerjakan oleh: {report.assignedTo?.name || 'Petugas'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
