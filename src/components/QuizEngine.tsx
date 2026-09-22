import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type {
  KanaItem,
  KanaRow,
  QuizMode,
  QuizOption,
  QuizQuestion,
  SessionResult,
} from '../types'
import { KANA_DATA } from '../data/kana'
import { rowColor } from '../data/rows'
import { useProgress } from '../store/useProgress'
import Flashcard from './Flashcard'

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

export interface QuizEngineProps {
  /** Ordered cards for this session. */
  queue: KanaItem[]
  /** Called once the queue is exhausted, with every answer's result. */
  onFinish: (results: SessionResult[]) => void
}

/* ------------------------------------------------------------------ */
/* Modes                                                               */
/* ------------------------------------------------------------------ */

/**
 * Modes used in the per-question random rotation.
 * 'matching' is intentionally excluded — it is handled by a separate UI.
 */
const ROTATION_MODES: readonly QuizMode[] = [
  'kana-romaji',
  'romaji-kana',
  'audio-kana',
  'type-romaji',
] as const

/** Modes that render a multiple-choice option grid. */
type ChoiceMode = 'kana-romaji' | 'romaji-kana' | 'audio-kana'

function isChoiceMode(mode: QuizMode): mode is ChoiceMode {
  return mode !== 'type-romaji' && mode !== 'matching'
}

/* ------------------------------------------------------------------ */
/* Hepburn romanization alternates                                     */
/* ------------------------------------------------------------------ */

/**
 * Maps a canonical (Hepburn) romaji string to the alternate spellings we
 * also accept in free-text mode. Covers the common irregulars plus the
 * systematic kunrei-shiki / wāpuro spellings (sha/sya, cha/tya, ja/zya…).
 */
const ROMAJI_ALTERNATES: ReadonlyArray<readonly [string, string]> = [
  ['shi', 'si'],
  ['chi', 'ti'],
  ['tsu', 'tu'],
  ['fu', 'hu'],
  ['ji', 'zi'],
  ['sha', 'sya'],
  ['shu', 'syu'],
  ['sho', 'syo'],
  ['cha', 'tya'],
  ['chu', 'tyu'],
  ['cho', 'tyo'],
  ['ja', 'zya'],
  ['ju', 'zyu'],
  ['jo', 'zyo'],
].map(([a, b]) => [a, b] as const)

/**
 * Returns the set of strings accepted as correct for a given canonical
 * romaji, normalized to lowercase. Includes the canonical form plus any
 * known alternates (in both directions, e.g. "si" ⇄ "shi").
 */
function acceptedAnswers(romaji: string): string[] {
  const base = romaji.toLowerCase()
  const extra = new Set<string>()

  for (const [a, b] of ROMAJI_ALTERNATES) {
    if (base === a) extra.add(b)
    else if (base === b) extra.add(a)
  }

  // Small tsu (sokuon) typing variants: "kka" also typed as "kka" is fine,
  // but "kkya" can be entered as "kya" with a leading small tsu collapse.
  // We also accept an explicitly doubled leading consonant ("ttsu" → "tsu").
  if (base.startsWith('tsu')) extra.add('ttsu')

  return [base, ...extra]
}

/* ------------------------------------------------------------------ */
/* Question builders                                                   */
/* ------------------------------------------------------------------ */

type Rng = () => number

function pickRandom<T>(arr: readonly T[], rng: Rng): T {
  return arr[Math.floor(rng() * arr.length)]
}

