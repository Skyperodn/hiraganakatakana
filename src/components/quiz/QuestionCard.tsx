import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { KanaItem, QuizMode } from '../../types'
import Flashcard from '../Flashcard'
import QuestionPrompt from './QuestionPrompt'
import FeedbackBanner from './FeedbackBanner'
import { SparkleIcon } from './icons'
import type { AudioStatus } from '../../hooks/useJapaneseSpeech'

interface QuestionCardProps {
  current: KanaItem
  mode: QuizMode
  accent: string
  audioStatus: AudioStatus
  onSpeak: () => void
  /** Show the "Kartu baru" chip (unseen card, not yet answered). */
  showNewCardChip: boolean
  /** null = not answered yet. */
  lastCorrect: boolean | null
  boxDelta: { pre: number; post: number } | null
  usedAlternate: boolean
  typedNorm: string
  showTypeAlternates: boolean
  typeAlternates: string[]
}

/**
 * The question surface: row-tinted glow, new-card chip, the flipping
 * Flashcard hosting the mode-specific prompt, and the feedback banner.
 */
export default function QuestionCard({
  current,
  mode,
  accent,
  audioStatus,
  onSpeak,
  showNewCardChip,
  lastCorrect,
  boxDelta,
  usedAlternate,
  typedNorm,
  showTypeAlternates,
  typeAlternates,
}: QuestionCardProps): ReactNode {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-6 sm:p-8 dark:border-slate-700 dark:bg-slate-900">
      {/* Soft row-tinted glow behind the prompt. */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle at 50% 40%, ${accent}33, transparent 60%)` }}
        aria-hidden="true"
      />

      {showNewCardChip && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          <SparkleIcon className="h-3.5 w-3.5" />
          Kartu baru
        </span>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.id}-${mode}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 flex w-full flex-col items-center gap-4"
        >
          <Flashcard
            kana={current}
            frontContent={
              <QuestionPrompt
                kana={current}
                mode={mode}
                accent={accent}
                audioStatus={audioStatus}
                onSpeak={onSpeak}
              />
            }
            flipped={lastCorrect !== null}
            revealCorrect={lastCorrect === null ? null : lastCorrect ? 'correct' : 'wrong'}
            showMnemonic={lastCorrect !== null}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {lastCorrect !== null && (
          <FeedbackBanner
            correct={lastCorrect}
            romaji={current.romaji}
            boxDelta={boxDelta}
            usedAlternate={usedAlternate}
            typedNorm={typedNorm}
            showTypeAlternates={showTypeAlternates}
            typeAlternates={typeAlternates}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
