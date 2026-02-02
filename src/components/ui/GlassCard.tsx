'use client'

import { forwardRef, useRef, type HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { use3DTilt } from '@/hooks/use3DTilt'
import { spring } from '@/lib/animations'

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'subtle'
  hover?: boolean
  glow?: boolean
  glowColor?: 'primary' | 'accent'
  tilt?: boolean
  tiltIntensity?: number
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant = 'default',
      hover = true,
      glow = false,
      glowColor = 'primary',
      tilt = false,
      tiltIntensity = 10,
      children,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion()
    const cardRef = useRef<HTMLDivElement>(null)
    const {
      handleMouseMove,
      handleMouseEnter,
      handleMouseLeave,
      style: tiltStyle,
    } = use3DTilt(cardRef, {
      maxRotation: tiltIntensity,
      hoverScale: 1.02,
    })

    const variants = {
      default: 'bg-white/70 backdrop-blur-[20px] border border-white/30',
      strong: 'bg-white/85 backdrop-blur-[30px] border border-white/40',
      subtle: 'bg-white/50 backdrop-blur-[15px] border border-white/20',
    }

    const glowStyles = {
      primary: 'shadow-glow-primary',
      accent: 'shadow-glow-accent',
    }

    // Determine if 3D tilt should be active
    const shouldTilt = tilt && hover && !prefersReducedMotion

    // Combine refs
    const combinedRef = (node: HTMLDivElement | null) => {
      ;(cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    }

    if (shouldTilt) {
      return (
        <motion.div
          ref={combinedRef}
          className={cn(
            'rounded-2xl p-6 shadow-glass transition-colors duration-300',
            variants[variant],
            glow && glowStyles[glowColor],
            'will-change-transform',
            className
          )}
          style={tiltStyle}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          whileHover={
            prefersReducedMotion
              ? {}
              : {
                  boxShadow:
                    '0 20px 60px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.6)',
                }
          }
          transition={spring.smooth}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {/* Shine overlay on hover */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, transparent 100%)',
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="relative z-10">{children}</div>
        </motion.div>
      )
    }

    return (
      <motion.div
        ref={combinedRef}
        className={cn(
          'rounded-2xl p-6 shadow-glass transition-all duration-300',
          variants[variant],
          hover && 'hover:bg-white/80 hover:shadow-glass-hover',
          glow && glowStyles[glowColor],
          className
        )}
        whileHover={
          hover && !prefersReducedMotion
            ? {
                y: -4,
                transition: spring.bouncy,
              }
            : {}
        }
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {children}
      </motion.div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export { GlassCard }
