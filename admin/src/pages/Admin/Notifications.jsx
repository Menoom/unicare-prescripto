import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'

const NOTIFICATION_TYPES = [
  { value: 'appointment', label: '📅 Appointment Reminder', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  { value: 'approval', label: '✅ Doctor Approved', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
  { value: 'cancellation', label: '❌ Appointment Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  { value: 'general', label: '📢 General Alert', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
]

const DEMO_LOGS = [
  { type: 'approval', message: 'Dr. Patel has been approved and notified.', time: '10 mins ago', read: false },
  { type: 'appointment', message: 'Appointment reminder sent to Rahul Sharma.', time: '1 hour ago', read: false },
  { type: 'cancellation', message: 'Cancellation alert sent for appointment #A2031.', time: '3 hours ago', read: true },
  { type: 'general', message: 'System maintenance scheduled for Sunday 2AM.', time: 'Yesterday', read: true },
]

const Notifications = () => {
  const { doctors, getAllDoctors, aToken } = useContext(AdminContext)
  const [logs, setLogs] = useState(DEMO_LOGS)
  const [form, setForm] = useState({ type: 'general', recipient: 'all', message: '' })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (aToken) getAllDoctors()
  }, [aToken])

  const unreadCount = logs.filter(l => !l.read).length

  const handleSend = () => {
    if (!form.message.trim()) { toast.error('Please enter a message'); return }
    setSending(true)
    setTimeout(() => {
      const newLog = {
        type: form.type,
        message: form.message,
        time: 'Just now',
        read: false,
      }
      setLogs(prev => [newLog, ...prev])
      setForm({ type: 'general', recipient: 'all', message: '' })
      setSending(false)
      toast.success(`Notification sent successfully!`)
    }, 800)
  }

  const markAllRead = () => setLogs(prev => prev.map(l => ({ ...l, read: true })))
  const markRead = (i) => setLogs(prev => prev.map((l, idx) => idx === i ? { ...l, read: true } : l))

  const getTypeMeta = (type) => NOTIFICATION_TYPES.find(t => t.value === type) || NOTIFICATION_TYPES[3]

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-5 transition-colors duration-200">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Notifications</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Send alerts to doctors and patients</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary font-semibold hover:underline">
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-primary rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{logs.length}</p>
          <p className="text-sm opacity-90 mt-1">🔔 Total Sent</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{unreadCount}</p>
          <p className="text-sm opacity-90 mt-1">📬 Unread</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-3xl font-bold">{logs.filter(l => l.read).length}</p>
          <p className="text-sm opacity-90 mt-1">✅ Read</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Compose Notification */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">📤 Send New Notification</h2>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {NOTIFICATION_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setForm(f => ({ ...f, type: t.value }))}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border-2 transition-all text-left
                    ${form.type === t.value
                      ? 'border-primary bg-primary/5 text-primary dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Recipient</label>
            <select
              value={form.recipient}
              onChange={e => setForm(f => ({ ...f, recipient: e.target.value }))}
              className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
                         bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">📢 All Users</option>
              <option value="doctors">👨‍⚕️ All Doctors</option>
              <option value="patients">🧑‍🤝‍🧑 All Patients</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>Dr. {d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Message</label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={4}
              placeholder="Write your notification message here..."
              className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
                         bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                         placeholder:text-gray-400 dark:placeholder:text-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-3 rounded-xl transition shadow disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {sending ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
            ) : '🔔 Send Notification'}
          </button>
        </div>

        {/* Notification Log */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200">📋 Notification Log</h2>
            <span className="text-xs text-gray-400">{logs.length} notifications</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[480px] overflow-y-auto">
            {logs.map((log, i) => {
              const meta = getTypeMeta(log.type)
              return (
                <div
                  key={i}
                  onClick={() => markRead(i)}
                  className={`px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                    ${!log.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap mt-0.5 ${meta.color}`}>
                      {meta.label.split(' ')[0]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!log.read ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>{log.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                    </div>
                    {!log.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
