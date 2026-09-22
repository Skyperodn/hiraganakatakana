import type { KanaItem } from '../../types'
import { HIRAGANA } from './hiragana'
import { KATAKANA } from './katakana'
import { DAKUTEN } from './dakuten'
import { YOUON_HIRAGANA } from './youon-hiragana'
import { YOUON_KATAKANA } from './youon-katakana'

/**
 * Complete kana dataset.
 *  - 46 basic hiragana + 46 basic katakana
 *  - Dakuten (g/z/d/b families) hiragana + katakana
 *  - Handakuten (p family) hiragana + katakana
 *  - Combined yōon (kya..pyo) hiragana + katakana (small ゃゅょ / ャュョ)
 *
 * Sounds that DO NOT exist and are therefore intentionally skipped:
 *   yi, wu, ye, wi, we (no kana), plus non-combined yōon like "yi/ye"
 *   and the obsolete ゐ/ゑ/を-as-wy variants.
 *
 * The concatenation order below matches the original single-file order
 * exactly so any order-dependent behavior (e.g. unlock flow) is preserved.
 */
export const KANA_DATA: KanaItem[] = [
  ...HIRAGANA,
  ...KATAKANA,
  ...DAKUTEN,
  ...YOUON_HIRAGANA,
  ...YOUON_KATAKANA,
]

export const ALL_HIRAGANA: KanaItem[] = KANA_DATA.filter((k) => k.type === 'hiragana')
export const ALL_KATAKANA: KanaItem[] = KANA_DATA.filter((k) => k.type === 'katakana')

export function getKanaById(id: string): KanaItem | undefined {
  return KANA_DATA.find((k) => k.id === id)
}
