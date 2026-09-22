import type { KanaRow, RowMeta } from '../../types'

/** Public props for {@link ProgressDashboard}. */
export interface ProgressDashboardProps {
  /** Starts a study session with the due/new queue. */
  onStart: () => void
  /** Opens a specific unlocked row's study view. */
  onSelectRow: (row: KanaRow) => void
  /** Optional entry point for the placement test. */
  onPlacement?: () => void
}

/** Props for the inline SVG progress ring. */
export interface CircularProgressRingProps {
  /** Outer diameter in px. */
  size: number
  /** Ring stroke width in px. */
  stroke: number
  /** Completion ratio, clamped to 0..1. */
  progress: number
  /** Stroke color (accepts CSS var references). */
  color: string
  /**
   * Light mode only: adds a subtle dark rim around the progress stroke so pale
   * row colors (e.g. yellow) stay distinguishable from the track (≥3:1 edge).
   */
  lightRim?: boolean
  /** Optional content rendered centered inside the ring. */
  children?: React.ReactNode
}

/** Statistic derived for a single kana row. */
export interface RowStat {
  meta: RowMeta
  color: string
  locked: boolean
  completed: boolean
  /** Cards in this row at box 5. */
  mastered: number
  /** Total cards belonging to this row. */
  total: number
  /** mastered / total, 0..1. */
  ratio: number
  /** Aggregate accuracy across the row's studied cards, 0..1. */
  accuracy: number
  /** Aggregate attempts across the row's studied cards. */
  attempts: number
}
