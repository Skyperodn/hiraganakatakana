import { useEffect, useRef } from 'react'

/**
 * Fires `onFire` once, `delayMs` after `shouldRun` becomes true for a given
 * `value`. The timer is cleared whenever `value`, `shouldRun`, or `delayMs`
 * change, and on unmount — so a re-trigger restarts the delay from scratch.
 *
 * The latest `onFire` is always used (kept in a ref), so passing a fresh
 * inline callback each render never reschedules the pending timer and the
 * timeout always sees the newest closure.
 *
 * Typical use: auto-advancing a quiz card ~1s after a correct answer while
 * a manual "continue" stays available during the window.
 *
 * @param value      Identity of the current step (e.g. the question index or
 *                   the answer state). Changing it cancels any pending fire.
 * @param shouldRun  When true, schedule the callback; when false, do nothing.
 * @param delayMs    Delay in milliseconds before `onFire` runs.
 * @param onFire     Callback invoked once after the delay (no-ops are fine —
 *                   the caller should guard against double advances).
 */
export function useAutoAdvance<T>(
  value: T,
  shouldRun: boolean,
  delayMs: number,
  onFire: () => void,
): void {
  // Keep the callback fresh without making it a scheduling dependency.
  const onFireRef = useRef(onFire)
  useEffect(() => {
    onFireRef.current = onFire
  })

  useEffect(() => {
    if (!shouldRun) return undefined
    const id = window.setTimeout(() => {
      onFireRef.current()
    }, delayMs)
    // Cleared on unmount and whenever value/shouldRun/delayMs change — a
    // manual "advance" during the window flips `shouldRun`, so cleanup runs.
    return () => {
      window.clearTimeout(id)
    }
  }, [value, shouldRun, delayMs])
}
