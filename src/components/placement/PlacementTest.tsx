import { useCallback, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useProgress } from '../../store/useProgress'
import type { AnsweredRecord, PlacementQuestion, PlacementTestProps, RoundResult } from './types'
import { FAMILIAR_GRADES, buildQuestions } from './questions'
import PlacementIntro from './PlacementIntro'
import PlacementResult from './PlacementResult'
import PlacementQuestionCard from './PlacementQuestionCard'

export default function PlacementTest({ onDone, onSkip }: PlacementTestProps) {
  const setFamiliar = useProgress((state) => state.setFamiliar)
  const ensureReview = useProgress((state) => state.ensureReview)
  const grade = useProgress((state) => state.grade)
  const registerStudyToday = useProgress((state) => state.registerStudyToday)

  const prefersReducedMotion = useReducedMotion() ?? false

  // Built once per mount; reshuffling on re-render would reset the test.
  const questions = useMemo<PlacementQuestion[]>(() => buildQuestions(), [])
  const total = questions.length

  // Intro shows context (count, purpose) before question 1; result phase is
  // driven separately by `result !== null`.
  const [phase, setPhase] = useState<'intro' | 'quiz'>('intro')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<AnsweredRecord[]>([])
  const [result, setResult] = useState<RoundResult | null>(null)

  // Guards against double-committing the round (button + transition overlap).
  const committedRef = useRef(false)

  // Guards against double-advancing within the same frame (rapid double taps
  // while the previous button is still exiting).
  const advancingRef = useRef(false)

  const current = questions[index]

  const commitRound = useCallback(
    (finalAnswers: readonly AnsweredRecord[]) => {
      if (committedRef.current) return
      committedRef.current = true

      const familiarIds = finalAnswers.filter((a) => a.correct).map((a) => a.id)
      const wrongIds = finalAnswers.filter((a) => !a.correct).map((a) => a.id)

      for (const id of familiarIds) {
        // ensureReview seeds box 1; two correct grades lift it to box 3
        // (longer interval) so familiar cards surface less often.
        ensureReview(id)
        for (let i = 0; i < FAMILIAR_GRADES; i += 1) grade(id, true)
      }

      for (const id of wrongIds) {
        // Wrong answers stay at box 1 => top of the priority queue.
        ensureReview(id)
      }

      setFamiliar(familiarIds)
      setResult({ familiarIds, wrongIds })
    },
    [ensureReview, grade, setFamiliar],
  )

  const handleSelect = useCallback(
    (romaji: string) => {
      if (selected !== null || current === undefined) return
      registerStudyToday()
      setSelected(romaji)
      setAnswers((prev) => [
        ...prev,
        { id: current.kana.id, correct: romaji === current.kana.romaji },
      ])
    },
    [current, registerStudyToday, selected],
  )

  const handleNext = useCallback(() => {
    // Ignore taps once the round has been committed, the current question was
    // already advanced away, or a tap is already being processed (guards
    // against rapid double-clicks while the old button is still animating out).
    if (selected === null || committedRef.current || advancingRef.current) return
    advancingRef.current = true

    if (index + 1 >= total) {
      commitRound(answers)
      return
    }

    setSelected(null)
    setIndex((prev) => (prev + 1 >= total ? prev : prev + 1))
    // Release the lock on the next frame so a genuine later tap still works.
    requestAnimationFrame(() => {
      advancingRef.current = false
    })
  }, [answers, commitRound, index, selected, total])

  // ---- Intro screen ----------------------------------------------------
  if (phase === 'intro' && result === null) {
    return (
      <PlacementIntro
        onStart={() => setPhase('quiz')}
        onSkip={onSkip}
        questionCount={total}
        prefersReducedMotion={prefersReducedMotion}
      />
    )
  }

  // ---- Results screen --------------------------------------------------
  if (result !== null) {
    return (
      <PlacementResult
        familiarIds={result.familiarIds}
        wrongIds={result.wrongIds}
        onDone={onDone}
        onSkip={onSkip}
        prefersReducedMotion={prefersReducedMotion}
      />
    )
  }

  if (current === undefined) {
    return (
      <section className="mx-auto flex w-full max-w-md flex-col gap-4 px-5 py-10">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Belum ada data kana untuk diuji.
        </p>
        <button
          type="button"
          onClick={onSkip}
          className="w-full rounded-2xl bg-slate-200 px-6 py-4 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Lewati
        </button>
      </section>
    )
  }

  // ---- Question screen -------------------------------------------------
  return (
    <PlacementQuestionCard
      current={current}
      index={index}
      total={total}
      selected={selected}
      onSelect={handleSelect}
      onNext={handleNext}
      onSkip={onSkip}
      prefersReducedMotion={prefersReducedMotion}
    />
  )
}
