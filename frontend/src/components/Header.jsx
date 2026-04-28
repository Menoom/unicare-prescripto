import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className='flex flex-col-reverse md:flex-row items-center gap-10 py-16 md:py-24'>
            {/* Left Content */}
            <div className='flex-1'>
                <p className='text-sm font-semibold text-primary tracking-wide uppercase mb-4'>Trusted Healthcare Platform</p>
                <h1 className='text-4xl md:text-5xl font-extrabold text-navy leading-[1.15] tracking-tight'>
                    Book Appointments<br />
                    with Trusted Doctors
                </h1>
                <p className='text-gray-500 text-[15px] leading-relaxed mt-5 max-w-lg'>
                    UniCare connects you with verified healthcare professionals. Schedule appointments, manage your health records, and get quality care — all in one place.
                </p>

                <div className='flex items-center gap-3 mt-6'>
                    <img className='w-20' src={assets.group_profiles} alt="" />
                    <p className='text-gray-500 text-sm'>Trusted by <strong className='text-navy'>10,000+</strong> patients</p>
                </div>

                <div className='flex items-center gap-3 mt-8'>
                    <a href='#speciality' className='bg-primary text-white px-7 py-3 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors inline-flex items-center gap-2'>
                        Book Appointment
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' /></svg>
                    </a>
                    <a href='#speciality' className='px-7 py-3 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-navy transition-colors'>
                        Find Doctors
                    </a>
                </div>
            </div>

            {/* Right Image */}
            <div className='flex-1 relative'>
                <div className='rounded-2xl overflow-hidden'>
                    <img src={assets.header_img} alt="" className='w-full h-auto object-cover rounded-2xl' />
                </div>
                {/* Stats overlay */}
                <div className='absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-medium hidden md:flex items-center justify-between'>
                    <div className='text-center px-4'>
                        <p className='text-xl font-bold text-navy'>100+</p>
                        <p className='text-xs text-gray-400 mt-0.5'>Doctors</p>
                    </div>
                    <div className='w-px h-8 bg-gray-200'></div>
                    <div className='text-center px-4'>
                        <p className='text-xl font-bold text-navy'>95%</p>
                        <p className='text-xs text-gray-400 mt-0.5'>Satisfaction</p>
                    </div>
                    <div className='w-px h-8 bg-gray-200'></div>
                    <div className='text-center px-4'>
                        <p className='text-xl font-bold text-navy'>10k+</p>
                        <p className='text-xs text-gray-400 mt-0.5'>Patients</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
