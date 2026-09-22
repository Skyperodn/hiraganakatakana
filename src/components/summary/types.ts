import type { SessionResult } from '../../types'

/** A session result enriched with its kana item and current SRS box. */
export interface ResultRow {
  /** Stable React key / card identity. */
  id: string
  /** The kana character, e.g. "あ". */
  character: string
  /** The romanization, e.g. "a". */
  romaji: string
  /** Whether the learner answered this card correctly. */
  correct: boolean
  /** Leitner box from `reviews[kanaId]?.box`, or `null` when not yet tracked. */
  box: number | null
  /** CSS color reference for the kana's row. */
  color: string
}

/** Public props for {@link SessionSummary}. */
export interface SessionSummaryProps {
  /** The graded results captured during the finished session. */
  results: SessionResult[]
  /** Starts another session (restart). */
  onAgain: () => void
  /** Returns to the dashboard. */
  onHome: () => void
}
