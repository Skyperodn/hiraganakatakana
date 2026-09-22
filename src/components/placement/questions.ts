import { KANA_DATA } from '../../data/kana'
import type { PlacementQuestion } from './types'

/** Number of questions served by the placement test. */
export const QUESTION_COUNT = 12

/** Number of romaji choices rendered per question (1 correct + 3 distractors). */
export const OPTION_COUNT = 4

/** How many times a correct answer is graded so the card lands in box 3. */
export const FAMILIAR_GRADES = 2

/** Fisher-Yates shuffle returning a NEW array (never mutates the input). */
export function shuffle<T>(items: readonly T[]): T[] {
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
export function buildQuestions(): PlacementQuestion[] {
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
