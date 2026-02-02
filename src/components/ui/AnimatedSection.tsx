'use client'

import { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'
import {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerContainer,
  spring,
  viewport,
} from '@/lib/animations'

type AnimationType =
  | 'fade-in'
  | 'fade-in-up'
  | 'fade-in-down'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'scale-in'
  | 'slide-up'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: AnimationType
  delay?: number
  as?: 'div' | 'section' | 'article' | 'aside'
  threshold?: number
  once?: boolean
}

const animationVariants: Record<AnimationType, Variants> = {
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: spring.smooth },
  },
  'fade-in-up': fadeInUp,
  'fade-in-down': fadeInDown,
  'fade-in-left': fadeInLeft,
  'fade-in-right': fadeInRight,
  'scale-in': scaleIn,
  'slide-up': {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: spring.smooth },
  },
}

export function AnimatedSection({
  children,
  className,
  animation = 'fade-in-up',
  delay = 0,
  as = 'div',
  threshold = 0.2,
  once = true,
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion()
  const MotionComponent = motion[as] as typeof motion.div

  if (prefersReducedMotion) {
    const Component = as
    return <Component className={className}>{children}</Component>
  }

  const variants = animationVariants[animation]

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={variants}
      transition={{
        ...spring.smooth,
        delay,
      }}
    >
      {children}
    </MotionComponent>
  )
}

interface AnimatedItemProps {
  children: ReactNode
  className?: string
  animation?: AnimationType
  index?: number
  baseDelay?: number
}

export function AnimatedItem({
  children,
  className,
  animation = 'fade-in-up',
  index = 0,
  baseDelay = 0.1,
}: AnimatedItemProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const variants = animationVariants[animation]
  const delay = index * baseDelay

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      transition={{
        ...spring.smooth,
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  initialDelay?: number
  as?: 'div' | 'section' | 'ul' | 'ol'
}

/**
 * Container that staggers children animations
 */
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0.1,
  as = 'div',
}: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion()
  const MotionComponent = motion[as] as typeof motion.div

  if (prefersReducedMotion) {
    const Component = as
    return <Component className={className}>{children}</Component>
  }

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
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
    </MotionComponent>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

/**
 * Item to be used inside StaggerContainer
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: spring.smooth,
        },
      }}
    >
      {children}
    </motion.div>
  )
}

interface RevealOnScrollProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  duration?: number
  delay?: number
}

/**
 * Simple reveal animation on scroll
 */
export function RevealOnScroll({
  children,
  className,
  direction = 'up',
  distance = 40,
  duration = 0.6,
  delay = 0,
}: RevealOnScrollProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  return (
    <motion.div
      className={cn('will-change-transform', className)}
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
