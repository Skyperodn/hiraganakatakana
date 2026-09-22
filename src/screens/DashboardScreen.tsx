import { motion } from 'framer-motion'
import type { KanaRow } from '../types'
import ProgressDashboard from '../components/ProgressDashboard'
import RowSelector from '../components/RowSelector'

interface DashboardScreenProps {
  focusRow: KanaRow | null
  onStart: () => void
  onSelectRow: (row: KanaRow) => void
  onPlacement: () => void
  onMatching: () => void
}

/** Dashboard screen: progress overview + gojuon row picker + matching entry. */
export default function DashboardScreen({
  focusRow,
  onStart,
  onSelectRow,
  onPlacement,
  onMatching,
}: DashboardScreenProps) {
  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <ProgressDashboard onStart={onStart} onSelectRow={onSelectRow} onPlacement={onPlacement} />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Pilih Baris Gojuon
        </h2>
        <RowSelector selected={focusRow} onSelect={onSelectRow} />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onMatching}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            Matching Game
          </button>
        </div>
      </div>
    </motion.div>
  )
}
