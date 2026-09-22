import type { KanaItem } from '../types'

/**
 * Complete kana dataset.
 *  - 46 basic hiragana + 46 basic katakana
 *  - Dakuten (g/z/d/b families) hiragana + katakana
 *  - Handakuten (p family) hiragana + katakana
 *  - Combined yōon (kya..pyo) hiragana + katakana (small ゃゅょ / ャュョ)
 *
 * Sounds that DO NOT exist and are therefore intentionally skipped:
 *   yi, wu, ye, wi, we (no kana), plus non-combined yōon like "yi/ye"
 *   and the obsolete ゐ/ゑ/を-as-wy variants.
 */
export const KANA_DATA: KanaItem[] = [
  // ============================================================
  // HIRAGANA — BASE (46)
  // ============================================================
  { id: 'hira-a', character: 'あ', romaji: 'a', type: 'hiragana', row: 'a', variant: 'base', mnemonic: 'Seperti huruf "A" yang miring sambil mengangguk — sebuah kepala dengan topi aneh, dibaca "a".' },
  { id: 'hira-i', character: 'い', romaji: 'i', type: 'hiragana', row: 'a', variant: 'base', mnemonic: 'Dua goresan tegak seperti dua batang bambu kurus berdiri, bunyinya "i".' },
  { id: 'hira-u', character: 'う', romaji: 'u', type: 'hiragana', row: 'a', variant: 'base', mnemonic: 'Sebuah topi kecil di atas lengkungan seperti orang membungkuk sambil bilang "u (uu)".' },
  { id: 'hira-e', character: 'え', romaji: 'e', type: 'hiragana', row: 'a', variant: 'base', mnemonic: 'Lengkungan dengan "kaki" seperti penari energik bergaya, terdengar "e".' },
  { id: 'hira-o', character: 'お', romaji: 'o', type: 'hiragana', row: 'a', variant: 'base', mnemonic: 'Seperti angka yang menari dengan satu titik kecil di samping — mulut membentuk "o" bulat.' },

  { id: 'hira-ka', character: 'か', romaji: 'ka', type: 'hiragana', row: 'ka', variant: 'base', mnemonic: 'Goresan bertanduk seperti kunci yang menghadap kanan, dibaca "ka".' },
  { id: 'hira-ki', character: 'き', romaji: 'ki', type: 'hiragana', row: 'ka', variant: 'base', mnemonic: 'Seperti sebatang kunci (key) dengan dua garis pemotong, bunyinya "ki".' },
  { id: 'hira-ku', character: 'く', romaji: 'ku', type: 'hiragana', row: 'ka', variant: 'base', mnemonic: 'Sudut melengkung seperti paruh burung yang terbuka — burung berkicau "ku".' },
  { id: 'hira-ke', character: 'け', romaji: 'ke', type: 'hiragana', row: 'ka', variant: 'base', mnemonic: 'Batang tegak dengan dua goresan menyilang, seperti cakar/kail, dibaca "ke".' },
  { id: 'hira-ko', character: 'こ', romaji: 'ko', type: 'hiragana', row: 'ka', variant: 'base', mnemonic: 'Dua garis melengkung pendek seperti dua kumis kucing, bunyinya "ko".' },

  { id: 'hira-sa', character: 'さ', romaji: 'sa', type: 'hiragana', row: 'sa', variant: 'base', mnemonic: 'Seperti petai/pojok yang miring — bayangkan sandal terjatuh, dibaca "sa".' },
  { id: 'hira-shi', character: 'し', romaji: 'shi', type: 'hiragana', row: 'sa', variant: 'base', mnemonic: 'Sebuah lengkungan kurva tunggal seperti kail/gantungan, bunyinya "shi".' },
  { id: 'hira-su', character: 'す', romaji: 'su', type: 'hiragana', row: 'sa', variant: 'base', mnemonic: 'Batang dengan lengkungan dan simpul seperti angka 5 dengan ekor, dibaca "su".' },
  { id: 'hira-se', character: 'せ', romaji: 'se', type: 'hiragana', row: 'sa', variant: 'base', mnemonic: 'Seperti huruf "S" dengan batang tegak di tengahnya, bunyinya "se".' },
  { id: 'hira-so', character: 'そ', romaji: 'so', type: 'hiragana', row: 'sa', variant: 'base', mnemonic: 'Seperti zebra — garis atas dengan zigzag di bawah, dibaca "so".' },

  { id: 'hira-ta', character: 'た', romaji: 'ta', type: 'hiragana', row: 'ta', variant: 'base', mnemonic: 'Bentuk seperti orang naik perahu (ta-san) dengan dayung kecil di kanan, bunyinya "ta".' },
  { id: 'hira-chi', character: 'ち', romaji: 'chi', type: 'hiragana', row: 'ta', variant: 'base', mnemonic: 'Seperti angka 5 terbalik dengan batang di bawah seperti kaki, dibaca "chi".' },
  { id: 'hira-tsu', character: 'つ', romaji: 'tsu', type: 'hiragana', row: 'ta', variant: 'base', mnemonic: 'Lengkungan besar seperti gelombang atau sepatu boot, bunyinya "tsu".' },
  { id: 'hira-te', character: 'て', romaji: 'te', type: 'hiragana', row: 'ta', variant: 'base', mnemonic: 'Seperti mulut burung bangau yang memanjang ke atas, dibaca "te".' },
  { id: 'hira-to', character: 'と', romaji: 'to', type: 'hiragana', row: 'ta', variant: 'base', mnemonic: 'Seperti duri/taji dengan ekor panjang melengkung ke kiri, bunyinya "to".' },

  { id: 'hira-na', character: 'な', romaji: 'na', type: 'hiragana', row: 'na', variant: 'base', mnemonic: 'Seperti angka 7 dengan sebuah simpul kecil di samping, dibaca "na".' },
  { id: 'hira-ni', character: 'に', romaji: 'ni', type: 'hiragana', row: 'na', variant: 'base', mnemonic: 'Seperti dua garis mendatar di atas batang melengkung — "ni" = dua (?) gaya, bunyinya "ni".' },
  { id: 'hira-nu', character: 'ぬ', romaji: 'nu', type: 'hiragana', row: 'na', variant: 'base', mnemonic: 'Simpul rumit seperti mie terurai — "nu" seperti suara mengunyah, dibaca "nu".' },
  { id: 'hira-ne', character: 'ね', romaji: 'ne', type: 'hiragana', row: 'na', variant: 'base', mnemonic: 'Seperti mie berputar dengan ekor melingkar, bentuk "ne" yang berkelok, bunyinya "ne".' },
  { id: 'hira-no', character: 'の', romaji: 'no', type: 'hiragana', row: 'na', variant: 'base', mnemonic: 'Spiral melingkar seperti huruf "no" digambar terbalik, bunyinya "no".' },

  { id: 'hira-ha', character: 'は', romaji: 'ha', type: 'hiragana', row: 'ha', variant: 'base', mnemonic: 'Batang tegak dengan dua garis kecil seperti orang menulis "ha ha" — bunyinya "ha".' },
  { id: 'hira-hi', character: 'ひ', romaji: 'hi', type: 'hiragana', row: 'ha', variant: 'base', mnemonic: 'Lengkungan lebar seperti mulut tersenyum lebar, orang tertawa "hi hi", dibaca "hi".' },
  { id: 'hira-fu', character: 'ふ', romaji: 'fu', type: 'hiragana', row: 'ha', variant: 'base', mnemonic: 'Seperti gunung kecil dengan anting di kedua sisi — angin bertiup "fu", bunyinya "fu".' },
  { id: 'hira-he', character: 'へ', romaji: 'he', type: 'hiragana', row: 'ha', variant: 'base', mnemonic: 'Sederhana! Hanya gunung/tenda miring satu goresan, dibaca "he".' },
  { id: 'hira-ho', character: 'ほ', romaji: 'ho', type: 'hiragana', row: 'ha', variant: 'base', mnemonic: 'Seperti は dengan batang tambahan di atas, seperti tiang bendera, bunyinya "ho".' },

  { id: 'hira-ma', character: 'ま', romaji: 'ma', type: 'hiragana', row: 'ma', variant: 'base', mnemonic: 'Batang dengan dua garis mendatar seperti mata (ma-tha) di atas kail, bunyinya "ma".' },
  { id: 'hira-mi', character: 'み', romaji: 'mi', type: 'hiragana', row: 'ma', variant: 'base', mnemonic: 'Seperti angka 3 dengan garis miring menembus — "mi" seperti suara kucing, dibaca "mi".' },
  { id: 'hira-mu', character: 'む', romaji: 'mu', type: 'hiragana', row: 'ma', variant: 'base', mnemonic: 'Seperti sapi melenguh "muu" — ada tanduk kecil dan ekor melingkar, bunyinya "mu".' },
  { id: 'hira-me', character: 'め', romaji: 'me', type: 'hiragana', row: 'ma', variant: 'base', mnemonic: 'Simpul melingkar seperti mata (me) yang sipit sebelah, dibaca "me".' },
  { id: 'hira-mo', character: 'も', romaji: 'mo', type: 'hiragana', row: 'ma', variant: 'base', mnemonic: 'Seperti kail dengan dua garis mendatar bertumpuk seperti baling-baling, bunyinya "mo".' },

  { id: 'hira-ya', character: 'や', romaji: 'ya', type: 'hiragana', row: 'ya', variant: 'base', mnemonic: 'Seperti huruf "Y" dengan ekor melengkung di kanan — "ya!" pekikan, dibaca "ya".' },
  { id: 'hira-yu', character: 'ゆ', romaji: 'yu', type: 'hiragana', row: 'ya', variant: 'base', mnemonic: 'Loop melingkar dengan batang menembus seperti jarum dan benang, bunyinya "yu".' },
  { id: 'hira-yo', character: 'よ', romaji: 'yo', type: 'hiragana', row: 'ya', variant: 'base', mnemonic: 'Seperti kail dengan palang mendatar melintang — seperti angka "yo", dibaca "yo".' },

  { id: 'hira-ra', character: 'ら', romaji: 'ra', type: 'hiragana', row: 'ra', variant: 'base', mnemonic: 'Titik kecil di atas batang melengkung seperti orang menunduk, bunyinya "ra".' },
  { id: 'hira-ri', character: 'り', romaji: 'ri', type: 'hiragana', row: 'ra', variant: 'base', mnemonic: 'Dua goresan seperti sungai mengalir — "ri" seperti sungai kecil, dibaca "ri".' },
  { id: 'hira-ru', character: 'る', romaji: 'ru', type: 'hiragana', row: 'ra', variant: 'base', mnemonic: 'Lengkungan dengan simpul di ujung seperti angka 3 berpilin, bunyinya "ru".' },
  { id: 'hira-re', character: 'れ', romaji: 're', type: 'hiragana', row: 'ra', variant: 'base', mnemonic: 'Seperti kail berkelok dengan ekor melengkung — "re" seperti jalan berkelok, dibaca "re".' },
  { id: 'hira-ro', character: 'ろ', romaji: 'ro', type: 'hiragana', row: 'ra', variant: 'base', mnemonic: 'Seperti angka 3 tanpa simpul penutup, licin melengkung — bunyinya "ro".' },

  { id: 'hira-wa', character: 'わ', romaji: 'wa', type: 'hiragana', row: 'wa', variant: 'base', mnemonic: 'Seperti ね tanpa simpul, orang melambai tangan "wa~", dibaca "wa".' },
  { id: 'hira-wo', character: 'を', romaji: 'wo', type: 'hiragana', row: 'wa', variant: 'base', mnemonic: 'Seperti orang menendang (o) — lengkungan dengan goresan silang, bunyinya "o/wo".' },
  { id: 'hira-n', character: 'ん', romaji: 'n', type: 'hiragana', row: 'n', variant: 'base', mnemonic: 'Goresan tunggal melengkung seperti gelombang — suara sengau "n" di akhir kata.' },

  // ============================================================
  // KATAKANA — BASE (46)
  // ============================================================
  { id: 'kata-a', character: 'ア', romaji: 'a', type: 'katakana', row: 'a', variant: 'base', mnemonic: 'Berbentuk bersudut seperti huruf "A" bergaya kaku, dibaca "a".' },
  { id: 'kata-i', character: 'イ', romaji: 'i', type: 'katakana', row: 'a', variant: 'base', mnemonic: 'Dua garis tajam membentuk sudut seperti huruf "i" tegas, bunyinya "i".' },
  { id: 'kata-u', character: 'ウ', romaji: 'u', type: 'katakana', row: 'a', variant: 'base', mnemonic: 'Seperti topi kokoh bersudut dengan atap tajam, bunyinya "u".' },
  { id: 'kata-e', character: 'エ', romaji: 'e', type: 'katakana', row: 'a', variant: 'base', mnemonic: 'Seperti huruf "E" atau bentuk I-beam baja bersudut, dibaca "e".' },
  { id: 'kata-o', character: 'オ', romaji: 'o', type: 'katakana', row: 'a', variant: 'base', mnemonic: 'Seperti kerangka layang-layang kotak yang tajam, bunyinya "o".' },

  { id: 'kata-ka', character: 'カ', romaji: 'ka', type: 'katakana', row: 'ka', variant: 'base', mnemonic: 'Seperti huruf "K" patah bersudut — pisau penebas, dibaca "ka".' },
  { id: 'kata-ki', character: 'キ', romaji: 'ki', type: 'katakana', row: 'ka', variant: 'base', mnemonic: 'Seperti kunci (key) yang bersudut dengan dua garis pemotong, bunyinya "ki".' },
  { id: 'kata-ku', character: 'ク', romaji: 'ku', type: 'katakana', row: 'ka', variant: 'base', mnemonic: 'Seperti paruh burung yang tajam bersudut, burung berkicau "ku".' },
  { id: 'kata-ke', character: 'ケ', romaji: 'ke', type: 'katakana', row: 'ka', variant: 'base', mnemonic: 'Seperti huruf "K" bersudut tanpa batang penuh, bunyinya "ke".' },
  { id: 'kata-ko', character: 'コ', romaji: 'ko', type: 'katakana', row: 'ka', variant: 'base', mnemonic: 'Dua garis siku membentuk sudut kanan seperti rangka kotak, dibaca "ko".' },

  { id: 'kata-sa', character: 'サ', romaji: 'sa', type: 'katakana', row: 'sa', variant: 'base', mnemonic: 'Seperti palang dengan dua garis kecil bersudut, seperti sandal keras, bunyinya "sa".' },
  { id: 'kata-shi', character: 'シ', romaji: 'shi', type: 'katakana', row: 'sa', variant: 'base', mnemonic: 'Tiga garis miring bersudut seperti cipratan air (shi-rp), dibaca "shi".' },
  { id: 'kata-su', character: 'ス', romaji: 'su', type: 'katakana', row: 'sa', variant: 'base', mnemonic: 'Seperti garis patah tajam seperti skateboard menyudut, bunyinya "su".' },
  { id: 'kata-se', character: 'セ', romaji: 'se', type: 'katakana', row: 'sa', variant: 'base', mnemonic: 'Seperti huruf "S" bersudut kaku dengan batang melintang, dibaca "se".' },
  { id: 'kata-so', character: 'ソ', romaji: 'so', type: 'katakana', row: 'sa', variant: 'base', mnemonic: 'Dua garis tajam miring seperti perahu layar terbelah, bunyinya "so".' },

  { id: 'kata-ta', character: 'タ', romaji: 'ta', type: 'katakana', row: 'ta', variant: 'base', mnemonic: 'Seperti angka kursif bersudut seperti orang bersandar, dibaca "ta".' },
  { id: 'kata-chi', character: 'チ', romaji: 'chi', type: 'katakana', row: 'ta', variant: 'base', mnemonic: 'Seperti huruf "chi" bersudut dengan palang di atas seperti centang, bunyinya "chi".' },
  { id: 'kata-tsu', character: 'ツ', romaji: 'tsu', type: 'katakana', row: 'ta', variant: 'base', mnemonic: 'Tiga garis tegak bersudut seperti tetesan/tsu-nami, dibaca "tsu".' },
  { id: 'kata-te', character: 'テ', romaji: 'te', type: 'katakana', row: 'ta', variant: 'base', mnemonic: 'Seperti huruf "T" bersudut tajam, bunyinya "te".' },
  { id: 'kata-to', character: 'ト', romaji: 'to', type: 'katakana', row: 'ta', variant: 'base', mnemonic: 'Seperti tanda centang/kait bersudut tegak, dibaca "to".' },

  { id: 'kata-na', character: 'ナ', romaji: 'na', type: 'katakana', row: 'na', variant: 'base', mnemonic: 'Seperti salib bersudut seperti pisau bermata satu, bunyinya "na".' },
  { id: 'kata-ni', character: 'ニ', romaji: 'ni', type: 'katakana', row: 'na', variant: 'base', mnemonic: 'Dua garis mendatar sejajar bersudut — mudah diingat "ni = 2", dibaca "ni".' },
  { id: 'kata-nu', character: 'ヌ', romaji: 'nu', type: 'katakana', row: 'na', variant: 'base', mnemonic: 'Seperti huruf "X" bersudut dengan ekor patah, bunyinya "nu".' },
  { id: 'kata-ne', character: 'ネ', romaji: 'ne', type: 'katakana', row: 'na', variant: 'base', mnemonic: 'Seperti pohon bersudut dengan palang dan akar melintang, dibaca "ne".' },
  { id: 'kata-no', character: 'ノ', romaji: 'no', type: 'katakana', row: 'na', variant: 'base', mnemonic: 'Satu goresan miring tajam seperti pedang melancip, bunyinya "no".' },

  { id: 'kata-ha', character: 'ハ', romaji: 'ha', type: 'katakana', row: 'ha', variant: 'base', mnemonic: 'Dua garis miring bersudut seperti kaki melebar — orang tertawa "ha ha", dibaca "ha".' },
  { id: 'kata-hi', character: 'ヒ', romaji: 'hi', type: 'katakana', row: 'ha', variant: 'base', mnemonic: 'Seperti huruf "U" bersudut dengan ekor melengkung lurus, bunyinya "hi".' },
  { id: 'kata-fu', character: 'フ', romaji: 'fu', type: 'katakana', row: 'ha', variant: 'base', mnemonic: 'Satu goresan patah seperti angsa/angin bertiup, dibaca "fu".' },
  { id: 'kata-he', character: 'ヘ', romaji: 'he', type: 'katakana', row: 'ha', variant: 'base', mnemonic: 'Sama seperti hiragana へ — gunung miring satu goresan, bunyinya "he".' },
  { id: 'kata-ho', character: 'ホ', romaji: 'ho', type: 'katakana', row: 'ha', variant: 'base', mnemonic: 'Seperti pohon bersudut dengan dua akar dan batang tegak, dibaca "ho".' },

  { id: 'kata-ma', character: 'マ', romaji: 'ma', type: 'katakana', row: 'ma', variant: 'base', mnemonic: 'Seperti kait bersudut tajam seperti gunting terbuka, bunyinya "ma".' },
  { id: 'kata-mi', character: 'ミ', romaji: 'mi', type: 'katakana', row: 'ma', variant: 'base', mnemonic: 'Tiga garis miring bertumpuk bersudut — "mi" tiga kali, dibaca "mi".' },
  { id: 'kata-mu', character: 'ム', romaji: 'mu', type: 'katakana', row: 'ma', variant: 'base', mnemonic: 'Seperti segitiga bersudut dengan kait kecil — sapi melenguh "muu", bunyinya "mu".' },
  { id: 'kata-me', character: 'メ', romaji: 'me', type: 'katakana', row: 'ma', variant: 'base', mnemonic: 'Dua garis bersilang tajam seperti tanda silang mata, dibaca "me".' },
  { id: 'kata-mo', character: 'モ', romaji: 'mo', type: 'katakana', row: 'ma', variant: 'base', mnemonic: 'Seperti baling-baling bersudut dengan kait di atas, bunyinya "mo".' },

  { id: 'kata-ya', character: 'ヤ', romaji: 'ya', type: 'katakana', row: 'ya', variant: 'base', mnemonic: 'Seperti huruf "Y" bersudut tajam dengan palang miring, dibaca "ya".' },
  { id: 'kata-yu', character: 'ユ', romaji: 'yu', type: 'katakana', row: 'ya', variant: 'base', mnemonic: 'Seperti huruf "U" bersudut dengan garis tegak di kiri, bunyinya "yu".' },
  { id: 'kata-yo', character: 'ヨ', romaji: 'yo', type: 'katakana', row: 'ya', variant: 'base', mnemonic: 'Seperti huruf "E" terbalik bersudut siku, dibaca "yo".' },

  { id: 'kata-ra', character: 'ラ', romaji: 'ra', type: 'katakana', row: 'ra', variant: 'base', mnemonic: 'Seperti angka bersudut dengan atap kecil di atas, bunyinya "ra".' },
  { id: 'kata-ri', character: 'リ', romaji: 'ri', type: 'katakana', row: 'ra', variant: 'base', mnemonic: 'Dua garis tegak bersudut dengan ujung melengkung, dibaca "ri".' },
  { id: 'kata-ru', character: 'ル', romaji: 'ru', type: 'katakana', row: 'ra', variant: 'base', mnemonic: 'Seperti kaki bersudut dengan kait di kanan seperti orang berjalan, bunyinya "ru".' },
  { id: 'kata-re', character: 'レ', romaji: 're', type: 'katakana', row: 'ra', variant: 'base', mnemonic: 'Satu goresan patah bersudut seperti huruf "L" terjungkir, dibaca "re".' },
  { id: 'kata-ro', character: 'ロ', romaji: 'ro', type: 'katakana', row: 'ra', variant: 'base', mnemonic: 'Persegi empat bersudut seperti mulut kotak — mulut membentuk "ro", bunyinya "ro".' },

  { id: 'kata-wa', character: 'ワ', romaji: 'wa', type: 'katakana', row: 'wa', variant: 'base', mnemonic: 'Seperti kait bersudut atau mangkuk tajam, orang melambai "wa~", dibaca "wa".' },
  { id: 'kata-wo', character: 'ヲ', romaji: 'wo', type: 'katakana', row: 'wa', variant: 'base', mnemonic: 'Seperti huruf "F" bersudut dengan garis palang panjang, bunyinya "o/wo".' },
  { id: 'kata-n', character: 'ン', romaji: 'n', type: 'katakana', row: 'n', variant: 'base', mnemonic: 'Dua goresan miring bersudut — perhatikan bedanya dengan ソ (so), ini "n".' },

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

  // ============================================================
  // YŌON — HIRAGANA (kya..pyo)
  // ============================================================
  { id: 'hira-kya', character: 'きゃ', romaji: 'kya', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'き + ゃ kecil menyatu seperti kunci mungil — bunyinya "kya".' },
  { id: 'hira-kyu', character: 'きゅ', romaji: 'kyu', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'き + ゅ kecil seperti kunci panjang melengkung — bunyinya "kyu".' },
  { id: 'hira-kyo', character: 'きょ', romaji: 'kyo', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'き + ょ kecil seperti kunci berkait — bunyinya "kyo".' },

  { id: 'hira-sha', character: 'しゃ', romaji: 'sha', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'し + ゃ kecil seperti kail mungil — bunyinya "sha".' },
  { id: 'hira-shu', character: 'しゅ', romaji: 'shu', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'し + ゅ kecil seperti kail melengkung — bunyinya "shu".' },
  { id: 'hira-sho', character: 'しょ', romaji: 'sho', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'し + ょ kecil seperti kail berkait — bunyinya "sho".' },

  { id: 'hira-cha', character: 'ちゃ', romaji: 'cha', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'ち + ゃ kecil seperti angka 5 mungil — bunyinya "cha".' },
  { id: 'hira-chu', character: 'ちゅ', romaji: 'chu', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'ち + ゅ kecil seperti sepatu mungil — bunyinya "chu".' },
  { id: 'hira-cho', character: 'ちょ', romaji: 'cho', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'ち + ょ kecil seperti taji mungil — bunyinya "cho".' },

  { id: 'hira-nya', character: 'にゃ', romaji: 'nya', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'に + ゃ kecil seperti dua garis mungil — bunyinya "nya".' },
  { id: 'hira-nyu', character: 'にゅ', romaji: 'nyu', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'に + ゅ kecil seperti simpul mie mungil — bunyinya "nyu".' },
  { id: 'hira-nyo', character: 'にょ', romaji: 'nyo', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'に + ょ kecil seperti kail mungil — bunyinya "nyo".' },

  { id: 'hira-hya', character: 'ひゃ', romaji: 'hya', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'ひ + ゃ kecil seperti senyum mungil — bunyinya "hya".' },
  { id: 'hira-hyu', character: 'ひゅ', romaji: 'hyu', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'ひ + ゅ kecil seperti hembusan mungil — bunyinya "hyu".' },
  { id: 'hira-hyo', character: 'ひょ', romaji: 'hyo', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'ひ + ょ kecil seperti senyum berkait — bunyinya "hyo".' },

  { id: 'hira-mya', character: 'みゃ', romaji: 'mya', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'み + ゃ kecil seperti angka 3 mungil — bunyinya "mya".' },
  { id: 'hira-myu', character: 'みゅ', romaji: 'myu', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'み + ゅ kecil seperti lengkungan mungil — bunyinya "myu".' },
  { id: 'hira-myo', character: 'みょ', romaji: 'myo', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'み + ょ kecil seperti kail mungil — bunyinya "myo".' },

  { id: 'hira-rya', character: 'りゃ', romaji: 'rya', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'り + ゃ kecil seperti sungai mungil — bunyinya "rya".' },
  { id: 'hira-ryu', character: 'りゅ', romaji: 'ryu', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'り + ゅ kecil seperti arus melengkung — bunyinya "ryu".' },
  { id: 'hira-ryo', character: 'りょ', romaji: 'ryo', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'り + ょ kecil seperti aliran berkait — bunyinya "ryo".' },

  { id: 'hira-gya', character: 'ぎゃ', romaji: 'gya', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'ぎ + ゃ kecil seperti kunci bermesin mungil — bunyinya "gya".' },
  { id: 'hira-gyu', character: 'ぎゅ', romaji: 'gyu', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'ぎ + ゅ kecil seperti mesin melengkung — bunyinya "gyu".' },
  { id: 'hira-gyo', character: 'ぎょ', romaji: 'gyo', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'ぎ + ょ kecil seperti mesin berkait — bunyinya "gyo".' },

  { id: 'hira-ja', character: 'じゃ', romaji: 'ja', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'じ + ゃ kecil seperti kail berdesir mungil — bunyinya "ja".' },
  { id: 'hira-ju', character: 'じゅ', romaji: 'ju', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'じ + ゅ kecil seperti arus berdesir — bunyinya "ju".' },
  { id: 'hira-jo', character: 'じょ', romaji: 'jo', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'じ + ょ kecil seperti kail bergetar — bunyinya "jo".' },

  { id: 'hira-bya', character: 'びゃ', romaji: 'bya', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'び + ゃ kecil seperti senyum bergetar mungil — bunyinya "bya".' },
  { id: 'hira-byu', character: 'びゅ', romaji: 'byu', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'び + ゅ kecil seperti hembusan berdengung — bunyinya "byu".' },
  { id: 'hira-byo', character: 'びょ', romaji: 'byo', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'び + ょ kecil seperti kail bergetar — bunyinya "byo".' },

  { id: 'hira-pya', character: 'ぴゃ', romaji: 'pya', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'ぴ + ゃ kecil seperti senyum meletus mungil — bunyinya "pya".' },
  { id: 'hira-pyu', character: 'ぴゅ', romaji: 'pyu', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'ぴ + ゅ kecil seperti gelembung meletup — bunyinya "pyu".' },
  { id: 'hira-pyo', character: 'ぴょ', romaji: 'pyo', type: 'hiragana', row: 'youon', variant: 'youon', mnemonic: 'ぴ + ょ kecil seperti kail meletus — bunyinya "pyo".' },

  // ============================================================
  // YŌON — KATAKANA (kya..pyo)
  // ============================================================
  { id: 'kata-kya', character: 'キャ', romaji: 'kya', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'キ + ャ kecil bersudut seperti kunci mungil — bunyinya "kya".' },
  { id: 'kata-kyu', character: 'キュ', romaji: 'kyu', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'キ + ュ kecil bersudut seperti kunci melengkung — bunyinya "kyu".' },
  { id: 'kata-kyo', character: 'キョ', romaji: 'kyo', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'キ + ョ kecil bersudut seperti kunci berkait — bunyinya "kyo".' },

  { id: 'kata-sha', character: 'シャ', romaji: 'sha', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'シ + ャ kecil bersudut seperti cipratan mungil — bunyinya "sha".' },
  { id: 'kata-shu', character: 'シュ', romaji: 'shu', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'シ + ュ kecil bersudut seperti cipratan melengkung — bunyinya "shu".' },
  { id: 'kata-sho', character: 'ショ', romaji: 'sho', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'シ + ョ kecil bersudut seperti cipratan berkait — bunyinya "sho".' },

  { id: 'kata-cha', character: 'チャ', romaji: 'cha', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'チ + ャ kecil bersudut seperti centang mungil — bunyinya "cha".' },
  { id: 'kata-chu', character: 'チュ', romaji: 'chu', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'チ + ュ kecil bersudut seperti centang melengkung — bunyinya "chu".' },
  { id: 'kata-cho', character: 'チョ', romaji: 'cho', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'チ + ョ kecil bersudut seperti centang berkait — bunyinya "cho".' },

  { id: 'kata-nya', character: 'ニャ', romaji: 'nya', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ニ + ャ kecil bersudut seperti dua garis mungil — bunyinya "nya".' },
  { id: 'kata-nyu', character: 'ニュ', romaji: 'nyu', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ニ + ュ kecil bersudut seperti dua garis melengkung — bunyinya "nyu".' },
  { id: 'kata-nyo', character: 'ニョ', romaji: 'nyo', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ニ + ョ kecil bersudut seperti dua garis berkait — bunyinya "nyo".' },

  { id: 'kata-hya', character: 'ヒャ', romaji: 'hya', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ヒ + ャ kecil bersudut seperti huruf U mungil — bunyinya "hya".' },
  { id: 'kata-hyu', character: 'ヒュ', romaji: 'hyu', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ヒ + ュ kecil bersudut seperti hembusan mungil — bunyinya "hyu".' },
  { id: 'kata-hyo', character: 'ヒョ', romaji: 'hyo', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ヒ + ョ kecil bersudut seperti huruf U berkait — bunyinya "hyo".' },

  { id: 'kata-mya', character: 'ミャ', romaji: 'mya', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ミ + ャ kecil bersudut seperti tiga garis mungil — bunyinya "mya".' },
  { id: 'kata-myu', character: 'ミュ', romaji: 'myu', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ミ + ュ kecil bersudut seperti tiga garis melengkung — bunyinya "myu".' },
  { id: 'kata-myo', character: 'ミョ', romaji: 'myo', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ミ + ョ kecil bersudut seperti tiga garis berkait — bunyinya "myo".' },

  { id: 'kata-rya', character: 'リャ', romaji: 'rya', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'リ + ャ kecil bersudut seperti dua garis mungil — bunyinya "rya".' },
  { id: 'kata-ryu', character: 'リュ', romaji: 'ryu', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'リ + ュ kecil bersudut seperti dua garis melengkung — bunyinya "ryu".' },
  { id: 'kata-ryo', character: 'リョ', romaji: 'ryo', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'リ + ョ kecil bersudut seperti dua garis berkait — bunyinya "ryo".' },

  { id: 'kata-gya', character: 'ギャ', romaji: 'gya', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ギ + ャ kecil bersudut seperti mesin mungil — bunyinya "gya".' },
  { id: 'kata-gyu', character: 'ギュ', romaji: 'gyu', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ギ + ュ kecil bersudut seperti mesin melengkung — bunyinya "gyu".' },
  { id: 'kata-gyo', character: 'ギョ', romaji: 'gyo', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ギ + ョ kecil bersudut seperti mesin berkait — bunyinya "gyo".' },

  { id: 'kata-ja', character: 'ジャ', romaji: 'ja', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ジ + ャ kecil bersudut seperti cipratan berdesir — bunyinya "ja".' },
  { id: 'kata-ju', character: 'ジュ', romaji: 'ju', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ジ + ュ kecil bersudut seperti arus berdesir — bunyinya "ju".' },
  { id: 'kata-jo', character: 'ジョ', romaji: 'jo', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ジ + ョ kecil bersudut seperti cipratan bergetar — bunyinya "jo".' },

  { id: 'kata-bya', character: 'ビャ', romaji: 'bya', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ビ + ャ kecil bersudut seperti huruf U bergetar — bunyinya "bya".' },
  { id: 'kata-byu', character: 'ビュ', romaji: 'byu', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ビ + ュ kecil bersudut seperti hembusan berdengung — bunyinya "byu".' },
  { id: 'kata-byo', character: 'ビョ', romaji: 'byo', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ビ + ョ kecil bersudut seperti huruf U bergetar — bunyinya "byo".' },

  { id: 'kata-pya', character: 'ピャ', romaji: 'pya', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ピ + ャ kecil bersudut seperti huruf U meletus — bunyinya "pya".' },
  { id: 'kata-pyu', character: 'ピュ', romaji: 'pyu', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ピ + ュ kecil bersudut seperti gelembung meletup — bunyinya "pyu".' },
  { id: 'kata-pyo', character: 'ピョ', romaji: 'pyo', type: 'katakana', row: 'youon', variant: 'youon', mnemonic: 'ピ + ョ kecil bersudut seperti huruf U meletus — bunyinya "pyo".' },
]

export const HIRAGANA: KanaItem[] = KANA_DATA.filter((k) => k.type === 'hiragana')
export const KATAKANA: KanaItem[] = KANA_DATA.filter((k) => k.type === 'katakana')

export function getKanaById(id: string): KanaItem | undefined {
  return KANA_DATA.find((k) => k.id === id)
}
