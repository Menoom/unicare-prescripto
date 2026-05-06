import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'

const DoctorApproval = () => {
  const { doctors, getAllDoctors, aToken, changeAvailability } = useContext(AdminContext)
  const [filter, setFilter] = useState('pending')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (aToken) getAllDoctors()
  }, [aToken])

  const filtered = doctors.filter(d => {
    const matchSearch =
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.speciality?.toLowerCase().includes(search.toLowerCase())
    if (filter === 'pending') return matchSearch && !d.available
    if (filter === 'approved') return matchSearch && d.available
    return matchSearch
  })

  const handleApprove = (id) => {
    changeAvailability(id)
    toast.success('Doctor approved successfully!')
  }

  const handleReject = (id) => {
    toast.error('Doctor rejected.')
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-5 transition-colors duration-200">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Doctor Approval</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Review and approve doctor registrations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{doctors.filter(d => !d.available).length}</p>
          <p className="text-sm opacity-90 mt-1">⏳ Pending Approval</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{doctors.filter(d => d.available).length}</p>
          <p className="text-sm opacity-90 mt-1">✅ Approved</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-primary rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{doctors.length}</p>
          <p className="text-sm opacity-90 mt-1">👨‍⚕️ Total Registered</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search doctor name or speciality..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                       placeholder:text-gray-400 dark:placeholder:text-gray-500
                       focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          {[['pending', '⏳ Pending'], ['approved', '✅ Approved'], ['all', 'All']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all
                ${filter === val
                  ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 py-16 text-center text-gray-400 shadow-sm">
          <div className="text-5xl mb-3">👨‍⚕️</div>
          <p className="font-medium">No doctors found</p>
          <p className="text-sm mt-1">Try adjusting your filter or search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 flex items-center gap-4">
                <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow" />
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">{doc.name}</p>
                  <p className="text-xs text-primary font-semibold">{doc.speciality}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{doc.degree} · {doc.experience}</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>📧 {doc.email}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>💰 ₹{doc.fees} / visit</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                    ${doc.available
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                    }`}>
                    {doc.available ? '✅ Approved' : '⏳ Pending'}
                  </span>
                </div>
                {!doc.available && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleApprove(doc._id)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2 rounded-xl transition"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleReject(doc._id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm font-semibold py-2 rounded-xl transition"
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
                {doc.available && (
                  <div className="pt-1">
                    <button
                      onClick={() => handleReject(doc._id)}
                      className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-sm font-semibold py-2 rounded-xl transition"
                    >
                      Revoke Approval
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorApproval
