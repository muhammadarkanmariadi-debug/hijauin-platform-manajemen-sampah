import React from 'react'
import { HelpCircle } from 'lucide-react'

export interface Stat {
  label: string
  value: string | number
  Icon?: any
}
const Hero2 = ({ stats }: { stats: Stat[] }) => {
  return (
    <section className='bg-linear-to-br from-green-600 via-emerald-600 to-teal-600 mt-30 py-20 text-white'>
      <div className='mx-auto px-4 max-w-4xl text-center'>
        <div className='inline-block bg-white backdrop-blur-sm mb-6 px-4 py-2 rounded-full font-semibold text-green-700 text-sm'>
          <HelpCircle className='inline-block mr-2 w-5 h-5' />
          Pusat Layanan Pelanggan
        </div>
        <h1 className='mb-4 font-bold text-4xl md:text-5xl'>
          Pusat Layanan Pelanggan
        </h1>
        <p className='mx-auto mb-8 max-w-2xl text-emerald-50 text-lg'>
          Berdedikasi dengan komunitas peduli lingkungan dan berbagi pengalaman
        </p>
        <div className='flex flex-wrap justify-center gap-4'>
          <button className='bg-white hover:bg-emerald-50 px-6 py-3 rounded-2xl font-medium text-green-700 transition'>
            Hubungi Kami
          </button>
          <button className='bg-white hover:bg-emerald-50 px-6 py-3 border-2 border-white rounded-2xl font-medium text-green-700 transition'>
            Pelajari Lebih Lanjut
          </button>
        </div>

        {/* Stats */}
        <div className='gap-6 grid grid-cols-2 md:grid-cols-4 mx-auto mt-12 max-w-3xl'>
          {stats.map((stat, index) => (
            <div
              key={index}
              className='bg-white backdrop-blur-sm p-4 rounded-lg text-green-700'
            >
              <div className='font-bold text-3xl'>{stat.value}</div>
              <div className='text-sm'>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero2
