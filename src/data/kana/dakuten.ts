import type { KanaItem } from '../../types'

/**
 * DAKUTEN (g, z, d, b families) + HANDAKUTEN (p family) — HIRAGANA and KATAKANA.
 * Order preserved: dakuten-hiragana, dakuten-katakana, handakuten-hiragana, handakuten-katakana.
 */
export const DAKUTEN: KanaItem[] = [
  // ============================================================
  // DAKUTEN — HIRAGANA (g, z, d, b families)
  // ============================================================
  { id: 'hira-ga', character: 'が', romaji: 'ga', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'か dengan dua titik (dakuten) seperti mata berkilau — bunyinya mengeras jadi "ga".' },
  { id: 'hira-gi', character: 'ぎ', romaji: 'gi', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'き dengan dua titik seperti kunci bergeming bermesin, bunyinya "gi".' },
  { id: 'hira-gu', character: 'ぐ', romaji: 'gu', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'く dengan dua titik seperti paruh burung marah mengucapkan "gu".' },
  { id: 'hira-ge', character: 'げ', romaji: 'ge', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'け dengan dua titik seperti kail berat, bunyinya mengeras "ge".' },
  { id: 'hira-go', character: 'ご', romaji: 'go', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'こ dengan dua titik seperti dua kumis bergetar, bunyinya "go".' },

  { id: 'hira-za', character: 'ざ', romaji: 'za', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'さ dengan dua titik seperti sandal berdebu, bunyinya "za".' },
  { id: 'hira-ji', character: 'じ', romaji: 'ji', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'し dengan dua titik seperti kail berderit, bunyinya "ji".' },
  { id: 'hira-zu', character: 'ず', romaji: 'zu', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'す dengan dua titik seperti angka 5 berdesir, bunyinya "zu".' },
  { id: 'hira-ze', character: 'ぜ', romaji: 'ze', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'せ dengan dua titik seperti huruf S berdengung, bunyinya "ze".' },
  { id: 'hira-zo', character: 'ぞ', romaji: 'zo', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'そ dengan dua titik seperti zebra berdesis, bunyinya "zo".' },

  { id: 'hira-da', character: 'だ', romaji: 'da', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'た dengan dua titik seperti perahu berbobot, bunyinya "da".' },
  { id: 'hira-ji2', character: 'ぢ', romaji: 'ji', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ち dengan dua titik — varian "ji" langka, sama bunyi dengan じ.' },
  { id: 'hira-zu2', character: 'づ', romaji: 'zu', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'つ dengan dua titik — varian "zu" langka, sama bunyi dengan ず.' },
  { id: 'hira-de', character: 'で', romaji: 'de', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'て dengan dua titik seperti mulut bangau berdengung, bunyinya "de".' },
  { id: 'hira-do', character: 'ど', romaji: 'do', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'と dengan dua titik seperti taji bergetar, bunyinya "do".' },

  { id: 'hira-ba', character: 'ば', romaji: 'ba', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'は dengan dua titik seperti balon mengelembung, bunyinya "ba".' },
  { id: 'hira-bi', character: 'び', romaji: 'bi', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ひ dengan dua titik seperti senyum bergetar, bunyinya "bi".' },
  { id: 'hira-bu', character: 'ぶ', romaji: 'bu', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ふ dengan dua titik seperti angin mendengung, bunyinya "bu".' },
  { id: 'hira-be', character: 'べ', romaji: 'be', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'へ dengan dua titik seperti gunung bergetar, bunyinya "be".' },
  { id: 'hira-bo', character: 'ぼ', romaji: 'bo', type: 'hiragana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ほ dengan dua titik seperti tiang bendera berderak, bunyinya "bo".' },

  // ============================================================
  // DAKUTEN — KATAKANA (g, z, d, b families)
  // ============================================================
  { id: 'kata-ga', character: 'ガ', romaji: 'ga', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'カ bersudut dengan dua titik — pisau bergeming, bunyinya "ga".' },
  { id: 'kata-gi', character: 'ギ', romaji: 'gi', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'キ bersudut dengan dua titik seperti kunci bermesin, bunyinya "gi".' },
  { id: 'kata-gu', character: 'グ', romaji: 'gu', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ク bersudut dengan dua titik seperti paruh burung marah, bunyinya "gu".' },
  { id: 'kata-ge', character: 'ゲ', romaji: 'ge', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ケ bersudut dengan dua titik seperti kail keras, bunyinya "ge".' },
  { id: 'kata-go', character: 'ゴ', romaji: 'go', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'コ bersudut siku dengan dua titik seperti rangka kokoh, bunyinya "go".' },

  { id: 'kata-za', character: 'ザ', romaji: 'za', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'サ bersudut dengan dua titik seperti palang berderit, bunyinya "za".' },
  { id: 'kata-ji', character: 'ジ', romaji: 'ji', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'シ bersudut dengan dua titik seperti cipratan berdesir, bunyinya "ji".' },
  { id: 'kata-zu', character: 'ズ', romaji: 'zu', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ス bersudut dengan dua titik seperti skateboard berdengung, bunyinya "zu".' },
  { id: 'kata-ze', character: 'ゼ', romaji: 'ze', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'セ bersudut dengan dua titik seperti huruf S bergetar, bunyinya "ze".' },
  { id: 'kata-zo', character: 'ゾ', romaji: 'zo', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ソ bersudut dengan dua titik seperti layar berdesis, bunyinya "zo".' },

  { id: 'kata-da', character: 'ダ', romaji: 'da', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'タ bersudut dengan dua titik seperti orang bersandar tegap, bunyinya "da".' },
  { id: 'kata-ji2', character: 'ヂ', romaji: 'ji', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'チ bersudut dengan dua titik — varian "ji" langka, sama bunyi dengan ジ.' },
  { id: 'kata-zu2', character: 'ヅ', romaji: 'zu', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ツ bersudut dengan dua titik — varian "zu" langka, sama bunyi dengan ズ.' },
  { id: 'kata-de', character: 'デ', romaji: 'de', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'テ bersudut dengan dua titik seperti huruf T berdengung, bunyinya "de".' },
  { id: 'kata-do', character: 'ド', romaji: 'do', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ト bersudut dengan dua titik seperti centang bergetar, bunyinya "do".' },

  { id: 'kata-ba', character: 'バ', romaji: 'ba', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ハ bersudut dengan dua titik seperti kaki bergetar, bunyinya "ba".' },
  { id: 'kata-bi', character: 'ビ', romaji: 'bi', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ヒ bersudut dengan dua titik seperti huruf U berdengung, bunyinya "bi".' },
  { id: 'kata-bu', character: 'ブ', romaji: 'bu', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'フ bersudut dengan dua titik seperti angin berderak, bunyinya "bu".' },
  { id: 'kata-be', character: 'ベ', romaji: 'be', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ヘ bersudut dengan dua titik seperti gunung keras, bunyinya "be".' },
  { id: 'kata-bo', character: 'ボ', romaji: 'bo', type: 'katakana', row: 'dakuten', variant: 'dakuten', mnemonic: 'ホ bersudut dengan dua titik seperti pohon bergetar, bunyinya "bo".' },

  // ============================================================
  // HANDAKUTEN — HIRAGANA (p family)
  // ============================================================
  { id: 'hira-pa', character: 'ぱ', romaji: 'pa', type: 'hiragana', row: 'handakuten', variant: 'handakuten', mnemonic: 'は dengan lingkaran kecil (handakuten) seperti balon meletus "pa!".' },
  { id: 'hira-pi', character: 'ぴ', romaji: 'pi', type: 'hiragana', row: 'handakuten', variant: 'handakuten', mnemonic: 'ひ dengan lingkaran kecil seperti senyum mengembang, bunyinya "pi".' },
  { id: 'hira-pu', character: 'ぷ', romaji: 'pu', type: 'hiragana', row: 'handakuten', variant: 'handakuten', mnemonic: 'ふ dengan lingkaran kecil seperti gelembung angin meletus, bunyinya "pu".' },
  { id: 'hira-pe', character: 'ぺ', romaji: 'pe', type: 'hiragana', row: 'handakuten', variant: 'handakuten', mnemonic: 'へ dengan lingkaran kecil seperti gunung berasap meletup, bunyinya "pe".' },
  { id: 'hira-po', character: 'ぽ', romaji: 'po', type: 'hiragana', row: 'handakuten', variant: 'handakuten', mnemonic: 'ほ dengan lingkaran kecil seperti tiang bendera meletus, bunyinya "po".' },

  // ============================================================
  // HANDAKUTEN — KATAKANA (p family)
  // ============================================================
  { id: 'kata-pa', character: 'パ', romaji: 'pa', type: 'katakana', row: 'handakuten', variant: 'handakuten', mnemonic: 'ハ bersudut dengan lingkaran kecil seperti kaki meletus "pa!".' },
  { id: 'kata-pi', character: 'ピ', romaji: 'pi', type: 'katakana', row: 'handakuten', variant: 'handakuten', mnemonic: 'ヒ bersudut dengan lingkaran kecil seperti huruf U meletup, bunyinya "pi".' },
  { id: 'kata-pu', character: 'プ', romaji: 'pu', type: 'katakana', row: 'handakuten', variant: 'handakuten', mnemonic: 'フ bersudut dengan lingkaran kecil seperti angin meletus, bunyinya "pu".' },
  { id: 'kata-pe', character: 'ペ', romaji: 'pe', type: 'katakana', row: 'handakuten', variant: 'handakuten', mnemonic: 'ヘ bersudut dengan lingkaran kecil seperti gunung meletup, bunyinya "pe".' },
  { id: 'kata-po', character: 'ポ', romaji: 'po', type: 'katakana', row: 'handakuten', variant: 'handakuten', mnemonic: 'ホ bersudut dengan lingkaran kecil seperti pohon meletus, bunyinya "po".' },
]
