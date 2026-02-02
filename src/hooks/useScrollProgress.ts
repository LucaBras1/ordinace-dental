'use client'

import { useEffect, useState, RefObject } from 'react'

interface ScrollProgressValues {
  /** 0-1 progress through the page */
  progress: number
  /** Current scroll position in pixels */
  scrollY: number
  /** Scroll direction: 1 = down, -1 = up, 0 = static */
  direction: -1 | 0 | 1
  /** Scroll velocity (pixels per frame) */
  velocity: number
}

/**
 * Track overall page scroll progress
 */
export function useScrollProgress(): ScrollProgressValues {
  const [values, setValues] = useState<ScrollProgressValues>({
    progress: 0,
    scrollY: 0,
    direction: 0,
    velocity: 0,
  })

  useEffect(() => {
    let lastScrollY = window.scrollY
    let lastTime = Date.now()
    let rafId: number

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0

        const now = Date.now()
        const timeDelta = now - lastTime
        const scrollDelta = scrollY - lastScrollY
        const velocity = timeDelta > 0 ? scrollDelta / timeDelta : 0

        const direction = scrollDelta > 0 ? 1 : scrollDelta < 0 ? -1 : 0

        setValues({
          progress,
          scrollY,
          direction,
          velocity,
        })

        lastScrollY = scrollY
        lastTime = now
      })
    }

    handleScroll() // Initial call
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return values
}

interface SectionProgressValues {
  /** 0-1 progress through the section */
  progress: number
  /** Whether section is in viewport */
  isInView: boolean
  /** Entry progress (0 = just entered bottom, 1 = fully visible) */
  entryProgress: number
  /** Exit progress (0 = starting to exit, 1 = fully exited top) */
  exitProgress: number
}

/**
 * Track scroll progress through a specific section
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement>
): SectionProgressValues {
  const [values, setValues] = useState<SectionProgressValues>({
    progress: 0,
    isInView: false,
    entryProgress: 0,
    exitProgress: 0,
  })

  useEffect(() => {
    if (!ref.current) return

    let rafId: number

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const elementTop = rect.top
        const elementBottom = rect.bottom
        const elementHeight = rect.height

        // Is the element in view?
        const isInView = elementTop < windowHeight && elementBottom > 0

        // Entry progress: 0 when element just enters, 1 when fully visible
        const entryProgress = Math.max(
          0,
          Math.min(1, (windowHeight - elementTop) / Math.min(elementHeight, windowHeight))
        )

        // Exit progress: 0 when starting to exit top, 1 when fully exited
        const exitProgress = Math.max(
          0,
          Math.min(1, -elementTop / elementHeight)
        )

        // Overall progress through section
        const totalTravel = windowHeight + elementHeight
        const traveled = windowHeight - elementTop
        const progress = Math.max(0, Math.min(1, traveled / totalTravel))

        setValues({
          progress,
          isInView,
          entryProgress,
          exitProgress,
        })
      })
    }

    handleScroll() // Initial call
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [ref])

  return values
}

/**
 * Detect when scroll reaches a threshold
 */
export function useScrollThreshold(threshold: number = 100): boolean {
  const [isPastThreshold, setIsPastThreshold] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsPastThreshold(window.scrollY > threshold)
    }

    handleScroll() // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return isPastThreshold
}

/**
 * Smooth scroll to element
 */
export function useScrollTo(): (
  target: string | HTMLElement,
  offset?: number
) => void {
  return (target: string | HTMLElement, offset: number = 0) => {
    const element =
      typeof target === 'string' ? document.querySelector(target) : target

    if (!element) return

    const top =
      element.getBoundingClientRect().top + window.scrollY - offset

    window.scrollTo({
      top,
      behavior: 'smooth',
    })
  }
}
