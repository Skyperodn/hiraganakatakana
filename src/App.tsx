import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import type { KanaItem, KanaRow, SessionResult } from './types'
import { KANA_DATA } from './data/kana'
import { rowMeta } from './data/rows'
import { useProgress } from './store/useProgress'
import { useDueQueue, pickSessionQueue } from './hooks/useDueQueue'

import ProgressDashboard from './components/ProgressDashboard'
import RowSelector from './components/RowSelector'
import QuizEngine from './components/QuizEngine'
import MatchingGame from './components/MatchingGame'
import PlacementTest from './components/PlacementTest'
import SessionSummary from './components/SessionSummary'
import Confetti from './components/Confetti'

type Screen = 'dashboard' | 'session' | 'summary' | 'matching' | 'placement' | 'landing'

const MAX_NEW_PER_SESSION = 10
const MAX_DUE_PER_SESSION = 30
const ONBOARDED_KEY = 'kana-onboarded-v1'

function isFreshState(): boolean {
  try {
    if (localStorage.getItem(ONBOARDED_KEY)) return false
    const s = useProgress.getState()
    return s.xp === 0 && Object.keys(s.reviews).length === 0 && s.familiarIds.length === 0
  } catch {
    return false
  }
}

function App() {
  const darkMode = useProgress((s) => s.darkMode)

  const { due, newCards, allActive } = useDueQueue()

  const [screen, setScreen] = useState<Screen>(() => (isFreshState() ? 'landing' : 'dashboard'))
  const [sessionQueue, setSessionQueue] = useState<KanaItem[]>([])
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([])
  const [focusRow, setFocusRow] = useState<KanaRow | null>(null)
  const [confettiTrigger, setConfettiTrigger] = useState(0)

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [darkMode])

  // Preload Noto Sans JP from Google Fonts (idempotent)
  useEffect(() => {
    const id = 'noto-sans-jp'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Inter:wght@400;500;600;700;800&display=swap'
    document.head.appendChild(link)
  }, [])

  const startSession = (row: KanaRow | null = null) => {
    const pool: KanaItem[] = row
      ? allActive.filter((k) => k.row === row)
      : allActive

    const duePool = row ? due.filter((k) => k.row === row) : due
    const newPool = row ? pool.filter((k) => newCards.some((n) => n.id === k.id)) : newCards

    const queue = pickSessionQueue(
      duePool,
      newPool,
      MAX_NEW_PER_SESSION,
      MAX_DUE_PER_SESSION,
    )
    if (queue.length === 0) {
      // Nothing due / new — drill a random sample of the active pool
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10)
      setSessionQueue(shuffled)
    } else {
      setSessionQueue(queue)
    }
    setSessionResults([])
    setFocusRow(row)
    setScreen('session')
  }

  const goDashboard = () => {
    setFocusRow(null)
    setScreen('dashboard')
  }

  const finishOnboarding = (next: 'dashboard' | 'placement') => {
    try {
      localStorage.setItem(ONBOARDED_KEY, '1')
    } catch {
      /* ignore quota / private mode */
    }
    setScreen(next)
  }

  const handleFinish = (results: SessionResult[]) => {
    setSessionResults(results)
    const correct = results.filter((r) => r.correct).length
    const acc = results.length ? correct / results.length : 0
    if (acc >= 0.9) setConfettiTrigger((t) => t + 1)
    setScreen('summary')
  }

  const matchingPool = useMemo(() => {
    const pool = focusRow ? allActive.filter((k) => k.row === focusRow) : allActive
    return pool.length >= 6 ? pool : allActive
  }, [focusRow, allActive])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Confetti trigger={confettiTrigger} />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {screen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center py-8"
            >
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Kana Master
              </h1>
              <p className="mt-3 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
                Hafal hiragana &amp; katakana dengan SRS + mnemonic + kuis aktif.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => finishOnboarding('dashboard')}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
                >
                  <span className="block text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    Mulai dari nol
                  </span>
                  <span className="mt-2 block text-sm text-slate-600 dark:text-slate-400">
                    Belajar baris gojuon berurutan lewat kartu SRS dan kuis.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => finishOnboarding('placement')}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
                >
                  <span className="block text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    Uji Penempatan
                  </span>
                  <span className="mt-2 block text-sm text-slate-600 dark:text-slate-400">
                    Sudah tahu sebagian kana? Tes dulu, mulai dari level kamu.
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {screen === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <ProgressDashboard
                onStart={() => startSession(null)}
                onSelectRow={(row) => startSession(row)}
                onPlacement={() => setScreen('placement')}
              />

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Pilih Baris Gojuon
                </h2>
                <RowSelector selected={focusRow} onSelect={(row) => startSession(row)} />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setScreen('matching')}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    Matching Game
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {screen === 'session' && (
            <motion.div
              key="session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        'Keluar sesi? Jawaban yang sudah dinilai tersimpan, tapi ringkasan sesi ini tidak ditampilkan.',
                      )
                    ) {
                      goDashboard()
                    }
                  }}
                  className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  ← Kembali
                </button>
                {focusRow && (
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {rowMeta(focusRow).name}
                  </span>
                )}
              </div>
              <QuizEngine queue={sessionQueue} onFinish={handleFinish} />
            </motion.div>
          )}

          {screen === 'matching' && (
            <motion.div
              key="matching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MatchingGame
                cards={matchingPool}
                onFinish={(results) => handleFinish(results)}
              />
              <button
                type="button"
                onClick={goDashboard}
                className="mt-4 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
              >
                ← Kembali ke Dashboard
              </button>
            </motion.div>
          )}

          {screen === 'placement' && (
            <motion.div
              key="placement"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PlacementTest
                onDone={() => {
                  // Wrong answers are seeded at box 1 (due today) so they lead
                  // the fresh queue; familiar cards land at box 3 (not due) and
                  // drop out naturally. Land in a session, not a dead-end.
                  startSession(null)
                }}
                onSkip={goDashboard}
              />
            </motion.div>
          )}

          {screen === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <SessionSummary
                results={sessionResults}
                onAgain={() => startSession(focusRow)}
                onHome={goDashboard}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer
        className="mx-auto max-w-4xl px-4 pt-2 text-center text-xs text-slate-400 dark:text-slate-600"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {KANA_DATA.length} kana · Spaced Repetition + Active Recall · progress tersimpan lokal
      </footer>
    </div>
  )
}

export default App
