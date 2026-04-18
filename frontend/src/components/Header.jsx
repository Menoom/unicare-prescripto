import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className='relative w-full overflow-hidden rounded-2xl' style={{minHeight: '560px'}}>

            {/* Background - Doctor image as full background */}
            <div className='absolute inset-0 w-full h-full'>
                <img
                    src={assets.header_img}
                    alt=""
                    className='w-full h-full object-cover object-top'
                    style={{filter: 'brightness(0.45)'}}
                />
            </div>

            {/* Gradient overlay - left side darker for text readability */}
            <div className='absolute inset-0' style={{
                background: 'linear-gradient(90deg, rgba(10,30,80,0.85) 0%, rgba(10,30,80,0.6) 50%, rgba(10,30,80,0.2) 100%)'
            }}></div>

            {/* Subtle teal/blue color tint overlay */}
            <div className='absolute inset-0' style={{
                background: 'linear-gradient(135deg, rgba(79,70,229,0.3) 0%, rgba(59,130,246,0.1) 100%)'
            }}></div>

            {/* Content */}
            <div className='relative z-10 flex flex-col items-start justify-center h-full px-8 md:px-16 lg:px-24 py-20' style={{minHeight: '560px'}}>

                {/* Badge */}
                <div className='flex items-center gap-2 px-4 py-1.5 rounded-full mb-6' style={{background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)'}}>
                    <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                    <span className='text-white text-xs font-medium'>100+ Trusted Doctors Available</span>
                </div>

                {/* Heading */}
                <h1 className='text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight max-w-xl mb-4'>
                    Compassionate Care, <br />
                    <span style={{color: '#93c5fd'}}>Exceptional Results</span>
                </h1>

                {/* Subtext */}
                <p className='text-gray-200 text-sm md:text-base leading-relaxed max-w-md mb-3'>
                    <span className='font-semibold text-white'>UniCare</span> connects you with trusted doctors for hassle-free appointment booking and quality healthcare.
                </p>

                {/* Profiles + Count */}
                <div className='flex items-center gap-3 mb-8'>
                    <img className='w-12' src={assets.group_profiles} alt="" />
                    <div>
                        <p className='text-white text-sm font-semibold'>10,000+ Patients</p>
                        <p className='text-gray-300 text-xs'>Trust UniCare every month</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex items-center gap-4 mb-10'>
                    <a href='#speciality' className='flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full text-sm font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300'>
                        Book Appointment
                        <img className='w-3' src={assets.arrow_icon} alt="" style={{filter: 'brightness(0) invert(1)'}} />
                    </a>
                    <a href='#speciality' className='text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-white hover:text-primary transition-all duration-300' style={{border: '1.5px solid rgba(255,255,255,0.6)'}}>
                        Find Doctors
                    </a>
                </div>

                {/* Stats Row */}
                <div className='flex gap-8 pt-6 border-t w-full max-w-sm' style={{borderColor: 'rgba(255,255,255,0.2)'}}>
                    <div>
                        <p className='text-white font-bold text-2xl'>100+</p>
                        <p className='text-gray-300 text-xs mt-0.5'>Doctors</p>
                    </div>
                    <div className='w-px' style={{background: 'rgba(255,255,255,0.2)'}}></div>
                    <div>
                        <p className='text-white font-bold text-2xl'>95%</p>
                        <p className='text-gray-300 text-xs mt-0.5'>Satisfaction</p>
                    </div>
                    <div className='w-px' style={{background: 'rgba(255,255,255,0.2)'}}></div>
                    <div>
                        <p className='text-white font-bold text-2xl'>10k+</p>
                        <p className='text-gray-300 text-xs mt-0.5'>Patients</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
