import { motion } from 'framer-motion'
import type { ResultRow } from './types'
import { itemVariants, listVariants, rowVariants } from './variants'

interface ResultCardListProps {
  rows: ResultRow[]
  animate: boolean
}

/** The per-card outcomes list (wrong first, then ascending box). */
export default function ResultCardList({ rows, animate }: ResultCardListProps) {
  return (
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
  )
}

export type { ResultCardListProps }
