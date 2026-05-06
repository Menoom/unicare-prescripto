import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const PatientsList = () => {
  const { appointments, getAllAppointments, aToken } = useContext(AdminContext)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    if (aToken) getAllAppointments()
  }, [aToken])

  const patients = useMemo(() => {
    if (!appointments) return []
    const map = {}
    appointments.forEach(a => {
      const id = a.userId || a.userData?._id
      if (!id) return
      if (!map[id]) {
        map[id] = {
          id,
          name: a.userData?.name || 'Unknown',
          email: a.userData?.email || '—',
          phone: a.userData?.phone || '—',
          dob: a.userData?.dob || '—',
          gender: a.userData?.gender || '—',
          image: a.userData?.image || null,
          appointments: 0,
          completed: 0,
          cancelled: 0,
          lastVisit: null,
        }
      }
      map[id].appointments += 1
      if (a.isCompleted) map[id].completed += 1
      if (a.cancelled) map[id].cancelled += 1
      const parts = a.slotDate?.split('_')
      if (parts) {
        const date = new Date(`${parts[2]}-${String(Number(parts[1])+1).padStart(2,'0')}-${parts[0]}`)
        if (!map[id].lastVisit || date > map[id].lastVisit) map[id].lastVisit = date
      }
    })
    return Object.values(map)
  }, [appointments])

  const filtered = useMemo(() => {
    let list = [...patients]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      )
    }
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'appointments') list.sort((a, b) => b.appointments - a.appointments)
    else if (sortBy === 'recent') list.sort((a, b) => (b.lastVisit || 0) - (a.lastVisit || 0))
    return list
  }, [patients, search, sortBy])

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-5 transition-colors duration-200">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Patients List</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{patients.length} unique patients registered</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{patients.length}</p>
          <p className="text-sm opacity-90 mt-1">🧑‍🤝‍🧑 Total Patients</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{patients.reduce((s, p) => s + p.completed, 0)}</p>
          <p className="text-sm opacity-90 mt-1">✅ Completed Visits</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">
            {patients.length > 0 ? Math.round(patients.reduce((s, p) => s + p.appointments, 0) / patients.length) : 0}
          </p>
          <p className="text-sm opacity-90 mt-1">📅 Avg. Appointments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                       placeholder:text-gray-400 dark:placeholder:text-gray-500
                       focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="text-sm border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="name">Sort: Name</option>
          <option value="appointments">Sort: Most Appointments</option>
          <option value="recent">Sort: Recent Visit</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">Showing {filtered.length} of {patients.length} patients</p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 py-16 text-center text-gray-400 shadow-sm">
          <div className="text-5xl mb-3">🧑‍🤝‍🧑</div>
          <p className="font-medium">No patients found</p>
          <p className="text-sm mt-1">Patients appear here once appointments are booked</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr_1fr] px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            <p>Patient</p><p>Contact</p><p>Gender</p><p>Appts</p><p>Completed</p><p>Last Visit</p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map((p, i) => (
              <div key={i} className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr_1fr] px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm transition-colors">
                <div className="flex items-center gap-3">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="w-9 h-9 rounded-full object-cover border dark:border-gray-600" />
                    : <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{p.name[0]}</div>
                  }
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{p.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{p.email}</p>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{p.phone}</p>
                <p className="text-gray-500 dark:text-gray-400 capitalize">{p.gender}</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">{p.appointments}</p>
                <p className="font-bold text-emerald-600">{p.completed}</p>
                <p className="text-gray-400 text-xs">
                  {p.lastVisit ? p.lastVisit.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientsList
