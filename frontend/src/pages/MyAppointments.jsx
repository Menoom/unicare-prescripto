import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {
    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()
    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) { console.log(error); toast.error(error.message) }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
            if (data.success) { toast.success(data.message); getUserAppointments() }
            else { toast.error(data.message) }
        } catch (error) { console.log(error); toast.error(error.message) }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, amount: order.amount, currency: order.currency,
            name: 'Appointment Payment', description: "Appointment Payment", order_id: order.id, receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } })
                    if (data.success) { navigate('/my-appointments'); getUserAppointments() }
                } catch (error) { console.log(error); toast.error(error.message) }
            }
        };
        const rzp = new window.Razorpay(options); rzp.open();
    };

    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) initPay(data.order); else toast.error(data.message)
        } catch (error) { console.log(error); toast.error(error.message) }
    }

    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) window.location.replace(data.session_url); else toast.error(data.message)
        } catch (error) { console.log(error); toast.error(error.message) }
    }

    useEffect(() => { if (token) getUserAppointments() }, [token])

    return (
        <div className='py-8'>
            <h1 className='text-2xl font-bold text-navy mb-1'>My Appointments</h1>
            <p className='text-gray-400 text-sm mb-6'>Manage your upcoming and past bookings.</p>

            <div>
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-5 border-b border-gray-100'>
                        <div>
                            <img className='w-32 rounded-lg bg-blue-50' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-gray-500'>
                            <p className='text-navy font-semibold text-base'>{item.docData.name}</p>
                            <p className='text-gray-400 text-xs'>{item.docData.speciality}</p>
                            <p className='text-navy text-xs font-medium mt-2'>Address:</p>
                            <p className='text-xs'>{item.docData.address.line1}</p>
                            <p className='text-xs'>{item.docData.address.line2}</p>
                            <p className='mt-2 text-xs'>
                                <span className='font-medium text-navy'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
                            </p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && <button onClick={() => setPayment(item._id)} className='sm:min-w-48 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all'>Pay Online</button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentStripe(item._id)} className='sm:min-w-48 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="" /></button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentRazorpay(item._id)} className='sm:min-w-48 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="" /></button>}
                            {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-200 rounded-lg text-green-600 bg-green-50 text-xs font-medium'>Paid</button>}
                            {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-200 rounded-lg text-green-600 bg-green-50 text-xs font-medium'>Completed</button>}
                            {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='sm:min-w-48 py-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all'>Cancel</button>}
                            {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-200 rounded-lg text-red-400 bg-red-50 text-xs font-medium'>Cancelled</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointments