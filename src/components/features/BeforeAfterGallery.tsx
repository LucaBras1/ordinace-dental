'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface BeforeAfterItem {
  id: string
  title: string
  description?: string
  beforeImage: string
  afterImage: string
  beforeAlt?: string
  afterAlt?: string
}

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeAlt?: string
  afterAlt?: string
  className?: string
}

function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = 'Před',
  afterAlt = 'Po',
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const newPosition = Math.min(100, Math.max(0, (x / rect.width) * 100))
    setPosition(newPosition)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updatePosition(e.clientX)
  }, [updatePosition])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true)
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX)
    const handleTouchMove = (e: TouchEvent) => updatePosition(e.touches[0].clientX)
    const handleEnd = () => setIsDragging(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, updatePosition])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-[4/3] overflow-hidden rounded-2xl cursor-ew-resize select-none',
        className
      )}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* After image (full width) */}
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt={afterAlt}
          fill
          className="object-cover"
        />
        <span className="absolute bottom-4 right-4 bg-accent-500 text-white text-xs font-medium px-2 py-1 rounded-full">
          Po
        </span>
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div className="relative h-full" style={{ width: `${10000 / position}%` }}>
          <Image
            src={beforeImage}
            alt={beforeAlt}
            fill
            className="object-cover"
          />
        </div>
        <span className="absolute bottom-4 left-4 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-full">
          Před
        </span>
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 z-10"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg -translate-x-1/2" />
        <div
          className={cn(
            'absolute top-1/2 -translate-x-1/2 -translate-y-1/2',
            'flex h-10 w-10 items-center justify-center rounded-full',
            'bg-white shadow-lg transition-transform',
            isDragging && 'scale-110'
          )}
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    </div>
  )
}

interface BeforeAfterGalleryProps {
  items: BeforeAfterItem[]
  className?: string
}

export function BeforeAfterGallery({ items, className }: BeforeAfterGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<BeforeAfterItem | null>(null)

  return (
    <>
      <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
        {items.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <BeforeAfterSlider
              beforeImage={item.beforeImage}
              afterImage={item.afterImage}
              beforeAlt={item.beforeAlt}
              afterAlt={item.afterAlt}
              className="transition-shadow group-hover:shadow-xl"
            />
            {item.title && (
              <div className="mt-3">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
              aria-label="Zavřít"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <BeforeAfterSlider
              beforeImage={selectedItem.beforeImage}
              afterImage={selectedItem.afterImage}
              beforeAlt={selectedItem.beforeAlt}
              afterAlt={selectedItem.afterAlt}
              className="aspect-[16/10]"
            />

            {(selectedItem.title || selectedItem.description) && (
              <div className="p-6">
                {selectedItem.title && (
                  <h3 className="text-xl font-semibold text-gray-900">{selectedItem.title}</h3>
                )}
                {selectedItem.description && (
                  <p className="mt-2 text-gray-600">{selectedItem.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export { BeforeAfterSlider }
