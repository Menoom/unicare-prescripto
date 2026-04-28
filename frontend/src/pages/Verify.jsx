import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Verify = () => {
    const [searchParams] = useSearchParams()
    const success = searchParams.get("success")
    const appointmentId = searchParams.get("appointmentId")
    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const verifyStripe = async () => {
        try {
            const { data } = await axios.post(backendUrl + "/api/user/verifyStripe", { success, appointmentId }, { headers: { token } })
            if (data.success) toast.success(data.message); else toast.error(data.message);
            navigate("/my-appointments")
        } catch (error) { toast.error(error.message); console.log(error) }
    }

    useEffect(() => { if (token && appointmentId && success) verifyStripe() }, [token])

    return (
        <div className='min-h-[60vh] flex flex-col items-center justify-center'>
            <div className="w-10 h-10 border-[3px] border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className='text-navy font-medium'>Verifying payment...</p>
            <p className='text-gray-400 text-sm mt-1'>Please wait a moment.</p>
        </div>
    )
}

export default Verify