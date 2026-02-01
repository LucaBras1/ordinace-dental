'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { FloatingInput } from '@/components/ui/FloatingInput'
import { DateTimePicker } from './DateTimePicker'
import { useSwipe } from '@/hooks/useSwipe'

interface Service {
  id: string
  name: string
  price: number
  duration: string
}

interface MobileBookingWizardProps {
  services: Service[]
  onSubmit?: (data: BookingData) => void
  className?: string
}

interface BookingData {
  service: string
  date: Date | null
  time: string | null
  name: string
  email: string
  phone: string
  notes: string
}

const STEPS = [
  { id: 1, title: 'Služba', icon: 'sparkles' },
  { id: 2, title: 'Termín', icon: 'calendar' },
  { id: 3, title: 'Údaje', icon: 'user' },
  { id: 4, title: 'Souhrn', icon: 'check' },
]

export function MobileBookingWizard({ services, onSubmit, className }: MobileBookingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [booking, setBooking] = useState<BookingData>({
    service: '',
    date: null,
    time: null,
    name: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedService = services.find((s) => s.id === booking.service)

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return !!booking.service
      case 2:
        return !!booking.date && !!booking.time
      case 3:
        return !!booking.name && !!booking.email && !!booking.phone
      default:
        return true
    }
  }, [currentStep, booking])

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step)
    }
  }

  const { handlers } = useSwipe({
    threshold: 80,
    onSwipeLeft: () => canProceed() && currentStep < 4 && goToStep(currentStep + 1),
    onSwipeRight: () => currentStep > 1 && goToStep(currentStep - 1),
  })

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onSubmit?.(booking)
    setIsSubmitting(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3">
            <p className="text-gray-600 mb-4">Vyberte požadovanou službu:</p>
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setBooking((prev) => ({ ...prev, service: service.id }))}
                className={cn(
                  'w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left',
                  booking.service === service.id
                    ? 'border-primary-500 bg-primary-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-500">{service.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{service.price} Kč</p>
                  {booking.service === service.id && (
                    <svg
                      className="ml-auto mt-1 h-5 w-5 text-primary-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        )

      case 2:
        return (
          <DateTimePicker
            selectedDate={booking.date}
            selectedTime={booking.time}
            onDateChange={(date) => setBooking((prev) => ({ ...prev, date, time: null }))}
            onTimeChange={(time) => setBooking((prev) => ({ ...prev, time }))}
          />
        )

      case 3:
        return (
          <div className="space-y-4">
            <FloatingInput
              label="Jméno a příjmení"
              value={booking.name}
              onChange={(e) => setBooking((prev) => ({ ...prev, name: e.target.value }))}
            />
            <FloatingInput
              label="Email"
              type="email"
              value={booking.email}
              onChange={(e) => setBooking((prev) => ({ ...prev, email: e.target.value }))}
            />
            <FloatingInput
              label="Telefon"
              type="tel"
              value={booking.phone}
              onChange={(e) => setBooking((prev) => ({ ...prev, phone: e.target.value }))}
            />
            <div className="relative">
              <textarea
                placeholder="Poznámka (nepovinné)"
                value={booking.notes}
                onChange={(e) => setBooking((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Služba</span>
                <span className="font-medium text-gray-900">{selectedService?.name}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Datum</span>
                <span className="font-medium text-gray-900">
                  {booking.date?.toLocaleDateString('cs-CZ', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Čas</span>
                <span className="font-medium text-gray-900">{booking.time}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Jméno</span>
                <span className="font-medium text-gray-900">{booking.name}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900">{booking.email}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Telefon</span>
                <span className="font-medium text-gray-900">{booking.phone}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-medium text-gray-900">Cena</span>
                <span className="text-xl font-bold text-primary-600">
                  {selectedService?.price} Kč
                </span>
              </div>
            </GlassCard>

            <p className="text-sm text-gray-500 text-center">
              Kliknutím na &quot;Potvrdit rezervaci&quot; souhlasíte s{' '}
              <a href="/podminky" className="text-primary-500 hover:underline">
                obchodními podmínkami
              </a>
            </p>
          </div>
        )
    }
  }

  return (
    <div className={cn('', className)}>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8 px-4">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => step.id < currentStep && goToStep(step.id)}
              disabled={step.id > currentStep}
              className={cn(
                'flex flex-col items-center gap-1 transition-all',
                step.id <= currentStep ? 'opacity-100' : 'opacity-40'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-all touch-target',
                  step.id === currentStep
                    ? 'bg-primary-500 text-white shadow-lg scale-110'
                    : step.id < currentStep
                      ? 'bg-accent-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                )}
              >
                {step.id < currentStep ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <span className="text-xs font-medium text-gray-600 hidden sm:block">
                {step.title}
              </span>
            </button>

            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-8 sm:w-12 mx-2 transition-colors',
                  step.id < currentStep ? 'bg-accent-500' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div
        className="min-h-[400px]"
        {...handlers}
      >
        {renderStepContent()}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-8">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={() => goToStep(currentStep - 1)}
            className="flex-1"
          >
            Zpět
          </Button>
        )}

        {currentStep < 4 ? (
          <Button
            variant="gradient"
            onClick={() => goToStep(currentStep + 1)}
            disabled={!canProceed()}
            className="flex-1"
          >
            Pokračovat
          </Button>
        ) : (
          <Button
            variant="gradient"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="flex-1"
          >
            Potvrdit rezervaci
          </Button>
        )}
      </div>

      {/* Swipe hint for mobile */}
      <p className="text-center text-xs text-gray-400 mt-4 sm:hidden">
        Swipněte pro navigaci mezi kroky
      </p>
    </div>
  )
}
