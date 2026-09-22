import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import type { KanaItem } from '../types'
import { KANA_DATA } from '../data/kana'
import { useProgress } from '../store/useProgress'

interface PlacementTestProps {
  onDone: (familiarIds: string[]) => void
  onSkip: () => void
}

/** Number of questions served by the placement test. */
const QUESTION_COUNT = 12

/** Number of romaji choices rendered per question (1 correct + 3 distractors). */
const OPTION_COUNT = 4

/** How many times a correct answer is graded so the card lands in box 3. */
const FAMILIAR_GRADES = 2

interface PlacementQuestion {
  kana: KanaItem
  options: string[]
}

interface AnsweredRecord {
  id: string
  correct: boolean
}

interface RoundResult {
  familiarIds: string[]
  wrongIds: string[]
}

/** Fisher-Yates shuffle returning a NEW array (never mutates the input). */
function shuffle<T>(items: readonly T[]): T[] {
  const copy = items.slice()
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = copy[i]
    const b = copy[j]
    copy[i] = b
    copy[j] = a
  }
  return copy
}

/**
 * Builds the question list: samples `QUESTION_COUNT` base kana from
 * hiragana + katakana, then attaches 4 distinct romaji options to each.
 */
function buildQuestions(): PlacementQuestion[] {
  const pool = KANA_DATA.filter(
    (item) => item.variant === 'base' && (item.type === 'hiragana' || item.type === 'katakana'),
  )

  const sampled = shuffle(pool).slice(0, Math.min(QUESTION_COUNT, pool.length))
  const allRomaji = Array.from(new Set(pool.map((item) => item.romaji)))

  return sampled.map((kana) => {
    const distractorPool = allRomaji.filter((romaji) => romaji !== kana.romaji)
    const distractors = shuffle(distractorPool).slice(0, OPTION_COUNT - 1)
    return { kana, options: shuffle([kana.romaji, ...distractors]) }
  })
}

const cardVariants: Variants = {
  enter: { opacity: 0, x: 48, scale: 0.96 },
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 30 },
  },
  exit: { opacity: 0, x: -48, scale: 0.96, transition: { duration: 0.18 } },
}

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
  const answered = selected !== null
  const isCorrect = answered && current !== undefined && selected === current.kana.romaji

  // Moves focus to the continue action once an answer is locked in so
  // keyboard/screen-reader users land on "Lanjut" / "Lihat Hasil".
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (answered) nextButtonRef.current?.focus()
  }, [answered])

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
      <section className="mx-auto flex w-full max-w-md flex-col gap-5 px-5 py-8">
        <motion.div
          variants={cardVariants}
          initial={prefersReducedMotion ? false : 'enter'}
          animate="center"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30"
        >
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Tes penempatan · {QUESTION_COUNT} soal · ±1 menit
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Karakter yang sudah kamu kuasai akan muncul lebih jarang; yang salah jadi prioritas
            latihan.
          </p>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => setPhase('quiz')}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          className="w-full rounded-2xl bg-rose-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition-colors hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
        >
          Mulai Tes
        </motion.button>
        <button
          type="button"
          onClick={onSkip}
          className="w-full rounded-2xl bg-slate-200 px-6 py-4 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Lewati
        </button>
      </section>
    )
  }

  // ---- Results screen --------------------------------------------------
  if (result !== null) {
    const familiarCount = result.familiarIds.length
    const wrongCount = result.wrongIds.length

    return (
      <motion.section
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-10"
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Tes penempatan selesai
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
            Hasilmu siap!
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/40">
              <p className="text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {familiarCount}
              </p>
              <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                familiar
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/40">
              <p className="text-3xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
                {wrongCount}
              </p>
              <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                perlu dilatih
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {familiarCount} familiar, {wrongCount} perlu dilatih. Karakter yang sudah kamu kuasai
            akan lebih jarang muncul.
          </p>
        </div>

        <motion.button
          type="button"
          onClick={() => onDone(result.familiarIds)}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          className="w-full rounded-2xl bg-rose-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition-colors hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
        >
          Mulai Belajar
        </motion.button>
      </motion.section>
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

  const progressPercent = total === 0 ? 0 : ((index + (answered ? 1 : 0)) / total) * 100

  // ---- Question screen -------------------------------------------------
  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-5 px-5 py-8">
      <header className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold tabular-nums text-slate-500 dark:text-slate-400">
          {index + 1}/{total}
        </span>
        <button
          type="button"
          onClick={onSkip}
          className="rounded-full px-3 py-1 text-sm font-medium text-slate-500 underline-offset-4 transition-colors hover:text-slate-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Lewati
        </button>
      </header>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index + (answered ? 1 : 0)}
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <motion.div
          className="h-full rounded-full bg-rose-500"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        />
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Romaji mana yang tepat?
      </p>

      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.kana.id}
            variants={cardVariants}
            initial={prefersReducedMotion ? false : 'enter'}
            animate="center"
            exit={prefersReducedMotion ? undefined : 'exit'}
            className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30"
          >
            <p
              className="kana-glyph select-none text-[88px] text-slate-900 sm:text-[104px] dark:text-slate-50"
              lang="ja"
            >
              {current.kana.character}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {current.options.map((romaji) => {
          const isChosen = selected === romaji
          const isAnswer = romaji === current.kana.romaji

          let toneClass =
            'border-slate-200 bg-white text-slate-800 hover:border-rose-300 hover:bg-rose-50 ' +
            'dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-rose-700 dark:hover:bg-rose-950/40'

          if (answered) {
            if (isAnswer) {
              toneClass =
                'border-emerald-500 bg-emerald-50 text-emerald-700 ' +
                'dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-300'
            } else if (isChosen) {
              toneClass =
                'border-rose-500 bg-rose-50 text-rose-700 ' +
                'dark:border-rose-500 dark:bg-rose-950/50 dark:text-rose-300'
            } else {
              toneClass =
                'border-slate-200 bg-white text-slate-500 opacity-60 ' +
                'dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
            }
          }

          return (
            <motion.button
              key={romaji}
              type="button"
              disabled={answered}
              onClick={() => handleSelect(romaji)}
              whileTap={answered || prefersReducedMotion ? undefined : { scale: 0.96 }}
              aria-pressed={isChosen}
              className={[
                'flex min-h-20 items-center justify-center rounded-2xl border-2 px-4 py-4 text-lg font-semibold transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400',
                'disabled:cursor-default',
                toneClass,
              ].join(' ')}
            >
              {romaji}
            </motion.button>
          )
        })}
      </div>

      <div className="min-h-[68px]">
        <AnimatePresence initial={false}>
          {answered ? (
            <motion.div
              key="feedback"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <p
                role="status"
                className={[
                  'text-center text-sm font-semibold',
                  isCorrect
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400',
                ].join(' ')}
              >
                {isCorrect
                  ? 'Benar!'
                  : `Kurang tepat — jawabannya "${current.kana.romaji}"`}
              </p>
              <button
                ref={nextButtonRef}
                type="button"
                onClick={handleNext}
                className="w-full rounded-2xl bg-rose-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition-colors hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
              >
                {index + 1 >= total ? 'Lihat Hasil' : 'Lanjut'}
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}

export type { PlacementTestProps }
