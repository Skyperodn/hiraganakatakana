import { useEffect } from 'react'
import { useProgress } from '../store/useProgress'

/**
 * Keeps the `<html>` element (class, color-scheme, background color) in sync
 * with the persisted `darkMode` flag. Runs on every toggle.
 */
export function useThemeSync(): void {
  const darkMode = useProgress((s) => s.darkMode)

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) root.classList.add('dark')
    else root.classList.remove('dark')
    root.style.colorScheme = darkMode ? 'dark' : 'light'
    root.style.backgroundColor = darkMode ? '#020617' : '#f8fafc'
  }, [darkMode])
}
