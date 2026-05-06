import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const specialities = [
  'General physician', 'Gynecologist', 'Dermatologist',
  'Pediatricians', 'Neurologist', 'Gastroenterologist',
  'Cardiologist', 'Orthopedic', 'Psychiatrist', 'ENT Specialist',
]

const experienceOptions = ['1 Year', '2 Year', '3 Year', '4 Year', '5 Year', '6 Year', '7 Year', '8 Year', '9 Year', '10+ Years']

// ✅ FIX: Moved OUTSIDE AddDoctor so React doesn't recreate on every keystroke
const InputField = ({ label, value, onChange, type = 'text', placeholder, mandatory = false, required = true }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
      {label} {mandatory && <span className="text-red-500 font-bold">*</span>}
    </label>
    <input
      onChange={onChange} value={value} type={type} placeholder={placeholder} required={required}
      className="border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm
                 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                 placeholder:text-gray-400 dark:placeholder:text-gray-500
                 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
    />
  </div>
)

// ✅ FIX: Moved OUTSIDE AddDoctor
const SelectField = ({ label, value, onChange, options, mandatory = false }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
      {label} {mandatory && <span className="text-red-500 font-bold">*</span>}
    </label>
    <select
      value={value} onChange={onChange}
      className="border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm
                 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
)

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false)
  const [licenseFile, setLicenseFile] = useState(false)
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('Male')
  const [city, setCity] = useState('')
  const [regNumber, setRegNumber] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [hospitalName, setHospitalName] = useState('')
  const [fees, setFees] = useState('')
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [about, setAbout] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { backendUrl } = useContext(AppContext)
  const { aToken } = useContext(AdminContext)

  const resetForm = () => {
    setDocImg(false); setLicenseFile(false); setName(''); setDob(''); setEmail(''); setPhone('')
    setGender('Male'); setCity(''); setRegNumber(''); setLicenseNumber(''); setDegree('')
    setHospitalName(''); setFees(''); setAadhaarNumber(''); setAbout(''); setPassword(''); setConfirmPassword('')
    setExperience('1 Year'); setSpeciality('General physician')
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!docImg) return toast.error('Please upload a doctor photo')
    if (!licenseFile) return toast.error('Please upload medical license')
    if (password !== confirmPassword) return toast.error('Passwords do not match')

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('licenseFile', licenseFile)
      formData.append('name', name)
      formData.append('dob', dob)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('gender', gender)
      formData.append('city', city)
      formData.append('regNumber', regNumber)
      formData.append('licenseNumber', licenseNumber)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('experience', experience)
      formData.append('hospitalName', hospitalName)
      formData.append('fees', Number(fees))
      formData.append('aadhaarNumber', aadhaarNumber)
      formData.append('about', about)
      formData.append('password', password)

      const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
      if (data.success) {
        toast.success('Doctor added successfully!')
        resetForm()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Add New Doctor</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Onboard a new medical professional to the platform</p>
          </div>
          <button
            type="button" onClick={resetForm}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 transition"
          >
            Clear all fields
          </button>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-8">

          {/* 1. Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Dr. John Smith" mandatory />
              <InputField label="Date of Birth" value={dob} onChange={e => setDob(e.target.value)} type="date" mandatory />
              <InputField label="Email Address" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="doctor@clinic.com" mandatory />
              <InputField label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 890" mandatory />
              <SelectField label="Gender" value={gender} onChange={e => setGender(e.target.value)} options={['Male', 'Female', 'Other']} />
              <InputField label="City" value={city} onChange={e => setCity(e.target.value)} placeholder="New York" required={false} />
            </div>
          </div>

          {/* 2. Medical Credentials */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Medical Credentials</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField label="Medical Registration Number" value={regNumber} onChange={e => setRegNumber(e.target.value)} placeholder="REG123456" mandatory />
              <InputField label="License Number" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="LIC789012" mandatory />
              <SelectField label="Specification" value={speciality} onChange={e => setSpeciality(e.target.value)} options={specialities} mandatory />
              <InputField label="Qualification" value={degree} onChange={e => setDegree(e.target.value)} placeholder="MBBS, MD..." mandatory />
              <SelectField label="Experience" value={experience} onChange={e => setExperience(e.target.value)} options={experienceOptions} mandatory />
              <InputField label="Hospital/Clinic Name" value={hospitalName} onChange={e => setHospitalName(e.target.value)} placeholder="City Hospital" mandatory />
              <InputField label="Consultation Fees (rupees)" value={fees} onChange={e => setFees(e.target.value)} type="number" placeholder="500" mandatory />
              <InputField label="Aadhaar Number" value={aadhaarNumber} onChange={e => setAadhaarNumber(e.target.value)} placeholder="1234 5678 9012" mandatory />
            </div>
            <div className="mt-8">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">About Doctor</label>
              <textarea
                onChange={e => setAbout(e.target.value)} value={about} rows={4}
                placeholder="Write a professional bio including expertise and achievements..."
                className="w-full border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
              />
            </div>
          </div>

          {/* 3. Document Uploads */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Document Uploads</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* License Upload */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Medical License <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative group">
                  <input
                    type="file" accept=".pdf,image/*"
                    onChange={(e) => setLicenseFile(e.target.files[0])}
                    className="hidden" id="license-upload"
                  />
                  <label
                    htmlFor="license-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl p-6 cursor-pointer hover:border-blue-500 transition-all bg-gray-50 dark:bg-gray-700/50 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10"
                  >
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm mb-3 text-2xl">
                      {licenseFile ? '✅' : '📄'}
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {licenseFile ? licenseFile.name : 'Click to upload license'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG or PNG up to 5MB</p>
                  </label>
                </div>
              </div>
              {/* Photo Upload */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Doctor Photo <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="flex items-center gap-6 p-6 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                  <label htmlFor="doc-img" className="cursor-pointer shrink-0 relative group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-md flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                      {docImg ? <img src={URL.createObjectURL(docImg)} className="w-full h-full object-cover" alt="doctor" /> : <span className="text-3xl text-gray-400">📷</span>}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">CHANGE</div>
                  </label>
                  <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden accept="image/*" />
                  <div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Upload Photo</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      High resolution portrait.<br />Recommended: 400x400px.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Account Setup */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Account Setup</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" mandatory />
              <InputField label="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" mandatory />
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-blue-600 dark:bg-blue-700 rounded-3xl p-8 text-center shadow-2xl shadow-blue-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl transform group-hover:scale-110 transition duration-700"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-black/10 rounded-full blur-2xl transform group-hover:scale-110 transition duration-700"></div>
            <div className="relative z-10">
              <p className="text-blue-100 text-sm font-medium mb-6 uppercase tracking-widest">Final Step</p>
              <button
                type="submit" disabled={loading}
                className="inline-flex items-center justify-center bg-white text-blue-700 px-16 py-5 rounded-2xl shadow-xl hover:bg-blue-50 transition-all transform hover:scale-[1.03] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <span className="font-extrabold text-lg tracking-widest uppercase">Processing...</span>
                  </div>
                ) : (
                  <span className="font-extrabold text-xl tracking-widest uppercase">ADD A DOCTOR</span>
                )}
              </button>
              <p className="text-blue-200/60 text-[10px] mt-6 font-semibold uppercase tracking-widest">
                By clicking "Add A Doctor", you agree to the medical professional terms of service
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDoctor
