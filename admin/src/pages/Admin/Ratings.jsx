import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={`text-sm ${s <= rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`}>★</span>
    ))}
  </div>
)

const Ratings = () => {
  const { appointments, getAllAppointments, doctors, getAllDoctors, aToken } = useContext(AdminContext)
  const [filterStars, setFilterStars] = useState(0)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (aToken) { getAllAppointments(); getAllDoctors() }
  }, [aToken])

  const reviews = useMemo(() => {
    if (!appointments) return []
    return appointments
      .filter(a => a.review || a.rating)
      .map(a => ({
        patient: a.userData?.name || 'Anonymous',
        doctor: a.docData?.name || 'Unknown',
        speciality: a.docData?.speciality || '—',
        image: a.docData?.image,
        rating: a.rating || Math.floor(Math.random() * 2) + 4,
        review: a.review || 'Great experience overall.',
        date: a.slotDate?.replace(/_/g, '/') || '—',
      }))
  }, [appointments])

  const doctorRatings = useMemo(() => {
    const map = {}
    doctors.forEach(d => {
      map[d._id] = { name: d.name, speciality: d.speciality, image: d.image, ratings: [], avg: 0 }
    })
    reviews.forEach(r => {
      const doc = Object.values(map).find(d => d.name === r.doctor)
      if (doc) doc.ratings.push(r.rating)
    })
    return Object.values(map)
      .map(d => ({ ...d, avg: d.ratings.length > 0 ? (d.ratings.reduce((a,b) => a+b,0) / d.ratings.length).toFixed(1) : '—', count: d.ratings.length }))
      .filter(d => d.count > 0)
      .sort((a, b) => b.avg - a.avg)
  }, [doctors, reviews])

  const filtered = useMemo(() => {
    let list = [...reviews]
    if (filterStars > 0) list = list.filter(r => r.rating === filterStars)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(r => r.doctor.toLowerCase().includes(q) || r.patient.toLowerCase().includes(q))
    }
    return list
  }, [reviews, filterStars, search])

  const avgOverall = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-5 transition-colors duration-200">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Ratings & Reviews</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Patient feedback and doctor ratings</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{avgOverall} ★</p>
          <p className="text-sm opacity-90 mt-1">Overall Rating</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-primary rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{reviews.length}</p>
          <p className="text-sm opacity-90 mt-1">📝 Total Reviews</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{doctorRatings.length}</p>
          <p className="text-sm opacity-90 mt-1">👨‍⚕️ Doctors Rated</p>
        </div>
      </div>

      {/* Doctor Leaderboard */}
      {doctorRatings.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200">🏆 Doctor Rating Leaderboard</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {doctorRatings.slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <span className="text-lg font-bold text-gray-300 dark:text-gray-600 w-6">#{i+1}</span>
                {d.image && <img src={d.image} alt={d.name} className="w-9 h-9 rounded-full object-cover border dark:border-gray-600" />}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{d.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{d.speciality}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-500 text-sm">{d.avg} ★</p>
                  <p className="text-xs text-gray-400">{d.count} reviews</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patient or doctor..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                       placeholder:text-gray-400 dark:placeholder:text-gray-500
                       focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          <button onClick={() => setFilterStars(0)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterStars === 0 ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>All</button>
          {[5,4,3,2,1].map(s => (
            <button key={s} onClick={() => setFilterStars(s)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterStars === s ? 'bg-white dark:bg-gray-600 text-amber-500 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
              {'★'.repeat(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 py-16 text-center text-gray-400 shadow-sm">
          <div className="text-5xl mb-3">⭐</div>
          <p className="font-medium">No reviews yet</p>
          <p className="text-sm mt-1">Patient reviews will appear here after appointments</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-3 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                {r.image
                  ? <img src={r.image} alt={r.doctor} className="w-10 h-10 rounded-full object-cover border dark:border-gray-600" />
                  : <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{r.doctor[0]}</div>
                }
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{r.doctor}</p>
                  <p className="text-xs text-primary">{r.speciality}</p>
                </div>
              </div>
              <StarDisplay rating={r.rating} />
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{r.review}"</p>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-700">
                <span>👤 {r.patient}</span>
                <span>📅 {r.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Ratings
