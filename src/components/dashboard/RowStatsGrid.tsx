import { motion } from 'framer-motion'
import type { KanaRow } from '../../types'
import { CheckCircleIcon, LockIcon } from './icons'
import CircularProgressRing from './ProgressRing'
import { containerVariants, itemVariants } from './variants'
import type { RowStat } from './types'

/** Per-row mastery rings grid. */
export default function RowStatsGrid({
  rowStats,
  darkMode,
  onSelectRow,
  unlockThreshold,
  minAttempts,
}: {
  rowStats: RowStat[]
  darkMode: boolean
  onSelectRow: (row: KanaRow) => void
  unlockThreshold: number
  minAttempts: number
}): React.JSX.Element {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Kemajuan per Baris</h2>
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {rowStats.map((stat) => {
          const pct = Math.round(stat.ratio * 100)
          const accPct = Math.round(stat.accuracy * 100)
          const interactive = !stat.locked

          return (
            <motion.li key={stat.meta.key} variants={itemVariants}>
              <button
                type="button"
                aria-disabled={!interactive}
                onClick={() => {
                  if (!interactive) return
                  onSelectRow(stat.meta.key)
                }}
                aria-label={`${stat.meta.name}, ${pct}% dikuasai${stat.locked ? ', terkunci' : ''}`}
                aria-describedby={stat.locked ? 'unlock-rule' : undefined}
                className={[
                  'relative flex w-full flex-col items-center gap-2.5 rounded-2xl border p-4 text-center shadow-sm transition',
                  interactive
                    ? 'cursor-pointer border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-[0.98] dark:border-slate-700/80 dark:bg-slate-800 dark:hover:border-slate-600'
                    : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900/60',
                ].join(' ')}
              >
                {stat.completed ? (
                  <CheckCircleIcon
                    className="absolute right-2.5 top-2.5 h-4 w-4 text-emerald-500"
                  />
                ) : null}

                <CircularProgressRing
                  size={92}
                  stroke={9}
                  progress={stat.ratio}
                  color={stat.color}
                  lightRim={!darkMode}
                >
                  {stat.locked ? (
                    <LockIcon className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                  ) : (
                    <>
                      <span className="tnum text-lg font-bold leading-none text-slate-900 dark:text-white">
                        {pct}%
                      </span>
                      <span className="tnum mt-0.5 text-[10px] font-medium leading-none text-slate-500 dark:text-slate-400">
                        {stat.mastered}/{stat.total}
                      </span>
                    </>
                  )}
                </CircularProgressRing>

                <span className="line-clamp-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {stat.meta.name}
                </span>

                <span className="tnum text-[11px] leading-none text-slate-500 dark:text-slate-400">
                  {stat.locked ? (
                    <span className="italic">Terkunci</span>
                  ) : (
                    <>
                      Akurasi {accPct}% · {stat.attempts} percobaan
                    </>
                  )}
                </span>
              </button>
            </motion.li>
          )
        })}
      </motion.ul>

      <p id="unlock-rule" className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Buka baris berikutnya dengan akurasi ≥ {Math.round(unlockThreshold * 100)}% dan minimal{' '}
        {minAttempts} percobaan.
      </p>
    </section>
  )
}
