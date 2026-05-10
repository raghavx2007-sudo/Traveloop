import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const onChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErr('') }
  const onSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setErr('Passwords do not match! 🙈'); return }
    if (form.password.length < 6) { setErr('Password needs at least 6 characters 🔐'); return }
    setLoading(true)
    const r = await register(form.name, form.email, form.password)
    if (r.success) navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex overflow-hidden relative">
      {/* Dark cinematic background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #020817 0%, #0a0520 40%, #050c1a 100%)'
      }} />

      {/* Aurora */}
      <motion.div className="absolute inset-0 opacity-25"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(168,85,247,0.2) 30%, rgba(14,165,233,0.15) 60%, transparent 100%)',
          backgroundSize: '300% 300%',
        }}
      />

      {/* Stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${(i * 2.5) % 100}%`, top: `${(i * 2.3) % 100}%`, width: 1, height: 1 }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2 + (i % 3), delay: i * 0.1, repeat: Infinity }}
        />
      ))}

      {/* Floating stickers */}
      {['🌟', '🎒', '🗺️', '✈️', '🌴', '🎫', '🧭', '🌈'].map((e, i) => (
        <motion.div key={i}
          className="absolute text-2xl pointer-events-none select-none"
          style={{ left: `${(i * 12.5) % 95}%`, top: `${(i * 17) % 85}%` }}
          animate={{ y: [0, -12, 0], rotate: [-6, 6, -6], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3 + i * 0.5, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        >{e}</motion.div>
      ))}

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <motion.div className="text-6xl inline-block"
              animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity }}>🧳</motion.div>
            <h1 className="font-display text-4xl font-bold text-white mt-2">Join Traveloop</h1>
            <p className="text-sky-400 text-sm mt-1">Start your adventure today ✨</p>
          </div>

          {/* Form card */}
          <div className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(13,21,38,0.85)',
              border: '1.5px solid rgba(168,85,247,0.2)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)' }} />

            <div className="p-8">
              <form onSubmit={onSubmit} className="space-y-4">
                {[
                  { name: 'name',            type: 'text',     label: '👤 Full Name',       placeholder: 'Your explorer name' },
                  { name: 'email',           type: 'email',    label: '📧 Email',            placeholder: 'explorer@traveloop.com' },
                  { name: 'password',        type: 'password', label: '🔑 Password',         placeholder: '••••••••' },
                  { name: 'confirmPassword', type: 'password', label: '🔒 Confirm Password', placeholder: '••••••••' },
                ].map((field, i) => (
                  <motion.div key={field.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}>
                    <label className="input-label" style={{ color: 'rgba(125,211,252,0.8)' }}>{field.label}</label>
                    <input
                      type={field.type} name={field.name}
                      value={form[field.name]} onChange={onChange}
                      required className="input" placeholder={field.placeholder}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1.5px solid rgba(168,85,247,0.2)',
                        color: '#e0f2fe',
                      }}
                    />
                  </motion.div>
                ))}

                {err && (
                  <motion.p className="text-red-400 text-sm font-medium text-center py-2 px-3 rounded-xl"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                    {err}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl text-white font-display font-bold text-base relative overflow-hidden disabled:opacity-60 mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #0ea5e9)',
                    boxShadow: '0 4px 24px rgba(168,85,247,0.4)',
                  }}
                  whileHover={{ scale: 1.02, y: -2, boxShadow: '0 8px 32px rgba(168,85,247,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account…
                    </span>
                  ) : '🚀 Start Exploring!'}
                </motion.button>
              </form>

              <motion.div className="mt-5 text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                <p className="text-sm font-medium text-sky-400/70">
                  Already exploring?{' '}
                  <Link to="/login" className="text-sky-400 font-bold hover:text-sky-300 transition-colors">
                    Sign in →
                  </Link>
                </p>
              </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)' }} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
