import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  href?: string
  hover?: boolean
}

export function Card({ children, className, href, hover = true }: CardProps) {
  const baseStyles = cn(
    'rounded-2xl bg-white p-6 shadow-card transition-all duration-300',
    hover && 'hover:shadow-card-hover hover:-translate-y-1',
    className
  )

  if (href) {
    return (
      <Link href={href} className={cn(baseStyles, 'block')}>
        {children}
      </Link>
    )
  }

  return <div className={baseStyles}>{children}</div>
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

interface CardTitleProps {
  children: ReactNode
  className?: string
  as?: 'h2' | 'h3' | 'h4'
}

export function CardTitle({
  children,
  className,
  as: Tag = 'h3',
}: CardTitleProps) {
  return (
    <Tag className={cn('heading-4 text-gray-900', className)}>{children}</Tag>
  )
}

interface CardDescriptionProps {
  children: ReactNode
  className?: string
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return <p className={cn('body-base mt-2', className)}>{children}</p>
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={className}>{children}</div>
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cn('mt-4 pt-4 border-t border-gray-100', className)}>{children}</div>
}
