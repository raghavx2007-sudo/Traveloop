import { motion } from 'framer-motion'

/**
 * ORIGINAL CHARACTER: "Zippy" — the cartoon explorer kid
 * Cute child traveler with big eyes, cap, backpack, and travel stickers
 * Inspired by adventure anime energy — 100% original design
 */
export default function ExplorerMascot({ size = 120, mood = 'happy', animate = true, className = '' }) {
  const s = size
  const eyeAnim = animate ? {
    scaleY: [1, 0.1, 1, 1, 0.1, 1],
    transition: { duration: 4, repeat: Infinity, times: [0, 0.1, 0.2, 0.7, 0.8, 0.9] }
  } : {}

  const bodyAnim = animate ? {
    y: [0, -6, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
  } : {}

  const armAnim = animate ? {
    rotate: [0, 15, 0, -5, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  } : {}

  const moodColors = {
    happy:   { face: '#FFD93D', cheek: '#FF6B6B', mouth: 'M 44 62 Q 50 70 56 62' },
    excited: { face: '#FFD93D', cheek: '#FF6B6B', mouth: 'M 42 60 Q 50 72 58 60' },
    thinking:{ face: '#FFE08A', cheek: '#FFB347', mouth: 'M 44 64 Q 50 66 56 64' },
    wave:    { face: '#FFD93D', cheek: '#FF6B6B', mouth: 'M 44 62 Q 50 70 56 62' },
  }
  const m = moodColors[mood] || moodColors.happy

  return (
    <motion.div className={`inline-block select-none ${className}`} animate={bodyAnim}>
      <svg width={s} height={s * 1.4} viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* Shadow */}
        <ellipse cx="50" cy="136" rx="22" ry="5" fill="rgba(0,0,0,0.12)" />

        {/* Backpack */}
        <rect x="58" y="72" width="18" height="22" rx="4" fill="#4ECDC4" stroke="#2BB5AC" strokeWidth="1.5"/>
        <rect x="60" y="76" width="14" height="8" rx="2" fill="#45B7AA"/>
        <circle cx="67" cy="88" r="2" fill="#2BB5AC"/>
        {/* Stickers on backpack */}
        <circle cx="62" cy="80" r="2" fill="#FF6B6B"/>
        <text x="59" y="83" fontSize="4" fill="white">★</text>

        {/* Body */}
        <rect x="34" y="72" width="32" height="30" rx="8" fill="#6C63FF"/>
        {/* Shirt stripe */}
        <rect x="34" y="80" width="32" height="4" fill="#5A52E0"/>
        {/* Collar */}
        <path d="M 44 72 L 50 78 L 56 72" fill="#FF6B6B" stroke="#E55A5A" strokeWidth="1"/>

        {/* Left arm */}
        <motion.g animate={armAnim} style={{ originX: '38px', originY: '76px' }}>
          <rect x="26" y="72" width="10" height="22" rx="5" fill="#FFD93D"/>
          {/* Hand */}
          <circle cx="31" cy="96" r="5" fill="#FFD93D" stroke="#F0C030" strokeWidth="1"/>
          {/* Waving fingers */}
          {mood === 'wave' && <>
            <rect x="27" y="100" width="3" height="6" rx="1.5" fill="#FFD93D"/>
            <rect x="31" y="101" width="3" height="7" rx="1.5" fill="#FFD93D"/>
            <rect x="35" y="100" width="3" height="6" rx="1.5" fill="#FFD93D"/>
          </>}
        </motion.g>

        {/* Right arm */}
        <rect x="64" y="72" width="10" height="22" rx="5" fill="#FFD93D"/>
        <circle cx="69" cy="96" r="5" fill="#FFD93D" stroke="#F0C030" strokeWidth="1"/>

        {/* Legs */}
        <rect x="38" y="100" width="10" height="24" rx="5" fill="#3D3D8F"/>
        <rect x="52" y="100" width="10" height="24" rx="5" fill="#3D3D8F"/>
        {/* Shoes */}
        <ellipse cx="43" cy="124" rx="8" ry="5" fill="#2C2C6E"/>
        <ellipse cx="57" cy="124" rx="8" ry="5" fill="#2C2C6E"/>
        {/* Shoe shine */}
        <ellipse cx="40" cy="122" rx="3" ry="2" fill="rgba(255,255,255,0.3)"/>
        <ellipse cx="54" cy="122" rx="3" ry="2" fill="rgba(255,255,255,0.3)"/>

        {/* Neck */}
        <rect x="44" y="64" width="12" height="10" rx="4" fill="#FFD93D"/>

        {/* Head */}
        <circle cx="50" cy="50" r="24" fill={m.face} stroke="#F0C030" strokeWidth="1.5"/>

        {/* Cap */}
        <path d="M 26 46 Q 50 28 74 46" fill="#FF6B6B" stroke="#E55A5A" strokeWidth="1.5"/>
        <rect x="22" y="44" width="56" height="8" rx="4" fill="#FF6B6B" stroke="#E55A5A" strokeWidth="1.5"/>
        {/* Cap brim */}
        <rect x="18" y="48" width="64" height="5" rx="2.5" fill="#E55A5A"/>
        {/* Cap logo */}
        <circle cx="50" cy="40" r="4" fill="#FFD93D"/>
        <text x="47.5" y="43" fontSize="5" fill="#FF6B6B" fontWeight="bold">T</text>

        {/* Eyes */}
        <motion.g animate={eyeAnim}>
          {/* Left eye */}
          <circle cx="40" cy="52" r="6" fill="white"/>
          <circle cx="41" cy="52" r="4" fill="#2C2C2C"/>
          <circle cx="42" cy="50" r="1.5" fill="white"/>
          {/* Right eye */}
          <circle cx="60" cy="52" r="6" fill="white"/>
          <circle cx="61" cy="52" r="4" fill="#2C2C2C"/>
          <circle cx="62" cy="50" r="1.5" fill="white"/>
        </motion.g>

        {/* Eyebrows */}
        <path d="M 35 44 Q 40 41 45 44" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M 55 44 Q 60 41 65 44" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" fill="none"/>

        {/* Cheeks */}
        <circle cx="34" cy="58" r="5" fill={m.cheek} opacity="0.5"/>
        <circle cx="66" cy="58" r="5" fill={m.cheek} opacity="0.5"/>

        {/* Mouth */}
        <path d={m.mouth} stroke="#8B6914" strokeWidth="2" strokeLinecap="round" fill="none"/>

        {/* Nose */}
        <circle cx="50" cy="57" r="2" fill="#F0C030"/>

        {/* Ear */}
        <circle cx="26" cy="52" r="5" fill={m.face} stroke="#F0C030" strokeWidth="1"/>
        <circle cx="74" cy="52" r="5" fill={m.face} stroke="#F0C030" strokeWidth="1"/>

        {/* Travel sticker on shirt */}
        <circle cx="42" cy="85" r="4" fill="#FFD93D" stroke="#F0C030" strokeWidth="1"/>
        <text x="39.5" y="88" fontSize="5" fill="#FF6B6B">✈</text>
      </svg>
    </motion.div>
  )
}
