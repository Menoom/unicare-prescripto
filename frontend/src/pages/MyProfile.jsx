import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData()
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)
            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })
            if (data.success) { toast.success(data.message); await loadUserProfileData(); setIsEdit(false); setImage(false) }
            else { toast.error(data.message) }
        } catch (error) { console.log(error); toast.error(error.message) }
    }

    return userData ? (
        <div className='max-w-lg py-8'>
            <h1 className='text-2xl font-bold text-navy mb-6'>My Profile</h1>

            {isEdit
                ? <label htmlFor='image'>
                    <div className='inline-block relative cursor-pointer'>
                        <img className='w-36 rounded-xl opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                        <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                </label>
                : <img className='w-36 rounded-xl' src={userData.image} alt="" />
            }

            {isEdit
                ? <input className='bg-gray-50 text-2xl font-bold mt-4 rounded-lg px-2 py-1 border border-gray-200 outline-none focus:border-primary max-w-60' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
                : <p className='font-bold text-2xl text-navy mt-4'>{userData.name}</p>
            }

            <hr className='bg-gray-100 h-px border-none my-4' />

            <div>
                <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3'>Contact Information</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-3 text-sm'>
                    <p className='font-medium text-gray-500'>Email:</p>
                    <p className='text-blue-600'>{userData.email}</p>
                    <p className='font-medium text-gray-500'>Phone:</p>
                    {isEdit
                        ? <input className='bg-gray-50 rounded-lg px-2 py-1 border border-gray-200 outline-none focus:border-primary max-w-52' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                        : <p className='text-gray-600'>{userData.phone}</p>
                    }
                    <p className='font-medium text-gray-500'>Address:</p>
                    {isEdit
                        ? <div>
                            <input className='bg-gray-50 rounded-lg px-2 py-1 border border-gray-200 outline-none focus:border-primary w-full mb-1' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} />
                            <input className='bg-gray-50 rounded-lg px-2 py-1 border border-gray-200 outline-none focus:border-primary w-full' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} />
                        </div>
                        : <p className='text-gray-500'>{userData.address.line1}<br />{userData.address.line2}</p>
                    }
                </div>
            </div>

            <div className='mt-6'>
                <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3'>Basic Information</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-3 text-sm'>
                    <p className='font-medium text-gray-500'>Gender:</p>
                    {isEdit
                        ? <select className='max-w-20 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200 outline-none focus:border-primary' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        : <p className='text-gray-500'>{userData.gender}</p>
                    }
                    <p className='font-medium text-gray-500'>Birthday:</p>
                    {isEdit
                        ? <input className='max-w-28 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200 outline-none focus:border-primary' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
                        : <p className='text-gray-500'>{userData.dob}</p>
                    }
                </div>
            </div>

            <div className='mt-8'>
                {isEdit
                    ? <button onClick={updateUserProfileData} className='bg-primary text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors'>Save</button>
                    : <button onClick={() => setIsEdit(true)} className='border border-gray-200 px-8 py-2 rounded-lg text-sm font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors'>Edit Profile</button>
                }
            </div>
        </div>
    ) : null
}

export default MyProfile