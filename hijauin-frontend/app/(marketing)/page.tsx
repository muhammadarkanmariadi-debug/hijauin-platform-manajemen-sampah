'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Navbar } from '@/components/marketing/Navbar';
import { ImageOverlay } from '@/components/marketing/ImageOverlay';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hijauin Public Awareness Experience
 * Strictly follows docs/DESIGN.md:
 * - Editorial documentary direction; zero gimmick pills or particle clutter.
 * - Consistent color tokens: --forest-950 (#0B3D26), --void-900 (#14140F), --bone-100 (#F1ECDF), --alarm-600 (#C1441F), --haze-400 (#7C8574).
 * - Authentic documentary photography: TPST Bantargebang, Bekasi & Indonesian community initiatives.
 * - Disciplined geometry: 4px radius for UI controls, 0px for cinematic imagery, 1px subtle hairlines.
 * - One signature gesture per scene:
 *   1. Hero: Dolly camera zoom & clean editorial stagger
 *   2. Crisis: Pinned documentary scene with scrubbed 51.8M ton reveal
 *   3. Data: Layered metric depth parallax & masked photo window
 *   4. Komposisi: Proportional material bar reveals
 *   5. Solusi: Ambient forest green expansion & statement emergence
 *   6. Alur: Scrubbed SVG stroke linking 4-step sequence
 */
export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion refs
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroScrollCueRef = useRef<HTMLDivElement>(null);
  const crisisMediaRef = useRef<HTMLDivElement>(null);
  const crisisContentRef = useRef<HTMLDivElement>(null);
  const dataMediaRef = useRef<HTMLDivElement>(null);
  const compositionMediaRef = useRef<HTMLDivElement>(null);
  const solusiMediaRef = useRef<HTMLDivElement>(null);
  const svgDesktopPathRef = useRef<SVGPathElement>(null);
  const svgMobilePathRef = useRef<SVGPathElement>(null);
  const gotongRoyongMediaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // ── US-303: Accessibility & Reduced Motion Handling ───────────
      if (prefersReducedMotion) {
        if (svgDesktopPathRef.current) {
          gsap.set(svgDesktopPathRef.current, { strokeDashoffset: 0 });
        }
        if (svgMobilePathRef.current) {
          gsap.set(svgMobilePathRef.current, { strokeDashoffset: 0 });
        }
        gsap.set(
          [
            '.crisis-eyebrow',
            '.crisis-stat',
            '.crisis-statement',
            '.crisis-source',
            '.data-metric-card',
            '.comp-row',
            '.comp-narrative',
            '.solusi-col',
            '.journey-step',
          ],
          { opacity: 1, y: 0, x: 0, scale: 1 }
        );
        return;
      }

      // ── 1. Hero Entrance & Camera Dolly Parallax ─────────────────
      if (heroContentRef.current) {
        gsap.from(heroContentRef.current.children, {
          opacity: 0,
          y: 32,
          stagger: 0.12,
          duration: 1.2,
          ease: 'power3.out',
        });
      }

      if (heroMediaRef.current) {
        gsap.fromTo(
          heroMediaRef.current,
          { scale: 1.12, yPercent: 0 },
          {
            scale: 1.0,
            yPercent: 16,
            ease: 'none',
            scrollTrigger: {
              trigger: heroContentRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }

      if (heroScrollCueRef.current) {
        gsap.to(heroScrollCueRef.current, {
          opacity: 0,
          y: 24,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: heroContentRef.current,
            start: 'top 20%',
            end: 'top -15%',
            scrub: true,
          },
        });
      }

      // ── 2. Crisis Scene Pinned Sequence (DESIGN.md §7.1) ─────────
      const crisisTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#krisis',
          start: 'top top',
          end: '+=110%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Background documentary excavator drift
      if (crisisMediaRef.current) {
        crisisTl.fromTo(
          crisisMediaRef.current,
          { scale: 1.05, y: -15 },
          { scale: 1.22, y: 15, ease: 'none' },
          0
        );
      }

      // Eyebrow -> Stat -> Statement -> Citation crossfade sequence
      crisisTl.fromTo(
        '.crisis-eyebrow',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.25 },
        0.05
      );

      crisisTl.fromTo(
        '.crisis-stat',
        { opacity: 0, scale: 0.88, y: 24 },
        { opacity: 1, scale: 1, y: 0, ease: 'power2.out', duration: 0.4 },
        0.2
      );

      crisisTl.fromTo(
        '.crisis-statement',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 },
        0.45
      );

      crisisTl.fromTo(
        '.crisis-source',
        { opacity: 0 },
        { opacity: 1, ease: 'power1.out', duration: 0.2 },
        0.75
      );

      // ── 3. Data Section Reveal & Multi-Plane Parallax ─────────────
      gsap.from('.data-header-block', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#data-nasional',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      const dataCards = gsap.utils.toArray<HTMLElement>('.data-metric-card');
      if (dataCards.length) {
        gsap.from(dataCards, {
          opacity: 0,
          y: 32,
          stagger: 0.12,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#data-nasional',
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        });

        // Layered multi-plane tactile parallax on scroll
        dataCards.forEach((card, idx) => {
          const shift = idx % 2 === 0 ? -10 : 10;
          gsap.to(card, {
            y: shift,
            ease: 'none',
            scrollTrigger: {
              trigger: '#data-nasional',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          });
        });
      }

      if (dataMediaRef.current) {
        gsap.fromTo(
          dataMediaRef.current,
          { y: -30, scale: 1.06 },
          {
            y: 30,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: '#data-nasional',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }

      // ── 4. Composition Rows & Proportional Progress Bars ──────────
      const compRows = gsap.utils.toArray<HTMLElement>('.comp-row');
      if (compRows.length) {
        gsap.from(compRows, {
          opacity: 0,
          x: -24,
          stagger: 0.08,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#komposisi',
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });

        // Animate proportional category bars
        const compBars = gsap.utils.toArray<HTMLElement>('.comp-progress-bar');
        compBars.forEach((bar) => {
          const targetWidth = bar.getAttribute('data-width') || '0%';
          gsap.fromTo(
            bar,
            { width: '0%' },
            {
              width: targetWidth,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '#komposisi',
                start: 'top 70%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }

      gsap.from('.comp-narrative', {
        opacity: 0,
        y: 28,
        duration: 0.85,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#komposisi',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      if (compositionMediaRef.current) {
        gsap.fromTo(
          compositionMediaRef.current,
          { y: -20, scale: 1.04 },
          {
            y: 20,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: '#komposisi',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }

      // ── 5. Editorial Solution Section Reveal (US-301) ─────────────
      gsap.from('.solusi-col', {
        opacity: 0,
        y: 32,
        stagger: 0.16,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#solusi',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      if (solusiMediaRef.current) {
        gsap.fromTo(
          solusiMediaRef.current,
          { y: -20, scale: 1.04 },
          {
            y: 20,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: '#solusi',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }

      // ── 6. 4-Step Journey & Scroll-Drawn SVG Line (US-302) ────────
      if (svgDesktopPathRef.current) {
        const desktopLength = svgDesktopPathRef.current.getTotalLength();
        gsap.set(svgDesktopPathRef.current, {
          strokeDasharray: desktopLength,
          strokeDashoffset: desktopLength,
        });
        gsap.to(svgDesktopPathRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#alur',
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 1,
          },
        });
      }

      if (svgMobilePathRef.current) {
        const mobileLength = svgMobilePathRef.current.getTotalLength();
        gsap.set(svgMobilePathRef.current, {
          strokeDasharray: mobileLength,
          strokeDashoffset: mobileLength,
        });
        gsap.to(svgMobilePathRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#alur',
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 1,
          },
        });
      }

      const journeySteps = gsap.utils.toArray<HTMLElement>('.journey-step');
      if (journeySteps.length) {
        gsap.fromTo(
          journeySteps,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#alur',
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Ensure ScrollTrigger accurately calculates positions after DOM layout
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);

      window.addEventListener('load', () => ScrollTrigger.refresh());

      if (gotongRoyongMediaRef.current) {
        gsap.fromTo(
          gotongRoyongMediaRef.current,
          { y: -20, scale: 1.04 },
          {
            y: 20,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: '#action-banner',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden bg-[#FAF8F5] text-[#14140F]">
      {/* Editorial Sticky Navbar with Lenis smooth anchor gliding */}
      <Navbar />

      {/* ── 1. Hero Section (Clean, Luminous Editorial Canvas) ─────── */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center px-6 text-center overflow-hidden pt-32 pb-24 border-b border-stone-200">
        {/* Daylight documentary background: Panorama TPST Bantar Gebang */}
        <ImageOverlay
          mediaRef={heroMediaRef}
          src="https://upload.wikimedia.org/wikipedia/commons/8/84/Bantar_Gebang.JPG"
          alt="Panorama Tempat Pengolahan Sampah Terpadu (TPST) Bantargebang Bekasi"
          intensity="light"
          priority={true}
        />

        {/* Hero editorial content */}
        <div ref={heroContentRef} className="relative z-10 max-w-4xl mx-auto space-y-8">
          <p className="text-xs font-medium tracking-wide text-[#7C8574] font-sans">
            Dokumentasi &amp; Platform Bank Sampah Indonesia
          </p>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-extrabold tracking-tight text-[#0B3D26] leading-[1.06]">
            <span>Sampah tidak pernah hilang.</span>
            <span className="block text-[#1F6B3F] font-light italic mt-2">
              Ia hanya pindah tempat.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-stone-700 font-normal leading-relaxed">
            Setiap kilogram yang dibuang meninggalkan jejak di daratan Indonesia. Saatnya mencatat, menimbang, dan mengubahnya menjadi nilai sirkular yang transparan.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-[4px] bg-[#0B3D26] px-8 py-3.5 text-sm font-medium text-white hover:bg-[#1F6B3F] active:translate-y-0.5 transition-colors"
            >
              Mulai Setor Sampah
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-[4px] border border-stone-300 bg-white/90 px-8 py-3.5 text-sm font-medium text-stone-800 hover:bg-stone-50 hover:border-stone-400 active:translate-y-0.5 transition-colors"
            >
              Masuk ke Portal
            </Link>
          </div>
        </div>

        {/* Minimal Scroll Cue */}
        <div
          ref={heroScrollCueRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60 pointer-events-none"
        >
          <span className="text-xs text-[#7C8574] font-sans">
            Gulir untuk memahami krisis
          </span>
          <div className="w-[1px] h-6 bg-[#0B3D26]/40" />
        </div>
      </section>

      {/* ── 2. Crisis Scene (Signature Pinned Documentary Scene - DESIGN.md §7.1) ─ */}
      <section
        id="krisis"
        className="relative min-h-screen w-full flex items-center justify-center px-6 py-24 overflow-hidden bg-[#14140F] text-[#F1ECDF]"
      >
        <ImageOverlay
          mediaRef={crisisMediaRef}
          src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Mountain_of_garbage_in_Bantar_Gebang_with_some_excavator.jpg"
          alt="Gunungan sampah raksasa TPST Bantar Gebang dengan ekskavator"
          intensity="deep"
        />

        <div ref={crisisContentRef} className="relative z-10 max-w-3xl mx-auto text-center space-y-6 px-4">
          <p className="crisis-eyebrow text-xs font-mono tracking-widest text-[#7C8574]">
            Proyeksi Nasional 2026
          </p>

          <p className="crisis-stat font-display text-6xl sm:text-7xl md:text-8xl lg:text-[100px] font-bold tracking-tight text-[#C1441F] leading-none will-change-transform">
            51,8 juta ton
          </p>

          <div className="crisis-statement space-y-3 max-w-xl mx-auto">
            <p className="text-xl sm:text-2xl text-[#F1ECDF] font-light leading-snug">
              proyeksi timbulan sampah nasional tahun 2026.
            </p>
            <p className="text-base text-[#F1ECDF]/70 leading-relaxed">
              Lebih dari 75% di antaranya berakhir tidak terkelola dengan baik — menumpuk di saluran air, jurang terbuka, dan menggunung di tempat pembuangan akhir.
            </p>
          </div>

          <p className="crisis-source pt-4 text-xs text-[#7C8574] font-mono">
            Rujukan data: Kementerian Lingkungan Hidup / ANTARA News (2026)
          </p>
        </div>
      </section>

      {/* ── 3. Asymmetric Section: Realita & Data Nasional ──────────── */}
      <section id="data-nasional" className="relative py-32 px-6 bg-[#FAF8F5] border-t border-stone-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left: Editorial narrative & clean metric list */}
          <div className="lg:col-span-7 space-y-10">
            <div className="data-header-block space-y-3">
              <p className="text-xs font-semibold text-[#1F6B3F] tracking-wide">
                Realitas TPA Indonesia
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B3D26] leading-tight">
                Gunungan Nyata di Depan Mata Kita.
              </h2>
              <p className="text-lg text-stone-700 leading-relaxed max-w-xl">
                Bukan sekadar angka statistik. Di kota-kota besar Indonesia, tempat pembuangan akhir telah melampaui batas tampung kritis.
              </p>
            </div>

            {/* Clean metric grid — 1px hairlines, 4px radius, subtle multi-plane parallax */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="data-metric-card border border-stone-200 bg-white p-6 rounded-[4px] space-y-2 will-change-transform shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <p className="font-display text-4xl font-bold text-[#C1441F]">
                  35,8%
                </p>
                <p className="text-sm font-semibold text-stone-900">
                  Sampah Tidak Terkelola
                </p>
                <p className="text-xs text-[#7C8574] leading-relaxed">
                  Sekitar 11 juta metrik ton per tahun terbuang ke perairan, drainase terbuka, dan dibakar tanpa penyaringan (BRIN / Mongabay).
                </p>
              </div>

              <div className="data-metric-card border border-stone-200 bg-white p-6 rounded-[4px] space-y-2 will-change-transform shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <p className="font-display text-4xl font-bold text-[#0B3D26]">
                  7.500+ <span className="text-base font-normal text-[#7C8574]">ton/hari</span>
                </p>
                <p className="text-sm font-semibold text-stone-900">
                  Beban TPST Bantar Gebang
                </p>
                <p className="text-xs text-[#7C8574] leading-relaxed">
                  Gunungan sampah setinggi &gt;45 meter menampung limpasan metropolitan Jakarta setiap 24 jam.
                </p>
              </div>

              <div className="data-metric-card border border-stone-200 bg-white p-6 rounded-[4px] space-y-2 will-change-transform shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <p className="font-display text-4xl font-bold text-[#0B3D26]">
                  55%
                </p>
                <p className="text-sm font-semibold text-stone-900">
                  Konsentrasi di Pulau Jawa
                </p>
                <p className="text-xs text-[#7C8574] leading-relaxed">
                  Lebih dari separuh volume sampah nasional terpusat di kawasan urban pulau terpadat di Indonesia.
                </p>
              </div>

              <div className="data-metric-card border border-stone-200 bg-white p-6 rounded-[4px] space-y-2 will-change-transform shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <p className="font-display text-4xl font-bold text-[#1F6B3F]">
                  12.000+
                </p>
                <p className="text-sm font-semibold text-stone-900">
                  Unit Bank Sampah Indonesia
                </p>
                <p className="text-xs text-[#7C8574] leading-relaxed">
                  Potensi akar rumput yang siap bertransformasi dengan pencatatan digital dan timbangan terintegrasi.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Clean documentary photo frame — 0px radius per DESIGN.md §5 */}
          <div className="lg:col-span-5">
            <div
              ref={dataMediaRef}
              className="relative overflow-hidden border border-stone-300 bg-stone-100 will-change-transform shadow-sm"
            >
              <div className="relative w-full h-[460px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/2/22/A_mountain_of_rubbish_at_Bantar_Gebang.JPG"
                  alt="Timbunan limbah di TPST Bantargebang, Bekasi"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover filter saturate-[0.85] contrast-[1.05]"
                />
              </div>
              <div className="p-4 bg-white border-t border-stone-200 relative z-10">
                <p className="text-xs font-semibold text-stone-900">
                  TPST Bantargebang, Jawa Barat
                </p>
                <p className="text-xs text-[#7C8574] mt-0.5">
                  Dokumentasi lereng timbunan terbuka menuntut intervensi pemilahan sejak dari hulu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Asymmetric Section: Komposisi Jenis Sampah ──────────── */}
      <section id="komposisi" className="relative py-32 px-6 bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left: Canonical Material Categories with Dynamic Proportion Bars */}
          <div className="lg:col-span-6 space-y-3 order-2 lg:order-1">
            {/* Organik */}
            <div className="comp-row border-l-4 border-l-[#B8873A] border-y border-r border-stone-200 bg-[#FAF8F5] p-5 rounded-[4px] flex flex-col justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-stone-900">Sisa Makanan &amp; Organik</p>
                  <p className="text-xs text-[#7C8574]">Membusuk cepat dan berpotensi memicu gas metana</p>
                </div>
                <p className="font-display text-2xl font-bold text-stone-900 shrink-0 ml-4">41,2%</p>
              </div>
              <div className="w-full h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
                <div
                  className="comp-progress-bar h-full bg-[#B8873A] rounded-full will-change-[width]"
                  data-width="41.2%"
                  style={{ width: '0%' }}
                />
              </div>
            </div>

            {/* Plastik */}
            <div className="comp-row border-l-4 border-l-[#2F7DB8] border-y border-r border-stone-200 bg-[#FAF8F5] p-5 rounded-[4px] flex flex-col justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-stone-900">Plastik (Semua Jenis)</p>
                  <p className="text-xs text-[#7C8574]">Botol PET, kantong kresek, wadah kemasan fleksibel</p>
                </div>
                <p className="font-display text-2xl font-bold text-[#2F7DB8] shrink-0 ml-4">18,5%</p>
              </div>
              <div className="w-full h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
                <div
                  className="comp-progress-bar h-full bg-[#2F7DB8] rounded-full will-change-[width]"
                  data-width="18.5%"
                  style={{ width: '0%' }}
                />
              </div>
            </div>

            {/* Kertas */}
            <div className="comp-row border-l-4 border-l-[#B8873A] border-y border-r border-stone-200 bg-[#FAF8F5] p-5 rounded-[4px] flex flex-col justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-stone-900">Kertas &amp; Karton</p>
                  <p className="text-xs text-[#7C8574]">Kardus kemasan, kertas arsip, karton dupleks</p>
                </div>
                <p className="font-display text-2xl font-bold text-[#B8873A] shrink-0 ml-4">11,1%</p>
              </div>
              <div className="w-full h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
                <div
                  className="comp-progress-bar h-full bg-[#B8873A] rounded-full will-change-[width]"
                  data-width="11.1%"
                  style={{ width: '0%' }}
                />
              </div>
            </div>

            {/* Logam */}
            <div className="comp-row border-l-4 border-l-[#8A94A0] border-y border-r border-stone-200 bg-[#FAF8F5] p-5 rounded-[4px] flex flex-col justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-stone-900">Logam &amp; Kaleng</p>
                  <p className="text-xs text-[#7C8574]">Besi, aluminium, kaleng minuman berdaya daur tinggi</p>
                </div>
                <p className="font-display text-2xl font-bold text-[#8A94A0] shrink-0 ml-4">6,4%</p>
              </div>
              <div className="w-full h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
                <div
                  className="comp-progress-bar h-full bg-[#8A94A0] rounded-full will-change-[width]"
                  data-width="6.4%"
                  style={{ width: '0%' }}
                />
              </div>
            </div>

            {/* Kaca */}
            <div className="comp-row border-l-4 border-l-[#4FA6A0] border-y border-r border-stone-200 bg-[#FAF8F5] p-5 rounded-[4px] flex flex-col justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-stone-900">Kaca &amp; Beling</p>
                  <p className="text-xs text-[#7C8574]">Botol kaca utuh dan pecahan terpilah tanpa degradasi mutu</p>
                </div>
                <p className="font-display text-2xl font-bold text-[#4FA6A0] shrink-0 ml-4">4,4%</p>
              </div>
              <div className="w-full h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
                <div
                  className="comp-progress-bar h-full bg-[#4FA6A0] rounded-full will-change-[width]"
                  data-width="4.4%"
                  style={{ width: '0%' }}
                />
              </div>
            </div>
          </div>

          {/* Right: Editorial Argument & Clean Photo Frame */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="comp-narrative space-y-3">
              <p className="text-xs font-semibold text-[#1F6B3F] tracking-wide">
                Komposisi &amp; Sirkularitas
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B3D26] leading-tight">
                Bukan Sekadar Sampah, Tetapi Material Bernilai.
              </h2>
              <p className="text-lg text-stone-700 leading-relaxed">
                Jika dipilah sejak dari rumah tangga, lebih dari 40% timbulan sampah anorganik memiliki nilai ekonomis riil di industri daur ulang.
              </p>
              <p className="text-sm text-[#7C8574] leading-relaxed">
                Hambatan utamanya adalah ketiadaan sistem penimbangan yang transparan dan pencatatan manual yang rentan selisih. Hijauin menyediakan standar digital bagi unit bank sampah di seluruh Indonesia.
              </p>
            </div>

            <div
              ref={compositionMediaRef}
              className="relative overflow-hidden border border-stone-200 bg-stone-100 shadow-sm will-change-transform"
            >
              <div className="relative w-full h-[260px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/1/17/Green_TPST_%28Tempat_Pengolahan_Sampah_Terpadu%29%2C_Bantargebang%2C_Kota_Bekasi%2C_Jawa_Barat_-_panoramio.jpg"
                  alt="Fasilitas Green TPST Bantargebang Jawa Barat"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover filter saturate-[0.85] contrast-[1.05]"
                />
              </div>
              <div className="p-3 bg-white border-t border-stone-200 relative z-10">
                <p className="text-xs text-[#7C8574]">
                  Fasilitas pengolahan terpadu TPST Bantargebang, Kota Bekasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Editorial Solution Section (Asymmetric Two-Column Magazine Grid - US-301) ── */}
      <section
        id="solusi"
        className="relative py-32 px-6 bg-[#FAF8F5] text-[#0B3D26] border-t border-stone-200 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Column (5 cols): Clean Documentary Photo Frame */}
            <div className="solusi-col lg:col-span-5">
              {/* Clean documentary photo frame — 0px radius per DESIGN.md §5 */}
              <div
                ref={solusiMediaRef}
                className="relative overflow-hidden border border-stone-300 bg-stone-100 shadow-sm will-change-transform"
              >
                <div className="relative w-full h-[380px] sm:h-[440px]">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/7/77/Gotong_Royong_Membersihkan_Sungai.jpg"
                    alt="Inisiatif gotong royong pemilahan sampah warga Indonesia"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover filter saturate-[0.9] contrast-[1.05]"
                  />
                </div>
                <div className="p-4 bg-white border-t border-stone-200">
                  <p className="text-xs font-semibold text-[#0B3D26]">
                    Aksi Komunitas Akar Rumput
                  </p>
                  <p className="text-xs text-[#7C8574] mt-0.5">
                    Pemilahan sejak sumber di tingkat rukun warga memutus rantai timbunan terbuka.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Editorial Narrative (max 68ch) */}
            <div className="solusi-col lg:col-span-7 space-y-6 lg:pl-4">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#1F6B3F] tracking-wide">
                  Solusi Berkelanjutan
                </p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-[#0B3D26] leading-tight">
                  Bank sampah digital membuat setiap kilogram bisa dilacak — dari setoran sampai poin.
                </h2>
              </div>

              {/* Narrative body in crisp humanist grotesk, strictly max 68ch and compact */}
              <div className="max-w-[64ch] text-base text-stone-700 leading-relaxed font-sans">
                <p>
                  Krisis sampah tidak selesai di TPA. Hijauin mendigitalkan operasional bank sampah di tingkat rukun warga: menimbang dengan kalkulasi otomatis, menyalurkan poin nasabah secara instan, dan memverifikasi data material untuk pasokan industri daur ulang nasional.
                </p>
              </div>

              {/* Three Pillars — Minimal Hairline Grid with Growth Accents */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5 border-t border-stone-200">
                <div className="space-y-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#4FA65C]" />
                  <p className="text-sm font-semibold text-[#0B3D26]">Timbangan Presisi</p>
                  <p className="text-xs text-[#7C8574] leading-relaxed">
                    Konversi berat ke poin tanpa risiko selisih hitung.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#4FA65C]" />
                  <p className="text-sm font-semibold text-[#0B3D26]">Rekening Digital</p>
                  <p className="text-xs text-[#7C8574] leading-relaxed">
                    Pantau saldo poin dan riwayat setoran secara real-time.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#4FA65C]" />
                  <p className="text-sm font-semibold text-[#0B3D26]">Jejak Sirkular</p>
                  <p className="text-xs text-[#7C8574] leading-relaxed">
                    Data terverifikasi untuk disalurkan ke mitra daur ulang.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="rounded-[4px] bg-[#0B3D26] px-7 py-3 text-sm font-medium text-white hover:bg-[#1F6B3F] active:translate-y-0.5 transition-colors shadow-sm"
                >
                  Daftar Jadi Nasabah
                </Link>
                <Link
                  href="/login"
                  className="rounded-[4px] border border-stone-300 bg-white px-7 py-3 text-sm font-medium text-stone-800 hover:bg-stone-50 active:translate-y-0.5 transition-colors"
                >
                  Buka Portal Unit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. 4-Step Nasabah Journey with Scroll-Drawn SVG Line (US-302) ── */}
      <section id="alur" className="relative py-32 px-6 bg-white text-[#0B3D26] border-t border-stone-200">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold text-[#1F6B3F] tracking-wide">
              Cara Kerja
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B3D26]">
              Alur Penyetoran Sampah Digital
            </h2>
            <p className="text-base text-stone-600 leading-relaxed font-sans">
              Empat tahapan terpadu dari pemilahan di rumah tangga hingga penukaran poin bernilai riil. Transparan, terukur, dan tercatat otomatis di sistem digital.
            </p>
          </div>

          {/* 4-Step Journey Grid with Dynamic SVG Connecting Line */}
          <div className="relative">
            {/* Desktop Horizontal Connecting SVG Line (Scrubbed on Scroll) */}
            <div className="hidden lg:block absolute top-[34px] left-[12%] right-[12%] h-[20px] z-0 pointer-events-none">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 1000 20"
                fill="none"
                preserveAspectRatio="none"
              >
                {/* Background static track */}
                <path
                  d="M 0 10 L 1000 10"
                  stroke="#E7E5E4"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
                {/* Dynamic scrubbed green stroke */}
                <path
                  ref={svgDesktopPathRef}
                  d="M 0 10 L 1000 10"
                  stroke="#0B3D26"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Mobile Vertical Connecting SVG Line (Scrubbed on Scroll) */}
            <div className="block lg:hidden absolute top-[40px] bottom-[40px] left-[32px] w-[16px] z-0 pointer-events-none">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 16 1000"
                fill="none"
                preserveAspectRatio="none"
              >
                {/* Background static track */}
                <path
                  d="M 8 0 L 8 1000"
                  stroke="#E7E5E4"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
                {/* Dynamic scrubbed green stroke */}
                <path
                  ref={svgMobilePathRef}
                  d="M 8 0 L 8 1000"
                  stroke="#0B3D26"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Responsive 4-Step Grid: Horizontal on Desktop, Stacked on Mobile */}
            <div id="alur-steps-grid" className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
              {/* Step 1: Setor */}
              <div className="journey-step border border-stone-200 bg-[#FAF8F5] p-6 rounded-[4px] space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all hover:border-[#0B3D26]/40 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#0B3D26] bg-[#0B3D26]/10 px-2 py-0.5 rounded-[3px]">
                      01
                    </span>
                    <span className="text-[11px] font-medium text-[#1F6B3F]">Tahap Awal</span>
                  </div>
                  <h3 className="text-base font-semibold text-stone-900">Pilah di Rumah</h3>
                  <p className="text-xs text-[#7C8574] leading-relaxed">
                    Pilah sampah anorganik Anda menjadi empat kategori utama: plastik, kertas, logam, atau kaca. Bawa setoran ke unit bank sampah terdekat.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-stone-500 font-mono border-t border-stone-200/70">
                  Langkah 1 dari 4
                </div>
              </div>

              {/* Step 2: Verifikasi */}
              <div className="journey-step border border-stone-200 bg-[#FAF8F5] p-6 rounded-[4px] space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all hover:border-[#0B3D26]/40 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#0B3D26] bg-[#0B3D26]/10 px-2 py-0.5 rounded-[3px]">
                      02
                    </span>
                    <span className="text-[11px] font-medium text-[#1F6B3F]">Verifikasi Riil</span>
                  </div>
                  <h3 className="text-base font-semibold text-stone-900">Timbang &amp; Verifikasi</h3>
                  <p className="text-xs text-[#7C8574] leading-relaxed">
                    Petugas unit menimbang berat riil per material. Sistem Hijauin memvalidasi kategori dan mengkalkulasi bobot timbangan secara langsung.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-stone-500 font-mono border-t border-stone-200/70">
                  Langkah 2 dari 4
                </div>
              </div>

              {/* Step 3: Poin */}
              <div className="journey-step border border-stone-200 bg-[#FAF8F5] p-6 rounded-[4px] space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all hover:border-[#0B3D26]/40 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#0B3D26] bg-[#0B3D26]/10 px-2 py-0.5 rounded-[3px]">
                      03
                    </span>
                    <span className="text-[11px] font-medium text-[#1F6B3F]">Terkreditasi</span>
                  </div>
                  <h3 className="text-base font-semibold text-stone-900">Poin Terkreditasi</h3>
                  <p className="text-xs text-[#7C8574] leading-relaxed">
                    Saldo poin dan rupiah otomatis dikreditkan ke akun digital nasabah. Notifikasi dan riwayat mutasi tercatat tanpa butuh nota manual.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-stone-500 font-mono border-t border-stone-200/70">
                  Langkah 3 dari 4
                </div>
              </div>

              {/* Step 4: Tukar (Leads directly into Action: US-302) */}
              <div className="journey-step border border-[#0B3D26]/30 bg-white p-6 rounded-[4px] space-y-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all hover:border-[#0B3D26] flex flex-col justify-between ring-1 ring-[#0B3D26]/10">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-white bg-[#0B3D26] px-2 py-0.5 rounded-[3px]">
                      04
                    </span>
                    <span className="text-[11px] font-semibold text-[#1F6B3F]">Aksi &amp; Hadiah</span>
                  </div>
                  <h3 className="text-base font-semibold text-stone-900">Tukar Hadiah &amp; Saldo</h3>
                  <p className="text-xs text-[#7C8574] leading-relaxed">
                    Tukarkan poin dengan sembako, tabungan tunai, voucher, atau hadiah lingkungan yang disediakan oleh unit bank sampah Anda.
                  </p>
                </div>

                {/* Direct Action Triggers (US-302 Acceptance Criteria) */}
                <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                  <Link
                    href="/register"
                    className="w-full text-center rounded-[4px] bg-[#0B3D26] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#1F6B3F] active:translate-y-0.5 transition-colors shadow-sm"
                  >
                    Daftar Jadi Nasabah
                  </Link>
                  <Link
                    href="/login"
                    className="w-full text-center rounded-[4px] border border-stone-300 bg-[#FAF8F5] px-4 py-2 text-xs font-medium text-stone-800 hover:bg-stone-100 active:translate-y-0.5 transition-colors"
                  >
                    Masuk ke Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Action Banner with Gotong Royong photo — 4px radius */}
          <div
            id="action-banner"
            className="relative rounded-[4px] bg-[#0B3D26] text-[#F1ECDF] p-8 md:p-12 overflow-hidden border border-stone-200 shadow-sm"
          >
            <div
              ref={gotongRoyongMediaRef}
              className="absolute inset-0 opacity-20 pointer-events-none will-change-transform"
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/77/Gotong_Royong_Membersihkan_Sungai.jpg"
                alt="Aksi gotong royong warga Indonesia memilah sampah"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h3 className="font-display text-2xl font-bold text-white">
                  Siap berkontribusi untuk lingkungan yang lebih bersih?
                </h3>
                <p className="text-xs text-[#F1ECDF]/80 leading-relaxed">
                  Daftar sekarang sebagai nasabah atau kelola unit bank sampah Anda dengan platform digital Hijauin.
                </p>
              </div>
              <Link
                href="/register"
                className="rounded-[4px] bg-white px-7 py-3 text-sm font-medium text-[#0B3D26] hover:bg-stone-100 active:translate-y-0.5 transition-colors shrink-0 shadow-sm"
              >
                Mulai Setor Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Clean Editorial Footer with Logo ─────────────────────── */}
      <footer className="bg-white text-stone-800 py-16 px-6 border-t border-stone-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="space-y-4 max-w-sm">
            <Link href="/" className="inline-block py-1">
              <Image
                src="/assets/images/logo.png"
                alt="Hijauin"
                width={177}
                height={78}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-[#7C8574] leading-relaxed">
              Platform multi-tenant digitalisasi bank sampah Indonesia. Mengubah timbulan sampah perkotaan menjadi nilai sirkular yang terdata.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 text-sm text-stone-700">
            <div className="space-y-3">
              <p className="font-semibold text-stone-900 text-xs tracking-wider">Navigasi</p>
              <ul className="space-y-2 text-xs text-[#7C8574]">
                <li><a href="#krisis" className="hover:text-[#0B3D26] transition-colors">Krisis Sampah</a></li>
                <li><a href="#data-nasional" className="hover:text-[#0B3D26] transition-colors">Data Nasional</a></li>
                <li><a href="#komposisi" className="hover:text-[#0B3D26] transition-colors">Komposisi Sampah</a></li>
                <li><a href="#solusi" className="hover:text-[#0B3D26] transition-colors">Solusi Digital</a></li>
                <li><a href="#alur" className="hover:text-[#0B3D26] transition-colors">Alur Penyetoran</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-stone-900 text-xs tracking-wider">Aplikasi</p>
              <ul className="space-y-2 text-xs text-[#7C8574]">
                <li><Link href="/login" className="hover:text-[#0B3D26] transition-colors">Masuk Akun</Link></li>
                <li><Link href="/register" className="hover:text-[#0B3D26] transition-colors">Daftar Nasabah</Link></li>
                <li><Link href="/login" className="hover:text-[#0B3D26] transition-colors">Portal Admin Unit</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 mt-12 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7C8574] gap-4">
          <p>© 2026 Hijauin Platform. Mengacu pada data resmi KLH / SIPSN &amp; BRIN.</p>
          <p>Mendukung target Indonesia Bebas Sampah.</p>
        </div>
      </footer>
    </div>
  );
}
