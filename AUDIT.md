# 🔍 Laporan Audit UI/UX & Alur — Kana Master

**Tanggal:** 2026-09-22  
**Metode:** 10 subagent paralel × 1 sudut pandang + 10 screenshot live (desktop/mobile, light/dark) + full source read.  
**Scope:** Information architecture, visual design, quiz UX, dashboard, accessibility (WCAG 2.2 AA), mobile, motion, gamifikasi, onboarding, edge cases.

## Verdict besar
Fondasi teknis solid (SRS jalan, guard bug, empty-state ada, build hijau), tapi UI masih terasa "kumpulan layar" bukan satu sistem: onboarding hilang, beberapa fitur spec jadi dead code/bug, dan ada bug fungsional (XP 2×). Risiko bounce hari-1 tinggi.

## 🔴 P0 — Wajib fix

1. **Mnemonic bocor SEBELUM user jawab** — `QuizEngine.tsx:528,323` — kartu baru langsung tampilkan `{kana} · {romaji} — mnemonic` → mode kana→romaji/audio kasih jawaban gratis, active recall rusak. → Reveal hanya setelah attempt.
2. **XP dobel hitung** — `useProgress.ts:93` (grade +10/+2) + `QuizEngine.tsx:430` (addXp lagi) + `MatchingGame.tsx:217` → XP sesi ≠ delta Total XP. → Hapus addXp duplikat.
3. **Mode audio bisa mustahil & senyap** — `QuizEngine.tsx:202-213,394-401` — tanpa cek voice ja-JP, catch kosong, autoplay diblokir iOS → soal 4 pilihan tanpa suara. → Deteksi voice; drop mode bila unavailable; copy kontekstual; cancel on cleanup.
4. **Landing "Mulai dari nol / Placement Test" tidak ada** — `App.tsx:29` — spec flow tidak diimplementasi; user langsung disodori dashboard angka-0 + 14 ring kosong. → First-run welcome screen.
5. **Keluar sesi mid-way: hasil hilang, streak tetap naik** — `App.tsx:72,143-148` — `registerStudyToday()` dipanggil saat mulai sesi; "← Kembali" tanpa konfirmasi buang hasil. → Konfirmasi exit + pindah registerStudyToday ke jawaban pertama.
6. **Flashcard 3D flip (fitur spec) mati total** — komponen ~230 baris + 4 CSS helper nol import; spec "flip pas submit jawaban" tidak ada di runtime. → Wire ke QuizEngine sebagai answer-reveal.
7. **Badge baris kelar = dead code** — `useProgress.ts:164` `markRowCompleted()` tidak pernah dipanggil → `completedRows` selalu `[]`, ✅/⭐ & konfeti milestone mustahil. → Panggil dari `grade()`.
8. **Kontras gagal WCAG AA** — `slate-400` (~3:1) sebagai teks normal (QuizEngine:638, ProgressDashboard:374,453, MatchingGame:338,441, App:217); RowSelector:191 teks `color-mix(..., black)` di dark mode nyaris tak terbaca. → slate-500/600; teks netral adaptif dark.
9. **Matching: feedback hanya warna + getar** — `MatchingGame.tsx:99-127` tanpa `aria-live`, progress tanpa `role="progressbar"` → SR & buta-warna tidak dapat status. → Live region + progressbar ARIA.

## 🟠 P1 — Penting (ringkas, top temuan)

**Alur & onboarding**
- Placement loncat 1/12 tanpa intro; "Uji Penempatan" tidak dijelaskan efeknya.
- Setelah placement, "Mulai Belajar" balik ke dashboard — momentum hilang, familiarIds diabaikan.
- Browser back/refresh = sesi hilang; label back beda-beda ("Lewati" vs "← Kembali" vs "Kembali").
- Matching susah ditemukan; "Sesi Lagi" dari summary matching menjalankan QuizEngine.

**Quiz loop**
- Skor "Benar 6/6" penyebut salah (answered bukan total); "0/0" di awal membingungkan.
- Progress bar mentok 9/10 di kartu terakhir + bar aksen atas selalu penuh (dua bar bersaing).
- Distractor dari seluruh 208 kana → bocor baris terkunci; confusable sebaris (し/つ) lebih berguna.
- "Lanjut" wajib tiap kartu = 10 tap/sesi; tanpa opsi auto-advance saat benar.
- Type mode: alternatif Hepburn (si/tu/hu) diterima diam-diam; feedback salah sering menampilkan prompt itu sendiri.

**Dashboard & visual**
- CTA "Mulai Sesi" tenggelam di wall-of-zeros; 14 ring 0% = wall of failure.
- Info baris diduplikasi 3× (ring grid + RowSelector pill + footer stat); unlock rule ambigu.
- Dua toggle dark mode dalam 1 viewport; primary button 3 gaya (solid/gradient/flat).
- Emoji 🔒✅🌙 vs SVG campur untuk semantik sama.

**Mobile**
- Type mode: keyboard menutupi input/Periksa; tanpa viewport-fit=cover + safe-area.
- Summary CTA & matching tombol Kembali terkubur di bawah scroll panjang.

