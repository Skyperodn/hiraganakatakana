import type { KanaItem } from '../../types'

/**
 * Small mnemonic illustration panel on the back of the card.
 *
 * Shows the kana glyph prominently (its own reference) alongside the first
 * sentence of the mnemonic hint. Replaces the earlier "coming soon" placeholder
 * with content that is always available from the kana dataset.
 */
export function MiniIllustration({ kana, accent }: { kana: KanaItem; accent: string }) {
  return (
    <div
      className={[
        'flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-3 py-2.5',
        'dark:border-slate-700/70 dark:bg-slate-800/50',
      ].join(' ')}
    >
      <span
        className="kana-glyph grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl leading-none text-white shadow-sm"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      >
        {kana.character}
      </span>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Ingat lewat bentuk
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-600 dark:text-slate-300">
          {kana.mnemonic}
        </p>
      </div>
    </div>
  )
}
