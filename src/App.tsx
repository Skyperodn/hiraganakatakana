import { AnimatePresence } from 'framer-motion'

import { KANA_DATA } from './data/kana'
import { useFontPreload } from './hooks/useFontPreload'
import { useSessionController } from './hooks/useSessionController'
import { useThemeSync } from './hooks/useThemeSync'
import Confetti from './components/Confetti'
import {
  DashboardScreen,
  LandingScreen,
  MatchingScreen,
  PlacementScreen,
  SessionScreen,
  SummaryScreen,
} from './screens'

/**
 * App shell: wires the session controller + theme/font side effects, then
 * cross-fades between the top-level screens inside a single AnimatePresence.
 */
function App() {
  useThemeSync()
  useFontPreload()

  const {
    screen,
    sessionQueue,
    sessionResults,
    focusRow,
    confettiTrigger,
    matchingPool,
    startSession,
    goDashboard,
    finishOnboarding,
    handleFinish,
    openMatching,
    openPlacement,
  } = useSessionController()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Confetti trigger={confettiTrigger} />

      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        <AnimatePresence mode="wait">
          {screen === 'landing' && <LandingScreen onChoose={finishOnboarding} />}

          {screen === 'dashboard' && (
            <DashboardScreen
              focusRow={focusRow}
              onStart={() => startSession(null)}
              onSelectRow={startSession}
              onPlacement={openPlacement}
              onMatching={openMatching}
            />
          )}

          {screen === 'session' && (
            <SessionScreen
              queue={sessionQueue}
              focusRow={focusRow}
              onFinish={handleFinish}
              onExit={goDashboard}
            />
          )}

          {screen === 'matching' && (
            <MatchingScreen pool={matchingPool} onFinish={handleFinish} onBack={goDashboard} />
          )}

          {screen === 'placement' && (
            <PlacementScreen onDone={() => startSession(null)} onSkip={goDashboard} />
          )}

          {screen === 'summary' && (
            <SummaryScreen
              results={sessionResults}
              focusRow={focusRow}
              onAgain={startSession}
              onHome={goDashboard}
            />
          )}
        </AnimatePresence>
      </div>

      <footer
        className="mx-auto max-w-5xl px-4 pt-4 text-center text-xs text-slate-400 sm:px-6 dark:text-slate-600"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        {KANA_DATA.length} kana · Spaced Repetition + Active Recall · progress tersimpan lokal
      </footer>
    </div>
  )
}

export default App
