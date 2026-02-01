'use client'

import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Toast as ToastType } from '@/hooks/useToast'

interface ToastProps extends ToastType {
  onClose: (id: string) => void
}

const icons = {
  success: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const styles = {
  success: {
    container: 'bg-success-light border-success',
    icon: 'text-success-dark',
    title: 'text-success-dark',
    progress: 'bg-success',
  },
  error: {
    container: 'bg-error-light border-error',
    icon: 'text-error-dark',
    title: 'text-error-dark',
    progress: 'bg-error',
  },
  warning: {
    container: 'bg-warning-light border-warning',
    icon: 'text-warning-dark',
    title: 'text-warning-dark',
    progress: 'bg-warning',
  },
  info: {
    container: 'bg-info-light border-info',
    icon: 'text-info-dark',
    title: 'text-info-dark',
    progress: 'bg-info',
  },
}

function Toast({ id, type, title, description, duration = 5000, onClose }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [translateX, setTranslateX] = useState(0)

  const handleClose = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => onClose(id), 300)
  }, [id, onClose])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const delta = e.touches[0].clientX - touchStart
    if (delta > 0) {
      setTranslateX(delta)
    }
  }

  const handleTouchEnd = () => {
    if (translateX > 100) {
      handleClose()
    } else {
      setTranslateX(0)
    }
    setTouchStart(null)
  }

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, handleClose])

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-4 shadow-lg',
        'transition-all duration-300',
        isLeaving ? 'animate-toast-out' : 'animate-toast-in',
        styles[type].container
      )}
      style={{ transform: `translateX(${translateX}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex-shrink-0', styles[type].icon)}>{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium', styles[type].title)}>{title}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
          aria-label="Zavřít"
        >
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
          <div
            className={cn('h-full animate-progress', styles[type].progress)}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastType[]
  onClose: (id: string) => void
}

function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}

export { Toast, ToastContainer }
