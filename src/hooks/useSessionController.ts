import { useCallback, useMemo, useState } from 'react'
import type { KanaItem, KanaRow, SessionResult } from '../types'
import { useDueQueue, pickSessionQueue } from './useDueQueue'
import {
  CELEBRATION_ACCURACY,
  MAX_DUE_PER_SESSION,
  MAX_NEW_PER_SESSION,
  MIN_MATCHING_POOL,
  RANDOM_DRILL_SIZE,
  randomDrill,
} from '../lib/app'
import { isFreshState, markOnboarded } from '../lib/onboarding'
import type { OnboardingTarget, Screen } from '../lib/app'

/**
 * Owns all top-level navigation and study-session state for the app shell:
 * which screen is visible, the current session queue, its results, the focused
 * row, and the confetti trigger.
 */
export function useSessionController() {
  const { due, newCards, allActive } = useDueQueue()

  const [screen, setScreen] = useState<Screen>(() =>
    isFreshState() ? 'landing' : 'dashboard',
  )
  const [sessionQueue, setSessionQueue] = useState<KanaItem[]>([])
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([])
  const [focusRow, setFocusRow] = useState<KanaRow | null>(null)
  const [confettiTrigger, setConfettiTrigger] = useState(0)

  const startSession = useCallback(
    (row: KanaRow | null = null) => {
      const pool: KanaItem[] = row ? allActive.filter((k) => k.row === row) : allActive
      const duePool = row ? due.filter((k) => k.row === row) : due
      const newPool = row
        ? pool.filter((k) => newCards.some((n) => n.id === k.id))
        : newCards

      const queue = pickSessionQueue(
        duePool,
        newPool,
        MAX_NEW_PER_SESSION,
        MAX_DUE_PER_SESSION,
      )

      // Nothing scheduled → drill a random sample of the active pool.
      setSessionQueue(queue.length === 0 ? randomDrill(pool, RANDOM_DRILL_SIZE) : queue)
      setSessionResults([])
      setFocusRow(row)
      setScreen('session')
    },
    [allActive, due, newCards],
  )

  const goDashboard = useCallback(() => {
    setFocusRow(null)
    setScreen('dashboard')
  }, [])

  const finishOnboarding = useCallback((next: OnboardingTarget) => {
    markOnboarded()
    setScreen(next)
  }, [])

  const handleFinish = useCallback((results: SessionResult[]) => {
    setSessionResults(results)
    const correct = results.filter((r) => r.correct).length
    const acc = results.length ? correct / results.length : 0
    if (acc >= CELEBRATION_ACCURACY) setConfettiTrigger((t) => t + 1)
    setScreen('summary')
  }, [])

  const openMatching = useCallback(() => setScreen('matching'), [])
  const openPlacement = useCallback(() => setScreen('placement'), [])

  const matchingPool = useMemo(() => {
    const pool = focusRow ? allActive.filter((k) => k.row === focusRow) : allActive
    return pool.length >= MIN_MATCHING_POOL ? pool : allActive
  }, [focusRow, allActive])

  return {
    screen,
    sessionQueue,
    sessionResults,
    focusRow,
    confettiTrigger,
    matchingPool,
    startSession,
    goDashboard,
    finishOnboarding,
    handleFinish,
    openMatching,
    openPlacement,
  }
}

export type SessionController = ReturnType<typeof useSessionController>
