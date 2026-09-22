import type { KanaRow, RowMeta } from '../types'

export const ROWS: RowMeta[] = [
  { key: 'a', name: 'A-row あ行', colorVar: '--color-row-a', order: 1 },
  { key: 'ka', name: 'Ka-row か行', colorVar: '--color-row-ka', order: 2 },
  { key: 'sa', name: 'Sa-row さ行', colorVar: '--color-row-sa', order: 3 },
  { key: 'ta', name: 'Ta-row た行', colorVar: '--color-row-ta', order: 4 },
  { key: 'na', name: 'Na-row な行', colorVar: '--color-row-na', order: 5 },
  { key: 'ha', name: 'Ha-row は行', colorVar: '--color-row-ha', order: 6 },
  { key: 'ma', name: 'Ma-row ま行', colorVar: '--color-row-ma', order: 7 },
  { key: 'ya', name: 'Ya-row や行', colorVar: '--color-row-ya', order: 8 },
  { key: 'ra', name: 'Ra-row ら行', colorVar: '--color-row-ra', order: 9 },
  { key: 'wa', name: 'Wa-row わ行', colorVar: '--color-row-wa', order: 10 },
  { key: 'n', name: 'N ん', colorVar: '--color-row-n', order: 11 },
  { key: 'dakuten', name: 'Dakuten ゛', colorVar: '--color-row-dakuten', order: 12 },
  { key: 'handakuten', name: 'Handakuten ゜', colorVar: '--color-row-handakuten', order: 13 },
  { key: 'youon', name: 'Youon 拗音', colorVar: '--color-row-youon', order: 14 },
]

export const UNLOCK_THRESHOLD = 0.9
export const MIN_ATTEMPTS_FOR_UNLOCK = 20

export function rowMeta(row: KanaRow): RowMeta {
  return ROWS.find((r) => r.key === row) ?? ROWS[0]
}

export function rowColor(row: KanaRow): string {
  return `var(${rowMeta(row).colorVar})`
}
