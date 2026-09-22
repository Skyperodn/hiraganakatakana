/** Compact labeled statistic tile. */
export default function StatTile({
  label,
  value,
  accentClass,
}: {
  label: string
  value: string
  /** Tailwind text color class for the value (never a raw row-color var — those fail AA). */
  accentClass?: string
}): React.JSX.Element {
  return (
    <div className="flex min-w-[6.75rem] flex-1 flex-col gap-0.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700/80 dark:bg-slate-800">
      <span
        className={[
          'tnum text-lg font-bold leading-none',
          accentClass ?? 'text-slate-900 dark:text-white',
        ].join(' ')}
      >
        {value}
      </span>
      <span className="text-xs font-medium leading-none text-slate-500 dark:text-slate-400">
        {label}
      </span>
    </div>
  )
}
