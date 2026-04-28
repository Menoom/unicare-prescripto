import { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'All Doctors' },
    { to: '/about', label: 'About' },
    { to: '/doctor-auth', label: 'Doctor Login' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className='flex items-center justify-between py-5 border-b border-gray-100'>
      {/* Logo */}
      <div onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer'>
        <img className='w-9' src={assets.logo} alt="" />
        <span className='text-navy font-semibold text-lg tracking-tight hidden sm:block'>UniCare</span>
      </div>

      {/* Desktop Nav */}
      <ul className='md:flex items-center gap-6 hidden'>
        {links.map(({ to, label }) => (
          <NavLink key={to} to={to}>
            <li className='text-[13px] font-medium text-gray-500 hover:text-navy transition-colors py-1'>{label}</li>
            <hr className='border-none h-[2px] bg-primary w-4/5 m-auto hidden rounded' />
          </NavLink>
        ))}
      </ul>

      {/* Right */}
      <div className='flex items-center gap-3'>
        {token && userData
          ? <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='w-8 h-8 rounded-full object-cover border-2 border-gray-100' src={userData.image} alt="" />
            <img className='w-2.5 opacity-50' src={assets.dropdown_icon} alt="" />
            <div className='absolute top-0 right-0 pt-12 text-sm font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='w-48 bg-white rounded-lg border border-gray-100 shadow-elevated py-2'>
                <p onClick={() => navigate('/my-profile')} className='px-4 py-2 hover:bg-gray-50 hover:text-navy cursor-pointer transition-colors'>My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className='px-4 py-2 hover:bg-gray-50 hover:text-navy cursor-pointer transition-colors'>My Appointments</p>
                <hr className='my-1 border-gray-100' />
                <p onClick={logout} className='px-4 py-2 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors'>Logout</p>
              </div>
            </div>
          </div>
          : <button onClick={() => navigate('/login')} className='bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors hidden md:block'>
            Get Started
          </button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden cursor-pointer' src={assets.menu_icon} alt="" />

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 z-50 ${showMenu ? '' : 'pointer-events-none'}`}>
          <div className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${showMenu ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowMenu(false)} />
          <div className={`absolute right-0 top-0 bottom-0 w-64 bg-white border-l border-gray-100 transition-transform duration-200 ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className='flex items-center justify-between px-5 py-5 border-b border-gray-100'>
              <span className='text-navy font-semibold text-base'>UniCare</span>
              <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-5 cursor-pointer opacity-60 hover:opacity-100' alt="" />
            </div>
            <ul className='flex flex-col py-3'>
              {links.map(({ to, label }) => (
                <NavLink key={to} onClick={() => setShowMenu(false)} to={to}>
                  <p className='px-5 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-navy transition-colors'>{label}</p>
                </NavLink>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
