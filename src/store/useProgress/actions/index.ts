import type { StoreApi } from 'zustand'
import type { ProgressState } from '../types'
import { createReviewActions } from './reviews'
import { createRowActions } from './rows'
import { createMiscActions } from './misc'

/**
 * Composes every progress action-creator slice into a single updater.
 * Merging the slices preserves the exact store shape/behaviour.
 */
export const createActions = (
  set: Parameters<typeof createReviewActions>[0],
  get: StoreApi<ProgressState>['getState'],
) => ({
  ...createReviewActions(set, get, {} as StoreApi<ProgressState>),
  ...createRowActions(set, get, {} as StoreApi<ProgressState>),
  ...createMiscActions(set, get, {} as StoreApi<ProgressState>),
})
