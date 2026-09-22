export function LockIcon({ className }: { className?: string }): React.JSX.Element {
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
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  )
}

export function CheckCircleIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.7 7.7a1 1 0 0 0-1.4-1.4L11 12.6l-1.8-1.8a1 1 0 1 0-1.4 1.4l2.5 2.5a1 1 0 0 0 1.4 0l5-5Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function FlameIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2c.5 2.6-.6 4.3-2 5.8C8.4 9.5 7 11 7 13.5a5 5 0 0 0 10 0c0-1.4-.5-2.6-1.2-3.7-.3.9-.9 1.6-1.6 1.9.5-2.4-.2-5.3-2.2-7.2A6 6 0 0 0 12 2Z" />
      <path d="M12 22a5 5 0 0 0 5-5c0-1.2-.4-2.2-1-3.1-.4.8-1.1 1.4-2 1.6.3-1.6-.2-3.3-1.6-4.5a5.9 5.9 0 0 0-3.4 5.9A5 5 0 0 0 12 22Z" opacity="0.35" />
    </svg>
  )
}
