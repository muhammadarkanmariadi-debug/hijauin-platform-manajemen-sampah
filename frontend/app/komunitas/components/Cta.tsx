import React from 'react'
import { Heart } from 'lucide-react'
const Cta = () => {
  return (
    <section className='mx-auto px-4 pb-16 max-w-4xl'>
      <div className='relative bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 shadow-2xl p-8 md:p-12 rounded-3xl overflow-hidden text-white text-center'>
        <div className='top-0 right-0 absolute bg-white opacity-10 -mt-32 -mr-32 rounded-full w-64 h-64'></div>
        <div className='bottom-0 left-0 absolute bg-white opacity-10 -mb-32 -ml-32 rounded-full w-64 h-64'></div>

        <div className='relative'>
          <Heart className='mx-auto mb-4 w-16 h-16 text-green-200' />
          <h2 className='mb-4 font-bold text-3xl md:text-4xl'>
            Siap Membuat Perubahan?
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-green-100 text-lg'>
            Bergabunglah dengan komunitas kami hari ini dan mulai perjalanan
            menuju gaya hidup yang lebih hijau dan berkelanjutan
          </p>
          <button className='bg-white hover:bg-green-50 shadow-xl hover:shadow-2xl px-8 py-4 rounded-xl font-bold text-green-700 text-lg transition-all hover:-translate-y-1'>
            Gabung Komunitas Gratis
          </button>
        </div>
      </div>
    </section>
  )
}

export default Cta
