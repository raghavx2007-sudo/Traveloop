import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

const publicApi = axios.create({ baseURL: '/api' })

export default function PublicTrip() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { load() }, [id])

  const load = async () => {
    try { const r = await publicApi.get(`/public/trips/${id}`); setTrip(r.data.data) }
    catch { setError('Trip not found or not public') }
    finally { setLoading(false) }
  }

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const fmtCur = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)
  const dur = () => trip ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) : 0

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0ea5e9,#0284c7,#0c4a6e)' }}>
      <div className="text-center text-white">
        <motion.div className="text-7xl mb-4" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>🌍</motion.div>
        <p className="font-display text-xl font-bold">Loading adventure…</p>
      </div>
    </div>
  )

  if (error || !trip) return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg,#0ea5e9,#0c4a6e)' }}>
      <motion.div className="bg-white/95 backdrop-blur-xl rounded-4xl shadow-2xl p-10 text-center max-w-sm w-full"
        initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
        <motion.div className="text-6xl mb-4" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>🔒</motion.div>
        <h2 className="font-display text-2xl font-bold text-sky-700 mb-2">Trip Not Found</h2>
        <p className="text-sky-500 text-sm mb-6 font-medium">This trip doesn't exist or isn't publicly shared.</p>
        <Link to="/"><motion.button className="btn-primary" whileHover={{ scale: 1.05 }}>🏠 Go Home</motion.button></Link>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Nav */}
      <header className="sticky top-0 z-10 backdrop-blur-xl border-b-2 border-theme"
        style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}
              whileHover={{ rotate: 10, scale: 1.1 }}>✈️</motion.div>
            <span className="font-display text-lg font-bold text-gradient-sky">Traveloop</span>
          </Link>
          <Link to="/login">
            <motion.button className="btn-primary btn-sm" whileHover={{ scale: 1.05 }}>Sign In</motion.button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Trip header */}
        <motion.div className="card overflow-hidden" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative h-64">
            {trip.cover_image ? (
              <img src={`http://localhost:5000${trip.cover_image}`} alt={trip.trip_name}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4,#a855f7)' }}>
                <motion.span className="text-8xl" animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity }}>✈️</motion.span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <h1 className="font-display text-3xl font-bold text-white drop-shadow-lg">{trip.trip_name}</h1>
              {trip.description && <p className="text-white/80 text-sm mt-1 font-medium">{trip.description}</p>}
              <p className="text-white/60 text-xs mt-1 font-medium">✈️ Shared by {trip.user_name}</p>
            </div>
          </div>

          <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t-2 border-theme">
            {[
              { label: 'Duration',     value: `${dur()} days`, emoji: '⏱️' },
              { label: 'Start Date',   value: fmt(trip.start_date), emoji: '📅' },
              { label: 'Destinations', value: trip.destination_count, emoji: '📍' },
              { label: 'Activities',   value: trip.activity_count, emoji: '🎯' },
            ].map((m) => (
              <motion.div key={m.label} className="p-3 card-flat text-center" whileHover={{ scale: 1.04 }}>
                <div className="text-lg mb-0.5">{m.emoji}</div>
                <p className="text-xs text-muted-color font-medium">{m.label}</p>
                <p className="font-display font-bold text-primary-color">{m.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Itinerary */}
        <motion.div className="card p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="font-display text-2xl font-bold text-primary-color mb-5">🗺️ Itinerary</h2>
          {trip.stops.length === 0 ? (
            <p className="text-muted-color text-sm text-center py-8 font-medium">No destinations added yet</p>
          ) : (
            <div className="space-y-3">
              {trip.stops.map((stop, i) => (
                <motion.div key={stop._id}
                  className="flex gap-4 p-4 card-flat"
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                  whileHover={{ x: 3 }}>
                  <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                    <motion.div className="timeline-dot text-white border-sky-300"
                      style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}
                      whileHover={{ scale: 1.2 }}>
                      {i + 1}
                    </motion.div>
                    {i < trip.stops.length - 1 && <div className="timeline-line" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold text-primary-color">
                      {stop.city_name}<span className="text-muted-color font-normal">, {stop.country}</span>
                    </p>
                    {stop.arrival_date && stop.departure_date && (
                      <p className="text-xs text-muted-color mt-0.5 font-medium">📅 {fmt(stop.arrival_date)} → {fmt(stop.departure_date)}</p>
                    )}
                    {stop.activities?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {stop.activities.map(a => (
                          <span key={a._id} className="badge-sky text-xs">{a.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Budget */}
        {trip.budget_summary?.length > 0 && (
          <motion.div className="card p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-display text-2xl font-bold text-primary-color mb-5">💰 Budget Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {trip.budget_summary.map((item, i) => (
                <motion.div key={item.category} className="p-4 card-flat" whileHover={{ scale: 1.04, y: -2 }}>
                  <p className="text-xs text-muted-color capitalize font-medium mb-1">{item.category}</p>
                  <p className="font-display font-bold text-primary-color">{fmtCur(item.total)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="relative overflow-hidden rounded-4xl p-8 text-white text-center"
          style={{ background: 'linear-gradient(135deg,#0ea5e9,#0284c7,#0c4a6e)' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="absolute -top-8 -right-8 text-8xl opacity-10 select-none">🌍</div>
          <div className="absolute -bottom-4 -left-4 text-6xl opacity-10 select-none">✈️</div>
          <motion.div className="text-5xl mb-3" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>🌟</motion.div>
          <h3 className="font-display text-2xl font-bold mb-2">Plan Your Own Trip!</h3>
          <p className="text-sky-100 mb-6 font-medium">Create and share multi-city itineraries with Traveloop 🚀</p>
          <Link to="/register">
            <motion.button className="bg-white text-sky-700 font-display font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              🎉 Get Started Free
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
