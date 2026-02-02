'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface GradientOrbProps {
  color: 'primary' | 'accent' | 'mixed'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  position: { top?: string; bottom?: string; left?: string; right?: string }
  delay?: number
  className?: string
}

const colorMap = {
  primary: 'bg-primary-200/30',
  accent: 'bg-accent-200/30',
  mixed: 'bg-gradient-to-br from-primary-200/20 to-accent-200/20',
}

const sizeMap = {
  sm: 'h-[300px] w-[300px]',
  md: 'h-[500px] w-[500px]',
  lg: 'h-[700px] w-[700px]',
  xl: 'h-[900px] w-[900px]',
}

const blurMap = {
  sm: 'blur-[80px]',
  md: 'blur-[100px]',
  lg: 'blur-[120px]',
  xl: 'blur-[150px]',
}

function GradientOrb({
  color,
  size = 'md',
  position,
  delay = 0,
  className = '',
}: GradientOrbProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={`absolute rounded-full ${colorMap[color]} ${sizeMap[size]} ${blurMap[size]} ${className}`}
      style={{
        ...position,
        willChange: 'transform, opacity',
      }}
      initial={{ scale: 1, opacity: 0.5 }}
      animate={
        prefersReducedMotion
          ? { scale: 1, opacity: 0.5 }
          : {
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.7, 0.5],
            }
      }
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

interface AnimatedGradientProps {
  variant?: 'hero' | 'section' | 'card'
  className?: string
}

/**
 * Animated gradient background with floating orbs
 * Creates depth and visual interest like Apple/Stripe
 */
export function AnimatedGradient({
  variant = 'hero',
  className = '',
}: AnimatedGradientProps) {
  if (variant === 'hero') {
    return (
      <div
        className={`absolute inset-0 -z-10 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        {/* Base gradient mesh */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-80" />
        <div className="absolute inset-0 bg-gradient-mesh-hero" />

        {/* Animated orbs */}
        <GradientOrb
          color="primary"
          size="lg"
          position={{ top: '-15%', right: '-10%' }}
          delay={0}
        />
        <GradientOrb
          color="accent"
          size="lg"
          position={{ bottom: '-15%', left: '-10%' }}
          delay={2}
        />
        <GradientOrb
          color="mixed"
          size="md"
          position={{ top: '40%', left: '30%' }}
          delay={4}
        />
      </div>
    )
  }

  if (variant === 'section') {
    return (
      <div
        className={`absolute inset-0 -z-10 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <GradientOrb
          color="primary"
          size="md"
          position={{ top: '-20%', right: '10%' }}
          delay={0}
        />
        <GradientOrb
          color="accent"
          size="sm"
          position={{ bottom: '10%', left: '-5%' }}
          delay={3}
        />
      </div>
    )
  }

  // Card variant
  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden rounded-inherit ${className}`}
      aria-hidden="true"
    >
      <GradientOrb
        color="primary"
        size="sm"
        position={{ top: '-50%', right: '-30%' }}
        delay={0}
      />
    </div>
  )
}

/**
 * Gradient line separator with animation
 */
export function GradientLine({ className = '' }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={`h-px w-full bg-gradient-to-r from-transparent via-primary-300 to-transparent ${className}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 1, ease: [0.19, 1, 0.22, 1] }
      }
    />
  )
}
