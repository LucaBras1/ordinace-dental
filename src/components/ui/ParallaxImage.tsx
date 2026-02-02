'use client'

import { useRef } from 'react'
import Image, { type ImageProps } from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface ParallaxImageProps extends Omit<ImageProps, 'alt'> {
  alt: string
  speed?: number
  scale?: boolean
  scaleAmount?: number
  className?: string
  containerClassName?: string
}

/**
 * Image with parallax scroll effect
 * Speed: 0.5 = moves at half scroll speed, 1.5 = moves faster than scroll
 */
export function ParallaxImage({
  src,
  alt,
  speed = 0.5,
  scale = true,
  scaleAmount = 1.1,
  className,
  containerClassName,
  ...props
}: ParallaxImageProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Calculate parallax offset
  const yRange = 100 * (speed - 1) // Negative for slower, positive for faster
  const y = useTransform(scrollYProgress, [0, 1], [`${-yRange}%`, `${yRange}%`])

  // Scale effect as image scrolls into view
  const scaleValue = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [scaleAmount, 1, scaleAmount]
  )

  // Smooth spring for scale
  const smoothScale = useSpring(scaleValue, {
    stiffness: 100,
    damping: 30,
  })

  if (prefersReducedMotion) {
    return (
      <div className={cn('relative overflow-hidden', containerClassName)}>
        <Image
          src={src}
          alt={alt}
          className={cn('object-cover', className)}
          {...props}
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', containerClassName)}
    >
      <motion.div
        className="relative h-full w-full"
        style={{
          y,
          scale: scale ? smoothScale : 1,
        }}
      >
        <Image
          src={src}
          alt={alt}
          className={cn('object-cover', className)}
          {...props}
        />
      </motion.div>
    </div>
  )
}

interface ParallaxContainerProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

/**
 * Container with parallax effect for any content
 */
export function ParallaxContainer({
  children,
  speed = 0.5,
  className,
}: ParallaxContainerProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const yRange = 50 * (speed - 1)
  const y = useTransform(scrollYProgress, [0, 1], [`${-yRange}px`, `${yRange}px`])

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={containerRef} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  duration?: number
  delay?: number
}

/**
 * Floating element with subtle up/down animation
 */
export function FloatingElement({
  children,
  className,
  intensity = 10,
  duration = 4,
  delay = 0,
}: FloatingElementProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn('will-change-transform', className)}
      animate={{
        y: [-intensity, intensity, -intensity],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
