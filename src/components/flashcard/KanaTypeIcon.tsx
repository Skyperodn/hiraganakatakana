import type { KanaType } from '../../types'

interface KanaTypeIconProps {
  /** Which script this icon represents. */
  type: KanaType
  /** Size class (e.g. "h-5 w-5"). Defaults to "h-5 w-5". */
  className?: string
  /** Optional title for accessibility; omit for decorative use. */
  title?: string
}

/**
 * Minimal, precise emblem distinguishing the two kana scripts:
 * - **hiragana** → the flowing glyph あ on a rounded (soft) plate
 * - **katakana** → the angular glyph ア on a sharp-cornered plate
 *
 * Rendered as inline SVG so it stays crisp at any size and inherits `currentColor`.
 */
export default function KanaTypeIcon({ type, className, title }: KanaTypeIconProps) {
  const isHira = type === 'hiragana'
  const glyph = isHira ? 'あ' : 'ア'
  const radius = isHira ? 7 : 2.5

  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? 'h-5 w-5'}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {/* Plate: soft-rounded for hiragana, sharp for katakana */}
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.65"
      />
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Noto Sans JP','Hiragino Sans','Yu Gothic',sans-serif"
        fontSize="12"
        fontWeight="700"
        fill="currentColor"
      >
        {glyph}
      </text>
    </svg>
  )
}

export type { KanaTypeIconProps }
