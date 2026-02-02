'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { textRevealContainer, textRevealWord, spring } from '@/lib/animations'

interface TextRevealProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
  /** Highlight specific words with gradient */
  highlightWords?: string[]
  highlightClassName?: string
}

/**
 * Word-by-word text reveal animation with 3D rotation
 * Inspired by Apple and Linear hero animations
 */
export function TextReveal({
  children,
  className = '',
  as: Component = 'h1',
  delay = 0,
  highlightWords = [],
  highlightClassName = 'text-gradient-primary',
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const words = children.split(' ')

  if (prefersReducedMotion) {
    return (
      <Component className={className}>
        {words.map((word, i) => {
          const isHighlight = highlightWords.some((hw) =>
            word.toLowerCase().includes(hw.toLowerCase())
          )
          return (
            <span key={i} className={isHighlight ? highlightClassName : ''}>
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          )
        })}
      </Component>
    )
  }

  const MotionComponent = motion[Component] as typeof motion.h1

  return (
    <MotionComponent
      className={`${className} [perspective:1000px]`}
      variants={textRevealContainer}
      initial="hidden"
      animate="visible"
      style={{ willChange: 'opacity' }}
    >
      {words.map((word, i) => {
        const isHighlight = highlightWords.some((hw) =>
          word.toLowerCase().includes(hw.toLowerCase())
        )

        return (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className={`inline-block ${isHighlight ? highlightClassName : ''}`}
              variants={textRevealWord}
              custom={i}
              style={{
                willChange: 'transform, opacity',
                transformOrigin: 'bottom center',
              }}
              transition={{
                ...spring.smooth,
                delay: delay + i * 0.08,
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        )
      })}
    </MotionComponent>
  )
}

interface TextRevealLineProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/**
 * Line-by-line text reveal with mask animation
 */
export function TextRevealLine({
  children,
  className = '',
  delay = 0,
}: TextRevealLineProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{
          ...spring.smooth,
          delay,
        }}
        style={{ willChange: 'transform' }}
      >
        {children}
      </motion.div>
    </div>
  )
}

interface TextRevealCharProps {
  children: string
  className?: string
  delay?: number
  staggerDelay?: number
}

/**
 * Character-by-character reveal for dramatic effect
 */
export function TextRevealChar({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.03,
}: TextRevealCharProps) {
  const prefersReducedMotion = useReducedMotion()
  const chars = children.split('')

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>
  }

  return (
    <span className={className} aria-label={children}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...spring.snappy,
            delay: delay + i * staggerDelay,
          }}
          aria-hidden="true"
          style={{ willChange: 'transform, opacity' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

interface TypewriterProps {
  children: string
  className?: string
  delay?: number
  speed?: number
}

/**
 * Typewriter effect for hero subtitles
 */
export function Typewriter({
  children,
  className = '',
  delay = 0.5,
  speed = 0.03,
}: TypewriterProps) {
  const prefersReducedMotion = useReducedMotion()
  const chars = children.split('')

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>
  }

  return (
    <span className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.01,
            delay: delay + i * speed,
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}
