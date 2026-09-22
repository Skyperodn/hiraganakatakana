# AGENTS.md — Kana Master

Panduan kerja untuk AI coding agent di repo ini. Baca ini dulu sebelum mengubah kode.

## 1. Apa project ini

Web app single-page untuk hafal **Hiragana & Katakana** pakai 3 metode:
- **Spaced Repetition (Leitner 5-box)** — kartu due muncul duluan tiap sesi.
- **Mnemonic visual** — asosiasi bentuk → bunyi (teks; gambar Flux belum di-generate).
- **Active recall** — 5 mode kuis yang diacak tiap soal.

Target user: sudah paham konsep kana, butuh tool drilling cepat. **Bukan** tutorial "apa itu hiragana".

## 2. Tech stack (versi nyata, sudah terinstall)

| Layer | Pkg | Versi |
|---|---|---|
| Build | vite | ^8.3 |
| UI | react / react-dom | ^19.2 |
| Bahasa | typescript | ~6.0 |
| Styling | tailwindcss + @tailwindcss/vite | ^4.3 (**v4, bukan v3**) |
| Animasi | framer-motion | ^13.4 |
| State | zustand | ^5.0 |
| Lint | oxlint | ^1.81 |

⚠️ Jangan pakai pola Tailwind v3 (`tailwind.config.js`, `@tailwind base/directives`) — v4 pakai CSS-first config di `src/index.css` via `@theme` + `@custom-variant`. Jangan tambah `postcss.config` atau `tailwind.config.js`.

## 3. Perintah

```sh
npm run dev        # vite dev server
npm run build      # tsc -b && vite build  (WAJIB hijau sebelum lanjut)
npm run lint       # oxlint
npm run preview    # preview hasil build
```

Definisi "selesai" = `npm run build` lulus **dan** fitur dicek fungsional di browser (bukan hanya compile).

## 4. Struktur & tanggung jawab file

```
src/
  types/index.ts        # SINGLE SOURCE OF TRUTH untuk semua tipe. Ubah di sini dulu.
  data/
    kana.ts             # 208 KanaItem lengkap + mnemonic (id: hira-*/kata-*)
    rows.ts             # ROWS[] meta gojuon + UNLOCK_THRESHOLD/MIN_ATTEMPTS + rowColor()
  lib/srs.ts            # PURE logic Leitner. Tanpa React. Immutable return.
  store/useProgress.ts  # Zustand + persist localStorage (key: kana-progress-v1)
  hooks/useDueQueue.ts  # due / newCards / allActive + pickSessionQueue()
  components/           # QuizEngine, Flashcard, ProgressDashboard, RowSelector,
                        # StreakBadge, MatchingGame, PlacementTest, SessionSummary, Confetti
  App.tsx               # orkestrator screen (dashboard|session|summary|matching|placement)
  index.css             # Tailwind v4 theme, row colors, helper 3D-flip, .kana-glyph
```

## 5. Konvensi wajib

- **TypeScript strict**, `noUnusedLocals` + `verbatimModuleSyntax` aktif. Gunakan `import type { ... }` untuk tipe. **Dilarang `any`.**
- Ubah kontrak tipe **hanya** di `src/types/index.ts`, lalu sesuaikan importnya.
- Logic SRS di `lib/srs.ts` harus **pure & immutable** (return object baru). Jangan campur React di situ.
- Nama/teks UI: **Bahasa Indonesia**.
- Styling: utility class Tailwind v4 + `dark:` variant (class strategy, `<html class="dark">`).
- Kana glyph selalu pakai class `kana-glyph` (font Noto Sans JP).
- Warna per baris gojuon: pakai `rowColor(row)` dari `data/rows.ts` (CSS var `--color-row-*`), jangan hardcode hex.
- Animasi pakai framer-motion; hormati `useReducedMotion()`.

## 6. Aturan domain (jangan diubah sembarangan)

**SRS Leitner box → interval** (lihat `lib/srs.ts`):
box 1 = 0 hari, 2 = 1, 3 = 3, 4 = 7, 5 = 30. Benar → naik 1 box; salah → reset ke box 1.

**Progressive unlock** (`store/useProgress.ts` → `tryUnlockRow`):
Baris berikutnya terbuka bila baris di **frontier** (baris unlocked terakhir) mencapai
**akurasi ≥ 90%** DAN **≥ 20 percobaan**. Guard `row === frontier` WAJIB ada — tanpa itu,
mengerjakan baris lama akan meloncati baris terkunci.

**Antrian sesi** (`useDueQueue.ts` → `pickSessionQueue`): kartu **due dulu**, baru kartu baru (maks 10).

**Mode kuis** (`QuizEngine.tsx`): `kana-romaji`, `romaji-kana`, `audio-kana` (Web Speech API `ja-JP`), `type-romaji` (terima alternatif Hepburn: shi/si, tsu/tu, fu/hu, dll). `matching` ditangani komponen terpisah.

## 7. Jebakan yang sudah pernah jadi bug (JANGAN diulang)

1. **Double-advance race** — tombol "Lanjut" lama masih ada saat animasi exit → klik ganda bikin index melompati soal → crash "data kosong". Solusi: lock ref (`advancingRef`) di `QuizEngine` & `PlacementTest`. Pertahankan guard ini.
2. **Unlock meloncati baris** — `tryUnlockRow` harus cek `row === frontier` sebelum membuka baris berikutnya.
3. **Tanggal**: selalu pakai `todayISO()`/`addDays()` dari `lib/srs.ts` (local date), **jangan** `new Date().toISOString()` (timezone bug).

## 8. Persistence

Progress disimpan Zustand persist ke localStorage key **`kana-progress-v1`**.
`partialize` hanya menyimpan field data (reviews, xp, streak, unlockedRows, completedRows, familiarIds, darkMode) — action tidak. Saat ganti skema state, **naikkan/rename key** atau tangani migrasi, jangan diam-diam break data user lama.

## 9. Yang belum selesai (roadmap)

- **Gambar mnemonic Flux/Replicate** — field `KanaItem.imageUrl` masih kosong. UI sudah punya placeholder (`MiniIllustration` di `Flashcard`, hint di `QuizEngine`). Saat integrasi: isi `imageUrl`, jangan ubah struktur tipe.
- Backend/Auth — sengaja belum ada; progress murni lokal (MVP).

## 10. Alur kerja agent

- Kerjakan bertahap; pastikan `npm run build` hijau tiap tahap.
- Verifikasi fungsional di browser untuk perubahan store/queue/unlock (bukan cuma typecheck).
- Jangan jalankan `opencode plugin ...` dengan argumen non-modul — itu bikin folder `.opencode/` nyasar. Plugin opencode dipasang manual via npm di `~/.config/opencode`.
