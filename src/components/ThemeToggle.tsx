import { motion, useReducedMotion } from 'framer-motion'
import { useProgress } from '../store/useProgress'

interface ThemeToggleProps {
  className?: string
}

function SunIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
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
      <path d="M20.5 14.4A8.6 8.6 0 1 1 9.6 3.5a6.9 6.9 0 0 0 10.9 10.9Z" />
    </svg>
  )
}

/**
 * Theme switch with a precise SVG icon (no emoji) and an animated icon swap.
 * Reads/writes the persisted `darkMode` flag on the progress store.
 */
export default function ThemeToggle({ className }: ThemeToggleProps) {
  const darkMode = useProgress((s) => s.darkMode)
  const toggleDarkMode = useProgress((s) => s.toggleDarkMode)
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-label={darkMode ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      aria-pressed={darkMode}
      title={darkMode ? 'Mode terang' : 'Mode gelap'}
      className={[
        'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
        'border border-slate-200 bg-white text-slate-600 shadow-sm transition',
        'hover:border-slate-300 hover:text-slate-900 hover:shadow',
        'active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white',
        'dark:focus-visible:ring-offset-slate-900',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <motion.span
        key={darkMode ? 'moon' : 'sun'}
        initial={prefersReducedMotion ? false : { rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24, mass: 0.7 }}
        className="flex items-center justify-center"
      >
        {darkMode ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
      </motion.span>
    </button>
  )
}

export type { ThemeToggleProps }
