import { useMemo } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { KanaItem, SessionResult } from '../types'
import { KANA_DATA } from '../data/kana'
import { rowColor } from '../data/rows'
import { useProgress } from '../store/useProgress'
import { addDays, todayISO } from '../lib/srs'
import StreakBadge from './StreakBadge'

/**
 * XP awarded per correct answer. Mirrors {@link useProgress}'s grading
 * (`XP_CORRECT = 10`), used here for the per-session XP estimate.
 */
const XP_PER_CORRECT = 10

/**
 * Consolation XP awarded per wrong answer. Mirrors {@link useProgress}'s
 * grading (`XP_WRONG = 2`).
 */
const XP_PER_WRONG = 2

/** Accuracy (0..1) at or above which celebration copy is shown. */
const CELEBRATION_THRESHOLD = 0.9

/** A session result enriched with its kana item and current SRS box. */
interface ResultRow {
  /** Stable React key / card identity. */
  id: string
  /** The kana character, e.g. "あ". */
  character: string
  /** The romanization, e.g. "a". */
  romaji: string
  /** Whether the learner answered this card correctly. */
  correct: boolean
  /** Leitner box from `reviews[kanaId]?.box`, or `null` when not yet tracked. */
  box: number | null
  /** CSS color reference for the kana's row. */
  color: string
}

/** Public props for {@link SessionSummary}. */
interface SessionSummaryProps {
  /** The graded results captured during the finished session. */
  results: SessionResult[]
  /** Starts another session (restart). */
  onAgain: () => void
  /** Returns to the dashboard. */
  onHome: () => void
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
}

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.035, delayChildren: 0.1 },
  },
}

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 320, damping: 26 },
  },
}

/** Clamps a number to the inclusive [0, 1] range. */
function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

/** Props for the inline SVG accuracy ring. */
interface AccuracyRingProps {
  /** Correct answers in the session. */
  correct: number
  /** Total answers in the session. */
  total: number
  /** Accuracy ratio, 0..1. */
  ratio: number
  /** Whether entrance/celebration motion is enabled. */
  animate: boolean
}

