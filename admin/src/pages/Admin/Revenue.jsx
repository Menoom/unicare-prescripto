import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const Revenue = () => {
  const { appointments, getAllAppointments, aToken } = useContext(AdminContext)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (aToken) getAllAppointments()
  }, [aToken])

  const revenueData = useMemo(() => {
    if (!appointments) return { rows: [], total: 0, completed: 0, pending: 0 }
    let rows = appointments
      .filter(a => a.isCompleted || a.payment)
      .map(a => {
        const parts = a.slotDate?.split('_')
        const date = parts
          ? new Date(`${parts[2]}-${String(Number(parts[1])+1).padStart(2,'0')}-${parts[0]}`)
          : null
        return {
          date,
          dateStr: date ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
          patient: a.userData?.name || 'Unknown',
          doctor: a.docData?.name || 'Unknown',
          speciality: a.docData?.speciality || '—',
          amount: a.amount || 0,
          status: a.isCompleted ? 'Completed' : 'Paid',
        }
      })

    if (dateFrom) rows = rows.filter(r => r.date && r.date >= new Date(dateFrom))
    if (dateTo) rows = rows.filter(r => r.date && r.date <= new Date(dateTo))

    rows.sort((a, b) => (b.date || 0) - (a.date || 0))
    const total = rows.reduce((s, r) => s + r.amount, 0)

    return { rows, total, count: rows.length }
  }, [appointments, dateFrom, dateTo])

  const monthlyBreakdown = useMemo(() => {
    const map = {}
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`
      map[key] = { label: monthNames[d.getMonth()], revenue: 0, count: 0 }
    }
    revenueData.rows.forEach(r => {
      if (!r.date) return
      const key = `${monthNames[r.date.getMonth()]} ${r.date.getFullYear()}`
      if (map[key]) { map[key].revenue += r.amount; map[key].count += 1 }
    })
    return Object.values(map)
  }, [revenueData])

  const maxRevenue = Math.max(...monthlyBreakdown.map(m => m.revenue), 1)

  const exportCSV = () => {
    setExporting(true)
    const headers = ['Date', 'Patient', 'Doctor', 'Speciality', 'Amount (₹)', 'Status']
    const csvRows = [headers, ...revenueData.rows.map(r => [r.dateStr, r.patient, r.doctor, r.speciality, r.amount, r.status])]
    const csv = csvRows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `unicare_revenue_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setExporting(false)
  }

  const exportPDF = () => { window.print() }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-5 print:bg-white transition-colors duration-200">

      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Revenue Report</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Earnings overview and export</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} disabled={exporting} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-2.5 rounded-xl font-semibold transition shadow">
            📄 Export CSV
          </button>
          <button onClick={exportPDF} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm px-4 py-2.5 rounded-xl font-semibold transition shadow">
            🖨️ Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">₹{revenueData.total.toLocaleString()}</p>
          <p className="text-sm opacity-90 mt-1">💰 Total Revenue</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-primary rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{revenueData.count}</p>
          <p className="text-sm opacity-90 mt-1">📋 Paid Appointments</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">₹{revenueData.count > 0 ? Math.round(revenueData.total / revenueData.count) : 0}</p>
          <p className="text-sm opacity-90 mt-1">📈 Avg. Per Appointment</p>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-5">Monthly Revenue (Last 6 Months)</h2>
        <div className="flex items-end gap-3 h-40">
          {monthlyBreakdown.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <p className="text-xs font-bold text-gray-600 dark:text-gray-300">₹{m.revenue > 0 ? (m.revenue/1000).toFixed(1)+'k' : '0'}</p>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative" style={{ height: '100px' }}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-indigo-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-wrap gap-3 items-center print:hidden">
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Filter by date:</span>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          className="text-sm border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <span className="text-gray-400 text-sm">to</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          className="text-sm border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-primary/30" />
        {(dateFrom || dateTo) && (
          <button onClick={() => { setDateFrom(''); setDateTo('') }}
            className="text-sm text-red-500 hover:text-red-700 font-medium">✕ Clear</button>
        )}
      </div>

      {/* Revenue Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">Transaction History</h2>
          <span className="text-xs text-gray-400">{revenueData.count} transactions</span>
        </div>
        {revenueData.rows.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="text-5xl mb-3">💰</div>
            <p className="font-medium">No revenue data yet</p>
            <p className="text-sm mt-1">Completed appointments will appear here</p>
          </div>
        ) : (
          <div>
            <div className="hidden sm:grid grid-cols-[1.5fr_2fr_2fr_1.5fr_1fr_1fr] px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <p>Date</p><p>Patient</p><p>Doctor</p><p>Speciality</p><p>Amount</p><p>Status</p>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {revenueData.rows.map((r, i) => (
                <div key={i} className="grid grid-cols-[1.5fr_2fr_2fr_1.5fr_1fr_1fr] px-6 py-3.5 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm transition-colors">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{r.dateStr}</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{r.patient}</p>
                  <p className="text-gray-600 dark:text-gray-300">{r.doctor}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{r.speciality}</p>
                  <p className="font-bold text-amber-600">₹{r.amount}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 w-fit">{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Revenue
