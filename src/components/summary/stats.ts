import type { KanaItem, ReviewState, SessionResult } from '../../types'
import { KANA_DATA } from '../../data/kana'
import { rowColor } from '../../data/rows'
import { addDays, todayISO } from '../../lib/srs'
import type { ResultRow } from './types'
import { XP_PER_CORRECT, XP_PER_WRONG } from './constants'

/** Clamps a number to the inclusive [0, 1] range. */
export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

/** Aggregated session statistics derived from the graded results. */
export function computeStats(results: SessionResult[]) {
  const total = results.length
  const correct = results.filter((r) => r.correct).length
  const wrong = total - correct
  const ratio = total > 0 ? correct / total : 0
  const xpCorrect = correct * XP_PER_CORRECT
  const xpWrong = wrong * XP_PER_WRONG
  return {
    total,
    correct,
    wrong,
    ratio,
    sessionXp: xpCorrect + xpWrong,
    xpCorrect,
    xpWrong,
  }
}

/** Builds the sorted per-card rows (wrong first, then ascending box). */
export function buildResultRows(
  results: SessionResult[],
  reviews: Record<string, ReviewState>,
): ResultRow[] {
  const byId = new Map<string, KanaItem>()
  for (const kana of KANA_DATA) byId.set(kana.id, kana)

  return results
    .map((result): ResultRow => {
      const kana = byId.get(result.kanaId)
      const review = reviews[result.kanaId]
      return {
        id: result.kanaId,
        character: kana?.character ?? result.character,
        romaji: kana?.romaji ?? result.romaji,
        correct: result.correct,
        box: review ? review.box : null,
        color: kana ? rowColor(kana.row) : 'var(--color-row-a)',
      }
    })
    .sort((a, b) => {
      // Wrong answers first so problem cards are visible.
      if (a.correct !== b.correct) return a.correct ? 1 : -1
      // Then by box ascending (untracked cards treated as box 0).
      const boxA = a.box ?? 0
      const boxB = b.box ?? 0
      return boxA - boxB
    })
}

/** Cards whose dueDate falls exactly tomorrow — drives the next-session nudge. */
export function countDueTomorrow(reviews: Record<string, ReviewState>): number {
  const tomorrow = addDays(todayISO(), 1)
  return Object.values(reviews).filter((r) => r.dueDate === tomorrow).length
}
