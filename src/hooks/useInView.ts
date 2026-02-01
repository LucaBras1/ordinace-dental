'use client'

import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (triggerOnce && hasTriggered) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting
        setIsInView(inView)

        if (inView && triggerOnce) {
          setHasTriggered(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return { ref, isInView }
}
