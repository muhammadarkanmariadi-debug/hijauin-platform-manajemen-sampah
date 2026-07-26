"use client"
import React, { useState } from 'react'
import {
  Users,
  Clock,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  ChevronRight,
  Tag
} from 'lucide-react'
import {  artikelData } from '@/app/components/lib/static'
import { useParams } from 'next/navigation'

// artikelData Detail Component
const artikelDataDetail = () => {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { slug } = useParams()
  const arts = artikelData.filter(art => art.slug == slug)
  const related = artikelData.filter(art => art.slug != slug)

  return (
    <div className='bg-gray-50 min-h-screen'>
      {/* Hero Image */}
      <div className='relative w-full h-[60vh] overflow-hidden'>
        <img
          src={arts[0].image}
          alt={arts[0].title}
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent' />

        {/* Back Button */}
        <button className='top-8 left-8 absolute flex items-center gap-2 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm px-4 py-2 rounded-xl font-medium text-gray-800 transition-all'>
          <ArrowLeft className='w-5 h-5' />
          Kembali
        </button>

        {/* Title Overlay */}
        <div className='bottom-0 absolute mx-auto px-4 md:px-8 pb-12 w-full max-w-4xl'>
          <div className='mb-4'>
            <span className='px-4 py-2 rounded-full font-semibold text-white text-sm'>
              {arts[0].category}
            </span>
          </div>
          <h1 className='mb-4 font-bold text-white text-4xl md:text-5xl leading-tight'>
            {arts[0].title}
          </h1>
          <p className='text-gray-200 text-xl leading-relaxed'>
            {arts[0].excerpt}
          </p>
        </div>
      </div>

      {/* arts Content */}
      <div className='mx-auto px-4 md:px-8 py-12 max-w-4xl'>
        {/* Author Info & Meta */}
        <div className='flex sm:flex-row flex-col justify-between items-start gap-6 bg-white shadow-lg mb-12 p-6 rounded-2xl'>
          <div className='flex items-center gap-4'>
            <img
              src={arts[0].authorImage}
              alt={arts[0].author}
              className='rounded-full ring-4 ring-green-100 w-16 h-16 object-cover'
            />
            <div>
              <h3 className='font-bold text-gray-900 text-lg'>
                {arts[0].author}
              </h3>
              <p className='text-gray-600 text-sm'>{arts[0].authorBio}</p>
            </div>
          </div>

          <div className='flex sm:flex-row flex-col gap-4 text-gray-600 text-sm'>
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4' />
              <span>{arts[0].date}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-4 h-4' />
              <span>{arts[0].readTime}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap gap-3 bg-white shadow-md mb-8 p-4 rounded-2xl'>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              isLiked
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{arts[0].likes! + (isLiked ? 1 : 0)}</span>
          </button>

          <button className='flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl font-medium text-gray-700 transition-all'>
            <MessageCircle className='w-5 h-5' />
            <span>{arts[0].comments}</span>
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              isBookmarked
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bookmark
              className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`}
            />
            <span>{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
          </button>

          <button className='flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl font-medium text-gray-700 transition-all'>
            <Share2 className='w-5 h-5' />
            <span>Bagikan</span>
          </button>
        </div>

        {/* artikelData Body */}
        <article className='bg-white shadow-lg mb-12 p-8 md:p-12 rounded-2xl max-w-none prose prose-lg'>
          <div
            dangerouslySetInnerHTML={{ __html: arts[0].content || '' }}
            className='artikelData-content'
          />
        </article>

        {/* Tags */}
        <div className='bg-white shadow-md mb-12 p-6 rounded-2xl'>
          <div className='flex items-center gap-2 mb-4'>
            <Tag className='w-5 h-5 text-gray-600' />
            <h3 className='font-bold text-gray-900 text-lg'>Tag Artikel</h3>
          </div>
          <div className='flex flex-wrap gap-2'>
            {arts[0].tags?.map((tag, i) => (
              <span
                key={i}
                className='bg-green-50 hover:bg-green-100 px-4 py-2 rounded-full text-green-700 text-sm transition-colors cursor-pointer'
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related artikelDatas */}
        <div className='bg-white shadow-lg p-8 rounded-2xl'>
          <h3 className='mb-6 font-bold text-gray-900 text-2xl'>
            Artikel Terkait
          </h3>
          <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
            {related.map((relatedartikelData, i) => (
              <div
                key={i}
                className='group border border-gray-200 hover:border-green-300 rounded-xl overflow-hidden transition-all cursor-pointer'
              >
                <img
                  src={relatedartikelData.image}
                  alt={relatedartikelData.title}
                  className='w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300'
                />
                <div className='p-4'>
                  <span className='bg-green-100 px-3 py-1 rounded-full font-medium text-green-700 text-xs'>
                    {relatedartikelData.category}
                  </span>
                  <h4 className='mt-3 mb-2 font-bold text-gray-900 group-hover:text-green-600 line-clamp-2 transition-colors'>
                    {relatedartikelData.title}
                  </h4>
                  <p className='mb-3 text-gray-600 text-sm line-clamp-2'>
                    {relatedartikelData.excerpt}
                  </p>
                  <div className='flex items-center gap-2 text-green-600 text-sm'>
                    <span className='font-medium'>Baca Selengkapnya</span>
                    <ChevronRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default artikelDataDetail