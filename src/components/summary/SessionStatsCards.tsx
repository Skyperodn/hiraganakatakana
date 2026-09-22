import { motion } from 'framer-motion'
import StreakBadge from '../StreakBadge'
import { itemVariants } from './variants'
import { CELEBRATION_THRESHOLD } from './constants'

interface SessionStatsCardsProps {
  currentStreak: number
  xp: number
  sessionXp: number
  ratio: number
}

/** The streak / XP card shown below the headline. */
export default function SessionStatsCards({
  currentStreak,
  xp,
  sessionXp,
  ratio,
}: SessionStatsCardsProps) {
  return (
    <motion.section
      variants={itemVariants}
      className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StreakBadge streak={currentStreak} size="md" />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {ratio >= CELEBRATION_THRESHOLD
            ? 'Tingkat akurasi tinggi! 🔥'
            : 'Terus jaga konsistensi'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            XP sesi ini
          </span>
          <span className="mt-0.5 block text-xl font-black tabular-nums text-slate-900 dark:text-white">
            +{sessionXp}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            XP
          </span>
        </div>
        <div className="rounded-2xl bg-amber-50 p-3 dark:bg-amber-950/30">
          <span className="text-xs font-medium text-amber-700/80 dark:text-amber-300/80">
            Total XP
          </span>
          <span className="mt-0.5 block text-xl font-black tabular-nums text-amber-600 dark:text-amber-400">
            {xp.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-amber-700/60 dark:text-amber-300/60">
            tersimpan
          </span>
        </div>
      </div>
    </motion.section>
  )
}

export type { SessionStatsCardsProps }
