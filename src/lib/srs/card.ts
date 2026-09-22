/**
 * SRS card logic — initial state, box clamping, grading and due checks.
 *
 * Responsibility: create review states, transition them forward/backward via
 * Leitner grading, and decide whether a card is due for review.
 */
import type { LeitnerBox, ReviewState } from '../../types'
import { BOX_INTERVAL_DAYS, MAX_BOX, MIN_BOX } from './constants'
import { addDays, todayISO } from './date'

/**
 * Whether a card is due for review.
 *
 * A card is due when its `dueDate` is on or before the reference day
 * (defaults to today).
 */
export function isDue(state: ReviewState, now: string = todayISO()): boolean {
  return state.dueDate <= now
}

/**
 * Creates a fresh review state for a kana card.
 *
 * New cards default to box 1 (due immediately / same session) with zeroed
 * attempt counters.
 */
export function createInitialState(
  kanaId: string,
  box: LeitnerBox = MIN_BOX,
): ReviewState {
  return {
    kanaId,
    box,
    dueDate: addDays(todayISO(), BOX_INTERVAL_DAYS[box]),
    correctStreak: 0,
    totalAttempts: 0,
    totalCorrect: 0,
  }
}

/**
 * Clamps a numeric box value into the valid `LeitnerBox` range (1..5).
 */
export function clampBox(value: number): LeitnerBox {
  if (value < MIN_BOX) return MIN_BOX
  if (value > MAX_BOX) return MAX_BOX
  return value as LeitnerBox
}

/**
 * Grades a card after a review, returning a NEW state object (immutable).
 *
 * - Correct: move up one box (capped at 5) and grow `correctStreak`.
 * - Wrong: reset to box 1 and reset `correctStreak` to 0.
 *
 * `totalAttempts` always increments; `totalCorrect` increments only when
 * correct. The next `dueDate` is derived from the new box's interval.
 */
export function gradeCard(
  state: ReviewState,
  correct: boolean,
  now: string = todayISO(),
): ReviewState {
  const nextBox: LeitnerBox = correct
    ? clampBox(state.box + 1)
    : MIN_BOX

  return {
    ...state,
    box: nextBox,
    dueDate: addDays(now, BOX_INTERVAL_DAYS[nextBox]),
    correctStreak: correct ? state.correctStreak + 1 : 0,
    totalAttempts: state.totalAttempts + 1,
    totalCorrect: state.totalCorrect + (correct ? 1 : 0),
  }
}
