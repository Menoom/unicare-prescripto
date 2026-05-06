import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  const adminLinks = [
    { to: '/admin-dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/all-appointments', icon: '📅', label: 'Appointments' },
    { to: '/add-doctor', icon: '➕', label: 'Add Doctor' },
    { to: '/doctor-list', icon: '👥', label: 'Doctors List' },
    { to: '/doctor-approval', icon: '✅', label: 'Doctor Approval' },  // NEW — P6
    { to: '/patients-list', icon: '🧑‍🤝‍🧑', label: 'Patients' },        // NEW — P9
    { to: '/revenue', icon: '💰', label: 'Revenue' },                  // NEW — P8
    { to: '/ratings', icon: '⭐', label: 'Ratings & Reviews' },        // NEW — P10
    { to: '/notifications', icon: '🔔', label: 'Notifications' },      // NEW — P4
    { to: '/analytics', icon: '📊', label: 'Analytics' },
  ]

  const doctorLinks = [
    { to: '/doctor-dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/doctor-appointments', icon: '📅', label: 'Appointments' },
    { to: '/doctor-profile', icon: '👤', label: 'Profile' },
  ]

  const LinkItem = ({ to, icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 py-3 px-3 md:px-6 md:min-w-60 cursor-pointer rounded-xl mx-2 my-0.5 transition-all duration-200 group
        ${isActive
          ? 'bg-primary text-white shadow-md shadow-primary/30'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`text-lg min-w-[1.5rem] text-center transition-transform group-hover:scale-110`}>
            {icon}
          </span>
          <p className={`hidden md:block text-sm font-semibold ${isActive ? 'text-white' : ''}`}>{label}</p>
        </>
      )}
    </NavLink>
  )

  return (
    <div className='min-h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm flex flex-col transition-colors duration-200'>

      {aToken && (
        <div className='px-5 pt-6 pb-2 hidden md:block'>
          <p className='text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest'>Admin Panel</p>
        </div>
      )}
      {dToken && (
        <div className='px-5 pt-6 pb-2 hidden md:block'>
          <p className='text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest'>Doctor Panel</p>
        </div>
      )}

      {aToken && (
        <ul className='flex-1 py-2'>
          {adminLinks.map(link => (
            <li key={link.to}>
              <LinkItem to={link.to} icon={link.icon} label={link.label} />
            </li>
          ))}
        </ul>
      )}

      {dToken && (
        <ul className='flex-1 py-2'>
          {doctorLinks.map(link => (
            <li key={link.to}>
              <LinkItem to={link.to} icon={link.icon} label={link.label} />
            </li>
          ))}
        </ul>
      )}

      <div className='hidden md:block px-5 py-4 border-t dark:border-gray-700'>
        <p className='text-[10px] text-gray-300 dark:text-gray-500 text-center'>UniCare Admin v1.0</p>
      </div>
    </div>
  )
}

export default Sidebar
