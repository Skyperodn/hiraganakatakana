export interface StreakBadgeProps {
  streak: number
  longest?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export type Size = NonNullable<StreakBadgeProps['size']>

export interface SizeConfig {
  pill: string
  flame: string
  count: string
  unit: string
  best: string
}

export interface Intensity {
  label: string
  pillClass: string
  flameOpacity: number
  showFlame: boolean
  pulsing: boolean
}
