import { useCallback, useEffect, useRef, useState } from 'react'

/** State machine for Japanese TTS playback. */
export type AudioStatus = 'idle' | 'attempting' | 'playing' | 'ready' | 'blocked'

export function speechSynthesisAvailable(): boolean {
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
export function probeJapaneseVoices(): boolean | null {
  if (!speechSynthesisAvailable()) return false
  try {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length === 0) return null
    return voices.some((v) => v.lang.toLowerCase().startsWith('ja'))
  } catch {
    return false
  }
}

export function cancelSpeech(): void {
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
export function speakJapanese(text: string, handlers?: SpeakHandlers): boolean {
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

/** Return shape of {@link useJapaneseSpeech}. */
export interface JapaneseSpeech {
  /** Whether a Japanese (`ja*`) voice is available for TTS. */
  jaVoiceAvailable: boolean
  /** Current playback status. */
  audioStatus: AudioStatus
  /** Speak `text` and track playback; marks `blocked` if no event arrives. */
  speak: (text: string) => void
}

/**
 * Tracks Japanese TTS voice availability and playback status.
 *
 * `jaVoiceAvailable` starts optimistically and is corrected once voices load
 * (`voiceschanged`); `audioStatus` follows the 'idle' → 'attempting' →
 * 'playing' | 'ready' | 'blocked' state machine. `speak()` guards against a
 * missing playback event (autoplay likely blocked) by flipping to 'blocked'
 * after a 900ms grace window.
 */
export function useJapaneseSpeech(): JapaneseSpeech {
  // Japanese TTS voice availability — when false, callers can exclude audio
  // modes from their rotation so the mode can never be silently impossible.
  const [jaVoiceAvailable, setJaVoiceAvailable] = useState<boolean>(
    () => probeJapaneseVoices() ?? true,
  )

  const [audioStatus, setAudioStatus] = useState<AudioStatus>('idle')
  const audioGuardRef = useRef<number | null>(null)

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

  /* ---- Stop any in-flight utterance + guard on unmount. ---------- */
  useEffect(
    () => () => {
      if (audioGuardRef.current !== null) {
        window.clearTimeout(audioGuardRef.current)
        audioGuardRef.current = null
      }
      cancelSpeech()
    },
    [],
  )

  /** Speak and track playback; if no start/end event arrives, mark blocked. */
  const speak = useCallback((text: string) => {
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

  return { jaVoiceAvailable, audioStatus, speak }
}
