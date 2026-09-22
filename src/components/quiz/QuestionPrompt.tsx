import type { ReactNode } from 'react'
import type { KanaItem, QuizMode } from '../../types'
import { SpeakerIcon } from './icons'

type AudioStatus = 'idle' | 'attempting' | 'playing' | 'ready' | 'blocked'

interface QuestionPromptProps {
  kana: KanaItem
  mode: QuizMode
  accent: string
  audioStatus: AudioStatus
  onSpeak: () => void
}

export default function QuestionPrompt({
  kana,
  mode,
  accent,
  audioStatus,
  onSpeak,
}: QuestionPromptProps): ReactNode {
  const promptKana = mode === 'kana-romaji' || mode === 'type-romaji'
  const promptRomaji = mode === 'romaji-kana'

  const audioLabel =
    audioStatus === 'attempting' || audioStatus === 'playing'
      ? 'Memutar…'
      : audioStatus === 'ready'
        ? 'Ketuk untuk mendengar lagi'
        : 'Ketuk 🔊 untuk memutar'

  if (promptKana) {
    return (
      <span
        lang="ja"
        className="kana-glyph text-[clamp(5rem,26vw,11rem)] leading-none text-slate-900 dark:text-white"
        aria-label={`Kana ${kana.character}`}
      >
        {kana.character}
      </span>
    )
  }

  if (promptRomaji) {
    return (
      <span
        className="text-[clamp(3rem,16vw,6rem)] leading-none font-extrabold tracking-tight text-slate-900 dark:text-white"
        aria-label={`Romaji ${kana.romaji}`}
      >
        {kana.romaji}
      </span>
    )
  }

  // audio-kana (fallback): speaker button + status label.
  return (
    <div className="flex flex-col items-center gap-4 px-6 text-center">
      <button
        type="button"
        onClick={(e) => {
          // The speaker must never act as a card flip / option submit.
          e.stopPropagation()
          onSpeak()
        }}
        aria-label="Putar suara"
        className="flex h-28 w-28 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105 focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:outline-none active:scale-95"
        style={{ backgroundColor: accent }}
      >
        <SpeakerIcon className="h-12 w-12" />
      </button>
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {audioLabel}
      </span>
    </div>
  )
}
