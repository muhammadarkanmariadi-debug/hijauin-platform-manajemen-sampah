import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AlertTriangle, Camera, MapPin, CheckCircle, ArrowRight } from 'lucide-react'

const LaporPage = () => {
  const steps = [
    { icon: <Camera size={24} />, title: 'Ambil Foto', desc: 'Foto tumpukan sampah liar yang Anda temukan di jalan atau lingkungan sekitar.' },
    { icon: <MapPin size={24} />, title: 'Tandai Lokasi', desc: 'Gunakan fitur GPS atau masukkan alamat lokasi tumpukan sampah tersebut.' },
    { icon: <CheckCircle size={24} />, title: 'Tim Kami Bertindak', desc: 'Laporan Anda akan masuk ke dashboard kami dan segera ditindaklanjuti oleh petugas terdekat.' }
  ]

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Lapor Sampah Liar
          </h1>
          <p className="text-lg text-gray-600">
            Bantu kami menjaga kebersihan kota. Laporkan tumpukan sampah liar yang mengganggu kenyamanan publik, dan biarkan pahlawan Hijauin yang menanganinya.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-xl transition-shadow relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white">
                {idx + 1}
              </div>
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                {step.icon}
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">Mulai Lapor Sekarang!</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg relative z-10">
            Setiap laporan Anda sangat berarti bagi lingkungan. Dapatkan Poin Hijau tambahan untuk setiap laporan yang valid dan terselesaikan.
          </p>
          
          <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 bg-white text-green-700 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold transition-all relative z-10 shadow-lg hover:shadow-xl hover:-translate-y-1">
            Buat Laporan Baru
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LaporPage