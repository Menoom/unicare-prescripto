import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='py-10'>
      <div className='text-center pt-6 mb-10'>
        <h1 className='text-2xl font-bold text-navy'>Contact Us</h1>
      </div>

      <div className='flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px] rounded-xl object-cover' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <div>
            <p className='font-semibold text-navy mb-2'>Our Office</p>
            <p className='text-gray-500 leading-relaxed'>Infocity Square <br /> Bhubaneswar, Chandrasekharpur, India</p>
          </div>
          <div>
            <p className='font-semibold text-navy mb-2'>Contact</p>
            <p className='text-gray-500'>Tel: +91 9999999999</p>
            <p className='text-gray-500'>Email: support@unicare.com</p>
          </div>
          <div>
            <p className='font-semibold text-navy mb-2'>Careers at UniCare</p>
            <p className='text-gray-500 max-w-sm leading-relaxed'>Learn more about our teams and open positions.</p>
            <button className='mt-3 px-6 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors'>
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
