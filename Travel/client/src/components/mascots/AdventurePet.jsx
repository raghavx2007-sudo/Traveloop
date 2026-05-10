import { motion } from 'framer-motion'

/**
 * ORIGINAL CHARACTER: "Globby" — the adventure pet companion
 * A cute round fantasy creature that looks like a tiny globe/planet with legs
 * Appears during loading and reacts to interactions
 */
export default function AdventurePet({ size = 70, animate = true, action = 'idle', className = '' }) {
  const s = size

  const idleAnim = {
    y: [0, -6, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }

  const runAnim = {
    x: [0, 8, 0, -8, 0],
    y: [0, -4, 0, -4, 0],
    transition: { duration: 0.6, repeat: Infinity }
  }

  const happyAnim = {
    rotate: [-10, 10, -10],
    scale: [1, 1.1, 1],
    transition: { duration: 0.5, repeat: Infinity }
  }

  const bodyAnim = action === 'run' ? runAnim : action === 'happy' ? happyAnim : idleAnim

  const eyeAnim = {
    scaleY: [1, 0.1, 1],
    transition: { duration: 3, repeat: Infinity, times: [0, 0.5, 0.6] }
  }

  const legAnim = action === 'run' ? {
    rotate: [-30, 30, -30],
    transition: { duration: 0.3, repeat: Infinity }
  } : {
    rotate: [-5, 5, -5],
    transition: { duration: 1.5, repeat: Infinity }
  }

  return (
    <motion.div className={`inline-block select-none ${className}`} animate={bodyAnim}>
      <svg width={s} height={s * 1.2} viewBox="0 0 70 84" fill="none" xmlns="http://www.w3.org/2000/svg">

        <defs>
          <radialGradient id="globeGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#7DD3FC"/>
            <stop offset="60%" stopColor="#0EA5E9"/>
            <stop offset="100%" stopColor="#0284C7"/>
          </radialGradient>
        </defs>

        {/* Shadow */}
        <motion.ellipse cx="35" cy="80" rx="14" ry="4" fill="rgba(0,0,0,0.12)"
          animate={{ scaleX: action === 'run' ? [1, 0.7, 1] : 1 }}
          transition={{ duration: 0.6, repeat: Infinity }} />

        {/* Legs */}
        <motion.g animate={legAnim} style={{ originX: '28px', originY: '62px' }}>
          <rect x="22" y="62" width="8" height="14" rx="4" fill="#0EA5E9"/>
          <ellipse cx="26" cy="76" rx="7" ry="4" fill="#0284C7"/>
        </motion.g>
        <motion.g animate={{ ...legAnim, rotate: legAnim.rotate ? legAnim.rotate.map(r => -r) : 0 }}
          style={{ originX: '42px', originY: '62px' }}>
          <rect x="40" y="62" width="8" height="14" rx="4" fill="#0EA5E9"/>
          <ellipse cx="44" cy="76" rx="7" ry="4" fill="#0284C7"/>
        </motion.g>

        {/* Tiny arms */}
        <motion.rect x="8" y="36" width="12" height="6" rx="3" fill="#38BDF8"
          animate={{ rotate: [-20, 20, -20] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.rect x="50" y="36" width="12" height="6" rx="3" fill="#38BDF8"
          animate={{ rotate: [20, -20, 20] }} transition={{ duration: 1.5, repeat: Infinity }} />

        {/* Main body — globe shape */}
        <circle cx="35" cy="36" r="28" fill="url(#globeGrad)" stroke="#0284C7" strokeWidth="2"/>

        {/* Globe lines — latitude */}
        <path d="M 7 36 Q 35 28 63 36" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
        <path d="M 10 26 Q 35 20 60 26" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"/>
        <path d="M 10 46 Q 35 52 60 46" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"/>
        {/* Globe lines — longitude */}
        <path d="M 35 8 Q 28 36 35 64" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"/>
        <path d="M 35 8 Q 42 36 35 64" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"/>

        {/* Continent blobs */}
        <ellipse cx="24" cy="30" rx="7" ry="5" fill="#22C55E" opacity="0.7"/>
        <ellipse cx="46" cy="34" rx="6" ry="4" fill="#22C55E" opacity="0.7"/>
        <ellipse cx="30" cy="44" rx="5" ry="3" fill="#22C55E" opacity="0.6"/>

        {/* Shine */}
        <ellipse cx="26" cy="22" rx="8" ry="5" fill="rgba(255,255,255,0.4)"/>

        {/* Eyes */}
        <motion.g animate={eyeAnim}>
          <circle cx="26" cy="34" r="7" fill="white"/>
          <circle cx="27" cy="34" r="4.5" fill="#1E3A5F"/>
          <circle cx="28.5" cy="32" r="1.5" fill="white"/>
          <circle cx="44" cy="34" r="7" fill="white"/>
          <circle cx="45" cy="34" r="4.5" fill="#1E3A5F"/>
          <circle cx="46.5" cy="32" r="1.5" fill="white"/>
        </motion.g>

        {/* Cheeks */}
        <circle cx="18" cy="40" r="5" fill="#FF6B6B" opacity="0.4"/>
        <circle cx="52" cy="40" r="5" fill="#FF6B6B" opacity="0.4"/>

        {/* Mouth */}
        <path d="M 27 44 Q 35 52 43 44" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

        {/* Tiny hat */}
        <rect x="28" y="8" width="14" height="8" rx="2" fill="#FF6B6B"/>
        <rect x="24" y="14" width="22" height="4" rx="2" fill="#E55A5A"/>
        {/* Hat star */}
        <text x="32" y="14" fontSize="6" fill="#FFD700">★</text>

        {/* Sparkles around when happy */}
        {action === 'happy' && (
          <>
            <motion.text x="2" y="16" fontSize="8" animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity }}>✨</motion.text>
            <motion.text x="58" y="16" fontSize="8" animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}>✨</motion.text>
          </>
        )}
      </svg>
    </motion.div>
  )
}
