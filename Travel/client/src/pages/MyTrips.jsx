import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTrips, createTrip, deleteTrip } from '../services/tripService'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const gradients = [
  'from-sky-400 to-ocean-500',
  'from-sunset-400 to-peach-400',
  'from-jungle-400 to-ocean-400',
  'from-candy-400 to-sky-400',
  'from-sun-400 to-peach-400',
  'from-ocean-400 to-candy-400',
]

export default function MyTrips() {
  const [showModal, setShowModal] = useState(false)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('created_at')

  useEffect(() => { load() }, [sort, search])

  const load = async () => {
    try {
      const r = await getTrips({ sort, order: 'DESC', search })
      setTrips(r.data)
    } catch { toast.error('Failed to load trips') }
    finally { setLoading(false) }
  }

  const handleCreate = async (data) => {
    try { await createTrip(data); toast.success('🎉 Trip created!'); setShowModal(false); load() }
    catch (e) { toast.error(e.response?.data?.message || 'Failed') }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try { await deleteTrip(id); toast.success('Trip deleted'); load() }
    catch { toast.error('Failed to delete') }
  }

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const days = (s, e) => Math.ceil((new Date(e) - new Date(s)) / 86400000)
  const upcoming = (d) => new Date(d) >= new Date()

  if (loading) return (
    <div className="space-y-5">
      <div className="h-14 skeleton rounded-2xl" />
      <div className="grid grid-cols-3 gap-4">{[...Array(6)].map((_,i) => <div key={i} className="h-64 skeleton rounded-3xl" />)}</div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-color">✈️ My Trips</h1>
          <p className="text-muted-color text-sm font-medium mt-0.5">
            {trips.length} adventure{trips.length !== 1 ? 's' : ''} planned
          </p>
        </div>
        <motion.button onClick={() => setShowModal(true)}
          className="btn-primary btn-lg"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          ✨ New Trip
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div className="card-flat p-4 flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">🔍</span>
          <input type="text" placeholder="Search your adventures…" value={search}
            onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input sm:w-44">
          <option value="created_at">🕐 Recent</option>
          <option value="start_date">📅 Start Date</option>
          <option value="trip_name">🔤 Name A–Z</option>
        </select>
      </motion.div>

      {/* Grid */}
      {trips.length === 0 ? (
        <motion.div className="card empty-state py-20"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="empty-icon">🌍</div>
          <p className="font-display text-2xl font-bold text-primary-color mb-2">
            {search ? 'No trips found!' : 'No adventures yet!'}
          </p>
          <p className="text-muted-color text-sm mb-6 font-medium">
            {search ? 'Try a different search ✨' : 'The world is waiting for you 🌟'}
          </p>
          {!search && (
            <motion.button onClick={() => setShowModal(true)} className="btn-primary btn-lg"
              whileHover={{ scale: 1.05 }}>
              🚀 Plan First Adventure
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
          <AnimatePresence>
            {trips.map((trip, i) => (
              <motion.div key={trip._id}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="card overflow-hidden group cursor-pointer"
              >
                {/* Cover */}
                <div className="relative h-44 overflow-hidden">
                  {trip.cover_image ? (
                    <img src={`http://localhost:5000${trip.cover_image}`} alt={trip.trip_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}>
                      <motion.span className="text-6xl"
                        animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}>
                        ✈️
                      </motion.span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <span className={`sticker text-xs ${trip.visibility === 'public' ? 'bg-jungle-100 text-jungle-700 border-jungle-300' : 'bg-white/80 text-sky-700 border-sky-200'}`}>
                      {trip.visibility === 'public' ? '🌐' : '🔒'}
                    </span>
                  </div>
                  {upcoming(trip.start_date) && (
                    <div className="absolute top-3 left-3">
                      <motion.span className="sticker bg-sun-100 text-sun-700 border-sun-300 text-xs"
                        animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 2, repeat: Infinity }}>
                        📅 Upcoming
                      </motion.span>
                    </div>
                  )}

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="font-display font-bold text-white text-lg truncate drop-shadow-lg">
                      {trip.trip_name}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  {trip.description && (
                    <p className="text-xs text-muted-color mb-3 line-clamp-2 font-medium">{trip.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-color mb-3 font-medium">
                    <span>📅 {fmt(trip.start_date)}</span>
                    <span className="text-sky-300">→</span>
                    <span>{fmt(trip.end_date)}</span>
                    <span className="ml-auto badge-sky">{days(trip.start_date, trip.end_date)}d</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-color mb-4 font-medium">
                    <span>📍 {trip.destination_count} {trip.destination_count === 1 ? 'city' : 'cities'}</span>
                    <span>🎯 {trip.activity_count} activities</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/trips/${trip._id}`} className="flex-1">
                      <motion.button className="btn-primary w-full text-xs py-2.5"
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        🗺️ Open Trip
                      </motion.button>
                    </Link>
                    <motion.button onClick={() => handleDelete(trip._id, trip.trip_name)}
                      className="btn-danger px-3 py-2.5 text-xs"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      🗑️
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && <CreateTripModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />}
      </AnimatePresence>
    </div>
  )
}

/* ── Create Trip Modal ── */
function CreateTripModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ trip_name: '', description: '', start_date: '', end_date: '', visibility: 'private' })
  const [img, setImg] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const onChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErr('') }
  const onImg = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { setErr('Image must be under 5 MB'); return }
    setImg(f); setPreview(URL.createObjectURL(f))
  }
  const onSave = async (e) => {
    e.preventDefault()
    if (new Date(form.end_date) < new Date(form.start_date)) { setErr('End date must be after start date'); return }
    setLoading(true)
    try { await onSubmit({ ...form, cover_image: img }) }
    catch (e) { setErr(e.response?.data?.message || 'Failed') }
    finally { setLoading(false) }
  }

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal-box max-w-lg"
        initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
        <div className="modal-header">
          <div>
            <h2 className="font-display text-2xl font-bold text-primary-color">✨ New Adventure</h2>
            <p className="text-xs text-muted-color mt-0.5 font-medium">Where are you headed?</p>
          </div>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>
        <form onSubmit={onSave} className="p-6 space-y-4">
          {err && (
            <motion.div className="p-3.5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700/40 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              ⚠️ {err}
            </motion.div>
          )}
          <div>
            <label className="input-label">🗺️ Trip Name *</label>
            <input type="text" name="trip_name" value={form.trip_name} onChange={onChange}
              required className="input" placeholder="e.g., Summer Europe Adventure 🌍" />
          </div>
          <div>
            <label className="input-label">📝 Description</label>
            <textarea name="description" value={form.description} onChange={onChange}
              rows="2" className="input resize-none" placeholder="What's this trip about?" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">📅 Start Date *</label>
              <input type="date" name="start_date" value={form.start_date} onChange={onChange} required className="input" />
            </div>
            <div>
              <label className="input-label">📅 End Date *</label>
              <input type="date" name="end_date" value={form.end_date} onChange={onChange} required className="input" />
            </div>
          </div>
          <div>
            <label className="input-label">🖼️ Cover Image</label>
            {preview ? (
              <div className="relative h-28 rounded-2xl overflow-hidden border-2 border-theme">
                <img src={preview} className="w-full h-full object-cover" alt="preview" />
                <button type="button" onClick={() => { setPreview(null); setImg(null) }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full text-xs hover:bg-black/80 font-bold">✕</button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-sky-300 dark:border-sky-700 rounded-2xl cursor-pointer hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all">
                <span className="text-2xl mb-1">🖼️</span>
                <span className="text-xs text-muted-color font-medium">Click to upload (max 5 MB)</span>
                <input type="file" accept="image/*" onChange={onImg} className="hidden" />
              </label>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <motion.button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating…</> : '🚀 Create Trip!'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
