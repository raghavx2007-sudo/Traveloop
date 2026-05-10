import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

/* ── Floating travel stickers that drift across the page ── */
export function FloatingStickers({ count = 6, emojis = ['✈️','🌍','📍','🧳','🗺️','🎫','🌴','⭐','🌟','💫'] }) {
  const items = Array.from({ length: count }, (_, i) => ({
    emoji: emojis[i % emojis.length],
    x: `${10 + (i * 15) % 80}%`,
    delay: i * 0.8,
    duration: 6 + i * 1.2,
    size: 20 + (i % 3) * 8,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((item, i) => (
        <motion.div key={i}
          className="absolute select-none"
          style={{ left: item.x, top: '-5%', fontSize: item.size }}
          animate={{ y: ['0vh', '110vh'], rotate: [-10, 10, -10], opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: 'linear' }}>
          {item.emoji}
        </motion.div>
      ))}
    </div>
  )
}

/* ── Sparkle burst on click ── */
export function SparkleButton({ children, className = '', onClick }) {
  const [sparks, setSparks] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newSparks = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x, y,
      angle: (i / 12) * 360,
      color: ['#38bdf8','#a855f7','#f59e0b','#f43f5e','#22d3ee'][i % 5],
    }))
    setSparks(prev => [...prev, ...newSparks])
    setTimeout(() => setSparks(prev => prev.filter(s => !newSparks.find(n => n.id === s.id))), 700)
    onClick?.()
  }

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={handleClick}>
      {children}
      {sparks.map(spark => (
        <motion.div key={spark.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{ left: spark.x, top: spark.y, background: spark.color,
            boxShadow: `0 0 6px ${spark.color}` }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            x: Math.cos(spark.angle * Math.PI / 180) * 50,
            y: Math.sin(spark.angle * Math.PI / 180) * 50,
            scale: 0, opacity: 0
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }} />
      ))}
    </div>
  )
}

/* ── Animated location pin ── */
export function BouncingPin({ label, color = '#0ea5e9', className = '' }) {
  return (
    <motion.div className={`flex flex-col items-center ${className}`}
      animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
        style={{ background: color, boxShadow: `0 0 15px ${color}60` }}>
        📍
      </div>
      {label && (
        <div className="mt-1 px-2 py-0.5 rounded-full text-xs font-bold text-white shadow"
          style={{ background: color }}>
          {label}
        </div>
      )}
      <motion.div className="w-3 h-1 rounded-full mt-0.5 bg-black/20"
        animate={{ scaleX: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </motion.div>
  )
}

/* ── Animated airplane crossing the screen ── */
export function CrossingAirplane({ top = '15%', delay = 0, duration = 18 }) {
  return (
    <motion.div className="fixed pointer-events-none z-0 select-none"
      style={{ top }}
      animate={{ x: ['-80px', 'calc(100vw + 80px)'] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}>
      <div className="relative">
        <span className="text-2xl">✈️</span>
        {/* Contrail */}
        <motion.div
          className="absolute top-1/2 right-full -translate-y-1/2 pointer-events-none"
          style={{
            width: 60, height: 2,
            background: 'linear-gradient(to left, rgba(255,255,255,0.6), transparent)',
            borderRadius: 2,
          }}
        />
      </div>
    </motion.div>
  )
}

/* ── Shooting star with glow trail ── */
export function ShootingStar({ delay = 0 }) {
  const top = `${8 + Math.random() * 35}%`
  return (
    <motion.div className="fixed pointer-events-none z-0 select-none"
      style={{ top, left: '-5%' }}
      animate={{ x: ['0vw', '110vw'], y: ['0vh', '25vh'], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 9 + Math.random() * 8 }}>
      <div className="flex items-center gap-0">
        <span className="text-base">⭐</span>
        <div className="w-20 h-0.5 rounded-full"
          style={{ background: 'linear-gradient(to right, rgba(255,215,0,0.9), transparent)' }} />
      </div>
    </motion.div>
  )
}

/* ── Floating coin for budget page ── */
export function FloatingCoin({ x = '50%', delay = 0 }) {
  return (
    <motion.div className="absolute pointer-events-none select-none text-xl"
      style={{ left: x, bottom: '100%' }}
      animate={{ y: [0, -60, -120], opacity: [1, 1, 0], rotate: [0, 180, 360] }}
      transition={{ duration: 1.5, delay, repeat: Infinity, repeatDelay: 3 }}>
      💰
    </motion.div>
  )
}

/* ── Mascot speech bubble ── */
export function SpeechBubble({ text, direction = 'right', className = '' }) {
  return (
    <motion.div
      className={`relative backdrop-blur-xl rounded-2xl px-4 py-2 shadow-xl max-w-xs ${className}`}
      style={{
        background: 'rgba(255,255,255,0.92)',
        border: '1.5px solid rgba(56,189,248,0.4)',
        boxShadow: '0 8px 32px rgba(14,165,233,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
      initial={{ opacity: 0, scale: 0.7, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      <p className="text-sm font-bold text-sky-700">{text}</p>
      <div className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 ${
        direction === 'left'
          ? 'right-full border-t-8 border-b-8 border-r-8 border-transparent border-r-white'
          : 'left-full border-t-8 border-b-8 border-l-8 border-transparent border-l-white'
      }`} />
    </motion.div>
  )
}

/* ── Magnetic button wrapper ── */
export function MagneticButton({ children, className = '', strength = 0.3 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15 })
  const springY = useSpring(y, { stiffness: 200, damping: 15 })

  const onMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      className={className}>
      {children}
    </motion.div>
  )
}

/* ── Ripple click effect ── */
export function RippleContainer({ children, className = '', color = 'rgba(14,165,233,0.3)' }) {
  const [ripples, setRipples] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700)
  }

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={handleClick}>
      {children}
      {ripples.map(r => (
        <motion.div key={r.id}
          className="absolute rounded-full pointer-events-none"
          style={{ left: r.x, top: r.y, background: color, translateX: '-50%', translateY: '-50%' }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: 200, height: 200, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/* ── Glowing particle burst ── */
export function ParticleBurst({ x = '50%', y = '50%', active = false, colors = ['#38bdf8','#a855f7','#f59e0b'] }) {
  if (!active) return null
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <motion.div key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ background: colors[i % colors.length], boxShadow: `0 0 6px ${colors[i % colors.length]}` }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * 40,
              y: Math.sin(angle) * 40,
              opacity: 0, scale: 0,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

/* ── Tilt card wrapper ── */
export function TiltCard({ children, className = '', maxTilt = 8 }) {
  const ref = useRef(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 20 })

  const onMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotateY.set(((e.clientX - cx) / (rect.width / 2)) * maxTilt)
    rotateX.set(-((e.clientY - cy) / (rect.height / 2)) * maxTilt)
  }
  const onLeave = () => { rotateX.set(0); rotateY.set(0) }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: springRX, rotateY: springRY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
}
