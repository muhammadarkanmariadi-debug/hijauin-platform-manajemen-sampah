import React from 'react'

const Cta = () => {
  return (
    <section className='bg-emerald-600 py-16'>
      <div className='mx-auto px-4 max-w-4xl text-center'>
        <div className='flex justify-center items-center bg-white/20 mx-auto mb-6 rounded-full w-16 h-16'>
          <span className='text-4xl'>💚</span>
        </div>
        <h2 className='mb-4 font-bold text-white text-3xl'>
          Siap Membantu Perubahan?
        </h2>
        <p className='mx-auto mb-8 max-w-2xl text-emerald-100'>
          Bergabunglah dengan ribuan pelanggan yang telah mempercayai layanan
          kami untuk memberikan dukungan terbaik dalam perjalanan hijau mereka.
        </p>
        <button className='bg-white hover:bg-emerald-50 px-8 py-3 rounded-lg font-bold text-emerald-600 transition'>
          Gabung Komunitas Sekarang
        </button>
      </div>
    </section>
  )
}

export default Cta
