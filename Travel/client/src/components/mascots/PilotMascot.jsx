import { motion } from 'framer-motion'

/**
 * ORIGINAL CHARACTER: "Captain Zoom" — the cartoon airplane pilot
 * Appears in loading screens and flight transitions
 * Original design with pilot hat, goggles, scarf
 */
export default function PilotMascot({ size = 100, animate = true, className = '' }) {
  const s = size

  const bodyAnim = animate ? {
    y: [0, -8, 0],
    rotate: [-2, 2, -2],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  } : {}

  const scarfAnim = animate ? {
    rotate: [-15, 15, -15],
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
  } : {}

  const eyeAnim = animate ? {
    scaleY: [1, 0.1, 1],
    transition: { duration: 4, repeat: Infinity, times: [0, 0.5, 0.6] }
  } : {}

  return (
    <motion.div className={`inline-block select-none ${className}`} animate={bodyAnim}>
      <svg width={s} height={s * 1.2} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">

        <defs>
          <linearGradient id="jacketGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E3A5F"/>
            <stop offset="100%" stopColor="#2D5A8E"/>
          </linearGradient>
          <linearGradient id="hatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A5F"/>
            <stop offset="100%" stopColor="#0F2040"/>
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="50" cy="116" rx="20" ry="4" fill="rgba(0,0,0,0.12)" />

        {/* Body / Jacket */}
        <rect x="30" y="68" width="40" height="34" rx="10" fill="url(#jacketGrad)"/>
        {/* Jacket buttons */}
        <circle cx="50" cy="76" r="2" fill="#FFD700"/>
        <circle cx="50" cy="84" r="2" fill="#FFD700"/>
        <circle cx="50" cy="92" r="2" fill="#FFD700"/>
        {/* Jacket lapels */}
        <path d="M 44 68 L 50 76 L 56 68" fill="#2D5A8E" stroke="#1E3A5F" strokeWidth="1"/>
        {/* Epaulettes */}
        <rect x="28" y="68" width="10" height="6" rx="3" fill="#FFD700"/>
        <rect x="62" y="68" width="10" height="6" rx="3" fill="#FFD700"/>
        {/* Epaulette stars */}
        <text x="30" y="74" fontSize="5" fill="#1E3A5F">★</text>
        <text x="64" y="74" fontSize="5" fill="#1E3A5F">★</text>

        {/* Scarf */}
        <motion.g animate={scarfAnim} style={{ originX: '50px', originY: '68px' }}>
          <path d="M 40 68 Q 50 72 60 68 Q 55 80 50 82 Q 45 80 40 68Z" fill="#FF6B6B"/>
          <path d="M 50 82 Q 48 90 46 96" stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round"/>
        </motion.g>

        {/* Arms */}
        <rect x="16" y="68" width="16" height="10" rx="5" fill="url(#jacketGrad)"/>
        <circle cx="16" cy="73" r="6" fill="#FFD93D" stroke="#F0C030" strokeWidth="1"/>
        <rect x="68" y="68" width="16" height="10" rx="5" fill="url(#jacketGrad)"/>
        {/* Right hand holding map */}
        <rect x="78" y="66" width="12" height="9" rx="2" fill="#FFF9C4" stroke="#F0C030" strokeWidth="1"/>
        <line x1="80" y1="69" x2="88" y2="69" stroke="#0EA5E9" strokeWidth="1"/>
        <line x1="80" y1="72" x2="88" y2="72" stroke="#0EA5E9" strokeWidth="1"/>

        {/* Legs */}
        <rect x="36" y="100" width="12" height="16" rx="5" fill="#1E3A5F"/>
        <rect x="52" y="100" width="12" height="16" rx="5" fill="#1E3A5F"/>
        {/* Boots */}
        <ellipse cx="42" cy="116" rx="9" ry="5" fill="#0F2040"/>
        <ellipse cx="58" cy="116" rx="9" ry="5" fill="#0F2040"/>

        {/* Neck */}
        <rect x="43" y="60" width="14" height="10" rx="4" fill="#FFD93D"/>

        {/* Head */}
        <circle cx="50" cy="46" r="24" fill="#FFD93D" stroke="#F0C030" strokeWidth="1.5"/>

        {/* Pilot Hat */}
        <rect x="24" y="30" width="52" height="10" rx="5" fill="url(#hatGrad)"/>
        <path d="M 28 30 Q 50 14 72 30" fill="url(#hatGrad)"/>
        {/* Hat brim */}
        <rect x="20" y="36" width="60" height="6" rx="3" fill="#0F2040"/>
        {/* Hat badge */}
        <circle cx="50" cy="24" r="6" fill="#FFD700" stroke="#F0C030" strokeWidth="1"/>
        <text x="47" y="27" fontSize="6" fill="#1E3A5F" fontWeight="bold">✈</text>
        {/* Hat stripe */}
        <rect x="24" y="34" width="52" height="3" fill="#FFD700" opacity="0.6"/>

        {/* Goggles */}
        <rect x="28" y="44" width="18" height="12" rx="5" fill="#0EA5E9" opacity="0.8" stroke="#0284C7" strokeWidth="1.5"/>
        <rect x="54" y="44" width="18" height="12" rx="5" fill="#0EA5E9" opacity="0.8" stroke="#0284C7" strokeWidth="1.5"/>
        {/* Goggle strap */}
        <rect x="46" y="47" width="8" height="6" rx="2" fill="#0284C7"/>
        {/* Goggle lenses */}
        <motion.g animate={eyeAnim}>
          <circle cx="37" cy="50" r="5" fill="white" opacity="0.9"/>
          <circle cx="38" cy="50" r="3" fill="#1E3A5F"/>
          <circle cx="39" cy="48" r="1" fill="white"/>
          <circle cx="63" cy="50" r="5" fill="white" opacity="0.9"/>
          <circle cx="64" cy="50" r="3" fill="#1E3A5F"/>
          <circle cx="65" cy="48" r="1" fill="white"/>
        </motion.g>

        {/* Cheeks */}
        <circle cx="30" cy="56" r="5" fill="#FF6B6B" opacity="0.4"/>
        <circle cx="70" cy="56" r="5" fill="#FF6B6B" opacity="0.4"/>

        {/* Smile */}
        <path d="M 40 60 Q 50 68 60 60" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" fill="none"/>

        {/* Nose */}
        <circle cx="50" cy="56" r="2.5" fill="#F0C030"/>

        {/* Ears */}
        <circle cx="26" cy="48" r="5" fill="#FFD93D" stroke="#F0C030" strokeWidth="1"/>
        <circle cx="74" cy="48" r="5" fill="#FFD93D" stroke="#F0C030" strokeWidth="1"/>
      </svg>
    </motion.div>
  )
}
