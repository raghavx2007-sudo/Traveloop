import { useState } from 'react'
import { motion } from 'framer-motion'

const Field = ({ label, children }) => (
  <div><label className="input-label">{label}</label>{children}</div>
)

const ModalWrapper = ({ title, subtitle, onClose, children }) => (
  <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.div className="modal-box max-w-md"
      initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.8, y: 30 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
      <div className="modal-header">
        <div>
          <h2 className="font-display text-xl font-bold text-primary-color">{title}</h2>
          {subtitle && <p className="text-xs text-muted-color mt-0.5 font-medium">{subtitle}</p>}
        </div>
        <button onClick={onClose} className="modal-close">✕</button>
      </div>
      {children}
    </motion.div>
  </motion.div>
)

export const AddBudgetModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({ category: 'transport', item_name: '', estimated_cost: '', actual_cost: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSave = async (e) => { e.preventDefault(); setLoading(true); try { await onSubmit(form) } finally { setLoading(false) } }

  return (
    <ModalWrapper title="💰 Add Budget Item" subtitle="Track an expense for this trip" onClose={onClose}>
      <form onSubmit={onSave} className="p-5 space-y-4">
        <Field label="🏷️ Category *">
          <select name="category" value={form.category} onChange={onChange} required className="input">
            <option value="transport">🚗 Transport</option>
            <option value="accommodation">🏨 Accommodation</option>
            <option value="food">🍜 Food</option>
            <option value="activities">🎯 Activities</option>
            <option value="shopping">🛍️ Shopping</option>
            <option value="other">📦 Other</option>
          </select>
        </Field>
        <Field label="📝 Item Name *">
          <input type="text" name="item_name" value={form.item_name} onChange={onChange} required className="input" placeholder="e.g., Flight tickets ✈️" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="💵 Estimated *">
            <input type="number" name="estimated_cost" value={form.estimated_cost} onChange={onChange} required min="0" step="0.01" className="input" placeholder="0.00" />
          </Field>
          <Field label="💸 Actual">
            <input type="number" name="actual_cost" value={form.actual_cost} onChange={onChange} min="0" step="0.01" className="input" placeholder="0.00" />
          </Field>
        </div>
        <Field label="📋 Notes">
          <textarea name="notes" value={form.notes} onChange={onChange} rows="2" className="input resize-none" placeholder="Optional details…" />
        </Field>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <motion.button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding…</> : '💰 Add Item'}
          </motion.button>
        </div>
      </form>
    </ModalWrapper>
  )
}

export const AddChecklistModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({ item_name: '', category: 'essentials' })
  const [loading, setLoading] = useState(false)
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSave = async (e) => { e.preventDefault(); setLoading(true); try { await onSubmit(form) } finally { setLoading(false) } }

  return (
    <ModalWrapper title="🎒 Add Checklist Item" subtitle="Add something to pack" onClose={onClose}>
      <form onSubmit={onSave} className="p-5 space-y-4">
        <Field label="📝 Item Name *">
          <input type="text" name="item_name" value={form.item_name} onChange={onChange} required className="input" placeholder="e.g., Passport 📄" />
        </Field>
        <Field label="🏷️ Category *">
          <select name="category" value={form.category} onChange={onChange} required className="input">
            <option value="clothing">👕 Clothing</option>
            <option value="electronics">📱 Electronics</option>
            <option value="documents">📄 Documents</option>
            <option value="essentials">🎒 Essentials</option>
            <option value="toiletries">🧴 Toiletries</option>
            <option value="other">📦 Other</option>
          </select>
        </Field>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <motion.button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding…</> : '✅ Add Item'}
          </motion.button>
        </div>
      </form>
    </ModalWrapper>
  )
}

export const AddNoteModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({ note: '', note_date: '' })
  const [loading, setLoading] = useState(false)
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSave = async (e) => { e.preventDefault(); setLoading(true); try { await onSubmit(form) } finally { setLoading(false) } }

  return (
    <ModalWrapper title="📝 Add Note" subtitle="Capture a thought or reminder" onClose={onClose}>
      <form onSubmit={onSave} className="p-5 space-y-4">
        <Field label="✍️ Note *">
          <textarea name="note" value={form.note} onChange={onChange} required rows="5" className="input resize-none" placeholder="Write your travel note here… 🌟" />
        </Field>
        <Field label="📅 Date (optional)">
          <input type="date" name="note_date" value={form.note_date} onChange={onChange} className="input" />
        </Field>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <motion.button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : '📝 Save Note'}
          </motion.button>
        </div>
      </form>
    </ModalWrapper>
  )
}
