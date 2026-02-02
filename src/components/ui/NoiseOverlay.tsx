'use client'

import { memo } from 'react'

interface NoiseOverlayProps {
  opacity?: number
  className?: string
}

/**
 * SVG noise texture overlay for premium visual detail
 * Inspired by Linear, Vercel, and other world-class designs
 */
export const NoiseOverlay = memo(function NoiseOverlay({
  opacity = 0.03,
  className = '',
}: NoiseOverlayProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="noise-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#noise-filter)" />
      </svg>
    </div>
  )
})

/**
 * Inline noise texture for specific elements
 */
export const NoiseTexture = memo(function NoiseTexture({
  opacity = 0.05,
  className = '',
}: NoiseOverlayProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="noise-texture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#noise-texture)" />
      </svg>
    </div>
  )
})
