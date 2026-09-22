import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface ConfettiProps {
  /** when this number changes / increments, fire a new burst */
  trigger?: number
  /** number of particles per burst, default ~28 */
  count?: number
  className?: string
}

/** Palette matching the kana row colors. */
const COLORS: readonly string[] = [
  '#ec4899', // pink
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#6366f1', // indigo
]

const BURST_DURATION_MS = 1600

interface Particle {
  id: string
  color: string
  size: number
  x: number
  y: number
  rotate: number
  rotateEnd: number
  scale: number
  delay: number
  duration: number
  radius: number
  shape: 'circle' | 'rect'
}

const rand = (min: number, max: number): number => min + Math.random() * (max - min)

const buildParticles = (burstId: number, count: number): Particle[] => {
  const safeCount = Math.max(0, Math.floor(count))
  return Array.from({ length: safeCount }, (_, i): Particle => {
    const angle = rand(-Math.PI, 0)
    const velocity = rand(90, 320)
    const size = rand(6, 12)
    return {
      id: `${burstId}-${i}`,
      color: COLORS[i % COLORS.length] ?? '#ec4899',
      size,
      x: Math.cos(angle) * velocity * rand(0.6, 1.4),
      y: Math.sin(angle) * velocity * rand(0.6, 1.4) - rand(40, 140),
      rotate: rand(0, 360),
      rotateEnd: rand(-540, 540),
      scale: rand(0.6, 1.2),
      delay: rand(0, 0.12),
      duration: rand(0.9, 1.5),
      radius: size * 0.25,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }
  })
}

/**
 * Dependency-free confetti burst overlay.
 *
 * Renders a full-screen, non-interactive overlay that fires a fresh burst of
 * particles whenever `trigger` changes. Particles emanate from the center-top
 * of the viewport, drift outward, then fade. The overlay auto-cleans after
 * ~1.6s. Reduced-motion users get no animation.
 */
export default function Confetti({
  trigger = 0,
  count = 28,
  className,
}: ConfettiProps) {
  const prefersReducedMotion = useReducedMotion()
  const [burstId, setBurstId] = useState(0)
  const [visible, setVisible] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setBurstId((prev) => prev + 1)
    setVisible(true)
  }, [trigger])

  useEffect(() => {
    if (!visible) return
    const timer = window.setTimeout(() => setVisible(false), BURST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [visible, burstId])

  const particles = useMemo<Particle[]>(
    () => (prefersReducedMotion ? [] : buildParticles(burstId, count)),
    [burstId, count, prefersReducedMotion],
  )

  if (prefersReducedMotion) return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden ${className ?? ''}`}
    >
      <AnimatePresence>
        {visible &&
          particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
                scale: p.scale,
                rotate: p.rotate,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: p.x,
                y: p.y,
                rotate: p.rotateEnd,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeOut',
                opacity: {
                  duration: p.duration,
                  delay: p.delay,
                  times: [0, 0.15, 0.7, 1],
                  ease: 'linear',
                },
              }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '35%',
                width: p.size,
                height: p.size,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
                backgroundColor: p.color,
                borderRadius: p.shape === 'circle' ? '9999px' : p.radius,
                willChange: 'transform, opacity',
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  )
}