/** Shuffle a copy of an array (Fisher–Yates). */
function shuffle<T>(arr: readonly T[], rng: Rng): T[] {
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Pick `count` distractor kana for `kana`, restricted to rows the learner
 * has unlocked (so locked-row kana never leak into options). Never reuses
 * the correct answer or its romaji. Prefers 1–2 confusables from the same
 * row (e.g. し vs つ), then fills from other unlocked rows (same type first).
 * Returns fewer than `count` only when the unlocked pool is too thin.
 */
function pickDistractors(
  kana: KanaItem,
  unlockedRows: ReadonlySet<KanaRow>,
  count: number,
  rng: Rng,
): KanaItem[] {
  const candidates = KANA_DATA.filter(
    (k) =>
      k.id !== kana.id &&
      k.romaji !== kana.romaji &&
      unlockedRows.has(k.row),
  )

  const sameTypeSameRow = candidates.filter(
    (k) => k.row === kana.row && k.type === kana.type,
  )
  const otherTypeSameRow = candidates.filter(
    (k) => k.row === kana.row && k.type !== kana.type,
  )
  const sameTypeOtherRow = candidates.filter(
    (k) => k.row !== kana.row && k.type === kana.type,
  )
  const otherTypeOtherRow = candidates.filter(
    (k) => k.row !== kana.row && k.type !== kana.type,
  )

  const picked: KanaItem[] = []
  const seen = new Set<string>([kana.romaji])

  const take = (list: readonly KanaItem[], max: number) => {
    for (const candidate of shuffle(list, rng)) {
      if (picked.length >= count || max <= 0) break
      if (seen.has(candidate.romaji)) continue
      seen.add(candidate.romaji)
      picked.push(candidate)
      max -= 1
    }
  }

  // 1) Prefer up to two same-row confusables (same type first).
  const sameRowQuota = Math.min(2, count)
  take(sameTypeSameRow, sameRowQuota)
  take(otherTypeSameRow, sameRowQuota - picked.length)

  // 2) Fill the rest from other unlocked rows (same type first).
  take(sameTypeOtherRow, count - picked.length)
  take(otherTypeOtherRow, count - picked.length)

  // 3) Thin-pool fallback: allow more same-row cards rather than underfill.
  if (picked.length < count) {
    take(candidates, count - picked.length)
  }

  return picked
}

/**
 * Build a question for `kana` in the given `mode`.
 * Distractors never duplicate the correct answer (dedup by romaji + value).
 */
function buildQuestion(
  kana: KanaItem,
  mode: QuizMode,
  rng: Rng,
  unlockedRows: ReadonlySet<KanaRow>,
): QuizQuestion {
  if (mode === 'romaji-kana' || mode === 'audio-kana') {
    // Prompt is romaji/audio → options are kana characters.
    const distractors = pickDistractors(kana, unlockedRows, 3, rng)

    const options: QuizOption[] = shuffle(
      [
        { value: kana.character, label: kana.character },
        ...distractors.map<QuizOption>((d) => ({
          value: d.character,
          label: d.character,
        })),
      ],
      rng,
    )

    return { kana, mode, options, correctValue: kana.character }
  }

  if (mode === 'kana-romaji') {
    // Prompt is the kana glyph → options are romaji.
    const distractors = pickDistractors(kana, unlockedRows, 3, rng)

    const options: QuizOption[] = shuffle(
      [
        { value: kana.romaji, label: kana.romaji },
        ...distractors.map<QuizOption>((d) => ({
          value: d.romaji,
          label: d.romaji,
        })),
      ],
      rng,
    )

    return { kana, mode, options, correctValue: kana.romaji }
  }

  // type-romaji → free text, no options.
  return {
    kana,
    mode: 'type-romaji',
    options: [],
    correctValue: kana.romaji,
  }
}

/* ------------------------------------------------------------------ */
/* Speech (audio-kana)                                                 */
/* ------------------------------------------------------------------ */

type AudioStatus = 'idle' | 'attempting' | 'playing' | 'ready' | 'blocked'

function speechSynthesisAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis !== 'undefined' &&
    window.speechSynthesis !== null
  )
}

/**
 * Probe for a Japanese voice.
 * Returns true  = ja voice present,
 *        false  = voices loaded but none Japanese (or speech unavailable),
 *        null   = voices not loaded yet (await `voiceschanged`).
 */
function probeJapaneseVoices(): boolean | null {
  if (!speechSynthesisAvailable()) return false
  try {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length === 0) return null
    return voices.some((v) => v.lang.toLowerCase().startsWith('ja'))
  } catch {
    return false
  }
}

function cancelSpeech(): void {
  if (!speechSynthesisAvailable()) return
  try {
    window.speechSynthesis.cancel()
  } catch {
    /* Speech synthesis unavailable — silent fallback. */
  }
}

