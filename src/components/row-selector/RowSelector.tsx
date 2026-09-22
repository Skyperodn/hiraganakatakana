import { useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ROWS } from '../../data/rows'
import { useProgress } from '../../store/useProgress'
import { RowPill } from './RowPill'
import type { RowSelectorProps } from './types'

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
