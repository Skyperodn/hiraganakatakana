import { motion, useReducedMotion } from 'framer-motion'
import type { StreakBadgeProps } from './types'
import { SIZE_CONFIG, resolveIntensity } from './config'
import { mountVariants, pulsingFlameVariants } from './variants'

export default function StreakBadge({
  streak,
  longest,
  className,
  size = 'md',
}: StreakBadgeProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const safeStreak = Number.isFinite(streak) ? Math.max(0, Math.floor(streak)) : 0
  const safeLongest =
    typeof longest === 'number' && Number.isFinite(longest)
      ? Math.max(0, Math.floor(longest))
      : undefined

  const cfg = SIZE_CONFIG[size]
  const intensity = resolveIntensity(safeStreak)
  const showFlame = safeStreak >= 1 && intensity.showFlame
  const animate = !prefersReducedMotion

  const ariaLabel =
    safeStreak >= 1
      ? `Streak ${safeStreak} hari${safeLongest !== undefined ? `, terbaik ${safeLongest} hari` : ''}`
      : 'Belum ada streak, mulai streak hari ini'

  return (
    <motion.span
      role="status"
      aria-label={ariaLabel}
      variants={mountVariants}
      initial={animate ? 'hidden' : false}
      animate={animate ? 'visible' : undefined}
      className={[
        'inline-flex select-none items-center rounded-full font-medium',
        'whitespace-nowrap align-middle',
        cfg.pill,
        intensity.pillClass,
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <motion.span
        aria-hidden="true"
        variants={pulsingFlameVariants}
        initial={false}
        animate={animate && intensity.pulsing ? 'pulse' : 'rest'}
        className={['inline-block leading-none', cfg.flame].join(' ')}
        style={{
          opacity: intensity.flameOpacity,
          transformOrigin: '50% 85%',
          filter:
            intensity.pulsing && !animate
              ? 'drop-shadow(0 0 6px rgba(251, 146, 60, 0.75))'
              : undefined,
        }}
      >
        {showFlame ? '🔥' : '🕯️'}
      </motion.span>

      {safeStreak >= 1 ? (
        <span className="inline-flex items-baseline gap-1">
          <motion.span
            key={safeStreak}
            initial={animate ? { scale: 0.7, opacity: 0 } : false}
            animate={animate ? { scale: 1, opacity: 1 } : undefined}
            transition={{ type: 'spring', stiffness: 600, damping: 20 }}
            className={['font-bold tabular-nums leading-none', cfg.count].join(' ')}
          >
            {safeStreak}
          </motion.span>
          <span className={['font-normal leading-none', cfg.unit].join(' ')}>hari</span>
        </span>
      ) : (
        <span className={['font-normal leading-none', cfg.unit].join(' ')}>
          {intensity.label}
        </span>
      )}

      {safeStreak >= 1 && safeLongest !== undefined && safeLongest > 0 ? (
        <span
          aria-hidden="true"
          className={[
            'ml-0.5 hidden border-l border-current/20 pl-2 font-normal leading-none sm:inline',
            cfg.best,
          ].join(' ')}
        >
          terbaik: {safeLongest}
        </span>
      ) : null}
    </motion.span>
  )
}
