/** Dismissible banner shown when persisted progress failed to rehydrate. */
export default function RehydrateAlert({
  onDismiss,
}: {
  onDismiss: () => void
}): React.JSX.Element {
  return (
    <div
      role="alert"
      className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"
    >
      <span>Progress lokal gagal dimuat — data lama mungkin hilang.</span>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 font-semibold underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
      >
        Mengerti
      </button>
    </div>
  )
}
