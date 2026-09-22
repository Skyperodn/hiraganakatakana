import type { Variants } from 'framer-motion'

export const mountVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 520, damping: 18, mass: 0.7 },
  },
}

export const pulsingFlameVariants: Variants = {
  rest: { scale: 1, rotate: 0, filter: 'brightness(1)' },
  pulse: {
    scale: [1, 1.16, 1],
    rotate: [0, -4, 3, 0],
    filter: ['brightness(1)', 'brightness(1.25)', 'brightness(1)'],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: 'easeInOut',
      times: [0, 0.5, 1],
    },
  },
}
