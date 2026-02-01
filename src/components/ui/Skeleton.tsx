'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer shimmer-bg rounded-lg bg-gray-200',
        className
      )}
    />
  )
}

function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-2xl bg-white p-6 shadow-card', className)}>
      <Skeleton className="h-12 w-12 rounded-xl" />
      <Skeleton className="mt-4 h-6 w-3/4" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-2/3" />
    </div>
  )
}

function SkeletonText({ lines = 3, className }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-2/3' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

function SkeletonAvatar({ size = 'md', className }: SkeletonProps & { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  }

  return <Skeleton className={cn('rounded-full', sizes[size], className)} />
}

function SkeletonButton({ size = 'md', className }: SkeletonProps & { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-9 w-24',
    md: 'h-11 w-32',
    lg: 'h-14 w-40',
  }

  return <Skeleton className={cn('rounded-xl', sizes[size], className)} />
}

export { Skeleton, SkeletonCard, SkeletonText, SkeletonAvatar, SkeletonButton }
