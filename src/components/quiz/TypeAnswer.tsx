import { useEffect, useRef } from 'react'

interface TypeAnswerProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  disabled: boolean
  revealed: boolean
  correct: boolean
}

export default function TypeAnswer({
  value,
  onChange,
  onSubmit,
  disabled,
  revealed,
  correct,
}: TypeAnswerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const borderClass = revealed
    ? correct
      ? 'border-emerald-400 focus-visible:ring-emerald-300 dark:border-emerald-500'
      : 'border-rose-400 focus-visible:ring-rose-300 dark:border-rose-500'
    : 'border-slate-300 focus-visible:ring-sky-300 dark:border-slate-600'

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <label htmlFor="quiz-type-input" className="sr-only">
        Ketik romaji
      </label>
      <input
        id="quiz-type-input"
        ref={inputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ketik romaji…"
        aria-label="Jawaban romaji"
        className={[
          'w-full rounded-2xl border-2 bg-white px-5 py-4 text-center text-2xl font-bold tracking-wide text-slate-800 shadow-sm transition placeholder:text-slate-300 focus-visible:ring-4 focus-visible:outline-none disabled:opacity-80 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600',
          borderClass,
        ].join(' ')}
      />
      {!revealed && (
        <button
          type="submit"
          disabled={disabled || value.trim().length === 0}
          className="w-full rounded-2xl bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-slate-800 focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:outline-none active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Periksa
        </button>
      )}
    </form>
  )
}
