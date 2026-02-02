'use client'

import { type ReactNode, type HTMLAttributes, forwardRef, useRef } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { use3DTilt } from '@/hooks/use3DTilt'
import { cn } from '@/lib/utils'
import { spring, cardItem } from '@/lib/animations'

// ============================================================================
// AnimatedGrid - Container for staggered card animations
// ============================================================================

interface AnimatedGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Delay between each item animation in seconds */
  staggerDelay?: number
  /** Initial delay before animations start */
  initialDelay?: number
  /** Number of columns (responsive by default) */
  columns?: 1 | 2 | 3 | 4
  /** Gap size */
  gap?: 'sm' | 'md' | 'lg'
}

const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const gridGaps = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
}

export function AnimatedGrid({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0.1,
  columns = 4,
  gap = 'md',
  ...props
}: AnimatedGridProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div
        className={cn('grid', gridColumns[columns], gridGaps[gap], className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={cn('grid', gridColumns[columns], gridGaps[gap], className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
      }}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// AnimatedGridItem - Individual item with fade + scale animation
// ============================================================================

interface AnimatedGridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Enable 3D tilt effect on hover */
  tilt?: boolean
  /** Tilt intensity (default: 10) */
  tiltIntensity?: number
  /** Enable hover lift effect */
  hoverLift?: boolean
  /** Custom animation variants */
  variants?: Variants
}

export const AnimatedGridItem = forwardRef<HTMLDivElement, AnimatedGridItemProps>(
  (
    {
      children,
      className,
      tilt = false,
      tiltIntensity = 10,
      hoverLift = true,
      variants,
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

    // Combine refs
    const combinedRef = (node: HTMLDivElement | null) => {
      ;(cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    }

    if (prefersReducedMotion) {
      return (
        <div ref={combinedRef} className={className} {...props}>
          {children}
        </div>
      )
    }

    const itemVariants: Variants = variants || cardItem

    // With 3D tilt
    if (tilt) {
      return (
        <motion.div
          ref={combinedRef}
          className={cn('will-change-transform', className)}
          variants={itemVariants}
          style={tiltStyle}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          whileHover={
            hoverLift
              ? {
                  boxShadow:
                    '0 20px 60px rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.4)',
                }
              : {}
          }
          transition={spring.smooth}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {/* Shine overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, transparent 100%)',
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="relative z-10">{children}</div>
        </motion.div>
      )
    }

    // Standard animation without tilt
    return (
      <motion.div
        ref={combinedRef}
        className={className}
        variants={itemVariants}
        whileHover={
          hoverLift
            ? {
                y: -8,
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

AnimatedGridItem.displayName = 'AnimatedGridItem'

// ============================================================================
// AnimatedCard - Pre-styled card with animations
// ============================================================================

interface AnimatedCardProps extends AnimatedGridItemProps {
  variant?: 'default' | 'glass' | 'outline'
}

const cardVariants = {
  default:
    'rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover',
  glass:
    'rounded-2xl bg-white/70 backdrop-blur-[20px] border border-white/30 p-6 shadow-glass',
  outline: 'rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-200',
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <AnimatedGridItem
        ref={ref}
        className={cn(cardVariants[variant], className)}
        {...props}
      >
        {children}
      </AnimatedGridItem>
    )
  }
)

AnimatedCard.displayName = 'AnimatedCard'

// ============================================================================
// AnimatedServiceCard - Specialized card for service listings
// ============================================================================

interface AnimatedServiceCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Index for stagger calculation */
  index?: number
}

export const AnimatedServiceCard = forwardRef<HTMLDivElement, AnimatedServiceCardProps>(
  ({ children, className, index = 0, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion()

    if (prefersReducedMotion) {
      return (
        <article
          ref={ref}
          className={cn(
            'group overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:shadow-card-hover',
            className
          )}
          {...props}
        >
          {children}
        </article>
      )
    }

    return (
      <motion.article
        ref={ref}
        className={cn(
          'group overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-card-hover',
          className
        )}
        variants={cardItem}
        whileHover={{
          y: -8,
          transition: spring.bouncy,
        }}
        {...(props as React.ComponentProps<typeof motion.article>)}
      >
        {children}
      </motion.article>
    )
  }
)

AnimatedServiceCard.displayName = 'AnimatedServiceCard'

// ============================================================================
// AnimatedFeatureList - Animated list of features with checkmarks
// ============================================================================

interface AnimatedFeatureListProps {
  features: string[]
  className?: string
  staggerDelay?: number
}

export function AnimatedFeatureList({
  features,
  className,
  staggerDelay = 0.08,
}: AnimatedFeatureListProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <ul className={cn('space-y-2', className)}>
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <svg
              className="h-5 w-5 flex-shrink-0 text-accent-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <motion.ul
      className={cn('space-y-2', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {features.map((feature, index) => (
        <motion.li
          key={index}
          className="flex items-center gap-2 text-sm"
          variants={{
            hidden: { opacity: 0, x: -10 },
            visible: {
              opacity: 1,
              x: 0,
              transition: spring.smooth,
            },
          }}
        >
          <motion.svg
            className="h-5 w-5 flex-shrink-0 text-accent-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{
              ...spring.bouncy,
              delay: index * staggerDelay + 0.1,
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
          <span className="text-gray-600">{feature}</span>
        </motion.li>
      ))}
    </motion.ul>
  )
}
