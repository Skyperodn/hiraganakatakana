import type { LeitnerBox, ReviewState } from '../types'

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
const MAX_BOX: LeitnerBox = 5

/** The lowest Leitner box, used for new cards and resets on wrong answers. */
const MIN_BOX: LeitnerBox = 1

/** Number of `box` slots in the Leitner range (1..5). */
const BOX_RANGE = MAX_BOX - MIN_BOX

/**
 * Returns today's date as a local `YYYY-MM-DD` string.
 *
 * Computed from the local year/month/day (NOT via `toISOString()`), so it
 * never drifts to the previous or next day because of UTC offsets.
 */
export function todayISO(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Adds `days` calendar days to a local `YYYY-MM-DD` date and returns the
 * resulting local `YYYY-MM-DD` string.
 *
 * Parsing is done from the individual components to keep everything in local
 * time and avoid UTC/timezone shifting bugs.
 */
export function addDays(isoDate: string, days: number): string {
  const [yearStr, monthStr, dayStr] = isoDate.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)

  // `Date` normalizes overflow (e.g. day 32 -> next month) automatically.
  const date = new Date(year, month - 1, day + days)

  const resultYear = date.getFullYear()
  const resultMonth = String(date.getMonth() + 1).padStart(2, '0')
  const resultDay = String(date.getDate()).padStart(2, '0')
  return `${resultYear}-${resultMonth}-${resultDay}`
}

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
function clampBox(value: number): LeitnerBox {
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

/**
 * Progress through the Leitner boxes as a 0..1 fraction, for UI meters.
 *
 * Box 1 -> 0, Box 5 -> 1.
 */
export function boxProgress(state: ReviewState): number {
  return (state.box - MIN_BOX) / BOX_RANGE
}

/**
 * Historical accuracy as a 0..1 fraction (0 when there are no attempts).
 */
export function accuracy(state: ReviewState): number {
  if (state.totalAttempts === 0) return 0
  return state.totalCorrect / state.totalAttempts
}
