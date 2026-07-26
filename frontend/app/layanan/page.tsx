import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Truck, Recycle, Leaf, Users, ArrowRight } from 'lucide-react'

const LayananPage = () => {
  const services = [
    {
      title: 'Penjemputan Terjadwal',
      desc: 'Atur jadwal penjemputan sampah rutin di rumah atau tempat usaha Anda tanpa repot.',
      icon: <Truck size={32} />,
      link: '/dashboard/customer/subscriptions'
    },
    {
      title: 'Penjemputan Sekali Jalan',
      desc: 'Pesan penjemputan instan untuk tumpukan sampah sesekali yang butuh segera dibuang.',
      icon: <Recycle size={32} />,
      link: '/dashboard/customer/orders/create'
    },
    {
      title: 'Lapor Sampah Liar',
      desc: 'Laporkan tumpukan sampah di tempat umum agar lingkungan kota tetap bersih dan asri.',
      icon: <Leaf size={32} />,
      link: '/lapor'
    },
    {
      title: 'Edukasi & Komunitas',
      desc: 'Akses artikel, tips zero waste, dan bergabung bersama ribuan anggota yang peduli bumi.',
      icon: <Users size={32} />,
      link: '/komunitas'
    }
  ]

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Layanan <span className="text-green-600">Terbaik</span> Kami
          </h1>
          <p className="text-lg text-gray-600">
            Hijauin menghadirkan berbagai solusi untuk mempermudah Anda dalam mengelola sampah. Pilih layanan yang paling sesuai dengan kebutuhan Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((srv, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col group">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {srv.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{srv.title}</h3>
              <p className="text-gray-600 mb-8 grow">{srv.desc}</p>
              
              <Link href={srv.link} className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 mt-auto">
                Pelajari Lebih Lanjut
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LayananPage
