import type { JSX } from 'react'
import { motion } from 'framer-motion'

interface MatchHeaderProps {
  matchedCount: number
  totalPairs: number
  attempts: number
  announcement: string
}

export default function MatchHeader({
  matchedCount,
  totalPairs,
  attempts,
  announcement,
}: MatchHeaderProps): JSX.Element {
  return (
    <>
      {/* Header */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
            Mencocokkan Kana
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Ketuk kana lalu romaji untuk mencocokkan.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
          <span
            className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            aria-hidden="true"
          >
            Cocok {matchedCount}/{totalPairs}
          </span>
          <span
            className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            aria-hidden="true"
          >
            Percobaan {attempts}
          </span>
        </div>
      </header>

      {/* Live region: announces match outcomes for screen readers. */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={totalPairs}
        aria-valuenow={matchedCount}
        aria-label="Progres mencocokkan"
        className="mb-5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
          initial={false}
          animate={{ width: `${(matchedCount / totalPairs) * 100}%` }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        />
      </div>
    </>
  )
}
