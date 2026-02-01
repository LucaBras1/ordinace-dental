'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ScrollProgressProps {
  className?: string
}

export function ScrollProgress({ className }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100',
        className
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
