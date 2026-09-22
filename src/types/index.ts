export type KanaType = 'hiragana' | 'katakana'
export type KanaVariant = 'base' | 'dakuten' | 'handakuten' | 'youon'
export type KanaRow =
  | 'a' | 'ka' | 'sa' | 'ta' | 'na' | 'ha' | 'ma' | 'ya' | 'ra' | 'wa' | 'n'
  | 'dakuten' | 'handakuten' | 'youon'

export interface KanaItem {
  id: string // "hira-a", "kata-ka", ...
  character: string // "あ"
  romaji: string // "a"
  type: KanaType
  row: KanaRow
  variant: KanaVariant
  mnemonic: string // visual association description (id)
  imageUrl?: string // Flux-generated image (optional, placeholder for now)
}

export type LeitnerBox = 1 | 2 | 3 | 4 | 5

export interface ReviewState {
  kanaId: string
  box: LeitnerBox
  dueDate: string // ISO date string
  correctStreak: number
  totalAttempts: number
  totalCorrect: number
}

export type QuizMode =
  | 'kana-romaji'
  | 'romaji-kana'
  | 'audio-kana'
  | 'type-romaji'
  | 'matching'

export interface QuizOption {
  value: string // the option id/value
  label: string // rendered label (kana or romaji)
  disabled?: boolean
}

export interface QuizQuestion {
  kana: KanaItem
  mode: QuizMode
  options: QuizOption[] // for MC modes; empty for type-romaji
  correctValue: string
}

export interface RowMeta {
  key: KanaRow
  name: string // "A-row / あ行"
  colorVar: string // css var name e.g. "--color-row-a"
  order: number
}

export interface SessionResult {
  kanaId: string
  character: string
  romaji: string
  correct: boolean
}