/** The circular accuracy ring with the headline percentage centered inside. */
function AccuracyRing({ correct, total, ratio, animate }: AccuracyRingProps) {
  const size = 176
  const stroke = 14
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.round(clamp01(ratio) * 100)

  const tone =
    ratio >= CELEBRATION_THRESHOLD
      ? { ring: 'text-emerald-500', glow: 'shadow-emerald-500/25', label: 'Luar biasa!' }
      : ratio >= 0.7
        ? { ring: 'text-sky-500', glow: 'shadow-sky-500/20', label: 'Bagus!' }
        : ratio >= 0.4
          ? { ring: 'text-amber-500', glow: 'shadow-amber-500/20', label: 'Terus latihan' }
          : { ring: 'text-rose-500', glow: 'shadow-rose-500/20', label: 'Semangat!' }

  return (
    <div className="relative grid place-items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
        role="img"
        aria-label={`Akurasi ${pct} persen, ${correct} benar dari ${total} soal`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-200 dark:stroke-slate-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={['stroke-current', tone.ring].join(' ')}
          strokeDasharray={circumference}
          initial={
            animate
              ? { strokeDashoffset: circumference }
              : { strokeDashoffset: circumference * (1 - clamp01(ratio)) }
          }
          animate={{ strokeDashoffset: circumference * (1 - clamp01(ratio)) }}
          transition={{ duration: animate ? 1.1 : 0, ease: 'easeOut', delay: 0.15 }}
          style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div
          className={[
            'grid h-[128px] w-[128px] place-items-center rounded-full bg-white',
            'shadow-lg dark:bg-slate-900',
            tone.glow,
          ].join(' ')}
        >
          <div className="text-center">
            <motion.span
              initial={animate ? { scale: 0.7, opacity: 0 } : false}
              animate={animate ? { scale: 1, opacity: 1 } : undefined}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.35 }}
              className="block text-4xl font-black tabular-nums leading-none text-slate-900 dark:text-white"
            >
              {pct}
              <span className="text-2xl align-top">%</span>
            </motion.span>
            <span className="mt-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              akurasi
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** End-of-session summary: accuracy, counts, XP, per-card outcomes, streak. */
export default function SessionSummary({ results, onAgain, onHome }: SessionSummaryProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const animate = !prefersReducedMotion

  const xp = useProgress((s) => s.xp)
  const currentStreak = useProgress((s) => s.currentStreak)
  const reviews = useProgress((s) => s.reviews)

  // Cards whose dueDate falls exactly tomorrow — drives the next-session nudge.
  const dueTomorrowCount = useMemo(() => {
    const tomorrow = addDays(todayISO(), 1)
    return Object.values(reviews).filter((r) => r.dueDate === tomorrow).length
  }, [reviews])

  const stats = useMemo(() => {
    const total = results.length
    const correct = results.filter((r) => r.correct).length
    const wrong = total - correct
    const ratio = total > 0 ? correct / total : 0
    const xpCorrect = correct * XP_PER_CORRECT
    const xpWrong = wrong * XP_PER_WRONG
    return {
      total,
      correct,
      wrong,
      ratio,
      sessionXp: xpCorrect + xpWrong,
      xpCorrect,
      xpWrong,
    }
  }, [results])

  const rows = useMemo<ResultRow[]>(() => {
    const byId = new Map<string, KanaItem>()
    for (const kana of KANA_DATA) byId.set(kana.id, kana)

    return results
      .map((result): ResultRow => {
        const kana = byId.get(result.kanaId)
        const review = reviews[result.kanaId]
        return {
          id: result.kanaId,
          character: kana?.character ?? result.character,
          romaji: kana?.romaji ?? result.romaji,
          correct: result.correct,
          box: review ? review.box : null,
          color: kana ? rowColor(kana.row) : 'var(--color-row-a)',
        }
      })
      .sort((a, b) => {
        // Wrong answers first so problem cards are visible.
        if (a.correct !== b.correct) return a.correct ? 1 : -1
        // Then by box ascending (untracked cards treated as box 0).
        const boxA = a.box ?? 0
        const boxB = b.box ?? 0
        return boxA - boxB
      })
  }, [results, reviews])

  const celebrating = stats.ratio >= CELEBRATION_THRESHOLD && stats.total > 0

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8 dark:from-slate-950 dark:to-slate-900">
      <motion.div
        variants={containerVariants}
        initial={animate ? 'hidden' : false}
        animate={animate ? 'show' : undefined}
        className="mx-auto flex w-full max-w-lg flex-col gap-5"
      >
        {/* Headline card */}
        <motion.section
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30"
        >
          <div className="relative flex flex-col items-center gap-4">
            <span className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Sesi Selesai
            </span>

            <AccuracyRing
              correct={stats.correct}
              total={stats.total}
              ratio={stats.ratio}
              animate={animate}
            />

            <motion.p
              initial={animate ? { opacity: 0, y: 8 } : false}
              animate={animate ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.5 }}
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              {celebrating ? '🎉 ' : ''}
              {stats.total > 0
                ? `${Math.round(stats.ratio * 100)}% benar — mantap!`
                : 'Belum ada jawaban dicatat'}
            </motion.p>

            <div className="flex w-full items-stretch gap-3">
              <div className="flex-1 rounded-2xl bg-emerald-50 px-4 py-3 text-center ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/40 dark:ring-emerald-900">
                <span className="block text-2xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">
                  {stats.correct}
                </span>
                <span className="text-xs font-medium text-emerald-700/80 dark:text-emerald-300/80">
                  benar
                </span>
              </div>
              <div className="flex-1 rounded-2xl bg-rose-50 px-4 py-3 text-center ring-1 ring-inset ring-rose-200 dark:bg-rose-950/40 dark:ring-rose-900">
                <span className="block text-2xl font-black tabular-nums text-rose-600 dark:text-rose-400">
                  {stats.wrong}
                </span>
                <span className="text-xs font-medium text-rose-700/80 dark:text-rose-300/80">
                  salah
                </span>
              </div>
              <div className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-center ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <span className="block text-2xl font-black tabular-nums text-slate-700 dark:text-slate-200">
                  {stats.total}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  total
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Confidence / streak card */}
        <motion.section
          variants={itemVariants}
          className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StreakBadge streak={currentStreak} size="md" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {stats.ratio >= CELEBRATION_THRESHOLD
                ? 'Tingkat akurasi tinggi! 🔥'
                : 'Terus jaga konsistensi'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                XP sesi ini
              </span>
              <span className="mt-0.5 block text-xl font-black tabular-nums text-slate-900 dark:text-white">
                +{stats.sessionXp}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                XP
              </span>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3 dark:bg-amber-950/30">
              <span className="text-xs font-medium text-amber-700/80 dark:text-amber-300/80">
                Total XP
              </span>
              <span className="mt-0.5 block text-xl font-black tabular-nums text-amber-600 dark:text-amber-400">
                {xp.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] text-amber-700/60 dark:text-amber-300/60">
                tersimpan
              </span>
            </div>
          </div>
        </motion.section>

        {/* Cards leveled up/down */}
        <motion.section
          variants={itemVariants}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Kartu sesi ini
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              salah dulu, lalu box terkecil
            </span>
          </div>

          {rows.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
              Tidak ada kartu untuk ditampilkan.
            </p>
          ) : (
            <motion.ul
              variants={listVariants}
              initial={animate ? 'hidden' : false}
              animate={animate ? 'show' : undefined}
              className="flex flex-col gap-2"
            >
              {rows.map((row) => (
                <motion.li
                  key={row.id}
                  variants={rowVariants}
                  className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5 ring-1 ring-inset ring-slate-100 dark:bg-slate-800/60 dark:ring-slate-800"
                >
                  <span
                    aria-hidden="true"
                    className="h-9 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-2xl leading-none text-slate-900 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
                  >
                    {row.character}
                  </span>

                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {row.romaji}
                    </span>
                    <span className="block text-[11px] text-slate-400 dark:text-slate-500">
                      {row.box !== null ? `Box ${row.box} / 5` : 'Belum dilacak'}
                    </span>
                  </div>

                  <span
                    aria-label={row.correct ? 'benar' : 'salah'}
                    className={[
                      'grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold',
                      row.correct
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
                    ].join(' ')}
                  >
                    {row.correct ? '✓' : '✕'}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.section>

        {/* Actions */}
        <motion.section variants={itemVariants} className="flex flex-col gap-3 sm:flex-row">
          <motion.button
            type="button"
            onClick={onAgain}
            whileHover={animate ? { scale: 1.02 } : undefined}
            whileTap={animate ? { scale: 0.97 } : undefined}
            className="flex-1 rounded-2xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-900"
          >
            Sesi Lagi
          </motion.button>
          <motion.button
            type="button"
            onClick={onHome}
            whileHover={animate ? { scale: 1.02 } : undefined}
            whileTap={animate ? { scale: 0.97 } : undefined}
            className="flex-1 rounded-2xl border-2 border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
          >
            Kembali
          </motion.button>
        </motion.section>

        {/* Next-step nudge: tomorrow's due count (or a push to keep going). */}
        <motion.p
          variants={itemVariants}
          className="pb-4 text-center text-xs text-slate-400 dark:text-slate-500"
        >
          {dueTomorrowCount > 0
            ? `Besok ada ${dueTomorrowCount} kartu jatuh tempo — kembali untuk jaga streak 🔥`
            : 'Tidak ada jatuh tempo besok — naikkan box dengan sesi lagi'}
        </motion.p>
      </motion.div>
    </div>
  )
}

export type { SessionSummaryProps }
