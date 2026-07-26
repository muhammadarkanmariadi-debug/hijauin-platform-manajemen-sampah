import React from 'react'

const Whyjoinus = () => {
  return (
    <section className='bg-white py-16 text-green-700'>
      <div className='mx-auto px-4 max-w-6xl'>
        <h2 className='mb-4 font-bold text-3xl text-center'>
          Kenapa Bergabung dengan Kami?
        </h2>
        <p className='mx-auto mb-12 max-w-2xl text-green-700 text-center'>
          Dapatkan layanan terbaik dan bergabunglah dengan komunitas peduli
          lingkungan
        </p>
        <div className='gap-8 grid md:grid-cols-3'>
          <div className='bg-white/10 shadow-xl backdrop-blur-sm p-6 rounded-xl hover:scale-105 transition-transform'>
            <div className='flex justify-center items-center bg-white/20 mx-auto mb-4 rounded-full w-12 h-12'>
              <span className='text-3xl'>📝</span>
            </div>
            <h3 className='mb-3 font-bold text-xl text-center'>Layanan 24/7</h3>
            <p className='text-green-700 text-center'>
              Tim kami siap membantu Anda kapan saja, di mana saja dengan
              respons cepat dan solusi tepat
            </p>
          </div>
          <div className='bg-white/10 shadow-xl backdrop-blur-sm p-6 rounded-xl hover:scale-105 transition-transform'>
            <div className='flex justify-center items-center bg-white/20 mx-auto mb-4 rounded-full w-12 h-12'>
              <span className='text-3xl'>🤝</span>
            </div>
            <h3 className='mb-3 font-bold text-xl text-center'>
              Dukungan Profesional
            </h3>
            <p className='text-green-700 text-center'>
              Dapatkan bantuan dari tim profesional yang berpengalaman dalam
              menangani berbagai kebutuhan Anda
            </p>
          </div>
          <div className='bg-white/10 shadow-xl backdrop-blur-sm p-6 rounded-xl hover:scale-105 transition-transform'>
            <div className='flex justify-center items-center bg-white/20 mx-auto mb-4 rounded-full w-12 h-12'>
              <span className='text-3xl'>💚</span>
            </div>
            <h3 className='mb-3 font-bold text-xl text-center'>
              Komunitas Aktif
            </h3>
            <p className='text-green-700 text-center'>
              Bergabunglah dengan komunitas peduli lingkungan dan berbagi
              pengalaman positif bersama
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Whyjoinus
