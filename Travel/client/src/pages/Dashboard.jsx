import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getDashboardStats } from '../services/tripService'
import toast from 'react-hot-toast'
import { EiffelTower, BigBen, BurjKhalifa } from '../components/landmarks/AnimatedLandmarks'
import TripCalendar from '../components/TripCalendar'

/* Destination images for the hero */
const HERO_DESTINATIONS = [
  { src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', city: 'Paris',    emoji: '🗼', color: '#0ea5e9' },
  { src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', city: 'Tokyo',    emoji: '🏯', color: '#a855f7' },
  { src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', city: 'Dubai',    emoji: '🕌', color: '#f59e0b' },
  { src: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80', city: 'New York', emoji: '🗽', color: '#f43f5e' },
]

const QUICK_IMAGES = {
  explore:   'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=70',
  trips:     'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&q=70',
  analytics: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=70',
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }),
}

const StatCard = ({ label, value, emoji, gradient, glow, i }) => (
  <motion.div
    custom={i} variants={cardVariants} initial="hidden" animate="show"
    whileHover={{ scale: 1.04, y: -4 }}
    className="rounded-3xl p-5 text-white relative overflow-hidden"
    style={{
      background: gradient,
      boxShadow: `0 6px 24px ${glow}35`,
      border: '1px solid rgba(255,255,255,0.15)',
    }}
  >
    {/* Static shimmer overlay — no animation */}
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%)' }} />
    <div className="absolute -right-3 -top-3 text-6xl opacity-10 select-none pointer-events-none">{emoji}</div>
    {/* Emoji — CSS float, no Framer Motion */}
    <div className="text-3xl mb-2 relative z-10"
      style={{ animation: `float ${3 + i * 0.4}s ${i * 0.4}s ease-in-out infinite` }}>{emoji}</div>
    <p className="text-white/75 text-xs font-bold uppercase tracking-wider relative z-10">{label}</p>
    <p className="text-3xl font-display font-bold mt-1 relative z-10">{value}</p>
  </motion.div>
)

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalTrips: 0, countriesVisited: 0, totalBudget: 0, upcomingTrips: 0 })
  const [recentTrips, setRecentTrips] = useState([])
  const [popularDestinations, setPopularDestinations] = useState([])
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => { load() }, [])
  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_DESTINATIONS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const load = async () => {
    try {
      const r = await getDashboardStats()
      setStats(r.data.stats); setRecentTrips(r.data.recentTrips); setPopularDestinations(r.data.popularDestinations)
    } catch { toast.error('Failed to load dashboard') }
    finally { setLoading(false) }
  }

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  if (loading) return (
    <div className="space-y-5">
      <div className="h-64 skeleton rounded-3xl" />
      <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="h-28 skeleton rounded-3xl" />)}</div>
      <div className="h-64 skeleton rounded-3xl" />
    </div>
  )

  const heroDest = HERO_DESTINATIONS[heroIndex]

  return (
    <div className="space-y-6">

      {/* ── CINEMATIC HERO BANNER ── */}
      <motion.div
        className="relative overflow-hidden rounded-4xl text-white"
        style={{ minHeight: 280 }}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
      {/* Background image — CSS crossfade via opacity transition */}
      <div className="absolute inset-0">
        {HERO_DESTINATIONS.map((dest, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIndex ? 1 : 0 }}>
            <img src={dest.src} alt={dest.city}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.45) saturate(1.3)' }}
              loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>

        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(2,8,23,0.85) 0%, rgba(2,8,23,0.4) 50%, rgba(2,8,23,0.6) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 0% 50%, ${heroDest.color}25 0%, transparent 60%)`
        }} />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${heroDest.color}80, transparent)` }} />

        {[0,1,2].map(i => (
          <motion.div key={i} className="absolute text-white/10 select-none pointer-events-none"
            style={{ top: `${5 + i * 18}%`, fontSize: `${4.5 + i * 0.8}rem` }}
            animate={{ x: ['-300px', 'calc(100vw + 400px)'] }}
            transition={{ duration: 28 + i * 9, delay: i * 6, repeat: Infinity, ease: 'linear' }}>
            ☁️
          </motion.div>
        ))}

        <div className="absolute bottom-0 right-4 opacity-20 flex items-end gap-2 pointer-events-none">
          <EiffelTower size={52} />
          <BigBen size={46} />
          <BurjKhalifa size={36} />
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: `${heroDest.color}25`,
              border: `1px solid ${heroDest.color}50`,
              backdropFilter: 'blur(8px)',
              transition: 'background 0.5s ease, border-color 0.5s ease',
            }}>
            <span className="text-base">{heroDest.emoji}</span>
            <span className="text-white text-xs font-bold">{heroDest.city}</span>
          </div>
          <div className="flex gap-1">
            {HERO_DESTINATIONS.map((_, i) => (
              <div key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === heroIndex ? 16 : 5,
                  height: 5,
                  backgroundColor: i === heroIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 p-8">
          <div className="flex-1">
            <motion.p className="text-sky-300 text-sm font-bold mb-1"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              ✨ Welcome back, explorer!
            </motion.p>
            <motion.h1 className="font-display text-4xl font-bold mb-3"
              style={{
                background: 'linear-gradient(135deg, #ffffff, #7dd3fc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
              initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              Hey, {user?.name}! 👋
            </motion.h1>
            <motion.p className="text-sky-200/80 text-base mb-6 max-w-lg"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {stats.upcomingTrips > 0
                ? `🎉 You have ${stats.upcomingTrips} upcoming adventure${stats.upcomingTrips > 1 ? 's' : ''} waiting!`
                : '🌟 The world is waiting — plan your next adventure!'}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Link to="/my-trips">
                <motion.button
                  className="relative overflow-hidden px-7 py-3 rounded-2xl font-display font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', boxShadow: '0 4px 24px rgba(14,165,233,0.5)' }}
                  whileHover={{ scale: 1.06, y: -3, boxShadow: '0 8px 32px rgba(14,165,233,0.6)' }}
                  whileTap={{ scale: 0.97 }}>
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />
                  ✈️ Plan New Trip
                </motion.button>
              </Link>
            </motion.div>
          </div>

        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)' }} />
      </motion.div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips',  value: stats.totalTrips,                   emoji: '✈️', gradient: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', glow: '#0ea5e9' },
          { label: 'Countries',    value: stats.countriesVisited,             emoji: '🌍', gradient: 'linear-gradient(135deg,#22c55e,#06b6d4)', glow: '#22c55e' },
          { label: 'Budget',       value: `$${stats.totalBudget.toFixed(0)}`, emoji: '💰', gradient: 'linear-gradient(135deg,#f59e0b,#f97316)', glow: '#f59e0b' },
          { label: 'Upcoming',     value: stats.upcomingTrips,                emoji: '📅', gradient: 'linear-gradient(135deg,#a855f7,#f43f5e)', glow: '#a855f7' },
        ].map((s, i) => <StatCard key={i} {...s} i={i} />)}
      </div>

      {/* ── RECENT TRIPS + DESTINATIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div className="lg:col-span-2 card p-6"
          initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-xl font-bold text-primary-color">🗺️ Recent Trips</h3>
              <p className="section-subtitle">Your latest adventures</p>
            </div>
            <Link to="/my-trips">
              <motion.span className="text-sky-500 text-sm font-bold" whileHover={{ x: 4 }}>View all →</motion.span>
            </Link>
          </div>

          {recentTrips.length === 0 ? (
            <div className="empty-state">
              <motion.div className="text-6xl mb-4"
                animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}>✈️</motion.div>
              <p className="font-bold text-primary-color mb-1">No adventures yet!</p>
              <p className="text-sm text-muted-color mb-5">Create your first trip and start exploring 🌟</p>
              <Link to="/my-trips"><motion.button className="btn-primary" whileHover={{ scale: 1.05 }}>🚀 Create First Trip</motion.button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTrips.map((trip, i) => (
                <motion.div key={trip._id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }} whileHover={{ x: 5 }}>
                  <Link to={`/trips/${trip._id}`}
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all group"
                    style={{ border: '1.5px solid var(--border)' }}>
                    <motion.div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-lg flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', boxShadow: '0 4px 16px rgba(14,165,233,0.4)' }}
                      whileHover={{ rotate: 12, scale: 1.1 }}>✈️</motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-primary-color truncate group-hover:text-sky-500 transition-colors">{trip.trip_name}</p>
                      <p className="text-xs text-muted-color font-medium mt-0.5">📅 {fmt(trip.start_date)} → {fmt(trip.end_date)}</p>
                    </div>
                    <span className="badge-sky flex-shrink-0">📍 {trip.destination_count} {trip.destination_count === 1 ? 'city' : 'cities'}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div className="card p-6"
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="font-display text-xl font-bold text-primary-color mb-1">📍 Top Destinations</h3>
          <p className="section-subtitle mb-5">Your favourite places</p>

          {popularDestinations.length === 0 ? (
            <div className="empty-state py-8">
              <motion.div className="text-4xl mb-3"
                animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>🗺️</motion.div>
              <p className="text-xs text-muted-color text-center font-medium">Add destinations to trips to see them here</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {popularDestinations.map((d, i) => (
                <motion.div key={i} className="flex items-center gap-3 p-3 rounded-2xl transition-all"
                  whileHover={{ x: 4, backgroundColor: 'rgba(14,165,233,0.06)' }}>
                  <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#22c55e,#06b6d4)', boxShadow: '0 2px 10px rgba(34,197,94,0.3)' }}
                    whileHover={{ rotate: 10, scale: 1.1 }}>📍</motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary-color truncate">{d.city_name}</p>
                    <p className="text-xs text-muted-color font-medium">{d.country}</p>
                  </div>
                  <span className="text-xs font-bold text-sky-500 bg-sky-100 dark:bg-sky-900/30 px-2 py-1 rounded-xl">×{d.trip_count}</span>
                </motion.div>
              ))}
            </div>
          )}

          <div className="divider mt-4 pt-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Trips',     value: stats.totalTrips,       emoji: '✈️', glow: '#0ea5e9' },
                { label: 'Countries', value: stats.countriesVisited, emoji: '🌍', glow: '#22c55e' },
                { label: 'Upcoming',  value: stats.upcomingTrips,    emoji: '📅', glow: '#a855f7' },
              ].map((s) => (
                <motion.div key={s.label} className="p-2 rounded-2xl"
                  style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border)' }}
                  whileHover={{ scale: 1.06, y: -2 }}>
                  <div className="text-lg">{s.emoji}</div>
                  <p className="text-base font-display font-bold text-primary-color">{s.value}</p>
                  <p className="text-xs text-muted-color font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── TRIP CALENDAR ── */}
      <TripCalendar />

      {/* ── CINEMATIC QUICK ACTIONS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: '/explore',   img: QUICK_IMAGES.explore,   emoji: '🔭', title: 'Explore Activities', desc: 'Discover things to do',      glow: '#0ea5e9' },
          { to: '/my-trips',  img: QUICK_IMAGES.trips,     emoji: '🗺️', title: 'Plan a Trip',        desc: 'Build your next itinerary', glow: '#22c55e' },
          { to: '/analytics', img: QUICK_IMAGES.analytics, emoji: '📊', title: 'Travel Analytics',   desc: 'View your travel stats',    glow: '#a855f7' },
        ].map((a, i) => (
          <motion.div key={a.to}
            custom={i} variants={cardVariants} initial="hidden" animate="show"
            whileHover={{ scale: 1.03, y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <Link to={a.to}>
              <div className="relative rounded-3xl overflow-hidden group"
                style={{ border: '1.5px solid var(--border)', boxShadow: `0 4px 20px ${a.glow}15` }}>
                <div className="relative h-32 overflow-hidden">
                  <motion.img src={a.img} alt={a.title}
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.6) saturate(1.3)' }}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }} />
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(to bottom, transparent 30%, var(--bg-card) 100%)`
                  }} />
                  <motion.div className="absolute top-3 left-3 text-3xl"
                    whileHover={{ scale: 1.3, rotate: 12 }}
                    transition={{ type: 'spring', stiffness: 400 }}>{a.emoji}</motion.div>
                </div>
                <div className="p-4 pt-2" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <p className="font-display font-bold text-primary-color mb-0.5">{a.title}</p>
                  <p className="text-xs text-muted-color font-medium">{a.desc}</p>
                  <motion.span className="inline-block mt-2 text-xs font-bold"
                    style={{ color: a.glow }} whileHover={{ x: 5 }}>Open →</motion.span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

