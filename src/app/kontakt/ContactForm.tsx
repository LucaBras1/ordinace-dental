'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="rounded-xl bg-success-50 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
          <svg
            className="h-6 w-6 text-success-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="heading-4 mb-2 text-success-800">Zpráva odeslána</h3>
        <p className="text-success-700">
          Děkujeme za vaši zprávu. Ozveme se vám co nejdříve.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Jméno a příjmení"
          name="name"
          placeholder="Jan Novák"
          required
        />
        <Input
          label="Telefon"
          name="phone"
          type="tel"
          placeholder="+420 123 456 789"
        />
      </div>
      <Input
        label="E-mail"
        name="email"
        type="email"
        placeholder="jan@example.cz"
        required
      />
      <Textarea
        label="Vaše zpráva"
        name="message"
        placeholder="Napište nám, s čím vám můžeme pomoci..."
        rows={5}
        required
      />
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="gdpr"
          name="gdpr"
          required
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="gdpr" className="text-sm text-gray-600">
          Souhlasím se{' '}
          <a
            href="/ochrana-osobnich-udaju"
            className="text-primary-600 underline hover:text-primary-700"
          >
            zpracováním osobních údajů
          </a>{' '}
          za účelem vyřízení mého dotazu.
        </label>
      </div>
      <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
        Odeslat zprávu
      </Button>
    </form>
  )
}
