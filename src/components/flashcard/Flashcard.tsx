import { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { rowColor } from '../../data/rows'
import type { FlashcardProps } from './types'
import { FLIP_TRANSITION } from './constants'
import { CardFront } from './CardFront'
import { CardBack } from './CardBack'
import { RevealBadge } from './RevealBadge'

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

  const revealRing =
    revealCorrect === 'correct'
      ? 'ring-4 ring-emerald-400/80'
      : revealCorrect === 'wrong'
        ? 'ring-4 ring-rose-400/80'
        : ''

  const rootClasses = [
    'perspective group relative mx-auto w-full max-w-md shrink-0 outline-none',
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
        <CardFront
          kana={kana}
          accent={accent}
          activeFlipped={activeFlipped}
          canFlipManually={canFlipManually}
          frontContent={frontContent}
          titleId={titleId}
        />
        <CardBack
          kana={kana}
          accent={accent}
          activeFlipped={activeFlipped}
          showMnemonic={showMnemonic}
          titleId={titleId}
        />
      </motion.div>

      {revealCorrect && <RevealBadge revealCorrect={revealCorrect} />}
    </div>
  )
}
