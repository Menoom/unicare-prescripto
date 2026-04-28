import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <div id='speciality' className='py-16'>
            <div className='text-center mb-10'>
                <h2 className='text-2xl font-bold text-navy'>Find by Speciality</h2>
                <p className='text-gray-400 text-sm mt-2 max-w-md mx-auto'>
                    Browse our specialists and book an appointment in minutes.
                </p>
            </div>

            <div className='flex sm:justify-center gap-5 w-full overflow-x-auto pb-3 scrollbar-hide'>
                {specialityData.map((item, index) => (
                    <Link
                        to={`/doctors/${item.speciality}`}
                        onClick={() => scrollTo(0, 0)}
                        key={index}
                        className='flex flex-col items-center gap-2.5 cursor-pointer flex-shrink-0 group'
                    >
                        <div className='w-20 h-20 sm:w-24 sm:h-24 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 group-hover:-translate-y-1 transition-all duration-200'>
                            <img className='w-12 sm:w-14' src={item.image} alt="" />
                        </div>
                        <p className='text-xs font-medium text-gray-500 group-hover:text-primary transition-colors'>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu
