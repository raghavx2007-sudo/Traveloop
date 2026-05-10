import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

/* Destination showcase images */
const HERO_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', city: 'Paris', country: 'France', emoji: '🗼' },
  { src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', city: 'Tokyo', country: 'Japan', emoji: '🏯' },
  { src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', city: 'Dubai', country: 'UAE', emoji: '🕌' },
  { src: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80', city: 'New York', country: 'USA', emoji: '🗽' },
]

const FloatingEmoji = ({ emoji, x, y, delay = 0, duration = 4, size = 'text-3xl' }) => (
  <motion.div
    className={`absolute ${size} pointer-events-none select-none`}
    style={{ left: x, top: y }}
    animate={{ y: [0, -16, 0], rotate: [-6, 6, -6], scale: [1, 1.1, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    {emoji}
  </motion.div>
)

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length), 4000)
    return () => clearInterval(t)
  }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const r = await login(form.email, form.password)
    if (r.success) navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex overflow-hidden relative">

      {/* ── Cinematic sky background ── */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #020817 0%, #050c1a 40%, #0a0f1e 100%)'
      }} />

      {/* Aurora — CSS only */}
      <div className="absolute inset-0 opacity-25" style={{
        background: 'linear-gradient(135deg, transparent 0%, rgba(14,165,233,0.2) 35%, rgba(168,85,247,0.12) 65%, transparent 100%)',
        backgroundSize: '300% 300%',
        animation: 'gradientX 12s ease infinite',
      }} />

      {/* Stars — CSS only */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }, (_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              left: `${(i * 4.1) % 100}%`,
              top: `${(i * 3.9) % 100}%`,
              width: i % 5 === 0 ? 2 : 1,
              height: i % 5 === 0 ? 2 : 1,
              opacity: 0.45,
              animation: `starTwinkle ${2 + (i % 3)}s ${(i * 0.2) % 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Floating emojis */}
      <FloatingEmoji emoji="✈️" x="5%"  y="10%" delay={0}   duration={5} />
      <FloatingEmoji emoji="🌍" x="88%" y="8%"  delay={1}   duration={6} />
      <FloatingEmoji emoji="🧳" x="3%"  y="75%" delay={0.5} duration={4.5} />
      <FloatingEmoji emoji="🗺️" x="90%" y="70%" delay={1.5} duration={5.5} />
      <FloatingEmoji emoji="🎫" x="45%" y="5%"  delay={2}   duration={4} />
      <FloatingEmoji emoji="🌴" x="92%" y="40%" delay={0.8} duration={6} />
      <FloatingEmoji emoji="⭐" x="20%" y="85%" delay={1.2} duration={5} size="text-2xl" />
      <FloatingEmoji emoji="🧭" x="75%" y="88%" delay={0.6} duration={4.5} size="text-2xl" />

      {/* Clouds */}
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute text-white/10 pointer-events-none select-none"
          style={{ top: `${8 + i * 18}%`, fontSize: `${5 + i}rem` }}
          animate={{ x: ['-150px', 'calc(100vw + 150px)'] }}
          transition={{ duration: 22 + i * 8, delay: i * 6, repeat: Infinity, ease: 'linear' }}>
          ☁️
        </motion.div>
      ))}

      {/* ══════════════════════════════════════
          LEFT PANEL — Cinematic destination showcase
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative z-10">
        <motion.div
          className="text-center w-full max-w-md"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <motion.div
            className="text-8xl mb-4 inline-block"
            animate={{ y: [0, -16, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            🌏
          </motion.div>
          <motion.h1
            className="font-display text-6xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #22d3ee, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%',
            }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Traveloop
          </motion.h1>
          <p className="text-sky-300 text-lg font-medium max-w-sm mx-auto leading-relaxed mb-8">
            Your cinematic travel companion for epic adventures 🚀
          </p>

          {/* Destination showcase card — CSS crossfade */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8"
            style={{ height: 220, border: '1.5px solid rgba(255,255,255,0.15)' }}>
            {HERO_IMAGES.map((img, i) => (
              <div key={i} className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === heroIndex ? 1 : 0 }}>
                <img src={img.src} alt={img.city}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.7) saturate(1.3)' }}
                  loading={i === 0 ? 'eager' : 'lazy'} />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(2,8,23,0.8) 0%, transparent 60%)'
                }} />
                <div className="absolute bottom-4 left-4 text-left">
                  <p className="text-white text-2xl font-display font-bold flex items-center gap-2">
                    <span>{img.emoji}</span> {img.city}
                  </p>
                  <p className="text-sky-300 text-sm font-medium">{img.country}</p>
                </div>
              </div>
            ))}
            {/* Glow overlay */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 40px rgba(14,165,233,0.12)' }} />
            {/* Dot indicators */}
            <div className="absolute bottom-3 right-4 flex gap-1.5">
              {HERO_IMAGES.map((_, i) => (
                <div key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === heroIndex ? 16 : 6,
                    height: 6,
                    backgroundColor: i === heroIndex ? '#38bdf8' : 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { emoji: '🗺️', label: 'Plan Trips' },
              { emoji: '💰', label: 'Track Budget' },
              { emoji: '🔗', label: 'Share Journeys' },
            ].map((f, i) => (
              <motion.div key={f.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.06, y: -3, backgroundColor: 'rgba(14,165,233,0.15)' }}
              >
                <span className="text-lg">{f.emoji}</span>
                <p className="text-white text-xs font-bold">{f.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Login form
      ══════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <motion.div className="text-6xl inline-block"
              animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              🌏
            </motion.div>
            <h1 className="font-display text-4xl font-bold text-white mt-2">Traveloop</h1>
          </div>

          {/* Form card */}
          <div className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(13,21,38,0.85)',
              border: '1.5px solid rgba(56,189,248,0.2)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}>
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.6), transparent)' }} />

            <div className="p-8">
              <div className="mb-7">
                <motion.h2
                  className="font-display text-3xl font-bold text-white mb-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome back! 👋
                </motion.h2>
                <motion.p
                  className="text-sky-400 text-sm font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Ready for your next adventure?
                </motion.p>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                  <label className="input-label" style={{ color: 'rgba(125,211,252,0.8)' }}>📧 Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={onChange}
                    required className="input" placeholder="explorer@traveloop.com"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1.5px solid rgba(56,189,248,0.2)',
                      color: '#e0f2fe',
                    }} />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.42 }}>
                  <label className="input-label" style={{ color: 'rgba(125,211,252,0.8)' }}>🔑 Password</label>
                  <input type="password" name="password" value={form.password} onChange={onChange}
                    required className="input" placeholder="••••••••"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1.5px solid rgba(56,189,248,0.2)',
                      color: '#e0f2fe',
                    }} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl text-white font-display font-bold text-base relative overflow-hidden disabled:opacity-60"
                    style={{
                      background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                      boxShadow: '0 4px 24px rgba(14,165,233,0.5)',
                    }}
                    whileHover={{ scale: 1.02, y: -2, boxShadow: '0 8px 32px rgba(14,165,233,0.6)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Shimmer */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', skewX: '-20deg' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Boarding…
                      </span>
                    ) : '🚀 Let\'s Go!'}
                  </motion.button>
                </motion.div>
              </form>

              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm font-medium text-sky-400/70">
                  New explorer?{' '}
                  <Link to="/register"
                    className="text-sky-400 font-bold hover:text-sky-300 transition-colors"
                    style={{ textDecoration: 'none' }}>
                    Start your journey →
                  </Link>
                </p>
              </motion.div>
            </div>

            {/* Bottom glow */}
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)' }} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
