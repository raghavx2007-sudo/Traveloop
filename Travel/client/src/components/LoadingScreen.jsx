import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const DESTINATIONS = [
  { emoji: '🗼', name: 'Paris',    color: '#0ea5e9' },
  { emoji: '🗽', name: 'New York', color: '#a855f7' },
  { emoji: '🏯', name: 'Tokyo',   color: '#f43f5e' },
  { emoji: '🕌', name: 'Dubai',   color: '#f59e0b' },
]

const TIPS = [
  'Plotting your next adventure…',
  'Fueling the jet engines…',
  'Stamping your passport…',
  'Packing your bags…',
]

export default function LoadingScreen({ message = 'Loading your adventure…' }) {
  const [progress, setProgress] = useState(0)
  const [tipIndex, setTipIndex] = useState(0)
  const [destIndex, setDestIndex] = useState(0)

  useEffect(() => {
    const prog = setInterval(() => setProgress(p => Math.min(p + Math.random() * 14, 95)), 220)
    const tip  = setInterval(() => setTipIndex(i => (i + 1) % TIPS.length), 1500)
    const dest = setInterval(() => setDestIndex(i => (i + 1) % DESTINATIONS.length), 900)
    return () => { clearInterval(prog); clearInterval(tip); clearInterval(dest) }
  }, [])

  const dest = DESTINATIONS[destIndex]

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020817 0%, #050c1a 50%, #0a0f1e 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Stars — CSS only, no Framer Motion */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }, (_, i) => (
          <div key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${(i * 4.1) % 100}%`,
              top: `${(i * 3.9) % 100}%`,
              width: i % 6 === 0 ? 2 : 1,
              height: i % 6 === 0 ? 2 : 1,
              opacity: 0.5,
              animation: `starTwinkle ${2 + (i % 3)}s ${(i * 0.2) % 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Aurora — CSS only */}
      <div className="absolute inset-0 opacity-15" style={{
        background: 'linear-gradient(135deg, transparent 0%, rgba(14,165,233,0.25) 35%, rgba(168,85,247,0.15) 65%, transparent 100%)',
        backgroundSize: '300% 300%',
        animation: 'gradientX 10s ease infinite',
      }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-8 max-w-xs w-full">

        {/* Animated plane — replaces cartoon mascot */}
        <motion.div
          animate={{ x: [-20, 20, -20], y: [0, -14, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex items-center justify-center"
        >
          {/* Glow ring */}
          <motion.div
            className="absolute w-24 h-24 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-6xl relative z-10" style={{ filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.8))' }}>
            ✈️
          </span>
          {/* Contrail */}
          <motion.div
            className="absolute right-full top-1/2 -translate-y-1/2"
            style={{
              width: 48, height: 3,
              background: 'linear-gradient(to left, rgba(56,189,248,0.6), transparent)',
              borderRadius: 2,
            }}
          />
        </motion.div>

        {/* Destination badge */}
        <AnimatePresence mode="wait">
          <motion.div key={destIndex}
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: `${dest.color}18`,
              border: `1.5px solid ${dest.color}45`,
              boxShadow: `0 0 16px ${dest.color}25`,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}>
            <span className="text-lg">{dest.emoji}</span>
            <span className="text-white text-sm font-bold">{dest.name}</span>
          </motion.div>
        </AnimatePresence>

        {/* Tip text */}
        <AnimatePresence mode="wait">
          <motion.p key={tipIndex}
            className="text-sky-300 text-sm font-medium text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {TIPS[tipIndex]}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between mb-1.5">
            <span className="text-sky-400/70 text-xs font-bold">Loading</span>
            <span className="text-sky-400/70 text-xs font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(56,189,248,0.1)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #0ea5e9, #a855f7)',
                boxShadow: '0 0 8px rgba(14,165,233,0.5)',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25 }}
            />
          </div>
        </div>

        {/* Floating stickers — CSS only */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-around pointer-events-none select-none">
          {['✈️', '🌍', '🧳', '🗺️', '🎫'].map((e, i) => (
            <span key={i} className="text-lg"
              style={{ animation: `float ${2.5 + i * 0.3}s ${i * 0.25}s ease-in-out infinite`, opacity: 0.7 }}>
              {e}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
