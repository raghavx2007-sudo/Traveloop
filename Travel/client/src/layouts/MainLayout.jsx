import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import AnimatedBackground from '../components/AnimatedBackground'
import { useEffect } from 'react'

const navigation = [
  { name: 'Dashboard',  path: '/dashboard',  emoji: '🏠', color: 'from-sky-500 to-cyan-500',    glow: 'rgba(14,165,233,0.5)'  },
  { name: 'My Trips',   path: '/my-trips',   emoji: '✈️', color: 'from-rose-500 to-orange-400', glow: 'rgba(244,63,94,0.5)'   },
  { name: 'Explore',    path: '/explore',    emoji: '🌍', color: 'from-emerald-500 to-cyan-400', glow: 'rgba(34,197,94,0.5)'  },
  { name: 'Analytics',  path: '/analytics',  emoji: '📊', color: 'from-purple-500 to-sky-500',  glow: 'rgba(168,85,247,0.5)'  },
  { name: 'Billing',    path: '/billing',    emoji: '🧾', color: 'from-amber-500 to-orange-400', glow: 'rgba(245,158,11,0.5)' },
  { name: 'Community',  path: '/community',  emoji: '👥', color: 'from-cyan-500 to-purple-400', glow: 'rgba(6,182,212,0.5)'   },
  { name: 'Profile',    path: '/profile',    emoji: '👤', color: 'from-purple-500 to-rose-400', glow: 'rgba(168,85,247,0.5)'  },
  { name: 'Settings',   path: '/settings',   emoji: '⚙️', color: 'from-sky-600 to-cyan-600',   glow: 'rgba(14,165,233,0.5)'  },
]

/* Cinematic page transition variants — lighter */
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18 } },
}

export default function MainLayout() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()
  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/')

  return (
    <div className="min-h-screen flex relative" style={{ backgroundColor: 'var(--bg-base)' }}>
      <AnimatedBackground variant={isDark ? 'dark' : 'light'} />

      {/* ══════════════════════════════════════
          CINEMATIC SIDEBAR
      ══════════════════════════════════════ */}
      <motion.aside
        className="fixed left-0 top-0 h-full w-64 z-20 flex flex-col"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: isDark
            ? '4px 0 40px rgba(0,0,0,0.4), inset -1px 0 0 rgba(56,189,248,0.06)'
            : '4px 0 40px rgba(14,165,233,0.08), inset -1px 0 0 rgba(186,230,253,0.5)',
        }}
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── Logo ── */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                boxShadow: '0 4px 20px rgba(14,165,233,0.5)',
              }}
              whileHover={{ rotate: [0, -12, 12, 0], scale: 1.12 }}
              transition={{ duration: 0.5 }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xl relative z-10">✈️</span>
            </motion.div>
            <div>
              <motion.p
                className="font-display text-lg font-bold leading-none"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Traveloop
              </motion.p>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Your travel universe ✨
              </p>
            </div>
          </Link>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
          <p className="text-xs font-bold uppercase tracking-widest px-3 mb-3"
            style={{ color: 'var(--text-muted)' }}>
            Navigate
          </p>
          {navigation.map((item, i) => {
            const active = isActive(item.path)
            return (
              <motion.div key={item.path}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={item.path}>
                  <motion.div
                    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold transition-colors duration-200 overflow-hidden`}
                    style={active ? {
                      background: `linear-gradient(135deg, ${item.glow.replace('0.5', '0.15')}, ${item.glow.replace('0.5', '0.08')})`,
                      border: `1px solid ${item.glow.replace('0.5', '0.3')}`,
                      color: 'var(--text-primary)',
                      boxShadow: `0 4px 20px ${item.glow.replace('0.5', '0.2')}`,
                    } : {
                      color: 'var(--text-secondary)',
                    }}
                    whileHover={!active ? {
                      x: 4,
                      backgroundColor: 'rgba(14,165,233,0.08)',
                      color: '#0ea5e9',
                    } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Active glow line */}
                    {active && (
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ background: `linear-gradient(to bottom, ${item.glow}, transparent)` }}
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    <motion.span
                      className="text-xl w-7 text-center flex-shrink-0"
                      whileHover={{ scale: 1.3, rotate: 12 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {item.emoji}
                    </motion.span>
                    <span>{item.name}</span>

                    {active && (
                      <motion.div
                        className="ml-auto flex items-center gap-1"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: item.glow }}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* ── Bottom section ── */}
        <div className="p-3 space-y-2" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
          {/* Theme toggle */}
          <motion.div
            className="flex items-center justify-between px-3 py-2.5 rounded-2xl cursor-pointer"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            whileHover={{ scale: 1.02, borderColor: 'var(--border-hover)' }}
            onClick={toggleTheme}
          >
            <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
              {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
            <div className={`relative w-11 h-6 rounded-full transition-all duration-400 ${isDark ? 'bg-sky-600' : 'bg-amber-400'}`}
              style={{ boxShadow: isDark ? '0 0 10px rgba(14,165,233,0.4)' : '0 0 10px rgba(245,158,11,0.4)' }}>
              <motion.span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                animate={{ left: isDark ? '22px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </motion.div>

          {/* User card */}
          <Link to="/profile">
            <motion.div
              className="flex items-center gap-3 p-2.5 rounded-2xl transition-all"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
              whileHover={{ scale: 1.02, y: -1, borderColor: 'var(--border-hover)' }}
            >
              {user?.profile_image ? (
                <img src={`http://localhost:5000${user.profile_image}`} alt={user.name}
                  className="w-9 h-9 rounded-full object-cover"
                  style={{ boxShadow: '0 0 12px rgba(14,165,233,0.4)', border: '2px solid rgba(56,189,248,0.4)' }} />
              ) : (
                <motion.div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                    boxShadow: '0 0 12px rgba(14,165,233,0.4)',
                  }}
                  animate={{ boxShadow: ['0 0 12px rgba(14,165,233,0.4)', '0 0 20px rgba(14,165,233,0.7)', '0 0 12px rgba(14,165,233,0.4)'] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </motion.div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
            </motion.div>
          </Link>

          <motion.button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold text-red-400 transition-all"
            whileHover={{ x: 2, backgroundColor: 'rgba(239,68,68,0.08)' }}
            whileTap={{ scale: 0.97 }}
          >
            <span>🚪</span><span>Sign Out</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <main className="ml-64 flex-1 min-h-screen relative z-10">
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
