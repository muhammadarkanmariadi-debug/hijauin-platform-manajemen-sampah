'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import apiService from '../services/api.service'

interface User {
  id: number
  name: string
  email: string
  role: 'customer' | 'petugas' | 'admin' | 'partner'
  phone: string
  hijau_points?: number
  zone?: string
  status: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isCustomer: boolean
  isPetugas: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password)
      
      if (response.success && response.token && response.user) {
        setToken(response.token)
        setUser(response.user)
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))

        // Redirect based on role
        if (response.user.role === 'customer') {
          router.push('/dashboard/customer')
        } else if (response.user.role === 'petugas') {
          router.push('/dashboard/petugas')
        } else if (response.user.role === 'admin') {
          router.push('/dashboard/admin')
        }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await apiService.register(userData)
      
      if (response.success && response.token && response.user) {
        setToken(response.token)
        setUser(response.user)
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))

        // Redirect based on role
        if (response.user.role === 'customer') {
          router.push('/dashboard/customer')
        } else if (response.user.role === 'petugas') {
          router.push('/dashboard/petugas')
        }
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    apiService.logout()
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isCustomer: user?.role === 'customer',
    isPetugas: user?.role === 'petugas',
    isAdmin: user?.role === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
