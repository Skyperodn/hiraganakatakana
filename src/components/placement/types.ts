import type { KanaItem } from '../../types'

export interface PlacementTestProps {
  onDone: (familiarIds: string[]) => void
  onSkip: () => void
}

export interface PlacementQuestion {
  kana: KanaItem
  options: string[]
}

export interface AnsweredRecord {
  id: string
  correct: boolean
}

export interface RoundResult {
  familiarIds: string[]
  wrongIds: string[]
}
