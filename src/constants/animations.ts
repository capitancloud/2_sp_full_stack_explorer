/**
 * Costanti per le animazioni utilizzate nell'applicazione
 */

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

export const ANIMATION_EASING = {
  easeInOut: [0.4, 0, 0.2, 1] as const,
  easeOut: 'easeOut' as const,
  easeIn: 'easeIn' as const,
} as const;

export const SPRING_CONFIG = {
  default: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  soft: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 20,
  },
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
} as const;

export const TRANSITION_DELAYS = {
  card: 0.1,
  cardDetail: 0.05,
} as const;

export const PULSE_ANIMATION = {
  duration: 2,
  scale: [1, 1.1, 1.1] as const,
  opacity: [0.6, 0, 0] as const,
} as const;
