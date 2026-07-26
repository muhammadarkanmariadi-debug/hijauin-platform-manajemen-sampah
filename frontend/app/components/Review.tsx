import React from 'react'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'

const Review = () => {
  const reviews = [
    {
      name: 'Budi Santoso',
      role: 'Pelanggan Rumah Tangga',
      content: 'Sejak menggunakan Hijauin, saya tidak perlu repot lagi membuang sampah. Petugas datang tepat waktu dan aplikasinya sangat mudah digunakan.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=11'
    },
    {
      name: 'Siti Aminah',
      role: 'Pemilik UMKM',
      content: 'Sangat membantu bisnis cafe saya dalam mengelola sampah organik dan anorganik. Poin yang didapat juga bisa ditukar untuk voucher belanja!',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=5'
    },
    {
      name: 'Ahmad Faisal',
      role: 'Warga Peduli Lingkungan',
      content: 'Fitur laporan sampah liarnya luar biasa. Saya melaporkan tumpukan sampah di jalan, besoknya langsung bersih diangkut tim Hijauin.',
      rating: 4,
      image: 'https://i.pravatar.cc/150?img=15'
    }
  ]

  return (
    <section className="bg-gray-50 py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="mb-3 font-bold text-3xl md:text-4xl text-gray-900">
            Apa Kata <span className="text-green-600">Mereka</span>?
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 text-lg">
            Bergabunglah dengan ribuan pelanggan lainnya yang telah merasakan manfaat nyata dari Hijauin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col relative">
              <div className="absolute top-6 right-6 text-green-100">
                <Quote size={48} />
              </div>
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'} 
                  />
                ))}
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-8 grow relative z-10 font-medium">
                "{review.content}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 border-green-500">
                  <Image 
                    src={review.image} 
                    alt={review.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-green-600 font-medium">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Review