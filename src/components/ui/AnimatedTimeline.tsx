'use client'

import { type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/animations'

// ============================================================================
// Timeline Item Type
// ============================================================================

export interface TimelineItemData {
  year?: string
  date?: string
  title: string
  description: string | ReactNode
  icon?: ReactNode
}

// ============================================================================
// AnimatedTimeline - Container with animated vertical line
// ============================================================================

interface AnimatedTimelineProps {
  items: TimelineItemData[]
  className?: string
  /** Alternate items left/right on desktop */
  alternating?: boolean
  /** Base delay between items in seconds */
  staggerDelay?: number
}

export function AnimatedTimeline({
  items,
  className,
  alternating = true,
  staggerDelay = 0.15,
}: AnimatedTimelineProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })

  if (prefersReducedMotion) {
    return (
      <div className={cn('relative mx-auto max-w-3xl', className)}>
        {/* Static vertical line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-primary-200 md:left-1/2 md:-translate-x-1/2" />

        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              'relative mb-8 flex items-start gap-8 last:mb-0',
              alternating && (index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse')
            )}
          >
            {/* Dot */}
            <div className="absolute left-4 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-primary-500 md:left-1/2" />

            {/* Content */}
            <div
              className={cn(
                'ml-12 rounded-xl bg-white p-6 shadow-card md:ml-0 md:w-5/12',
                alternating && (index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto')
              )}
            >
              {(item.year || item.date) && (
                <span className="mb-2 inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-600">
                  {item.year || item.date}
                </span>
              )}
              <h3 className="heading-4 mb-2">{item.title}</h3>
              <div className="body-base">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('relative mx-auto max-w-3xl', className)}>
      {/* Animated vertical line */}
      <motion.div
        className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-primary-300 via-primary-400 to-primary-300 md:left-1/2 md:-translate-x-1/2"
        initial={{ height: 0 }}
        animate={isInView ? { height: '100%' } : { height: 0 }}
        transition={{
          duration: 1.5,
          ease: [0.19, 1, 0.22, 1],
        }}
        style={{ originY: 0 }}
      />

      {items.map((item, index) => (
        <TimelineItem
          key={index}
          item={item}
          index={index}
          alternating={alternating}
          staggerDelay={staggerDelay}
          isInView={isInView}
        />
      ))}
    </div>
  )
}

// ============================================================================
// TimelineItem - Individual animated item
// ============================================================================

interface TimelineItemProps {
  item: TimelineItemData
  index: number
  alternating: boolean
  staggerDelay: number
  isInView: boolean
}

function TimelineItem({
  item,
  index,
  alternating,
  staggerDelay,
  isInView,
}: TimelineItemProps) {
  const delay = index * staggerDelay + 0.3 // Start after line begins animating

  return (
    <motion.div
      className={cn(
        'relative mb-8 flex items-start gap-8 last:mb-0',
        alternating && (index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse')
      )}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      {/* Animated dot */}
      <motion.div
        className="absolute left-4 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-primary-500 md:left-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{
          ...spring.bouncy,
          delay: delay + 0.1,
        }}
      >
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary-400"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={
            isInView
              ? {
                  scale: [1, 2, 1],
                  opacity: [0.5, 0, 0.5],
                }
              : { scale: 1, opacity: 0 }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: delay + 0.5,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Animated content card */}
      <motion.div
        className={cn(
          'ml-12 rounded-xl bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover md:ml-0 md:w-5/12',
          alternating && (index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto')
        )}
        initial={{
          opacity: 0,
          x: alternating ? (index % 2 === 0 ? -30 : 30) : -30,
          y: 20,
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                x: 0,
                y: 0,
              }
            : {
                opacity: 0,
                x: alternating ? (index % 2 === 0 ? -30 : 30) : -30,
                y: 20,
              }
        }
        transition={{
          ...spring.smooth,
          delay: delay + 0.15,
        }}
        whileHover={{
          y: -4,
          transition: spring.bouncy,
        }}
      >
        {(item.year || item.date) && (
          <motion.span
            className="mb-2 inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-600"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{
              ...spring.bouncy,
              delay: delay + 0.25,
            }}
          >
            {item.year || item.date}
          </motion.span>
        )}
        <h3 className="heading-4 mb-2">{item.title}</h3>
        <div className="body-base">{item.description}</div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// SimpleTimeline - Non-alternating vertical timeline
