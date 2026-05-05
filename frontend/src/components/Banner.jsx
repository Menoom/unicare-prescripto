import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()

    return (
        <div className='flex flex-col md:flex-row items-center bg-primary rounded-2xl my-16 overflow-hidden'>
            {/* Left */}
            <div className='flex-1 px-8 md:px-14 py-12 md:py-16'>
                <h2 className='text-2xl md:text-3xl font-bold text-white leading-snug'>
                    Book Appointment<br />
                    With 100+ Trusted Doctors
                </h2>
                <p className='text-blue-200 text-sm mt-3 max-w-sm leading-relaxed'>
                    Join thousands of patients who trust UniCare for quality healthcare and hassle-free appointments.
                </p>
                <div className='flex gap-3 mt-8'>
                    <button
                        onClick={() => { navigate('/login'); scrollTo(0, 0) }}
                        className='bg-white text-primary px-7 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors'
                    >
                        Create Account
                    </button>
                    <a href='#speciality' className='px-7 py-2.5 rounded-lg text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition-colors'>
                        Browse Doctors
                    </a>
                </div>
            </div>

            {/* Right */}
            <div className='hidden md:block md:w-72 self-end'>
                <img src={assets.appointment_img} alt="" className='w-full max-h-72 object-contain object-bottom' />
            </div>
        </div>
    )
}

export default Banner
