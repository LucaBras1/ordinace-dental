'use client'

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface ScrollProgressProps {
  className?: string
  variant?: 'default' | 'gradient' | 'glow'
  height?: 'thin' | 'normal' | 'thick'
  position?: 'top' | 'bottom'
  showPercentage?: boolean
}

export function ScrollProgress({
  className,
  variant = 'gradient',
  height = 'thin',
  position = 'top',
  showPercentage = false,
}: ScrollProgressProps) {
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // Smooth spring animation for the progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Transform for percentage display
  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100])

  const heightStyles = {
    thin: 'h-0.5',
    normal: 'h-1',
    thick: 'h-1.5',
  }

  const positionStyles = {
    top: 'top-0',
    bottom: 'bottom-0',
  }

  const variantStyles = {
    default: 'bg-primary-500',
    gradient: 'bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500',
    glow: 'bg-gradient-to-r from-primary-500 to-accent-500 shadow-[0_0_10px_rgba(46,155,184,0.5)]',
  }

  if (prefersReducedMotion) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-50',
        positionStyles[position],
        heightStyles[height],
        'bg-gray-100/50',
        className
      )}
    >
      <motion.div
        className={cn('h-full origin-left', variantStyles[variant])}
        style={{ scaleX }}
      />

      {/* Optional percentage indicator */}
      {showPercentage && (
        <motion.div
          className="absolute right-4 top-full mt-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-primary-600 shadow-sm backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span>{Math.round(percentage.get())}</motion.span>%
        </motion.div>
      )}
    </div>
  )
}

interface ScrollProgressCircleProps {
  size?: number
  strokeWidth?: number
  className?: string
}

/**
 * Circular scroll progress indicator
 */
export function ScrollProgressCircle({
  size = 48,
  strokeWidth = 3,
  className,
}: ScrollProgressCircleProps) {
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  if (prefersReducedMotion) {
    return null
  }

  const center = size / 2
  const radius = center - strokeWidth

  return (
    <div className={cn('fixed bottom-8 right-8 z-40', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            pathLength,
            rotate: -90,
            transformOrigin: 'center',
          }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2E9BB8" />
            <stop offset="100%" stopColor="#1AB69A" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
