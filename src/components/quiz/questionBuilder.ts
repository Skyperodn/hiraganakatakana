import type { KanaItem, KanaRow, QuizMode, QuizOption, QuizQuestion } from '../../types'
import { KANA_DATA } from '../../data/kana'

/* ------------------------------------------------------------------ */
/* Random helpers                                                      */
/* ------------------------------------------------------------------ */

export type Rng = () => number

export function pickRandom<T>(arr: readonly T[], rng: Rng): T {
  return arr[Math.floor(rng() * arr.length)]
}

/** Shuffle a copy of an array (Fisher–Yates). */
export function shuffle<T>(arr: readonly T[], rng: Rng): T[] {
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Distractors                                                         */
/* ------------------------------------------------------------------ */

/**
 * Pick `count` distractor kana for `kana`, restricted to rows the learner
 * has unlocked (so locked-row kana never leak into options). Never reuses
 * the correct answer or its romaji. Prefers 1–2 confusables from the same
 * row (e.g. し vs つ), then fills from other unlocked rows (same type first).
 * Returns fewer than `count` only when the unlocked pool is too thin.
 */
export function pickDistractors(
  kana: KanaItem,
  unlockedRows: ReadonlySet<KanaRow>,
  count: number,
  rng: Rng,
): KanaItem[] {
  const candidates = KANA_DATA.filter(
    (k) => k.id !== kana.id && k.romaji !== kana.romaji && unlockedRows.has(k.row),
  )

  const sameTypeSameRow = candidates.filter(
    (k) => k.row === kana.row && k.type === kana.type,
  )
  const otherTypeSameRow = candidates.filter(
    (k) => k.row === kana.row && k.type !== kana.type,
  )
  const sameTypeOtherRow = candidates.filter(
    (k) => k.row !== kana.row && k.type === kana.type,
  )
  const otherTypeOtherRow = candidates.filter(
    (k) => k.row !== kana.row && k.type !== kana.type,
  )

  const picked: KanaItem[] = []
  const seen = new Set<string>([kana.romaji])

  const take = (list: readonly KanaItem[], max: number) => {
    for (const candidate of shuffle(list, rng)) {
      if (picked.length >= count || max <= 0) break
      if (seen.has(candidate.romaji)) continue
      seen.add(candidate.romaji)
      picked.push(candidate)
      max -= 1
    }
  }

  // 1) Prefer up to two same-row confusables (same type first).
  const sameRowQuota = Math.min(2, count)
  take(sameTypeSameRow, sameRowQuota)
  take(otherTypeSameRow, sameRowQuota - picked.length)

  // 2) Fill the rest from other unlocked rows (same type first).
  take(sameTypeOtherRow, count - picked.length)
  take(otherTypeOtherRow, count - picked.length)

  // 3) Thin-pool fallback: allow more same-row cards rather than underfill.
  if (picked.length < count) {
    take(candidates, count - picked.length)
  }

  return picked
}

/* ------------------------------------------------------------------ */
/* Question builder                                                    */
/* ------------------------------------------------------------------ */

/**
 * Build a question for `kana` in the given `mode`.
 * Distractors never duplicate the correct answer (dedup by romaji + value).
 */
export function buildQuestion(
  kana: KanaItem,
  mode: QuizMode,
  rng: Rng,
  unlockedRows: ReadonlySet<KanaRow>,
): QuizQuestion {
  if (mode === 'romaji-kana' || mode === 'audio-kana') {
    // Prompt is romaji/audio → options are kana characters.
    const distractors = pickDistractors(kana, unlockedRows, 3, rng)

    const options: QuizOption[] = shuffle(
      [
        { value: kana.character, label: kana.character },
        ...distractors.map<QuizOption>((d) => ({
          value: d.character,
          label: d.character,
        })),
      ],
      rng,
    )

    return { kana, mode, options, correctValue: kana.character }
  }

  if (mode === 'kana-romaji') {
    // Prompt is the kana glyph → options are romaji.
    const distractors = pickDistractors(kana, unlockedRows, 3, rng)

    const options: QuizOption[] = shuffle(
      [
        { value: kana.romaji, label: kana.romaji },
        ...distractors.map<QuizOption>((d) => ({
          value: d.romaji,
          label: d.romaji,
        })),
      ],
      rng,
    )

    return { kana, mode, options, correctValue: kana.romaji }
  }

  // type-romaji → free text, no options.
  return {
    kana,
    mode: 'type-romaji',
    options: [],
    correctValue: kana.romaji,
  }
}
