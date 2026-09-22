import type { KanaItem } from '../../types'

/**
 * KATAKANA — BASE (46)
 * The 46 basic katakana characters in gojūon order.
 */
export const KATAKANA: KanaItem[] = [
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
]
