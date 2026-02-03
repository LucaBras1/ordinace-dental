'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'

interface BookingDetail {
  id: string
  customerName: string
  customerEmail: string
  appointmentDate: string
  appointmentTime: string
  status: string
  depositAmount: number
  service: {
    name: string
    price: number
    duration: number
  }
}

function LoadingState() {
  return (
    <>
      <PageHeader
        title="Načítám rezervaci..."
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Rezervace' },
        ]}
      />
      <section className="section-padding">
        <div className="container-width">
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        </div>
      </section>
    </>
  )
}

function BookingConfirmationContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('id')
  const status = searchParams.get('status')

  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bookingId) {
      setError('Chybí ID rezervace')
      setLoading(false)
      return
    }

    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`)
        if (!response.ok) {
          throw new Error('Rezervace nenalezena')
        }
        const data = await response.json()
        setBooking(data.booking)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nepodařilo se načíst rezervaci')
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('cs-CZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatPrice = (halere: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
    }).format(halere / 100)
  }

  if (loading) {
    return <LoadingState />
  }

  if (error || !booking) {
    return (
      <>
        <PageHeader
          title="Chyba"
          breadcrumbs={[
            { label: 'Domů', href: '/' },
            { label: 'Rezervace' },
          ]}
        />
        <section className="section-padding">
          <div className="container-width">
            <div className="mx-auto max-w-lg rounded-2xl bg-error-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-100">
                <svg
                  className="h-8 w-8 text-error-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="heading-3 mb-2 text-error-800">
                {error || 'Rezervace nenalezena'}
              </h2>
              <p className="body-base mb-6 text-error-700">
                Omlouváme se, ale nepodařilo se načíst vaši rezervaci.
              </p>
              <Link href="/objednavka">
                <Button variant="primary">Vytvořit novou rezervaci</Button>
              </Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  // Success - payment confirmed
  if (status === 'success' || booking.status === 'PAID') {
    return (
      <>
        <PageHeader
          title="Rezervace potvrzena"
          breadcrumbs={[
            { label: 'Domů', href: '/' },
            { label: 'Rezervace potvrzena' },
          ]}
        />
        <section className="section-padding">
          <div className="container-width">
            <div className="mx-auto max-w-2xl">
              {/* Success message */}
              <div className="mb-8 rounded-2xl bg-success-50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success-100">
                  <svg
                    className="h-10 w-10 text-success-600"
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
                <h2 className="heading-2 mb-2 text-success-800">
                  Platba přijata!
                </h2>
                <p className="body-large text-success-700">
                  Vaše rezervace je potvrzena. Těšíme se na vás!
                </p>
              </div>

              {/* Booking details */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
                <h3 className="heading-4 mb-4">Detail rezervace</h3>

                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Služba</span>
                    <span className="font-medium text-gray-900">
                      {booking.service.name}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Datum</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(booking.appointmentDate)}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Čas</span>
                    <span className="font-medium text-gray-900">
                      {booking.appointmentTime}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Délka ošetření</span>
                    <span className="font-medium text-gray-900">
                      {booking.service.duration} minut
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Zaplacená kauce</span>
                    <span className="font-medium text-success-600">
                      {formatPrice(booking.depositAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Zbývá k úhradě</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(booking.service.price - booking.depositAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* What to expect */}
              <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-6">
                <h3 className="heading-4 mb-3 text-primary-800">
                  Co očekávat
                </h3>
                <ul className="space-y-2 text-primary-700">
                  <li className="flex items-start gap-2">
                    <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Potvrzení rezervace bylo odesláno na váš email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Den před termínem vám pošleme připomínku</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Přijďte prosím 5 minut před termínem</span>
                  </li>
                </ul>
              </div>

              {/* Cancellation info */}
              <div className="mt-6 rounded-2xl bg-gray-50 p-6">
                <h3 className="heading-4 mb-2">Storno podmínky</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>Zrušení více než 48 hodin předem: plný refund kauce</li>
                  <li>Zrušení 24-48 hodin předem: 50% kauce vráceno</li>
                  <li>Zrušení méně než 24 hodin předem: kauce propadá</li>
                </ul>
                <p className="mt-3 text-sm text-gray-500">
                  Pro zrušení rezervace nás kontaktujte na{' '}
                  <a href="tel:+420601532676" className="text-primary-600 hover:underline">
                    +420 601 532 676
                  </a>
                </p>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Zpět na hlavní stránku
                  </Button>
                </Link>
                <Link href="/kontakt">
                  <Button variant="primary" className="w-full sm:w-auto">
                    Kontaktovat ordinaci
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  // Pending payment
  if (booking.status === 'PENDING_PAYMENT') {
    return (
      <>
        <PageHeader
          title="Čeká na platbu"
          breadcrumbs={[
            { label: 'Domů', href: '/' },
            { label: 'Rezervace' },
          ]}
        />
        <section className="section-padding">
          <div className="container-width">
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 rounded-2xl bg-warning-50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-warning-100">
                  <svg
                    className="h-10 w-10 text-warning-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="heading-2 mb-2 text-warning-800">
                  Rezervace čeká na platbu
                </h2>
                <p className="body-large text-warning-700">
                  Pro potvrzení rezervace prosím zaplaťte kauci.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Služba</span>
                    <span className="font-medium">{booking.service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Termín</span>
                    <span className="font-medium">
                      {formatDate(booking.appointmentDate)} v {booking.appointmentTime}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-900 font-medium">Kauce k zaplacení</span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(booking.depositAmount)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/payments/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ bookingId: booking.id }),
                      })
                      const data = await response.json()
                      if (data.paymentUrl) {
                        window.location.href = data.paymentUrl
                      }
                    } catch (err) {
                      console.error('Payment error:', err)
                    }
                  }}
                >
                  Zaplatit kauci {formatPrice(booking.depositAmount)}
                </Button>
              </div>

              <p className="mt-4 text-center text-sm text-gray-500">
                Rezervace bude automaticky zrušena, pokud nebude zaplacena do 30 minut.
              </p>
            </div>
          </div>
        </section>
      </>
    )
  }

  // Default / other status
  return (
    <>
      <PageHeader
        title="Stav rezervace"
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Rezervace' },
        ]}
      />
      <section className="section-padding">
        <div className="container-width">
          <div className="mx-auto max-w-lg text-center">
            <p className="body-large text-gray-600">
              Stav vaší rezervace: <strong>{booking.status}</strong>
            </p>
            <Link href="/kontakt" className="mt-6 inline-block">
              <Button>Kontaktujte nás</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BookingConfirmationContent />
    </Suspense>
  )
}
