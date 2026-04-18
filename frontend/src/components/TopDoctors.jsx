import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    return (
        <div className='py-16 px-4 md:px-10 bg-gray-50 rounded-2xl mx-4 md:mx-0'>

            {/* Section Header */}
            <div className='flex flex-col items-center gap-3 mb-10'>
                <span className='text-xs font-semibold text-primary bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full uppercase tracking-widest'>Our Doctors</span>
                <h1 className='text-3xl font-bold text-gray-800'>Top Doctors to Book</h1>
                <p className='sm:w-1/3 text-center text-sm text-gray-500 leading-relaxed'>
                    Meet our top-rated doctors at <strong className='text-primary'>UniCare</strong> and book your appointment today.
                </p>
            </div>

            {/* Doctors Grid */}
            <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                        key={index}
                        className='bg-white border border-blue-50 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group'
                    >
                        <div className='bg-blue-50 flex items-center justify-center overflow-hidden'>
                            <img className='w-full h-48 object-cover group-hover:scale-105 transition-all duration-300' src={item.image} alt="" />
                        </div>
                        <div className='p-4'>
                            <div className={`flex items-center gap-1.5 text-xs mb-2 ${item.available ? 'text-green-500' : 'text-gray-400'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                <span>{item.available ? 'Available' : 'Not Available'}</span>
                            </div>
                            <p className='text-gray-800 font-semibold text-sm'>{item.name}</p>
                            <p className='text-primary text-xs mt-0.5'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* More Button */}
            <div className='flex justify-center mt-10'>
                <button
                    onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                    className='flex items-center gap-2 bg-white border border-primary text-primary px-10 py-3 rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-300'
                >
                    View All Doctors →
                </button>
            </div>
        </div>
    )
}

export default TopDoctors
