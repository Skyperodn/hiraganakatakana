import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { KanaItem, QuizMode, QuizQuestion, SessionResult } from '../../types'
import { useProgress } from '../../store/useProgress'
import { pickRandom, buildQuestion, type Rng } from './questionBuilder'
import { acceptedAnswers } from './romaji'

/* ------------------------------------------------------------------ */
/* Quiz session state machine                                          */
/* ------------------------------------------------------------------ */

export interface QuizSession {
  total: number
  index: number
  current: KanaItem | undefined
  question: QuizQuestion | null
  results: SessionResult[]
  /** null = not answered yet, otherwise the outcome. */
  lastCorrect: boolean | null
  selected: string | null
  typed: string
  setTyped: (v: string) => void
  isNewCard: boolean
  boxDelta: { pre: number; post: number } | null
  newCardLimit: boolean
  submit: (value: string) => void
  advance: () => void
}

interface Args {
  queue: KanaItem[]
  onFinish: (results: SessionResult[]) => void
  /** Modes eligible for the per-question rotation (audio filtered upstream). */
  rotationModes: readonly QuizMode[]
}

/**
 * Owns the per-session state machine: question building, per-card reset,
 * answer submission (Leitner grading + results) and advancing/finishing.
 * Kept UI-free so QuizEngine stays a thin orchestrator.
 */
export function useQuizSession({ queue, onFinish, rotationModes }: Args): QuizSession {
  const grade = useProgress((s) => s.grade)
  const registerStudyToday = useProgress((s) => s.registerStudyToday)
  const tryUnlockRow = useProgress((s) => s.tryUnlockRow)

  const total = queue.length
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<SessionResult[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)
  const [isNewCard, setIsNewCard] = useState(false)
  const [boxDelta, setBoxDelta] = useState<{ pre: number; post: number } | null>(null)

  const checkedCardId = useRef<string | null>(null)
  const submitted = useRef(false)
  const advancingRef = useRef(false)
  const rng = useMemo<Rng>(() => Math.random, [])

  const current: KanaItem | undefined = queue[index]

  /* ---- Build the question for the current card (memoized). ------- */
  const question = useMemo<QuizQuestion | null>(() => {
    if (!current) return null
    const mode = pickRandom(rotationModes, rng)
    // Read unlocked rows imperatively: a mid-session unlock must not rebuild
    // (and replace) the in-flight question under the learner's feet.
    const unlockedRows = new Set(useProgress.getState().unlockedRows)
    return buildQuestion(current, mode, rng, unlockedRows)
  }, [current, rng, rotationModes])

  /* ---- Reset per-question state whenever the card changes. ------- */
  useEffect(() => {
    if (!current) return
    submitted.current = false
    setSelected(null)
    setTyped('')
    setLastCorrect(null)
    setBoxDelta(null)

    // Detect "new card": was there NO review state before this question?
    // Only check once per card id — StrictMode double-invokes effects, and
    // creating the review here (or on a second run) would flip this to false.
    if (checkedCardId.current !== current.id) {
      const hadReview = Boolean(useProgress.getState().reviews[current.id])
      setIsNewCard(!hadReview)
      checkedCardId.current = current.id
    }
    // NOTE: do NOT ensureReview here — grade() creates the review on first
    // submit, so an abandoned session never turns unviewed cards into "due".
  }, [current])

  /* ---- Study-day bookkeeping once per session card. -------------- */
  useEffect(() => {
    if (current) registerStudyToday()
  }, [current, registerStudyToday])

  /* ---- Submit an answer. ----------------------------------------- */
  const submit = useCallback(
    (value: string) => {
      if (!current || !question) return
      if (submitted.current || lastCorrect !== null) return
      submitted.current = true

      let correct: boolean
      if (question.mode === 'type-romaji') {
        const normalized = value.trim().toLowerCase()
        correct = acceptedAnswers(question.kana.romaji).includes(normalized)
      } else {
        correct = value === question.correctValue
      }

      setSelected(value)
      setLastCorrect(correct)

      // Capture the pre-grade box so the feedback can show the transition
      // (e.g. "Box 3 → 1"). Untracked cards have no delta — grade() creates
      // the review itself.
      const preBox = useProgress.getState().reviews[current.id]?.box ?? null

      // Persist to the store. `grade` already awards +10/+2 XP itself.
      grade(current.id, correct)
      setBoxDelta(
        preBox === null ? null : { pre: preBox, post: correct ? Math.min(preBox + 1, 5) : 1 },
      )
      registerStudyToday()
      tryUnlockRow(current.row)

      setResults((prev) => [
        ...prev,
        { kanaId: current.id, character: current.character, romaji: current.romaji, correct },
      ])
    },
    [current, question, lastCorrect, grade, registerStudyToday, tryUnlockRow],
  )

  /* ---- Advance to the next question / finish the session. -------- */
  const advance = useCallback(() => {
    if (lastCorrect === null) return
    // Guard against double-taps while the previous question is still exiting.
    if (advancingRef.current) return
    advancingRef.current = true
    const nextIndex = index + 1
    if (nextIndex >= total) {
      onFinish(results)
      return
    }
    setIndex(nextIndex)
    requestAnimationFrame(() => {
      advancingRef.current = false
    })
  }, [lastCorrect, index, total, results, onFinish])

  return {
    total,
    index,
    current,
    question,
    results,
    lastCorrect,
    selected,
    typed,
    setTyped,
    isNewCard,
    boxDelta,
    newCardLimit: isNewCard && lastCorrect === null,
    submit,
    advance,
  }
}
