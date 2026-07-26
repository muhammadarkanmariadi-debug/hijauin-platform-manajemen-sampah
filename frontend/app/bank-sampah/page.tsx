import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Map, MapPin, Wallet, ArrowRight } from 'lucide-react'

const BankSampahPage = () => {
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-6">
              <Map size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Temukan <span className="text-green-600">Bank Sampah</span> Terdekat
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Jual sampah anorganikmu ke mitra Bank Sampah Hijauin dan ubah limbah menjadi cuan. Kami menghubungkanmu dengan jaringan bank sampah terpercaya di seluruh kota.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Wallet size={16} /></div>
                <span className="text-gray-700 font-medium">Tukar sampah dengan uang tunai atau Poin Hijau</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><MapPin size={16} /></div>
                <span className="text-gray-700 font-medium">Cari berdasarkan lokasi Anda</span>
              </li>
            </ul>
            <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 bg-green-700 text-white hover:bg-green-800 px-8 py-4 rounded-xl font-bold transition-all shadow-lg">
              Cari Sekarang
              <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 aspect-[4/3] relative flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400 mb-2">Peta Interaktif</h3>
                <p className="text-gray-500">Silakan login ke dashboard untuk melihat peta lokasi mitra Bank Sampah.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BankSampahPage