import { motion } from 'framer-motion'
import { rowColor } from '../../data/rows'
import { LockIcon, CheckIcon } from './icons'
import type { RowPillProps } from './types'

export function RowPill({
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
