'use client'

import { useState, useId, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/animations'

// ============================================================================
// AccordionItem - Single expandable item with spring animations
// ============================================================================

interface AccordionItemProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  /** Optional icon to display before title */
  icon?: ReactNode
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  icon,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-primary-600"
        aria-expanded={isOpen}
        aria-controls={contentId}
        whileHover={prefersReducedMotion ? {} : { x: 4 }}
        transition={spring.snappy}
      >
        <div className="flex items-center gap-3 pr-4">
          {icon && (
            <motion.span
              className="flex-shrink-0 text-primary-500"
              animate={isOpen ? { scale: 1.1 } : { scale: 1 }}
              transition={spring.bouncy}
            >
              {icon}
            </motion.span>
          )}
          <span className="font-medium text-gray-900">{title}</span>
        </div>

        {/* Animated chevron */}
        <motion.svg
          className="h-5 w-5 flex-shrink-0 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : spring.bouncy}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      {/* Animated content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            role="region"
            initial={prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : {
                    height: 'auto',
                    opacity: 1,
                  }
            }
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.15 }
                : {
                    height: spring.smooth,
                    opacity: { duration: 0.2 },
                  }
            }
            className="overflow-hidden"
          >
            <motion.div
              className="body-base pb-5"
              initial={prefersReducedMotion ? {} : { y: -10 }}
              animate={prefersReducedMotion ? {} : { y: 0 }}
              transition={spring.smooth}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// Accordion - Container with staggered reveal
// ============================================================================

interface AccordionProps {
  children: ReactNode
  className?: string
  /** Add animated entrance for the accordion */
  animated?: boolean
}

export function Accordion({ children, className, animated = true }: AccordionProps) {
  const prefersReducedMotion = useReducedMotion()

  if (!animated || prefersReducedMotion) {
    return (
      <div
        className={cn(
          'divide-y divide-gray-200 rounded-2xl bg-white p-6 shadow-card',
          className
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        'divide-y divide-gray-200 rounded-2xl bg-white p-6 shadow-card',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring.smooth}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// AccordionGroup - Multiple accordions with stagger animation
// ============================================================================

interface AccordionGroupItem {
  title: string
  content: ReactNode
  defaultOpen?: boolean
  icon?: ReactNode
}

interface AccordionGroupProps {
  items: AccordionGroupItem[]
  className?: string
  /** Allow multiple items to be open at once */
  allowMultiple?: boolean
}

export function AccordionGroup({
  items,
  className,
  allowMultiple = true,
}: AccordionGroupProps) {
  const prefersReducedMotion = useReducedMotion()
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(items.map((item, i) => (item.defaultOpen ? i : -1)).filter((i) => i >= 0))
  )

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        if (!allowMultiple) {
          next.clear()
        }
        next.add(index)
      }
      return next
    })
  }

  if (prefersReducedMotion) {
    return (
      <div
        className={cn(
          'divide-y divide-gray-200 rounded-2xl bg-white p-6 shadow-card',
          className
        )}
      >
        {items.map((item, index) => (
          <AccordionItemControlled
            key={index}
            title={item.title}
            isOpen={openItems.has(index)}
            onToggle={() => toggleItem(index)}
            icon={item.icon}
            prefersReducedMotion={true}
          >
            {item.content}
          </AccordionItemControlled>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        'divide-y divide-gray-200 rounded-2xl bg-white p-6 shadow-card',
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: spring.smooth,
            },
          }}
        >
          <AccordionItemControlled
            title={item.title}
            isOpen={openItems.has(index)}
            onToggle={() => toggleItem(index)}
            icon={item.icon}
            prefersReducedMotion={false}
          >
            {item.content}
          </AccordionItemControlled>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ============================================================================
// Controlled AccordionItem
// ============================================================================

interface AccordionItemControlledProps {
  title: string
  children: ReactNode
  isOpen: boolean
  onToggle: () => void
  icon?: ReactNode
  prefersReducedMotion: boolean
}

function AccordionItemControlled({
  title,
  children,
  isOpen,
  onToggle,
  icon,
  prefersReducedMotion,
}: AccordionItemControlledProps) {
  const contentId = useId()

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <motion.button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-primary-600"
        aria-expanded={isOpen}
        aria-controls={contentId}
        whileHover={prefersReducedMotion ? {} : { x: 4 }}
        transition={spring.snappy}
      >
        <div className="flex items-center gap-3 pr-4">
          {icon && (
            <motion.span
              className="flex-shrink-0 text-primary-500"
              animate={isOpen ? { scale: 1.1 } : { scale: 1 }}
              transition={spring.bouncy}
            >
              {icon}
            </motion.span>
          )}
          <span className="font-medium text-gray-900">{title}</span>
        </div>

        <motion.svg
          className="h-5 w-5 flex-shrink-0 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : spring.bouncy}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            role="region"
            initial={prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : {
                    height: 'auto',
                    opacity: 1,
                  }
            }
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.15 }
                : {
                    height: spring.smooth,
                    opacity: { duration: 0.2 },
                  }
            }
            className="overflow-hidden"
          >
            <motion.div
              className="body-base pb-5"
              initial={prefersReducedMotion ? {} : { y: -10 }}
              animate={prefersReducedMotion ? {} : { y: 0 }}
              transition={spring.smooth}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// FAQ Accordion - Specialized for FAQ pages
// ============================================================================

interface FAQItem {
  question: string
  answer: string | ReactNode
}

interface FAQAccordionProps {
  items: FAQItem[]
  className?: string
  title?: string
}

export function FAQAccordion({ items, className, title }: FAQAccordionProps) {
  const prefersReducedMotion = useReducedMotion()

  const accordionItems = items.map((item) => ({
    title: item.question,
    content: item.answer,
  }))

  return (
    <div className={className}>
      {title && (
        <motion.h3
          className="heading-3 mb-6"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring.smooth}
        >
          {title}
        </motion.h3>
      )}
      <AccordionGroup items={accordionItems} allowMultiple />
    </div>
  )
}
