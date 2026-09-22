/**
 * SRS metrics — progress and accuracy fractions for UI meters.
 *
 * Responsibility: compute derived 0..1 numbers from a review state for display.
 */
import type { ReviewState } from '../../types'
import { BOX_RANGE, MIN_BOX } from './constants'

/**
 * Clamps a numeric value into the 0..1 range, shared by metric helpers.
 */
export function clamp01(value: number): number {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

/**
 * Progress through the Leitner boxes as a 0..1 fraction, for UI meters.
 *
 * Box 1 -> 0, Box 5 -> 1.
 */
export function boxProgress(state: ReviewState): number {
  return clamp01((state.box - MIN_BOX) / BOX_RANGE)
}

/**
 * Historical accuracy as a 0..1 fraction (0 when there are no attempts).
 */
export function accuracy(state: ReviewState): number {
  if (state.totalAttempts === 0) return 0
  return clamp01(state.totalCorrect / state.totalAttempts)
}
