import type { KanaItem, SessionResult } from '../../types'

export interface MatchingGameProps {
  cards: KanaItem[]
  onFinish: (results: SessionResult[]) => void
}

export type TileSide = 'kana' | 'romaji'

export interface Tile {
  /** Unique key for React + framer-motion layout, e.g. "kana:hira-a". */
  uid: string
  /** The kana this tile belongs to (used for matching). */
  kanaId: string
  side: TileSide
  /** Rendered label: character for kana tiles, romaji for romaji tiles. */
  label: string
  /** Row color of the underlying kana, kept for accenting tiles. */
  color: string
}

export interface TileButtonProps {
  tile: Tile
  isSelected: boolean
  isWrong: boolean
  isMatched: boolean
  disabled: boolean
  onSelect: (tile: Tile) => void
}
