'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface UseCounterOptions {
  start?: number
  end: number
  duration?: number
  delay?: number
  enabled?: boolean
}

export function useCounter(options: UseCounterOptions): number {
  const { start = 0, end, duration = 2000, delay = 0, enabled = true } = options
  const prefersReducedMotion = useReducedMotion()
  const [count, setCount] = useState(start)

  useEffect(() => {
    if (!enabled) return

    if (prefersReducedMotion) {
      setCount(end)
      return
    }

    let startTime: number
    let animationFrame: number

    const startAnimation = () => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function (ease-out-expo)
        const easedProgress = 1 - Math.pow(2, -10 * progress)
        const currentValue = Math.round(start + (end - start) * easedProgress)

        setCount(currentValue)

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)
    }

    const timeoutId = setTimeout(startAnimation, delay)

    return () => {
      clearTimeout(timeoutId)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [start, end, duration, delay, enabled, prefersReducedMotion])

  return count
}
