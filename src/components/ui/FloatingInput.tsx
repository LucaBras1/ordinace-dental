'use client'

import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  success?: boolean
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, success, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue)

    const inputId = id || `floating-input-${label.toLowerCase().replace(/\s+/g, '-')}`

    return (
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'peer w-full rounded-xl border-2 bg-white px-4 pb-2 pt-6 text-gray-900 outline-none transition-all duration-200',
            'placeholder-transparent',
            error
              ? 'border-error animate-[shake_0.5s_ease-in-out]'
              : isFocused
                ? 'border-primary-500 ring-4 ring-primary-100'
                : success
                  ? 'border-success'
                  : 'border-gray-200 hover:border-gray-300',
            className
          )}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false)
            setHasValue(!!e.target.value)
          }}
          onChange={(e) => {
            setHasValue(!!e.target.value)
            props.onChange?.(e)
          }}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'absolute left-4 transition-all duration-200 pointer-events-none',
            isFocused || hasValue
              ? 'top-2 text-xs font-medium'
              : 'top-1/2 -translate-y-1/2 text-base',
            error
              ? 'text-error'
              : isFocused
                ? 'text-primary-600'
                : success
                  ? 'text-success'
                  : 'text-gray-500'
          )}
        >
          {label}
        </label>

        {/* Success checkmark */}
        {success && !error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              className="h-5 w-5 text-success animate-scale-in"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="mt-1.5 text-sm text-error animate-slide-down">{error}</p>
        )}
      </div>
    )
  }
)

FloatingInput.displayName = 'FloatingInput'

export { FloatingInput }
