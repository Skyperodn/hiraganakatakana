/** XP awarded for a correct answer. */
export const XP_CORRECT = 10
/** Consolation XP awarded for a wrong answer (effort still counts). */
export const XP_WRONG = 2

/** The row that is always unlocked from a fresh state. */
export const FIRST_ROW = 'a' as const

/** localStorage key under which the progress store is persisted. */
export const STORAGE_KEY = 'kana-progress-v1'

/**
 * The onboarding flag lives in a SEPARATE localStorage key (`kana-onboarded-v1`).
 * It is intentionally never touched by this store (see `resetProgress`).
 */
export const ONBOARDING_NOTE =
  'The separate `kana-onboarded-v1` localStorage key is never touched here.'
