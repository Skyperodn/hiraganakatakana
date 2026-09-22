import { useMemo } from 'react'
import { motion, type Variants } from 'framer-motion'
import type { KanaItem, ReviewState, KanaRow, RowMeta } from '../types'
import { KANA_DATA } from '../data/kana'
import { ROWS, rowColor, UNLOCK_THRESHOLD, MIN_ATTEMPTS_FOR_UNLOCK } from '../data/rows'
import { addDays, todayISO } from '../lib/srs'
import { useDueQueue } from '../hooks/useDueQueue'
import { useProgress } from '../store/useProgress'
import StreakBadge from './StreakBadge'

/** Public props for {@link ProgressDashboard}. */
export interface ProgressDashboardProps {
  /** Starts a study session with the due/new queue. */
  onStart: () => void
  /** Opens a specific unlocked row's study view. */
  onSelectRow: (row: KanaRow) => void
  /** Optional entry point for the placement test. */
  onPlacement?: () => void
}

/** Props for the inline SVG progress ring. */
interface CircularProgressRingProps {
  /** Outer diameter in px. */
  size: number
  /** Ring stroke width in px. */
  stroke: number
  /** Completion ratio, clamped to 0..1. */
  progress: number
  /** Stroke color (accepts CSS var references). */
  color: string
  /**
   * Light mode only: adds a subtle dark rim around the progress stroke so pale
   * row colors (e.g. yellow) stay distinguishable from the track (≥3:1 edge).
   */
  lightRim?: boolean
  /** Optional content rendered centered inside the ring. */
  children?: React.ReactNode
}

/** Statistic derived for a single kana row. */
interface RowStat {
  meta: RowMeta
  color: string
  locked: boolean
  completed: boolean
  /** Cards in this row at box 5. */
  mastered: number
  /** Total cards belonging to this row. */
  total: number
  /** mastered / total, 0..1. */
  ratio: number
  /** Aggregate accuracy across the row's studied cards, 0..1. */
  accuracy: number
  /** Aggregate attempts across the row's studied cards. */
  attempts: number
}

/** Clamps a number to the inclusive [0, 1] range. */
function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
}

/** Inline SVG progress ring with a smooth dash-offset transition. */
function CircularProgressRing({
  size,
  stroke,
  progress,
  color,
  lightRim = false,
  children,
}: CircularProgressRingProps): React.JSX.Element {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = clamp01(progress)
  const offset = circumference * (1 - pct)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)',
            filter: lightRim ? 'drop-shadow(0 0 1.5px rgba(15, 23, 42, 0.55))' : undefined,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

/** Small colored chip representing a single kana card. */
function KanaChip({ kana, color }: { kana: KanaItem; color: string }): React.JSX.Element {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      title={`${kana.character} · ${kana.romaji}`}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm leading-none">{kana.character}</span>
      <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {kana.romaji}
      </span>
    </span>
  )
}

