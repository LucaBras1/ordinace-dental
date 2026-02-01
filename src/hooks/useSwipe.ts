'use client'

import { useCallback, useRef, useState } from 'react'

interface SwipeState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  isSwiping: boolean
}

interface UseSwipeOptions {
  threshold?: number
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export function useSwipe(options: UseSwipeOptions = {}) {
  const { threshold = 50, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown } = options
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const swipeState = useRef<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false,
  })

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    swipeState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isSwiping: true,
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swipeState.current.isSwiping) return

    const touch = e.touches[0]
    swipeState.current.currentX = touch.clientX
    swipeState.current.currentY = touch.clientY

    const deltaX = touch.clientX - swipeState.current.startX
    const deltaY = touch.clientY - swipeState.current.startY

    setOffset({ x: deltaX, y: deltaY })
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!swipeState.current.isSwiping) return

    const deltaX = swipeState.current.currentX - swipeState.current.startX
    const deltaY = swipeState.current.currentY - swipeState.current.startY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > absY && absX > threshold) {
      if (deltaX > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    } else if (absY > absX && absY > threshold) {
      if (deltaY > 0) {
        onSwipeDown?.()
      } else {
        onSwipeUp?.()
      }
    }

    swipeState.current.isSwiping = false
    setOffset({ x: 0, y: 0 })
  }, [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  return {
    offset,
    isSwiping: swipeState.current.isSwiping,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  }
}
