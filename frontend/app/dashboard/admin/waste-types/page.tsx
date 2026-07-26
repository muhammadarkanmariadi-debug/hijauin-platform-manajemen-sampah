'use client'

import React, { useEffect, useState } from 'react'
import apiService from '../../../services/api.service'
import { Package, Plus, Edit2, Trash2, CheckCircle2, X } from 'lucide-react'

export default function AdminWasteTypesPage() {
  const [wasteTypes, setWasteTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    unit: 'kg',
    price_per_unit: '',
    points_per_unit: ''
  })

  useEffect(() => {
    fetchWasteTypes()
  }, [])

  const fetchWasteTypes = async () => {
    try {
      setLoading(true)
      const res = await apiService.get('/admin/waste-types')
      if (res.success) {
        setWasteTypes(res.data)
      }
    } catch (error) {
      console.error('Error fetching waste types:', error)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setIsEditing(false)
    setFormData({ id: '', name: '', description: '', unit: 'kg', price_per_unit: '', points_per_unit: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setIsEditing(true)
    setFormData({
      id: item.id,
      name: item.name,
      description: item.description || '',
      unit: item.unit,
      price_per_unit: item.price_per_unit,
      points_per_unit: item.points_per_unit
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Yakin ingin menghapus jenis sampah "${name}"? Data ini mungkin terkait dengan transaksi lama.`)) return
    
    try {
      setActionLoading(true)
      const res = await apiService.delete(`/admin/waste-types/${id}`)
      if (res.success) {
        fetchWasteTypes()
      } else {
        alert(res.message || 'Gagal menghapus data')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setActionLoading(true)
      
      const payload = {
        name: formData.name,
        description: formData.description,
        unit: formData.unit,
        price_per_unit: parseFloat(formData.price_per_unit),
        points_per_unit: parseFloat(formData.points_per_unit)
      }
      
      let res;
      if (isEditing) {
        res = await apiService.put(`/admin/waste-types/${formData.id}`, payload)
      } else {
        res = await apiService.post('/admin/waste-types', payload)
      }
      
      if (res.success) {
        setIsModalOpen(false)
        fetchWasteTypes()
      } else {
        alert(res.message || 'Gagal menyimpan data')
      }
    } catch (error) {
      alert('Terjadi kesalahan form')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Master Data: Jenis Sampah</h1>
          <p className="text-gray-500">Kelola kategori sampah, harga, dan konversi Poin Hijau.</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Kategori Sampah</th>
                <th className="px-6 py-4">Harga per Unit</th>
                <th className="px-6 py-4">Poin per Unit</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
                  </td>
                </tr>
              ) : wasteTypes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data jenis sampah.
                  </td>
                </tr>
              ) : (
                wasteTypes.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{item.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{item.description || 'Tidak ada deskripsi'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      Rp {Number(item.price_per_unit).toLocaleString('id-ID')} <span className="text-gray-400 text-xs">/ {item.unit}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-green-600">
                      {item.points_per_unit} PTS <span className="text-gray-400 text-xs">/ {item.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          disabled={actionLoading}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Edit Kategori Sampah' : 'Tambah Kategori Baru'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Cth: Plastik PET"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  rows={2}
                  placeholder="Cth: Botol minuman bening"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Satuan *</label>
                  <select 
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  >
                    <option value="kg">Kilogram (Kg)</option>
                    <option value="pcs">Pieces (Pcs)</option>
                    <option value="liter">Liter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Beli (Rp) *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.price_per_unit}
                    onChange={(e) => setFormData({...formData, price_per_unit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="Cth: 2000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poin Reward *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.points_per_unit}
                    onChange={(e) => setFormData({...formData, points_per_unit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="Cth: 15"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading ? 'Menyimpan...' : <><CheckCircle2 size={18} /> Simpan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
