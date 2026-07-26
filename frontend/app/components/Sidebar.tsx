'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  MapPin,
  AlertTriangle,
  Award,
  LogOut,
  Users,
  FileText
} from 'lucide-react'

const Sidebar = () => {
  const pathname = usePathname()
  const { user, isCustomer, isPetugas, isAdmin, logout } = useAuth()

  if (!user) return null

  // Define menus based on role
  let menuItems: Array<{name: string, href: string, icon: React.ReactNode}> = []

  if (isCustomer) {
    menuItems = [
      { name: 'Dashboard', href: '/dashboard/customer', icon: <LayoutDashboard size={20} /> },
      { name: 'Order Saya', href: '/dashboard/customer/orders', icon: <Package size={20} /> },
      { name: 'Langganan', href: '/dashboard/customer/subscriptions', icon: <CalendarDays size={20} /> },
      { name: 'Alamat', href: '/dashboard/customer/addresses', icon: <MapPin size={20} /> },
      { name: 'Lapor Sampah', href: '/dashboard/customer/reports', icon: <AlertTriangle size={20} /> },
      { name: 'Poin Hijau', href: '/dashboard/customer/hijau-points', icon: <Award size={20} /> },
    ]
  } else if (isPetugas) {
    menuItems = [
      { name: 'Dashboard', href: '/dashboard/petugas', icon: <LayoutDashboard size={20} /> },
      { name: 'Tugas Hari Ini', href: '/dashboard/petugas/tasks', icon: <Package size={20} /> },
    ]
  } else if (isAdmin) {
    menuItems = [
      { name: 'Dashboard', href: '/dashboard/admin', icon: <LayoutDashboard size={20} /> },
      { name: 'Manajemen Order', href: '/dashboard/admin/orders', icon: <Package size={20} /> },
      { name: 'Manajemen Pengguna', href: '/dashboard/admin/users', icon: <Users size={20} /> },
      { name: 'Manajemen Konten', href: '/dashboard/admin/content', icon: <FileText size={20} /> },
    ]
  }

  return (
    <aside className="w-64 bg-white shadow-lg h-full flex flex-col fixed left-0 top-0 pt-24 pb-6 z-40 border-r border-gray-100">
      <div className="px-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Hai, {user.name.split(' ')[0]}
        </h2>
        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== `/dashboard/${user.role}`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
              }`}
            >
              <span className={isActive ? 'text-green-600' : 'text-gray-400'}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
