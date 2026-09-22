/**
 * SRS date helpers — local `YYYY-MM-DD` formatting and arithmetic.
 *
 * Responsibility: produce and manipulate local calendar dates without ever
 * drifting across UTC boundaries.
 */

/**
 * Returns today's date as a local `YYYY-MM-DD` string.
 *
 * Computed from the local year/month/day (NOT via `toISOString()`), so it
 * never drifts to the previous or next day because of UTC offsets.
 */
export function todayISO(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Adds `days` calendar days to a local `YYYY-MM-DD` date and returns the
 * resulting local `YYYY-MM-DD` string.
 *
 * Parsing is done from the individual components to keep everything in local
 * time and avoid UTC/timezone shifting bugs.
 */
export function addDays(isoDate: string, days: number): string {
  const [yearStr, monthStr, dayStr] = isoDate.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)

  // `Date` normalizes overflow (e.g. day 32 -> next month) automatically.
  const date = new Date(year, month - 1, day + days)

  const resultYear = date.getFullYear()
  const resultMonth = String(date.getMonth() + 1).padStart(2, '0')
  const resultDay = String(date.getDate()).padStart(2, '0')
  return `${resultYear}-${resultMonth}-${resultDay}`
}
