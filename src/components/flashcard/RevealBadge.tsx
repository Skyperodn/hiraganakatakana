export function RevealBadge({
  revealCorrect,
}: {
  revealCorrect: 'correct' | 'wrong'
}) {
  return (
    <span
      className={[
        'absolute -right-2 -top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg',
        revealCorrect === 'correct' ? 'bg-emerald-500' : 'bg-rose-500',
      ].join(' ')}
      aria-hidden="true"
    >
      {revealCorrect === 'correct' ? '✓' : '✕'}
    </span>
  )
}
