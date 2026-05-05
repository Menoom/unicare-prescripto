import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData, darkMode, toggleDarkMode } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className='flex items-center justify-between py-4 mb-5 border-b border-b-gray-300 dark:border-b-gray-700 px-6 w-full'>

      {/* Logo + UniCare Name */}
      <div onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer'>
        <span className='text-primary font-bold text-3xl hidden sm:block'>UniCare</span>
      </div>

      {/* Desktop Nav */}
      <ul className='md:flex items-center gap-20 font-semibold hidden text-sm'>
        <NavLink to='/'>
          <li className='py-1 text-gray-800 dark:text-gray-500 hover:text-primary transition-colors tracking-wide'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors'>
          <li className='py-1 text-gray-800 dark:text-gray-500 hover:text-primary transition-colors tracking-wide'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1 text-gray-800 dark:text-gray-500 hover:text-primary transition-colors tracking-wide'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1 text-gray-800 dark:text-gray-500 hover:text-primary transition-colors tracking-wide'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-3'>
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className='w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm'
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 text-yellow-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z' />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 text-gray-700' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' />
            </svg>
          )}
        </button>

        {/* Are You a Doctor Button */}
        <button
          onClick={() => navigate('/doctor-auth')}
          className='bg-primary text-white px-6 py-2.5 rounded-full font-medium text-sm hidden md:block hover:bg-primary/90 transition-all shadow-md'
        >
          ARE YOU A DOCTOR?
        </button>

        {/* User Profile if logged in */}
        {token && userData &&
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='w-8 rounded-full' src={userData.image} alt="" />
            <img className='w-2.5' src={assets.dropdown_icon} alt="" />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-lg flex flex-col gap-4 p-4 border border-gray-100 dark:border-gray-700'>
                <p onClick={() => navigate('/my-profile')} className='hover:text-primary cursor-pointer'>My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className='hover:text-primary cursor-pointer'>My Appointments</p>
                <p onClick={logout} className='hover:text-primary cursor-pointer'>Logout</p>
              </div>
            </div>
          </div>
        }

        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        {/* Mobile Menu */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white dark:bg-gray-900 transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <div className='flex items-center gap-2'>
              <img src={assets.logo} className='w-8' alt="" />
              <span className='text-primary font-bold text-xl'>UniCare</span>
            </div>
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium dark:text-white'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded-full inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded-full inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded-full inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded-full inline-block'>CONTACT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctor-auth'><p className='px-4 py-2 bg-primary text-white rounded-full inline-block mt-2'>ARE YOU A DOCTOR?</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
