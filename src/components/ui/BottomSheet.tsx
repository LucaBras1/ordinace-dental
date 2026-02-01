'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  snapPoints?: number[]
  initialSnap?: number
  className?: string
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints = [0.25, 0.5, 1],
  initialSnap = 0.5,
  className,
}: BottomSheetProps) {
  const [height, setHeight] = useState(initialSnap)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)
  const startHeight = useRef(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true)
    startY.current = clientY
    startHeight.current = height
  }, [height])

  const handleDrag = useCallback((clientY: number) => {
    if (!isDragging) return

    const deltaY = startY.current - clientY
    const deltaPercent = deltaY / window.innerHeight
    const newHeight = Math.min(1, Math.max(0.1, startHeight.current + deltaPercent))
    setHeight(newHeight)
  }, [isDragging])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    // Snap to closest point
    const closest = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
    )

    if (closest <= 0.15) {
      onClose()
    } else {
      setHeight(closest)
    }
  }, [isDragging, height, snapPoints, onClose])

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDrag(e.touches[0].clientY)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientY)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => handleDrag(e.clientY)
    const handleMouseUp = () => handleDragEnd()

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleDrag, handleDragEnd])

  useEffect(() => {
    if (isOpen) {
      setHeight(initialSnap)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, initialSnap])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl',
          isDragging ? '' : 'transition-all duration-300 ease-out',
          className
        )}
        style={{ height: `${height * 100}%` }}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleMouseDown}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-48px)] px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  )
}
