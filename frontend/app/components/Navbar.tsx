'use client'

import React, { use, useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  const [isscroll, setIsscroll] = useState(false)
  const path = usePathname()
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsscroll(true)
      }
      if (window.scrollY < 80) {
        setIsscroll(false)
      }

      window.addEventListener('scroll', handleScroll)

      return () => window.removeEventListener('scroll', handleScroll)
    }
    handleScroll()
  }, [isscroll])

  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const link = [
    {
      name: 'Home',
      href: '/'
    },
    {
      name: 'Dashboard',
      href: '/dashboard'
    },
    {
      name: 'Lapor',
      href: '/lapor'
    },
    {
      name: 'Bank Sampah',
      href: '/bank-sampah'
    },
    {
      name: 'layanan',
      href: '/layanan'
    },
    {
      name: 'Komunitas',
      href: '/komunitas'
    }
  ]
  return (
    <>
      <nav
        className={`items-center bg-white shadow-lg  fixed top-0 left-0 right-0 z-50 justify-center  ${
          isscroll
            ? 'xl:w-7xl  mx-auto  transition-all xl:mt-5 xl:rounded-full xl:rounded-b-full  px-12 py-2 '
            : `w-full transition-all  px-8 lg:px-20 py-4 lg:py-6 ${path == '/' ? `rounded-b-4xl` : ``}   `
        }`}
      >
        <div className='flex flex-col'>
          <div
            className={`flex justify-between items-center mx-auto w-full ${
              isscroll ? 'max-w-[1500px]' : 'max-w-7xl'
            }`}
          >
            <Image
              className=''
              src='/assets/images/logo.png'
              alt='Hero Image'
              width={150}
              height={150}
            />
            <div className='hidden xl:flex gap-8 lg:gap-12'>
              {link.map(item => {
                const isActive = pathname === item.href
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`font-semibold hover:text-green-800 lg:text-base 2xl:text-xl ${
                      isActive ? 'text-green-800' : 'text-gray-800'
                    }`}
                  >
                    {item.name}
                  </a>
                )
              })}
            </div>

            <a
              href='/login'
              className='hidden xl:block hover:bg-green-800 px-4 py-2 border-2 border-green-800 rounded-md font-semibold text-green-800 hover:text-white lg:text-base 2xl:text-xl transition-colors duration-300'
            >
              Login
            </a>
            <button
              className='xl:hidden block cursor-pointer'
              onClick={() => setIsOpen(!isOpen)}
            >
              <FontAwesomeIcon icon={isOpen ? faXmark : faBars} size='2x' />
            </button>
          </div>
          {isOpen && (
            <div className='xl:hidden flex flex-col gap-4 bg-white mt-6'>
              {link.map(item => {
                const isActive = pathname === item.href
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`font-semibold hover:text-green-800 lg:text-base 2xl:text-xl hover:bg-gray-100 p-2 ${
                      isActive ? 'text-green-800' : 'text-gray-800'
                    }`}
                  >
                    {item.name}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
