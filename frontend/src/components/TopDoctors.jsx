import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    return (
        <div className='py-16'>
            <div className='text-center mb-10'>
                <h2 className='text-2xl font-bold text-navy'>Top Doctors to Book</h2>
                <p className='text-gray-400 text-sm mt-2 max-w-md mx-auto'>
                    Meet our highly rated doctors and book with confidence.
                </p>
            </div>

            <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                        key={index}
                        className='bg-white border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-medium transition-all duration-200'
                    >
                        <div className='bg-gray-50'>
                            <img className='w-full h-44 object-cover' src={item.image} alt="" />
                        </div>
                        <div className='p-3.5'>
                            <div className={`flex items-center gap-1.5 text-xs mb-1.5 ${item.available ? 'text-green-600' : 'text-gray-400'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                {item.available ? 'Available' : 'Not Available'}
                            </div>
                            <p className='text-navy font-semibold text-sm'>{item.name}</p>
                            <p className='text-gray-400 text-xs mt-0.5'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='text-center mt-10'>
                <button
                    onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                    className='px-10 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:border-primary hover:text-primary transition-colors'
                >
                    View All Doctors
                </button>
            </div>
        </div>
    )
}

export default TopDoctors
