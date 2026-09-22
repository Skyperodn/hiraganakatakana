import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { JSX } from 'react'
import type { SessionResult } from '../../types'
import { useProgress } from '../../store/useProgress'
import { buildTiles, WRONG_FLASH_MS } from './board'
import type { MatchingGameProps, Tile } from './types'
import MatchBoard from './MatchBoard'
import MatchHeader from './MatchHeader'
import MatchSummaryDialog from './MatchSummaryDialog'

export type { MatchingGameProps } from './types'

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
      <MatchHeader
        matchedCount={matchedCount}
        totalPairs={totalPairs}
        attempts={attempts}
        announcement={announcement}
      />

      {/* Board: two columns on desktop, two stacked grids on mobile */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        <MatchBoard
          label="Kana"
          tiles={kanaTiles}
          selectedUid={selected?.uid ?? null}
          wrongPair={wrongPair}
          matchedIds={matchedIds}
          locked={lockedRef.current}
          onSelect={handleSelect}
        />
        <MatchBoard
          label="Romaji"
          tiles={romajiTiles}
          selectedUid={selected?.uid ?? null}
          wrongPair={wrongPair}
          matchedIds={matchedIds}
          locked={lockedRef.current}
          onSelect={handleSelect}
        />
      </div>

      {/* Summary overlay */}
      <MatchSummaryDialog
        open={finished}
        accuracy={accuracy}
        attempts={attempts}
        mistakes={mistakes}
        totalPairs={totalPairs}
        onReset={resetRound}
        onFinish={() => onFinish(results)}
      />
    </section>
  )
}
