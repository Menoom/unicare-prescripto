import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className='relative w-full overflow-hidden' style={{height: '92vh'}}>

            {/* Background image */}
            <div className='absolute inset-0 w-full h-full'>
                <img
                    src={assets.header_img}
                    alt=""
                    className='w-full h-full object-cover object-top'
                    style={{filter: 'brightness(0.45)'}}
                />
            </div>

            {/* Gradient overlay */}
            <div className='absolute inset-0' style={{
                background: 'linear-gradient(90deg, rgba(10,30,80,0.85) 0%, rgba(10,30,80,0.5) 60%, rgba(10,30,80,0.15) 100%)'
            }}></div>

            {/* Teal tint */}
            <div className='absolute inset-0' style={{
                background: 'linear-gradient(135deg, rgba(79,70,229,0.2) 0%, rgba(59,130,246,0.05) 100%)'
            }}></div>

            {/* Content */}
            <div className='relative z-10 flex flex-col items-start justify-center h-full px-10 md:px-20'>

                {/* Badge */}
                <div className='flex items-center gap-2 px-4 py-1.5 rounded-full mb-5' style={{background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)'}}>
                    <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                    <span className='text-white text-xs font-medium'>100+ Trusted Doctors Available</span>
                </div>

                {/* Heading */}
                <h1 className='text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight max-w-2xl mb-4'>
                    Compassionate Care, <br />
                    <span style={{color: '#93c5fd'}}>Exceptional Results</span>
                </h1>

                {/* Subtext */}
                <p className='text-gray-200 text-base leading-relaxed max-w-lg mb-4'>
                    <span className='font-semibold text-white'>UniCare</span> connects you with trusted doctors for hassle-free appointment booking and quality healthcare.
                </p>

                {/* Profiles */}
                <div className='flex items-center gap-3 mb-6'>
                    <img className='w-12' src={assets.group_profiles} alt="" />
                    <div>
                        <p className='text-white text-sm font-semibold'>10,000+ Patients</p>
                        <p className='text-gray-300 text-xs'>Trust UniCare every month</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex items-center gap-4 mb-8'>
                    <a href='#speciality' className='flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full text-sm font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300'>
                        Book Appointment
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' /></svg>
                    </a>
                    <a href='#speciality' className='px-7 py-3 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-navy transition-colors'>
                        Find Doctors
                    </a>
                </div>
            </div>

                {/* Stats */}
                <div className='flex gap-10 pt-5 border-t' style={{borderColor: 'rgba(255,255,255,0.2)'}}>
                    <div>
                        <p className='text-white font-bold text-2xl'>100+</p>
                        <p className='text-gray-300 text-sm mt-0.5'>Doctors</p>
                    </div>
                    <div className='w-px' style={{background: 'rgba(255,255,255,0.2)'}}></div>
                    <div>
                        <p className='text-white font-bold text-2xl'>95%</p>
                        <p className='text-gray-300 text-sm mt-0.5'>Satisfaction</p>
                    </div>
                    <div className='w-px' style={{background: 'rgba(255,255,255,0.2)'}}></div>
                    <div>
                        <p className='text-white font-bold text-2xl'>10k+</p>
                        <p className='text-gray-300 text-sm mt-0.5'>Patients</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
