import type { CSSProperties } from 'react'
import type { KanaItem } from '../../types'
import { MiniIllustration } from './MiniIllustration'

interface CardBackProps {
  kana: KanaItem
  accent: string
  activeFlipped: boolean
  showMnemonic: boolean
  titleId: string
}

export function CardBack({
  kana,
  accent,
  activeFlipped,
  showMnemonic,
  titleId,
}: CardBackProps) {
  void titleId
  const backGlow: CSSProperties = {
    background: `radial-gradient(circle at 50% 0%, ${accent}, transparent 55%)`,
    opacity: 0.16,
  }

  const typeLabel = kana.type === 'hiragana' ? 'Hiragana' : 'Katakana'

  return (
    <div
      aria-hidden={!activeFlipped || undefined}
      className={[
        'backface-hidden rotate-y-180 absolute inset-0 flex flex-col',
        'overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl',
        'dark:border-slate-700/80 dark:bg-slate-900',
      ].join(' ')}
      style={{ backfaceVisibility: 'hidden' }}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={backGlow}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <span
          className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
          style={{ backgroundColor: accent }}
        >
          {typeLabel}
        </span>

        <span className="mt-3 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          {kana.romaji}
        </span>

        {kana.variant !== 'base' && (
          <span className="mt-2 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {kana.variant}
          </span>
        )}

        {showMnemonic && (
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {kana.mnemonic}
          </p>
        )}
      </div>

      {showMnemonic && (
        <div className="relative z-10 mt-4">
          <MiniIllustration />
        </div>
      )}
    </div>
  )
}
