import { motion } from 'framer-motion'

interface PlacementResultProps {
  familiarIds: string[]
  wrongIds: string[]
  onDone: (familiarIds: string[]) => void
  onSkip: () => void
  prefersReducedMotion: boolean
}

export default function PlacementResult({
  familiarIds,
  wrongIds,
  onDone,
  onSkip,
  prefersReducedMotion,
}: PlacementResultProps) {
  const familiarCount = familiarIds.length
  const wrongCount = wrongIds.length

  return (
    <motion.section
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-10"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Tes penempatan selesai
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
          Hasilmu siap!
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/40">
            <p className="text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {familiarCount}
            </p>
            <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              familiar
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/40">
            <p className="text-3xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
              {wrongCount}
            </p>
            <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">
              perlu dilatih
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {familiarCount} familiar, {wrongCount} perlu dilatih. Karakter yang sudah kamu kuasai
          akan lebih jarang muncul.
        </p>
      </div>

      <motion.button
        type="button"
        onClick={() => onDone(familiarIds)}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
        className="w-full rounded-2xl bg-rose-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition-colors hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
      >
        Mulai Belajar
      </motion.button>

      <button
        type="button"
        onClick={onSkip}
        className="w-full rounded-2xl bg-slate-200 px-6 py-4 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        Lewati
      </button>
    </motion.section>
  )
}

export type { PlacementResultProps }
