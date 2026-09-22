import type { CSSProperties, ReactNode } from 'react'
import type { KanaItem } from '../../types'
import KanaTypeIcon from './KanaTypeIcon'

interface CardFrontProps {
  kana: KanaItem
  accent: string
  activeFlipped: boolean
  canFlipManually: boolean
  frontContent: ReactNode
  titleId: string
}

export function CardFront({
  kana,
  accent,
  activeFlipped,
  canFlipManually,
  frontContent,
  titleId,
}: CardFrontProps) {
  const frontGlow: CSSProperties = {
    background: `radial-gradient(circle at 50% 38%, ${accent}, transparent 62%)`,
    opacity: 0.22,
  }

  return (
    <div
      aria-hidden={activeFlipped || undefined}
      className={[
        'backface-hidden absolute inset-0 flex flex-col items-center justify-center',
        'overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl',
        'dark:border-slate-700/80 dark:bg-slate-900',
      ].join(' ')}
      style={{ backfaceVisibility: 'hidden' }}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={frontGlow}
        aria-hidden="true"
      />

      {/* Row chip */}
      <span
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
        style={{ backgroundColor: accent }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-white/90"
          aria-hidden="true"
        />
        {kana.row.toUpperCase()}-row
      </span>

      {/* Script type emblem (hiragana あ / katakana ア) */}
      <span
        className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white/90 text-slate-500 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300"
        title={kana.type === 'hiragana' ? 'Hiragana' : 'Katakana'}
      >
        <KanaTypeIcon type={kana.type} className="h-5 w-5" />
      </span>

      {frontContent !== undefined && frontContent !== null ? (
        <div
          id={titleId}
          className="relative z-10 flex flex-col items-center justify-center"
        >
          {frontContent}
        </div>
      ) : (
        <span
          id={titleId}
          className="kana-glyph relative z-10 text-[clamp(5rem,26vw,11rem)] text-slate-900 dark:text-white"
        >
          {kana.character}
        </span>
      )}

      {canFlipManually && (
        <span className="relative z-10 mt-4 text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Tap untuk membalik
        </span>
      )}
    </div>
  )
}
