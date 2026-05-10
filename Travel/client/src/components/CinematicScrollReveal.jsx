import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * CinematicScrollReveal — wraps children with a cinematic reveal animation
 * when they enter the viewport
 */
export default function CinematicScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 30,
  duration = 0.6,
  once = true,
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-60px 0px' })

  const directionMap = {
    up:    { y: distance, x: 0 },
    down:  { y: -distance, x: 0 },
    left:  { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    scale: { scale: 0.9, y: 0, x: 0 },
  }

  const initial = {
    opacity: 0,
    filter: 'blur(4px)',
    ...directionMap[direction],
  }

  const animate = isInView ? {
    opacity: 1,
    y: 0, x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  } : initial

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * StaggerReveal — reveals children one by one with stagger
 */
export function StaggerReveal({ children, className = '', staggerDelay = 0.08, baseDelay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' })

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={isInView ? {
                opacity: 1, y: 0, filter: 'blur(0px)',
                transition: { delay: baseDelay + i * staggerDelay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
              } : {}}
            >
              {child}
            </motion.div>
          ))
        : children}
    </div>
  )
}
