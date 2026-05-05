import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId }) => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)
    const [relDoc, setRelDoc] = useState([])

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDoc(doctorsData)
        }
    }, [doctors, speciality, docId])

    return (
        <div className='flex flex-col items-center gap-4 my-16'>
            <h2 className='text-2xl font-bold text-navy'>Related Doctors</h2>
            <p className='text-gray-400 text-sm text-center max-w-md'>Browse other trusted doctors in this speciality.</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 px-3 sm:px-0'>
                {relDoc.map((item, index) => (
                    <div
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                        className='bg-white border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-medium transition-all duration-200'
                        key={index}
                    >
                        <div className='bg-gray-50'>
                            <img className='w-full' src={item.image} alt="" />
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
        </div>
    )
}

export default RelatedDoctors