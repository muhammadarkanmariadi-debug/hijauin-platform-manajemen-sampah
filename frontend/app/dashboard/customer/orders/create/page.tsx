'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import apiService from '../../../../services/api.service'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function CreateOrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  
  const [addresses, setAddresses] = useState<any[]>([])
  const [wasteTypes, setWasteTypes] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    address_id: '',
    waste_type_id: '',
    estimated_weight_kg: '',
    scheduled_time: '',
    payment_method: 'cash',
    customer_notes: ''
  })
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchFormData()
  }, [])

  const fetchFormData = async () => {
    try {
      setInitialLoading(true)
      const [addressRes, wasteRes] = await Promise.all([
        apiService.get('/customer/addresses'),
        apiService.get('/customer/waste-types')
      ])
      
      if (addressRes.success) setAddresses(addressRes.data)
      if (wasteRes.success) setWasteTypes(wasteRes.data)
      
      // Set defaults if available
      if (addressRes.success && addressRes.data.length > 0) {
        const defaultAddr = addressRes.data.find((a: any) => a.is_default) || addressRes.data[0]
        setFormData(prev => ({ ...prev, address_id: defaultAddr.id.toString() }))
      }
      
      if (wasteRes.success && wasteRes.data.length > 0) {
        setFormData(prev => ({ ...prev, waste_type_id: wasteRes.data[0].id.toString() }))
      }
      
      // Set default scheduled time to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      
      // Format to YYYY-MM-DDThh:mm
      const formattedDate = new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
      setFormData(prev => ({ ...prev, scheduled_time: formattedDate }))
      
    } catch (err) {
      console.error('Error fetching form data:', err)
      setError('Gagal memuat data formulir. Silakan coba lagi.')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const payload = {
        ...formData,
        address_id: parseInt(formData.address_id),
        waste_type_id: parseInt(formData.waste_type_id),
        estimated_weight_kg: parseFloat(formData.estimated_weight_kg)
      }
      
      const res = await apiService.post('/customer/orders', payload)
      
      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard/customer/orders')
        }, 2000)
      } else {
        setError(res.message || 'Gagal membuat pesanan')
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan pada sistem')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto mt-10">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-600" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Berhasil Dibuat!</h2>
        <p className="text-gray-600 mb-8">Petugas kami akan segera memproses pesanan Anda. Anda akan dialihkan ke halaman riwayat pesanan.</p>
        <div className="animate-pulse flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/customer/orders" className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 mb-4 font-medium">
          <ArrowLeft size={20} />
          Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Buat Pesanan Jemput Sampah</h1>
        <p className="text-gray-500">Lengkapi formulir di bawah untuk mengatur jadwal penjemputan</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 text-sm">
              {error}
            </div>
          )}

          {/* Section 1: Lokasi */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">1. Lokasi Penjemputan</h3>
            
            {addresses.length === 0 ? (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <p className="text-yellow-800 mb-3 text-sm">Anda belum mendaftarkan alamat satupun.</p>
                <Link href="/dashboard/customer/addresses" className="text-sm font-bold text-green-700 hover:underline">
                  + Tambah Alamat Baru
                </Link>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Alamat</label>
                <select
                  name="address_id"
                  value={formData.address_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                >
                  <option value="" disabled>-- Pilih Alamat --</option>
                  {addresses.map(addr => (
                    <option key={addr.id} value={addr.id}>
                      {addr.label ? `${addr.label} - ` : ''}{addr.full_address}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-right">
                  <Link href="/dashboard/customer/addresses" className="text-xs font-medium text-green-700 hover:underline">
                    Kelola Alamat
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Sampah */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">2. Detail Sampah</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Sampah</label>
                <select
                  name="waste_type_id"
                  value={formData.waste_type_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                >
                  <option value="" disabled>-- Pilih Jenis --</option>
                  {wasteTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} (Rp{type.price_per_kg}/kg)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Berat (Kg)</label>
                <input
                  type="number"
                  name="estimated_weight_kg"
                  value={formData.estimated_weight_kg}
                  onChange={handleInputChange}
                  required
                  min="0.1"
                  step="0.1"
                  placeholder="Contoh: 5.5"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
              <textarea
                name="customer_notes"
                value={formData.customer_notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Contoh: Tolong hubungi nomor saya jika sudah sampai depan gang"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
              ></textarea>
            </div>
          </div>

          {/* Section 3: Waktu & Pembayaran */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">3. Waktu & Pembayaran</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal Penjemputan</label>
                <input
                  type="datetime-local"
                  name="scheduled_time"
                  value={formData.scheduled_time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                >
                  <option value="cash">Tunai (Bayar di tempat)</option>
                  <option value="ewallet">E-Wallet (OVO/GoPay/Dana)</option>
                  <option value="transfer">Transfer Bank</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <button
              type="submit"
              disabled={loading || addresses.length === 0}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-white font-bold text-lg transition-colors ${
                loading || addresses.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Memproses...
                </>
              ) : 'Pesan Penjemputan Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
