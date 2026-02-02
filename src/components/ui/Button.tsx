'use client'

import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring } from '@/lib/animations'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  asChild?: boolean
  magnetic?: boolean
  ripple?: boolean
  shine?: boolean
}

interface RippleStyle {
  left: number
  top: number
  width: number
  height: number
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      asChild = false,
      magnetic = false,
      ripple = true,
      shine = true,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion()
    const buttonRef = useRef<HTMLButtonElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 })
    const [ripples, setRipples] = useState<RippleStyle[]>([])
    const [isHovered, setIsHovered] = useState(false)

    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden'

    const variants = {
      primary:
        'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-button hover:shadow-md',
      secondary:
        'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-button hover:shadow-md',
      outline:
        'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
      ghost:
        'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200',
      gradient:
        'bg-gradient-primary text-white hover:bg-gradient-primary-hover shadow-button hover:shadow-glow-primary active:shadow-md transition-shadow',
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    }

    // Magnetic effect
    const handleMouseMove = useCallback(
      (e: MouseEvent<HTMLElement>) => {
        if (!magnetic || prefersReducedMotion) return
        const targetRef = asChild ? wrapperRef : buttonRef
        if (!targetRef.current) return

        const rect = targetRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const distanceX = e.clientX - centerX
        const distanceY = e.clientY - centerY

        setMagneticOffset({
          x: distanceX * 0.2,
          y: distanceY * 0.2,
        })
      },
      [magnetic, prefersReducedMotion, asChild]
    )

    const handleMouseLeave = useCallback(() => {
      setMagneticOffset({ x: 0, y: 0 })
      setIsHovered(false)
    }, [])

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true)
    }, [])

    // Ripple effect
    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        const targetRef = asChild ? wrapperRef : buttonRef
        if (ripple && !prefersReducedMotion && targetRef.current) {
          const rect = targetRef.current.getBoundingClientRect()
          const size = Math.max(rect.width, rect.height)
          const x = e.clientX - rect.left - size / 2
          const y = e.clientY - rect.top - size / 2

          const newRipple: RippleStyle = {
            left: x,
            top: y,
            width: size,
            height: size,
          }

          setRipples((prev) => [...prev, newRipple])

          setTimeout(() => {
            setRipples((prev) => prev.slice(1))
          }, 600)
        }

        onClick?.(e)
      },
      [ripple, prefersReducedMotion, onClick, asChild]
    )

    const magneticStyle = magnetic
      ? {
          transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px)`,
          transition: 'transform 0.2s ease-out',
        }
      : undefined

    // Combine refs for button
    const combinedRef = (node: HTMLButtonElement | null) => {
      ;(buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
      }
    }

    // Determine if shine should be shown (only for filled variants)
    const showShine =
      shine &&
      !prefersReducedMotion &&
      isHovered &&
      (variant === 'primary' || variant === 'secondary' || variant === 'gradient')

    // When asChild is true, wrap the child in a wrapper div for effects
    // but pass the className to the child via Slot
    if (asChild) {
      return (
        <div
          ref={wrapperRef}
          className="relative inline-flex"
          style={magneticStyle}
          onMouseMove={magnetic ? handleMouseMove : undefined}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          {/* Shine effect overlay */}
          <AnimatePresence>
            {showShine && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-20 rounded-xl overflow-hidden"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 0.6,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ripple effects */}
          {ripples.map((rippleStyle, index) => (
            <span
              key={index}
              className="pointer-events-none absolute z-10 rounded-full bg-white/30 animate-ripple"
              style={{
                left: rippleStyle.left,
                top: rippleStyle.top,
                width: rippleStyle.width,
                height: rippleStyle.height,
              }}
            />
          ))}

          <Slot
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            onClick={handleClick}
            {...props}
          >
            {children}
          </Slot>
        </div>
      )
    }

    // Regular button without asChild
    return (
      <button
        ref={combinedRef}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        style={magneticStyle}
        onMouseMove={magnetic ? handleMouseMove : undefined}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        {...props}
      >
        {/* Shine effect overlay */}
        <AnimatePresence>
          {showShine && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.19, 1, 0.22, 1],
              }}
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Ripple effects */}
        {ripples.map((rippleStyle, index) => (
          <span
            key={index}
            className="pointer-events-none absolute rounded-full bg-white/30 animate-ripple"
            style={{
              left: rippleStyle.left,
              top: rippleStyle.top,
              width: rippleStyle.width,
              height: rippleStyle.height,
            }}
          />
        ))}

        {/* Button content */}
        <span className="relative z-10 inline-flex items-center justify-center">
          {isLoading ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Načítám...
            </>
          ) : (
            children
          )}
        </span>
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
