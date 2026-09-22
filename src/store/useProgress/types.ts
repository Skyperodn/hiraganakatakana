import type { KanaRow, ReviewState } from '../../types'

export interface ProgressState {
  // per-card SRS review state keyed by kanaId
  reviews: Record<string, ReviewState>
  // XP + gamification
  xp: number
  // daily streak
  currentStreak: number
  longestStreak: number
  lastStudyDate: string | null // ISO date of last study day
  // unlocked rows (ordered). Always starts with ['a'].
  unlockedRows: KanaRow[]
  // rows fully mastered (100% of row cards in box 5)
  completedRows: KanaRow[]
  // placement test result ids marked familiar
  familiarIds: string[]
  // theme
  darkMode: boolean
  // runtime (NOT persisted): true when persist rehydration failed
  rehydrateError: boolean
  // actions
  ensureReview(kanaId: string): ReviewState
  grade(kanaId: string, correct: boolean): void
  registerStudyToday(): void
  tryUnlockRow(row: KanaRow): void
  markRowCompleted(row: KanaRow): void
  setFamiliar(ids: string[]): void
  addXp(n: number): void
  toggleDarkMode(): void
  dismissRehydrateError(): void
  resetProgress(): void
}
