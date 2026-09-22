'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, isAdminOrOps } from '@/lib/auth';

/**
 * Editorial Nasabah Dashboard Layout.
 *
 * Conforms strictly to docs/DESIGN.md §8:
 * - Color tokens: --forest-950 (#0B3D26), --bone-100, --stone-200 hairlines
 * - Predictable, fast, low-motion product layout (150-200ms transitions)
 * - Sharp brand identity with official logo
 * - Responsive mobile drawer
 */
export default function NasabahLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, refreshUser, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (isAdminOrOps(user)) {
        router.push('/admin/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#0B3D26] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-[#7C8574]">Memuat portal nasabah...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || isAdminOrOps(user)) return null;

  const unitName =
    user?.nasabah_profile?.unit?.nama ||
    user?.user_roles?.[0]?.unit?.nama ||
    'Bank Sampah Digital';

  const navItems = [
    {
      href: '/dashboard',
      label: 'Ringkasan',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/setorans',
      label: 'Setoran Saya',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      href: '/penukarans',
      label: 'Tukar Poin',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: '/profil',
      label: 'Profil Akun',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] text-stone-900 font-sans">
      {/* ── Desktop Sidebar ─────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-stone-200 bg-white shadow-[1px_0_3px_rgba(0,0,0,0.01)] shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-stone-100 space-y-3">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/images/logo.png"
                alt="Hijauin"
                width={140}
                height={62}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4FA65C]" />
              <p className="text-[11px] font-semibold text-[#1F6B3F] tracking-wide uppercase">
                Portal Nasabah
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[4px] text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#0B3D26] text-white shadow-sm font-semibold'
                      : 'text-stone-700 hover:bg-stone-100/80 hover:text-stone-900'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-stone-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Bottom */}
        <div className="p-4 border-t border-stone-100 bg-[#FAF8F5]/80 space-y-3">
          <div className="flex items-center gap-3">
            {user?.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photo_url}
                alt={user.full_name}
                className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#0B3D26] text-[#F1ECDF] flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                {user?.full_name?.slice(0, 2).toUpperCase() || 'NA'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-stone-900 truncate">
                {user?.full_name}
              </p>
              <p className="text-[11px] text-[#7C8574] truncate">
                {unitName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-[4px] border border-stone-200 bg-white py-2 text-xs font-medium text-stone-600 hover:text-[#C1441F] hover:border-red-200 transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar Portal</span>
          </button>
        </div>
      </aside>

      {/* ── Main Canvas ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-white/90 backdrop-blur-md px-6 py-3.5">
          <div className="flex items-center gap-4">
            {/* Mobile Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-1.5 rounded-[4px] border border-stone-200 text-stone-700 hover:bg-stone-50"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <p className="text-xs text-[#7C8574] hidden sm:block">
                {formattedDate}
              </p>
              <p className="text-xs font-semibold text-[#0B3D26] truncate max-w-[200px] sm:max-w-none">
                {unitName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/setorans"
              className="flex items-center gap-1.5 rounded-[4px] bg-[#0B3D26] px-3.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#1F6B3F] active:translate-y-0.5 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Setor Sampah</span>
            </Link>

            <Link
              href="/penukarans"
              className="hidden sm:flex items-center gap-1.5 rounded-[4px] border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-50 active:translate-y-0.5 transition-colors"
            >
              <span>Tukar Poin</span>
            </Link>
          </div>
        </header>

        {/* Page Content with Framer Motion Transition */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto"
        >
          {children}
        </motion.main>
      </div>

      {/* ── Mobile Drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-64 max-w-[80vw] bg-white h-full flex flex-col justify-between z-10 shadow-2xl"
            >
              <div>
                <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                  <Image
                    src="/assets/images/logo.png"
                    alt="Hijauin"
                    width={120}
                    height={53}
                    className="h-7 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-700"
                  >
                    ✕
                  </button>
                </div>

                <nav className="p-4 space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-xs font-medium ${
                          isActive
                            ? 'bg-[#0B3D26] text-white font-semibold'
                            : 'text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 border-t border-stone-100 bg-[#FAF8F5] space-y-2">
                <p className="text-xs font-semibold text-stone-900 truncate">
                  {user?.full_name}
                </p>
                <p className="text-[11px] text-[#7C8574] truncate">
                  {unitName}
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full mt-2 rounded-[4px] border border-stone-200 bg-white py-2 text-xs font-medium text-[#C1441F]"
                >
                  Keluar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
