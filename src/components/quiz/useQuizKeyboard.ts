import { useEffect } from 'react'
import type { QuizQuestion } from '../../types'
import { isChoiceMode } from './quizModes'

/* ------------------------------------------------------------------ */
/* Keyboard support: 1-4 select, Enter submit/continue                 */
/* ------------------------------------------------------------------ */

interface UseQuizKeyboardArgs {
  question: QuizQuestion | null
  /** null = not answered yet, otherwise the outcome. */
  lastCorrect: boolean | null
  typed: string
  onSubmit: (value: string) => void
  onContinue: () => void
}

/**
 * Wires the quiz keyboard shortcuts:
 * - `Enter` continues after feedback, submits the typed answer in free-text
 *   mode, or clicks the focused button (choice modes).
 * - `1`–`4` pick an option in choice modes (only before answering).
 * Keys are never hijacked while a text field has focus (except Enter).
 */
export function useQuizKeyboard({
  question,
  lastCorrect,
  typed,
  onSubmit,
  onContinue,
}: UseQuizKeyboardArgs): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!question) return

      // Never hijack keys while the user is typing in a text field,
      // except Enter (which should submit the typed answer).
      const target = e.target as HTMLElement | null
      const isTextInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA'

      if (e.key === 'Enter') {
        e.preventDefault()
        if (lastCorrect !== null) {
          onContinue()
        } else if (question.mode === 'type-romaji') {
          if (typed.trim().length > 0) onSubmit(typed)
        } else if (target instanceof HTMLButtonElement) {
          target.click()
        }
        return
      }

      if (isTextInput) return

      // 1-4 select an option (choice modes only).
      if (isChoiceMode(question.mode) && lastCorrect === null) {
        const n = Number(e.key)
        if (Number.isInteger(n) && n >= 1 && n <= question.options.length) {
          const opt = question.options[n - 1]
          if (opt) onSubmit(opt.value)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [question, lastCorrect, typed, onSubmit, onContinue])
}
