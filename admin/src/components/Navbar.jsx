import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken, dashData } = useContext(AdminContext)
  const { theme, toggleTheme } = useContext(AppContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-8 py-3 border-b bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm sticky top-0 z-50 transition-colors duration-200'>
      <div className='flex items-center gap-3'>
        <img
          onClick={() => navigate('/')}
          className='w-32 sm:w-36 cursor-pointer'
          src={assets.admin_logo}
          alt="UniCare"
        />
        <div className='flex items-center gap-1.5'>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${aToken ? 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'}`}>
            {aToken ? '🛡️ Admin' : '👨‍⚕️ Doctor'}
          </span>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        {/* Quick stats pill (admin only) */}
        {aToken && dashData && (
          <div className='hidden md:flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 rounded-xl px-4 py-2 transition-colors'>
            <span>👨‍⚕️ <strong className='text-gray-700 dark:text-gray-200'>{dashData.doctors}</strong> Doctors</span>
            <span className='w-px h-4 bg-gray-200 dark:bg-gray-600' />
            <span>📅 <strong className='text-gray-700 dark:text-gray-200'>{dashData.appointments}</strong> Appointments</span>
            <span className='w-px h-4 bg-gray-200 dark:bg-gray-600' />
            <span>🧑‍🤝‍🧑 <strong className='text-gray-700 dark:text-gray-200'>{dashData.patients}</strong> Patients</span>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors'
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <button
          onClick={logout}
          className='flex items-center gap-2 bg-primary text-white text-sm px-5 py-2 rounded-xl hover:bg-primary/90 transition font-semibold shadow-sm'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar