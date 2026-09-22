import type { Intensity, Size, SizeConfig } from './types'

export const SIZE_CONFIG: Record<Size, SizeConfig> = {
  sm: {
    pill: 'gap-1 px-2.5 py-0.5 text-xs',
    flame: 'text-sm',
    count: 'text-sm',
    unit: 'text-[10px]',
    best: 'text-[10px]',
  },
  md: {
    pill: 'gap-1.5 px-3.5 py-1.5 text-sm',
    flame: 'text-lg',
    count: 'text-base',
    unit: 'text-xs',
    best: 'text-xs',
  },
  lg: {
    pill: 'gap-2 px-5 py-2.5 text-base',
    flame: 'text-2xl',
    count: 'text-xl',
    unit: 'text-sm',
    best: 'text-sm',
  },
}

export function resolveIntensity(streak: number): Intensity {
  if (streak < 1) {
    return {
      label: 'Mulai streak hari ini',
      pillClass:
        'bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-300 ' +
        'dark:bg-slate-800/70 dark:text-slate-400 dark:ring-slate-700',
      flameOpacity: 0.4,
      showFlame: false,
      pulsing: false,
    }
  }
  if (streak <= 2) {
    return {
      label: 'Sedang memanas',
      pillClass:
        'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-300 ' +
        'dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
      flameOpacity: 0.85,
      showFlame: true,
      pulsing: false,
    }
  }
  if (streak <= 6) {
    return {
      label: 'Terus membara',
      pillClass:
        'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-300 ' +
        'dark:bg-orange-950/50 dark:text-orange-300 dark:ring-orange-800',
      flameOpacity: 1,
      showFlame: true,
      pulsing: false,
    }
  }
  return {
    label: 'Luar biasa',
    pillClass:
      'bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white ' +
      'ring-1 ring-inset ring-orange-300/60 shadow-lg shadow-orange-500/30 ' +
      'dark:from-orange-500 dark:via-orange-600 dark:to-amber-600 dark:ring-orange-400/40',
    flameOpacity: 1,
    showFlame: true,
    pulsing: true,
  }
}
