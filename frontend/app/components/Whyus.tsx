import React from 'react'
import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'

const Whyus = () => {
  const reasons = [
    'Penjemputan tepat waktu oleh petugas terlatih',
    'Dapatkan Poin Hijau yang bisa ditukar dengan berbagai hadiah',
    'Transparansi harga dan pelacakan status pesanan real-time',
    'Mendukung gerakan ekonomi sirkular dan zero waste'
  ]

  return (
    <section className="bg-gradient-to-b from-white to-green-50/50 py-20 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image 
                src="/assets/images/header.png" 
                alt="Kenapa memilih Hijauin" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-green-900/20 mix-blend-multiply"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl hidden md:flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-xl">100%</p>
                <p className="text-gray-500 text-sm">Ramah Lingkungan</p>
              </div>
            </div>
          </div>
          
          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            <h2 className="mb-4 font-bold text-3xl md:text-4xl text-gray-900 leading-tight">
              Kenapa Memilih <span className="text-green-600">Hijauin</span>?
            </h2>
            <p className="mb-8 text-gray-600 text-lg leading-relaxed">
              Kami hadir untuk mengubah cara pandang masyarakat terhadap sampah. 
              Bersama Hijauin, sampah bukan lagi masalah, melainkan sumber daya yang bernilai.
            </p>
            
            <div className="space-y-5">
              {reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-gray-700 font-medium">{reason}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-10">
              <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-green-700/30">
                Tentang Kami
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}

export default Whyus