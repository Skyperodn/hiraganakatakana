import { motion } from 'framer-motion'
import { itemVariants } from './variants'
import AccuracyRing from './AccuracyRing'
import type { computeStats } from './stats'

interface SummaryHeadlineProps {
  stats: ReturnType<typeof computeStats>
  animate: boolean
  celebrating: boolean
}

/** The headline card: accuracy ring over the correct/wrong/total counts grid. */
export default function SummaryHeadline({ stats, animate, celebrating }: SummaryHeadlineProps) {
  return (
    <motion.section
      variants={itemVariants}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30"
    >
      <div className="relative flex flex-col items-center gap-4">
        <span className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Sesi Selesai
        </span>

        <AccuracyRing
          correct={stats.correct}
          total={stats.total}
          ratio={stats.ratio}
          animate={animate}
        />

        <motion.p
          initial={animate ? { opacity: 0, y: 8 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.5 }}
          className="text-lg font-bold text-slate-900 dark:text-white"
        >
          {celebrating ? '🎉 ' : ''}
          {stats.total > 0
            ? `${Math.round(stats.ratio * 100)}% benar — mantap!`
            : 'Belum ada jawaban dicatat'}
        </motion.p>

        <div className="flex w-full items-stretch gap-3">
          <div className="flex-1 rounded-2xl bg-emerald-50 px-4 py-3 text-center ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/40 dark:ring-emerald-900">
            <span className="block text-2xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">
              {stats.correct}
            </span>
            <span className="text-xs font-medium text-emerald-700/80 dark:text-emerald-300/80">
              benar
            </span>
          </div>
          <div className="flex-1 rounded-2xl bg-rose-50 px-4 py-3 text-center ring-1 ring-inset ring-rose-200 dark:bg-rose-950/40 dark:ring-rose-900">
            <span className="block text-2xl font-black tabular-nums text-rose-600 dark:text-rose-400">
              {stats.wrong}
            </span>
            <span className="text-xs font-medium text-rose-700/80 dark:text-rose-300/80">
              salah
            </span>
          </div>
          <div className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-center ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
            <span className="block text-2xl font-black tabular-nums text-slate-700 dark:text-slate-200">
              {stats.total}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              total
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export type { SummaryHeadlineProps }
