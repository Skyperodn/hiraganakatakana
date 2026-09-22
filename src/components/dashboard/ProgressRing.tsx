import { clamp01 } from './utils'
import type { CircularProgressRingProps } from './types'

/** Inline SVG progress ring with a smooth dash-offset transition. */
export default function CircularProgressRing({
  size,
  stroke,
  progress,
  color,
  lightRim = false,
  children,
}: CircularProgressRingProps): React.JSX.Element {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = clamp01(progress)
  const offset = circumference * (1 - pct)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)',
            filter: lightRim ? 'drop-shadow(0 0 1.5px rgba(15, 23, 42, 0.55))' : undefined,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}
