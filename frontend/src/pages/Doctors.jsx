import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const specialities = [
    'General physician', 'Gynecologist', 'Dermatologist',
    'Pediatricians', 'Neurologist', 'Gastroenterologist'
  ]

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => { applyFilter() }, [doctors, speciality])

  return (
    <div className='py-8'>
      <h1 className='text-2xl font-bold text-navy'>All Doctors</h1>
      <p className='text-gray-400 text-sm mt-1'>Browse through our trusted specialists.</p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-6'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-2 px-4 border rounded-lg text-sm sm:hidden ${showFilter ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600'}`}>Filters</button>

        <div className={`flex-col gap-2 text-sm ${showFilter ? 'flex' : 'hidden sm:flex'} min-w-[180px]`}>
          {specialities.map(spec => (
            <p key={spec} onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
              className={`pl-4 py-2 pr-6 border rounded-lg cursor-pointer transition-colors ${speciality === spec ? 'bg-blue-50 border-primary text-primary font-medium' : 'border-gray-200 text-gray-500 hover:text-navy hover:border-gray-300'}`}>
              {spec}
            </p>
          ))}
        </div>

        <div className='w-full grid grid-cols-auto gap-4'>
          {filterDoc.map((item, index) => (
            <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
              className='bg-white border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-medium transition-all duration-200' key={index}>
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
    </div>
  )
}

export default Doctors