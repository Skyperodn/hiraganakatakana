import { motion } from 'framer-motion'
import type { KanaRow, SessionResult } from '../types'
import SessionSummary from '../components/SessionSummary'

interface SummaryScreenProps {
  results: SessionResult[]
  focusRow: KanaRow | null
  onAgain: (row: KanaRow | null) => void
  onHome: () => void
}

/** End-of-session summary screen wrapper. */
export default function SummaryScreen({
  results,
  focusRow,
  onAgain,
  onHome,
}: SummaryScreenProps) {
  return (
    <motion.div
      key="summary"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <SessionSummary results={results} onAgain={() => onAgain(focusRow)} onHome={onHome} />
    </motion.div>
  )
}
