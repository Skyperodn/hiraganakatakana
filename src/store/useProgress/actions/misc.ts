import type { StateCreator } from 'zustand'
import type { ProgressState } from '../types'
import { createDefaultState } from '../defaultState'

type ProgressSlice = Pick<
  ProgressState,
  | 'setFamiliar'
  | 'addXp'
  | 'toggleDarkMode'
  | 'dismissRehydrateError'
  | 'resetProgress'
>

/** Miscellaneous action creators, bound to zustand's `set`/`get`. */
export const createMiscActions: StateCreator<
  ProgressState,
  [],
  [],
  ProgressSlice
> = (set) => ({
  setFamiliar: (ids) => set({ familiarIds: ids }),

  addXp: (n) => set((state) => ({ xp: state.xp + n })),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  dismissRehydrateError: () => set({ rehydrateError: false }),

  // createDefaultState() includes rehydrateError: false, so a reset also
  // clears a stuck rehydrate banner. The separate `kana-onboarded-v1`
  // localStorage key is never touched here.
  resetProgress: () => set(createDefaultState()),
})
