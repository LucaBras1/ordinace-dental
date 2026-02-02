'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring, staggerContainer, fadeInUp } from '@/lib/animations'
import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  centered?: boolean
  /** Zobrazit breadcrumbs pouze na podstránkách (2+ úroveň hloubky) */
  showBreadcrumbs?: boolean
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dentalni-hygiena.cz'

// Animated Breadcrumbs component
function AnimatedBreadcrumbs({
  items,
  prefersReducedMotion,
}: {
  items: BreadcrumbItem[]
  prefersReducedMotion: boolean
}) {
  // Schema.org structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `${SITE_URL}${item.href}` }),
    })),
  }

  if (prefersReducedMotion) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary-600"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </>
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <motion.nav
        aria-label="Breadcrumb"
        className="mb-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <ol className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
          {items.map((item, index) => (
            <motion.li
              key={index}
              className="flex items-center gap-2"
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    ...spring.smooth,
                    delay: index * 0.1,
                  },
                },
              }}
            >
              {index > 0 && (
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-primary-600"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900" aria-current="page">
                  {item.label}
                </span>
              )}
            </motion.li>
          ))}
        </ol>
      </motion.nav>
    </>
  )
}

// Title with word-by-word reveal animation
function AnimatedTitle({
  children,
  prefersReducedMotion,
  hasBreadcrumbs,
}: {
  children: string
  prefersReducedMotion: boolean
  hasBreadcrumbs: boolean
}) {
  const words = children.split(' ')

  if (prefersReducedMotion) {
    return (
      <h1 className={`heading-1 ${hasBreadcrumbs ? '' : 'mt-4'} text-balance`}>
        {children}
      </h1>
    )
  }

  return (
    <motion.h1
      className={`heading-1 ${hasBreadcrumbs ? '' : 'mt-4'} text-balance [perspective:1000px]`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.2,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={{
              hidden: {
                opacity: 0,
                y: 40,
                rotateX: -90,
              },
              visible: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                transition: spring.smooth,
              },
            }}
            style={{
              willChange: 'transform, opacity',
              transformOrigin: 'bottom center',
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </motion.h1>
  )
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  centered = true,
  showBreadcrumbs = false,
}: PageHeaderProps) {
  const prefersReducedMotion = useReducedMotion()
  const shouldShowBreadcrumbs = showBreadcrumbs && breadcrumbs && breadcrumbs.length > 0

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16 md:py-20">
      {/* Animated decorative elements */}
      <motion.div
        className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl"
        initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
        animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent-100/50 blur-3xl"
        initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
        animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />

      <div className="container-custom relative">
        {shouldShowBreadcrumbs && breadcrumbs && (
          <AnimatedBreadcrumbs
            items={breadcrumbs}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}

        <div className={centered ? 'text-center' : ''}>
          <AnimatedTitle
            prefersReducedMotion={prefersReducedMotion}
            hasBreadcrumbs={!!shouldShowBreadcrumbs}
          >
            {title}
          </AnimatedTitle>

          {subtitle && (
            <motion.p
              className="body-large mx-auto mt-4 max-w-2xl text-balance"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{
                ...spring.smooth,
                delay: 0.5,
              }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* Animated underline */}
          <motion.div
            className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-primary-400 to-accent-400"
            initial={prefersReducedMotion ? {} : { scaleX: 0, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { scaleX: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.7,
              ease: [0.19, 1, 0.22, 1],
            }}
            style={{ transformOrigin: 'center' }}
          />
        </div>
      </div>
    </section>
  )
}
