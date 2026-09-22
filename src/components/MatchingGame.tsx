import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { JSX } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { KanaItem, SessionResult } from '../types'
import { rowColor } from '../data/rows'
import { useProgress } from '../store/useProgress'

/** Maximum number of pairs (kana + romaji tile) used per round. */
const MAX_PAIRS = 6
/** How long the wrong-answer red flash / shake lasts before resetting. */
const WRONG_FLASH_MS = 500

interface MatchingGameProps {
  cards: KanaItem[]
  onFinish: (results: SessionResult[]) => void
}

type TileSide = 'kana' | 'romaji'

interface Tile {
  /** Unique key for React + framer-motion layout, e.g. "kana:hira-a". */
  uid: string
  /** The kana this tile belongs to (used for matching). */
  kanaId: string
  side: TileSide
  /** Rendered label: character for kana tiles, romaji for romaji tiles. */
  label: string
  /** Row color of the underlying kana, kept for accenting tiles. */
  color: string
}

/** Fisher–Yates shuffle returning a new array (immutability preserved). */
function shuffle<T>(input: readonly T[]): T[] {
  const out = [...input]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

/** Picks up to `count` distinct random items from the pool. */
function pickRandom<T>(pool: readonly T[], count: number): T[] {
  return shuffle(pool).slice(0, Math.min(count, pool.length))
}

/** Builds the shuffled 12-tile board (6 kana + 6 romaji) from the pool. */
function buildTiles(pool: readonly KanaItem[]): { tiles: Tile[]; chosen: KanaItem[] } {
  const chosen = pickRandom(pool, MAX_PAIRS)
  const kanaTiles: Tile[] = chosen.map((k) => ({
    uid: `kana:${k.id}`,
    kanaId: k.id,
    side: 'kana',
    label: k.character,
    color: rowColor(k.row),
  }))
  const romajiTiles: Tile[] = chosen.map((k) => ({
    uid: `romaji:${k.id}`,
    kanaId: k.id,
    side: 'romaji',
    label: k.romaji,
    color: rowColor(k.row),
  }))
  return { tiles: shuffle([...kanaTiles, ...romajiTiles]), chosen }
}

interface TileButtonProps {
  tile: Tile
  isSelected: boolean
  isWrong: boolean
  isMatched: boolean
  disabled: boolean
  onSelect: (tile: Tile) => void
}

function TileButton({
  tile,
  isSelected,
  isWrong,
  isMatched,
  disabled,
  onSelect,
}: TileButtonProps): JSX.Element {
  const isKana = tile.side === 'kana'

  const base =
    'kana-tile relative flex select-none items-center justify-center rounded-3xl border-2 font-semibold shadow-sm transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/60'
  const sizing = isKana
    ? 'h-24 w-full sm:h-28'
    : 'h-16 w-full sm:h-20 px-3'
  const stateClasses = disabled
    ? 'cursor-default'
    : 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0'

  const accent = isMatched ? '#22c55e' : isWrong ? '#ef4444' : tile.color
  const flashBg = isMatched
    ? 'rgba(34, 197, 94, 0.18)'
    : isWrong
      ? 'rgba(239, 68, 68, 0.18)'
      : isSelected
        ? 'rgba(56, 189, 248, 0.16)'
        : undefined

  return (
    <motion.button
      type="button"
      layout
      onClick={() => onSelect(tile)}
      disabled={disabled}
      aria-label={
        isKana
          ? `Kana ${tile.label}${isMatched ? ', sudah cocok' : isWrong ? ', belum cocok' : ''}`
          : `Romaji ${tile.label}${isMatched ? ', sudah cocok' : isWrong ? ', belum cocok' : ''}`
      }
      className={`${base} ${sizing} ${stateClasses}`}
      style={{
        borderColor: isSelected || isWrong || isMatched ? accent : 'rgba(148,163,184,0.35)',
        backgroundColor: flashBg ?? 'transparent',
        boxShadow: isSelected ? `0 0 0 3px ${accent}33` : undefined,
      }}
      animate={
        isWrong
          ? { x: [0, -8, 8, -6, 6, 0], rotate: [0, -2, 2, -1, 1, 0] }
          : { x: 0, rotate: 0 }
      }
      transition={{ duration: isWrong ? 0.4 : 0.15 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
    >
      {(isWrong || isMatched) && (
        <span
          aria-hidden="true"
          className="absolute right-1.5 top-1 text-sm font-bold"
          style={{ color: accent }}
        >
          {isMatched ? '✓' : '✗'}
        </span>
      )}
      <span
        className={isKana ? 'kana-glyph text-5xl sm:text-6xl' : 'text-xl sm:text-2xl tracking-wide'}
        style={{ color: isSelected || isWrong || isMatched ? accent : undefined }}
      >
        {tile.label}
      </span>
    </motion.button>
  )
}

export default function MatchingGame({ cards, onFinish }: MatchingGameProps): JSX.Element {
  const grade = useProgress((s) => s.grade)
  const registerStudyToday = useProgress((s) => s.registerStudyToday)

  // `round` is bumped to force a fresh board (used by the "Main lagi" button).
  const [round, setRound] = useState(0)

  const board = useMemo(() => buildTiles(cards), [cards, round])
  const { tiles, chosen } = board

  const kanaTiles = useMemo(() => tiles.filter((t) => t.side === 'kana'), [tiles])
  const romajiTiles = useMemo(() => tiles.filter((t) => t.side === 'romaji'), [tiles])

  const [selected, setSelected] = useState<Tile | null>(null)
  const [wrongPair, setWrongPair] = useState<readonly [string, string] | null>(null)
  const [matchedIds, setMatchedIds] = useState<ReadonlySet<string>>(() => new Set())
  const [attempts, setAttempts] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [results, setResults] = useState<SessionResult[]>([])
  const [finished, setFinished] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  // Guards against clicks landing while a wrong-pair flash is animating.
  const lockedRef = useRef(false)
  const timeoutRef = useRef<number | null>(null)
  // Ensures registerStudyToday fires only on the first attempt of each game.
  const streakRegisteredRef = useRef(false)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const resetRound = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    lockedRef.current = false
    setSelected(null)
    setWrongPair(null)
    setMatchedIds(new Set())
    setAttempts(0)
    setMistakes(0)
    setResults([])
    setFinished(false)
    setAnnouncement('')
    streakRegisteredRef.current = false
    setRound((r) => r + 1)
  }, [])

  const totalPairs = chosen.length
  const matchedCount = matchedIds.size

  const handleSelect = useCallback(
    (tile: Tile) => {
      if (lockedRef.current) return
      if (matchedIds.has(tile.kanaId)) return
      if (selected && selected.uid === tile.uid) {
        setSelected(null)
        return
      }

      // First pick of a pair.
      if (!selected) {
        setSelected(tile)
        return
      }

      // Same side twice -> just move the selection.
      if (selected.side === tile.side) {
        setSelected(tile)
        return
      }

      // Attempt a match.
      setAttempts((n) => n + 1)
      if (!streakRegisteredRef.current) {
        streakRegisteredRef.current = true
        registerStudyToday()
      }
      const isMatch = selected.kanaId === tile.kanaId

      if (isMatch) {
        const matchedKanaId = tile.kanaId
        grade(matchedKanaId, true)

        const kana = chosen.find((k) => k.id === matchedKanaId)
        if (kana) {
          const result: SessionResult = {
            kanaId: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            correct: true,
          }
          setResults((prev) => [...prev, result])
        }

        setMatchedIds((prev) => {
          const next = new Set(prev)
          next.add(matchedKanaId)
          return next
        })
        setAnnouncement(`Cocok! ${matchedIds.size + 1}/${totalPairs}`)
        setSelected(null)
        return
      }

      // Wrong attempt: record, flash red, shake, then reset selection.
      const wrongKanaId = selected.kanaId
      grade(wrongKanaId, false)
      setAnnouncement('Belum cocok, coba lagi')

      const kana = chosen.find((k) => k.id === wrongKanaId)
      if (kana) {
        const result: SessionResult = {
          kanaId: kana.id,
          character: kana.character,
          romaji: kana.romaji,
          correct: false,
        }
        setResults((prev) => [...prev, result])
      }
      setMistakes((n) => n + 1)

      lockedRef.current = true
      setWrongPair([selected.uid, tile.uid])
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null
        lockedRef.current = false
        setWrongPair(null)
        setSelected(null)
      }, WRONG_FLASH_MS)
    },
    [chosen, grade, matchedIds, registerStudyToday, selected, totalPairs],
  )

  // Auto-finish once every pair has been matched.
  useEffect(() => {
    if (totalPairs > 0 && matchedCount === totalPairs && !finished) {
      setFinished(true)
      onFinish(results)
    }
  }, [finished, matchedCount, onFinish, results, totalPairs])

  const accuracy = attempts === 0 ? 0 : Math.round((totalPairs / attempts) * 100)
  const timerLabel = useMemo(() => `${attempts}`, [attempts])

  if (totalPairs === 0) {
    return (
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-300">
          Tidak ada kartu untuk dimainkan.
        </p>
        <button
          type="button"
          onClick={() => onFinish([])}
          className="mt-4 rounded-2xl bg-sky-500 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        >
          Tutup
        </button>
      </div>
    )
  }

  return (
    <section
      className="mx-auto w-full max-w-3xl"
      aria-label="Permainan mencocokkan kana"
    >
      {/* Header */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
            Mencocokkan Kana
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Ketuk kana lalu romaji untuk mencocokkan.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
          <span
            className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            aria-hidden="true"
          >
            Cocok {matchedCount}/{totalPairs}
          </span>
          <span
            className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            aria-hidden="true"
          >
            Percobaan {timerLabel}
          </span>
        </div>
      </header>

      {/* Live region: announces match outcomes for screen readers. */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={totalPairs}
        aria-valuenow={matchedCount}
        aria-label="Progres mencocokkan"
        className="mb-5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
          initial={false}
          animate={{ width: `${(matchedCount / totalPairs) * 100}%` }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        />
      </div>

      {/* Board: two columns on desktop, two stacked grids on mobile */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        <div className="flex flex-col gap-3">
          <h3 className="text-center text-[0.7rem] font-semibold uppercase tracking-wider text-slate-400">
            Kana
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence>
              {kanaTiles.map((tile) => {
                const isMatched = matchedIds.has(tile.kanaId)
                return (
                  <motion.div
                    key={tile.uid}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={
                      isMatched
                        ? { opacity: 0, scale: 0 }
                        : { opacity: 1, scale: 1 }
                    }
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className={isMatched ? 'pointer-events-none' : undefined}
                  >
                    <TileButton
                      tile={tile}
                      isSelected={selected?.uid === tile.uid}
                      isWrong={wrongPair?.includes(tile.uid) ?? false}
                      isMatched={isMatched}
                      disabled={isMatched || lockedRef.current}
                      onSelect={handleSelect}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-center text-[0.7rem] font-semibold uppercase tracking-wider text-slate-400">
            Romaji
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence>
              {romajiTiles.map((tile) => {
                const isMatched = matchedIds.has(tile.kanaId)
                return (
                  <motion.div
                    key={tile.uid}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={
                      isMatched
                        ? { opacity: 0, scale: 0 }
                        : { opacity: 1, scale: 1 }
                    }
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className={isMatched ? 'pointer-events-none' : undefined}
                  >
                    <TileButton
                      tile={tile}
                      isSelected={selected?.uid === tile.uid}
                      isWrong={wrongPair?.includes(tile.uid) ?? false}
                      isMatched={isMatched}
                      disabled={isMatched || lockedRef.current}
                      onSelect={handleSelect}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Summary overlay */}
      <AnimatePresence>
        {finished && (
          <motion.div
            key="summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="matching-summary-title"
              className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl dark:bg-emerald-900/40">
                🎉
              </div>
              <h3
                id="matching-summary-title"
                className="text-xl font-extrabold text-slate-800 dark:text-slate-100"
              >
                Selesai!
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Kamu mencocokkan {totalPairs} pasangan.
              </p>

              <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                    Akurasi
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
                    {accuracy}%
                  </dd>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                    Percobaan
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
                    {attempts}
                  </dd>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                    Salah
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
                    {mistakes}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={resetRound}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-sky-400"
                >
                  Main lagi
                </button>
                <button
                  type="button"
                  onClick={() => onFinish(results)}
                  className="flex-1 rounded-2xl bg-sky-500 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-sky-400"
                >
                  Lanjut
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
