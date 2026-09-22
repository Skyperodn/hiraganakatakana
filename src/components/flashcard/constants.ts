export const FLIP_DURATION = 0.6
export const FLIP_EASE = [0.4, 0, 0.2, 1] as const
/** Inline easing value accepted by framer-motion (tuple of cubic-bezier points). */
export const FLIP_TRANSITION = { duration: FLIP_DURATION, ease: FLIP_EASE }
