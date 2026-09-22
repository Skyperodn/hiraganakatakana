import { motion } from 'framer-motion'
import type { KanaItem, SessionResult } from '../types'
import MatchingGame from '../components/MatchingGame'

interface MatchingScreenProps {
  pool: KanaItem[]
  onFinish: (results: SessionResult[]) => void
  onBack: () => void
}

/** Matching-game screen wrapper with a back-to-dashboard control. */
export default function MatchingScreen({ pool, onFinish, onBack }: MatchingScreenProps) {
  return (
    <motion.div
      key="matching"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <MatchingGame cards={pool} onFinish={onFinish} />
      <button
        type="button"
        onClick={onBack}
        className="mt-4 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
      >
        ← Kembali ke Dashboard
      </button>
    </motion.div>
  )
}
