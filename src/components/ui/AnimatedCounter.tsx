'use client'

import { useCounter, useInView } from '@/hooks'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2000,
  className,
}: AnimatedCounterProps) {
  const { ref, isInView } = useInView<HTMLSpanElement>({ threshold: 0.5 })
  const count = useCounter({ end, duration, enabled: isInView })

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
