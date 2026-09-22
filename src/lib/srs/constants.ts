/**
 * SRS constants — Leitner box intervals and the valid box range.
 *
 * Responsibility: define the day intervals for each Leitner box and the
 * boundaries (MIN/MAX/range) of the Leitner box scale used across the SRS
 * logic. Pure data, no behavior.
 */
import type { LeitnerBox } from '../../types'

/**
 * Leitner box intervals, in days, describing when a card becomes due again.
 *
 * - Box 1 (new / wrong): due the same session (0 days)
 * - Box 2: 1 day
 * - Box 3: 3 days
 * - Box 4: 7 days
 * - Box 5 (mastered): 30 days
 */
export const BOX_INTERVAL_DAYS: Record<LeitnerBox, number> = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 30,
}

/** The highest Leitner box, treated as "mastered". */
export const MAX_BOX: LeitnerBox = 5

/** The lowest Leitner box, used for new cards and resets on wrong answers. */
export const MIN_BOX: LeitnerBox = 1

/** Number of `box` slots in the Leitner range (1..5). */
export const BOX_RANGE = MAX_BOX - MIN_BOX
