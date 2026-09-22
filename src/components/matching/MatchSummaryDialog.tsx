import type { JSX } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface MatchSummaryDialogProps {
  open: boolean
  accuracy: number
  attempts: number
  mistakes: number
  totalPairs: number
  onReset: () => void
  onFinish: () => void
}

export default function MatchSummaryDialog({
  open,
  accuracy,
  attempts,
  mistakes,
  totalPairs,
  onReset,
  onFinish,
}: MatchSummaryDialogProps): JSX.Element {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="matching-summary-title"
            className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl dark:bg-emerald-900/40">
              🎉
            </div>
            <h3
              id="matching-summary-title"
              className="text-xl font-extrabold text-slate-800 dark:text-slate-100"
            >
              Selesai!
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Kamu mencocokkan {totalPairs} pasangan.
            </p>

            <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                  Akurasi
                </dt>
                <dd className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
                  {accuracy}%
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                  Percobaan
                </dt>
                <dd className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
                  {attempts}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                  Salah
                </dt>
                <dd className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
                  {mistakes}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onReset}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-sky-400"
              >
                Main lagi
              </button>
              <button
                type="button"
                onClick={onFinish}
                className="flex-1 rounded-2xl bg-sky-500 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-sky-400"
              >
                Lanjut
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
