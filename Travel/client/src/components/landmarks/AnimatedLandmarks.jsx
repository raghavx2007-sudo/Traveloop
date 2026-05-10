import { motion } from 'framer-motion'

/* ── Eiffel Tower with twinkling lights ── */
export const EiffelTower = ({ size = 80, className = '' }) => (
  <motion.div className={`inline-block select-none ${className}`}
    animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
    <svg width={size} height={size * 1.5} viewBox="0 0 80 120" fill="none">
      {/* Base */}
      <path d="M 20 110 L 30 60 L 50 60 L 60 110 Z" fill="#8B7355" stroke="#6B5335" strokeWidth="1"/>
      {/* Middle */}
      <path d="M 30 60 L 35 30 L 45 30 L 50 60 Z" fill="#8B7355" stroke="#6B5335" strokeWidth="1"/>
      {/* Top */}
      <path d="M 35 30 L 38 10 L 42 10 L 45 30 Z" fill="#8B7355" stroke="#6B5335" strokeWidth="1"/>
      {/* Spire */}
      <line x1="40" y1="10" x2="40" y2="2" stroke="#8B7355" strokeWidth="2"/>
      {/* Horizontal bars */}
      <line x1="28" y1="45" x2="52" y2="45" stroke="#6B5335" strokeWidth="2"/>
      <line x1="24" y1="75" x2="56" y2="75" stroke="#6B5335" strokeWidth="2"/>
      <line x1="22" y1="90" x2="58" y2="90" stroke="#6B5335" strokeWidth="2"/>
      {/* Twinkling lights */}
      {[[40,8],[35,25],[45,25],[32,50],[48,50],[28,70],[52,70]].map(([x,y],i) => (
        <motion.circle key={i} cx={x} cy={y} r="1.5" fill="#FFD700"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
      ))}
    </svg>
  </motion.div>
)

