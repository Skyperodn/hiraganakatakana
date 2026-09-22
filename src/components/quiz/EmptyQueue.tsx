import { CardsIcon } from './icons'

/** Shown when the session queue is empty (no cards to practise). */
export default function EmptyQueue() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <CardsIcon className="h-8 w-8" />
      </span>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Tidak ada kartu</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Belum ada kartu untuk sesi ini. Coba buka baris berikutnya atau mulai latihan lagi.
      </p>
    </div>
  )
}
