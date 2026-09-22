import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import type { KanaItem } from '../types'
import { rowColor } from '../data/rows'

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

const FLIP_DURATION = 0.6
const FLIP_EASE = [0.4, 0, 0.2, 1] as const
/** Inline easing value accepted by framer-motion (tuple of cubic-bezier points). */
const FLIP_TRANSITION = { duration: FLIP_DURATION, ease: FLIP_EASE }

function MiniIllustration({ className }: { className?: string }) {
  return (
    <div
      className={[
        'flex aspect-video w-full flex-col items-center justify-center gap-1.5',
        'rounded-2xl border border-dashed border-slate-300 bg-slate-50/70',
        'text-slate-400 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-500',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    >
      <span className="text-3xl leading-none">🖼️</span>
      <span className="px-3 text-center text-[11px] font-medium leading-tight">
        Ilustrasi mnemonic (segera)
      </span>
    </div>
  )
}

export default function Flashcard({
  kana,
  flipped,
  onFlip,
  showMnemonic = true,
  className,
  revealCorrect = null,
  frontContent,
}: FlashcardProps) {
  const isControlled = flipped !== undefined
  // Controlled-only usage (`flipped` passed, `onFlip` omitted) must be safe:
  // the card never flips on click/keyboard unless the parent opted in.
  const canFlipManually = !isControlled || onFlip !== undefined
  const [internalFlipped, setInternalFlipped] = useState(false)
  const activeFlipped = isControlled ? flipped === true : internalFlipped

  const rootRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  // Keep the DOM accessible state in sync when the flip is driven from outside.
  useEffect(() => {
    if (!canFlipManually) return
    const el = rootRef.current
    if (!el) return
    el.setAttribute('aria-pressed', String(activeFlipped))
  }, [activeFlipped, canFlipManually])

  const setFlipped = (next: boolean) => {
    if (!canFlipManually) return
    if (!isControlled) setInternalFlipped(next)
    onFlip?.(next)
  }

  const toggle = () => setFlipped(!activeFlipped)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!canFlipManually) return
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault()
      toggle()
    }
  }

  const accent = rowColor(kana.row)
  const typeLabel = kana.type === 'hiragana' ? 'Hiragana' : 'Katakana'

  const revealRing =
    revealCorrect === 'correct'
      ? 'ring-4 ring-emerald-400/80'
      : revealCorrect === 'wrong'
        ? 'ring-4 ring-rose-400/80'
        : ''

  const frontGlow: CSSProperties = {
    background: `radial-gradient(circle at 50% 38%, ${accent}, transparent 62%)`,
    opacity: 0.22,
  }

  const backGlow: CSSProperties = {
    background: `radial-gradient(circle at 50% 0%, ${accent}, transparent 55%)`,
    opacity: 0.16,
  }

  const rootClasses = [
    'perspective group relative w-full max-w-md outline-none',
    canFlipManually
      ? 'cursor-pointer select-none focus-visible:ring-4 focus-visible:ring-sky-400/60 rounded-3xl'
      : 'rounded-3xl',
    'aspect-[3/4]',
    revealRing,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const ariaLabel = canFlipManually
    ? `Flashcard ${kana.character}. Tekan Enter atau Spasi untuk membalik.`
    : 'Kartu soal'

  return (
    <div
      ref={rootRef}
      className={rootClasses}
      role={canFlipManually ? 'button' : 'group'}
      tabIndex={canFlipManually ? 0 : undefined}
      aria-pressed={canFlipManually ? activeFlipped : undefined}
      aria-label={ariaLabel}
      aria-describedby={titleId}
      onClick={canFlipManually ? toggle : undefined}
      onKeyDown={canFlipManually ? handleKeyDown : undefined}
    >
      <motion.div
        className="preserve-3d relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: activeFlipped ? 180 : 0 }}
        transition={FLIP_TRANSITION}
      >
        {/* ---------- FRONT FACE ---------- */}
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

        {/* ---------- BACK FACE ---------- */}
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
      </motion.div>

      {/* ---------- REVEAL BADGE ---------- */}
      {revealCorrect && (
        <span
          className={[
            'absolute -right-2 -top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg',
            revealCorrect === 'correct' ? 'bg-emerald-500' : 'bg-rose-500',
          ].join(' ')}
          aria-hidden="true"
        >
          {revealCorrect === 'correct' ? '✓' : '✕'}
        </span>
      )}
    </div>
  )
}
