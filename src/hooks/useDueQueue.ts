import { useMemo } from 'react'
import type { KanaItem, ReviewState, KanaRow } from '../types'
import { isDue } from '../lib/srs'
import { useProgress } from '../store/useProgress'
import { KANA_DATA } from '../data/kana'

/** Result shape returned by {@link useDueQueue}. */
export interface DueQueue {
  /** Unlocked cards with a review state whose `dueDate` is on or before today. */
  due: KanaItem[]
  /** Unlocked cards that have never been studied (no review state yet). */
  newCards: KanaItem[]
  /** All unlocked cards, regardless of review state (for dashboards). */
  allActive: KanaItem[]
}

/** Options for {@link pickSessionQueue}. */
export interface PickSessionOptions {
  /** Maximum number of new (never-studied) cards to include. Defaults to 10. */
  maxNew?: number
  /** Maximum number of due cards to include. Defaults to 30. */
  maxDue?: number
}

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

/**
 * Derives the session study queue from kana progress.
 *
 * Only cards whose `row` is present in `unlockedRows` are considered. The
 * result is memoized on the reactive `reviews` map and `unlockedRows` list.
 *
 * @returns `{ due, newCards, allActive }`.
 */
export function useDueQueue(): DueQueue {
  const reviews = useProgress((s: { reviews: Record<string, ReviewState> }) => s.reviews)
  const unlockedRows = useProgress((s: { unlockedRows: KanaRow[] }) => s.unlockedRows)

  return useMemo<DueQueue>(() => {
    const unlocked = new Set(unlockedRows)

    const due: KanaItem[] = []
    const newCards: KanaItem[] = []
    const allActive: KanaItem[] = []

    for (const kana of KANA_DATA) {
      if (!unlocked.has(kana.row)) continue

      allActive.push(kana)

      const state = reviews[kana.id]
      if (!state) {
        newCards.push(kana)
      } else if (isDue(state)) {
        due.push(kana)
      }
    }

    return { due, newCards, allActive }
  }, [reviews, unlockedRows])
}
