import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/* Brand */}
        <div>
          <div className='flex items-center gap-2 mb-5 cursor-pointer' onClick={() => navigate('/')}>
            <span className='text-primary font-bold text-xl'>UniCare</span>
          </div>
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            UniCare is your trusted healthcare partner. We connect patients with the best doctors for hassle-free appointment booking and quality care.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li className='hover:text-primary cursor-pointer' onClick={() => { navigate('/'); scrollTo(0,0) }}>Home</li>
            <li className='hover:text-primary cursor-pointer' onClick={() => { navigate('/about'); scrollTo(0,0) }}>About us</li>
            <li className='hover:text-primary cursor-pointer' onClick={() => { navigate('/doctors'); scrollTo(0,0) }}>All Doctors</li>
            <li className='hover:text-primary cursor-pointer' onClick={() => { navigate('/contact'); scrollTo(0,0) }}>Contact</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+91 98765 43210</li>
            <li>support@unicare.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center text-gray-500'>Copyright 2024 © UniCare.com — All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
