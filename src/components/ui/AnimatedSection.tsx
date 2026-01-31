'use client'

import { type ReactNode } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

type AnimationType = 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'scale-in' | 'slide-up'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: AnimationType
  delay?: 0 | 100 | 200 | 300 | 400 | 500
  as?: 'div' | 'section' | 'article' | 'aside'
  threshold?: number
}

const animationClasses: Record<AnimationType, { initial: string; visible: string }> = {
  'fade-in': {
    initial: 'opacity-0',
    visible: 'opacity-100',
  },
  'fade-in-up': {
    initial: 'opacity-0 translate-y-8',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-in-down': {
    initial: 'opacity-0 -translate-y-8',
    visible: 'opacity-100 translate-y-0',
  },
  'scale-in': {
    initial: 'opacity-0 scale-95',
    visible: 'opacity-100 scale-100',
  },
  'slide-up': {
    initial: 'opacity-0 translate-y-12',
    visible: 'opacity-100 translate-y-0',
  },
}

const delayClasses: Record<number, string> = {
  0: '',
  100: 'animation-delay-100',
  200: 'animation-delay-200',
  300: 'animation-delay-300',
  400: 'animation-delay-400',
  500: 'animation-delay-500',
}

export function AnimatedSection({
  children,
  className,
  animation = 'fade-in-up',
  delay = 0,
  as: Component = 'div',
  threshold = 0.1,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold })

  const { initial, visible } = animationClasses[animation]

  return (
    <Component
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out-expo',
        isVisible ? visible : initial,
        delay > 0 && delayClasses[delay],
        className
      )}
    >
      {children}
    </Component>
  )
}

interface AnimatedItemProps {
  children: ReactNode
  className?: string
  animation?: AnimationType
  index?: number
  baseDelay?: number
}

export function AnimatedItem({
  children,
  className,
  animation = 'fade-in-up',
  index = 0,
  baseDelay = 100,
}: AnimatedItemProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()

  const { initial, visible } = animationClasses[animation]
  const delayMs = index * baseDelay

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-500 ease-out-expo',
        isVisible ? visible : initial,
        className
      )}
      style={{ transitionDelay: isVisible ? `${delayMs}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
