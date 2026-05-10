import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { Link } from 'react-router-dom'

export default function Settings() {
  const { theme, setTheme, isDark } = useTheme()

  const handleThemeChange = (t) => setTheme(t)

  return (
    <div className="space-y-6 page-enter">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-primary-color">⚙️ Settings</h1>
        <p className="text-muted-color text-sm font-medium mt-0.5">Manage your preferences</p>
      </motion.div>

      {/* Appearance */}
      <motion.div className="card p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="font-display text-xl font-bold text-primary-color mb-1">🎨 Appearance</h3>
        <p className="section-subtitle mb-5">Choose how Traveloop looks to you</p>

        <div className="grid grid-cols-2 gap-4 mb-5">
          {[
            { value: 'light', label: 'Light Mode', desc: 'Bright & cheerful ☀️', emoji: '☀️',
              gradient: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', border: '#bae6fd', textColor: '#0c4a6e' },
            { value: 'dark',  label: 'Dark Mode',  desc: 'Easy on the eyes 🌙', emoji: '🌙',
              gradient: 'linear-gradient(135deg,#0a0f1e,#111827)', border: 'rgba(56,189,248,0.3)', textColor: '#e0f2fe' },
          ].map((t) => (
            <motion.button key={t.value} onClick={() => handleThemeChange(t.value)}
              className="p-5 rounded-3xl text-left transition-all duration-200 border-2"
              style={{
                background: t.gradient,
                borderColor: theme === t.value ? '#0ea5e9' : t.border,
                boxShadow: theme === t.value ? '0 0 20px rgba(14,165,233,0.3)' : 'none',
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}>
              <div className="flex items-center justify-between mb-3">
                <motion.span className="text-3xl"
                  animate={theme === t.value ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}>
                  {t.emoji}
                </motion.span>
                {theme === t.value && (
                  <motion.div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                    ✓
                  </motion.div>
                )}
              </div>
              <p className="font-display font-bold text-sm" style={{ color: t.textColor }}>{t.label}</p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: t.textColor, opacity: 0.7 }}>{t.desc}</p>
            </motion.button>
          ))}
        </div>

        {/* Quick toggle */}
        <motion.div
          className="flex items-center justify-between p-4 rounded-2xl border-2 border-theme cursor-pointer"
          onClick={() => handleThemeChange(isDark ? 'light' : 'dark')}
          whileHover={{ scale: 1.01 }}>
          <div className="flex items-center gap-3">
            <motion.span className="text-2xl"
              animate={{ rotate: isDark ? 0 : 180 }} transition={{ duration: 0.5 }}>
              {isDark ? '🌙' : '☀️'}
            </motion.span>
            <div>
              <p className="text-sm font-bold text-primary-color">{isDark ? 'Dark Mode' : 'Light Mode'} active</p>
              <p className="text-xs text-muted-color font-medium">Click to switch instantly</p>
            </div>
          </div>
          <motion.div
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isDark ? 'bg-sky-500' : 'bg-amber-400'}`}
            whileTap={{ scale: 0.95 }}>
            <motion.span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
              animate={{ left: isDark ? '22px' : '2px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Account */}
      <motion.div className="card p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 className="font-display text-xl font-bold text-primary-color mb-4">👤 Account</h3>
        <Link to="/profile">
          <motion.div
            className="flex items-center gap-4 p-4 card-flat hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-all group cursor-pointer"
            whileHover={{ x: 4 }}>
            <motion.span className="text-2xl" whileHover={{ scale: 1.3, rotate: 10 }}>👤</motion.span>
            <div className="flex-1">
              <p className="font-bold text-primary-color">Profile</p>
              <p className="text-xs text-muted-color font-medium">Edit your name, avatar and account settings</p>
            </div>
            <motion.span className="text-muted-color font-bold" whileHover={{ x: 3 }}>›</motion.span>
          </motion.div>
        </Link>
      </motion.div>

      {/* About */}
      <motion.div className="card p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="font-display text-xl font-bold text-primary-color mb-4">ℹ️ About</h3>
        <motion.div className="flex items-center gap-4 p-4 card-flat" whileHover={{ scale: 1.01 }}>
          <motion.div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}
            animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            ✈️
          </motion.div>
          <div>
            <p className="font-display font-bold text-primary-color">Traveloop</p>
            <p className="text-xs text-muted-color font-medium">Version 2.0.0 · Your cartoon travel companion 🌍</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
