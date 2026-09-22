import { motion } from 'framer-motion'
import { cardVariants } from './variants'

interface PlacementIntroProps {
  onStart: () => void
  onSkip: () => void
  questionCount: number
  prefersReducedMotion: boolean
}

export default function PlacementIntro({
  onStart,
  onSkip,
  questionCount,
  prefersReducedMotion,
}: PlacementIntroProps) {
  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-5 px-5 py-8">
      <motion.div
        variants={cardVariants}
        initial={prefersReducedMotion ? false : 'enter'}
        animate="center"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30"
      >
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Tes penempatan · {questionCount} soal · ±1 menit
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Karakter yang sudah kamu kuasai akan muncul lebih jarang; yang salah jadi prioritas
          latihan.
        </p>
      </motion.div>

      <motion.button
        type="button"
        onClick={onStart}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
        className="w-full rounded-2xl bg-rose-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition-colors hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
      >
        Mulai Tes
      </motion.button>
      <button
        type="button"
        onClick={onSkip}
        className="w-full rounded-2xl bg-slate-200 px-6 py-4 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        Lewati
      </button>
    </section>
  )
}

export type { PlacementIntroProps }
