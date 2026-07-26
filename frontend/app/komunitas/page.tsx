import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Heart, Award, ArrowRight } from 'lucide-react'

const KomunitasPage = () => {
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Hero Komunitas */}
        <div className="bg-gradient-to-br from-green-800 to-emerald-950 rounded-3xl p-10 md:p-20 text-center text-white mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bergerak Bersama untuk Bumi
            </h1>
            <p className="text-xl text-green-100 mb-10">
              Bergabung dengan ribuan pahlawan lingkungan lainnya di komunitas Hijauin. Bagikan tips zero-waste, ikuti event penghijauan, dan jadilah inspirasi.
            </p>
            <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 bg-white text-green-800 px-8 py-4 rounded-xl font-bold transition-all hover:bg-gray-100 shadow-xl hover:scale-105">
              Gabung Komunitas
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={36} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">15.000+ Member</h3>
            <p className="text-gray-600">Berbagi cerita, tips, dan pengalaman seputar gaya hidup berkelanjutan.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={36} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">500+ Relawan</h3>
            <p className="text-gray-600">Turun langsung membersihkan lingkungan dalam event Clean Up tahunan kami.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award size={36} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Leaderboard</h3>
            <p className="text-gray-600">Kumpulkan Poin Hijau dan bersaing secara sehat untuk mencapai rank tertinggi.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default KomunitasPage
