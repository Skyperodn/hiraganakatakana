import { motion, useReducedMotion, type Variants } from 'framer-motion'

interface StreakBadgeProps {
  streak: number
  longest?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

type Size = NonNullable<StreakBadgeProps['size']>

interface SizeConfig {
  pill: string
  flame: string
  count: string
  unit: string
  best: string
}

const SIZE_CONFIG: Record<Size, SizeConfig> = {
  sm: {
    pill: 'gap-1 px-2.5 py-0.5 text-xs',
    flame: 'text-sm',
    count: 'text-sm',
    unit: 'text-[10px]',
    best: 'text-[10px]',
  },
  md: {
    pill: 'gap-1.5 px-3.5 py-1.5 text-sm',
    flame: 'text-lg',
    count: 'text-base',
    unit: 'text-xs',
    best: 'text-xs',
  },
  lg: {
    pill: 'gap-2 px-5 py-2.5 text-base',
    flame: 'text-2xl',
    count: 'text-xl',
    unit: 'text-sm',
    best: 'text-sm',
  },
}

interface Intensity {
  label: string
  pillClass: string
  flameOpacity: number
  showFlame: boolean
  pulsing: boolean
}

function resolveIntensity(streak: number): Intensity {
  if (streak < 1) {
    return {
      label: 'Mulai streak hari ini',
      pillClass:
        'bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-300 ' +
        'dark:bg-slate-800/70 dark:text-slate-400 dark:ring-slate-700',
      flameOpacity: 0.4,
      showFlame: false,
      pulsing: false,
    }
  }
  if (streak <= 2) {
    return {
      label: 'Sedang memanas',
      pillClass:
        'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-300 ' +
        'dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
      flameOpacity: 0.85,
      showFlame: true,
      pulsing: false,
    }
  }
  if (streak <= 6) {
    return {
      label: 'Terus membara',
      pillClass:
        'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-300 ' +
        'dark:bg-orange-950/50 dark:text-orange-300 dark:ring-orange-800',
      flameOpacity: 1,
      showFlame: true,
      pulsing: false,
    }
  }
  return {
    label: 'Luar biasa',
    pillClass:
      'bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white ' +
      'ring-1 ring-inset ring-orange-300/60 shadow-lg shadow-orange-500/30 ' +
      'dark:from-orange-500 dark:via-orange-600 dark:to-amber-600 dark:ring-orange-400/40',
    flameOpacity: 1,
    showFlame: true,
    pulsing: true,
  }
}

const mountVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 520, damping: 18, mass: 0.7 },
  },
}

const pulsingFlameVariants: Variants = {
  rest: { scale: 1, rotate: 0, filter: 'brightness(1)' },
  pulse: {
    scale: [1, 1.16, 1],
    rotate: [0, -4, 3, 0],
    filter: ['brightness(1)', 'brightness(1.25)', 'brightness(1)'],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: 'easeInOut',
      times: [0, 0.5, 1],
    },
  },
}

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

export type { StreakBadgeProps }
