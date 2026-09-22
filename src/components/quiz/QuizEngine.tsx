import { useEffect, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { KanaItem, QuizMode, SessionResult } from '../../types'
import { rowColor } from '../../data/rows'
import { useAutoAdvance } from '../../hooks/useAutoAdvance'
import { useJapaneseSpeech } from '../../hooks/useJapaneseSpeech'
import QuizProgress from './QuizProgress'
import AnswerOptions from './AnswerOptions'
import TypeAnswer from './TypeAnswer'
import ContinueButton from './ContinueButton'
import EmptyQueue from './EmptyQueue'
import QuestionCard from './QuestionCard'
import { useQuizKeyboard } from './useQuizKeyboard'
import { useQuizSession } from './useQuizSession'
import { ROTATION_MODES } from './quizModes'
import { acceptedAnswers } from './romaji'

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

export interface QuizEngineProps {
  /** Ordered cards for this session. */
  queue: KanaItem[]
  /** Called once the queue is exhausted, with every answer's result. */
  onFinish: (results: SessionResult[]) => void
}

/* ------------------------------------------------------------------ */
/* QuizEngine                                                          */
/* ------------------------------------------------------------------ */

export default function QuizEngine({ queue, onFinish }: QuizEngineProps) {
  const { jaVoiceAvailable, audioStatus, speak } = useJapaneseSpeech()

  // Japanese TTS voice availability — when false, 'audio-kana' is excluded
  // from the rotation so the mode can never be silently impossible.
  const rotationModes = useMemo<readonly QuizMode[]>(
    () =>
      jaVoiceAvailable ? ROTATION_MODES : ROTATION_MODES.filter((m) => m !== 'audio-kana'),
    [jaVoiceAvailable],
  )

  const session = useQuizSession({ queue, onFinish, rotationModes })
  const {
    total,
    index,
    current,
    question,
    results,
    lastCorrect,
    selected,
    typed,
    setTyped,
    boxDelta,
    submit,
    advance,
  } = session

  /* ---- Auto-play audio prompt on mount (audio-kana only). -------- */
  useEffect(() => {
    if (question?.mode !== 'audio-kana') {
      // Left audio mode (or unmounted): never let utterances bleed across.
      return undefined
    }
    // Defer to the next tick so the utterance fires after layout.
    const id = window.setTimeout(() => speak(question.kana.romaji), 250)
    return () => window.clearTimeout(id)
  }, [question, speak])

  /* ---- Auto-advance ~1s after a CORRECT answer (wrong stays manual). */
  useAutoAdvance(lastCorrect, lastCorrect === true, 1000, advance)

  /* ---- Keyboard support: 1-4 select, Enter submit/continue. ------ */
  useQuizKeyboard({
    question,
    lastCorrect,
    typed,
    onSubmit: submit,
    onContinue: advance,
  })

  /* ---- Empty queue state. --------------------------------------- */
  if (total === 0 || !current || !question) {
    return <EmptyQueue />
  }

  const accent = rowColor(current.row)
  const correctCount = results.filter((r) => r.correct).length
  const wrongCount = results.length - correctCount
  const isTypeMode = question.mode === 'type-romaji'

  // Type-mode: list every accepted spelling when the answer was wrong, and
  // credit the alternate the learner actually typed when it was accepted.
  const typeAlternates = isTypeMode ? acceptedAnswers(question.kana.romaji) : []
  const showTypeAlternates = isTypeMode && lastCorrect === false && typeAlternates.length > 1
  const typedNorm = typed.trim().toLowerCase()
  const usedAlternate =
    isTypeMode &&
    lastCorrect === true &&
    typedNorm.length > 0 &&
    typedNorm !== question.kana.romaji.toLowerCase()

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-5">
      <QuizProgress
        index={index}
        total={total}
        correctCount={correctCount}
        wrongCount={wrongCount}
        accent={accent}
        isTypeMode={isTypeMode}
      />

      <QuestionCard
        current={current}
        mode={question.mode}
        accent={accent}
        audioStatus={audioStatus}
        onSpeak={() => speak(current.romaji)}
        showNewCardChip={session.newCardLimit}
        lastCorrect={lastCorrect}
        boxDelta={boxDelta}
        usedAlternate={usedAlternate}
        typedNorm={typedNorm}
        showTypeAlternates={showTypeAlternates}
        typeAlternates={typeAlternates}
      />

      {/* Answer area. */}
      {isTypeMode ? (
        <TypeAnswer
          value={typed}
          onChange={setTyped}
          onSubmit={() => submit(typed)}
          disabled={lastCorrect !== null}
          revealed={lastCorrect !== null}
          correct={lastCorrect === true}
        />
      ) : (
        <AnswerOptions
          options={question.options}
          mode={question.mode}
          correctValue={question.correctValue}
          selected={selected}
          answered={lastCorrect !== null}
          onSelect={submit}
        />
      )}

      {/* Continue button — shown after feedback (preferred over auto-advance). */}
      <AnimatePresence>
        {lastCorrect !== null && (
          <ContinueButton index={index} total={total} onContinue={advance} />
        )}
      </AnimatePresence>
    </div>
  )
}
