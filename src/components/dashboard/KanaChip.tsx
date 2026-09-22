import type { KanaItem } from '../../types'

/** Small colored chip representing a single kana card. */
export default function KanaChip({
  kana,
  color,
}: {
  kana: KanaItem
  color: string
}): React.JSX.Element {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200"
      title={`${kana.character} · ${kana.romaji}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="kana-glyph text-sm leading-none">{kana.character}</span>
      <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {kana.romaji}
      </span>
    </span>
  )
}
