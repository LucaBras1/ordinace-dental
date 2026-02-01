'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { DateTimePicker } from '@/components/booking/DateTimePicker'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/booking-utils'

interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  price: number // haléře
  depositAmount: number // haléře
  duration: number // minuty
}

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingFormData {
  serviceId: string
  date: string
  time: string
  name: string
  phone: string
  email: string
  note: string
  gdprConsent: boolean
}

type Step = 1 | 2 | 3 | 4

export function BookingForm() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [services, setServices] = useState<Service[]>([])
  const [availableSlots, setAvailableSlots] = useState<Record<string, TimeSlot[]>>({})
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedService = services.find((s) => s.id === selectedServiceId)

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true)
        setError(null)
        const response = await fetch('/api/services')

        if (!response.ok) {
          throw new Error('Nepodařilo se načíst služby')
        }

        const data = await response.json()
        setServices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Chyba při načítání služeb')
      } finally {
        setIsLoadingServices(false)
      }
    }

    fetchServices()
  }, [])

  // Fetch availability when date changes
  useEffect(() => {
    if (!selectedDate) return

    const fetchAvailability = async () => {
      try {
        setIsLoadingSlots(true)
        const dateStr = selectedDate.toISOString().split('T')[0]
        const response = await fetch(`/api/availability?date=${dateStr}`)

        if (!response.ok) {
          throw new Error('Nepodařilo se načíst dostupnost')
        }

        const data = await response.json()
        setAvailableSlots((prev) => ({
          ...prev,
          [dateStr]: data.slots || [],
        }))
      } catch (err) {
        console.error('Error fetching availability:', err)
        // Don't show error to user, just use empty slots
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchAvailability()
  }, [selectedDate])

  // Validation functions
  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!selectedServiceId) {
        newErrors.service = 'Vyberte prosím službu'
      }
    }

    if (step === 2) {
      if (!selectedDate) {
        newErrors.date = 'Vyberte prosím datum'
      }
      if (!selectedTime) {
        newErrors.time = 'Vyberte prosím čas'
      }
    }

    if (step === 3) {
      if (!name.trim()) {
        newErrors.name = 'Vyplňte prosím jméno a příjmení'
      }
      if (!phone.trim()) {
        newErrors.phone = 'Vyplňte prosím telefonní číslo'
      } else if (!/^\+420\s?\d{3}\s?\d{3}\s?\d{3}$/.test(phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Zadejte telefon ve formátu +420 123 456 789'
      }
      if (!email.trim()) {
        newErrors.email = 'Vyplňte prosím e-mail'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Zadejte platnou e-mailovou adresu'
      }
    }

    if (step === 4) {
      if (!gdprConsent) {
        newErrors.gdpr = 'Pro odeslání rezervace je nutný souhlas se zpracováním osobních údajů'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4) as Step)
    }
  }

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step)
    setErrors({})
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateStep(4)) return

    try {
      setIsSubmitting(true)
      setError(null)

      const bookingData: BookingFormData = {
        serviceId: selectedServiceId,
        date: selectedDate!.toISOString().split('T')[0],
        time: selectedTime!,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        note: note.trim(),
        gdprConsent,
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Nepodařilo se vytvořit rezervaci')
      }

      const { paymentUrl } = await response.json()

      // Redirect to payment gateway
      window.location.href = paymentUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při vytváření rezervace')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all',
                  currentStep >= step
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-500'
                )}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={cn(
                    'h-1 flex-1 mx-2 rounded transition-all',
                    currentStep > step ? 'bg-primary-500' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className={currentStep === 1 ? 'font-semibold text-primary-600' : ''}>
            Služba
          </span>
          <span className={currentStep === 2 ? 'font-semibold text-primary-600' : ''}>
            Termín
          </span>
          <span className={currentStep === 3 ? 'font-semibold text-primary-600' : ''}>
            Kontakt
          </span>
          <span className={currentStep === 4 ? 'font-semibold text-primary-600' : ''}>
            Souhrn
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 rounded-xl bg-error-50 border border-error-200 p-4 text-error-700">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-error-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Vyberte službu
              </h2>

              {isLoadingServices ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-32 rounded-xl bg-gray-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Momentálně nejsou k dispozici žádné služby
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        setSelectedServiceId(service.id)
                        setErrors({})
                      }}
                      className={cn(
                        'w-full text-left p-5 rounded-xl border-2 transition-all hover:shadow-md',
                        selectedServiceId === service.id
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-primary-200'
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {service.name}
                          </h3>
                          {service.description && (
                            <p className="text-sm text-gray-600 mb-3">
                              {service.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">
                              Doba: {service.duration} min
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="font-semibold text-primary-600">
                              {formatPrice(service.price)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Záloha</div>
                          <div className="font-semibold text-accent-600">
                            {formatPrice(service.depositAmount)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {errors.service && (
                <p className="text-sm text-error-500 mt-2">{errors.service}</p>
              )}
            </motion.div>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Vyberte termín
              </h2>

              <DateTimePicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateChange={(date) => {
                  setSelectedDate(date)
                  setSelectedTime(null)
                  setErrors({})
                }}
                onTimeChange={(time) => {
                  setSelectedTime(time)
                  setErrors({})
                }}
                availableSlots={availableSlots}
              />

              {isLoadingSlots && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Načítám dostupné časy...
                </div>
              )}

              {errors.date && (
                <p className="text-sm text-error-500 mt-2">{errors.date}</p>
              )}
              {errors.time && (
                <p className="text-sm text-error-500 mt-2">{errors.time}</p>
              )}
            </motion.div>
          )}

          {/* Step 3: Contact Info */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Kontaktní údaje
              </h2>

              <Input
                label="Jméno a příjmení"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setErrors((prev) => ({ ...prev, name: '' }))
                }}
                placeholder="Jan Novák"
                required
                error={errors.name}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Telefon"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setErrors((prev) => ({ ...prev, phone: '' }))
                  }}
                  placeholder="+420 123 456 789"
                  required
                  error={errors.phone}
                />

                <Input
                  label="E-mail"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors((prev) => ({ ...prev, email: '' }))
                  }}
                  placeholder="jan@example.cz"
                  required
                  error={errors.email}
                />
              </div>

              <Textarea
                label="Poznámka"
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Máte nějaké speciální požadavky nebo dotazy? (nepovinné)"
                rows={4}
                helperText="Např. alergie, zdravotní omezení, preference"
              />
            </motion.div>
          )}

          {/* Step 4: Summary & Payment */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Souhrn rezervace
              </h2>

              <div className="space-y-4 mb-6">
                {/* Service */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="text-sm text-gray-500 mb-1">Služba</div>
                  <div className="font-semibold text-gray-900">
                    {selectedService?.name}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Doba trvání: {selectedService?.duration} minut
                  </div>
                </div>

                {/* Date & Time */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="text-sm text-gray-500 mb-1">Termín</div>
                  <div className="font-semibold text-gray-900">
                    {selectedDate?.toLocaleDateString('cs-CZ', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    v {selectedTime}
                  </div>
                </div>

                {/* Contact */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="text-sm text-gray-500 mb-1">Kontakt</div>
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">{name}</div>
                    <div className="text-sm text-gray-600">{phone}</div>
                    <div className="text-sm text-gray-600">{email}</div>
                    {note && (
                      <div className="mt-2 text-sm text-gray-600 italic">
                        Poznámka: {note}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Celková cena</span>
                    <span className="text-xl font-bold text-gray-900">
                      {selectedService && formatPrice(selectedService.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-primary-200">
                    <span className="font-semibold text-accent-700">
                      K úhradě nyní (záloha)
                    </span>
                    <span className="text-2xl font-bold text-accent-600">
                      {selectedService && formatPrice(selectedService.depositAmount)}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    Zbývající částku uhradíte na místě
                  </div>
                </div>
              </div>

              {/* GDPR Consent */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gdprConsent}
                    onChange={(e) => {
                      setGdprConsent(e.target.checked)
                      setErrors((prev) => ({ ...prev, gdpr: '' }))
                    }}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600">
                    Souhlasím se{' '}
                    <a
                      href="/ochrana-osobnich-udaju"
                      target="_blank"
                      className="text-primary-600 underline hover:text-primary-700"
                    >
                      zpracováním osobních údajů
                    </a>{' '}
                    za účelem vyřízení mé rezervace a platby zálohy.
                  </span>
                </label>
                {errors.gdpr && (
                  <p className="text-sm text-error-500 mt-2">{errors.gdpr}</p>
                )}
              </div>

              <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-6">
                <div className="flex gap-3">
                  <svg
                    className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-blue-700">
                    <p className="font-semibold mb-1">Platba zálohy</p>
                    <p>
                      Po kliknutí na tlačítko budete přesměrováni na platební bránu
                      pro úhradu zálohy. Po úspěšné platbě vám bude rezervace
                      potvrzena e-mailem.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={goToPrevStep}
            disabled={currentStep === 1 || isSubmitting}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Zpět
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={goToNextStep}
              disabled={isLoadingServices}
              size="lg"
            >
              Pokračovat
              <svg
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              variant="gradient"
              isLoading={isSubmitting}
              disabled={!gdprConsent}
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Přejít na platbu
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
