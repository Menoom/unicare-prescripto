import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()

    return (
        <div className='relative overflow-hidden rounded-2xl my-16' style={{
            background: 'linear-gradient(135deg, #0a1e50 0%, #1e3a8a 50%, #3b82f6 100%)',
            minHeight: '280px'
        }}>
            {/* Subtle pattern overlay */}
            <div className='absolute inset-0' style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 50%),
                                  radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%)`,
            }}></div>

            <div className='relative z-10 flex flex-col md:flex-row items-center px-8 md:px-16 lg:px-20' style={{minHeight: '280px'}}>

                {/* Left */}
                <div className='flex-1 flex flex-col justify-center py-12'>

                    <div className='flex items-center gap-2 px-4 py-1.5 rounded-full w-fit mb-5' style={{background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)'}}>
                        <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                        <span className='text-white text-xs font-medium'>Doctors Available Now</span>
                    </div>

                    <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3'>
                        Book Appointment With <br />
                        <span style={{color: '#93c5fd'}}>100+ Trusted Doctors</span> <br />
                        at UniCare
                    </h2>

                    <p className='text-gray-300 text-sm leading-relaxed max-w-sm mb-7'>
                        Join thousands of patients who trust UniCare for quality healthcare and hassle-free appointments.
                    </p>

                    <div className='flex gap-4'>
                        <button
                            onClick={() => { navigate('/login'); scrollTo(0, 0) }}
                            className='bg-white text-primary px-8 py-3 rounded-full text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300'
                        >
                            Create Account
                        </button>
                        <a href='#speciality'
                            className='text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-white hover:text-primary transition-all duration-300'
                            style={{border: '1.5px solid rgba(255,255,255,0.5)'}}
                        >
                            Browse Doctors
                        </a>
                    </div>
                </div>

                {/* Right - Doctor image */}
                <div className='hidden md:flex md:w-80 items-end justify-center self-end'>
                    <img
                        src={assets.appointment_img}
                        alt="Doctor"
                        style={{width: '100%', maxHeight: '300px', objectFit: 'contain', objectPosition: 'bottom'}}
                    />
                </div>
            </div>
        </div>
    )
}

export default Banner
