'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'subtle'
  hover?: boolean
  glow?: boolean
  glowColor?: 'primary' | 'accent'
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant = 'default',
      hover = true,
      glow = false,
      glowColor = 'primary',
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-white/70 backdrop-blur-[20px] border border-white/30',
      strong: 'bg-white/85 backdrop-blur-[30px] border border-white/40',
      subtle: 'bg-white/50 backdrop-blur-[15px] border border-white/20',
    }

    const glowStyles = {
      primary: 'shadow-glow-primary',
      accent: 'shadow-glow-accent',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-6 shadow-glass transition-all duration-300',
          variants[variant],
          hover && 'hover:bg-white/80 hover:shadow-glass-hover hover:-translate-y-1',
          glow && glowStyles[glowColor],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export { GlassCard }
