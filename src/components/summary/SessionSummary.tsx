import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useProgress } from '../../store/useProgress'
import type { SessionSummaryProps } from './types'
import { containerVariants } from './variants'
import { buildResultRows, computeStats, countDueTomorrow } from './stats'
import { CELEBRATION_THRESHOLD } from './constants'
import SummaryHeadline from './SummaryHeadline'
import SessionStatsCards from './SessionStatsCards'
import ResultCardList from './ResultCardList'
import SummaryActions from './SummaryActions'

/** End-of-session summary: accuracy, counts, XP, per-card outcomes, streak. */
export default function SessionSummary({ results, onAgain, onHome }: SessionSummaryProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const animate = !prefersReducedMotion

  const xp = useProgress((s) => s.xp)
  const currentStreak = useProgress((s) => s.currentStreak)
  const reviews = useProgress((s) => s.reviews)

  // Cards whose dueDate falls exactly tomorrow — drives the next-session nudge.
  const dueTomorrowCount = useMemo(() => countDueTomorrow(reviews), [reviews])

  const stats = useMemo(() => computeStats(results), [results])

  const rows = useMemo(() => buildResultRows(results, reviews), [results, reviews])

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
        <SummaryHeadline stats={stats} animate={animate} celebrating={celebrating} />

        {/* Confidence / streak card */}
        <SessionStatsCards
          currentStreak={currentStreak}
          xp={xp}
          sessionXp={stats.sessionXp}
          ratio={stats.ratio}
        />

        {/* Cards leveled up/down */}
        <ResultCardList rows={rows} animate={animate} />

        {/* Actions + next-step nudge */}
        <SummaryActions
          onAgain={onAgain}
          onHome={onHome}
          animate={animate}
          dueTomorrowCount={dueTomorrowCount}
        />
      </motion.div>
    </div>
  )
}
