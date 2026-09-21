'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let globalLenis: Lenis | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

/**
 * Access the global Lenis instance directly (useful in non-hook callbacks).
 */
export function getLenis(): Lenis | null {
  return globalLenis;
}

/**
 * Hook to access the Lenis smooth-scroll instance anywhere in the marketing tree.
 * Uses useSyncExternalStore for strict React 19 concurrent safety without cascading renders.
 */
export function useLenis(): Lenis | null {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    },
    () => globalLenis,
    () => null
  );
}

/**
 * Lenis smooth scroll provider for the cinematic marketing site.
 *
 * - Synced to GSAP ticker (DESIGN.md §7.2)
 * - Duration/easing tuned for slow camera-dolly feel
 * - Disabled entirely when prefers-reduced-motion is set
 * - Properly cleans up ticker listener on unmount to prevent leaks
 *
 * Only used by (marketing) layout — product UI does NOT use this.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Respect prefers-reduced-motion — fall back to native scroll
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenisInstance = new Lenis({
      duration: 1.2,        // Slow camera dolly feel (DESIGN.md §7.2)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo-like
      touchMultiplier: 1.8,
    });

    globalLenis = lenisInstance;
    notifyListeners();

    // Sync Lenis with GSAP ticker — single rAF loop
    lenisInstance.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenisInstance.destroy();
      globalLenis = null;
      notifyListeners();
    };
  }, []);

  return <>{children}</>;
}
