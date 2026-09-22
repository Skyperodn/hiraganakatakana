import type { KanaRow, RowMeta } from '../../types'

export interface RowSelectorProps {
  selected?: KanaRow | null
  onSelect: (row: KanaRow) => void
  compact?: boolean
}

export interface RowPillProps {
  meta: RowMeta
  selected: boolean
  locked: boolean
  completed: boolean
  compact: boolean
  animate: boolean
  onSelect: (row: KanaRow) => void
}
