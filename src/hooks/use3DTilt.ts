'use client'

import { useCallback, useState, RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface Tilt3DValues {
  rotateX: number
  rotateY: number
  scale: number
}

interface Use3DTiltOptions {
  /** Max rotation in degrees (default: 15) */
  maxRotation?: number
  /** Scale on hover (default: 1.02) */
  hoverScale?: number
  /** Perspective value (default: 1000) */
  perspective?: number
}

interface Use3DTiltReturn extends Tilt3DValues {
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  style: React.CSSProperties
}

/**
 * 3D tilt effect on hover
 * Creates the premium card effect seen on Stripe, Linear
 */
export function use3DTilt(
  ref: RefObject<HTMLElement>,
  options: Use3DTiltOptions = {}
): Use3DTiltReturn {
  const {
    maxRotation = 15,
    hoverScale = 1.02,
    perspective = 1000,
  } = options

  const prefersReducedMotion = useReducedMotion()
  const [values, setValues] = useState<Tilt3DValues>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = ((y - centerY) / centerY) * -maxRotation
      const rotateY = ((x - centerX) / centerX) * maxRotation

      setValues({
        rotateX,
        rotateY,
        scale: hoverScale,
      })
    },
    [ref, maxRotation, hoverScale, prefersReducedMotion]
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (!prefersReducedMotion) {
      setValues((prev) => ({ ...prev, scale: hoverScale }))
    }
  }, [hoverScale, prefersReducedMotion])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setValues({ rotateX: 0, rotateY: 0, scale: 1 })
  }, [])

  const style: React.CSSProperties = prefersReducedMotion
    ? {}
    : {
        perspective: `${perspective}px`,
        transform: `
          perspective(${perspective}px)
          rotateX(${values.rotateX}deg)
          rotateY(${values.rotateY}deg)
          scale(${values.scale})
        `,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        willChange: 'transform',
      }

  return {
    ...values,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    style,
  }
}

/**
 * Simpler magnetic button effect
 */
export function useMagnetic(
  ref: RefObject<HTMLElement>,
  intensity: number = 0.3
): {
  x: number
  y: number
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseLeave: () => void
  style: React.CSSProperties
} {
  const prefersReducedMotion = useReducedMotion()
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const x = (e.clientX - centerX) * intensity
      const y = (e.clientY - centerY) * intensity

      setPosition({ x, y })
    },
    [ref, intensity, prefersReducedMotion]
  )

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  const style: React.CSSProperties = prefersReducedMotion
    ? {}
    : {
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.2s ease-out',
        willChange: 'transform',
      }

  return {
    ...position,
    handleMouseMove,
    handleMouseLeave,
    style,
  }
}
