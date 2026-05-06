import React, { useContext, useEffect, useMemo } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts'

const COLORS = ['#5F6FFF', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
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

const Analytics = () => {
  const { aToken, appointments, getAllAppointments, doctors, getAllDoctors, dashData, getDashData } = useContext(AdminContext)
  const { currency } = useContext(AppContext)

  const [hasFetched, setHasFetched] = React.useState(false)

  useEffect(() => {
    if (aToken) {
      Promise.all([
        getAllAppointments(),
        getAllDoctors(),
        getDashData(),
      ]).finally(() => setHasFetched(true))
    }
  }, [aToken])

  const analytics = useMemo(() => {
    if (!appointments || appointments.length === 0) return null

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()
    const monthlyMap = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`
      monthlyMap[key] = { month: monthNames[d.getMonth()], appointments: 0, revenue: 0, newPatients: 0 }
    }

    const seenPatients = new Set()
    appointments.forEach(a => {
      const parts = a.slotDate?.split('_')
      if (!parts) return
      const date = new Date(`${parts[2]}-${String(Number(parts[1]) + 1).padStart(2, '0')}-${parts[0]}`)
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      if (monthlyMap[key]) {
        monthlyMap[key].appointments += 1
        if (a.isCompleted || a.payment) monthlyMap[key].revenue += (a.amount || 0)
        if (!seenPatients.has(a.userId)) {
          seenPatients.add(a.userId)
          monthlyMap[key].newPatients += 1
        }
      }
    })
    const monthlyData = Object.values(monthlyMap)

    const specMap = {}
    appointments.forEach(a => {
      const spec = a.docData?.speciality || 'Other'
      specMap[spec] = (specMap[spec] || 0) + 1
    })
    const specialityData = Object.entries(specMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const completed = appointments.filter(a => a.isCompleted).length
    const cancelled = appointments.filter(a => a.cancelled).length
    const pending = appointments.filter(a => !a.isCompleted && !a.cancelled).length
    const statusData = [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending },
      { name: 'Cancelled', value: cancelled },
    ].filter(s => s.value > 0)

    const hourMap = {}
    for (let h = 8; h <= 20; h++) hourMap[h] = { hour: `${h}:00`, count: 0 }
    appointments.forEach(a => {
      if (a.slotTime) {
        const h = parseInt(a.slotTime.split(':')[0])
        if (hourMap[h]) hourMap[h].count += 1
      }
    })
    const hourlyData = Object.values(hourMap)

    const totalRevenue = appointments.reduce((s, a) => (a.isCompleted || a.payment) ? s + (a.amount || 0) : s, 0)
    const avgRevenue = appointments.length > 0 ? Math.round(totalRevenue / appointments.length) : 0
    const completionRate = appointments.length > 0 ? Math.round((completed / appointments.length) * 100) : 0

    const docMap = {}
    appointments.forEach(a => {
      const id = a.docId || a.docData?._id
      if (!id) return
      if (!docMap[id]) docMap[id] = {
        name: a.docData?.name,
        speciality: a.docData?.speciality,
        image: a.docData?.image,
        count: 0, completed: 0, cancelled: 0, revenue: 0
      }
      docMap[id].count += 1
      if (a.isCompleted) docMap[id].completed += 1
      if (a.cancelled) docMap[id].cancelled += 1
      if (a.isCompleted || a.payment) docMap[id].revenue += (a.amount || 0)
    })
    const doctorPerformance = Object.values(docMap)
      .sort((a, b) => b.count - a.count)
      .map(d => ({ ...d, completionRate: d.count > 0 ? Math.round((d.completed / d.count) * 100) : 0 }))

    return { monthlyData, specialityData, statusData, hourlyData, totalRevenue, avgRevenue, completionRate, completed, cancelled, pending, doctorPerformance }
  }, [appointments])

  const isLoading = !hasFetched

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6 transition-colors duration-200">

      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Analytics & Reports</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Comprehensive insights for your clinic</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading analytics...</p>
          </div>
        </div>
      ) : !analytics ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-16 text-center text-gray-400 shadow-sm">
          <div className="text-5xl mb-3">📊</div>
          <p className="font-medium text-gray-600 dark:text-gray-300">No data available yet</p>
          <p className="text-sm mt-1">Analytics will appear once appointments are booked</p>
        </div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: `${currency || '₹'}${analytics.totalRevenue.toLocaleString()}`, icon: '💰', sub: 'From completed consultations', color: 'from-amber-500 to-orange-400' },
              { label: 'Completion Rate', value: `${analytics.completionRate}%`, icon: '✅', sub: `${analytics.completed} of ${appointments.length} appointments`, color: 'from-emerald-500 to-teal-400' },
              { label: 'Avg. Revenue/Appt', value: `${currency || '₹'}${analytics.avgRevenue}`, icon: '📈', sub: 'Per appointment average', color: 'from-blue-500 to-primary' },
              { label: 'Cancellation Rate', value: `${appointments.length ? Math.round((analytics.cancelled / appointments.length) * 100) : 0}%`, icon: '❌', sub: `${analytics.cancelled} appointments cancelled`, color: 'from-red-500 to-rose-400' },
            ].map(k => (
              <div key={k.label} className={`bg-gradient-to-br ${k.color} rounded-2xl p-5 text-white shadow-lg`}>
                <div className="flex items-start justify-between mb-2">
                  <p className="text-2xl font-bold">{k.value}</p>
                  <span className="text-2xl">{k.icon}</span>
                </div>
                <p className="text-sm font-semibold opacity-90">{k.label}</p>
                <p className="text-xs opacity-75 mt-1">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* Monthly Trend Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-5">Monthly Appointments & Revenue (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={analytics.monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradAppt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5F6FFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5F6FFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
                <Area yAxisId="left" type="monotone" dataKey="appointments" name="Appointments" stroke="#5F6FFF" strokeWidth={2.5} fill="url(#gradAppt)" dot={{ r: 4, fill: '#5F6FFF' }} />
                <Area yAxisId="right" type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#10b981" strokeWidth={2.5} fill="url(#gradRev)" dot={{ r: 4, fill: '#10b981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 3-col charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Appointments by Speciality</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={analytics.specialityData} cx="50%" cy="45%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {analytics.specialityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Appointment Status Breakdown</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={analytics.statusData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    {analytics.statusData.map((entry, i) => {
                      const c = entry.name === 'Completed' ? '#10b981' : entry.name === 'Pending' ? '#5F6FFF' : '#ef4444'
                      return <Cell key={i} fill={c} />
                    })}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Peak Appointment Hours</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics.hourlyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Bookings" radius={[4, 4, 0, 0]}>
                    {analytics.hourlyData.map((entry, i) => {
                      const max = Math.max(...analytics.hourlyData.map(h => h.count))
                      return <Cell key={i} fill={entry.count === max ? '#5F6FFF' : '#c7d2fe'} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Doctor Performance Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-700 dark:text-gray-200">Doctor Performance Report</h2>
              <span className="text-xs text-gray-400">{analytics.doctorPerformance.length} doctors tracked</span>
            </div>
            {analytics.doctorPerformance.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p>No appointment data to analyze yet</p>
              </div>
            ) : (
              <div>
                <div className="hidden sm:grid grid-cols-[0.4fr_2.5fr_1.5fr_1fr_1fr_1fr_1.5fr] px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <p>#</p><p>Doctor</p><p>Speciality</p><p>Total</p><p>Done</p><p>Revenue</p><p>Completion</p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {analytics.doctorPerformance.map((doc, i) => (
                    <div key={i} className="grid grid-cols-[0.4fr_2.5fr_1.5fr_1fr_1fr_1fr_1.5fr] px-6 py-3.5 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm transition-colors">
                      <p className="text-gray-400 font-medium">{i + 1}</p>
                      <div className="flex items-center gap-2.5">
                        {doc.image && <img src={doc.image} alt={doc.name} className="w-8 h-8 rounded-full object-cover border dark:border-gray-600" />}
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{doc.name}</p>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">{doc.speciality}</p>
                      <p className="font-bold text-gray-700 dark:text-gray-200">{doc.count}</p>
                      <p className="font-bold text-emerald-600">{doc.completed}</p>
                      <p className="font-bold text-amber-600">{currency || '₹'}{doc.revenue}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${doc.completionRate}%`, backgroundColor: doc.completionRate >= 70 ? '#10b981' : doc.completionRate >= 40 ? '#f59e0b' : '#ef4444' }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{doc.completionRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Analytics
