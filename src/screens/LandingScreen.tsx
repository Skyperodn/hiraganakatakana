import { motion } from 'framer-motion'
import type { OnboardingTarget } from '../lib/app'

interface LandingScreenProps {
  onChoose: (target: OnboardingTarget) => void
}

const CARD_CLASS =
  'group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:border-slate-700/80 dark:bg-slate-900 dark:hover:border-indigo-500'

/** First-run onboarding: pick a starting path before entering the dashboard. */
export default function LandingScreen({ onChoose }: LandingScreenProps) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center py-8"
    >
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Kana Master</h1>
      <p className="mt-3 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
        Hafal hiragana &amp; katakana dengan SRS + mnemonic + kuis aktif.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button type="button" onClick={() => onChoose('dashboard')} className={CARD_CLASS}>
          <span className="block text-lg font-bold text-indigo-600 dark:text-indigo-400">
            Mulai dari nol
          </span>
          <span className="mt-2 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Belajar baris gojuon berurutan lewat kartu SRS dan kuis.
          </span>
        </button>

        <button type="button" onClick={() => onChoose('placement')} className={CARD_CLASS}>
          <span className="block text-lg font-bold text-indigo-600 dark:text-indigo-400">
            Uji Penempatan
          </span>
          <span className="mt-2 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Sudah tahu sebagian kana? Tes dulu, mulai dari level kamu.
          </span>
        </button>
      </div>
    </motion.div>
  )
}
