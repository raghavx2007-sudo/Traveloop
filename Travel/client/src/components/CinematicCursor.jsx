import { useEffect, useRef } from 'react'

/**
 * CinematicCursor — pure DOM cursor, zero React re-renders.
 * Uses requestAnimationFrame + direct style mutation for 60fps.
 */
export default function CinematicCursor() {
  const orbRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const orb  = orbRef.current
    const ring = ringRef.current
    if (!orb || !ring) return

    // Cache half-sizes once — avoids offsetWidth layout reflow every frame
    const ORB_HALF  = 6   // half of 12px default orb
    const RING_HALF = 16  // half of 32px default ring

    const pos   = { x: -200, y: -200 }  // current mouse position
    const trail = { x: -200, y: -200 }  // lagging ring position
    let   rafId = null
    let   isDown = false
    let   lastParticle = 0

    const lerp = (a, b, t) => a + (b - a) * t

    const tick = () => {
      trail.x = lerp(trail.x, pos.x, 0.13)
      trail.y = lerp(trail.y, pos.y, 0.13)

      // Use translate3d for GPU compositing — no layout reflow
      orb.style.transform  = `translate3d(${pos.x - ORB_HALF}px, ${pos.y - ORB_HALF}px, 0)${isDown ? ' scale(0.6)' : ''}`
      ring.style.transform = `translate3d(${trail.x - RING_HALF}px, ${trail.y - RING_HALF}px, 0)`

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    // Mouse move — clientX/Y are always viewport-relative, works with scroll
    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY

      const now = Date.now()
      if (now - lastParticle > 90) {
        lastParticle = now
        spawnParticle(e.clientX, e.clientY)
      }
    }

    // Hover state
    const onOver = (e) => {
      const el = e.target
      const interactive =
        el.tagName === 'BUTTON' || el.tagName === 'A' ||
        el.closest('button') || el.closest('a') ||
        el.getAttribute('role') === 'button'

      if (interactive) {
        orb.style.width  = '20px'
        orb.style.height = '20px'
        orb.style.background = 'radial-gradient(circle, #c084fc, #a855f7)'
        orb.style.boxShadow  = '0 0 18px rgba(168,85,247,0.9), 0 0 36px rgba(168,85,247,0.4)'
        ring.style.width  = '46px'
        ring.style.height = '46px'
        ring.style.borderColor = 'rgba(168,85,247,0.6)'
        ring.style.boxShadow   = '0 0 18px rgba(168,85,247,0.35)'
      } else {
        orb.style.width  = '12px'
        orb.style.height = '12px'
        orb.style.background = 'radial-gradient(circle, #7dd3fc, #0ea5e9)'
        orb.style.boxShadow  = '0 0 14px rgba(14,165,233,0.9), 0 0 28px rgba(14,165,233,0.4)'
        ring.style.width  = '32px'
        ring.style.height = '32px'
        ring.style.borderColor = 'rgba(14,165,233,0.5)'
        ring.style.boxShadow   = '0 0 12px rgba(14,165,233,0.3)'
      }
    }

    // Click — handled via isDown flag, not transform concatenation
    const onDown = () => { isDown = true }
    const onUp   = () => { isDown = false }

    // Hide cursor when it leaves the window
    const onLeave = () => { pos.x = -200; pos.y = -200; trail.x = -200; trail.y = -200 }
    const onEnter = (e) => { pos.x = e.clientX; pos.y = e.clientY }

    window.addEventListener('mousemove',  onMove,  { passive: true })
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    document.addEventListener('mouseover',  onOver,  { passive: true })
    document.addEventListener('mouseleave', onLeave, { passive: true })
    document.addEventListener('mouseenter', onEnter, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  return (
    <>
      {/* Particle container */}
      <div
        id="cursor-particles"
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0,
          pointerEvents: 'none',
          zIndex: 9997,
          overflow: 'hidden',
        }}
      />

      {/* Trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 32, height: 32,
          borderRadius: '50%',
          border: '2px solid rgba(14,165,233,0.5)',
          boxShadow: '0 0 12px rgba(14,165,233,0.3)',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
          // Only transition visual props, NOT transform (transform is driven by rAF)
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      />

      {/* Main orb */}
      <div
        ref={orbRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 12, height: 12,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #7dd3fc, #0ea5e9)',
          boxShadow: '0 0 14px rgba(14,165,233,0.9), 0 0 28px rgba(14,165,233,0.4)',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          transition: 'width 0.15s ease, height 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
        }}
      />
    </>
  )
}

/* ── Spawn particle directly into DOM — no React state ── */
function spawnParticle(x, y) {
  const container = document.getElementById('cursor-particles')
  if (!container) return

  const colors = ['#38bdf8', '#0ea5e9', '#a855f7', '#22d3ee', '#f59e0b']
  const color  = colors[Math.floor(Math.random() * colors.length)]
  const size   = 3 + Math.random() * 3
  const angle  = Math.random() * Math.PI * 2
  const dist   = 18 + Math.random() * 18

  const el = document.createElement('div')
  el.style.cssText = `
    position:fixed;
    left:${x}px;
    top:${y}px;
    width:${size}px;
    height:${size}px;
    margin-left:${-size / 2}px;
    margin-top:${-size / 2}px;
    border-radius:50%;
    background:${color};
    box-shadow:0 0 ${size * 2}px ${color};
    pointer-events:none;
    transition:transform 0.5s ease-out, opacity 0.5s ease-out;
    will-change:transform,opacity;
  `
  container.appendChild(el)

  requestAnimationFrame(() => {
    el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`
    el.style.opacity = '0'
  })

  setTimeout(() => el.remove(), 550)
}
