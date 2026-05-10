import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getDashboardStats } from '../services/tripService'
import { getProfile } from '../services/profileService'
import { Link } from 'react-router-dom'
import api from '../services/api'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
}

export default function Analytics() {
  const [dashData, setDashData] = useState(null)
  const [profileStats, setProfileStats] = useState(null)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const [dash, prof, allTrips] = await Promise.all([
        getDashboardStats(), getProfile(), api.get('/trips')
      ])
      setDashData(dash.data)
      setProfileStats(prof.data.stats)
      setTrips(allTrips.data.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)

  if (loading) return (
    <div className="space-y-5">
      <div className="h-12 skeleton rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="h-28 skeleton rounded-3xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-64 skeleton rounded-3xl" />
        <div className="h-64 skeleton rounded-3xl" />
      </div>
    </div>
  )

  const totalBudget = profileStats?.total_budget || 0
  const totalSpent  = profileStats?.total_spent  || 0
  const budgetUsed  = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0
  const saved       = Math.max(0, totalBudget - totalSpent)
  const isOver      = totalSpent > totalBudget && totalBudget > 0

  const currentYear = new Date().getFullYear()
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const tripsByMonth = months.map((label, idx) => ({
    label,
    count: trips.filter(t => {
      const d = new Date(t.start_date)
      return d.getFullYear() === currentYear && d.getMonth() === idx
    }).length
  }))
  const maxCount = Math.max(...tripsByMonth.map(t => t.count), 1)

  const catColors = { transport:'#0ea5e9', accommodation:'#22c55e', food:'#f59e0b', activities:'#f43f5e', shopping:'#a855f7', other:'#94a3b8' }
  const catTotals = {}
  let grandTotal = 0
  trips.forEach(trip => {
    ;(trip.budget_items || []).forEach(item => {
      catTotals[item.category] = (catTotals[item.category] || 0) + (item.estimated_cost || 0)
      grandTotal += item.estimated_cost || 0
    })
  })
  const budgetCategories = Object.entries(catTotals)
    .map(([key, val]) => ({ label: key.charAt(0).toUpperCase() + key.slice(1), pct: grandTotal > 0 ? Math.round((val / grandTotal) * 100) : 0, color: catColors[key] || '#94a3b8', amount: val }))
    .filter(c => c.pct > 0).sort((a, b) => b.pct - a.pct)

  const metricCards = [
    { label: 'Total Trips',  value: profileStats?.total_trips || 0,       emoji: '✈️', gradient: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' },
    { label: 'Countries',    value: profileStats?.countries_visited || 0, emoji: '🌍', gradient: 'linear-gradient(135deg,#22c55e,#06b6d4)' },
    { label: 'Cities',       value: profileStats?.cities_visited || 0,    emoji: '🏙️', gradient: 'linear-gradient(135deg,#a855f7,#0ea5e9)' },
    { label: 'Total Budget', value: fmt(totalBudget),                     emoji: '💰', gradient: 'linear-gradient(135deg,#f59e0b,#f97316)' },
  ]

  return (
    <div className="space-y-6 page-enter">
      <motion.div className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-color">📊 Analytics</h1>
          <p className="text-muted-color text-sm font-medium mt-0.5">Your travel insights and statistics</p>
        </div>
        <Link to="/my-trips">
          <motion.button className="btn-primary btn-sm" whileHover={{ scale: 1.05 }}>+ New Trip</motion.button>
        </Link>
      </motion.div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((s, i) => (
          <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="show"
            className="rounded-3xl p-5 text-white relative overflow-hidden"
            style={{ background: s.gradient }}
            whileHover={{ scale: 1.04, y: -4 }}>
            <div className="absolute -right-3 -top-3 text-5xl opacity-20 select-none">{s.emoji}</div>
            <motion.div className="text-2xl mb-2"
              animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>
              {s.emoji}
            </motion.div>
            <p className="text-white/80 text-xs font-bold uppercase tracking-wide">{s.label}</p>
            <p className="font-display text-3xl font-bold mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Budget + Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Budget overview */}
        <motion.div className="card p-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="font-display text-xl font-bold text-primary-color mb-1">💰 Budget Overview</h3>
          <p className="section-subtitle mb-5">Estimated vs actual spending</p>

          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs text-muted-color font-medium">Total Budget</p>
              <p className="font-display text-2xl font-bold text-primary-color">{fmt(totalBudget)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-color font-medium">Spent</p>
              <p className="font-display text-2xl font-bold" style={{ color: isOver ? '#f43f5e' : '#22c55e' }}>{fmt(totalSpent)}</p>
            </div>
          </div>

          <div className="progress-bar h-4 mb-2 rounded-full overflow-hidden">
            <motion.div className="h-4 rounded-full"
              style={{ background: isOver ? 'linear-gradient(to right,#f43f5e,#f97316)' : 'linear-gradient(to right,#0ea5e9,#22d3ee)' }}
              initial={{ width: 0 }} animate={{ width: `${budgetUsed}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
          </div>
          <div className="flex justify-between text-xs font-bold text-muted-color mb-5">
            <span>{budgetUsed}% used</span>
            <span>{fmt(saved)} remaining</span>
          </div>

          {budgetCategories.length === 0 ? (
            <p className="text-xs text-muted-color text-center py-4 font-medium">Add budget items to trips to see breakdown 📊</p>
          ) : (
            <div className="space-y-3">
              {budgetCategories.map((cat, i) => (
                <motion.div key={cat.label}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-primary-color">{cat.label}</span>
                    <span className="text-muted-color">{cat.pct}% · {fmt(cat.amount)}</span>
                  </div>
                  <div className="progress-bar h-2">
                    <motion.div className="h-2 rounded-full"
                      style={{ background: cat.color }}
                      initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }} transition={{ duration: 0.8, delay: 0.05 * i }} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Savings donut */}
        <motion.div className="card p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="font-display text-xl font-bold text-primary-color mb-1">🎉 Savings</h3>
          <p className="section-subtitle mb-5">How much you saved vs planned</p>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" strokeWidth="3.5" />
                {budgetUsed > 0 && (
                  <motion.circle cx="18" cy="18" r="15.9" fill="none"
                    stroke={isOver ? '#f43f5e' : '#0ea5e9'} strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 100' }}
                    animate={{ strokeDasharray: `${budgetUsed} ${100 - budgetUsed}` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }} />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-display text-2xl font-bold text-primary-color">{budgetUsed}%</p>
                <p className="text-xs text-muted-color font-medium">used</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}
              whileHover={{ scale: 1.03 }}>
              <p className="text-white/80 text-xs font-bold">Planned</p>
              <p className="font-display text-lg font-bold">{fmt(totalBudget)}</p>
            </motion.div>
            <motion.div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg,#22c55e,#06b6d4)' }}
              whileHover={{ scale: 1.03 }}>
              <p className="text-white/80 text-xs font-bold">Saved</p>
              <p className="font-display text-lg font-bold">{fmt(saved)}</p>
            </motion.div>
          </div>

          {totalBudget === 0 && (
            <p className="text-xs text-muted-color text-center mt-4 font-medium">
              Add budget items to your trips to see savings data 💡
            </p>
          )}
        </motion.div>
      </div>

      {/* Bar chart */}
      <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="font-display text-xl font-bold text-primary-color mb-1">📅 Trip Activity — {currentYear}</h3>
        <p className="section-subtitle mb-5">Trips starting each month this year</p>

        {trips.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-xs text-muted-color font-medium">Create trips to see your activity chart ✨</p>
          </div>
        ) : (
          <div className="flex items-end gap-1.5 h-36">
            {tripsByMonth.map((m, i) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: '110px' }}>
                  <motion.div
                    className="w-full rounded-t-xl cursor-pointer"
                    style={{ background: 'linear-gradient(to top,#0ea5e9,#38bdf8)', minHeight: '4px' }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.04, ease: 'easeOut' }}
                    whileHover={{ filter: 'brightness(1.2)' }}
                    title={`${m.count} trip${m.count !== 1 ? 's' : ''}`}
                  />
                </div>
                <span className="text-xs text-muted-color font-bold">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent trips */}
      <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl font-bold text-primary-color">✈️ Recent Trips</h3>
          <Link to="/my-trips">
            <motion.span className="text-sky-500 text-sm font-bold" whileHover={{ x: 3 }}>View all →</motion.span>
          </Link>
        </div>

        {dashData?.recentTrips?.length === 0 ? (
          <div className="empty-state py-8">
            <div className="empty-icon">✈️</div>
            <p className="text-muted-color text-sm font-medium mb-4">No trips yet</p>
            <Link to="/my-trips"><motion.button className="btn-primary btn-sm" whileHover={{ scale: 1.05 }}>Create First Trip</motion.button></Link>
          </div>
        ) : (
          <div className="space-y-2">
            {(dashData?.recentTrips || []).map((trip, i) => {
              const dur = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000)
              return (
                <motion.div key={trip._id}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                  whileHover={{ x: 4 }}>
                  <Link to={`/trips/${trip._id}`}
                    className="flex items-center gap-3 p-3.5 card-flat hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-all group">
                    <motion.div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}
                      whileHover={{ rotate: 10, scale: 1.1 }}>✈️</motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary-color truncate group-hover:text-sky-600 transition-colors">
                        {trip.trip_name}
                      </p>
                      <p className="text-xs text-muted-color font-medium">
                        {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="badge-sky text-xs">{dur}d</span>
                      <p className="text-xs text-muted-color mt-0.5 font-medium">{trip.destination_count} cities</p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
