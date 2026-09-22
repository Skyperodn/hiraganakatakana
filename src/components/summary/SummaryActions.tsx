import { motion } from 'framer-motion'
import { itemVariants } from './variants'

interface SummaryActionsProps {
  onAgain: () => void
  onHome: () => void
  animate: boolean
  dueTomorrowCount: number
}

/** The "Sesi Lagi" / "Kembali" buttons plus the next-step nudge paragraph. */
export default function SummaryActions({
  onAgain,
  onHome,
  animate,
  dueTomorrowCount,
}: SummaryActionsProps) {
  return (
    <>
      <motion.section variants={itemVariants} className="flex flex-col gap-3 sm:flex-row">
        <motion.button
          type="button"
          onClick={onAgain}
          whileHover={animate ? { scale: 1.02 } : undefined}
          whileTap={animate ? { scale: 0.97 } : undefined}
          className="flex-1 rounded-2xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-900"
        >
          Sesi Lagi
        </motion.button>
        <motion.button
          type="button"
          onClick={onHome}
          whileHover={animate ? { scale: 1.02 } : undefined}
          whileTap={animate ? { scale: 0.97 } : undefined}
          className="flex-1 rounded-2xl border-2 border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
        >
          Kembali
        </motion.button>
      </motion.section>

      {/* Next-step nudge: tomorrow's due count (or a push to keep going). */}
      <motion.p
        variants={itemVariants}
        className="pb-4 text-center text-xs text-slate-400 dark:text-slate-500"
      >
        {dueTomorrowCount > 0
          ? `Besok ada ${dueTomorrowCount} kartu jatuh tempo — kembali untuk jaga streak 🔥`
          : 'Tidak ada jatuh tempo besok — naikkan box dengan sesi lagi'}
      </motion.p>
    </>
  )
}

export type { SummaryActionsProps }
