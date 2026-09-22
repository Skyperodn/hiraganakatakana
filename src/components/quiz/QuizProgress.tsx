import { motion } from 'framer-motion'

interface QuizProgressProps {
  index: number
  total: number
  correctCount: number
  wrongCount: number
  accent: string
  isTypeMode: boolean
}

export default function QuizProgress({
  index,
  total,
  correctCount,
  wrongCount,
  accent,
  isTypeMode,
}: QuizProgressProps) {
  // Progress counts the current card once it's answered → last card = 100%.
  const answeredProgress = index
  const progressPct = total === 0 ? 0 : (answeredProgress / total) * 100

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
        <span aria-live="polite">
          Kartu {Math.min(index + 1, total)} / {total}
        </span>
        <span
          className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          aria-live="polite"
        >
          Benar {correctCount} · Salah {wrongCount}
        </span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answeredProgress}
        aria-label="Progres sesi"
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accent }}
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ type: 'spring', stiffness: 220, damping: 30 }}
        />
      </div>
      <p className="hidden text-right text-[11px] text-slate-400 sm:block dark:text-slate-500">
        {isTypeMode
          ? 'Tekan Enter untuk periksa · lanjut'
          : 'Tekan 1–4 pilih · Enter lanjut'}
      </p>
    </div>
  )
}
