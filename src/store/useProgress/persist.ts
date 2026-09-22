import type { PersistOptions } from 'zustand/middleware'
import type { ProgressState } from './types'
import { STORAGE_KEY } from './constants'
import { useProgress } from './index'

/** Persisted subset of `ProgressState` (actions + runtime flags excluded). */
type PersistedState = Pick<
  ProgressState,
  | 'reviews'
  | 'xp'
  | 'currentStreak'
  | 'longestStreak'
  | 'lastStudyDate'
  | 'unlockedRows'
  | 'completedRows'
  | 'familiarIds'
  | 'darkMode'
>

/**
 * Builds the zustand `persist` options object.
 *
 * Kept as a factory so the `onRehydrateStorage` callback closes over the
 * finalized store reference instead of a stale one.
 */
export function createPersistOptions(): PersistOptions<
  ProgressState,
  PersistedState
> {
  return {
    name: STORAGE_KEY,
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
  }
}
