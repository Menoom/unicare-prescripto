import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const navigate = useNavigate()

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSolts = async () => {
        setDocSlots([])
        let today = new Date()
        const allDaysSlots = []
        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }
            let timeSlots = []
            const generated = []
            while (currentDate < endTime) {
                generated.push(new Date(currentDate))
                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }
            let day = generated[0].getDate()
            let month = generated[0].getMonth() + 1
            let year = generated[0].getFullYear()
            const slotDate = day + "_" + month + "_" + year
            let existingSlots = []
            try {
                const { data } = await axios.get(backendUrl + `/api/doctor/slots`, { params: { doctorId: docId, date: slotDate } })
                if (data.success) existingSlots = data.slots
            } catch (error) { console.log(error) }
            generated.forEach(dt => {
                const formattedTime = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                const matched = existingSlots.find(s => s.time === formattedTime)
                timeSlots.push({ datetime: dt, time: formattedTime, isBooked: matched ? matched.isBooked : false })
            })
            allDaysSlots.push(timeSlots)
        }
        setDocSlots(allDaysSlots)
    }

    const bookAppointment = async () => {
        if (!token) { toast.warning('Login to book appointment'); return navigate('/login') }
        const date = docSlots[slotIndex][0].datetime
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        const slotDate = day + "_" + month + "_" + year
        try {
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
            if (data.success) { toast.success(data.message); getDoctosData(); navigate('/my-appointments') }
            else { toast.error(data.message) }
        } catch (error) { console.log(error); toast.error(error.message) }
    }

    useEffect(() => { if (doctors.length > 0) fetchDocInfo() }, [doctors, docId])
    useEffect(() => { if (docInfo) getAvailableSolts() }, [docInfo])

    return docInfo ? (
        <div className='py-8'>
            {/* Doctor Details */}
            <div className='flex flex-col sm:flex-row gap-6'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-xl' src={docInfo.image} alt="" />
                </div>
                <div className='flex-1 border border-gray-100 rounded-xl p-7 bg-white'>
                    <p className='flex items-center gap-2 text-2xl font-bold text-navy'>
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="" />
                    </p>
                    <div className='flex items-center gap-2 mt-1 text-gray-500 text-sm'>
                        <p>{docInfo.degree} — {docInfo.speciality}</p>
                        <span className='py-0.5 px-2.5 border border-gray-200 text-xs rounded-full text-gray-500'>{docInfo.experience}</span>
                    </div>
                    <div className='mt-4'>
                        <p className='flex items-center gap-1 text-sm font-medium text-navy'>About <img className='w-3 opacity-40' src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-500 mt-1 leading-relaxed max-w-[700px]'>{docInfo.about}</p>
                    </div>
                    <p className='text-gray-500 text-sm font-medium mt-4'>
                        Appointment fee: <span className='text-navy font-semibold'>{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* Booking Slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8 text-gray-600'>
                <p className='font-semibold text-navy'>Select a Slot</p>
                <div className='flex gap-3 items-center w-full overflow-x-auto mt-4 scrollbar-hide'>
                    {docSlots.length && docSlots.map((item, index) => (
                        <div onClick={() => setSlotIndex(index)} key={index}
                            className={`text-center py-5 min-w-16 rounded-xl cursor-pointer transition-all ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200 hover:border-gray-300'}`}>
                            <p className='text-xs font-medium'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p className='text-lg font-bold mt-0.5'>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-auto mt-4 scrollbar-hide'>
                    {docSlots.length && docSlots[slotIndex].map((item, index) => (
                        <p onClick={() => !item.isBooked && setSlotTime(item.time)} key={index}
                            className={`text-sm flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all ${item.isBooked ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                                    : item.time === slotTime ? 'bg-primary text-white'
                                        : 'text-gray-500 border border-gray-200 hover:border-gray-300'
                                }`}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button onClick={bookAppointment} className='bg-primary text-white text-sm font-medium px-14 py-3 rounded-lg my-6 hover:bg-primary-hover transition-colors'>
                    Book an appointment
                </button>
            </div>

            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : null
}

export default Appointment