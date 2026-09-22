import { motion } from 'framer-motion'
import type { KanaItem, KanaRow, SessionResult } from '../types'
import { rowMeta } from '../data/rows'
import QuizEngine from '../components/QuizEngine'

interface SessionScreenProps {
  queue: KanaItem[]
  focusRow: KanaRow | null
  onFinish: (results: SessionResult[]) => void
  onExit: () => void
}

const CONFIRM_MESSAGE =
  'Keluar sesi? Jawaban yang sudah dinilai tersimpan, tapi ringkasan sesi ini tidak ditampilkan.'

/** Active quiz session screen with a confirm-on-exit back control. */
export default function SessionScreen({
  queue,
  focusRow,
  onFinish,
  onExit,
}: SessionScreenProps) {
  const handleBack = () => {
    if (window.confirm(CONFIRM_MESSAGE)) onExit()
  }

  return (
    <motion.div
      key="session"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
        >
          ← Kembali
        </button>
        {focusRow && (
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {rowMeta(focusRow).name}
          </span>
        )}
      </div>
      <QuizEngine queue={queue} onFinish={onFinish} />
    </motion.div>
  )
}
