import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors, appointments, getAllAppointments } = useContext(AdminContext)

  const [search, setSearch] = useState('')
  const [specialityFilter, setSpecialityFilter] = useState('all')
  const [availFilter, setAvailFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
      getAllAppointments()
    }
  }, [aToken])

  const doctorStats = useMemo(() => {
    const map = {}
    if (!appointments) return map
    appointments.forEach(a => {
      const id = a.docId || a.docData?._id
      if (!id) return
      if (!map[id]) map[id] = { count: 0, completed: 0, revenue: 0 }
      map[id].count += 1
      if (a.isCompleted) map[id].completed += 1
      if (a.isCompleted || a.payment) map[id].revenue += (a.amount || 0)
    })
    return map
  }, [appointments])

  const specialities = useMemo(() => {
    const s = new Set(doctors.map(d => d.speciality).filter(Boolean))
    return ['all', ...s]
  }, [doctors])

  const filtered = useMemo(() => {
    let list = [...doctors]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(d =>
        d.name?.toLowerCase().includes(q) ||
        d.speciality?.toLowerCase().includes(q) ||
        d.degree?.toLowerCase().includes(q)
      )
    }
    if (specialityFilter !== 'all') list = list.filter(d => d.speciality === specialityFilter)
    if (availFilter === 'available') list = list.filter(d => d.available)
    else if (availFilter === 'unavailable') list = list.filter(d => !d.available)
    if (sortBy === 'name') list = list.sort((a, b) => a.name?.localeCompare(b.name))
    else if (sortBy === 'experience') list = list.sort((a, b) => parseInt(b.experience) - parseInt(a.experience))
    else if (sortBy === 'fee-high') list = list.sort((a, b) => b.fees - a.fees)
    else if (sortBy === 'appointments') list = list.sort((a, b) => (doctorStats[b._id]?.count || 0) - (doctorStats[a._id]?.count || 0))
    return list
  }, [doctors, search, specialityFilter, availFilter, sortBy, doctorStats])

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-5 transition-colors duration-200">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Doctors Management</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{doctors.length} registered doctors · {doctors.filter(d => d.available).length} currently available</p>
        </div>
        <a
          href="/add-doctor"
          className="flex items-center gap-2 bg-primary text-white text-sm px-5 py-2.5 rounded-xl shadow-md hover:bg-primary/90 transition font-semibold"
        >
          + Add Doctor
        </a>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-primary rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{doctors.length}</p>
          <p className="text-sm opacity-90 mt-1">👨‍⚕️ Total Doctors</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{doctors.filter(d => d.available).length}</p>
          <p className="text-sm opacity-90 mt-1">✅ Available Now</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{specialities.length - 1}</p>
          <p className="text-sm opacity-90 mt-1">🏥 Specialities</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search doctor name, speciality, degree..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                       placeholder:text-gray-400 dark:placeholder:text-gray-500
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <select
          value={specialityFilter}
          onChange={e => setSpecialityFilter(e.target.value)}
          className="text-sm border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {specialities.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Specialities' : s}</option>
          ))}
        </select>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          {[['all', 'All'], ['available', 'Available'], ['unavailable', 'Unavailable']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setAvailFilter(val)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all
                ${availFilter === val
                  ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="text-sm border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="name">Sort: Name</option>
          <option value="experience">Sort: Experience</option>
          <option value="fee-high">Sort: Fee (High)</option>
          <option value="appointments">Sort: Most Appointments</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">Showing {filtered.length} of {doctors.length} doctors</p>

      {/* Doctors Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 py-16 text-center text-gray-400 shadow-sm">
          <div className="text-5xl mb-3">👨‍⚕️</div>
          <p className="font-medium">No doctors found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((doc, index) => {
            const stats = doctorStats[doc._id] || { count: 0, completed: 0, revenue: 0 }
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">

                {/* Image */}
                <div className="relative bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 pb-0 flex justify-center">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-4 right-4 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-700 shadow ${doc.available ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                </div>

                <div className="p-4 space-y-3">
                  <div className="text-center">
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-base">{doc.name}</p>
                    <p className="text-xs text-primary font-semibold mt-0.5">{doc.speciality}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{doc.degree} · {doc.experience}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{stats.count}</p>
                      <p className="text-[10px] text-gray-400">Appts</p>
                    </div>
                    <div className="text-center border-x border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-bold text-emerald-600">{stats.completed}</p>
                      <p className="text-[10px] text-gray-400">Done</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-amber-600">₹{stats.revenue}</p>
                      <p className="text-[10px] text-gray-400">Revenue</p>
                    </div>
                  </div>

                  {/* Fee & Availability Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-200">
                      ₹{doc.fees} <span className="text-xs text-gray-400 font-normal">/ visit</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{doc.available ? 'Available' : 'Unavailable'}</span>
                      <div
                        onClick={() => changeAvailability(doc._id)}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-300 cursor-pointer ${doc.available ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${doc.available ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DoctorsList
