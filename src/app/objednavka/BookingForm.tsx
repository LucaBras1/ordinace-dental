'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'

const serviceOptions = [
  { value: 'dentalni-hygiena', label: 'Dentální hygiena' },
  { value: 'beleni-zubu', label: 'Bělení zubů' },
  { value: 'air-flow', label: 'Air-Flow' },
  { value: 'parodontologie', label: 'Parodontologie' },
  { value: 'konzultace', label: 'Vstupní konzultace (zdarma)' },
]

const timeOptions = [
  { value: 'morning', label: 'Dopoledne (8:00 - 12:00)' },
  { value: 'afternoon', label: 'Odpoledne (12:00 - 17:00)' },
  { value: 'any', label: 'Kdykoliv' },
]

export function BookingForm() {
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
      <div
        className="rounded-xl bg-success-50 p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
          <svg
            className="h-8 w-8 text-success-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="heading-3 mb-2 text-success-800">
          Rezervace přijata
        </h3>
        <p className="body-base text-success-700">
          Děkujeme za vaši rezervaci. Ozveme se vám do 24 hodin s potvrzením
          termínu.
        </p>
        <p className="mt-4 text-sm text-success-600">
          Potvrzení bylo odesláno na váš e-mail.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service selection */}
      <Select
        label="Vyberte službu"
        name="service"
        options={serviceOptions}
        placeholder="Vyberte službu..."
        required
      />

      {/* Personal info */}
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
          required
        />
      </div>

      <Input
        label="E-mail"
        name="email"
        type="email"
        placeholder="jan@example.cz"
        required
      />

      {/* Date preference */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Preferovaný termín"
          name="date"
          type="date"
          min={new Date().toISOString().split('T')[0]}
          required
        />
        <Select
          label="Preferovaný čas"
          name="time"
          options={timeOptions}
          placeholder="Vyberte čas..."
          required
        />
      </div>

      {/* Note */}
      <Textarea
        label="Poznámka"
        name="note"
        placeholder="Máte nějaké speciální požadavky nebo dotazy? (nepovinné)"
        rows={3}
        helperText="Např. alergie, zdravotní omezení, preference"
      />

      {/* First visit checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="firstVisit"
          name="firstVisit"
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="firstVisit" className="text-sm text-gray-600">
          Toto je moje první návštěva
        </label>
      </div>

      {/* GDPR */}
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
          za účelem vyřízení mé rezervace.
        </label>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
      >
        Odeslat rezervaci
      </Button>
    </form>
  )
}
