import type { KanaRow, ReviewState } from '../../types'
import { FIRST_ROW } from './constants'

/**
 * Returns the default (fresh) data state for the progress store.
 * Actions are attached on top of this and are never persisted.
 */
export function createDefaultState() {
  return {
    reviews: {} as Record<string, ReviewState>,
    xp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null as string | null,
    unlockedRows: [FIRST_ROW] as KanaRow[],
    completedRows: [] as KanaRow[],
    familiarIds: [] as string[],
    darkMode: true,
    // Runtime-only flag (never partialized): set when localStorage rehydration fails.
    rehydrateError: false,
  }
}
