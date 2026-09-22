import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KanaRow, ReviewState } from '../types'
import {
  addDays,
  accuracy,
  createInitialState,
  gradeCard,
  todayISO,
} from '../lib/srs'
import {
  MIN_ATTEMPTS_FOR_UNLOCK,
  ROWS,
  UNLOCK_THRESHOLD,
} from '../data/rows'
import { KANA_DATA } from '../data/kana'

/** XP awarded for a correct answer. */
export const XP_CORRECT = 10
/** Consolation XP awarded for a wrong answer (effort still counts). */
export const XP_WRONG = 2

/** The row that is always unlocked from a fresh state. */
const FIRST_ROW: KanaRow = 'a'

/**
 * Returns the default (fresh) data state for the progress store.
 * Actions are attached on top of this and are never persisted.
 */
function createDefaultState() {
  return {
    reviews: {} as Record<string, ReviewState>,
    xp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null as string | null,
    unlockedRows: [FIRST_ROW] as KanaRow[],
    completedRows: [] as KanaRow[],
    familiarIds: [] as string[],
    darkMode: false,
    // Runtime-only flag (never partialized): set when localStorage rehydration fails.
    rehydrateError: false,
  }
}

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

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...createDefaultState(),

      ensureReview: (kanaId) => {
        const existing = get().reviews[kanaId]
        if (existing) return existing
        const fresh = createInitialState(kanaId)
        set((state) => ({
          reviews: { ...state.reviews, [kanaId]: fresh },
        }))
        return fresh
      },

      grade: (kanaId, correct) => {
        const current = get().ensureReview(kanaId)
        const next = gradeCard(current, correct)
        set((state) => ({
          reviews: { ...state.reviews, [kanaId]: next },
          xp: state.xp + (correct ? XP_CORRECT : XP_WRONG),
        }))

        // After the review is updated, check whether this card's row is now
        // fully mastered (all cards in box 5). Unknown ids are skipped safely.
        const kana = KANA_DATA.find((k) => k.id === kanaId)
        if (kana) get().markRowCompleted(kana.row)
      },

      registerStudyToday: () => {
        const today = todayISO()
        const { lastStudyDate, currentStreak, longestStreak } = get()

        // Already studied today: nothing changes.
        if (lastStudyDate === today) return

        let nextStreak: number
        if (lastStudyDate === null) {
          nextStreak = 1
        } else if (lastStudyDate === addDays(today, -1)) {
          nextStreak = currentStreak + 1
        } else {
          nextStreak = 1
        }

        set({
          currentStreak: nextStreak,
          longestStreak: Math.max(longestStreak, nextStreak),
          lastStudyDate: today,
        })
      },

      tryUnlockRow: (row) => {
        const { unlockedRows } = get()

        // `row` is the row the learner is currently drilling. Only the row at
        // the unlock frontier may unlock the next one, otherwise re-drilling an
        // already-cleared row would fast-forward through locked rows.
        const frontier = ROWS.filter((r) => unlockedRows.includes(r.key)).at(-1)?.key
        if (row !== frontier) return

        // Aggregate this row's review states across all of its cards.
        const cards = KANA_DATA.filter((k) => k.row === row)
        if (cards.length === 0) return

        const states = cards
          .map((k) => get().reviews[k.id])
          .filter((s): s is ReviewState => Boolean(s))

        const aggregate = states.reduce<ReviewState>(
          (sum, s) => ({
            ...sum,
            totalAttempts: sum.totalAttempts + s.totalAttempts,
            totalCorrect: sum.totalCorrect + s.totalCorrect,
          }),
          createInitialState(row),
        )

        if (
          aggregate.totalAttempts < MIN_ATTEMPTS_FOR_UNLOCK ||
          accuracy(aggregate) < UNLOCK_THRESHOLD
        ) {
          return
        }

        // This row is now cleared — unlock the next still-locked row in order.
        const nextRow = ROWS.find((r) => !unlockedRows.includes(r.key))?.key
        if (!nextRow) return

        set((state) =>
          state.unlockedRows.includes(nextRow)
            ? state
            : { unlockedRows: [...state.unlockedRows, nextRow] },
        )
      },

      markRowCompleted: (row) => {
        const cards = KANA_DATA.filter((k) => k.row === row)
        if (cards.length === 0) return

        const { reviews } = get()
        const allMastered = cards.every((k) => {
          const s = reviews[k.id]
          return s !== undefined && s.box === 5
        })
        if (!allMastered) return

        set((state) =>
          state.completedRows.includes(row)
            ? state
            : { completedRows: [...state.completedRows, row] },
        )
      },

      setFamiliar: (ids) => set({ familiarIds: ids }),

      addXp: (n) => set((state) => ({ xp: state.xp + n })),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      dismissRehydrateError: () => set({ rehydrateError: false }),

      // createDefaultState() includes rehydrateError: false, so a reset also
      // clears a stuck rehydrate banner. The separate `kana-onboarded-v1`
      // localStorage key is never touched here.
      resetProgress: () => set(createDefaultState()),
    }),
    {
      name: 'kana-progress-v1',
      partialize: (state) => ({
        reviews: state.reviews,
        xp: state.xp,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastStudyDate: state.lastStudyDate,
        unlockedRows: state.unlockedRows,
        completedRows: state.completedRows,
        familiarIds: state.familiarIds,
        darkMode: state.darkMode,
      }),
      // zustand v5 signature: (state) => ((state?, error?) => void) | void.
      // The post-hydration callback runs synchronously inside create() for
      // localStorage, while `useProgress` is still in its TDZ — defer the flag
      // update to a microtask so the reference is initialized.
      onRehydrateStorage: () => (_state, error) => {
        if (!error) return
        queueMicrotask(() => {
          useProgress.setState({ rehydrateError: true })
        })
      },
    },
  ),
)

export default useProgress
