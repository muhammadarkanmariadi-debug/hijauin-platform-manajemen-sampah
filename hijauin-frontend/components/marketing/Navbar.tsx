'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLenis } from '@/components/marketing/LenisProvider';

/**
 * Editorial sticky navbar for Hijauin marketing/awareness page.
 *
 * Bright & Luminous Edition:
 * - Uses existing `/assets/images/logo.png`
 * - Translucent frosted glass with stone hairline border
 * - Top scroll-progress bar
 * - Responsive mobile drawer
 * - Smooth Lenis scroll to section anchors
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress((scrollY / docHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#krisis', label: 'Krisis Sampah' },
    { href: '#data-nasional', label: 'Data Nasional' },
    { href: '#komposisi', label: 'Komposisi' },
    { href: '#solusi', label: 'Solusi Digital' },
    { href: '#alur', label: 'Alur Setor' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(href, { offset: -70, duration: 1.2 });
      } else {
        const target = document.querySelector(href);
        target?.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Real-time Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#0B3D26] via-[#1F6B3F] to-[#4FA65C] z-[60] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-stone-200/80 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center py-1">
            <Image
              src="/assets/images/logo.png"
              alt="Hijauin"
              width={177}
              height={78}
              className="h-9 md:h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-stone-600 hover:text-[#0B3D26] transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-[4px] px-4 py-2 text-sm font-medium text-stone-700 hover:text-[#0B3D26] hover:bg-stone-100/60 transition-all"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-[4px] bg-[#0B3D26] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1F6B3F] active:translate-y-0.5 transition-all"
            >
              Daftar Nasabah
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-[#0B3D26]"
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-stone-200 px-6 py-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-base font-medium text-stone-700 hover:text-[#0B3D26] cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-4 border-t border-stone-200 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center rounded-[4px] border border-stone-300 py-2.5 text-sm font-medium text-stone-700"
              >
                Masuk ke Akun
              </Link>
              <Link
                href="/register"
                className="w-full text-center rounded-[4px] bg-[#0B3D26] py-2.5 text-sm font-semibold text-white"
              >
                Daftar Nasabah
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
