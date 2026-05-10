export default function AnimatedBackground({ variant = 'light' }) {
  const isDark = variant === 'dark'

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">

      {/* Base gradient */}
      <div className="absolute inset-0" style={{
        background: isDark
          ? 'linear-gradient(180deg, #020817 0%, #050c1a 50%, #020817 100%)'
          : 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 50%, #e8f4fd 100%)',
      }} />

      {/* Aurora — CSS only */}
      {isDark && (
        <div className="absolute inset-0 opacity-15" style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(14,165,233,0.2) 35%, rgba(168,85,247,0.12) 65%, transparent 100%)',
          backgroundSize: '300% 300%',
          animation: 'gradientX 14s ease infinite',
        }} />
      )}

      {/* Light mode rays */}
      {!isDark && (
        <div className="absolute inset-0 opacity-25" style={{
          background: 'radial-gradient(ellipse at 20% 0%, rgba(56,189,248,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(168,85,247,0.08) 0%, transparent 50%)',
        }} />
      )}

      {/* Stars — CSS only, dark mode */}
      {isDark && (
        <div className="absolute inset-0">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${(i * 3.37) % 100}%`,
                top: `${(i * 4.61) % 85}%`,
                width: i % 5 === 0 ? 2 : 1,
                height: i % 5 === 0 ? 2 : 1,
                opacity: 0.55,
                animation: `starTwinkle ${2 + (i % 3)}s ease-in-out ${(i * 0.18) % 3}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Clouds — CSS only */}
      {[
        { top: '5%',  dur: '32s', delay: '0s',  opacity: isDark ? 0.1  : 0.4,  size: '5rem'   },
        { top: '14%', dur: '44s', delay: '10s', opacity: isDark ? 0.07 : 0.28, size: '3.5rem' },
        { top: '22%', dur: '55s', delay: '22s', opacity: isDark ? 0.05 : 0.2,  size: '3rem'   },
      ].map((c, i) => (
        <div key={i} className="absolute select-none"
          style={{ top: c.top, fontSize: c.size, opacity: c.opacity, animation: `cloudDrift ${c.dur} ${c.delay} linear infinite` }}>
          ☁️
        </div>
      ))}

      {/* Airplanes — CSS only */}
      <div className="absolute select-none text-xl"
        style={{ top: '8%', animation: 'cloudDrift 22s 0s linear infinite' }}>✈️</div>
      <div className="absolute select-none text-lg"
        style={{ top: '30%', opacity: 0.7, animation: 'cloudDrift 30s 12s linear infinite' }}>✈️</div>

      {/* Balloons — CSS only */}
      {[{ left: '76%', delay: '0s', dur: '7s' }, { left: '10%', delay: '2.5s', dur: '8.5s' }].map((b, i) => (
        <div key={i} className="absolute select-none text-2xl"
          style={{ left: b.left, top: '4%', animation: `float ${b.dur} ${b.delay} ease-in-out infinite` }}>
          🎈
        </div>
      ))}



      {/* City silhouette — static SVG */}
      <div className="absolute bottom-0 left-0 right-0 h-24">
        <svg viewBox="0 0 1440 96" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="cityG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#38bdf8' : '#0369a1'} stopOpacity="0.1" />
              <stop offset="100%" stopColor={isDark ? '#38bdf8' : '#0369a1'} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d="M0 96V60l20-14 10-18 10 18 15-22 10 22 18-28 12 28 15-20 10 20 20-26 12 26 18-32 12 32 20-16 10 16 18-22 12 22 22-30 14 30 20-12 10 12 18-18 12 18 24-36 14 36 20-14 10 14 18-20 12 20 20-26 14 26 18-10 10 10V96H0Z"
            fill="url(#cityG)" />
        </svg>
      </div>

      {/* Grid overlay — dark only, static */}
      {isDark && (
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
      )}
    </div>
  )
}
