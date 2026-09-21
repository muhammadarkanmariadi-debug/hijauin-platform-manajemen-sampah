import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Editorial split-screen layout for authentication pages (/login, /register).
 *
 * Conforms strictly to docs/DESIGN.md:
 * - Left pane (desktop): Full-bleed documentary photography with deep void vignette,
 *   film-grain texture, and Fraunces display typography.
 * - Right pane: Warm bone-white canvas (#FAF8F5) with stone hairlines and 4px radius controls.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#FAF8F5] text-[#14140F]">
      {/* ── Left Cinematic Pane (Desktop Only) ────────────────────── */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-[#14140F] text-[#F1ECDF]">
        {/* Background Documentary Photography */}
        <div className="absolute inset-0 select-none pointer-events-none">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/7/77/Gotong_Royong_Membersihkan_Sungai.jpg"
            alt="Dokumentasi aksi gotong royong pemilahan sampah Indonesia"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center filter saturate-[0.75] brightness-[0.55] contrast-[1.15]"
          />

          {/* Deep Void Vignette */}
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,20,15,0.4)_0%,rgba(20,20,15,0.85)_75%,#14140F_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#14140F] via-transparent to-[#14140F]/80"
            aria-hidden="true"
          />

          {/* Subtle Tactile Film Grain */}
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden="true"
          />
        </div>

        {/* Top: Logo & Platform Identity */}
        <div className="relative z-10">
          <Link href="/" className="inline-block group">
            <Image
              src="/assets/images/logo.png"
              alt="Hijauin"
              width={160}
              height={70}
              className="h-9 w-auto object-contain brightness-0 invert opacity-95 group-hover:opacity-100 transition-opacity"
            />
          </Link>
          <p className="mt-2 text-xs font-mono tracking-widest text-[#7C8574]">
            PLATFORM BANK SAMPAH DIGITAL INDONESIA
          </p>
        </div>

        {/* Middle: Editorial Narrative Statement */}
        <div className="relative z-10 max-w-lg space-y-4 my-auto py-12">
          <p className="text-xs font-semibold text-[#4FA65C] tracking-wide">
            Sirkularitas Terukur
          </p>
          <h2 className="font-display text-3xl xl:text-4xl font-semibold leading-tight text-white">
            Sampah bukan akhir perjalanan. Di tangan kita, ia bertransformasi menjadi nilai nyata.
          </h2>
          <p className="text-sm text-[#F1ECDF]/80 leading-relaxed font-sans">
            Setiap kilogram anorganik yang Anda pilah dan setorkan tercatat transparan, menghasilkan saldo poin dan memangkas gunungan di tempat pembuangan akhir.
          </p>
        </div>

        {/* Bottom: Citation Note */}
        <div className="relative z-10 pt-6 border-t border-stone-800 flex items-center justify-between text-xs text-[#7C8574]">
          <p>© 2026 Hijauin. Terintegrasi unit bank sampah nasional.</p>
          <Link href="/" className="hover:text-white transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* ── Right Form Pane (Clean Bone-White Canvas) ─────────────── */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-16 border-l border-stone-200/80">
        <div className="w-full max-w-md">
          {/* Mobile-only logo header */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/images/logo.png"
                alt="Hijauin"
                width={150}
                height={66}
                className="h-8 w-auto mx-auto object-contain"
              />
            </Link>
            <p className="mt-2 text-xs text-[#7C8574]">
              Platform Bank Sampah Digital
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
