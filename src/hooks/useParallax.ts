'use client'

import { useEffect, useState, useCallback, RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface ParallaxValues {
  x: number
  y: number
  rotateX: number
  rotateY: number
}

interface UseParallaxOptions {
  /** Multiplier for movement intensity (default: 0.02) */
  intensity?: number
  /** Whether to include rotation (default: false) */
  enableRotation?: boolean
  /** Rotation intensity multiplier (default: 0.1) */
  rotationIntensity?: number
  /** Max movement in pixels (default: 30) */
  maxMove?: number
}

/**
 * Track mouse position for parallax effects
 * Returns values that can be used for transform styles
 */
export function useParallax(options: UseParallaxOptions = {}): ParallaxValues {
  const {
    intensity = 0.02,
    enableRotation = false,
    rotationIntensity = 0.1,
    maxMove = 30,
  } = options

  const prefersReducedMotion = useReducedMotion()
  const [values, setValues] = useState<ParallaxValues>({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
  })

  useEffect(() => {
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      const deltaX = (e.clientX - centerX) * intensity
      const deltaY = (e.clientY - centerY) * intensity

      // Clamp values
      const x = Math.max(-maxMove, Math.min(maxMove, deltaX))
      const y = Math.max(-maxMove, Math.min(maxMove, deltaY))

      const rotateX = enableRotation ? deltaY * rotationIntensity : 0
      const rotateY = enableRotation ? -deltaX * rotationIntensity : 0

      setValues({ x, y, rotateX, rotateY })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [intensity, enableRotation, rotationIntensity, maxMove, prefersReducedMotion])

  return values
}

interface ElementParallaxValues {
  x: number
  y: number
  rotateX: number
  rotateY: number
}

/**
 * Element-specific parallax based on hover position
 */
export function useElementParallax(
  ref: RefObject<HTMLElement>,
  options: UseParallaxOptions = {}
): ElementParallaxValues & {
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseLeave: () => void
} {
  const {
    intensity = 0.5,
    enableRotation = true,
    rotationIntensity = 15,
    maxMove = 20,
  } = options

  const prefersReducedMotion = useReducedMotion()
  const [values, setValues] = useState<ElementParallaxValues>({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
  })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) / rect.width
      const deltaY = (e.clientY - centerY) / rect.height

      const x = deltaX * maxMove * intensity
      const y = deltaY * maxMove * intensity
      const rotateX = enableRotation ? -deltaY * rotationIntensity : 0
      const rotateY = enableRotation ? deltaX * rotationIntensity : 0

      setValues({ x, y, rotateX, rotateY })
    },
    [ref, intensity, enableRotation, rotationIntensity, maxMove, prefersReducedMotion]
  )

  const handleMouseLeave = useCallback(() => {
    setValues({ x: 0, y: 0, rotateX: 0, rotateY: 0 })
  }, [])

  return { ...values, handleMouseMove, handleMouseLeave }
}

interface ScrollParallaxValues {
  y: number
  progress: number
}

/**
 * Scroll-based parallax effect
 */
export function useScrollParallax(
  ref: RefObject<HTMLElement>,
  speed: number = 0.5
): ScrollParallaxValues {
  const prefersReducedMotion = useReducedMotion()
  const [values, setValues] = useState<ScrollParallaxValues>({
    y: 0,
    progress: 0,
  })

  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return

    const handleScroll = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height

      // Calculate progress (0 when element enters viewport, 1 when it leaves)
      const progress = Math.max(
        0,
        Math.min(1, 1 - (elementTop + elementHeight) / (windowHeight + elementHeight))
      )

      // Calculate parallax offset
      const y = (elementTop - windowHeight / 2) * speed

      setValues({ y, progress })
    }

    handleScroll() // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [ref, speed, prefersReducedMotion])

  return values
}
