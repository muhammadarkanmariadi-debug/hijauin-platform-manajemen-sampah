'use client'

import React, { useEffect, useState } from 'react'
import apiService from '../../../services/api.service'
import { Award, TrendingUp, TrendingDown, Gift, ShoppingBag, Package } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import Link from 'next/link'

export default function HijauPointsPage() {
  const { user } = useAuth()
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await apiService.get('/customer/points')
      if (res.success) {
        setHistory(res.data.data) // Pagination
      }
    } catch (error) {
      console.error('Error fetching points history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type: string, description: string) => {
    if (type === 'earned') {
      if (description.toLowerCase().includes('order')) return <Package size={20} className="text-green-600" />
      return <TrendingUp size={20} className="text-green-600" />
    } else {
      if (description.toLowerCase().includes('reward') || description.toLowerCase().includes('tukar')) return <Gift size={20} className="text-red-600" />
      if (description.toLowerCase().includes('beli') || description.toLowerCase().includes('market')) return <ShoppingBag size={20} className="text-red-600" />
      return <TrendingDown size={20} className="text-red-600" />
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Poin Hijau</h1>
        <p className="text-gray-500">Kumpulkan poin dari setiap transaksi dan tukarkan dengan hadiah menarik</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Points Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-green-700 to-green-900 rounded-2xl shadow-md p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Award size={180} className="-mr-10 -mt-10" />
          </div>
          <div className="relative z-10">
            <p className="text-green-100 font-medium mb-1">Total Poin Saat Ini</p>
            <div className="flex items-end gap-3 mb-6">
              <h2 className="text-5xl font-bold">{user?.hijau_points || 0}</h2>
              <span className="text-xl font-medium text-green-200 mb-1">PTS</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => alert('Fitur penukaran poin akan segera hadir di Katalog Hadiah!')}
                className="bg-white text-green-800 hover:bg-green-50 px-5 py-2.5 rounded-lg font-bold transition-colors"
              >
                Tukar Poin
              </button>
              <Link 
                href="/dashboard/customer/orders/create"
                className="bg-green-800 bg-opacity-50 hover:bg-opacity-70 border border-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
              >
                Kumpulkan Poin Lagi
              </Link>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Gift size={24} />
          </div>
          <h3 className="font-bold text-gray-800 text-lg mb-2">Tingkatkan Level Anda!</h3>
          <p className="text-sm text-gray-500 mb-4">Kumpulkan 500 poin lagi untuk mencapai level <span className="font-bold text-gray-800">Gold</span> dan nikmati diskon khusus.</p>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs text-right text-gray-500 font-medium">45% menuju Gold</p>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 text-lg">Riwayat Transaksi Poin</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Award size={28} />
            </div>
            <h3 className="text-gray-800 font-bold mb-1">Belum ada riwayat</h3>
            <p className="text-gray-500 text-sm">Anda belum pernah mendapatkan atau menukarkan poin.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {history.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.transaction_type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {getTransactionIcon(item.transaction_type, item.description)}
                </div>
                
                <div className="flex-1">
                  <p className="font-bold text-gray-800 line-clamp-1">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(item.created_at), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                  </p>
                </div>
                
                <div className={`font-bold text-lg ${
                  item.transaction_type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.transaction_type === 'earned' ? '+' : '-'}{item.points}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
