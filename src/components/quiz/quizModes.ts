import type { QuizMode } from '../../types'

/* ------------------------------------------------------------------ */
/* Modes                                                               */
/* ------------------------------------------------------------------ */

/**
 * Modes used in the per-question random rotation.
 * 'matching' is intentionally excluded — it is handled by a separate UI.
 */
export const ROTATION_MODES: readonly QuizMode[] = [
  'kana-romaji',
  'romaji-kana',
  'audio-kana',
  'type-romaji',
] as const

/** Modes that render a multiple-choice option grid. */
export type ChoiceMode = 'kana-romaji' | 'romaji-kana' | 'audio-kana'

export function isChoiceMode(mode: QuizMode): mode is ChoiceMode {
  return mode !== 'type-romaji' && mode !== 'matching'
}
