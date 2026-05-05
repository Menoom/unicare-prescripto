import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <div className='mt-20 border-t border-gray-100'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 py-14'>
        {/* Brand */}
        <div>
          <div className='flex items-center gap-2 mb-5 cursor-pointer' onClick={() => navigate('/')}>
            <span className='text-primary font-bold text-xl'>UniCare</span>
          </div>
          <p className='w-full md:w-2/3 text-gray-400 text-sm leading-6'>
            UniCare is your trusted healthcare partner. We connect patients with the best doctors for hassle-free appointment booking and quality care.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className='text-navy font-semibold text-sm mb-4'>Company</p>
          <ul className='flex flex-col gap-2.5 text-gray-400 text-sm'>
            <li className='hover:text-navy cursor-pointer transition-colors' onClick={() => { navigate('/'); scrollTo(0, 0) }}>Home</li>
            <li className='hover:text-navy cursor-pointer transition-colors' onClick={() => { navigate('/about'); scrollTo(0, 0) }}>About Us</li>
            <li className='hover:text-navy cursor-pointer transition-colors' onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}>All Doctors</li>
            <li className='hover:text-navy cursor-pointer transition-colors' onClick={() => { navigate('/contact'); scrollTo(0, 0) }}>Contact</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className='text-navy font-semibold text-sm mb-4'>Get in Touch</p>
          <ul className='flex flex-col gap-2.5 text-gray-400 text-sm'>
            <li>+91 98765 43210</li>
            <li>support@unicare.com</li>
          </ul>
        </div>
      </div>

      <div className='border-t border-gray-100'>
        <p className='py-5 text-xs text-center text-gray-400'>Copyright 2024 © UniCare — All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
