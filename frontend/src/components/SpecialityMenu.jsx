import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <div id='speciality' className='py-16 px-4 md:px-10'>

            {/* Section Header */}
            <div className='flex flex-col items-center gap-3 mb-10'>
                <span className='text-xs font-semibold text-primary bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full uppercase tracking-widest'>Our Specialities</span>
                <h1 className='text-3xl font-bold text-gray-800'>Find by Speciality</h1>
                <p className='sm:w-1/3 text-center text-sm text-gray-500 leading-relaxed'>
                    Browse through our extensive list of specialities at <strong className='text-primary'>UniCare</strong> and book your appointment hassle-free.
                </p>
            </div>

            {/* Speciality Cards */}
            <div className='flex sm:justify-center gap-5 pt-2 w-full overflow-x-scroll pb-4 scrollbar-hide'>
                {specialityData.map((item, index) => (
                    <Link
                        to={`/doctors/${item.speciality}`}
                        onClick={() => scrollTo(0, 0)}
                        key={index}
                        className='flex flex-col items-center gap-3 cursor-pointer flex-shrink-0 group'
                    >
                        <div className='w-20 h-20 sm:w-28 sm:h-28 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:shadow-lg group-hover:-translate-y-2 transition-all duration-300 border border-blue-100'>
                            <img className='w-12 sm:w-16' src={item.image} alt="" />
                        </div>
                        <p className='text-xs font-medium text-gray-600 group-hover:text-primary transition-colors'>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu
