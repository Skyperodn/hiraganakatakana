import type { ReactNode } from 'react'
import type { KanaItem } from '../../types'

export interface FlashcardProps {
  kana: KanaItem
  flipped?: boolean
  onFlip?: (next: boolean) => void
  showMnemonic?: boolean
  className?: string
  revealCorrect?: 'correct' | 'wrong' | null
  /** Replaces the default kana glyph on the front face (mode-specific prompt). */
  frontContent?: ReactNode
}
