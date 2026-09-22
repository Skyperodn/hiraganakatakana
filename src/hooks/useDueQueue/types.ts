import type { KanaItem } from '../../types'

/** Result shape returned by {@link useDueQueue}. */
export interface DueQueue {
  /** Unlocked cards with a review state whose `dueDate` is on or before today. */
  due: KanaItem[]
  /** Unlocked cards that have never been studied (no review state yet). */
  newCards: KanaItem[]
  /** All unlocked cards, regardless of review state (for dashboards). */
  allActive: KanaItem[]
}

/** Options for {@link pickSessionQueue}. */
export interface PickSessionOptions {
  /** Maximum number of new (never-studied) cards to include. Defaults to 10. */
  maxNew?: number
  /** Maximum number of due cards to include. Defaults to 30. */
  maxDue?: number
}
