import { useMemo } from 'react'
import type { KanaItem, ReviewState, KanaRow } from '../../types'
import { isDue } from '../../lib/srs'
import { useProgress } from '../../store/useProgress'
import { KANA_DATA } from '../../data/kana'
import type { DueQueue } from './types'

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
