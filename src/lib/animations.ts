/**
 * Framer Motion Animation Presets
 * World-class animation system inspired by Apple, Stripe, Linear
 */

import type { Transition, Variants } from 'framer-motion'

// ============================================================================
// Spring Presets
// ============================================================================

export const spring = {
  /** Smooth, natural feeling - good for most UI elements */
  smooth: { type: 'spring', damping: 20, stiffness: 100 } as const,
  /** Bouncy, playful - good for attention-grabbing elements */
  bouncy: { type: 'spring', damping: 10, stiffness: 200 } as const,
  /** Snappy, responsive - good for quick interactions */
  snappy: { type: 'spring', damping: 30, stiffness: 400 } as const,
  /** Gentle, subtle - good for delicate transitions */
  gentle: { type: 'spring', damping: 25, stiffness: 80 } as const,
  /** Slow, dramatic - good for hero elements */
  slow: { type: 'spring', damping: 30, stiffness: 50 } as const,
} satisfies Record<string, Transition>

// ============================================================================
// Easing Functions
// ============================================================================

export const easing = {
  /** Apple-style ease out */
  easeOutExpo: [0.19, 1, 0.22, 1] as const,
  /** Smooth ease in-out */
  easeInOutCubic: [0.65, 0, 0.35, 1] as const,
  /** Anticipation effect */
  easeOutBack: [0.175, 0.885, 0.32, 1.275] as const,
  /** Linear standard */
  linear: [0, 0, 1, 1] as const,
}

// ============================================================================
// Duration Presets
// ============================================================================

export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
}

// ============================================================================
// Variants - Fade
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal, ease: easing.easeOutExpo },
  },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring.smooth,
  },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring.smooth,
  },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: spring.smooth,
  },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: spring.smooth,
  },
}

// ============================================================================
// Variants - Scale
// ============================================================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring.bouncy,
  },
}

export const scaleInCenter: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring.smooth,
  },
}

// ============================================================================
// Variants - Hero Text Reveal
// ============================================================================

export const textRevealContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const textRevealWord: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 100,
    },
  },
}

export const textRevealLine: Variants = {
  hidden: {
    opacity: 0,
    y: '100%',
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring.smooth,
  },
}

// ============================================================================
// Variants - Stagger Containers
// ============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

// ============================================================================
// Variants - Cards & Items
// ============================================================================

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    transition: spring.smooth,
  },
  hover: {
    scale: 1.02,
    y: -8,
    transition: spring.bouncy,
  },
}

export const cardItem: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring.smooth,
  },
}

// ============================================================================
// Variants - Page Transitions
// ============================================================================

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: easing.easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: duration.fast,
      ease: easing.easeInOutCubic,
    },
  },
}

export const pageSlide: Variants = {
  initial: { opacity: 0, x: 100 },
  enter: {
    opacity: 1,
    x: 0,
    transition: spring.smooth,
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: { duration: duration.fast },
  },
}

// ============================================================================
// Variants - Navigation
// ============================================================================

export const navIndicator: Variants = {
  inactive: { opacity: 0, scale: 0.8 },
  active: {
    opacity: 1,
    scale: 1,
    transition: spring.bouncy,
  },
}

export const navLink: Variants = {
  inactive: { color: 'rgb(75, 85, 99)' }, // gray-600
  active: { color: 'rgb(37, 129, 160)' }, // primary-600
}

// ============================================================================
// Variants - Button Effects
// ============================================================================

export const buttonShine = {
  initial: { x: '-100%', opacity: 0 },
  hover: {
    x: '100%',
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing.easeOutExpo,
    },
  },
}

export const buttonPress = {
  rest: { scale: 1 },
  pressed: { scale: 0.97 },
  hover: { scale: 1.02 },
}

// ============================================================================
// Variants - Floating Elements
// ============================================================================

export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const floatSlow: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-15, 15, -15],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// ============================================================================
// Variants - Gradient Orb Animation
// ============================================================================

export const gradientOrb: Variants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// ============================================================================
// Variants - Scroll Indicator
// ============================================================================

export const scrollIndicator: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: {
    y: [0, 10, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const scrollLine: Variants = {
  initial: { pathLength: 0 },
  animate: {
    pathLength: 1,
    transition: {
      duration: 1.5,
      ease: easing.easeOutExpo,
    },
  },
}

// ============================================================================
// Variants - Pulse Glow
// ============================================================================

export const pulseGlow: Variants = {
  initial: {
    boxShadow: '0 0 20px -5px rgba(46, 155, 184, 0.4)',
  },
  animate: {
    boxShadow: [
      '0 0 20px -5px rgba(46, 155, 184, 0.4)',
      '0 0 40px -5px rgba(46, 155, 184, 0.6)',
      '0 0 20px -5px rgba(46, 155, 184, 0.4)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// ============================================================================
// Variants - 3D Tilt
// ============================================================================

export const tilt3D = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: spring.smooth,
  },
  hover: {
    scale: 1.02,
    transition: spring.bouncy,
  },
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a stagger delay based on index
 */
export function staggerDelay(index: number, baseDelay = 0.1): number {
  return index * baseDelay
}

/**
 * Create variants with custom delays
 */
export function withDelay(variants: Variants, delay: number): Variants {
  return {
    ...variants,
    visible: {
      ...(variants.visible as object),
      transition: {
        ...((variants.visible as { transition?: object })?.transition || {}),
        delay,
      },
    },
  }
}

/**
 * Viewport settings for scroll-triggered animations
 */
export const viewport = {
  /** Trigger when 20% visible */
  default: { once: true, amount: 0.2 },
  /** Trigger when 50% visible */
  half: { once: true, amount: 0.5 },
  /** Trigger when any part visible */
  any: { once: true, amount: 0 },
  /** Re-trigger on every scroll */
  repeat: { once: false, amount: 0.2 },
}
