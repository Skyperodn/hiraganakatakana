import type { StateCreator } from 'zustand'
import { gradeCard, todayISO, addDays, createInitialState } from '../../../lib/srs'
import { KANA_DATA } from '../../../data/kana'
import type { ProgressState } from '../types'
import { XP_CORRECT, XP_WRONG } from '../constants'

type ProgressSlice = Pick<
  ProgressState,
  'ensureReview' | 'grade' | 'registerStudyToday'
>

/** Review + streak action creators, bound to zustand's `set`/`get`. */
export const createReviewActions: StateCreator<
  ProgressState,
  [],
  [],
  ProgressSlice
> = (set, get) => ({
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
})
