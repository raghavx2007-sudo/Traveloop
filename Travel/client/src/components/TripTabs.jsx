import { motion } from 'framer-motion'

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }),
}

/* ── Budget Tab ── */
export const BudgetTab = ({ budgetData, onAddItem, onDeleteItem }) => {
  const cats = [
    { key: 'transport',     label: 'Transport',     icon: '🚗' },
    { key: 'accommodation', label: 'Stay',          icon: '🏨' },
    { key: 'food',          label: 'Food',          icon: '🍜' },
    { key: 'activities',    label: 'Activities',    icon: '🎯' },
    { key: 'shopping',      label: 'Shopping',      icon: '🛍️' },
    { key: 'other',         label: 'Other',         icon: '📦' },
  ]
  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0)
  const est  = budgetData.overall?.total_estimated || 0
  const act  = budgetData.overall?.total_actual    || 0
  const over = act > est && est > 0
  const pct  = est > 0 ? Math.min(Math.round((act / est) * 100), 100) : 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-primary-color">💰 Budget Tracker</h3>
          <p className="section-subtitle">Track your travel expenses</p>
        </div>
        <motion.button onClick={onAddItem} className="btn-primary btn-sm"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          + Add Item
        </motion.button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Estimated', value: fmt(est), gradient: 'from-sky-500 to-ocean-500', emoji: '📋' },
          { label: 'Actual',    value: fmt(act), gradient: 'from-jungle-500 to-ocean-400', emoji: '💸' },
          { label: over ? '⚠️ Over' : 'Remaining', value: fmt(Math.abs(est - act)),
            gradient: over ? 'from-coral-500 to-sunset-500' : 'from-candy-500 to-sky-500', emoji: over ? '🚨' : '🎉' },
        ].map((s, i) => (
          <motion.div key={i}
            className={`rounded-2xl p-4 text-white bg-gradient-to-br ${s.gradient} shadow-lg`}
            whileHover={{ scale: 1.03, y: -2 }}>
            <div className="text-xl mb-1">{s.emoji}</div>
            <p className="text-white/80 text-xs font-bold">{s.label}</p>
            <p className="font-display text-lg font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      {est > 0 && (
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            <span>Budget used</span><span>{pct}%</span>
          </div>
          <div className="progress-bar h-3">
            <motion.div className={`h-3 rounded-full ${over ? 'bg-gradient-to-r from-coral-500 to-sunset-500' : 'bg-gradient-to-r from-sky-500 to-ocean-400'}`}
              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
        </div>
      )}

      {budgetData.items.length === 0 ? (
        <div className="empty-state py-10">
          <div className="empty-icon">💰</div>
          <p className="font-bold text-primary-color mb-1">No budget items yet</p>
          <p className="text-sm text-muted-color mb-4 font-medium">Start tracking your expenses!</p>
          <motion.button onClick={onAddItem} className="btn-primary btn-sm" whileHover={{ scale: 1.05 }}>
            + Add First Item
          </motion.button>
        </div>
      ) : (
        <div className="space-y-3">
          {cats.map(cat => {
            const items = budgetData.items.filter(i => i.category === cat.key)
            if (!items.length) return null
            return (
              <div key={cat.key} className="card-flat overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 dark:bg-sky-900/20 border-b-2 border-theme">
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-sm font-bold text-primary-color">{cat.label}</span>
                  <span className="ml-auto text-xs text-muted-color font-medium">{items.length} item{items.length > 1 ? 's' : ''}</span>
                </div>
                <div className="divide-y-2 divide-theme">
                  {items.map((item, i) => (
                    <motion.div key={item._id} custom={i} variants={itemVariants} initial="hidden" animate="show"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-colors group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-primary-color">{item.item_name}</p>
                        {item.notes && <p className="text-xs text-muted-color truncate font-medium">{item.notes}</p>}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-muted-color font-medium">Est.</p>
                          <p className="text-sm font-bold text-primary-color">{fmt(item.estimated_cost)}</p>
                        </div>
                        {item.actual_cost != null && (
                          <div className="text-right">
                            <p className="text-xs text-muted-color font-medium">Actual</p>
                            <p className="text-sm font-bold text-jungle-500">{fmt(item.actual_cost)}</p>
                          </div>
                        )}
                        <motion.button onClick={() => onDeleteItem(item._id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold"
                          whileHover={{ scale: 1.2 }}>✕</motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Checklist Tab ── */
export const ChecklistTab = ({ checklistData, onAddItem, onToggleItem, onDeleteItem }) => {
  const cats = [
    { key: 'clothing',    label: 'Clothing',    icon: '👕' },
    { key: 'electronics', label: 'Electronics', icon: '📱' },
    { key: 'documents',   label: 'Documents',   icon: '📄' },
    { key: 'essentials',  label: 'Essentials',  icon: '🎒' },
    { key: 'toiletries',  label: 'Toiletries',  icon: '🧴' },
    { key: 'other',       label: 'Other',       icon: '📦' },
  ]
  const { total = 0, packed = 0, progress = 0 } = checklistData.stats || {}

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-primary-color">🎒 Packing Checklist</h3>
          <p className="section-subtitle">Never forget anything!</p>
        </div>
        <motion.button onClick={onAddItem} className="btn-primary btn-sm"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          + Add Item
        </motion.button>
      </div>

      {total > 0 && (
        <div className="card-flat p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-primary-color">Packing Progress 🧳</span>
            <span className="text-sm font-bold text-sky-500">{packed}/{total} ({progress}%)</span>
          </div>
          <div className="progress-bar h-3">
            <motion.div className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-ocean-400"
              initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
          {progress === 100 && (
            <motion.p className="text-sm font-bold text-jungle-500 mt-2 text-center"
              animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>
              🎉 All packed! Ready to go!
            </motion.p>
          )}
        </div>
      )}

      {checklistData.items.length === 0 ? (
        <div className="empty-state py-10">
          <div className="empty-icon">✅</div>
          <p className="font-bold text-primary-color mb-1">Checklist is empty</p>
          <p className="text-sm text-muted-color mb-4 font-medium">Add items to pack!</p>
          <motion.button onClick={onAddItem} className="btn-primary btn-sm" whileHover={{ scale: 1.05 }}>
            + Add First Item
          </motion.button>
        </div>
      ) : (
        <div className="space-y-3">
          {cats.map(cat => {
            const items = checklistData.items.filter(i => i.category === cat.key)
            if (!items.length) return null
            const catPacked = items.filter(i => i.is_packed).length
            return (
              <div key={cat.key} className="card-flat overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-sky-50 dark:bg-sky-900/20 border-b-2 border-theme">
                  <span className="text-sm font-bold text-primary-color flex items-center gap-2">{cat.icon} {cat.label}</span>
                  <span className="text-xs text-muted-color font-medium">{catPacked}/{items.length}</span>
                </div>
                <div className="divide-y-2 divide-theme">
                  {items.map((item, i) => (
                    <motion.div key={item._id} custom={i} variants={itemVariants} initial="hidden" animate="show"
                      className={`flex items-center gap-3 px-4 py-3 transition-colors group ${item.is_packed ? 'bg-jungle-50 dark:bg-jungle-900/10' : 'hover:bg-sky-50 dark:hover:bg-sky-900/10'}`}>
                      <motion.button onClick={() => onToggleItem(item._id, !item.is_packed)}
                        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.is_packed ? 'bg-jungle-500 border-jungle-500 text-white' : 'border-sky-300 hover:border-sky-500'}`}
                        whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                        {item.is_packed && <span className="text-xs font-bold">✓</span>}
                      </motion.button>
                      <span className={`flex-1 text-sm font-medium transition-all ${item.is_packed ? 'line-through text-muted-color' : 'text-primary-color'}`}>
                        {item.item_name}
                      </span>
                      <motion.button onClick={() => onDeleteItem(item._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold"
                        whileHover={{ scale: 1.2 }}>✕</motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Notes Tab ── */
export const NotesTab = ({ notes, onAddNote, onDeleteNote }) => {
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null
  const fmtTime = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-primary-color">📝 Travel Notes</h3>
          <p className="section-subtitle">Your journal & reminders</p>
        </div>
        <motion.button onClick={onAddNote} className="btn-primary btn-sm"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          + Add Note
        </motion.button>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state py-10">
          <div className="empty-icon">📝</div>
          <p className="font-bold text-primary-color mb-1">No notes yet</p>
          <p className="text-sm text-muted-color mb-4 font-medium">Capture your travel thoughts!</p>
          <motion.button onClick={onAddNote} className="btn-primary btn-sm" whileHover={{ scale: 1.05 }}>
            ✍️ Write First Note
          </motion.button>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note, i) => (
            <motion.div key={note._id} custom={i} variants={itemVariants} initial="hidden" animate="show"
              className="card-flat p-5 hover:border-sky-300 dark:hover:border-sky-600 transition-all group"
              whileHover={{ y: -2 }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-400 to-ocean-500 flex items-center justify-center text-base flex-shrink-0"
                    whileHover={{ rotate: 10 }}>📝</motion.div>
                  <div>
                    {fmtDate(note.note_date) && (
                      <p className="text-sm font-bold text-sky-500">{fmtDate(note.note_date)}</p>
                    )}
                    <p className="text-xs text-muted-color font-medium">{fmtTime(note.createdAt || note.created_at)}</p>
                  </div>
                </div>
                <motion.button onClick={() => onDeleteNote(note._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold"
                  whileHover={{ scale: 1.2 }}>✕</motion.button>
              </div>
              <p className="text-sm text-primary-color leading-relaxed whitespace-pre-wrap font-medium">{note.note}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
