export function MiniIllustration({ className }: { className?: string }) {
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
