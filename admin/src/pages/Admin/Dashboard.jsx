import React, { useContext, useEffect, useMemo } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts'

const COLORS = ['#5F6FFF', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const StatCard = ({ icon, value, label, gradient, trend }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${gradient} cursor-pointer group transition-transform hover:-translate-y-1`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-3xl font-bold">{value}</p>
        <p className="mt-1 text-sm font-medium opacity-90">{label}</p>
        {trend !== undefined && (
          <p className="mt-2 text-xs opacity-75">
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
      <div className="text-4xl opacity-80">{icon}</div>
    </div>
    <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData, appointments, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
      getAllAppointments()
    }
  }, [aToken])

  // --- Derived analytics from appointments ---
  const analytics = useMemo(() => {
    if (!appointments || appointments.length === 0) return null

    // Status breakdown
    const completed = appointments.filter(a => a.isCompleted).length
    const cancelled = appointments.filter(a => a.cancelled).length
    const pending = appointments.filter(a => !a.isCompleted && !a.cancelled).length

    // Revenue from completed/paid
    const revenue = appointments.reduce((sum, a) => {
      if (a.isCompleted || a.payment) return sum + (a.amount || 0)
      return sum
    }, 0)

    // Weekly trend (last 7 days)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weeklyMap = {}
    days.forEach(d => { weeklyMap[d] = { day: d, appointments: 0, revenue: 0 } })
    const now = new Date()
    appointments.forEach(a => {
      const parts = a.slotDate?.split('_')
      if (!parts) return
      const date = new Date(`${parts[2]}-${String(Number(parts[1]) + 1).padStart(2, '0')}-${parts[0]}`)
      const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24))
      if (diff >= 0 && diff < 7) {
        const day = days[date.getDay()]
        weeklyMap[day].appointments += 1
        if (a.isCompleted || a.payment) weeklyMap[day].revenue += (a.amount || 0)
      }
    })
    const weeklyData = days.map(d => weeklyMap[d])

    // Speciality breakdown
    const specMap = {}
    appointments.forEach(a => {
      const spec = a.docData?.speciality || 'Other'
      specMap[spec] = (specMap[spec] || 0) + 1
    })
    const specialityData = Object.entries(specMap).map(([name, value]) => ({ name, value }))

    // Status pie
    const statusData = [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending },
      { name: 'Cancelled', value: cancelled },
    ].filter(s => s.value > 0)

    return { completed, cancelled, pending, revenue, weeklyData, specialityData, statusData }
  }, [appointments])

  if (!dashData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statusColors = { Completed: '#10b981', Pending: '#5F6FFF', Cancelled: '#ef4444' }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border dark:border-gray-700 shadow-sm transition-colors">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👨‍⚕️"
          value={dashData.doctors}
          label="Total Doctors"
          gradient="bg-gradient-to-br from-indigo-500 to-primary"
          trend={12}
        />
        <StatCard
          icon="📅"
          value={dashData.appointments}
          label="Total Appointments"
          gradient="bg-gradient-to-br from-emerald-500 to-teal-400"
          trend={8}
        />
        <StatCard
          icon="🧑‍🤝‍🧑"
          value={dashData.patients}
          label="Total Patients"
          gradient="bg-gradient-to-br from-purple-500 to-violet-400"
          trend={5}
        />
        <StatCard
          icon="💰"
          value={`${currency || '₹'}${analytics?.revenue?.toLocaleString() || 0}`}
          label="Total Revenue"
          gradient="bg-gradient-to-br from-amber-500 to-orange-400"
          trend={15}
        />
      </div>

      {/* Appointment Status Quick Pills */}
      {analytics && (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-900/50 rounded-full px-4 py-2 shadow-sm transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{analytics.completed} Completed</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900/50 rounded-full px-4 py-2 shadow-sm transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{analytics.pending} Pending</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/50 rounded-full px-4 py-2 shadow-sm transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{analytics.cancelled} Cancelled</span>
          </div>
        </div>
      )}

      {/* Charts Row */}
      {analytics && appointments.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Weekly Appointments Trend */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-5 shadow-sm transition-colors">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">Weekly Appointment Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={analytics.weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="apptGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5F6FFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5F6FFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="appointments" name="Appointments" stroke="#5F6FFF" strokeWidth={2.5} fill="url(#apptGrad)" dot={{ r: 4, fill: '#5F6FFF' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Appointment Status Pie */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-5 shadow-sm transition-colors">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">Appointment Status</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={analytics.statusData}
                  cx="50%" cy="45%"
                  innerRadius={55} outerRadius={80}
                  paddingAngle={4} dataKey="value"
                  stroke="none"
                >
                  {analytics.statusData.map((entry, i) => (
                    <Cell key={i} fill={statusColors[entry.name] || COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Speciality & Revenue Row */}
      {analytics && appointments.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {/* Speciality Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-5 shadow-sm transition-colors">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">Appointments by Speciality</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.specialityData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Appointments" radius={[6, 6, 0, 0]}>
                  {analytics.specialityData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Doctors by Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-5 shadow-sm transition-colors">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">Top Performing Doctors</h2>
            {(() => {
              const docMap = {}
              appointments.forEach(a => {
                const id = a.docData?._id || a.docId
                if (!id) return
                if (!docMap[id]) docMap[id] = { name: a.docData?.name, image: a.docData?.image, speciality: a.docData?.speciality, count: 0, revenue: 0 }
                docMap[id].count += 1
                if (a.isCompleted || a.payment) docMap[id].revenue += (a.amount || 0)
              })
              const top = Object.values(docMap).sort((a, b) => b.count - a.count).slice(0, 5)
              if (top.length === 0) return <p className="text-gray-400 text-sm text-center py-8">No appointment data yet</p>
              return (
                <div className="space-y-3">
                  {top.map((doc, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                        {i + 1}
                      </div>
                      <img src={doc.image} alt={doc.name} className="w-9 h-9 rounded-full object-cover border-2 border-primary/20" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-400 truncate">{doc.speciality}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{doc.count}</p>
                        <p className="text-xs text-gray-400">appts</p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Recent Appointments */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h2 className="font-semibold text-gray-700 dark:text-gray-200">Recent Appointments</h2>
          </div>
          <a href="/all-appointments" className="text-xs text-primary hover:underline font-medium">View All →</a>
        </div>
        <div className="divide-y dark:divide-gray-700">
          {dashData.latestAppointments.slice(0, 6).map((item, index) => (
            <div className="flex items-center px-6 py-3.5 gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" key={index}>
              <img className="rounded-full w-10 h-10 object-cover border-2 border-gray-100 dark:border-gray-600" src={item.docData?.image} alt="" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{item.docData?.name}</p>
                <p className="text-xs text-gray-400">Patient: {item.userData?.name} · {slotDateFormat(item.slotDate)} at {item.slotTime}</p>
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">{currency || '₹'}{item.amount}</div>
              {item.cancelled
                ? <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">Cancelled</span>
                : item.isCompleted
                ? <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">Completed</span>
                : <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">Pending</span>
              }
            </div>
          ))}
          {dashData.latestAppointments.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <div className="text-4xl mb-2">📅</div>
              <p>No appointments yet</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Dashboard