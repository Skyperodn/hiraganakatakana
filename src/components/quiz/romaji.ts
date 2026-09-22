/* ------------------------------------------------------------------ */
/* Hepburn romanization alternates                                     */
/* ------------------------------------------------------------------ */

/**
 * Maps a canonical (Hepburn) romaji string to the alternate spellings we
 * also accept in free-text mode. Covers the common irregulars plus the
 * systematic kunrei-shiki / wāpuro spellings (sha/sya, cha/tya, ja/zya…).
 */
export const ROMAJI_ALTERNATES: ReadonlyArray<readonly [string, string]> = [
  ['shi', 'si'],
  ['chi', 'ti'],
  ['tsu', 'tu'],
  ['fu', 'hu'],
  ['ji', 'zi'],
  ['sha', 'sya'],
  ['shu', 'syu'],
  ['sho', 'syo'],
  ['cha', 'tya'],
  ['chu', 'tyu'],
  ['cho', 'tyo'],
  ['ja', 'zya'],
  ['ju', 'zyu'],
  ['jo', 'zyo'],
].map(([a, b]) => [a, b] as const)

/**
 * Returns the set of strings accepted as correct for a given canonical
 * romaji, normalized to lowercase. Includes the canonical form plus any
 * known alternates (in both directions, e.g. "si" ⇄ "shi").
 */
export function acceptedAnswers(romaji: string): string[] {
  const base = romaji.toLowerCase()
  const extra = new Set<string>()

  for (const [a, b] of ROMAJI_ALTERNATES) {
    if (base === a) extra.add(b)
    else if (base === b) extra.add(a)
  }

  // Small tsu (sokuon) typing variants: "kka" also typed as "kka" is fine,
  // but "kkya" can be entered as "kya" with a leading small tsu collapse.
  // We also accept an explicitly doubled leading consonant ("ttsu" → "tsu").
  if (base.startsWith('tsu')) extra.add('ttsu')

  return [base, ...extra]
}
