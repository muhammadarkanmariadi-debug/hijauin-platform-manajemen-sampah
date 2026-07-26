'use client'

import React, { useEffect, useState, useRef, use } from 'react'
import apiService from '../../../../services/api.service'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, MapPin, Clock, Truck, CheckCircle2, User, Phone, 
  Upload, Camera, AlertTriangle, Package
} from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import Link from 'next/link'

export default function PetugasTaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const router = useRouter()
  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  
  // For Collection phase
  const [actualWeight, setActualWeight] = useState('')
  const [notes, setNotes] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  useEffect(() => {
    fetchTaskDetail()
  }, [])

  const fetchTaskDetail = async () => {
    try {
      setLoading(true)
      const res = await apiService.get(`/petugas/tasks/${unwrappedParams.id}`)
      if (res.success) {
        setTask(res.data)
      } else {
        router.push('/dashboard/petugas/tasks')
      }
    } catch (error) {
      console.error('Error fetching task detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!confirm('Anda yakin ingin menerima tugas ini dan mulai menuju lokasi?')) return
    
    try {
      setActionLoading(true)
      const res = await apiService.post(`/petugas/tasks/${task.id}/accept`, {})
      if (res.success) {
        setTask(res.data)
      } else {
        alert(res.message || 'Gagal menerima tugas')
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
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCollect = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photoPreview) {
      alert('Mohon unggah foto bukti pengambilan sampah')
      return
    }

    if (!actualWeight || isNaN(Number(actualWeight)) || Number(actualWeight) <= 0) {
      alert('Mohon masukkan berat aktual yang valid')
      return
    }

    try {
      setActionLoading(true)
      
      // Menggunakan base64 langsung karena backend meminta string base64 untuk 'photo'
      const payload = {
        actual_weight: actualWeight,
        notes: notes,
        photo: photoPreview
      }
      
      const res = await apiService.post(`/petugas/tasks/${task.id}/collect`, payload)
      if (res.success) {
        setTask(res.data)
      } else {
        alert(res.message || 'Gagal menyimpan data pengangkutan')
      }
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan saat mengunggah data')
    } finally {
      setActionLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!confirm('Pastikan transaksi dengan pelanggan sudah selesai. Lanjutkan?')) return
    
    try {
      setActionLoading(true)
      const res = await apiService.post(`/petugas/tasks/${task.id}/complete`, {})
      if (res.success) {
        setTask(res.data)
      } else {
        alert(res.message || 'Gagal menyelesaikan tugas')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!task) return null

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/petugas/tasks" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">Detail Tugas #{task.id}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              task.status === 'completed' ? 'bg-green-100 text-green-700' :
              task.status === 'collected' ? 'bg-purple-100 text-purple-700' :
              task.status === 'on_the_way' ? 'bg-blue-100 text-blue-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {task.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Dibuat pada {format(new Date(task.created_at), 'dd MMM yyyy, HH:mm', { locale: idLocale })}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Kolom Kiri: Informasi */}
        <div className="md:col-span-2 space-y-6">
          {/* Info Pelanggan & Lokasi */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-green-600" /> Informasi Pelanggan
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nama Pelanggan</p>
                <p className="font-medium text-gray-900">{task.customer?.name}</p>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nomor Telepon</p>
                  <p className="font-medium text-gray-900">{task.customer?.phone || '-'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Alamat Penjemputan</p>
                  <p className="font-medium text-gray-900">{task.address?.full_address}</p>
                  {task.address?.notes && (
                    <p className="text-sm text-gray-500 mt-1 italic">Catatan: {task.address.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info Sampah */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-green-600" /> Detail Sampah
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Jenis Sampah</p>
                <p className="font-bold text-gray-900">{task.waste_type?.name}</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <p className="text-sm text-orange-600 mb-1">Estimasi Berat</p>
                <p className="font-bold text-orange-700 text-lg">{task.estimated_weight} Kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Aksi Operasional */}
        <div className="space-y-6">
          {/* Status Tracker */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-lg text-gray-800 mb-6">Status Operasional</h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              
              {/* Step 1: Menunggu */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shrink-0 shadow-sm z-10 ${
                  task.status !== 'assigned' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <CheckCircle2 size={16} />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] px-4">
                  <h4 className="font-bold text-gray-800">Menunggu</h4>
                </div>
              </div>

              {/* Step 2: Menuju Lokasi */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shrink-0 shadow-sm z-10 ${
                  ['collected', 'completed'].includes(task.status) ? 'bg-green-500 text-white' : 
                  task.status === 'on_the_way' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Truck size={14} />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] px-4">
                  <h4 className="font-bold text-gray-800">Menuju Lokasi</h4>
                </div>
              </div>

              {/* Step 3: Diangkut */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shrink-0 shadow-sm z-10 ${
                  task.status === 'completed' ? 'bg-green-500 text-white' : 
                  task.status === 'collected' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Package size={14} />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] px-4">
                  <h4 className="font-bold text-gray-800">Diangkut</h4>
                </div>
              </div>
            </div>

            {/* Aksi Berdasarkan Status */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              {task.status === 'assigned' && (
                <button
                  onClick={handleAccept}
                  disabled={actionLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading ? 'Memproses...' : <><Truck size={20} /> Mulai Jalan ke Lokasi</>}
                </button>
              )}

              {task.status === 'on_the_way' && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm mb-4">
                    Anda sedang menuju lokasi. Silakan isi form di bawah saat sampah diangkut.
                  </div>
                  <form onSubmit={handleCollect} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Berat Aktual (Kg) *</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        required
                        value={actualWeight}
                        onChange={(e) => setActualWeight(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        placeholder="Contoh: 2.5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                      <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        rows={2}
                        placeholder="Opsional..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Foto Bukti Pengangkutan *</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors relative"
                      >
                        {photoPreview ? (
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <img src={photoPreview} alt="Preview" className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white">
                              Ganti Foto
                            </div>
                          </div>
                        ) : (
                          <div className="py-4">
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

                    <button
                      type="submit"
                      disabled={actionLoading || !photoPreview || !actualWeight}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      {actionLoading ? 'Memproses...' : <><Package size={20} /> Konfirmasi Angkut</>}
                    </button>
                  </form>
                </div>
              )}

              {task.status === 'collected' && (
                <div className="space-y-4">
                  <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-100 mb-4">
                    <p className="font-bold mb-1">Total Biaya: Rp {task.actual_price}</p>
                    <p className="text-sm">Poin didapat: {task.actual_points} PTS</p>
                  </div>
                  
                  <button
                    onClick={handleComplete}
                    disabled={actionLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    {actionLoading ? 'Memproses...' : <><CheckCircle2 size={20} /> Selesaikan Transaksi</>}
                  </button>
                </div>
              )}

              {task.status === 'completed' && (
                <div className="bg-green-50 text-green-800 p-4 rounded-xl text-center font-medium flex flex-col items-center gap-2">
                  <CheckCircle2 size={32} className="text-green-600" />
                  Tugas telah selesai dengan baik!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
