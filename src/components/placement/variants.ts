import type { Variants } from 'framer-motion'

export const cardVariants: Variants = {
  enter: { opacity: 0, x: 48, scale: 0.96 },
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 30 },
  },
  exit: { opacity: 0, x: -48, scale: 0.96, transition: { duration: 0.18 } },
}
