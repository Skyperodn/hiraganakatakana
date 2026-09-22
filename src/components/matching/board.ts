import type { KanaItem } from '../../types'
import { rowColor } from '../../data/rows'
import type { Tile } from './types'

/** Maximum number of pairs (kana + romaji tile) used per round. */
export const MAX_PAIRS = 6
/** How long the wrong-answer red flash / shake lasts before resetting. */
export const WRONG_FLASH_MS = 500

/** Fisher–Yates shuffle returning a new array (immutability preserved). */
export function shuffle<T>(input: readonly T[]): T[] {
  const out = [...input]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

/** Picks up to `count` distinct random items from the pool. */
export function pickRandom<T>(pool: readonly T[], count: number): T[] {
  return shuffle(pool).slice(0, Math.min(count, pool.length))
}

/** Builds the shuffled 12-tile board (6 kana + 6 romaji) from the pool. */
export function buildTiles(pool: readonly KanaItem[]): { tiles: Tile[]; chosen: KanaItem[] } {
  const chosen = pickRandom(pool, MAX_PAIRS)
  const kanaTiles: Tile[] = chosen.map((k) => ({
    uid: `kana:${k.id}`,
    kanaId: k.id,
    side: 'kana',
    label: k.character,
    color: rowColor(k.row),
  }))
  const romajiTiles: Tile[] = chosen.map((k) => ({
    uid: `romaji:${k.id}`,
    kanaId: k.id,
    side: 'romaji',
    label: k.romaji,
    color: rowColor(k.row),
  }))
  return { tiles: shuffle([...kanaTiles, ...romajiTiles]), chosen }
}
