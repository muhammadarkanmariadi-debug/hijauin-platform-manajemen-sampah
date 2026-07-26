'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        // Save token and user data
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Redirect based on role
        const role = data.user.role
        if (role === 'customer') {
          router.push('/dashboard/customer')
        } else if (role === 'petugas') {
          router.push('/dashboard/petugas')
        } else if (role === 'admin') {
          router.push('/dashboard/admin')
        }
      } else {
        setError(data.message || 'Login gagal')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center bg-gradient-to-br from-green-50 to-green-100 px-4 sm:px-6 lg:px-8 py-12 min-h-screen'>
      <div className='space-y-8 bg-white shadow-xl p-8 rounded-2xl w-full max-w-md'>
        <div>
          <h2 className='font-extrabold text-gray-900 text-3xl text-center'>
            Masuk ke <span className='text-green-600'>Hijauin</span>
          </h2>
          <p className='mt-2 text-gray-600 text-sm text-center'>
            Belum punya akun?{' '}
            <Link href='/auth/register' className='font-medium text-green-600 hover:text-green-500'>
              Daftar sekarang
            </Link>
          </p>
        </div>

        {error && (
          <div className='bg-red-50 px-4 py-3 border border-red-200 rounded-lg text-red-700'>
            {error}
          </div>
        )}

        <form className='space-y-6 mt-8' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block font-medium text-gray-700 text-sm'>
                Email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                value={formData.email}
                onChange={handleChange}
                className='block focus:z-10 relative mt-1 px-3 py-2 border border-gray-300 focus:border-green-500 rounded-lg focus:outline-none focus:ring-green-500 w-full sm:text-sm appearance-none placeholder-gray-400'
                placeholder='nama@email.com'
              />
            </div>

            <div>
              <label htmlFor='password' className='block font-medium text-gray-700 text-sm'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                value={formData.password}
                onChange={handleChange}
                className='block focus:z-10 relative mt-1 px-3 py-2 border border-gray-300 focus:border-green-500 rounded-lg focus:outline-none focus:ring-green-500 w-full sm:text-sm appearance-none placeholder-gray-400'
                placeholder='••••••••'
              />
            </div>
          </div>

          <div className='flex justify-between items-center'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                className='border-gray-300 rounded focus:ring-green-500 w-4 h-4 text-green-600'
              />
              <label htmlFor='remember-me' className='block ml-2 text-gray-900 text-sm'>
                Ingat saya
              </label>
            </div>

            <div className='text-sm'>
              <Link href='/auth/forgot-password' className='font-medium text-green-600 hover:text-green-500'>
                Lupa password?
              </Link>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='group relative flex justify-center bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-3 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full font-medium text-white text-sm transition-colors disabled:cursor-not-allowed'
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='border-gray-300 border-t w-full' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>Atau lanjutkan dengan</span>
            </div>
          </div>

          <div className='gap-3 grid grid-cols-2 mt-6'>
            <button className='inline-flex justify-center bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-lg w-full font-medium text-gray-500 text-sm transition-colors'>
              <svg className='w-5 h-5' viewBox='0 0 24 24'>
                <path fill='currentColor' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                <path fill='currentColor' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                <path fill='currentColor' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                <path fill='currentColor' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
              </svg>
            </button>

            <button className='inline-flex justify-center bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-lg w-full font-medium text-gray-500 text-sm transition-colors'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
