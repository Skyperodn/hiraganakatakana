import type { KanaItem, KanaRow, SessionResult } from '../types'

/** Top-level navigable screens. */
export type Screen =
  | 'dashboard'
  | 'session'
  | 'summary'
  | 'matching'
  | 'placement'
  | 'landing'

/** Caps for a single study session. */
export const MAX_NEW_PER_SESSION = 10
export const MAX_DUE_PER_SESSION = 30

/** localStorage key marking that onboarding has been completed. */
export const ONBOARDED_KEY = 'kana-onboarded-v1'

/** Random drill size used when a session has nothing due or new. */
export const RANDOM_DRILL_SIZE = 10

/** Minimum pool size required before the matching game can start. */
export const MIN_MATCHING_POOL = 6

/** Accuracy (0..1) at or above which the confetti burst fires. */
export const CELEBRATION_ACCURACY = 0.9

/** Screens the onboarding landing can route into. */
export type OnboardingTarget = Extract<Screen, 'dashboard' | 'placement'>

/**
 * Picks a random sample of `size` cards from a pool (Fisher–Yates via sort).
 * Used as a fallback drill when nothing is scheduled.
 */
export function randomDrill(pool: KanaItem[], size: number = RANDOM_DRILL_SIZE): KanaItem[] {
  return [...pool].sort(() => Math.random() - 0.5).slice(0, size)
}

/** Shape returned by the session controller. */
export interface SessionState {
  queue: KanaItem[]
  results: SessionResult[]
  focusRow: KanaRow | null
}
