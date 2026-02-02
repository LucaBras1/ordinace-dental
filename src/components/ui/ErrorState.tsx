'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring, fadeInUp } from '@/lib/animations'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({
  title = 'Něco se pokazilo',
  description = 'Omlouváme se, nastala neočekávaná chyba. Zkuste to prosím znovu.',
  onRetry,
  retryLabel = 'Zkusit znovu',
  className = '',
}: ErrorStateProps) {
  const prefersReducedMotion = useReducedMotion()

  const AlertIcon = () => (
    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  )

  if (prefersReducedMotion) {
    return (
      <div className={`flex flex-col items-center py-12 text-center ${className}`}>
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-error-light text-error">
          <AlertIcon />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-2 max-w-sm text-center text-gray-500">{description}</p>
        )}
        {onRetry && (
          <div className="mt-6">
            <Button onClick={onRetry}>{retryLabel}</Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.div
      className={`flex flex-col items-center py-12 text-center ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {/* Animated icon with attention effect */}
      <motion.div
        className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-error-light text-error"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring.bouncy}
      >
        <motion.div
          animate={{
            rotate: [0, -5, 5, -5, 5, 0],
          }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            ease: 'easeInOut',
          }}
        >
          <AlertIcon />
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

      {/* Retry button */}
      {onRetry && (
        <motion.div className="mt-6" variants={fadeInUp}>
          <Button onClick={onRetry}>{retryLabel}</Button>
        </motion.div>
      )}
    </motion.div>
  )
}
