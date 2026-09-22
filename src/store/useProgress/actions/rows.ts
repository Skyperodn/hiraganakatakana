import type { StateCreator } from 'zustand'
import type { ReviewState } from '../../../types'
import { accuracy, createInitialState } from '../../../lib/srs'
import {
  MIN_ATTEMPTS_FOR_UNLOCK,
  ROWS,
  UNLOCK_THRESHOLD,
} from '../../../data/rows'
import { KANA_DATA } from '../../../data/kana'
import type { ProgressState } from '../types'

type ProgressSlice = Pick<ProgressState, 'tryUnlockRow' | 'markRowCompleted'>

/** Row unlock / completion action creators, bound to zustand's `set`/`get`. */
export const createRowActions: StateCreator<
  ProgressState,
  [],
  [],
  ProgressSlice
> = (set, get) => ({
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
})
