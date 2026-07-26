'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const RegisterPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'customer',
    zone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.password_confirmation) {
      setError('Password tidak cocok')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        // Auto login after register
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect based on role
        const role = data.user.role
        if (role === 'customer') {
          router.push('/dashboard/customer')
        } else if (role === 'petugas') {
          router.push('/dashboard/petugas')
        }
      } else {
        setError(data.message || 'Registrasi gagal')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center bg-linear-to-br from-green-50 to-green-100 px-4 sm:px-6 lg:px-8 py-12 min-h-screen'>
      <div className='space-y-8 bg-white shadow-xl p-8 rounded-2xl w-full max-w-md'>
        <div>
          <h2 className='font-extrabold text-gray-900 text-3xl text-center'>
            Daftar di <span className='text-green-600'>Hijauin</span>
          </h2>
          <p className='mt-2 text-gray-600 text-sm text-center'>
            Sudah punya akun?{' '}
            <Link href='/auth/login' className='font-medium text-green-600 hover:text-green-500'>
              Masuk sekarang
            </Link>
          </p>
        </div>

        {error && (
          <div className='bg-red-50 px-4 py-3 border border-red-200 rounded-lg text-red-700'>
            {error}
          </div>
        )}

        <form className='space-y-4 mt-8' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name' className='block font-medium text-gray-700 text-sm'>
              Nama Lengkap
            </label>
            <input
              id='name'
              name='name'
              type='text'
              required
              value={formData.name}
              onChange={handleChange}
              className='block relative mt-1 px-3 py-2 border border-gray-300 focus:border-green-500 rounded-lg focus:outline-none focus:ring-green-500 w-full sm:text-sm appearance-none placeholder-gray-400'
              placeholder='John Doe'
            />
          </div>

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
              className='block relative mt-1 px-3 py-2 border border-gray-300 focus:border-green-500 rounded-lg focus:outline-none focus:ring-green-500 w-full sm:text-sm appearance-none placeholder-gray-400'
              placeholder='nama@email.com'
            />
          </div>

          <div>
            <label htmlFor='phone' className='block font-medium text-gray-700 text-sm'>
              Nomor Telepon
            </label>
            <input
              id='phone'
              name='phone'
              type='tel'
              required
              value={formData.phone}
              onChange={handleChange}
              className='block relative mt-1 px-3 py-2 border border-gray-300 focus:border-green-500 rounded-lg focus:outline-none focus:ring-green-500 w-full sm:text-sm appearance-none placeholder-gray-400'
              placeholder='081234567890'
            />
          </div>

          <div>
            <label htmlFor='role' className='block font-medium text-gray-700 text-sm'>
              Daftar Sebagai
            </label>
            <select
              id='role'
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='block mt-1 px-3 py-2 border border-gray-300 focus:border-green-500 rounded-lg focus:outline-none focus:ring-green-500 w-full sm:text-sm'
            >
              <option value='customer'>Pelanggan</option>
              <option value='petugas'>Petugas (fastCOPICK)</option>
            </select>
          </div>

          {formData.role === 'petugas' && (
            <div>
              <label htmlFor='zone' className='block font-medium text-gray-700 text-sm'>
                Zona Kerja
              </label>
              <select
                id='zone'
                name='zone'
                required
                value={formData.zone}
                onChange={handleChange}
                className='block mt-1 px-3 py-2 border border-gray-300 focus:border-green-500 rounded-lg focus:outline-none focus:ring-green-500 w-full sm:text-sm'
              >
                <option value=''>Pilih Zona</option>
                <option value='Jakarta Selatan'>Jakarta Selatan</option>
                <option value='Jakarta Utara'>Jakarta Utara</option>
                <option value='Jakarta Barat'>Jakarta Barat</option>
                <option value='Jakarta Timur'>Jakarta Timur</option>
                <option value='Jakarta Pusat'>Jakarta Pusat</option>
              </select>
            </div>
          )}

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
              className='block relative mt-1 px-3 py-2 border border-gray-300 focus:border-green-500 rounded-lg focus:outline-none focus:ring-green-500 w-full sm:text-sm appearance-none placeholder-gray-400'
              placeholder='••••••••'
            />
          </div>

          <div>
            <label htmlFor='password_confirmation' className='block font-medium text-gray-700 text-sm'>
              Konfirmasi Password
            </label>
            <input
              id='password_confirmation'
              name='password_confirmation'
              type='password'
              required
              value={formData.password_confirmation}
              onChange={handleChange}
              className='block relative mt-1 px-3 py-2 border border-gray-300 focus:border-green-500 rounded-lg focus:outline-none focus:ring-green-500 w-full sm:text-sm appearance-none placeholder-gray-400'
              placeholder='••••••••'
            />
          </div>

          <div className='flex items-center'>
            <input
              id='terms'
              name='terms'
              type='checkbox'
              required
              className='border-gray-300 rounded focus:ring-green-500 w-4 h-4 text-green-600'
            />
            <label htmlFor='terms' className='block ml-2 text-gray-900 text-sm'>
              Saya setuju dengan{' '}
              <Link href='/terms' className='text-green-600 hover:text-green-500'>
                Syarat & Ketentuan
              </Link>
            </label>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='flex justify-center bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-3 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full font-medium text-white text-sm transition-colors disabled:cursor-not-allowed'
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
