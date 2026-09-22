import { motion } from 'framer-motion'
import { clamp01 } from './stats'
import { CELEBRATION_THRESHOLD } from './constants'

interface AccuracyRingProps {
  correct: number
  total: number
  ratio: number
  animate: boolean
}

/** The circular accuracy ring with the headline percentage centered inside. */
export default function AccuracyRing({ correct, total, ratio, animate }: AccuracyRingProps) {
  const size = 176
  const stroke = 14
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.round(clamp01(ratio) * 100)

  const tone =
    ratio >= CELEBRATION_THRESHOLD
      ? { ring: 'text-emerald-500', glow: 'shadow-emerald-500/25', label: 'Luar biasa!' }
      : ratio >= 0.7
        ? { ring: 'text-sky-500', glow: 'shadow-sky-500/20', label: 'Bagus!' }
        : ratio >= 0.4
          ? { ring: 'text-amber-500', glow: 'shadow-amber-500/20', label: 'Terus latihan' }
          : { ring: 'text-rose-500', glow: 'shadow-rose-500/20', label: 'Semangat!' }

  return (
    <div className="relative grid place-items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
        role="img"
        aria-label={`Akurasi ${pct} persen, ${correct} benar dari ${total} soal`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-200 dark:stroke-slate-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={['stroke-current', tone.ring].join(' ')}
          strokeDasharray={circumference}
          initial={
            animate
              ? { strokeDashoffset: circumference }
              : { strokeDashoffset: circumference * (1 - clamp01(ratio)) }
          }
          animate={{ strokeDashoffset: circumference * (1 - clamp01(ratio)) }}
          transition={{ duration: animate ? 1.1 : 0, ease: 'easeOut', delay: 0.15 }}
          style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div
          className={[
            'grid h-[128px] w-[128px] place-items-center rounded-full bg-white',
            'shadow-lg dark:bg-slate-900',
            tone.glow,
          ].join(' ')}
        >
          <div className="text-center">
            <motion.span
              initial={animate ? { scale: 0.7, opacity: 0 } : false}
              animate={animate ? { scale: 1, opacity: 1 } : undefined}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.35 }}
              className="block text-4xl font-black tabular-nums leading-none text-slate-900 dark:text-white"
            >
              {pct}
              <span className="text-2xl align-top">%</span>
            </motion.span>
            <span className="mt-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              akurasi
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export type { AccuracyRingProps }
