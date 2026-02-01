/**
 * Payment Flow Example Component
 *
 * Tento soubor ukazuje kompletní implementaci platebního flow
 * pro Comgate integraci v Next.js komponentě.
 *
 * Flow:
 * 1. Uživatel vyplní rezervační formulář
 * 2. Vytvoří se booking v databázi (status: PENDING_PAYMENT)
 * 3. Zavolá se /api/payments/create
 * 4. Uživatel je přesměrován na Comgate
 * 5. Po platbě Comgate zavolá webhook
 * 6. Webhook aktualizuje booking status na PAID
 * 7. Uživatel je přesměrován na potvrzení
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ============================================
// TYPES
// ============================================

interface BookingFormData {
  serviceId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  appointmentDate: string
  appointmentTime: string
  notes: string
  isFirstVisit: boolean
  gdprConsent: boolean
}

interface Service {
  id: string
  name: string
  price: number
  depositAmount: number
  duration: number
}

// ============================================
// EXAMPLE COMPONENT
// ============================================

export default function BookingWithPaymentExample() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock služby (v reálné aplikaci načti z API nebo databáze)
  const services: Service[] = [
    {
      id: 'service_1',
      name: 'Dentální hygiena',
      price: 150000, // 1500 Kč
      depositAmount: 50000, // 500 Kč kauce
      duration: 60,
    },
    {
      id: 'service_2',
      name: 'Bělení zubů',
      price: 400000, // 4000 Kč
      depositAmount: 100000, // 1000 Kč kauce
      duration: 90,
    },
  ]

  // ============================================
  // HANDLE FORM SUBMIT
  // ============================================

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Získej data z formuláře
      const formData = new FormData(e.currentTarget)
      const data: BookingFormData = {
        serviceId: formData.get('serviceId') as string,
        customerName: formData.get('customerName') as string,
        customerEmail: formData.get('customerEmail') as string,
        customerPhone: formData.get('customerPhone') as string,
        appointmentDate: formData.get('appointmentDate') as string,
        appointmentTime: formData.get('appointmentTime') as string,
        notes: formData.get('notes') as string,
        isFirstVisit: formData.get('isFirstVisit') === 'on',
        gdprConsent: formData.get('gdprConsent') === 'on',
      }

      // 2. Validace GDPR
      if (!data.gdprConsent) {
        setError('Musíte souhlasit se zpracováním osobních údajů')
        setLoading(false)
        return
      }

      // 3. Vytvoř booking v databázi
      const createBookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!createBookingResponse.ok) {
        const errorData = await createBookingResponse.json()
        throw new Error(errorData.error || 'Chyba vytvoření rezervace')
      }

      const { booking } = await createBookingResponse.json()
      console.log('Booking vytvořen:', booking)

      // 4. Vytvoř platbu přes Comgate
      const createPaymentResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
        }),
      })

      if (!createPaymentResponse.ok) {
        const errorData = await createPaymentResponse.json()
        throw new Error(errorData.error || 'Chyba vytvoření platby')
      }

      const { success, paymentUrl, transId } = await createPaymentResponse.json()

      if (!success || !paymentUrl) {
        throw new Error('Nepodařilo se vytvořit platební odkaz')
      }

      console.log('Platba vytvořena:', { transId, paymentUrl })

      // 5. Přesměruj uživatele na Comgate platební bránu
      window.location.href = paymentUrl

    } catch (err) {
      console.error('Chyba při zpracování rezervace:', err)
      setError(err instanceof Error ? err.message : 'Neznámá chyba')
      setLoading(false)
    }
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Online Rezervace</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Výběr služby */}
        <div>
          <label htmlFor="serviceId" className="block font-medium mb-2">
            Vyberte službu
          </label>
          <select
            id="serviceId"
            name="serviceId"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">-- Vyberte službu --</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price / 100} Kč (kauce: {service.depositAmount / 100} Kč)
              </option>
            ))}
          </select>
        </div>

        {/* Osobní údaje */}
        <div>
          <label htmlFor="customerName" className="block font-medium mb-2">
            Jméno a příjmení
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="customerEmail" className="block font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="customerPhone" className="block font-medium mb-2">
            Telefon
          </label>
          <input
            type="tel"
            id="customerPhone"
            name="customerPhone"
            required
            placeholder="+420123456789"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Termín */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="appointmentDate" className="block font-medium mb-2">
              Datum
            </label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="appointmentTime" className="block font-medium mb-2">
              Čas
            </label>
            <select
              id="appointmentTime"
              name="appointmentTime"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">-- Vyberte čas --</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
            </select>
          </div>
        </div>

        {/* Poznámka */}
        <div>
          <label htmlFor="notes" className="block font-medium mb-2">
            Poznámka (volitelné)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Checkboxy */}
        <div className="space-y-3">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              name="isFirstVisit"
              className="mt-1"
            />
            <span className="text-sm">
              Jedná se o první návštěvu
            </span>
          </label>

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              name="gdprConsent"
              required
              className="mt-1"
            />
            <span className="text-sm">
              Souhlasím se{' '}
              <a href="/ochrana-osobnich-udaju" className="text-primary hover:underline">
                zpracováním osobních údajů
              </a>{' '}
              (povinné)
            </span>
          </label>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">ℹ️ Jak probíhá platba?</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Klikněte na "Rezervovat a zaplatit kauci"</li>
            <li>Budete přesměrováni na zabezpečenou platební bránu Comgate</li>
            <li>Zaplaťte kauci (kartou, bankovním převodem nebo Apple Pay)</li>
            <li>Po úspěšné platbě obdržíte potvrzení emailem</li>
            <li>Vaše rezervace je potvrzena!</li>
          </ol>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Zpracovávám...' : 'Rezervovat a zaplatit kauci'}
        </button>
      </form>
    </div>
  )
}

