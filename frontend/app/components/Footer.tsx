"use client";

import React, { useState } from 'react';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, Send, Leaf, Users, Calendar, Bell } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e:any) => {
    e.preventDefault();
    alert(`Terima kasih! Email ${email} telah didaftarkan.`);
    setEmail('');
  };

  return (
    <footer className="relative bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="top-0 right-0 absolute bg-green-200 opacity-20 blur-3xl rounded-full w-64 h-64"></div>
      <div className="bottom-0 left-0 absolute bg-emerald-200 opacity-20 blur-3xl rounded-full w-96 h-96"></div>
      
      <div className="relative mx-auto px-4 py-16 max-w-7xl">
        {/* Main Footer Content */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 mb-12">
          {/* Brand Section - 4 cols */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
             
                <Image src="/assets/images/ico.png" alt="Hijauin Logo" width={30} height={30} />
           
              <span className="font-bold text-green-800 text-2xl">Hijauin</span>
            </div>
            <p className="mb-6 text-gray-600 text-sm leading-relaxed">
              Platform pengelolaan sampah dan lingkungan untuk masa depan yang lebih hijau. Bersama kita ciptakan perubahan positif untuk bumi kita.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3 mb-6">
              <a href="#" className="group relative flex justify-center items-center bg-white shadow-sm hover:shadow-md rounded-xl w-11 h-11 transition-all hover:-translate-y-1 duration-300">
                <Instagram className="w-5 h-5 text-gray-600 group-hover:text-pink-500 transition-colors" />
              </a>
              <a href="#" className="group relative flex justify-center items-center bg-white shadow-sm hover:shadow-md rounded-xl w-11 h-11 transition-all hover:-translate-y-1 duration-300">
                <Facebook className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </a>
              <a href="#" className="group relative flex justify-center items-center bg-white shadow-sm hover:shadow-md rounded-xl w-11 h-11 transition-all hover:-translate-y-1 duration-300">
                <Youtube className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
              </a>
              <a href="#" className="group relative flex justify-center items-center bg-white shadow-sm hover:shadow-md rounded-xl w-11 h-11 transition-all hover:-translate-y-1 duration-300">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
            
            {/* Stats */}
            <div className="gap-4 grid grid-cols-2">
              <div className="bg-white shadow-sm p-3 rounded-lg">
                <div className="font-bold text-green-700 text-2xl">12K+</div>
                <div className="text-gray-600 text-xs">Pengguna Aktif</div>
              </div>
              <div className="bg-white shadow-sm p-3 rounded-lg">
                <div className="font-bold text-green-700 text-2xl">5K+</div>
                <div className="text-gray-600 text-xs">Laporan Sampah</div>
              </div>
            </div>
          </div>
          
          {/* Quick Links - 2 cols */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 font-bold text-gray-800 text-sm uppercase tracking-wider">Navigasi</h3>
            <nav className="flex flex-col gap-3">
              <a href="/" className="group flex items-center gap-2 text-gray-600 hover:text-green-700 text-sm transition-colors">
                <div className="bg-gray-400 group-hover:bg-green-700 rounded-full w-1 group-hover:w-2 h-1 transition-all"></div>
                Beranda
              </a>
              <a href="/jadwal" className="group flex items-center gap-2 text-gray-600 hover:text-green-700 text-sm transition-colors">
                <div className="bg-gray-400 group-hover:bg-green-700 rounded-full w-1 group-hover:w-2 h-1 transition-all"></div>
                Jadwal
              </a>
              <a href="/lapor" className="group flex items-center gap-2 text-gray-600 hover:text-green-700 text-sm transition-colors">
                <div className="bg-gray-400 group-hover:bg-green-700 rounded-full w-1 group-hover:w-2 h-1 transition-all"></div>
                Lapor
              </a>
              <a href="/layanan" className="group flex items-center gap-2 text-gray-600 hover:text-green-700 text-sm transition-colors">
                <div className="bg-gray-400 group-hover:bg-green-700 rounded-full w-1 group-hover:w-2 h-1 transition-all"></div>
                Layanan
              </a>
              <a href="/komunitas" className="group flex items-center gap-2 text-gray-600 hover:text-green-700 text-sm transition-colors">
                <div className="bg-gray-400 group-hover:bg-green-700 rounded-full w-1 group-hover:w-2 h-1 transition-all"></div>
                Komunitas
              </a>
            </nav>
          </div>
          
          {/* Services - 3 cols */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 font-bold text-gray-800 text-sm uppercase tracking-wider">Layanan Kami</h3>
            <div className="flex flex-col gap-3">
              <div className="group flex items-start gap-3 cursor-pointer">
                <div className="flex justify-center items-center bg-green-100 group-hover:bg-green-200 rounded-lg w-10 h-10 transition-colors shrink-0">
                  <Calendar className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 group-hover:text-green-700 text-sm transition-colors">Jadwal Pengambilan</div>
                  <div className="text-gray-600 text-xs">Cek jadwal pengambilan sampah</div>
                </div>
              </div>
              <div className="group flex items-start gap-3 cursor-pointer">
                <div className="flex justify-center items-center bg-blue-100 group-hover:bg-blue-200 rounded-lg w-10 h-10 transition-colors shrink-0">
                  <Bell className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 group-hover:text-blue-700 text-sm transition-colors">Lapor Masalah</div>
                  <div className="text-gray-600 text-xs">Laporkan masalah lingkungan</div>
                </div>
              </div>
              <div className="group flex items-start gap-3 cursor-pointer">
                <div className="flex justify-center items-center bg-purple-100 group-hover:bg-purple-200 rounded-lg w-10 h-10 transition-colors shrink-0">
                  <Users className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 group-hover:text-purple-700 text-sm transition-colors">Komunitas Hijau</div>
                  <div className="text-gray-600 text-xs">Bergabung dengan komunitas</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Info - 3 cols */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 font-bold text-gray-800 text-sm uppercase tracking-wider">Hubungi Kami</h3>
            <div className="flex flex-col gap-4">
              <div className="bg-white shadow-sm hover:shadow-md p-4 rounded-xl transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex justify-center items-center bg-green-100 rounded-lg w-10 h-10 shrink-0">
                    <Mail className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500 text-xs">Email</div>
                    <a href="mailto:hijauin@gmail.com" className="font-medium text-gray-800 hover:text-green-700 text-sm transition-colors">
                      hijauin@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow-sm hover:shadow-md p-4 rounded-xl transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex justify-center items-center bg-blue-100 rounded-lg w-10 h-10 shrink-0">
                    <Phone className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500 text-xs">Telepon</div>
                    <a href="tel:777-888-9999" className="font-medium text-gray-800 hover:text-blue-700 text-sm transition-colors">
                      777-888-9999
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow-sm hover:shadow-md p-4 rounded-xl transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex justify-center items-center bg-orange-100 rounded-lg w-10 h-10 shrink-0">
                    <MapPin className="w-5 h-5 text-orange-700" />
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500 text-xs">Alamat</div>
                    <div className="font-medium text-gray-800 text-sm">
                      Danau st 123<br />Kota Malang
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="relative bg-linear-to-r from-green-700 via-emerald-700 to-teal-700 shadow-xl mb-8 p-8 rounded-2xl overflow-hidden">
          <div className="top-0 right-0 absolute bg-white opacity-5 -mt-32 -mr-32 rounded-full w-64 h-64"></div>
          <div className="bottom-0 left-0 absolute bg-white opacity-5 -mb-24 -ml-24 rounded-full w-48 h-48"></div>
          
          <div className="relative items-center gap-6 grid grid-cols-1 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 mb-3 px-4 py-1.5 rounded-full">
                <Bell className="w-4 h-4 text-green-700" />
                <span className="font-semibold text-green-700 text-xs">Newsletter</span>
              </div>
              <h3 className="mb-2 font-bold text-white text-2xl">Dapatkan Update Terbaru</h3>
              <p className="text-green-100 text-sm">
                Berlangganan newsletter kami untuk mendapatkan tips lingkungan, info jadwal, dan berita terkini.
              </p>
            </div>
            
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="flex-1 shadow-lg px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-white"
              />
              <button 
                onClick={handleSubscribe}
                className="flex items-center gap-2 bg-white hover:bg-green-50 shadow-lg hover:shadow-xl px-6 py-3.5 rounded-xl font-semibold text-green-700 transition-all hover:-translate-y-0.5 duration-300"
              >
                <span className="hidden sm:inline">Subscribe</span>
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-gray-200 border-t">
          <div className="flex md:flex-row flex-col justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              © 2024 <span className="font-semibold text-green-700">Hijauin</span>. All rights reserved.
            </div>
            
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-gray-600 hover:text-green-700 transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-gray-600 hover:text-green-700 transition-colors">Terms of Service</a>
              <a href="/faq" className="text-gray-600 hover:text-green-700 transition-colors">FAQ</a>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">Made with</span>
              <Leaf className="w-4 h-4 text-green-600 animate-pulse" />
              <span className="text-gray-500 text-xs">for a better earth</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}