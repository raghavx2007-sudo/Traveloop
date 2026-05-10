import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getTrips } from '../services/tripService'

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

/* Colour palette cycling for trips */
const TRIP_COLORS = [
  { bg: 'rgba(14,165,233,0.18)',  border: '#0ea5e9', dot: '#0ea5e9',  text: '#38bdf8'  },
  { bg: 'rgba(168,85,247,0.18)', border: '#a855f7', dot: '#a855f7',  text: '#c084fc'  },
  { bg: 'rgba(34,197,94,0.18)',  border: '#22c55e', dot: '#22c55e',  text: '#4ade80'  },
  { bg: 'rgba(245,158,11,0.18)', border: '#f59e0b', dot: '#f59e0b',  text: '#fbbf24'  },
  { bg: 'rgba(244,63,94,0.18)',  border: '#f43f5e', dot: '#f43f5e',  text: '#fb7185'  },
  { bg: 'rgba(6,182,212,0.18)',  border: '#06b6d4', dot: '#06b6d4',  text: '#22d3ee'  },
]

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate()
}

function isInRange(date, start, end) {
  const d = date.getTime()
  return d >= start.getTime() && d <= end.getTime()
}

export default function TripCalendar() {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [trips, setTrips] = useState([])
  const [selected, setSelected] = useState(null)   // { date, trips[] }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTrips()
      .then(r => setTrips(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  /* Assign a stable colour to each trip by index */
  const tripColors = useMemo(() => {
    const map = {}
    trips.forEach((t, i) => { map[t._id] = TRIP_COLORS[i % TRIP_COLORS.length] })
    return map
  }, [trips])

  /* Build calendar grid */
  const firstDay  = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : new Date(year, month, i - firstDay + 1)
  )
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  /* For each date, find which trips cover it */
  const tripsOnDate = (date) => {
    if (!date) return []
    return trips.filter(t => {
      const s = new Date(t.start_date)
      const e = new Date(t.end_date)
      s.setHours(0,0,0,0); e.setHours(23,59,59,999)
      return isInRange(date, s, e)
    })
  }

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelected(null)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  const handleDayClick = (date) => {
    if (!date) return
    const dayTrips = tripsOnDate(date)
    if (dayTrips.length === 0) { setSelected(null); return }
    setSelected({ date, trips: dayTrips })
  }

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <motion.div
      className="card p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-xl font-bold text-primary-color">📅 Trip Calendar</h3>
          <p className="section-subtitle">Your upcoming adventures at a glance</p>
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            onClick={prevMonth}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface)', border: '1.5px solid var(--border)' }}
            whileHover={{ scale: 1.1, borderColor: 'var(--border-hover)' }}
            whileTap={{ scale: 0.92 }}
          >‹</motion.button>
          <div className="px-3 py-1 rounded-xl text-sm font-bold min-w-[130px] text-center"
            style={{ color: 'var(--text-primary)', background: 'var(--bg-surface)', border: '1.5px solid var(--border)' }}>
            {MONTHS[month]} {year}
          </div>
          <motion.button
            onClick={nextMonth}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface)', border: '1.5px solid var(--border)' }}
            whileHover={{ scale: 1.1, borderColor: 'var(--border-hover)' }}
            whileTap={{ scale: 0.92 }}
          >›</motion.button>
        </div>
      </div>

      {/* ── Day headers ── */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-bold py-1.5 uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ── */}
      {loading ? (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="skeleton h-10 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            if (!date) return <div key={i} />

            const dayTrips  = tripsOnDate(date)
            const isToday   = isSameDay(date, today)
            const isPast    = date < today && !isToday
            const isStart   = dayTrips.some(t => isSameDay(new Date(t.start_date), date))
            const isEnd     = dayTrips.some(t => isSameDay(new Date(t.end_date), date))
            const hasTrips  = dayTrips.length > 0
            const isSelected = selected && isSameDay(selected.date, date)
            const primaryColor = hasTrips ? tripColors[dayTrips[0]._id] : null

            return (
              <motion.button
                key={i}
                onClick={() => handleDayClick(date)}
                className="relative h-10 rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all overflow-hidden"
                style={{
                  background: isSelected
                    ? primaryColor?.border || '#0ea5e9'
                    : hasTrips
                      ? primaryColor?.bg
                      : isToday
                        ? 'rgba(14,165,233,0.12)'
                        : 'transparent',
                  color: isSelected
                    ? '#fff'
                    : isToday
                      ? '#0ea5e9'
                      : isPast
                        ? 'var(--text-muted)'
                        : 'var(--text-primary)',
                  border: isSelected
                    ? `1.5px solid ${primaryColor?.border || '#0ea5e9'}`
                    : isToday
                      ? '1.5px solid rgba(14,165,233,0.5)'
                      : hasTrips
                        ? `1.5px solid ${primaryColor?.border}40`
                        : '1.5px solid transparent',
                  boxShadow: isSelected
                    ? `0 4px 16px ${primaryColor?.border || '#0ea5e9'}50`
                    : 'none',
                  opacity: isPast && !hasTrips ? 0.4 : 1,
                }}
                whileHover={hasTrips || isToday ? { scale: 1.08, y: -1 } : { scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Range bar behind the number */}
                {hasTrips && !isStart && !isEnd && (
                  <div className="absolute inset-y-0 inset-x-0 opacity-30 pointer-events-none"
                    style={{ background: primaryColor?.border }} />
                )}

                <span className="relative z-10">{date.getDate()}</span>

                {/* Trip dots */}
                {hasTrips && (
                  <div className="absolute bottom-1 flex gap-0.5 z-10">
                    {dayTrips.slice(0, 3).map((t, di) => (
                      <div key={di}
                        className="w-1 h-1 rounded-full"
                        style={{ background: isSelected ? '#fff' : tripColors[t._id]?.dot }} />
                    ))}
                  </div>
                )}

                {/* Today ring */}
                {isToday && !isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ border: '1.5px solid #0ea5e9' }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      )}

      {/* ── Selected day popup ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="mt-4 rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid var(--border)', background: 'var(--bg-surface)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selected.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                  style={{ color: 'var(--text-muted)', background: 'var(--bg-base)' }}
                >✕</button>
              </div>
              <div className="space-y-2">
                {selected.trips.map((trip) => {
                  const col = tripColors[trip._id]
                  const isUpcoming = new Date(trip.start_date) >= today
                  return (
                    <Link key={trip._id} to={`/trips/${trip._id}`}>
                      <motion.div
                        className="flex items-center gap-3 p-3 rounded-xl transition-all"
                        style={{ background: col.bg, border: `1.5px solid ${col.border}30` }}
                        whileHover={{ x: 3, borderColor: col.border }}
                      >
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                          style={{ background: col.border + '25', border: `1.5px solid ${col.border}50` }}>
                          ✈️
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: col.text }}>
                            {trip.trip_name}
                          </p>
                          <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {fmt(trip.start_date)} → {fmt(trip.end_date)}
                          </p>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: col.border + '20', color: col.text }}>
                          {isUpcoming ? '🚀 Upcoming' : '✅ Done'}
                        </span>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Legend ── */}
      {trips.length > 0 && (
        <div className="mt-4 pt-4 divider">
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            Your Trips
          </p>
          <div className="flex flex-wrap gap-2">
            {trips.slice(0, 6).map((trip, i) => {
              const col = tripColors[trip._id]
              const isUpcoming = new Date(trip.start_date) >= today
              return (
                <Link key={trip._id} to={`/trips/${trip._id}`}>
                  <motion.div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: col.bg, border: `1.5px solid ${col.border}40`, color: col.text }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col.dot }} />
                    <span className="truncate max-w-[100px]">{trip.trip_name}</span>
                    {isUpcoming && <span>🚀</span>}
                  </motion.div>
                </Link>
              )
            })}
            {trips.length > 6 && (
              <div className="flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
                +{trips.length - 6} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && trips.length === 0 && (
        <div className="mt-4 text-center py-6">
          <div className="text-3xl mb-2">🗓️</div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            No trips yet — create one to see it here!
          </p>
        </div>
      )}
    </motion.div>
  )
}