// ============================================
// CONFIRMATION PAGE EXAMPLE
// ============================================

/**
 * Potvrzovací stránka po úspěšné platbě.
 *
 * URL: /objednavka/potvrzeni?bookingId=xyz
 *
 * Usage v pages/objednavka/potvrzeni/page.tsx:
 */
export function PaymentConfirmationPageExample() {
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Načti booking detail z API
  // useEffect(() => {
  //   const bookingId = new URLSearchParams(window.location.search).get('bookingId')
  //   if (bookingId) {
  //     fetch(`/api/bookings/${bookingId}`)
  //       .then(res => res.json())
  //       .then(data => setBooking(data.booking))
  //       .finally(() => setLoading(false))
  //   }
  // }, [])

  if (loading) {
    return <div>Načítám...</div>
  }

  if (!booking) {
    return <div>Rezervace nenalezena</div>
  }

  const isPaid = booking.status === 'PAID'

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      {isPaid ? (
        <>
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Platba úspěšná!
          </h1>
          <p className="text-gray-600 mb-6">
            Vaše rezervace byla potvrzena. Potvrzení jsme odeslali na email{' '}
            <strong>{booking.customerEmail}</strong>.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h2 className="font-bold mb-4">Detail rezervace</h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-gray-500">Služba</dt>
                <dd className="font-medium">{booking.service.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Datum a čas</dt>
                <dd className="font-medium">
                  {new Date(booking.appointmentDate).toLocaleDateString('cs-CZ')} v {booking.appointmentTime}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Zaplacená kauce</dt>
                <dd className="font-medium">{booking.depositAmount / 100} Kč</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Číslo rezervace</dt>
                <dd className="font-mono text-sm">{booking.id}</dd>
              </div>
            </dl>
          </div>

          <button
            onClick={() => router.push('/')}
            className="mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
          >
            Zpět na hlavní stránku
          </button>
        </>
      ) : (
        <>
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-3xl font-bold text-yellow-600 mb-2">
            Čekáme na platbu
          </h1>
          <p className="text-gray-600">
            Vaše platba zatím nebyla potvrzena. Zkontrolujte email nebo zkuste obnovit stránku.
          </p>
        </>
      )}
    </div>
  )
}
