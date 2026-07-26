import React from 'react'
import { BookOpen, MessageCircle, TrendingUp } from 'lucide-react'

const Benefit = () => {
  return (
    <section className='bg-linear-to-r from-green-600 to-emerald-600 py-16 text-white'>
      <div className='mx-auto px-4 max-w-6xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-3 font-bold text-3xl md:text-4xl'>
            Kenapa Bergabung dengan Kami?
          </h2>
          <p className='text-green-100 text-lg'>
            Manfaat yang akan Anda dapatkan sebagai anggota komunitas
          </p>
        </div>

        <div className='gap-6 grid grid-cols-1 md:grid-cols-3'>
          <div className='bg-white bg-opacity-10 backdrop-blur-sm p-6 border border-white border-opacity-20 rounded-2xl'>
            <div className='flex justify-center items-center bg-green-100 bg-opacity-20 mb-4 rounded-xl w-14 h-14'>
              <BookOpen className='w-7 h-7 text-green-700' />
            </div>
            <h3 className='mb-2 font-bold text-green-700 text-xl'>
              Edukasi Berkualitas
            </h3>
            <p className='text-green-700 text-sm'>
              Akses ke ratusan artikel, panduan, dan video tutorial tentang
              pengelolaan sampah dan lingkungan
            </p>
          </div>

          <div className='bg-white bg-opacity-10 backdrop-blur-sm p-6 border border-white border-opacity-20 rounded-2xl'>
            <div className='flex justify-center items-center bg-green-100 bg-opacity-20 mb-4 rounded-xl w-14 h-14'>
              <MessageCircle className='w-7 h-7 text-green-700' />
            </div>
            <h3 className='mb-2 font-bold text-green-700 text-xl'>
              Diskusi & Networking
            </h3>
            <p className='text-green-700 text-sm'>
              Terhubung dengan ribuan anggota lain, berbagi pengalaman, dan
              dapatkan solusi dari para ahli
            </p>
          </div>

          <div className='bg-white bg-opacity-10 backdrop-blur-sm p-6 border border-white border-opacity-20 rounded-2xl'>
            <div className='flex justify-center items-center bg-green-100 bg-opacity-20 mb-4 rounded-xl w-14 h-14'>
              <TrendingUp className='w-7 h-7 text-green-700' />
            </div>
            <h3 className='mb-2 font-bold text-green-700 text-xl'>
              Dampak Nyata
            </h3>
            <p className='text-green-700 text-sm'>
              Bersama-sama kita sudah mengurangi 500+ ton sampah dan menanam
              10,000+ pohon
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Benefit