**Gamifikasi & robustness**
- Konfeti hanya di akurasi ≥90%; unlock baris senyap; internal SessionSummary confetti mati (variant show vs burst mismatch) — 2 sistem, 1 rusak.
- Streak putus hilang senyap; summary tanpa nudge "besok N kartu due".
- Harga salah (Box 5→1) tidak terasa di feedback; "0/208" di hari-1 demotivating.
- Persist korup → rehydrate gagal diam-diam; `resetProgress()` tidak ada tombolnya di UI.
- Backlog due tanpa cap (cap 10 hanya kartu baru) → sesi maraton 100+ soal.

## 🟡 P2 — Polish (ringkas)
- Motion tanpa token: 10+ durasi & 11 spring beda per komponen; `.animate-shake` CSS dead code; feedback salah hampir tanak gerak.
- Kasing label campur Title Case/sentence/ALL-CAPS; footer jargon Inggris.
- Shortcut 1-4/Enter tidak didokumentasikan; `lang="ja"` hanya di Placement.
- `focusRow` tidak di-reset saat back → matching pakai row basi + silent fallback.
- `advancingRef` finish-path tidak release lock (aman karena unmount, tapi rapuh).

## 📋 Urutan fix
1. Bug fungsional: XP dobel, markRowCompleted, confetti duplikat.
2. Integritas belajar: mnemonic after attempt, audio fallback, distractor baris aktif.
3. Day-1 flow: landing + intro placement + konfirmasi exit + registerStudyToday di jawaban pertama.
4. A11y/visual cepat: kontras, aria-live matching, 1 toggle dark, 1 gaya primary.
5. Polish: motion token, skor denominator, auto-advance, reset button + rehydrate toast, safe-area, duplikasi progress.

## Status batch 1–2 (eksekusi 2026-09-22) — ✅ SEMUA SELESAI & TERVERIFIKASI
- [x] XP dobel dihapus (QuizEngine, MatchingGame) — verif: +10/benar, +2/salah (bukan dobel)
- [x] markRowCompleted dipanggil dari grade()
- [x] Confetti internal SessionSummary dihapus (single system via App)
- [x] Mnemonic reveal setelah attempt — verif: pre-answer tanpa mnemonic, post-answer flip tampil
- [x] Audio fallback + voice ja-JP detection — mode audio di-drop dari rotasi bila voice ja absen
- [x] Distractor hanya baris unlocked, prefer baris sama
- [x] Flashcard di-wire sebagai answer-reveal + aria-hidden per-face (SR no-leak, terverifikasi a11y tree)
- [x] Landing first-run + konfirmasi exit sesi + registerStudyToday di jawaban pertama — verif: confirm message OK
- [x] Kontras slate-400→500 + RowSelector dark text + Matching aria-live/progressbar — verif: DOM attrs OK
- [x] Placement intro (12 soal · ±1 menit) + touch target min-h-20 + focus ke Lanjut
- [x] viewport-fit=cover/safe-area + reduced-motion shake
- [x] Bonus: badge "Kartu baru" di-fix (StrictMode double-mount), ensureReview dipindah ke submit (abandoned session tidak bikin kartu due palsu)

**Verifikasi:** `tsc -b` hijau · `npm run build` hijau · browser smoke test (landing → dashboard → placement intro → sesi flip/mnemonic/XP → exit confirm → matching ARIA).

## Status batch 3–5 (eksekusi 2026-09-22, 2 subagent) — ✅ SELESAI & TERVERIFIKASI

**Agent A — QuizEngine + SessionSummary:**
- [x] Skor `Benar X · Salah Y` (tanpa "0/0") — verif browser
- [x] Single progress bar, 100% di kartu terakhir, decorative bar dihapus, ARIA sinkron
- [x] `lang="ja"` pada glyph/opsi kana (bukan romaji)
- [x] Hint keyboard "Tekan 1–4 · Enter" (desktop) — verif: tampil di 1440px
- [x] Auto-advance 1000ms saat **benar** saja; salah tetap manual — verif: benar→lanjut otomatis, salah→tetap di Layar
- [x] Type mode: "Diterima: shi / si" saat salah + "(si juga oke)" saat alternatif
- [x] Delta box di feedback: "Box 1 → 2" / "Box n → 1" — verif
- [x] Summary nudge "Besok ada N kartu jatuh tempo…" — verif: "7 kartu"
- [x] "Sesi Lagi" solid indigo-600, "Kembali" outline slate; formula XP disembunyikan

**Agent B — App + store + dashboard + RowSelector + dueQueue:**
- [x] Placement "Mulai Belajar" → langsung sesi (kartu salah jadi due duluan) — verif: Kartu 1/3
- [x] Streak banner (putus amber / belum latihan hari ini)
- [x] Rehydrate error flag + toast "Mengerti" (di luar partialize)
- [x] Tombol "Reset progress" + confirm keras di footer dashboard
- [x] Primary button diseragamkan indigo-600 (CTA + Matching)
- [x] Due pill copy "N kartu"
- [x] RowSelector navigation-only (fraction chip dihapus; ring = satu sumber angka)
- [x] `pickSessionQueue` cap due 30/sesi, sort paling overdue dulu

**Verifikasi batch 3–5:** `tsc -b` exit 0 · `npm run build` hijau · browser: skor/progress/hint/auto-advance/delta box/nudge/buttons/placement→sesi semua OK. Lint: hanya warning pola lama (set-state-in-effect), tanpa error.

**Sisa P2 (belum dikerjakan):** motion token global, duplikasi info baris di footer dashboard, jargon Inggris footer, casing label, browser History API untuk back, dialog focus-trap matching, auto-advance sebagai toggle pengaturan.
