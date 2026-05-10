import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const publicApi = axios.create({ baseURL: '/api' })

export default function Community() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => load(), 300)
    return () => clearTimeout(timer)
  }, [search])

  const load = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      const r = await publicApi.get('/public/trips', { params })
      setTrips(r.data.data || [])
    } catch { setTrips([]) }
    finally { setLoading(false) }
  }

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const dur = (s, e) => Math.ceil((new Date(e) - new Date(s)) / 86400000)

  const gradients = [
    'linear-gradient(135deg,#0ea5e9,#06b6d4)',
    'linear-gradient(135deg,#f43f5e,#f97316)',
    'linear-gradient(135deg,#22c55e,#06b6d4)',
    'linear-gradient(135deg,#a855f7,#0ea5e9)',
    'linear-gradient(135deg,#f59e0b,#f97316)',
  ]

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <motion.div className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-color">👥 Community Trips</h1>
          <p className="text-muted-color text-sm font-medium mt-0.5">Discover adventures shared by fellow travellers</p>
        </div>
        <Link to="/my-trips">
          <motion.button className="btn-primary btn-sm" whileHover={{ scale: 1.05 }}>🔗 Share My Trip</motion.button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">🔍</span>
        <input type="text" placeholder="Search public trips by name…" value={search}
          onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
      </motion.div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_,i) => <div key={i} className="h-52 skeleton rounded-3xl" />)}
        </div>
      ) : trips.length === 0 ? (
        <motion.div className="card empty-state py-20"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="empty-icon">🌍</div>
          <p className="font-display text-2xl font-bold text-primary-color mb-2">
            {search ? 'No trips found!' : 'No public trips yet!'}
          </p>
          <p className="text-muted-color text-sm mb-6 max-w-sm text-center font-medium">
            {search ? 'Try a different search ✨' : 'Be the first to share a trip with the community! 🌟'}
          </p>
          {!search && <Link to="/my-trips"><motion.button className="btn-primary" whileHover={{ scale: 1.05 }}>✈️ Go to My Trips</motion.button></Link>}
        </motion.div>
      ) : (
        <>
          <p className="text-xs text-muted-color font-medium">
            {trips.length} public trip{trips.length !== 1 ? 's' : ''} found 🌍
          </p>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5"
            initial="hidden" animate="show"
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
            <AnimatePresence>
              {trips.map((trip, i) => (
                <motion.div key={trip._id}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="card overflow-hidden group">
                  <div className="relative h-40 overflow-hidden">
                    {trip.cover_image ? (
                      <img src={`http://localhost:5000${trip.cover_image}`} alt={trip.trip_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: gradients[i % gradients.length] }}>
                        <motion.span className="text-5xl"
                          animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}>
                          ✈️
                        </motion.span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <motion.span className="sticker bg-emerald-100 text-emerald-700 border-emerald-300 text-xs"
                        animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity }}>
                        🌐 Public
                      </motion.span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="font-display font-bold text-white text-lg truncate drop-shadow">{trip.trip_name}</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <motion.div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: gradients[i % gradients.length] }}
                        whileHover={{ scale: 1.2 }}>
                        {trip.user_name?.charAt(0).toUpperCase()}
                      </motion.div>
                      <p className="text-xs text-muted-color font-medium">by <span className="font-bold text-primary-color">{trip.user_name}</span></p>
                      <span className="ml-auto text-xs text-muted-color font-medium">{fmt(trip.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-color font-medium mb-4">
                      <span>📍 {trip.destination_count} cities</span>
                      <span>🎯 {trip.activity_count} activities</span>
                      <span className="ml-auto badge-sky">{dur(trip.start_date, trip.end_date)}d</span>
                    </div>
                    <Link to={`/public/trips/${trip._id}`}>
                      <motion.button className="btn-primary w-full text-xs py-2.5"
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                        🗺️ View Trip
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {/* How to share */}
      <motion.div className="card p-6" style={{ background: 'linear-gradient(135deg,rgba(14,165,233,0.08),rgba(6,182,212,0.05))' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.01 }}>
        <div className="flex items-start gap-4">
          <motion.div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}
            animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            💡
          </motion.div>
          <div>
            <p className="font-bold text-primary-color mb-1">How to share your trip 🚀</p>
            <p className="text-xs text-muted-color mb-3 font-medium">
              Open any trip → click <strong className="text-sky-500">🔗 Share</strong> → it becomes public and appears here for the community!
            </p>
            <Link to="/my-trips">
              <motion.button className="btn-primary btn-sm" whileHover={{ scale: 1.05 }}>✈️ Go to My Trips</motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
