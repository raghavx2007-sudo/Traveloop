import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getTrip, updateTrip, addStop, deleteStop,
  getBudgetItems, addBudgetItem, deleteBudgetItem,
  getChecklistItems, addChecklistItem, updateChecklistItem, deleteChecklistItem,
  getNotes, addNote, deleteNote
} from '../services/tripService'
import { BudgetTab, ChecklistTab, NotesTab } from '../components/TripTabs'
import { AddBudgetModal, AddChecklistModal, AddNoteModal } from '../components/TripModals'
import toast from 'react-hot-toast'

const TABS = [
  { key: 'itinerary', label: '🗺️ Itinerary' },
  { key: 'budget',    label: '💰 Budget' },
  { key: 'checklist', label: '🎒 Checklist' },
  { key: 'notes',     label: '📝 Notes' },
]

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('itinerary')
  const [budget, setBudget] = useState({ items: [], totals: [], overall: {} })
  const [checklist, setChecklist] = useState({ items: [], stats: {} })
  const [notes, setNotes] = useState([])

  const [showEdit, setShowEdit] = useState(false)
  const [showStop, setShowStop] = useState(false)
  const [showBudget, setShowBudget] = useState(false)
  const [showChecklist, setShowChecklist] = useState(false)
  const [showNote, setShowNote] = useState(false)

  useEffect(() => { loadTrip() }, [id])
  useEffect(() => {
    if (tab === 'budget')    loadBudget()
    if (tab === 'checklist') loadChecklist()
    if (tab === 'notes')     loadNotes()
  }, [tab, id])

  const loadTrip      = async () => { try { const r = await getTrip(id); setTrip(r.data) } catch { toast.error('Failed to load'); navigate('/my-trips') } finally { setLoading(false) } }
  const loadBudget    = async () => { try { const r = await getBudgetItems(id); setBudget(r.data) } catch {} }
  const loadChecklist = async () => { try { const r = await getChecklistItems(id); setChecklist(r.data) } catch {} }
  const loadNotes     = async () => { try { const r = await getNotes(id); setNotes(r.data) } catch {} }

  const doUpdateTrip = async (d) => { try { await updateTrip(id, d); toast.success('✅ Updated!'); setShowEdit(false); loadTrip() } catch { toast.error('Failed') } }
  const doAddStop    = async (d) => { try { await addStop(id, d); toast.success('📍 Added!'); setShowStop(false); loadTrip() } catch { toast.error('Failed') } }
  const doDelStop    = async (sid, city) => { if (!window.confirm(`Remove ${city}?`)) return; try { await deleteStop(id, sid); toast.success('Removed'); loadTrip() } catch { toast.error('Failed') } }
  const doAddBudget  = async (d) => { try { await addBudgetItem(id, d); toast.success('💰 Added!'); setShowBudget(false); loadBudget() } catch { toast.error('Failed') } }
  const doDelBudget  = async (iid) => { if (!window.confirm('Delete?')) return; try { await deleteBudgetItem(id, iid); loadBudget() } catch { toast.error('Failed') } }
  const doAddCheck   = async (d) => { try { await addChecklistItem(id, d); toast.success('✅ Added!'); setShowChecklist(false); loadChecklist() } catch { toast.error('Failed') } }
  const doTogCheck   = async (iid, v) => { try { await updateChecklistItem(id, iid, { is_packed: v }); loadChecklist() } catch {} }
  const doDelCheck   = async (iid) => { if (!window.confirm('Delete?')) return; try { await deleteChecklistItem(id, iid); loadChecklist() } catch { toast.error('Failed') } }
  const doAddNote    = async (d) => { try { await addNote(id, d); toast.success('📝 Saved!'); setShowNote(false); loadNotes() } catch { toast.error('Failed') } }
  const doDelNote    = async (nid) => { if (!window.confirm('Delete?')) return; try { await deleteNote(id, nid); loadNotes() } catch { toast.error('Failed') } }
  const doShare      = async () => {
    const v = trip.visibility === 'public' ? 'private' : 'public'
    try {
      await updateTrip(id, { ...trip, visibility: v })
      if (v === 'public') { navigator.clipboard.writeText(`${window.location.origin}/public/trips/${id}`); toast.success('🔗 Public — link copied!') }
      else toast.success('🔒 Now private')
      loadTrip()
    } catch { toast.error('Failed') }
  }

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const dur = () => trip ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) : 0

  if (loading) return (
    <div className="space-y-5">
      <div className="h-60 skeleton rounded-3xl" />
      <div className="h-12 skeleton rounded-2xl" />
      <div className="h-64 skeleton rounded-3xl" />
    </div>
  )
  if (!trip) return null

  return (
    <div className="space-y-5">
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/my-trips"
          className="inline-flex items-center gap-2 text-sm font-bold text-sky-500 hover:text-sky-400 transition-colors group">
          <motion.span whileHover={{ x: -3 }}>←</motion.span>
          Back to My Trips
        </Link>
      </motion.div>

      {/* ── Banner ── */}
      <motion.div className="card overflow-hidden"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="relative h-52 sm:h-64">
          {trip.cover_image ? (
            <img src={`http://localhost:5000${trip.cover_image}`} alt={trip.trip_name}
              className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sky-400 via-ocean-500 to-candy-500 flex items-center justify-center">
              <motion.span className="text-8xl"
                animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity }}>✈️</motion.span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Visibility badge */}
          <div className="absolute top-4 left-4">
            <motion.span
              className={`sticker text-xs ${trip.visibility === 'public' ? 'bg-jungle-100 text-jungle-700 border-jungle-300' : 'bg-white/90 text-sky-700 border-sky-200'}`}
              animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity }}>
              {trip.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
            </motion.span>
          </div>

          {/* Title */}
          <div className="absolute bottom-4 left-5 right-5">
            <h1 className="font-display text-3xl font-bold text-white drop-shadow-lg">{trip.trip_name}</h1>
            {trip.description && <p className="text-white/80 text-sm mt-1 font-medium line-clamp-1">{trip.description}</p>}
          </div>
        </div>

        {/* Meta row */}
        <div className="px-5 py-4 flex items-center justify-between gap-3 flex-wrap border-t-2 border-theme">
          <div className="flex items-center gap-4 text-sm font-medium flex-wrap" style={{ color: 'var(--text-secondary)' }}>
            <span>📅 {fmt(trip.start_date)} → {fmt(trip.end_date)}</span>
            <span className="badge-sky">{dur()} days</span>
            <span>📍 {trip.destination_count} cities</span>
            <span>🎯 {trip.activity_count} activities</span>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <motion.button onClick={() => setShowEdit(true)} className="btn-secondary btn-sm"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              ✏️ Edit
            </motion.button>
            <motion.button onClick={doShare}
              className={`btn-sm ${trip.visibility === 'public' ? 'btn-secondary' : 'btn-primary'}`}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              {trip.visibility === 'public' ? '🔒 Make Private' : '🔗 Share'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <motion.div className="card overflow-hidden"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="tab-bar">
          {TABS.map((t) => (
            <motion.button key={t.key} onClick={() => setTab(t.key)}
              className={tab === t.key ? 'tab-item-active' : 'tab-item'}
              whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
              {t.label}
            </motion.button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {tab === 'itinerary' && (
                <ItineraryTab trip={trip} onAdd={() => setShowStop(true)} onDel={doDelStop} fmt={fmt} />
              )}
              {tab === 'budget' && (
                <BudgetTab budgetData={budget} onAddItem={() => setShowBudget(true)} onDeleteItem={doDelBudget} />
              )}
              {tab === 'checklist' && (
                <ChecklistTab checklistData={checklist} onAddItem={() => setShowChecklist(true)} onToggleItem={doTogCheck} onDeleteItem={doDelCheck} />
              )}
              {tab === 'notes' && (
                <NotesTab notes={notes} onAddNote={() => setShowNote(true)} onDeleteNote={doDelNote} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showEdit      && <EditTripModal trip={trip} onClose={() => setShowEdit(false)} onSubmit={doUpdateTrip} />}
        {showStop      && <AddStopModal onClose={() => setShowStop(false)} onSubmit={doAddStop} />}
        {showBudget    && <AddBudgetModal onClose={() => setShowBudget(false)} onSubmit={doAddBudget} />}
        {showChecklist && <AddChecklistModal onClose={() => setShowChecklist(false)} onSubmit={doAddCheck} />}
        {showNote      && <AddNoteModal onClose={() => setShowNote(false)} onSubmit={doAddNote} />}
      </AnimatePresence>
    </div>
  )
}

/* ── Itinerary Tab ── */
function ItineraryTab({ trip, onAdd, onDel, fmt }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-primary-color">🗺️ Itinerary</h3>
          <p className="section-subtitle">{trip.stops.length} destination{trip.stops.length !== 1 ? 's' : ''} planned</p>
        </div>
        <motion.button onClick={onAdd} className="btn-primary btn-sm"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          + Add City
        </motion.button>
      </div>

      {trip.stops.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📍</div>
          <p className="font-bold text-primary-color mb-1">No destinations yet!</p>
          <p className="text-sm text-muted-color mb-4 font-medium">Add cities to build your itinerary 🌍</p>
          <motion.button onClick={onAdd} className="btn-primary btn-sm" whileHover={{ scale: 1.05 }}>
            📍 Add First City
          </motion.button>
        </div>
      ) : (
        <div className="space-y-3">
          {trip.stops.map((stop, i) => (
            <motion.div key={stop._id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex gap-4 p-4 card-flat hover:border-sky-300 dark:hover:border-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-all group"
              whileHover={{ x: 3 }}
            >
              {/* Timeline */}
              <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                <motion.div
                  className="timeline-dot bg-gradient-to-br from-sky-500 to-ocean-500 text-white border-sky-300 shadow-glow-sky"
                  whileHover={{ scale: 1.2, rotate: 10 }}>
                  {i + 1}
                </motion.div>
                {i < trip.stops.length - 1 && <div className="timeline-line" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display font-bold text-primary-color text-base">
                      {stop.city_name}
                      <span className="font-normal text-muted-color">, {stop.country}</span>
                    </p>
                    {stop.arrival_date && stop.departure_date && (
                      <p className="text-xs text-muted-color mt-0.5 font-medium">
                        📅 {fmt(stop.arrival_date)} → {fmt(stop.departure_date)}
                      </p>
                    )}
                    {stop.activities?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {stop.activities.slice(0, 4).map((a) => (
                          <span key={a._id} className="badge-sky text-xs">{a.name}</span>
                        ))}
                        {stop.activities.length > 4 && (
                          <span className="badge-slate text-xs">+{stop.activities.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>
                  <motion.button onClick={() => onDel(stop._id, stop.city_name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity btn-danger btn-xs flex-shrink-0"
                    whileHover={{ scale: 1.05 }}>
                    Remove
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Edit Trip Modal ── */
function EditTripModal({ trip, onClose, onSubmit }) {
  const [form, setForm] = useState({
    trip_name: trip.trip_name, description: trip.description || '',
    start_date: trip.start_date?.split('T')[0] || '',
    end_date: trip.end_date?.split('T')[0] || '',
    visibility: trip.visibility
  })
  const [img, setImg] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onImg = (e) => { const f = e.target.files[0]; if (f) { setImg(f); setPreview(URL.createObjectURL(f)) } }
  const onSave = async (e) => { e.preventDefault(); setLoading(true); try { await onSubmit({ ...form, cover_image: img }) } finally { setLoading(false) } }

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal-box max-w-lg"
        initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
        <div className="modal-header">
          <div><h2 className="font-display text-xl font-bold text-primary-color">✏️ Edit Trip</h2></div>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>
        <form onSubmit={onSave} className="p-5 space-y-4">
          <div><label className="input-label">🗺️ Trip Name *</label>
            <input type="text" name="trip_name" value={form.trip_name} onChange={onChange} required className="input" /></div>
          <div><label className="input-label">📝 Description</label>
            <textarea name="description" value={form.description} onChange={onChange} rows="2" className="input resize-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="input-label">📅 Start *</label>
              <input type="date" name="start_date" value={form.start_date} onChange={onChange} required className="input" /></div>
            <div><label className="input-label">📅 End *</label>
              <input type="date" name="end_date" value={form.end_date} onChange={onChange} required className="input" /></div>
          </div>
          <div><label className="input-label">👁️ Visibility</label>
            <select name="visibility" value={form.visibility} onChange={onChange} className="input">
              <option value="private">🔒 Private</option>
              <option value="public">🌐 Public</option>
            </select></div>
          <div><label className="input-label">🖼️ Cover Image</label>
            {preview ? (
              <div className="relative h-24 rounded-2xl overflow-hidden border-2 border-theme">
                <img src={preview} className="w-full h-full object-cover" alt="preview" />
                <button type="button" onClick={() => { setPreview(null); setImg(null) }}
                  className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/60 text-white rounded-full text-xs font-bold hover:bg-black/80">✕</button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-16 border-2 border-dashed border-sky-300 dark:border-sky-700 rounded-2xl cursor-pointer hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all">
                <span className="text-xs text-muted-color font-medium">🖼️ Click to upload</span>
                <input type="file" accept="image/*" onChange={onImg} className="hidden" />
              </label>
            )}</div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <motion.button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : '✅ Save Changes'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

/* ── Add Stop Modal ── */
function AddStopModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ city_name: '', country: '', arrival_date: '', departure_date: '' })
  const [loading, setLoading] = useState(false)
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSave = async (e) => { e.preventDefault(); setLoading(true); try { await onSubmit(form) } finally { setLoading(false) } }

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal-box max-w-md"
        initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
        <div className="modal-header">
          <div><h2 className="font-display text-xl font-bold text-primary-color">📍 Add Destination</h2>
            <p className="text-xs text-muted-color mt-0.5 font-medium">Where are you going? 🌍</p></div>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>
        <form onSubmit={onSave} className="p-5 space-y-4">
          <div><label className="input-label">🏙️ City *</label>
            <input type="text" name="city_name" value={form.city_name} onChange={onChange} required className="input" placeholder="e.g., Paris 🗼" /></div>
          <div><label className="input-label">🌍 Country *</label>
            <input type="text" name="country" value={form.country} onChange={onChange} required className="input" placeholder="e.g., France" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="input-label">✈️ Arrival</label>
              <input type="date" name="arrival_date" value={form.arrival_date} onChange={onChange} className="input" /></div>
            <div><label className="input-label">🛫 Departure</label>
              <input type="date" name="departure_date" value={form.departure_date} onChange={onChange} className="input" /></div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <motion.button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding…</> : '📍 Add City'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
