import { ArrowRight } from 'lucide-react'
import ArtikelCard from './ArtikelCard'
import Link from 'next/link'
import {  artikelData } from '@/app/components/lib/static'

const ArtikelSection = () => {
  const displayedArticles = artikelData.slice(0, 3)
  return (
    <section className='mx-auto px-4 py-16 max-w-7xl'>
      <div className='mb-14 text-center'>
        <h2 className='bg-clip-text bg-linear-to-r from-gray-900 to-green-600 mb-4 font-bold text-transparent text-4xl md:text-5xl'>
          Artikel & <span className='text-green-600'>Panduan Terbaru</span>
        </h2>
        <p className='mx-auto max-w-2xl text-gray-600 text-lg leading-relaxed'>
          Pelajari tips dan trik dari para ahli dan praktisi lingkungan
        </p>
      </div>

      <div className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12'>
       <ArtikelCard article={displayedArticles}  />
    
      
      </div>

      <div className='text-center'>
        <Link
          href={'/komunitas/berita'}
          className='bg-linear-to-r from-green-600 hover:from-green-700 to-green-700 hover:to-green-800 shadow-lg hover:shadow-xl px-10 py-4 rounded-2xl font-semibold text-white hover:scale-105 transition-all duration-300 transform'
        >
          Lihat Semua Artikel
          <ArrowRight className='inline-block ml-2 w-5 h-5' />
        </Link>
      </div>
    </section>
  )
}

export default ArtikelSection
