import type { JSX } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Tile } from './types'
import TileButton from './TileButton'

interface MatchBoardProps {
  label: string
  tiles: Tile[]
  selectedUid: string | null
  wrongPair: readonly [string, string] | null
  matchedIds: ReadonlySet<string>
  locked: boolean
  onSelect: (tile: Tile) => void
}

/** One label + stacked grid column of the matching board. */
export default function MatchBoard({
  label,
  tiles,
  selectedUid,
  wrongPair,
  matchedIds,
  locked,
  onSelect,
}: MatchBoardProps): JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-center text-[0.7rem] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </h3>
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence>
          {tiles.map((tile) => {
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
                  isSelected={selectedUid === tile.uid}
                  isWrong={wrongPair?.includes(tile.uid) ?? false}
                  isMatched={isMatched}
                  disabled={isMatched || locked}
                  onSelect={onSelect}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
