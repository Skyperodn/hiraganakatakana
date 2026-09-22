import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { KanaItem, ReviewState, KanaRow } from '../../types'
import { KANA_DATA } from '../../data/kana'
import { ROWS, rowColor, UNLOCK_THRESHOLD, MIN_ATTEMPTS_FOR_UNLOCK } from '../../data/rows'
import { addDays, todayISO } from '../../lib/srs'
import { useDueQueue } from '../../hooks/useDueQueue'
import { useProgress } from '../../store/useProgress'
import StreakBadge from '../StreakBadge'
import ThemeToggle from '../ThemeToggle'
import StatTile from './StatTile'
import RowStatsGrid from './RowStatsGrid'
import DueNewCards from './DueNewCards'
import StreakNudges from './StreakNudges'
import RehydrateAlert from './RehydrateAlert'
import { containerVariants, itemVariants } from './variants'
import type { ProgressDashboardProps, RowStat } from './types'

/**
 * Main dashboard screen: aggregate stats, per-row mastery rings, and the
 * due/new card queues. Purely presentational — all navigation is delegated
 * through the `onStart` / `onSelectRow` / `onPlacement` callbacks.
 */
export function ProgressDashboard({
  onStart,
  onSelectRow,
  onPlacement,
}: ProgressDashboardProps): React.JSX.Element {
  const reviews = useProgress((s) => s.reviews)
  const xp = useProgress((s) => s.xp)
  const currentStreak = useProgress((s) => s.currentStreak)
  const longestStreak = useProgress((s) => s.longestStreak)
  const lastStudyDate = useProgress((s) => s.lastStudyDate)
  const unlockedRows = useProgress((s) => s.unlockedRows)
  const completedRows = useProgress((s) => s.completedRows)
  const darkMode = useProgress((s) => s.darkMode)
  const rehydrateError = useProgress((s) => s.rehydrateError)
  const dismissRehydrateError = useProgress((s) => s.dismissRehydrateError)
  const resetProgress = useProgress((s) => s.resetProgress)

  const { due, newCards, allActive } = useDueQueue()

  // Streak banner conditions (ISO dates compare lexicographically).
  const today = todayISO()
  const streakBroken = lastStudyDate !== null && lastStudyDate < addDays(today, -1)
  const streakSoft = lastStudyDate !== null && lastStudyDate !== today && !streakBroken

  const handleResetProgress = () => {
    if (
      window.confirm(
        'Hapus SEMUA progres, XP, streak, dan baris terbuka? Tidak bisa dibatalkan.',
      )
    ) {
      resetProgress()
    }
  }

  const reviewMap = reviews as Record<string, ReviewState>
  const unlockedSet = useMemo<Set<KanaRow>>(() => new Set(unlockedRows), [unlockedRows])
  const completedSet = useMemo<Set<KanaRow>>(() => new Set(completedRows), [completedRows])

  const rowStats = useMemo<RowStat[]>(() => {
    return ROWS.map((meta): RowStat => {
      const cards = KANA_DATA.filter((k) => k.row === meta.key)
      const total = cards.length

      let mastered = 0
      let attempts = 0
      let correct = 0

      for (const card of cards) {
        const state = reviewMap[card.id]
        if (!state) continue
        if (state.box === 5) mastered += 1
        attempts += state.totalAttempts
        correct += state.totalCorrect
      }

      return {
        meta,
        color: rowColor(meta.key),
        locked: !unlockedSet.has(meta.key),
        completed: completedSet.has(meta.key),
        mastered,
        total,
        ratio: total === 0 ? 0 : mastered / total,
        accuracy: attempts === 0 ? 0 : correct / attempts,
        attempts,
      }
    })
  }, [reviewMap, unlockedSet, completedSet])

  const totalMastered = useMemo<number>(
    () => rowStats.reduce((sum, r) => sum + r.mastered, 0),
    [rowStats],
  )

  const lockedNewCards = useMemo<KanaItem[]>(
    () => KANA_DATA.filter((k) => !unlockedSet.has(k.row)).slice(0, 12),
    [unlockedSet],
  )

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
          >
            Kana Master
          </motion.h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Belajar hiragana &amp; katakana</p>
        </div>
        <ThemeToggle />
      </header>

      {/* Rehydrate error (runtime flag, not persisted) */}
      {rehydrateError ? <RehydrateAlert onDismiss={dismissRehydrateError} /> : null}

      {/* Streak nudge near hero / StreakBadge */}
      <StreakNudges streakBroken={streakBroken} streakSoft={streakSoft} longestStreak={longestStreak} />

      {/* Streak + CTA */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between"
      >
        <motion.div variants={itemVariants}>
          <StreakBadge streak={currentStreak} longest={longestStreak} />
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          {onPlacement ? (
            <button type="button" onClick={onPlacement} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-700">
              Uji Penempatan
            </button>
          ) : null}
          <button type="button" onClick={onStart} className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-700">
            Mulai Sesi
          </button>
        </motion.div>
      </motion.section>

      {/* Stats row */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        {[
          { label: 'Total XP', value: xp.toLocaleString('id-ID'), accentClass: 'text-orange-700 dark:text-orange-400' },
          { label: 'Streak hari ini', value: `${currentStreak} hari`, accentClass: 'text-orange-700 dark:text-orange-400' },
          { label: 'Terpanjang', value: `${longestStreak} hari` },
          { label: 'Kartu dikuasai', value: `${totalMastered}` },
          { label: 'Jatuh tempo', value: `${due.length}` },
          { label: 'Kartu baru', value: `${newCards.length}` },
        ].map((tile) => (
          <motion.div key={tile.label} variants={itemVariants} className="flex">
            <StatTile label={tile.label} value={tile.value} accentClass={tile.accentClass} />
          </motion.div>
        ))}
      </motion.section>

      {/* Per-row progress rings */}
      <RowStatsGrid
        rowStats={rowStats}
        darkMode={darkMode}
        onSelectRow={onSelectRow}
        unlockThreshold={UNLOCK_THRESHOLD}
        minAttempts={MIN_ATTEMPTS_FOR_UNLOCK}
      />

      {/* Due + new cards */}
      <DueNewCards due={due} newCards={newCards} lockedNewCards={lockedNewCards} />

      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          {allActive.length} kartu aktif · {totalMastered} dikuasai dari {KANA_DATA.length}
        </p>
        <button type="button" onClick={handleResetProgress} className="text-xs text-rose-500 transition hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400">
          Reset progress
        </button>
      </div>
    </div>
  )
}

export default ProgressDashboard
