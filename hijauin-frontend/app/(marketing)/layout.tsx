import { LenisProvider } from '@/components/marketing/LenisProvider';

/**
 * Marketing site layout — cinematic/awareness site (DESIGN.md).
 * Uses Lenis smooth scroll + GSAP ScrollTrigger for motion.
 * Product UI (nasabah/admin) does NOT use this layout.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <div className="min-h-screen bg-[#14140F]">
        {children}
      </div>
    </LenisProvider>
  );
}
