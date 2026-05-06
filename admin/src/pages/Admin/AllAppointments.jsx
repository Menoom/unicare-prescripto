import React, { useEffect, useState, useContext, useMemo } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const STATUS_ALL = 'all'
const STATUS_PENDING = 'pending'
const STATUS_COMPLETED = 'completed'
const STATUS_CANCELLED = 'cancelled'

const StatusBadge = ({ item }) => {
  if (item.cancelled) return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 px-3 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Cancelled
    </span>
  )
  if (item.isCompleted) return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 px-3 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Completed
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-3 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Pending
    </span>
  )
}

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(STATUS_ALL)
  const [specialityFilter, setSpecialityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (aToken) getAllAppointments()
  }, [aToken])

  const specialities = useMemo(() => {
    const s = new Set(appointments.map(a => a.docData?.speciality).filter(Boolean))
    return ['all', ...s]
  }, [appointments])

  const filtered = useMemo(() => {
    let list = [...appointments]
    if (statusFilter === STATUS_PENDING) list = list.filter(a => !a.isCompleted && !a.cancelled)
    else if (statusFilter === STATUS_COMPLETED) list = list.filter(a => a.isCompleted)
    else if (statusFilter === STATUS_CANCELLED) list = list.filter(a => a.cancelled)
    if (specialityFilter !== 'all') list = list.filter(a => a.docData?.speciality === specialityFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.userData?.name?.toLowerCase().includes(q) ||
        a.docData?.name?.toLowerCase().includes(q) ||
        a.slotDate?.includes(q) ||
        a.docData?.speciality?.toLowerCase().includes(q)
      )
    }
    if (sortBy === 'newest') list = list.sort((a, b) => b.date - a.date)
    else if (sortBy === 'oldest') list = list.sort((a, b) => a.date - b.date)
    else if (sortBy === 'fee-high') list = list.sort((a, b) => b.amount - a.amount)
    else if (sortBy === 'fee-low') list = list.sort((a, b) => a.amount - b.amount)
    return list
  }, [appointments, search, statusFilter, specialityFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const stats = useMemo(() => ({
    total: appointments.length,
    completed: appointments.filter(a => a.isCompleted).length,
    cancelled: appointments.filter(a => a.cancelled).length,
    pending: appointments.filter(a => !a.isCompleted && !a.cancelled).length,
    revenue: appointments.filter(a => a.isCompleted || a.payment).reduce((s, a) => s + (a.amount || 0), 0),
  }), [appointments])

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-5 transition-colors duration-200">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">All Appointments</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{stats.total} total appointments</p>
        </div>
        <button
          onClick={() => getAllAppointments()}
          className="flex items-center gap-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'bg-primary/10 dark:bg-primary/20 text-primary border-white dark:border-gray-700', icon: '📅' },
          { label: 'Completed', value: stats.completed, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-white dark:border-gray-700', icon: '✅' },
          { label: 'Pending', value: stats.pending, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-white dark:border-gray-700', icon: '⏳' },
          { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-white dark:border-gray-700', icon: '❌' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 flex items-center gap-3 ${s.color} border shadow-sm`}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder="Search patient, doctor, speciality..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                       placeholder:text-gray-400 dark:placeholder:text-gray-500
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          {[STATUS_ALL, STATUS_PENDING, STATUS_COMPLETED, STATUS_CANCELLED].map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setCurrentPage(1) }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all
                ${statusFilter === s
                  ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        <select
          value={specialityFilter}
          onChange={e => { setSpecialityFilter(e.target.value); setCurrentPage(1) }}
          className="text-sm border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          {specialities.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Specialities' : s}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="text-sm border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="fee-high">Fee: High → Low</option>
          <option value="fee-low">Fee: Low → High</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[0.4fr_2fr_0.8fr_2fr_2fr_1fr_1.2fr_1fr] px-6 py-3.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        {paginated.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-medium">No appointments found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginated.map((item, index) => (
              <div
                key={item._id || index}
                className="flex flex-wrap sm:grid sm:grid-cols-[0.4fr_2fr_0.8fr_2fr_2fr_1fr_1.2fr_1fr] items-center px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors gap-2"
              >
                <p className="text-sm text-gray-400 font-medium max-sm:hidden">{(currentPage - 1) * itemsPerPage + index + 1}</p>

                <div className="flex items-center gap-2.5">
                  <img src={item.userData?.image} className="w-9 h-9 rounded-full object-cover border-2 border-gray-100 dark:border-gray-600" alt="" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.userData?.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{item.userData?.gender || 'N/A'}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 max-sm:hidden">{calculateAge(item.userData?.dob)} yrs</p>

                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{slotDateFormat(item.slotDate)}</p>
                  <p className="text-xs text-gray-400">{item.slotTime}</p>
                </div>

                <div className="flex items-center gap-2">
                  <img src={item.docData?.image} className="w-8 h-8 rounded-full object-cover bg-gray-100 dark:bg-gray-700 border dark:border-gray-600" alt="" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.docData?.name}</p>
                    <p className="text-xs text-gray-400">{item.docData?.speciality}</p>
                  </div>
                </div>

                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{currency || '₹'}{item.amount}</p>

                <StatusBadge item={item} />

                <div>
                  {!item.cancelled && !item.isCompleted
                    ? <button
                        onClick={() => cancelAppointment(item._id)}
                        className="text-xs text-red-500 border border-red-200 dark:border-red-800 rounded-lg px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium"
                      >
                        Cancel
                      </button>
                    : <span className="text-xs text-gray-300 dark:text-gray-600 font-medium">—</span>
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-white dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition"
              >← Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 text-sm rounded-lg border transition font-medium
                      ${page === currentPage
                        ? 'bg-primary text-white border-primary'
                        : 'hover:bg-white dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                      }`}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-white dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition"
              >Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllAppointments
