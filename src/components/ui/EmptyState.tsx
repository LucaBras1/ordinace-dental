'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring, staggerContainer, fadeInUp } from '@/lib/animations'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: 'search' | 'calendar' | 'document' | 'user' | 'inbox'
  action?: React.ReactNode
  className?: string
}

const icons = {
  search: (
    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  calendar: (
    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  document: (
    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  user: (
    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  inbox: (
    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  ),
}

export function EmptyState({
  title,
  description,
  icon = 'inbox',
  action,
  className = '',
}: EmptyStateProps) {
  const prefersReducedMotion = useReducedMotion()

  const content = (
    <>
      {/* Animated icon */}
      <motion.div
        className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400"
        initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring.bouncy}
      >
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, -4, 0],
                }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {icons[icon]}
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-lg font-semibold text-gray-900"
        variants={fadeInUp}
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          className="mt-2 max-w-sm text-center text-gray-500"
          variants={fadeInUp}
        >
          {description}
        </motion.p>
      )}

      {/* Action */}
      {action && (
        <motion.div className="mt-6" variants={fadeInUp}>
          {action}
        </motion.div>
      )}
    </>
  )

  if (prefersReducedMotion) {
    return (
      <div className={`flex flex-col items-center py-12 text-center ${className}`}>
        {content}
      </div>
    )
  }

  return (
    <motion.div
      className={`flex flex-col items-center py-12 text-center ${className}`}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {content}
    </motion.div>
  )
}