interface SpeakHandlers {
  onStart?: () => void
  onEnd?: () => void
}

/** Returns false when speech synthesis is unavailable (never throws). */
function speakJapanese(text: string, handlers?: SpeakHandlers): boolean {
  if (!speechSynthesisAvailable()) return false
  try {
    const synth = window.speechSynthesis
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'
    u.rate = 0.85
    if (handlers?.onStart) u.onstart = handlers.onStart
    if (handlers?.onEnd) {
      u.onend = handlers.onEnd
      u.onerror = handlers.onEnd
    }
    synth.speak(u)
    return true
  } catch {
    /* Speech synthesis unavailable — silent fallback. */
    return false
  }
}

/* ------------------------------------------------------------------ */
/* Inline icons (no icon library)                                      */
/* ------------------------------------------------------------------ */

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 4.5v15l13-7.5-13-7.5Z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* QuizEngine                                                          */
/* ------------------------------------------------------------------ */

export default function QuizEngine({ queue, onFinish }: QuizEngineProps) {
  const grade = useProgress((s) => s.grade)
  const registerStudyToday = useProgress((s) => s.registerStudyToday)
  const tryUnlockRow = useProgress((s) => s.tryUnlockRow)

  const total = queue.length
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<SessionResult[]>([])

  // Current multi-choice selection + free-text input.
  const [selected, setSelected] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  // null = no feedback yet, true/false = answered.
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)

  // Whether the card at the current index was unseen when the question mounted.
  const [isNewCard, setIsNewCard] = useState(false)
  // Remembers the last card we ran the "new card" check for.
  const checkedCardId = useRef<string | null>(null)
  // Guard so we never submit twice for the same question.
  const submitted = useRef(false)
  // Guard so we never advance twice from one tap (old button still exiting).
  const advancingRef = useRef(false)
  // Latest handleContinue for the auto-advance timer, so the timeout always
  // sees fresh results/index without rescheduling when parent props change.
  const continueRef = useRef<(() => void) | null>(null)
  // Leitner box transition for the current answer (captured BEFORE grade()).
  const [boxDelta, setBoxDelta] = useState<{ pre: number; post: number } | null>(
    null,
  )
  // Stable per-mount RNG seed for building questions.
  const rng = useMemo<Rng>(() => Math.random, [])

  // Japanese TTS voice availability — when false, 'audio-kana' is excluded
  // from the rotation so the mode can never be silently impossible.
  const [jaVoiceAvailable, setJaVoiceAvailable] = useState<boolean>(
    () => probeJapaneseVoices() ?? true,
  )

  const rotationModes = useMemo<readonly QuizMode[]>(
    () =>
      jaVoiceAvailable
        ? ROTATION_MODES
        : ROTATION_MODES.filter((m) => m !== 'audio-kana'),
    [jaVoiceAvailable],
  )

  const current: KanaItem | undefined = queue[index]

  /* ---- Build the question for the current card (memoized). ------- */

  const question = useMemo<QuizQuestion | null>(() => {
    if (!current) return null
    const mode = pickRandom(rotationModes, rng)
    // Read unlocked rows imperatively: a mid-session unlock must not rebuild
    // (and replace) the in-flight question under the learner's feet.
    const unlockedRows = new Set(useProgress.getState().unlockedRows)
    return buildQuestion(current, mode, rng, unlockedRows)
    // Rebuild whenever the card (index/queue) or available modes change.
  }, [current, rng, rotationModes])

  /* ---- Reset per-question state whenever the card changes. ------- */

  useEffect(() => {
    if (!current) return
    submitted.current = false
    setSelected(null)
    setTyped('')
    setLastCorrect(null)
    setBoxDelta(null)

    // Detect "new card": was there NO review state before this question?
    // Only check once per card id — StrictMode double-invokes effects, and
    // creating the review here (or on a second run) would flip this to false.
    if (checkedCardId.current !== current.id) {
      const hadReview = Boolean(useProgress.getState().reviews[current.id])
      setIsNewCard(!hadReview)
      checkedCardId.current = current.id
    }
    // NOTE: do NOT ensureReview here — grade() creates the review on first
    // submit, so an abandoned session never turns unviewed cards into "due".
  }, [current])

  /* ---- Track ja-voice availability (async load + availability). -- */

  useEffect(() => {
    if (!speechSynthesisAvailable()) {
      setJaVoiceAvailable(false)
      return undefined
    }
    const synth = window.speechSynthesis
    const sync = () => {
      const probe = probeJapaneseVoices()
      // null = voices not loaded yet → keep the optimistic value.
      if (probe !== null) setJaVoiceAvailable(probe)
    }
    sync()
    synth.onvoiceschanged = sync
    return () => {
      synth.onvoiceschanged = null
    }
  }, [])

  /* ---- Auto-play audio prompt on mount (audio-kana only). -------- */

  const [audioStatus, setAudioStatus] = useState<AudioStatus>('idle')
  const audioGuardRef = useRef<number | null>(null)

  /** Speak and track playback; if no start/end event arrives, mark blocked. */
  const beginSpeak = useCallback((text: string) => {
    if (audioGuardRef.current !== null) {
      window.clearTimeout(audioGuardRef.current)
      audioGuardRef.current = null
    }
    setAudioStatus('attempting')
    let settled = false
    const ok = speakJapanese(text, {
      onStart: () => {
        settled = true
        setAudioStatus('playing')
      },
      onEnd: () => {
        settled = true
        setAudioStatus('ready')
      },
    })
    if (!ok) {
      setAudioStatus('blocked')
      return
    }
    // No playback event ⇒ autoplay likely blocked; surface a tap hint.
    audioGuardRef.current = window.setTimeout(() => {
      audioGuardRef.current = null
      if (!settled) setAudioStatus('blocked')
    }, 900)
  }, [])

  useEffect(() => {
    setAudioStatus('idle')
    if (audioGuardRef.current !== null) {
      window.clearTimeout(audioGuardRef.current)
      audioGuardRef.current = null
    }

    if (question?.mode !== 'audio-kana') {
      // Left audio mode (or unmounted): never let utterances bleed across.
      cancelSpeech()
      return undefined
    }

    // Defer to the next tick so the utterance fires after layout.
    const id = window.setTimeout(() => beginSpeak(question.kana.romaji), 250)
    return () => {
      window.clearTimeout(id)
      if (audioGuardRef.current !== null) {
        window.clearTimeout(audioGuardRef.current)
        audioGuardRef.current = null
      }
      cancelSpeech()
    }
  }, [question, beginSpeak])

  /* ---- Study-day bookkeeping once per session card. -------------- */

  useEffect(() => {
    if (current) registerStudyToday()
  }, [current, registerStudyToday])

  /* ---- Submit an answer. ----------------------------------------- */

  const handleSubmit = useCallback(
    (value: string) => {
      if (!current || !question) return
      if (submitted.current || lastCorrect !== null) return
      submitted.current = true

      let correct: boolean
      if (question.mode === 'type-romaji') {
        const normalized = value.trim().toLowerCase()
        correct = acceptedAnswers(question.kana.romaji).includes(normalized)
      } else {
        correct = value === question.correctValue
      }

      setSelected(value)
      setLastCorrect(correct)

      // Capture the pre-grade box so the feedback can show the transition
      // (e.g. "Box 3 → 1"). Untracked cards have no delta — grade() creates
      // the review itself.
      const preBox = useProgress.getState().reviews[current.id]?.box ?? null

      // Persist to the store. `grade` already awards +10/+2 XP itself.
      grade(current.id, correct)
      setBoxDelta(
        preBox === null
          ? null
          : { pre: preBox, post: correct ? Math.min(preBox + 1, 5) : 1 },
      )
      registerStudyToday()
      tryUnlockRow(current.row)

      setResults((prev) => [
        ...prev,
        {
          kanaId: current.id,
          character: current.character,
          romaji: current.romaji,
          correct,
        },
      ])
    },
    [current, question, lastCorrect, grade, registerStudyToday, tryUnlockRow],
  )

  /* ---- Advance to the next question / finish the session. -------- */

  const handleContinue = useCallback(() => {
    if (lastCorrect === null) return
    // Guard against double-taps while the previous question is still exiting.
    if (advancingRef.current) return
    advancingRef.current = true
    const nextIndex = index + 1
    if (nextIndex >= total) {
      onFinish(results)
      return
    }
    setIndex(nextIndex)
    requestAnimationFrame(() => {
      advancingRef.current = false
    })
  }, [lastCorrect, index, total, results, onFinish])

  // Keep the auto-advance timer pointed at the latest handleContinue.
  useEffect(() => {
    continueRef.current = handleContinue
  })

  /* ---- Auto-advance ~1s after a CORRECT answer (wrong stays manual). */
  useEffect(() => {
    if (lastCorrect !== true) return undefined
    const id = window.setTimeout(() => {
      // No-ops if already advanced (advancingRef) or left the question.
      continueRef.current?.()
    }, 1000)
    // Cleared on unmount and whenever the question/answer state changes —
    // a manual "Lanjut" during the window resets lastCorrect → cleanup runs.
    return () => {
      window.clearTimeout(id)
    }
  }, [lastCorrect])

  /* ---- Keyboard support: 1-4 select, Enter submit/continue. ------ */

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!question) return

      // Never hijack keys while the user is typing in a text field,
      // except Enter (which should submit the typed answer).
      const target = e.target as HTMLElement | null
      const isTextInput =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA'

      if (e.key === 'Enter') {
        e.preventDefault()
        if (lastCorrect !== null) {
          handleContinue()
        } else if (question.mode === 'type-romaji') {
          if (typed.trim().length > 0) handleSubmit(typed)
        } else if (target instanceof HTMLButtonElement) {
          target.click()
        }
        return
      }

      if (isTextInput) return

      // 1-4 select an option (choice modes only).
      if (isChoiceMode(question.mode) && lastCorrect === null) {
        const n = Number(e.key)
        if (Number.isInteger(n) && n >= 1 && n <= question.options.length) {
          const opt = question.options[n - 1]
          if (opt) handleSubmit(opt.value)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [question, lastCorrect, typed, handleSubmit, handleContinue])

  /* ---- Empty queue state. --------------------------------------- */

  if (total === 0 || !current || !question) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="text-5xl" aria-hidden="true">
          🎴
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Tidak ada kartu
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Belum ada kartu untuk sesi ini. Coba buka baris berikutnya atau mulai
          latihan lagi.
        </p>
      </div>
    )
  }

  const accent = rowColor(current.row)
  const correctCount = results.filter((r) => r.correct).length
  const wrongCount = results.length - correctCount
  // Progress counts the current card once it's answered → last card = 100%.
  const answeredProgress = index + (lastCorrect !== null ? 1 : 0)
  const progressPct = total === 0 ? 0 : (answeredProgress / total) * 100
  const isTypeMode = question.mode === 'type-romaji'

  // Type-mode: list every accepted spelling when the answer was wrong, and
  // credit the alternate the learner actually typed when it was accepted.
  const typeAlternates = isTypeMode ? acceptedAnswers(question.kana.romaji) : []
  const showTypeAlternates =
    isTypeMode && lastCorrect === false && typeAlternates.length > 1
  const typedNorm = typed.trim().toLowerCase()
  const usedAlternate =
    isTypeMode &&
    lastCorrect === true &&
    typedNorm.length > 0 &&
    typedNorm !== question.kana.romaji.toLowerCase()

  /* ---- Prompt rendering per mode. ------------------------------- */

  const promptKana =
    question.mode === 'kana-romaji' || question.mode === 'type-romaji'
  const promptAudio = question.mode === 'audio-kana'
  const promptRomaji = question.mode === 'romaji-kana'

  const audioLabel =
    audioStatus === 'attempting' || audioStatus === 'playing'
      ? 'Memutar…'
      : audioStatus === 'ready'
        ? 'Ketuk untuk mendengar lagi'
        : 'Ketuk 🔊 untuk memutar'

  const frontContent = promptKana ? (
    <span
      lang="ja"
      className="kana-glyph text-[clamp(5rem,26vw,11rem)] leading-none text-slate-900 dark:text-white"
      aria-label={`Kana ${current.character}`}
    >
      {current.character}
    </span>
  ) : promptRomaji ? (
    <span
      className="text-[clamp(3rem,16vw,6rem)] leading-none font-extrabold tracking-tight text-slate-900 dark:text-white"
      aria-label={`Romaji ${current.romaji}`}
    >
      {current.romaji}
    </span>
  ) : (
    <div className="flex flex-col items-center gap-4 px-6 text-center">
      <button
        type="button"
        onClick={(e) => {
          // The speaker must never act as a card flip / option submit.
          e.stopPropagation()
          beginSpeak(current.romaji)
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

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-5 px-4 py-6">
      {/* Header: progress + score. Single progress indicator only. */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <span aria-live="polite">
            Kartu {Math.min(index + 1, total)} / {total}
          </span>
          <span
            className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            aria-live="polite"
          >
            Benar {correctCount} · Salah {wrongCount}
          </span>
        </div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={answeredProgress}
          aria-label="Progres sesi"
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accent }}
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: 'spring', stiffness: 220, damping: 30 }}
          />
        </div>
        <p className="hidden text-right text-[11px] text-slate-400 sm:block dark:text-slate-500">
          {isTypeMode
            ? 'Tekan Enter untuk periksa · lanjut'
            : 'Tekan 1–4 pilih · Enter lanjut'}
        </p>
      </div>

      {/* Question card. */}
      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-900">
        {/* Soft row-tinted glow behind the prompt. */}
        <div
          className="pointer-events-none absolute inset-0 -z-0 opacity-40 blur-3xl"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${accent}33, transparent 60%)`,
          }}
          aria-hidden="true"
        />

        {isNewCard && lastCorrect === null && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            Kartu baru ✨
          </span>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.id}-${question.mode}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 flex flex-col items-center gap-4"
          >
            <Flashcard
              kana={current}
              frontContent={frontContent}
              flipped={lastCorrect !== null}
              revealCorrect={
                lastCorrect === null ? null : lastCorrect ? 'correct' : 'wrong'
              }
              showMnemonic={lastCorrect !== null}
            />

            <p className="text-center text-sm text-slate-400 dark:text-slate-500">
              {isTypeMode
                ? 'Ketik romaji yang benar'
                : promptAudio
                  ? 'Pilih kana yang kamu dengar'
                  : promptRomaji
                    ? 'Pilih kana yang cocok'
                    : 'Pilih romaji yang benar'}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Feedback banner. */}
        <AnimatePresence>
          {lastCorrect !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={[
                'relative z-10 w-full rounded-2xl px-4 py-3 text-center text-sm font-bold',
                lastCorrect
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
              ].join(' ')}
              role="status"
            >
              {lastCorrect ? (
                <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                  <span className="inline-flex items-center gap-2">
                    <CheckIcon className="h-5 w-5" /> Benar!
                  </span>
                  {usedAlternate && (
                    <span className="text-xs font-medium opacity-80">
                      ({typedNorm} juga oke)
                    </span>
                  )}
                  {boxDelta && (
                    <span className="text-xs font-semibold opacity-75">
                      Box {boxDelta.pre} → {boxDelta.post}
                    </span>
                  )}
                </span>
              ) : (
                <span>
                  Salah — jawaban:{' '}
                  <span className="font-extrabold">{current.romaji}</span>
                  {boxDelta && (
                    <span className="mt-1 block text-xs font-semibold opacity-75">
                      Box {boxDelta.pre} → {boxDelta.post} · jatuh tempo lagi
                      hari ini
                    </span>
                  )}
                  {showTypeAlternates && (
                    <span className="mt-1 block text-[11px] font-medium opacity-75">
                      Diterima: {typeAlternates.join(' / ')}
                    </span>
                  )}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mnemonic is revealed on the Flashcard back face after answering —
          no duplicate MnemonicHint below (would show the text twice). */}

      {/* Answer area. */}
      {isTypeMode ? (
        <TypeAnswer
          value={typed}
          onChange={setTyped}
          onSubmit={() => handleSubmit(typed)}
          disabled={lastCorrect !== null}
          revealed={lastCorrect !== null}
          correct={lastCorrect === true}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3" role="group" aria-label="Pilihan jawaban">
          {question.options.map((opt, i) => {
            const isCorrectOpt = opt.value === question.correctValue
            const isChosen = selected === opt.value

            // Color logic after answering:
            //   correct option → green; chosen-but-wrong → red.
            let stateClass =
              'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'
            if (lastCorrect !== null) {
              if (isCorrectOpt) {
                stateClass =
                  'border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-100'
              } else if (isChosen) {
                stateClass =
                  'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950/50 dark:text-rose-100'
              } else {
                stateClass =
                  'border-slate-200 bg-white text-slate-400 opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-600'
              }
            }

            return (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => handleSubmit(opt.value)}
                disabled={lastCorrect !== null}
                aria-label={`Pilihan ${i + 1}: ${opt.label}`}
                whileTap={{ scale: lastCorrect === null ? 0.97 : 1 }}
                animate={
                  lastCorrect !== null && (isCorrectOpt || isChosen)
                    ? { scale: [1, 1.06, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.3 }}
                className={[
                  'relative flex min-h-20 items-center justify-center rounded-2xl border-2 px-4 py-5 text-center shadow-sm transition focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:outline-none disabled:cursor-default',
                  stateClass,
                ].join(' ')}
              >
                <span className="pointer-events-none absolute top-2 left-3 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {i + 1}
                </span>
                <span
                  lang={
                    question.mode === 'romaji-kana' ||
                    question.mode === 'audio-kana'
                      ? 'ja'
                      : undefined
                  }
                  className={
                    question.mode === 'kana-romaji'
                      ? 'font-sans text-2xl font-bold sm:text-3xl'
                      : 'kana-glyph text-4xl sm:text-5xl'
                  }
                >
                  {opt.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Continue button — shown after feedback (preferred over auto-advance). */}
      <AnimatePresence>
        {lastCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <button
              type="button"
              onClick={handleContinue}
              autoFocus
              aria-label={
                index + 1 >= total ? 'Selesai, lihat hasil' : 'Lanjut ke kartu berikutnya'
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-slate-800 focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:outline-none active:scale-[0.99] dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              {index + 1 >= total ? (
                <>
                  <CheckIcon className="h-5 w-5" /> Selesai
                </>
              ) : (
                <>
                  Lanjut <PlayIcon className="h-5 w-5" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* TypeAnswer (free-text mode)                                         */
/* ------------------------------------------------------------------ */

interface TypeAnswerProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  disabled: boolean
  revealed: boolean
  correct: boolean
}

function TypeAnswer({
  value,
  onChange,
  onSubmit,
  disabled,
  revealed,
  correct,
}: TypeAnswerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const borderClass = revealed
    ? correct
      ? 'border-emerald-400 focus-visible:ring-emerald-300 dark:border-emerald-500'
      : 'border-rose-400 focus-visible:ring-rose-300 dark:border-rose-500'
    : 'border-slate-300 focus-visible:ring-sky-300 dark:border-slate-600'

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <label htmlFor="quiz-type-input" className="sr-only">
        Ketik romaji
      </label>
      <input
        id="quiz-type-input"
        ref={inputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ketik romaji…"
        aria-label="Jawaban romaji"
        className={[
          'w-full rounded-2xl border-2 bg-white px-5 py-4 text-center text-2xl font-bold tracking-wide text-slate-800 shadow-sm transition placeholder:text-slate-300 focus-visible:ring-4 focus-visible:outline-none disabled:opacity-80 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600',
          borderClass,
        ].join(' ')}
      />
      {!revealed && (
        <button
          type="submit"
          disabled={disabled || value.trim().length === 0}
          className="w-full rounded-2xl bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-slate-800 focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:outline-none active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Periksa
        </button>
      )}
    </form>
  )
}

/* ------------------------------------------------------------------ */
/* Module end                                                          */
/* ------------------------------------------------------------------ */
