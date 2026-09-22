import type { KanaItem } from '../../types'

/**
 * HIRAGANA — BASE (46)
 * The 46 basic hiragana characters in gojūon order.
 */
export const HIRAGANA: KanaItem[] = [
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
]
