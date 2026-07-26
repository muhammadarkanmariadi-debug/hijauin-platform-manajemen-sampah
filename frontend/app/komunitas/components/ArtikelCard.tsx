import { ArtikelProps } from '@/app/components/lib/static'
import { ArrowRight, Calendar, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useState } from 'react'


  

const ArtikelCard = ({ article}: { article: ArtikelProps[] }) => {
  
  return (
    <>
    {article.map((art, index) => (
      <Link href={`/komunitas/berita/${art.slug}`}  key={index} className='group bg-white shadow-lg hover:shadow-2xl border border-gray-100 rounded-3xl overflow-hidden transition-all hover:-translate-y-3 duration-500'>
      <div className='relative h-56 overflow-hidden'>
        <img
          src={art.image}
          alt={art.title}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        <div className='top-4 left-4 absolute'>
          <span className='bg-linear-to-r from-green-500 to-green-600 shadow-lg backdrop-blur-sm px-4 py-1.5 rounded-full font-semibold text-white text-xs uppercase tracking-wide'>
            {art.category}
          </span>
        </div>
      </div>

      <div className='p-6'>
        <h3 className='mb-3 font-bold text-gray-900 group-hover:text-green-600 text-xl line-clamp-2 leading-tight transition-colors duration-300'>
          {art.title}
        </h3>
        <p className='mb-5 text-gray-600 text-sm line-clamp-3 leading-relaxed'>
          {art.excerpt}
        </p>

        <div className='flex justify-between items-center pt-5 border-gray-100 border-t'>
          <div className='flex items-center gap-3'>
            <div className='flex justify-center items-center bg-linear-to-br from-green-100 to-green-50 rounded-full ring-2 ring-green-200 w-10 h-10'>
              <Users className='w-4 h-4 text-green-700' />
            </div>
            <div className='flex flex-col'>
              <span className='font-semibold text-gray-800 text-sm'>
                {art.author}
              </span>
            </div>
          </div>
          <ArrowRight className='opacity-0 group-hover:opacity-100 w-5 h-5 text-green-600 transition-all group-hover:translate-x-1 duration-300 transform' />
        </div>

        <div className='flex items-center gap-4 mt-4 text-gray-500 text-xs'>
          <div className='flex items-center gap-1.5'>
            <Clock className='w-3.5 h-3.5' />
            <span>{art.readTime}</span>
          </div>
          <span className='text-gray-300'>•</span>
          <div className='flex items-center gap-1.5'>
            <Calendar className='w-3.5 h-3.5' />
            <span>{art.date}</span>
          </div>
        </div>
      </div>
    </Link>
    ))}
    </>
  )
}

export default ArtikelCard
