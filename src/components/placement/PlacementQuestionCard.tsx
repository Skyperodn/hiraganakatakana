import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { PlacementQuestion } from './types'
import { cardVariants } from './variants'

interface PlacementQuestionCardProps {
  current: PlacementQuestion
  index: number
  total: number
  selected: string | null
  onSelect: (romaji: string) => void
  onNext: () => void
  onSkip: () => void
  prefersReducedMotion: boolean
}

export default function PlacementQuestionCard({
  current,
  index,
  total,
  selected,
  onSelect,
  onNext,
  onSkip,
  prefersReducedMotion,
}: PlacementQuestionCardProps) {
  const answered = selected !== null
  const isCorrect = answered && selected === current.kana.romaji
  const progressPercent = total === 0 ? 0 : ((index + (answered ? 1 : 0)) / total) * 100

  // Moves focus to the continue action once an answer is locked in so
  // keyboard/screen-reader users land on "Lanjut" / "Lihat Hasil".
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (answered) nextButtonRef.current?.focus()
  }, [answered])

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
              onClick={() => onSelect(romaji)}
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
                onClick={onNext}
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

export type { PlacementQuestionCardProps }
