import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import toast from 'react-hot-toast'

/**
 * Explore Page
 * Browse and manage the activity catalog.
 * All data is real — no hardcoded values.
 */
const Explore = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const categories = [
    { value: 'all',         label: 'All',          icon: '🌟' },
    { value: 'sightseeing', label: 'Sightseeing',   icon: '🏛️' },
    { value: 'food',        label: 'Food & Dining', icon: '🍜' },
    { value: 'adventure',   label: 'Adventure',     icon: '🧗' },
    { value: 'nightlife',   label: 'Nightlife',     icon: '🎉' },
    { value: 'nature',      label: 'Nature',        icon: '🌿' },
    { value: 'culture',     label: 'Culture',       icon: '🎭' },
    { value: 'shopping',    label: 'Shopping',      icon: '🛍️' },
    { value: 'other',       label: 'Other',         icon: '📦' },
  ]

  useEffect(() => {
    loadActivities()
  }, [selectedCategory, searchTerm])

  const loadActivities = async () => {
    try {
      setLoading(true)
      const params = {}
      if (selectedCategory !== 'all') params.category = selectedCategory
      if (searchTerm) params.search = searchTerm
      const response = await api.get('/activities', { params })
      setActivities(response.data.data || [])
    } catch (error) {
      console.error('Error loading activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddActivity = async (formData) => {
    try {
      await api.post('/activities', formData)
      toast.success('Activity added to catalog!')
      setShowAddModal(false)
      loadActivities()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add activity')
    }
  }

  const handleDeleteActivity = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from the catalog?`)) return
    try {
      await api.delete(`/activities/${id}`)
      toast.success('Activity removed')
      loadActivities()
    } catch (error) {
      toast.error('Failed to remove activity')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const formatDuration = (minutes) => {
    if (!minutes) return 'Varies'
    if (minutes < 60) return `${minutes} min`
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }

  const getCategoryIcon = (category) => {
    const found = categories.find(c => c.value === category)
    return found ? found.icon : '🎯'
  }

  return (
    <div className="space-y-5 page-enter">
      {/* Header */}
      <motion.div className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-color">🔭 Explore Activities</h1>
          <p className="text-muted-color text-sm font-medium mt-0.5">Build your catalog, then assign to destinations</p>
        </div>
        <motion.button onClick={() => setShowAddModal(true)} className="btn-primary btn-sm"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          + Add Activity
        </motion.button>
      </motion.div>

      {/* Activities Section */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold text-primary-color">🎯 Activity Catalog</h3>
          <motion.button onClick={() => setShowAddModal(true)} className="btn-primary btn-xs"
            whileHover={{ scale: 1.05 }}>+ Add</motion.button>
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">🔍</span>
          <input type="text" placeholder="Search activities…"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10" />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-5">
          {categories.map((cat) => (
            <motion.button key={cat.value} onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all border-2 ${
                selectedCategory === cat.value
                  ? 'bg-sky-500 text-white border-sky-500 shadow-glow-sky'
                  : 'border-theme text-muted-color hover:border-sky-300 hover:text-sky-500'
              }`}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <span>{cat.icon}</span><span>{cat.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="empty-state py-16">
            <div className="empty-icon">🎯</div>
            <p className="font-bold text-primary-color mb-1">
              {searchTerm || selectedCategory !== 'all' ? 'No activities found!' : 'No activities yet!'}
            </p>
            <p className="text-sm text-muted-color mt-1 mb-6 font-medium">
              {searchTerm || selectedCategory !== 'all' ? 'Try a different search ✨' : 'Add activities to assign them to destinations 🌟'}
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <motion.button onClick={() => setShowAddModal(true)} className="btn-primary"
                whileHover={{ scale: 1.05 }}>
                🎯 Add First Activity
              </motion.button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-color mb-4 font-medium">
              {activities.length} {activities.length === 1 ? 'activity' : 'activities'} found
            </p>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial="hidden" animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
              {activities.map((activity) => (
                <motion.div key={activity._id}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  className="card-flat overflow-hidden group"
                  whileHover={{ y: -4, scale: 1.02 }}>
                  <div className="h-24 bg-gradient-to-br from-sky-100 to-ocean-100 dark:from-sky-900/30 dark:to-ocean-900/30 flex items-center justify-center">
                    <motion.span className="text-5xl" whileHover={{ scale: 1.2, rotate: 10 }}>
                      {getCategoryIcon(activity.category)}
                    </motion.span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <span className="badge-sky text-xs capitalize">{activity.category}</span>
                      <motion.button onClick={() => handleDeleteActivity(activity._id, activity.name)}
                        className="text-red-400 hover:text-red-500 text-xs font-bold transition-colors"
                        whileHover={{ scale: 1.2 }}>✕</motion.button>
                    </div>
                    <h3 className="font-bold text-primary-color mt-2 mb-1">{activity.name}</h3>
                    {activity.description && (
                      <p className="text-xs text-muted-color mb-3 line-clamp-2 font-medium">{activity.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-muted-color">⏱️ {formatDuration(activity.duration)}</span>
                      <span className="text-sky-500">
                        {activity.avg_cost > 0 ? `~${formatCurrency(activity.avg_cost)}` : '🆓 Free'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* CTA */}
      <motion.div className="card p-6 text-center bg-gradient-to-br from-sky-50 to-ocean-50 dark:from-sky-900/20 dark:to-ocean-900/20 border-sky-200 dark:border-sky-700/40"
        whileHover={{ scale: 1.01 }}>
        <motion.div className="text-4xl mb-3" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>🗺️</motion.div>
        <h3 className="font-display text-xl font-bold text-primary-color mb-1">Ready to Build Your Itinerary?</h3>
        <p className="text-sm text-muted-color mb-4 font-medium">Create a trip, add destinations, then assign activities!</p>
        <Link to="/my-trips">
          <motion.button className="btn-primary btn-sm" whileHover={{ scale: 1.05 }}>✈️ Create a Trip</motion.button>
        </Link>
      </motion.div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <AddActivityModal
          categories={categories.filter(c => c.value !== 'all')}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddActivity}
        />
      )}
    </div>
  )
}

// Add Activity Modal
const AddActivityModal = ({ categories, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', category: 'sightseeing', avg_cost: '', duration: '', description: '' })
  const [loading, setLoading] = useState(false)
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await onSubmit({ ...formData, avg_cost: formData.avg_cost ? parseFloat(formData.avg_cost) : 0, duration: formData.duration ? parseInt(formData.duration) : 60 })
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box max-w-lg">
        <div className="modal-header">
          <div><h2 className="text-base font-bold text-primary-color">Add Activity</h2></div>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div><label className="input-label">Activity Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input" placeholder="e.g., Sunset Boat Tour" /></div>
          <div><label className="input-label">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="input">
              {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="input-label">Avg Cost (USD)</label>
              <input type="number" name="avg_cost" value={formData.avg_cost} onChange={handleChange} min="0" step="0.01" className="input" placeholder="0.00" /></div>
            <div><label className="input-label">Duration (min)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" className="input" placeholder="60" /></div>
          </div>
          <div><label className="input-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="input resize-none" placeholder="Describe this activity…" /></div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Adding…</> : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Explore
