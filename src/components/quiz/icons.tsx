/* ------------------------------------------------------------------ */
/* Inline icons (no icon library) — extracted verbatim from QuizEngine */
/* ------------------------------------------------------------------ */

export function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  )
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 4.5v15l13-7.5-13-7.5Z" />
    </svg>
  )
}

export function CardsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="7" width="13" height="14" rx="2.5" />
      <path d="M8 4.2A2.2 2.2 0 0 1 10.2 3H19a2 2 0 0 1 2 2v8.8a2.2 2.2 0 0 1-1.2 1.9" />
    </svg>
  )
}

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.5c.3 2.2.9 3.8 2 4.9s2.7 1.7 4.9 2c-2.2.3-3.8.9-4.9 2s-1.7 2.7-2 4.9c-.3-2.2-.9-3.8-2-4.9s-2.7-1.7-4.9-2c2.2-.3 3.8-.9 4.9-2s1.7-2.7 2-4.9Z" />
    </svg>
  )
}
