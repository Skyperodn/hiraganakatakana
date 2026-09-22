import { useEffect } from 'react'

const FONT_ID = 'noto-sans-jp'
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Inter:wght@400;500;600;700;800&display=swap'

/**
 * Injects the Google Fonts stylesheet for Noto Sans JP + Inter exactly once.
 * Idempotent: a second mount (StrictMode) is a no-op.
 */
export function useFontPreload(): void {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return
    const link = document.createElement('link')
    link.id = FONT_ID
    link.rel = 'stylesheet'
    link.href = FONT_HREF
    document.head.appendChild(link)
  }, [])
}
