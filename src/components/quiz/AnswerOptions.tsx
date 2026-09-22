import { motion } from 'framer-motion'
import type { QuizMode, QuizOption } from '../../types'

interface AnswerOptionsProps {
  options: QuizOption[]
  mode: QuizMode
  correctValue: string
  selected: string | null
  answered: boolean
  onSelect: (value: string) => void
}

export default function AnswerOptions({
  options,
  mode,
  correctValue,
  selected,
  answered,
  onSelect,
}: AnswerOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Pilihan jawaban">
      {options.map((opt, i) => {
        const isCorrectOpt = opt.value === correctValue
        const isChosen = selected === opt.value

        // Color logic after answering:
        //   correct option → green; chosen-but-wrong → red.
        let stateClass =
          'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'
        if (answered) {
          if (isCorrectOpt) {
            stateClass =
              'border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-100'
          } else if (isChosen) {
            stateClass =
              'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950/50 dark:text-rose-100'
          } else {
            stateClass =
              'border-slate-200 bg-white text-slate-400 opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-600'
          }
        }

        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            disabled={answered}
            aria-label={`Pilihan ${i + 1}: ${opt.label}`}
            whileTap={{ scale: answered ? 1 : 0.97 }}
            animate={
              answered && (isCorrectOpt || isChosen)
                ? { scale: [1, 1.06, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.3 }}
            className={[
              'relative flex min-h-20 items-center justify-center rounded-2xl border-2 px-4 py-5 text-center shadow-sm transition focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:outline-none disabled:cursor-default',
              stateClass,
            ].join(' ')}
          >
            <span className="pointer-events-none absolute top-2 left-3 text-xs font-semibold text-slate-400 dark:text-slate-500">
              {i + 1}
            </span>
            <span
              lang={
                mode === 'romaji-kana' || mode === 'audio-kana' ? 'ja' : undefined
              }
              className={
                mode === 'kana-romaji'
                  ? 'font-sans text-2xl font-bold sm:text-3xl'
                  : 'kana-glyph text-4xl sm:text-5xl'
              }
            >
              {opt.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
