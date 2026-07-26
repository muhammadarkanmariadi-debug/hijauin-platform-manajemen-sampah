'use client'
import React, { useState } from 'react'
import {
  Users,
  Clock,
  Calendar,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react'
import ArtikelCard from '../components/ArtikelCard'

import { artikelData } from '@/app/components/lib/static'

const page = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')

  const categories = [
    'Semua',
    'Daur Ulang',
    'Kompos',
    'Zero Waste',
    'Edukasi',
    'DIY'
  ]

  const filteredArticles = artikelData.filter(article => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'Semua' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className='bg-linear-to-b from-green-50 via-white to-gray-50 mt-30 min-h-screen'>
      {/* Hero Section */}
      <section className='bg-linear-to-r from-green-600 to-green-700 pt-24 pb-16 text-white'>
        <div className='mx-auto px-4 max-w-7xl'>
          <div className='mb-10 text-center'>
            <h1 className='mb-4 font-bold text-5xl md:text-6xl'>
              Pusat Pengetahuan Lingkungan
            </h1>
            <p className='mx-auto max-w-3xl text-green-50 text-xl leading-relaxed'>
              Temukan artikel, panduan, dan tips terbaru seputar pengelolaan
              sampah, daur ulang, dan gaya hidup ramah lingkungan
            </p>
          </div>

          {/* Search Bar */}
          <div className='mx-auto max-w-3xl'>
            <div className='relative bg-white rounded-2xl text-green-700'>
              <Search className='top-1/2 left-5 absolute w-6 h-6 -translate-y-1/2 transform' />
              <input
                type='text'
                placeholder='Cari artikel, panduan, atau topik...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='shadow-2xl px-16 py-5 border-white focus:border-white rounded-2xl outline-white focus:outline-none ring-white focus:ring-4 focus:ring-white/20 w-full font-medium text-gray-900 text-lg transition-all borderwhite'
              />
              <button className='top-1/2 right-3 absolute bg-green-600 hover:bg-green-700 shadow-lg px-6 py-2.5 rounded-xl font-semibold text-white transition-colors -translate-y-1/2 transform'>
                Cari
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className='mx-auto px-4 py-8 max-w-7xl'>
        <div className='flex flex-wrap justify-center items-center gap-3'>
          <Filter className='w-5 h-5 text-gray-600' />
          <span className='mr-2 font-semibold text-gray-700'>Filter:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200 hover:border-green-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>
      {/* Articles Grid */}
      <section className='mx-auto px-4 py-12 max-w-7xl'>
        <div className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          <ArtikelCard article={filteredArticles}  />
        </div>

        {filteredArticles.length === 0 && (
          <div className='py-20 text-center'>
            <div className='flex justify-center items-center bg-gray-100 mx-auto mb-4 rounded-full w-24 h-24'>
              <Search className='w-12 h-12 text-gray-400' />
            </div>
            <h3 className='mb-2 font-semibold text-gray-800 text-2xl'>
              Artikel tidak ditemukan
            </h3>
            <p className='text-gray-600'>
              Coba ubah kata kunci atau filter kategori
            </p>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className='mx-auto px-4 py-16 max-w-7xl'>
        <div className='bg-linear-to-r from-green-600 to-green-700 shadow-2xl px-8 md:px-16 py-12 rounded-3xl text-white text-center'>
          <h2 className='mb-4 font-bold text-3xl md:text-4xl'>
            Dapatkan Artikel Terbaru
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-green-50 text-lg'>
            Berlangganan newsletter kami dan dapatkan tips lingkungan terbaru
            langsung di inbox Anda
          </p>
          <div className='flex sm:flex-row flex-col justify-center items-center gap-4 bg-white mx-auto px-2 max-w-md'>
            <input
              type='email'
              placeholder='Email Anda'
              className='px-6 py-4 rounded-xl focus:outline-none focus:ring-white/30 w-full text-gray-900'
            />
            <button className='bg-green-700 shadow-lg p-2 rounded-xl w-full sm:w-auto font-semibold text-white hover:scale-105 transition-all cursor-pointer transform'>
              Berlangganan
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
export default page
