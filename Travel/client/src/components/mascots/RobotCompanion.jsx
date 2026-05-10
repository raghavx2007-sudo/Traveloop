import { motion } from 'framer-motion'

/**
 * ORIGINAL CHARACTER: "Beep" — the futuristic travel robot companion
 * Small floating helper bot with hologram effects and blinking eyes
 * Original design inspired by helpful AI companion energy
 */
export default function RobotCompanion({ size = 80, tip = '', animate = true, className = '' }) {
  const s = size

  const floatAnim = animate ? {
    y: [0, -8, 0],
    rotate: [-3, 3, -3],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  } : {}

  const eyeAnim = animate ? {
    scaleY: [1, 0.05, 1],
    transition: { duration: 3.5, repeat: Infinity, times: [0, 0.5, 0.6] }
  } : {}

  const antennaAnim = animate ? {
    rotate: [-10, 10, -10],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
  } : {}

  const glowAnim = animate ? {
    opacity: [0.4, 1, 0.4],
    scale: [0.9, 1.1, 0.9],
    transition: { duration: 2, repeat: Infinity }
  } : {}

  return (
    <motion.div className={`inline-block select-none relative ${className}`} animate={floatAnim}>
      {/* Hologram glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%)' }}
        animate={glowAnim}
      />

      <svg width={s} height={s * 1.3} viewBox="0 0 80 104" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* Hover shadow */}
        <motion.ellipse cx="40" cy="100" rx="16" ry="4" fill="rgba(56,189,248,0.2)"
          animate={{ scaleX: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }} />

        {/* Jet thrusters */}
        <motion.g animate={{ scaleY: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 0.5, repeat: Infinity }}>
          <ellipse cx="28" cy="88" rx="5" ry="8" fill="url(#thrusterGrad)"/>
          <ellipse cx="52" cy="88" rx="5" ry="8" fill="url(#thrusterGrad)"/>
        </motion.g>

        <defs>
          <linearGradient id="thrusterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E0F2FE"/>
            <stop offset="100%" stopColor="#BAE6FD"/>
          </linearGradient>
          <linearGradient id="headGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0F9FF"/>
            <stop offset="100%" stopColor="#E0F2FE"/>
          </linearGradient>
        </defs>

        {/* Body */}
        <rect x="20" y="52" width="40" height="32" rx="10" fill="url(#bodyGrad)" stroke="#38BDF8" strokeWidth="2"/>
        {/* Body panel lines */}
        <line x1="20" y1="64" x2="60" y2="64" stroke="#BAE6FD" strokeWidth="1"/>
        {/* Chest screen */}
        <rect x="26" y="56" width="28" height="16" rx="4" fill="#0EA5E9" opacity="0.8"/>
        {/* Screen content — animated bars */}
        <motion.rect x="29" y="59" width="6" height="10" rx="1" fill="#38BDF8"
          animate={{ height: [10, 6, 10, 8, 10] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.rect x="37" y="61" width="6" height="8" rx="1" fill="#7DD3FC"
          animate={{ height: [8, 12, 8, 5, 8] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
        <motion.rect x="45" y="60" width="6" height="9" rx="1" fill="#38BDF8"
          animate={{ height: [9, 4, 9, 11, 9] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />

        {/* Arms */}
        <rect x="8" y="54" width="14" height="8" rx="4" fill="url(#bodyGrad)" stroke="#38BDF8" strokeWidth="1.5"/>
        <circle cx="8" cy="58" r="4" fill="#0EA5E9"/>
        <rect x="58" y="54" width="14" height="8" rx="4" fill="url(#bodyGrad)" stroke="#38BDF8" strokeWidth="1.5"/>
        <circle cx="72" cy="58" r="4" fill="#0EA5E9"/>

        {/* Neck */}
        <rect x="34" y="44" width="12" height="10" rx="3" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5"/>
        {/* Neck bolts */}
        <circle cx="36" cy="48" r="1.5" fill="#38BDF8"/>
        <circle cx="44" cy="48" r="1.5" fill="#38BDF8"/>

        {/* Head */}
        <rect x="16" y="16" width="48" height="30" rx="12" fill="url(#headGrad)" stroke="#38BDF8" strokeWidth="2"/>
        {/* Head shine */}
        <ellipse cx="32" cy="22" rx="8" ry="4" fill="rgba(255,255,255,0.6)"/>

        {/* Eyes */}
        <motion.g animate={eyeAnim}>
          {/* Left eye */}
          <rect x="22" y="24" width="14" height="14" rx="4" fill="#0EA5E9"/>
          <motion.circle cx="29" cy="31" r="4" fill="#38BDF8"
            animate={{ x: [-1, 1, -1] }} transition={{ duration: 2, repeat: Infinity }} />
          <circle cx="31" cy="29" r="1.5" fill="white"/>
          {/* Right eye */}
          <rect x="44" y="24" width="14" height="14" rx="4" fill="#0EA5E9"/>
          <motion.circle cx="51" cy="31" r="4" fill="#38BDF8"
            animate={{ x: [-1, 1, -1] }} transition={{ duration: 2, repeat: Infinity }} />
          <circle cx="53" cy="29" r="1.5" fill="white"/>
        </motion.g>

        {/* Mouth — LED display */}
        <rect x="28" y="40" width="24" height="4" rx="2" fill="#0EA5E9"/>
        <motion.rect x="30" y="41" width="4" height="2" rx="1" fill="#38BDF8"
          animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
        <motion.rect x="36" y="41" width="4" height="2" rx="1" fill="#38BDF8"
          animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
        <motion.rect x="42" y="41" width="4" height="2" rx="1" fill="#38BDF8"
          animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} />
        <motion.rect x="48" y="41" width="4" height="2" rx="1" fill="#38BDF8"
          animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.6 }} />

        {/* Antenna */}
        <motion.g animate={antennaAnim} style={{ originX: '40px', originY: '16px' }}>
          <line x1="40" y1="16" x2="40" y2="6" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round"/>
          <motion.circle cx="40" cy="4" r="4" fill="#38BDF8"
            animate={{ fill: ['#38BDF8', '#7DD3FC', '#0EA5E9', '#38BDF8'] }}
            transition={{ duration: 1, repeat: Infinity }} />
        </motion.g>

        {/* Ear sensors */}
        <circle cx="16" cy="28" r="4" fill="#0EA5E9" stroke="#38BDF8" strokeWidth="1.5"/>
        <circle cx="64" cy="28" r="4" fill="#0EA5E9" stroke="#38BDF8" strokeWidth="1.5"/>
        <motion.circle cx="16" cy="28" r="2" fill="#38BDF8"
          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
        <motion.circle cx="64" cy="28" r="2" fill="#38BDF8"
          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }} />
      </svg>

      {/* Tip bubble */}
      {tip && (
        <motion.div
          className="absolute -top-2 left-full ml-2 bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-2xl whitespace-nowrap shadow-lg"
          initial={{ opacity: 0, scale: 0.8, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          style={{ boxShadow: '0 0 12px rgba(56,189,248,0.5)' }}
        >
          {tip}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-sky-500" />
        </motion.div>
      )}
    </motion.div>
  )
}
