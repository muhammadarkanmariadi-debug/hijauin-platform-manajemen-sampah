'use client'

import React, { useEffect, useState } from 'react'
import apiService from '../../../services/api.service'
import { MapPin, Plus, Star, Trash2, Edit, X } from 'lucide-react'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    label: 'Rumah',
    full_address: '',
    kelurahan: '',
    kecamatan: '',
    city: '',
    province: '',
    postal_code: '',
    notes: '',
    is_default: false
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const res = await apiService.get('/customer/addresses')
      if (res.success) {
        setAddresses(res.data)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const res = await apiService.post('/customer/addresses', formData)
      if (res.success) {
        setShowForm(false)
        setFormData({
          label: 'Rumah',
          full_address: '',
          kelurahan: '',
          kecamatan: '',
          city: '',
          province: '',
          postal_code: '',
          notes: '',
          is_default: false
        })
        fetchAddresses()
      } else {
        alert(res.message || 'Gagal menyimpan alamat')
      }
    } catch (error) {
      alert('Terjadi kesalahan pada sistem')
    } finally {
      setSaving(false)
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      setLoading(true)
      const res = await apiService.post(`/customer/addresses/${id}/set-default`, {})
      if (res.success) {
        fetchAddresses()
      }
    } catch (error) {
      console.error('Error setting default:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return
    
    try {
      setLoading(true)
      const res = await apiService.delete(`/customer/addresses/${id}`)
      if (res.success) {
        fetchAddresses()
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Alamat</h1>
          <p className="text-gray-500">Kelola lokasi penjemputan sampah Anda</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
          >
            <Plus size={20} />
            Tambah Alamat Baru
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Form Alamat Baru</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label Alamat</label>
                <select
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="Rumah">Rumah</option>
                  <option value="Kantor">Kantor</option>
                  <option value="Apartemen">Apartemen</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  placeholder="Contoh: 12345"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
              <textarea
                name="full_address"
                value={formData.full_address}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Nama jalan, gedung, no. rumah..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan / Desa</label>
                <input
                  type="text"
                  name="kelurahan"
                  value={formData.kelurahan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                <input
                  type="text"
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patokan / Catatan (Opsional)</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Contoh: Pagar hitam depan warung"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_default"
                name="is_default"
                checked={formData.is_default}
                onChange={handleInputChange}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
              />
              <label htmlFor="is_default" className="text-sm font-medium text-gray-700 cursor-pointer">
                Jadikan sebagai alamat utama
              </label>
            </div>

            <div className="pt-4 border-t flex justify-end gap-3">
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
                className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors min-w-[120px]"
              >
                {saving ? 'Menyimpan...' : 'Simpan Alamat'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {loading && !showForm ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Belum ada alamat</h3>
          <p className="text-gray-500 mb-6">Anda belum mendaftarkan alamat penjemputan.</p>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="inline-block bg-white border border-green-700 text-green-700 hover:bg-green-50 px-5 py-2.5 rounded-lg transition-colors font-medium"
            >
              Tambah Alamat
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`bg-white rounded-xl shadow-sm border p-5 transition-all ${
                address.is_default ? 'border-green-500 ring-1 ring-green-500 shadow-md' : 'border-gray-100 hover:border-green-200 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${address.is_default ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{address.label}</h3>
                    {address.is_default && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Utama
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-1">
                  {!address.is_default && (
                    <button 
                      onClick={() => handleSetDefault(address.id)}
                      title="Jadikan Utama"
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    >
                      <Star size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(address.id)}
                    title="Hapus"
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="text-gray-600 text-sm space-y-1 ml-11">
                <p className="font-medium text-gray-800">{address.full_address}</p>
                <p>
                  {[address.kelurahan, address.kecamatan].filter(Boolean).join(', ')}
                </p>
                <p>
                  {[address.city, address.province, address.postal_code].filter(Boolean).join(', ')}
                </p>
                {address.notes && (
                  <p className="text-gray-500 italic mt-2 text-xs">Catatan: {address.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
