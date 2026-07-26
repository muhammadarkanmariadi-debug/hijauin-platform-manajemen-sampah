import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RecycleIcon, User, LocateIcon, MedalIcon, ArrowRight } from 'lucide-react'

const Hero = () => {
  const card = [
    {
      icon: <RecycleIcon size={28} />,
      data: '10,000+ Kg',
      description: 'Sampah Dikelola'
    },
    {
      icon: <User size={28} />,
      data: '3,500+',
      description: 'Pengguna Aktif'
    },
    {
      icon: <LocateIcon size={28} />,
      data: '5,000+',
      description: 'Titik Penjemputan'
    },
    {
      icon: <MedalIcon size={28} />,
      data: '80%',
      description: 'Komunitas Peduli'
    }
  ]
  return (
    <div className="relative">
      <div className='relative w-full min-h-[100vh] lg:h-[900px] flex items-center overflow-hidden'>
        {/* Background Image with modern overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src='/assets/images/header.png'
            alt='Header Image'
            fill
            className='object-cover transform scale-105 motion-safe:animate-[pulse_20s_ease-in-out_infinite_alternate]'
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-green-900/80 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent"></div>
        </div>

        {/* Overlay Content */}
        <div className='relative z-10 w-full pt-32 pb-20 lg:pt-0 lg:pb-0'>
          <div className='mx-auto px-6 lg:px-12 container'>
            <div className='max-w-2xl backdrop-blur-sm bg-white/5 p-8 lg:p-12 rounded-3xl border border-white/10 shadow-2xl transition-transform hover:scale-[1.01] duration-500'>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 font-medium text-sm mb-6 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Platform Pengelolaan Sampah #1
              </div>
              
              <h1 className='mb-6 font-bold text-white text-5xl lg:text-7xl leading-tight tracking-tight drop-shadow-lg'>
                Hijaukan <br />
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300'>
                  Lingkunganmu
                </span>
              </h1>
              
              <p className='mb-8 text-gray-200 text-lg lg:text-xl font-light leading-relaxed max-w-xl'>
                Solusi cerdas, mudah, dan menguntungkan untuk pengelolaan sampah yang lebih bersih dan berkelanjutan. Mulai kumpulkan Poin Hijau hari ini.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register" className='group flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-green-500/30'>
                  Mulai Sekarang
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link href="/layanan" className='flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all'>
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Glassmorphism */}
      <div className='relative z-20 mx-auto -mt-24 px-6 lg:px-12 container'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {card.map((item, index) => (
            <div 
              key={index} 
              className='group flex flex-col items-center bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-green-500/10 border border-white p-8 rounded-2xl text-center transition-all duration-300 hover:-translate-y-2'
            >
              <div className='flex justify-center items-center bg-gradient-to-br from-green-500 to-emerald-700 mb-5 rounded-2xl w-16 h-16 text-white shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3'>
                {item.icon}
              </div>
              <h3 className='mb-2 font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-green-600 text-3xl tracking-tight'>
                {item.data}
              </h3>
              <p className='text-gray-600 font-medium'>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hero
