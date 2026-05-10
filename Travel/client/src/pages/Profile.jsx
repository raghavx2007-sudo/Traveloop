import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  getProfile, updateProfile, uploadAvatar,
  changePassword, updateNotifications, updatePrivacy
} from '../services/profileService'
import toast from 'react-hot-toast'

const Toggle = ({ checked, onChange, label, desc }) => (
  <div className="flex items-center justify-between py-3 border-b-2 border-theme last:border-0">
    <div>
      <p className="text-sm font-bold text-primary-color">{label}</p>
      {desc && <p className="text-xs text-muted-color mt-0.5 font-medium">{desc}</p>}
    </div>
    <motion.button type="button" onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${checked ? 'bg-sky-500' : 'bg-gray-300'}`}
      whileTap={{ scale: 0.95 }}>
      <motion.span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
        animate={{ left: checked ? '22px' : '2px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </motion.button>
  </div>
)

const Section = ({ icon, title, desc, open, onToggle, children }) => (
  <div className="card-flat overflow-hidden transition-all duration-300">
    <motion.button onClick={onToggle}
      className="w-full flex items-center gap-3 p-4 text-left group"
      whileHover={{ backgroundColor: 'rgba(56,189,248,0.05)' }}>
      <motion.span className="text-xl w-8 text-center flex-shrink-0"
        whileHover={{ scale: 1.3, rotate: 10 }} transition={{ type: 'spring', stiffness: 400 }}>
        {icon}
      </motion.span>
      <div className="flex-1">
        <p className="text-sm font-bold text-primary-color">{title}</p>
        <p className="text-xs text-muted-color mt-0.5 font-medium">{desc}</p>
      </div>
      <motion.span className="text-muted-color text-sm font-bold"
        animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>›</motion.span>
    </motion.button>
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden border-t-2 border-theme"
        >
          <div className="px-5 pb-5 pt-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

export default function Profile() {
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [nameForm, setNameForm] = useState({ name: '' })
  const [uploading, setUploading] = useState(false)
  const [openSection, setOpenSection] = useState(null)
  const toggle = (key) => setOpenSection(prev => prev === key ? null : key)

  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')

  const [notifs, setNotifs] = useState({ email_trips: true, email_reminders: true, email_community: false })
  const [notifSaving, setNotifSaving] = useState(false)

  const [privacy, setPrivacy] = useState({ show_profile: 'public', show_trips: 'public', allow_community: true })
  const [privSaving, setPrivSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const r = await getProfile()
      setProfile(r.data.user); setStats(r.data.stats)
      setNameForm({ name: r.data.user.name })
      if (r.data.user.notifications) setNotifs(r.data.user.notifications)
      if (r.data.user.privacy) setPrivacy(r.data.user.privacy)
    } catch { toast.error('Failed to load profile') }
    finally { setLoading(false) }
  }

  const handleUpdateName = async (e) => {
    e.preventDefault()
    try {
      const r = await updateProfile(nameForm)
      setProfile(r.data); setUser(r.data); setEditing(false)
      toast.success('✅ Name updated!')
    } catch { toast.error('Failed') }
  }

  const handleAvatar = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5 MB'); return }
    setUploading(true)
    try {
      const r = await uploadAvatar(file)
      setProfile(r.data); setUser(r.data)
      toast.success('📷 Profile picture updated!')
    } catch { toast.error('Failed') }
    finally { setUploading(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault(); setPwError('')
    if (pwForm.new_password !== pwForm.confirm_password) { setPwError('Passwords do not match! 🙈'); return }
    if (pwForm.new_password.length < 6) { setPwError('Min. 6 characters 🔐'); return }
    setPwLoading(true)
    try {
      await changePassword({ current_password: pwForm.current_password, new_password: pwForm.new_password })
      toast.success('🔑 Password changed!')
      setPwForm({ current_password: '', new_password: '', confirm_password: '' })
      setOpenSection(null)
    } catch (err) { setPwError(err.response?.data?.message || 'Failed') }
    finally { setPwLoading(false) }
  }

  const handleSaveNotifs = async () => {
    setNotifSaving(true)
    try { await updateNotifications(notifs); toast.success('🔔 Preferences saved!') }
    catch { toast.error('Failed') }
    finally { setNotifSaving(false) }
  }

  const handleSavePrivacy = async () => {
    setPrivSaving(true)
    try { await updatePrivacy(privacy); toast.success('🛡️ Privacy settings saved!') }
    catch { toast.error('Failed') }
    finally { setPrivSaving(false) }
  }

  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0)
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  if (loading) return (
    <div className="space-y-5">
      <div className="h-36 skeleton rounded-3xl" />
      <div className="grid grid-cols-3 gap-4">{[...Array(6)].map((_,i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}</div>
      <div className="h-48 skeleton rounded-3xl" />
    </div>
  )

  const statCards = [
    { label: 'Total Trips',  value: stats?.total_trips || 0,       emoji: '✈️', gradient: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' },
    { label: 'Countries',    value: stats?.countries_visited || 0, emoji: '🌍', gradient: 'linear-gradient(135deg,#22c55e,#06b6d4)' },
    { label: 'Cities',       value: stats?.cities_visited || 0,    emoji: '🏙️', gradient: 'linear-gradient(135deg,#a855f7,#0ea5e9)' },
    { label: 'Total Budget', value: fmt(stats?.total_budget),      emoji: '💰', gradient: 'linear-gradient(135deg,#f59e0b,#f97316)' },
    { label: 'Total Spent',  value: fmt(stats?.total_spent),       emoji: '💸', gradient: 'linear-gradient(135deg,#f43f5e,#f97316)' },
    { label: 'Savings',      value: fmt((stats?.total_budget||0)-(stats?.total_spent||0)), emoji: '📊', gradient: 'linear-gradient(135deg,#06b6d4,#a855f7)' },
  ]

  return (
    <div className="space-y-6 page-enter">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-primary-color">👤 Profile</h1>
        <p className="text-muted-color text-sm font-medium mt-0.5">Manage your account and travel stats</p>
      </motion.div>

      {/* ── Profile card ── */}
      <motion.div className="card p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {profile?.profile_image ? (
              <img src={`http://localhost:5000${profile.profile_image}`} alt={profile.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-sky-200" />
            ) : (
              <motion.div
                className="w-24 h-24 rounded-3xl flex items-center justify-center border-4 border-sky-200"
                style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}
                whileHover={{ scale: 1.05, rotate: 3 }}>
                <span className="text-4xl font-bold text-white">{profile?.name?.charAt(0).toUpperCase()}</span>
              </motion.div>
            )}
            <label className={`absolute -bottom-2 -right-2 w-9 h-9 bg-sky-500 text-white rounded-2xl flex items-center justify-center cursor-pointer hover:bg-sky-400 transition-all shadow-lg hover:scale-110 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" disabled={uploading} />
              {uploading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '📷'}
            </label>
          </div>

          {/* Info */}
          <div className="flex-1">
            {editing ? (
              <form onSubmit={handleUpdateName} className="space-y-3">
                <div>
                  <label className="input-label">🧑 Display Name</label>
                  <input type="text" value={nameForm.name}
                    onChange={(e) => setNameForm({ name: e.target.value })}
                    className="input max-w-xs" autoFocus />
                </div>
                <div className="flex gap-2">
                  <motion.button type="submit" className="btn-primary btn-sm" whileHover={{ scale: 1.05 }}>✅ Save</motion.button>
                  <button type="button" onClick={() => { setEditing(false); setNameForm({ name: profile.name }) }}
                    className="btn-secondary btn-sm">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-display text-2xl font-bold text-primary-color">{profile?.name}</h2>
                  <motion.button onClick={() => setEditing(true)}
                    className="badge-sky text-xs cursor-pointer"
                    whileHover={{ scale: 1.05 }}>✏️ Edit</motion.button>
                </div>
                <p className="text-sm font-medium text-muted-color">📧 {profile?.email}</p>
                <p className="text-xs text-muted-color mt-1 font-medium">🗓️ Member since {fmtDate(profile?.created_at)}</p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Travel stats ── */}
      <motion.div className="card p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 className="font-display text-xl font-bold text-primary-color mb-5">🌍 Travel Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statCards.map((s, i) => (
            <motion.div key={i}
              className="rounded-2xl p-4 text-white relative overflow-hidden"
              style={{ background: s.gradient }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ scale: 1.04, y: -3 }}>
              <div className="absolute -right-3 -top-3 text-5xl opacity-20 select-none">{s.emoji}</div>
              <motion.div className="text-2xl mb-1"
                animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}>
                {s.emoji}
              </motion.div>
              <p className="text-white/80 text-xs font-bold">{s.label}</p>
              <p className="font-display text-xl font-bold mt-0.5">{s.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Account Settings ── */}
      <motion.div className="card p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="font-display text-xl font-bold text-primary-color mb-4">⚙️ Account Settings</h3>
        <div className="space-y-2">

          {/* Change Password */}
          <Section icon="🔑" title="Change Password" desc="Update your login password"
            open={openSection === 'password'} onToggle={() => toggle('password')}>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {pwError && (
                <motion.div className="p-3.5 bg-red-50 border-2 border-red-200 text-red-600 rounded-2xl text-sm font-bold"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  ⚠️ {pwError}
                </motion.div>
              )}
              <div>
                <label className="input-label">🔒 Current Password</label>
                <input type="password" value={pwForm.current_password}
                  onChange={(e) => { setPwForm({ ...pwForm, current_password: e.target.value }); setPwError('') }}
                  className="input" placeholder="Enter current password" required />
              </div>
              <div>
                <label className="input-label">🔑 New Password</label>
                <input type="password" value={pwForm.new_password}
                  onChange={(e) => { setPwForm({ ...pwForm, new_password: e.target.value }); setPwError('') }}
                  className="input" placeholder="Min. 6 characters" required />
              </div>
              <div>
                <label className="input-label">🔑 Confirm New Password</label>
                <input type="password" value={pwForm.confirm_password}
                  onChange={(e) => { setPwForm({ ...pwForm, confirm_password: e.target.value }); setPwError('') }}
                  className="input" placeholder="Repeat new password" required />
              </div>
              <div className="flex gap-2 pt-1">
                <motion.button type="submit" disabled={pwLoading} className="btn-primary btn-sm disabled:opacity-60"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  {pwLoading ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : '🔑 Update Password'}
                </motion.button>
                <button type="button" onClick={() => { setOpenSection(null); setPwForm({ current_password: '', new_password: '', confirm_password: '' }); setPwError('') }}
                  className="btn-secondary btn-sm">Cancel</button>
              </div>
            </form>
          </Section>

          {/* Notifications */}
          <Section icon="🔔" title="Notifications" desc="Manage email preferences"
            open={openSection === 'notifications'} onToggle={() => toggle('notifications')}>
            <div>
              <Toggle checked={notifs.email_trips} onChange={(v) => setNotifs({ ...notifs, email_trips: v })}
                label="Trip updates" desc="Get notified about changes to your trips" />
              <Toggle checked={notifs.email_reminders} onChange={(v) => setNotifs({ ...notifs, email_reminders: v })}
                label="Travel reminders" desc="Reminders before your upcoming trips" />
              <Toggle checked={notifs.email_community} onChange={(v) => setNotifs({ ...notifs, email_community: v })}
                label="Community activity" desc="When someone views your shared trips" />
              <div className="pt-4">
                <motion.button onClick={handleSaveNotifs} disabled={notifSaving} className="btn-primary btn-sm disabled:opacity-60"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  {notifSaving ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : '🔔 Save Preferences'}
                </motion.button>
              </div>
            </div>
          </Section>

          {/* Privacy */}
          <Section icon="🛡️" title="Privacy" desc="Control your data and visibility"
            open={openSection === 'privacy'} onToggle={() => toggle('privacy')}>
            <div className="space-y-4">
              <div>
                <label className="input-label">👁️ Profile Visibility</label>
                <select value={privacy.show_profile} onChange={(e) => setPrivacy({ ...privacy, show_profile: e.target.value })} className="input">
                  <option value="public">🌐 Public — anyone can see your profile</option>
                  <option value="private">🔒 Private — only you</option>
                </select>
              </div>
              <div>
                <label className="input-label">✈️ Trip Visibility Default</label>
                <select value={privacy.show_trips} onChange={(e) => setPrivacy({ ...privacy, show_trips: e.target.value })} className="input">
                  <option value="public">🌐 Public — visible to everyone</option>
                  <option value="friends">👥 Friends only</option>
                  <option value="private">🔒 Private — only you</option>
                </select>
              </div>
              <Toggle checked={privacy.allow_community} onChange={(v) => setPrivacy({ ...privacy, allow_community: v })}
                label="Appear in Community" desc="Allow public trips to show in Community page" />
              <motion.button onClick={handleSavePrivacy} disabled={privSaving} className="btn-primary btn-sm disabled:opacity-60"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {privSaving ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : '🛡️ Save Settings'}
              </motion.button>
            </div>
          </Section>

        </div>
      </motion.div>
    </div>
  )
}
