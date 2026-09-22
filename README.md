# Kana Master — Hafalan Hiragana & Katakana

Web app untuk menghafal **Hiragana & Katakana** (208 kana) dengan pendekatan *spaced repetition* (Leitner), mnemonic visual, dan kuis *active recall*. Semua progress tersimpan lokal di browser.

![Kana Master](public/apple-touch-icon.svg)

## ✨ Fitur

- **208 kana** lengkap (Hiragana + Katakana), termasuk dakuten/handakuten & yōon.
- **Spaced Repetition (Leitner box)** — interval 0 / 1 / 3 / 7 / 30 hari.
- **5 mode kuis** berotasi: pilih romaji, ketik romaji, audio → kana, kana → arti, dan flashcard.
- **Mnemonic visual** Bahasa Indonesia (muncul setelah menjawab, biar nggak bocor jawaban).
- **Unlock per baris** — baris berikutnya terbuka kalau baris sekarang ≥90% akurat (min. 20 percobaan).
- **Uji Penempatan** — tes awal buat deteksi kana yang sudah kamu kuasai.
- **Matching Game** — pasangkan kana dengan romaji melawan waktu.
- **Streak harian**, **XP**, dan **dashboard progres** per baris.
- **Dark mode**, responsive, dan aman untuk aksesibilitas (ARIA, reduced motion, kontras).

## 🧠 Cara kerja SRS

Tiap kana ada di sebuah **box** (1–5). Jawaban benar menaikkan box, salah menurunkannya. Interval kemunculan berikutnya:

| Box | Interval | Arti |
|-----|----------|------|
| 1 | 0 hari | Ulangi hari ini |
| 2 | 1 hari | Besok |
| 3 | 3 hari | 3 hari lagi |
| 4 | 7 hari | Seminggu lagi |
| 5 | 30 hari | Sudah hafal (mastered) |

Maksimum **10 kartu baru** per sesi supaya tidak overload.

## 🛠️ Teknologi

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4** (CSS-first config di `src/index.css`)
- **Framer Motion** (animasi)
- **Zustand** (state + persist ke `localStorage`)
- **oxlint** (linting)

## 🚀 Menjalankan

```bash
npm install
npm run dev        # server dev
npm run build      # build produksi (tsc -b + vite build)
npm run preview    # preview hasil build
npm run lint       # jalankan oxlint
```

## 📁 Struktur

```
src/
├── components/     # UI: QuizEngine, MatchingGame, PlacementTest, ProgressDashboard, dll.
├── data/           # dataset 208 kana + definisi baris
├── hooks/          # useDueQueue
├── lib/            # logika SRS murni (srs.ts)
├── store/          # Zustand store (useProgress.ts)
├── types/          # tipe bersama
└── index.css       # tema Tailwind v4
```

## 💾 Data lokal

- `kana-progress-v1` — progress (box, XP, streak, riwayat).
- `kana-onboarded-v1` — flag sudah pernah lihat halaman awal.

Tidak ada backend; semua data di perangkat kamu sendiri.

## 📄 Lisensi

MIT
