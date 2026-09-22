import { motion } from 'framer-motion'
import type { KanaItem } from '../../types'
import { rowColor } from '../../data/rows'
import { LockIcon } from './icons'
import KanaChip from './KanaChip'

/** "Jatuh Tempo Hari Ini" + "Kartu Baru" two-card section. */
export default function DueNewCards({
  due,
  newCards,
  lockedNewCards,
}: {
  due: KanaItem[]
  newCards: KanaItem[]
  lockedNewCards: KanaItem[]
}): React.JSX.Element {
  return (
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
            Tidak ada kartu yang jatuh tempo. Istirahat dulu, atau mulai sesi untuk kartu baru!
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
          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-700/70">
            <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Terkunci — buka barisnya untuk mempelajari:
            </p>
            <div className="flex flex-wrap gap-2">
              {lockedNewCards.map((kana) => (
                <span
                  key={kana.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-600 dark:text-slate-400"
                >
                  <LockIcon className="h-3 w-3 shrink-0" />
                  <span className="text-sm leading-none">{kana.character}</span>
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </motion.div>
    </section>
  )
}
