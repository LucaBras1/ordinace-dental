'use client'

import { cn } from '@/lib/utils'

interface SkipLinkProps {
  href?: string
  className?: string
  children?: React.ReactNode
}

export function SkipLink({
  href = '#main-content',
  className,
  children = 'Přeskočit na hlavní obsah',
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'skip-link',
        'sr-only focus:not-sr-only',
        'focus:absolute focus:top-4 focus:left-4 focus:z-[100]',
        'focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white',
        'focus:rounded-lg focus:shadow-lg focus:outline-none',
        'focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500',
        className
      )}
    >
      {children}
    </a>
  )
}
