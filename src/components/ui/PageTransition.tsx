'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { pageTransition, easing, duration } from '@/lib/animations'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

/**
 * Page transition wrapper with fade and slide effects
 */
export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className={className}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

/**
 * Simple fade-in animation wrapper
 */
export function FadeIn({
  children,
  className = '',
  delay = 0,
  duration: dur = 0.5,
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: dur,
        delay,
        ease: easing.easeOutExpo,
      }}
    >
      {children}
    </motion.div>
  )
}

interface SlideInProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  distance?: number
}

/**
 * Slide-in animation wrapper
 */
export function SlideIn({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  distance = 40,
}: SlideInProps) {
  const prefersReducedMotion = useReducedMotion()

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: duration.slow,
        delay,
        ease: easing.easeOutExpo,
      }}
    >
      {children}
    </motion.div>
  )
}

interface ScaleInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/**
 * Scale-in animation wrapper
 */
export function ScaleIn({ children, className = '', delay = 0 }: ScaleInProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 100,
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerChildrenProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  initialDelay?: number
}

/**
 * Container for staggered children animations
 */
export function StaggerChildren({
  children,
  className = '',
  staggerDelay = 0.1,
  initialDelay = 0.1,
}: StaggerChildrenProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Child item for StaggerChildren
 */
export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            damping: 20,
            stiffness: 100,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
