'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface NewsletterSignupProps {
  className?: string
  variant?: 'card' | 'inline'
}

export function NewsletterSignup({ className, variant = 'card' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email) {
      setErrorMessage('Prosím zadejte email')
      setStatus('error')
      return
    }

    if (!gdprConsent) {
      setErrorMessage('Prosím potvrďte souhlas se zpracováním údajů')
      setStatus('error')
      return
    }

    setStatus('loading')

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In production, replace with actual API call
    setStatus('success')
    setEmail('')
    setGdprConsent(false)
  }

  if (status === 'success') {
    return (
      <GlassCard className={cn('text-center', className)}>
        <div className="flex flex-col items-center py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Děkujeme za přihlášení!</h3>
          <p className="mt-2 text-gray-600">
            Vaše sleva 10% na první návštěvu vám byla odeslána na email.
          </p>
        </div>
      </GlassCard>
    )
  }

  const content = (
    <>
      {/* Incentive badge */}
      <div className="inline-flex items-center gap-2 rounded-full bg-accent-100 px-3 py-1 text-sm font-medium text-accent-700">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
        Sleva 10% na první návštěvu
      </div>

      <h3 className="mt-4 text-xl font-semibold text-gray-900">
        Získejte tipy pro zdravý úsměv
      </h3>
      <p className="mt-2 text-gray-600">
        Přihlaste se k odběru a získejte slevu 10% na první návštěvu.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <input
            type="email"
            placeholder="Váš email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            className={cn(
              'w-full rounded-xl border-2 bg-white px-4 py-3 outline-none transition-all',
              status === 'error'
                ? 'border-error focus:border-error focus:ring-error-light'
                : 'border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
            )}
          />
        </div>

        {/* GDPR checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={gdprConsent}
            onChange={(e) => {
              setGdprConsent(e.target.checked)
              if (status === 'error') setStatus('idle')
            }}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-500">
            Souhlasím se zpracováním osobních údajů za účelem zasílání informací o dentální hygieně.
            <a href="/gdpr" className="text-primary-500 hover:underline ml-1">
              Více informací
            </a>
          </span>
        </label>

        {status === 'error' && (
          <p className="text-sm text-error animate-slide-down">{errorMessage}</p>
        )}

        <Button
          type="submit"
          variant="gradient"
          className="w-full"
          isLoading={status === 'loading'}
        >
          Odebírat novinky
        </Button>
      </form>
    </>
  )

  if (variant === 'inline') {
    return <div className={className}>{content}</div>
  }

  return (
    <GlassCard className={className} glow glowColor="accent">
      {content}
    </GlassCard>
  )
}
