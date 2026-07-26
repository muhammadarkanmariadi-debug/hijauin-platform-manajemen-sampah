import React from 'react'
import { ChevronRight } from 'lucide-react'
import { icon } from 'leaflet'
import { fiturData } from './lib/static'

const Fitur = () => {
  return (
    <section className="mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-12 text-center">
        <h2 className="mb-3 font-bold text-3xl md:text-4xl">
          Fitur <span className="text-green-600">Unggulan</span>
        </h2>
        <p className="mx-auto max-w-2xl text-gray-600 text-lg">
          Jelajahi berbagai layanan yang kami sediakan untuk membantu Anda mengelola lingkungan dengan lebih baik.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fiturData.map((data, i) => {
          const Icon = data.icon;
          return (
            <div key={i} className='group flex flex-col bg-white shadow-lg hover:shadow-2xl p-6 border border-gray-100 rounded-3xl min-h-[280px] transition-all hover:-translate-y-2 duration-500'>
              <div className='flex justify-center items-center bg-gradient-to-br from-green-100 to-green-50 mb-5 rounded-2xl ring-4 ring-green-200/50 group-hover:ring-green-300 w-16 h-16 group-hover:scale-110 transition-all duration-300'>
                {Icon ? <Icon className='text-green-700 w-8 h-8' /> : <div className='text-green-700'></div>}
              </div>

              <h3 className='mb-3 font-bold text-gray-900 group-hover:text-green-600 text-xl transition-colors'>
                {data.title}
              </h3>

              <p className='mb-6 text-gray-600 text-sm leading-relaxed grow'>
                {data.description}
              </p>

              {data.link && (
                <button className='flex items-center gap-2 mt-auto font-semibold text-green-600 group-hover:text-green-700 text-sm transition-colors'>
                  Read More
                  <ChevronRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Fitur
