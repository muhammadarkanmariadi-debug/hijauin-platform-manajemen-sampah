'use client';

import React from 'react';
import Image from 'next/image';

interface ImageOverlayProps {
  /** Optional custom background image URL. Falls back to atmospheric dusk photography gradient. */
  src?: string;
  alt?: string;
  /** Controls darkness level of the vignette overlay */
  intensity?: 'light' | 'subtle' | 'dusk' | 'deep' | 'emerald';
  /** Additional container classes */
  className?: string;
  /** Ref for GSAP scale/parallax animation */
  mediaRef?: React.RefObject<HTMLDivElement | null>;
  /** Next.js image priority for LCP optimization */
  priority?: boolean;
  children?: React.ReactNode;
}

/**
 * Atmospheric background overlay for cinematic & editorial sections (DESIGN.md §7.3).
 *
 * Provides:
 * - High-contrast photographic backdrop
 * - Multi-stop dark radial & linear vignettes in `--void-900` (#14140F), emerald, or light ivory
 * - Lightweight SVG film-grain noise texture
 * - Absolute positioning to sit behind text without obscuring legibility
 */
export function ImageOverlay({
  src,
  alt = 'Dokumentasi TPST Bantargebang dan pengelolaan sampah Indonesia',
  intensity = 'dusk',
  className = '',
  mediaRef,
  priority = false,
  children,
}: ImageOverlayProps) {
  // Vignette intensity presets
  const vignetteClasses = {
    light: 'from-[#FAF8F5]/90 via-[#FAF8F5]/80 to-[#FAF8F5]',
    subtle: 'from-[#14140F]/60 via-[#14140F]/30 to-[#14140F]/80',
    dusk: 'from-[#14140F]/85 via-[#14140F]/50 to-[#14140F]',
    deep: 'from-[#14140F]/95 via-[#14140F]/70 to-[#14140F]',
    emerald: 'from-[#0B3D26]/90 via-[#0B3D26]/80 to-[#072417]',
  }[intensity];

  const imageFilterClass = {
    light: 'object-cover object-center filter saturate-[0.8] brightness-[0.95] contrast-[1.05] opacity-35',
    subtle: 'object-cover object-center filter saturate-[0.7] brightness-[0.65] contrast-[1.15]',
    dusk: 'object-cover object-center filter saturate-[0.7] brightness-[0.65] contrast-[1.15]',
    deep: 'object-cover object-center filter saturate-[0.7] brightness-[0.6] contrast-[1.2]',
    emerald: 'object-cover object-center filter saturate-[0.8] brightness-[0.65] contrast-[1.15] opacity-40',
  }[intensity];

  return (
    <div className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}>
      {/* Animated / transformable media container */}
      <div ref={mediaRef} className="absolute inset-0 w-full h-full will-change-transform">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            className={imageFilterClass}
          />
        ) : (
          /* Atmospheric documentary landscape fallback (dusk landfill dunes & haze) */
          <div className="w-full h-full bg-[#14140F   ]">
            {/* Atmospheric dusk mountain/waste slope contours */}
            <svg
              viewBox="0 0 1440 900"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full object-cover opacity-35"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="slopeGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2A3026" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#14140F" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="slopeGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1F241C" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0D0D0A" stopOpacity="1" />
                </linearGradient>
                <radialGradient id="hazeGlow" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#3E4738" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#14140F" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Distant atmospheric glow */}
              <rect width="1440" height="900" fill="url(#hazeGlow)" />

              {/* Background mountain / landfill silhouette */}
              <path
                d="M-50 480 Q 280 360, 600 420 T 1200 370 Q 1380 390, 1500 440 L 1500 950 L -50 950 Z"
                fill="url(#slopeGrad1)"
              />

              {/* Midground landfill slope */}
              <path
                d="M-50 560 Q 220 490, 520 540 T 1080 490 Q 1320 520, 1500 570 L 1500 950 L -50 950 Z"
                fill="url(#slopeGrad2)"
              />

              {/* Foreground dark contour */}
              <path
                d="M-50 680 Q 340 620, 720 670 T 1500 660 L 1500 950 L -50 950 Z"
                fill="#0F0F0B"
                fillOpacity="0.95"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Radial vignette */}
      {intensity === 'light' && (
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,248,245,0.72)_0%,rgba(250,248,245,0.92)_70%,#FAF8F5_100%)]"
          aria-hidden="true"
        />
      )}
      {intensity === 'emerald' && (
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,61,38,0.35)_0%,rgba(11,61,38,0.85)_75%,#072417_100%)]"
          aria-hidden="true"
        />
      )}
      {intensity !== 'light' && intensity !== 'emerald' && (
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,20,15,0.25)_0%,rgba(20,20,15,0.85)_75%,#14140F_100%)]"
          aria-hidden="true"
        />
      )}

      {/* Linear top & bottom fade */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${vignetteClasses}`}
        aria-hidden="true"
      />

      {/* Film grain noise overlay (subtle tactile documentary texture) */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Optional custom nested children */}
      {children}
    </div>
  );
}