// ============================================================================

interface SimpleTimelineProps {
  items: TimelineItemData[]
  className?: string
  staggerDelay?: number
}

export function SimpleTimeline({
  items,
  className,
  staggerDelay = 0.12,
}: SimpleTimelineProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })

  if (prefersReducedMotion) {
    return (
      <div className={cn('relative', className)}>
        <div className="absolute left-4 top-0 h-full w-0.5 bg-primary-200" />
        {items.map((item, index) => (
          <div key={index} className="relative mb-6 flex items-start gap-6 last:mb-0">
            <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
              {item.icon || <span className="text-sm font-medium">{index + 1}</span>}
            </div>
            <div className="flex-1 pt-1">
              <h4 className="font-medium text-gray-900">{item.title}</h4>
              <div className="mt-1 text-sm text-gray-600">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Animated line */}
      <motion.div
        className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-primary-300 to-primary-400"
        initial={{ height: 0 }}
        animate={isInView ? { height: '100%' } : { height: 0 }}
        transition={{
          duration: 1,
          ease: [0.19, 1, 0.22, 1],
        }}
      />

      {items.map((item, index) => {
        const delay = index * staggerDelay + 0.2

        return (
          <motion.div
            key={index}
            className="relative mb-6 flex items-start gap-6 last:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{
              ...spring.smooth,
              delay,
            }}
          >
            {/* Numbered/Icon circle */}
            <motion.div
              className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-white"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{
                ...spring.bouncy,
                delay: delay + 0.1,
              }}
            >
              {item.icon || <span className="text-sm font-medium">{index + 1}</span>}
            </motion.div>

            <div className="flex-1 pt-1">
              <h4 className="font-medium text-gray-900">{item.title}</h4>
              <motion.div
                className="mt-1 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: delay + 0.2, duration: 0.3 }}
              >
                {item.description}
              </motion.div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ============================================================================
// HorizontalTimeline - For steps/process flow
// ============================================================================

interface HorizontalTimelineProps {
  items: TimelineItemData[]
  className?: string
}

export function HorizontalTimeline({ items, className }: HorizontalTimelineProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.3 })

  if (prefersReducedMotion) {
    return (
      <div className={cn('flex flex-col gap-4 md:flex-row md:gap-0', className)}>
        {items.map((item, index) => (
          <div key={index} className="flex flex-1 flex-col items-center text-center">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white">
                {item.icon || <span className="text-lg font-bold">{index + 1}</span>}
              </div>
              {index < items.length - 1 && (
                <div className="hidden h-0.5 w-full bg-primary-200 md:block" />
              )}
            </div>
            <h4 className="mt-4 font-medium text-gray-900">{item.title}</h4>
            <div className="mt-2 text-sm text-gray-600">{item.description}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-col gap-4 md:flex-row md:gap-0', className)}
    >
      {items.map((item, index) => {
        const delay = index * 0.15

        return (
          <motion.div
            key={index}
            className="flex flex-1 flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              ...spring.smooth,
              delay,
            }}
          >
            <div className="flex w-full items-center">
              {/* Connector line before (except first) */}
              {index > 0 && (
                <motion.div
                  className="hidden h-0.5 flex-1 bg-primary-300 md:block"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: delay - 0.1,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  style={{ transformOrigin: 'left' }}
                />
              )}

              {/* Circle */}
              <motion.div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-white"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{
                  ...spring.bouncy,
                  delay: delay + 0.1,
                }}
              >
                {item.icon || <span className="text-lg font-bold">{index + 1}</span>}
              </motion.div>

              {/* Connector line after (except last) */}
              {index < items.length - 1 && (
                <motion.div
                  className="hidden h-0.5 flex-1 bg-primary-300 md:block"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: delay + 0.2,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  style={{ transformOrigin: 'left' }}
                />
              )}
            </div>

            <motion.h4
              className="mt-4 font-medium text-gray-900"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: delay + 0.2, duration: 0.3 }}
            >
              {item.title}
            </motion.h4>
            <motion.div
              className="mt-2 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: delay + 0.3, duration: 0.3 }}
            >
              {item.description}
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
