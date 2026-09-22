import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProgressState } from './types'
import { createDefaultState } from './defaultState'
import { createActions } from './actions'
import { createPersistOptions } from './persist'

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...createDefaultState(),
      ...createActions(set, get),
    }),
    createPersistOptions(),
  ),
)

export default useProgress

export { XP_CORRECT, XP_WRONG } from './constants'
export type { ProgressState } from './types'
