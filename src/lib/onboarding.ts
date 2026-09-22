import { useProgress } from '../store/useProgress'
import { ONBOARDED_KEY } from './app'

/**
 * Whether the app should open on the onboarding landing screen: true only when
 * the user has neither completed onboarding nor accumulated any progress.
 */
export function isFreshState(): boolean {
  try {
    if (localStorage.getItem(ONBOARDED_KEY)) return false
    const s = useProgress.getState()
    return s.xp === 0 && Object.keys(s.reviews).length === 0 && s.familiarIds.length === 0
  } catch {
    return false
  }
}

/** Persists the "onboarded" flag (best-effort; ignores quota / private mode). */
export function markOnboarded(): void {
  try {
    localStorage.setItem(ONBOARDED_KEY, '1')
  } catch {
    /* ignore quota / private mode */
  }
}