/* ── Tokyo Tower with neon glow ── */
export const TokyoTower = ({ size = 70, className = '' }) => (
  <motion.div className={`inline-block select-none ${className}`}
    animate={{ y: [0, -3, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
    <svg width={size} height={size * 1.6} viewBox="0 0 70 112" fill="none">
      <defs>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Main structure */}
      <path d="M 18 105 L 28 50 L 42 50 L 52 105 Z" fill="#FF4500" stroke="#CC3300" strokeWidth="1"/>
      <path d="M 28 50 L 32 20 L 38 20 L 42 50 Z" fill="#FF4500" stroke="#CC3300" strokeWidth="1"/>
      <path d="M 32 20 L 34 5 L 36 5 L 38 20 Z" fill="#FF4500"/>
      {/* Observation deck */}
      <rect x="26" y="46" width="18" height="8" rx="2" fill="#CC3300"/>
      <rect x="29" y="18" width="12" height="6" rx="2" fill="#CC3300"/>
      {/* Horizontal bars */}
      <line x1="22" y1="70" x2="48" y2="70" stroke="#CC3300" strokeWidth="2"/>
      <line x1="20" y1="85" x2="50" y2="85" stroke="#CC3300" strokeWidth="2"/>
      {/* Neon lights */}
      {[[35,4],[35,18],[35,46],[28,70],[42,70]].map(([x,y],i) => (
        <motion.circle key={i} cx={x} cy={y} r="2" fill="#FF4500" filter="url(#neonGlow)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </svg>
  </motion.div>
)

/* ── Big Ben with clock animation ── */
export const BigBen = ({ size = 75, className = '' }) => {
  const now = new Date()
  const minuteAngle = (now.getMinutes() / 60) * 360
  const hourAngle = ((now.getHours() % 12) / 12) * 360

  return (
    <motion.div className={`inline-block select-none ${className}`}
      animate={{ y: [0, -3, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width={size} height={size * 1.6} viewBox="0 0 75 120" fill="none">
        {/* Base tower */}
        <rect x="22" y="60" width="31" height="55" rx="2" fill="#8B9467" stroke="#6B7447" strokeWidth="1"/>
        {/* Tower details */}
        <rect x="24" y="65" width="27" height="8" rx="1" fill="#6B7447"/>
        <rect x="24" y="80" width="27" height="8" rx="1" fill="#6B7447"/>
        <rect x="24" y="95" width="27" height="8" rx="1" fill="#6B7447"/>
        {/* Clock tower */}
        <rect x="20" y="30" width="35" height="32" rx="3" fill="#9BA47A" stroke="#6B7447" strokeWidth="1.5"/>
        {/* Clock face */}
        <circle cx="37.5" cy="46" r="12" fill="#FFF9E6" stroke="#8B9467" strokeWidth="1.5"/>
        {/* Clock numbers */}
        <text x="35" y="37" fontSize="4" fill="#333" textAnchor="middle">12</text>
        <text x="47" y="48" fontSize="4" fill="#333" textAnchor="middle">3</text>
        <text x="35" y="58" fontSize="4" fill="#333" textAnchor="middle">6</text>
        <text x="24" y="48" fontSize="4" fill="#333" textAnchor="middle">9</text>
        {/* Clock hands */}
        <motion.line x1="37.5" y1="46" x2="37.5" y2="38" stroke="#333" strokeWidth="1.5" strokeLinecap="round"
          animate={{ rotate: hourAngle }} style={{ originX: '37.5px', originY: '46px' }}
          transition={{ duration: 43200, repeat: Infinity, ease: 'linear' }} />
        <motion.line x1="37.5" y1="46" x2="37.5" y2="36" stroke="#555" strokeWidth="1" strokeLinecap="round"
          animate={{ rotate: minuteAngle }} style={{ originX: '37.5px', originY: '46px' }}
          transition={{ duration: 3600, repeat: Infinity, ease: 'linear' }} />
        {/* Spire */}
        <path d="M 28 30 L 37.5 8 L 47 30 Z" fill="#8B9467" stroke="#6B7447" strokeWidth="1"/>
        <line x1="37.5" y1="8" x2="37.5" y2="2" stroke="#8B9467" strokeWidth="2"/>
        {/* Flag */}
        <motion.path d="M 37.5 2 L 48 6 L 37.5 10 Z" fill="#FF4444"
          animate={{ scaleX: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        {/* Windows */}
        {[[26,68],[38,68],[50,68],[26,83],[38,83],[50,83]].map(([x,y],i) => (
          <motion.rect key={i} x={x} y={y} width="5" height="6" rx="1" fill="#FFD700"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
        ))}
      </svg>
    </motion.div>
  )
}

/* ── Taj Mahal with reflection ── */
export const TajMahal = ({ size = 90, className = '' }) => (
  <motion.div className={`inline-block select-none ${className}`}
    animate={{ y: [0, -4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
    <svg width={size} height={size * 1.2} viewBox="0 0 90 108" fill="none">
      {/* Reflection pool */}
      <rect x="10" y="88" width="70" height="16" rx="3" fill="rgba(56,189,248,0.3)" stroke="rgba(56,189,248,0.5)" strokeWidth="1"/>
      {/* Reflection */}
      <path d="M 30 88 Q 45 96 60 88" fill="rgba(255,255,255,0.2)"/>
      {/* Base platform */}
      <rect x="15" y="78" width="60" height="12" rx="2" fill="#F5F0E8" stroke="#D4C9B0" strokeWidth="1"/>
      {/* Side minarets */}
      <rect x="12" y="50" width="10" height="30" rx="3" fill="#F5F0E8" stroke="#D4C9B0" strokeWidth="1"/>
      <path d="M 12 50 Q 17 40 22 50 Z" fill="#F5F0E8" stroke="#D4C9B0" strokeWidth="1"/>
      <circle cx="17" cy="38" r="3" fill="#F5F0E8" stroke="#D4C9B0" strokeWidth="1"/>
      <rect x="68" y="50" width="10" height="30" rx="3" fill="#F5F0E8" stroke="#D4C9B0" strokeWidth="1"/>
      <path d="M 68 50 Q 73 40 78 50 Z" fill="#F5F0E8" stroke="#D4C9B0" strokeWidth="1"/>
      <circle cx="73" cy="38" r="3" fill="#F5F0E8" stroke="#D4C9B0" strokeWidth="1"/>
      {/* Main building */}
      <rect x="25" y="52" width="40" height="28" rx="3" fill="#F5F0E8" stroke="#D4C9B0" strokeWidth="1.5"/>
      {/* Arched entrance */}
      <path d="M 35 80 L 35 62 Q 45 54 55 62 L 55 80 Z" fill="#E8E0D0" stroke="#D4C9B0" strokeWidth="1"/>
      {/* Main dome */}
      <path d="M 28 52 Q 45 20 62 52 Z" fill="#F5F0E8" stroke="#D4C9B0" strokeWidth="1.5"/>
      <circle cx="45" cy="22" r="4" fill="#F5F0E8" stroke="#D4C9B0" strokeWidth="1"/>
      <line x1="45" y1="18" x2="45" y2="12" stroke="#D4C9B0" strokeWidth="1.5"/>
      {/* Side domes */}
      <path d="M 25 52 Q 32 38 39 52 Z" fill="#F5F0E8" stroke="#D4C9B0" strokeWidth="1"/>
      <path d="M 51 52 Q 58 38 65 52 Z" fill="#F5F0E8" stroke="#D4C9B0" strokeWidth="1"/>
      {/* Decorative details */}
      <line x1="25" y1="62" x2="65" y2="62" stroke="#D4C9B0" strokeWidth="1"/>
      {/* Glow effect */}
      <motion.circle cx="45" cy="35" r="20" fill="rgba(255,215,0,0.05)"
        animate={{ r: [18, 24, 18], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 3, repeat: Infinity }} />
    </svg>
  </motion.div>
)

/* ── Burj Khalifa with glow ── */
export const BurjKhalifa = ({ size = 60, className = '' }) => (
  <motion.div className={`inline-block select-none ${className}`}
    animate={{ y: [0, -3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
    <svg width={size} height={size * 2.5} viewBox="0 0 60 150" fill="none">
      <defs>
        <linearGradient id="burjGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C0C0C0"/>
          <stop offset="100%" stopColor="#808080"/>
        </linearGradient>
      </defs>
      {/* Base */}
      <path d="M 10 140 L 20 80 L 40 80 L 50 140 Z" fill="url(#burjGrad)" stroke="#A0A0A0" strokeWidth="1"/>
      {/* Middle section */}
      <path d="M 20 80 L 24 40 L 36 40 L 40 80 Z" fill="url(#burjGrad)" stroke="#A0A0A0" strokeWidth="1"/>
      {/* Upper section */}
      <path d="M 24 40 L 27 15 L 33 15 L 36 40 Z" fill="url(#burjGrad)" stroke="#A0A0A0" strokeWidth="1"/>
      {/* Spire */}
      <path d="M 27 15 L 30 2 L 33 15 Z" fill="#C0C0C0"/>
      <line x1="30" y1="2" x2="30" y2="-2" stroke="#C0C0C0" strokeWidth="1.5"/>
      {/* Setbacks */}
      {[80, 60, 45, 30].map((y, i) => (
        <line key={i} x1={20 - i*2} y1={y} x2={40 + i*2} y2={y} stroke="#A0A0A0" strokeWidth="1"/>
      ))}
      {/* Windows glow */}
      {[[30,100],[30,115],[30,125],[30,90]].map(([x,y],i) => (
        <motion.circle key={i} cx={x} cy={y} r="1.5" fill="#FFD700"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
      ))}
      {/* Top beacon */}
      <motion.circle cx="30" cy="1" r="3" fill="#FF4444"
        animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
    </svg>
  </motion.div>
)
