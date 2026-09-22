import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { KanaRow, RowMeta } from '../types'
import { ROWS, rowColor } from '../data/rows'
import { useProgress } from '../store/useProgress'

interface RowSelectorProps {
  selected?: KanaRow | null
  onSelect: (row: KanaRow) => void
  compact?: boolean
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

interface RowPillProps {
  meta: RowMeta
  selected: boolean
  locked: boolean
  completed: boolean
  compact: boolean
  animate: boolean
  onSelect: (row: KanaRow) => void
}

function RowPill({
  meta,
  selected,
  locked,
  completed,
  compact,
  animate,
  onSelect,
}: RowPillProps) {
  const color = rowColor(meta.key)

  // Navigation affordance only — progress numbers live on the dashboard rings.
  const status = locked ? 'terkunci' : completed ? 'selesai' : ''
  const ariaLabel = status ? `${meta.name}, ${status}` : meta.name

  const layout = compact
    ? 'min-w-[4.75rem] gap-1 px-2.5 py-1.5 text-xs'
    : 'min-w-[6.5rem] gap-1.5 px-3.5 py-2 text-sm'

  return (
    <motion.button
      type="button"
      role="option"
      aria-selected={selected}
      aria-label={ariaLabel}
      aria-disabled={locked}
      disabled={locked}
      onClick={() => {
        if (!locked) onSelect(meta.key)
      }}
      whileTap={animate && !locked ? { scale: 0.95 } : undefined}
      whileHover={animate && !locked ? { scale: 1.05, y: -1 } : undefined}
      animate={
        animate && selected ? { scale: 1.05, y: -1 } : { scale: 1, y: 0 }
      }
      transition={{ type: 'spring', stiffness: 520, damping: 24, mass: 0.6 }}
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`,
        borderColor: color,
        ...(selected
          ? {
              boxShadow: `0 0 0 2px color-mix(in srgb, ${color} 55%, transparent)`,
            }
          : null),
      }}
      className={[
        'relative flex shrink-0 snap-start select-none flex-col items-start',
        'rounded-2xl border-2 text-left font-medium leading-none',
        'transition-colors duration-150 outline-none',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
        'disabled:pointer-events-none',
        layout,
        locked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        selected ? 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-900' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="flex w-full items-center justify-between gap-1.5">
        <span className="truncate text-slate-800 dark:text-slate-100">
          {meta.name}
        </span>
        {locked ? (
          <LockIcon className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
        ) : completed ? (
          <CheckIcon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
        ) : null}
      </span>
    </motion.button>
  )
}

export default function RowSelector({
  selected = null,
  onSelect,
  compact = false,
}: RowSelectorProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const animate = !prefersReducedMotion

  const unlockedRows = useProgress((state) => state.unlockedRows)
  const completedRows = useProgress((state) => state.completedRows)

  const unlockedSet = useMemo(() => new Set(unlockedRows), [unlockedRows])
  const completedSet = useMemo(() => new Set(completedRows), [completedRows])

  const ordered = useMemo(
    () => [...ROWS].sort((a, b) => a.order - b.order),
    [],
  )

  return (
    <div
      role="listbox"
      aria-label="Pilih baris gojuon"
      aria-orientation="horizontal"
      className={[
        'flex w-full gap-2 overflow-x-auto snap-x snap-mandatory pb-2',
        'scroll-px-2 [scrollbar-width:thin]',
        compact ? 'px-1' : 'px-2',
      ].join(' ')}
    >
      {ordered.map((meta) => (
        <RowPill
          key={meta.key}
          meta={meta}
          selected={selected === meta.key}
          locked={!unlockedSet.has(meta.key)}
          completed={completedSet.has(meta.key)}
          compact={compact}
          animate={animate}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export type { RowSelectorProps }
