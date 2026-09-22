import { FlameIcon } from './icons'

/** Streak broken/soft banners. */
export default function StreakNudges({
  streakBroken,
  streakSoft,
  longestStreak,
}: {
  streakBroken: boolean
  streakSoft: boolean
  longestStreak: number
}): React.JSX.Element | null {
  return (
    <>
      {streakBroken ? (
        <div className="mb-4 flex items-center gap-2.5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          <FlameIcon className="h-5 w-5 shrink-0 text-orange-500" />
          <span className="tnum">
            Streak {longestStreak} hari putus — mulai sesi hari ini untuk bangun lagi!
          </span>
        </div>
      ) : streakSoft ? (
        <div className="mb-4 flex items-center gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <FlameIcon className="h-5 w-5 shrink-0 text-orange-500" />
          <span>Belum latihan hari ini — jaga streak-mu.</span>
        </div>
      ) : null}
    </>
  )
}
