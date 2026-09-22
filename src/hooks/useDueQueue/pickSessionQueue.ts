import type { KanaItem } from '../../types'
import { useProgress } from '../../store/useProgress'

/**
 * Builds the study queue for the current session: due review cards first
 * (most-overdue first, capped at `maxDue` so huge backlogs don't produce
 * marathon sessions), followed by up to `maxNew` never-studied cards.
 *
 * @param due       Cards that are due for review.
 * @param newCards  Cards that have never been studied.
 * @param maxNew    Maximum number of new cards to append (default 10).
 * @param maxDue    Maximum number of due cards to prepend (default 30).
 */
export function pickSessionQueue(
  due: KanaItem[],
  newCards: KanaItem[],
  maxNew: number = 10,
  maxDue: number = 30,
): KanaItem[] {
  const reviews = useProgress.getState().reviews
  const sortedDue = [...due].sort((a, b) => {
    // ISO YYYY-MM-DD strings compare lexicographically; earliest = most overdue.
    const dateA = reviews[a.id]?.dueDate ?? ''
    const dateB = reviews[b.id]?.dueDate ?? ''
    if (dateA < dateB) return -1
    if (dateA > dateB) return 1
    return 0
  })
  return [
    ...sortedDue.slice(0, Math.max(0, maxDue)),
    ...newCards.slice(0, Math.max(0, maxNew)),
  ]
}
