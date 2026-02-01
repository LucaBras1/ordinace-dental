'use client'

import { useCallback, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface MagneticPosition {
  x: number
  y: number
}

interface UseMagneticEffectOptions {
  strength?: number
  radius?: number
}

export function useMagneticEffect(options: UseMagneticEffectOptions = {}) {
  const { strength = 0.3, radius = 100 } = options
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [position, setPosition] = useState<MagneticPosition>({ x: 0, y: 0 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      if (distance < radius) {
        const factor = 1 - distance / radius
        setPosition({
          x: distanceX * strength * factor,
          y: distanceY * strength * factor,
        })
      }
    },
    [prefersReducedMotion, strength, radius]
  )

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: 'transform 0.2s ease-out',
  }

  return {
    ref,
    style,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  }
}
