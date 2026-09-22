import { motion } from 'framer-motion'
import { CheckIcon } from './icons'

interface FeedbackBannerProps {
  correct: boolean
  romaji: string
  boxDelta: { pre: number; post: number } | null
  usedAlternate: boolean
  typedNorm: string
  showTypeAlternates: boolean
  typeAlternates: string[]
}

export default function FeedbackBanner({
  correct,
  romaji,
  boxDelta,
  usedAlternate,
  typedNorm,
  showTypeAlternates,
  typeAlternates,
}: FeedbackBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={[
        'relative z-10 w-full rounded-2xl px-4 py-3 text-center text-sm font-bold',
        correct
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
      ].join(' ')}
      role="status"
    >
      {correct ? (
        <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span className="inline-flex items-center gap-2">
            <CheckIcon className="h-5 w-5" /> Benar!
          </span>
          {usedAlternate && (
            <span className="text-xs font-medium opacity-80">
              ({typedNorm} juga oke)
            </span>
          )}
          {boxDelta && (
            <span className="text-xs font-semibold opacity-75">
              Box {boxDelta.pre} → {boxDelta.post}
            </span>
          )}
        </span>
      ) : (
        <span>
          Salah — jawaban <span className="font-extrabold">{romaji}</span>
          {boxDelta && (
            <span className="mt-1 block text-xs font-semibold opacity-75">
              Box {boxDelta.pre} → {boxDelta.post} · jatuh tempo lagi hari ini
            </span>
          )}
          {showTypeAlternates && (
            <span className="mt-1 block text-[11px] font-medium opacity-75">
              Diterima: {typeAlternates.join(' / ')}
            </span>
          )}
        </span>
      )}
    </motion.div>
  )
}
