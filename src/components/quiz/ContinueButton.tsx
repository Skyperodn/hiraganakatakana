import { motion } from 'framer-motion'
import { CheckIcon, PlayIcon } from './icons'

interface ContinueButtonProps {
  /** Zero-based index of the current card. */
  index: number
  total: number
  onContinue: () => void
}

/**
 * Post-feedback "Lanjut" / "Selesai" button. Shown after an answer and
 * preferred over the auto-advance timer, which the learner can beat.
 */
export default function ContinueButton({ index, total, onContinue }: ContinueButtonProps) {
  const isLast = index + 1 >= total

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
      <button
        type="button"
        onClick={onContinue}
        autoFocus
        aria-label={isLast ? 'Selesai, lihat hasil' : 'Lanjut ke kartu berikutnya'}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-slate-800 focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:outline-none active:scale-[0.99] dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        {isLast ? (
          <>
            <CheckIcon className="h-5 w-5" /> Selesai
          </>
        ) : (
          <>
            Lanjut <PlayIcon className="h-5 w-5" />
          </>
        )}
      </button>
    </motion.div>
  )
}