/** Compact labeled statistic tile. */
function StatTile({
  label,
  value,
  accentClass,
}: {
  label: string
  value: string
  /** Tailwind text color class for the value (never a raw row-color var — those fail AA). */
  accentClass?: string
}): React.JSX.Element {
  return (
    <div className="flex min-w-[7rem] flex-col rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <span
        className={[
          'text-lg font-bold',
          accentClass ?? 'text-slate-900 dark:text-white',
        ].join(' ')}
      >
        {value}
      </span>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  )
}

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
  const toggleDarkMode = useProgress((s) => s.toggleDarkMode)
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
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
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

        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <span aria-hidden="true">{darkMode ? '☀️' : '🌙'}</span>
        </button>
      </header>

      {/* Rehydrate error (runtime flag, not persisted) */}
      {rehydrateError ? (
        <div
          role="alert"
          className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"
        >
          <span>Progress lokal gagal dimuat — data lama mungkin hilang.</span>
          <button
            type="button"
            onClick={dismissRehydrateError}
            className="shrink-0 font-semibold underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            Mengerti
          </button>
        </div>
      ) : null}

      {/* Streak nudge near hero / StreakBadge */}
      {streakBroken ? (
        <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          🔥 Streak {longestStreak} hari putus — mulai sesi hari ini untuk bangun lagi!
        </div>
      ) : streakSoft ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          Belum latihan hari ini — jaga streak 🔥
        </div>
      ) : null}

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
            <button
              type="button"
              onClick={onPlacement}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Uji Penempatan
            </button>
          ) : null}
          <button
            type="button"
            onClick={onStart}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            Mulai Sesi
          </button>
        </motion.div>
      </motion.section>

      {/* Stats row */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mb-8 flex flex-wrap gap-3 overflow-x-auto pb-1"
      >
        <motion.div variants={itemVariants}>
          <StatTile
            label="Total XP"
            value={xp.toLocaleString('id-ID')}
            accentClass="text-orange-700 dark:text-orange-400"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatTile label="Streak hari ini" value={`🔥 ${currentStreak} hari`} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatTile label="Streak terpanjang" value={`${longestStreak} hari`} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatTile label="Kartu dikuasai" value={`${totalMastered}`} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatTile label="Jatuh tempo" value={`${due.length}`} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatTile label="Kartu baru" value={`${newCards.length}`} />
        </motion.div>
      </motion.section>

      {/* Per-row progress rings */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Kemajuan per Baris</h2>
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {rowStats.map((stat) => {
            const pct = Math.round(stat.ratio * 100)
            const accPct = Math.round(stat.accuracy * 100)
            const interactive = !stat.locked

            return (
              <motion.li key={stat.meta.key} variants={itemVariants}>
                <button
                  type="button"
                  aria-disabled={!interactive}
                  onClick={() => {
                    if (!interactive) return
                    onSelectRow(stat.meta.key)
                  }}
                  aria-label={`${stat.meta.name}, ${pct}% dikuasai${stat.locked ? ', terkunci' : ''}`}
                  aria-describedby={stat.locked ? 'unlock-rule' : undefined}
                  className={[
                    'relative flex w-full flex-col items-center gap-2 rounded-2xl border p-4 text-center shadow-sm transition',
                    interactive
                      ? 'cursor-pointer border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800'
                      : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-50 dark:border-slate-800 dark:bg-slate-900',
                  ].join(' ')}
                >
                  {stat.completed ? (
                    <span
                      className="absolute right-2 top-2 text-xs"
                      title="Baris selesai"
                      aria-hidden="true"
                    >
                      ✅
                    </span>
                  ) : null}

                  <CircularProgressRing
                    size={92}
                    stroke={9}
                    progress={stat.ratio}
                    color={stat.color}
                    lightRim={!darkMode}
                  >
                    {stat.locked ? (
                      <span className="text-xl" aria-hidden="true">
                        🔒
                      </span>
                    ) : (
                      <>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          {pct}%
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          {stat.mastered}/{stat.total}
                        </span>
                      </>
                    )}
                  </CircularProgressRing>

                  <span className="line-clamp-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {stat.meta.name}
                  </span>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {stat.locked ? (
                      <span className="italic">Terkunci</span>
                    ) : (
                      <>
                        Akurasi {accPct}% · {stat.attempts} percobaan
                      </>
                    )}
                  </span>
                </button>
              </motion.li>
            )
          })}
        </motion.ul>

        <p id="unlock-rule" className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Buka baris berikutnya dengan akurasi ≥ {Math.round(UNLOCK_THRESHOLD * 100)}% dan minimal{' '}
          {MIN_ATTEMPTS_FOR_UNLOCK} percobaan.
        </p>
      </section>

      {/* Due + new cards */}
      <section className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Jatuh Tempo Hari Ini</h3>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              {due.length} kartu
            </span>
          </div>
          {due.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {due.map((kana) => (
                <KanaChip key={kana.id} kana={kana} color={rowColor(kana.row)} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              🎉 Tidak ada kartu yang jatuh tempo. Istirahat dulu, atau mulai sesi untuk kartu baru!
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.05 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Kartu Baru</h3>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              {newCards.length} kartu
            </span>
          </div>

          {newCards.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {newCards.map((kana) => (
                <KanaChip key={kana.id} kana={kana} color={rowColor(kana.row)} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tidak ada kartu baru yang tersedia. Kuasai baris saat ini untuk membuka lebih banyak.
            </p>
          )}

          {lockedNewCards.length > 0 ? (
            <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-700">
              <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                Terkunci — buka barisnya untuk mempelajari:
              </p>
              <div className="flex flex-wrap gap-2">
                {lockedNewCards.map((kana) => (
                  <span
                    key={kana.id}
                    className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-600 dark:text-slate-400"
                  >
                    <span aria-hidden="true">🔒</span>
                    <span className="text-sm leading-none">{kana.character}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </motion.div>
      </section>

      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          {allActive.length} kartu aktif · {totalMastered} dikuasai dari {KANA_DATA.length}
        </p>
        <button
          type="button"
          onClick={handleResetProgress}
          className="text-xs text-rose-500 transition hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          Reset progress
        </button>
      </div>
    </div>
  )
}

export default ProgressDashboard
