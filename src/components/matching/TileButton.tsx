import type { JSX } from 'react'
import { motion } from 'framer-motion'
import type { TileButtonProps } from './types'

export default function TileButton({
  tile,
  isSelected,
  isWrong,
  isMatched,
  disabled,
  onSelect,
}: TileButtonProps): JSX.Element {
  const isKana = tile.side === 'kana'

  const base =
    'kana-tile relative flex select-none items-center justify-center rounded-3xl border-2 font-semibold shadow-sm transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/60'
  const sizing = isKana
    ? 'h-24 w-full sm:h-28'
    : 'h-16 w-full sm:h-20 px-3'
  const stateClasses = disabled
    ? 'cursor-default'
    : 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0'

  const accent = isMatched ? '#22c55e' : isWrong ? '#ef4444' : tile.color
  const flashBg = isMatched
    ? 'rgba(34, 197, 94, 0.18)'
    : isWrong
      ? 'rgba(239, 68, 68, 0.18)'
      : isSelected
        ? 'rgba(56, 189, 248, 0.16)'
        : undefined

  return (
    <motion.button
      type="button"
      layout
      onClick={() => onSelect(tile)}
      disabled={disabled}
      aria-label={
        isKana
          ? `Kana ${tile.label}${isMatched ? ', sudah cocok' : isWrong ? ', belum cocok' : ''}`
          : `Romaji ${tile.label}${isMatched ? ', sudah cocok' : isWrong ? ', belum cocok' : ''}`
      }
      className={`${base} ${sizing} ${stateClasses}`}
      style={{
        borderColor: isSelected || isWrong || isMatched ? accent : 'rgba(148,163,184,0.35)',
        backgroundColor: flashBg ?? 'transparent',
        boxShadow: isSelected ? `0 0 0 3px ${accent}33` : undefined,
      }}
      animate={
        isWrong
          ? { x: [0, -8, 8, -6, 6, 0], rotate: [0, -2, 2, -1, 1, 0] }
          : { x: 0, rotate: 0 }
      }
      transition={{ duration: isWrong ? 0.4 : 0.15 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
    >
      {(isWrong || isMatched) && (
        <span
          aria-hidden="true"
          className="absolute right-1.5 top-1 text-sm font-bold"
          style={{ color: accent }}
        >
          {isMatched ? '✓' : '✗'}
        </span>
      )}
      <span
        className={isKana ? 'kana-glyph text-5xl sm:text-6xl' : 'text-xl sm:text-2xl tracking-wide'}
        style={{ color: isSelected || isWrong || isMatched ? accent : undefined }}
      >
        {tile.label}
      </span>
    </motion.button>
  )
}
