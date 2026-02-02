/**
 * Payment Creation API
 *
 * POST /api/payments/create
 *
 * Vytvoří Comgate platbu pro existující booking (Google Calendar event) a vrátí redirect URL.
 *
 * Request Body:
 * {
 *   bookingId: string (Google Calendar Event ID)
 * }
 *
 * Response:
 * {
 *   success: true,
 *   paymentUrl: string,
 *   transId: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createPayment } from '@/lib/comgate'
import { getCalendarEvent, isCalendarEnabled } from '@/lib/google-calendar'
import { getServiceById } from '@/lib/services'

// ============================================
// Helper Functions
// ============================================

/**
 * Parse booking data from Google Calendar event description.
 */
function parseEventDescription(description: string): {
  phone?: string
  email?: string
  name?: string
  depositAmount?: number
} {
  const lines = description.split('\n')
  const result: Record<string, string> = {}

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length > 0) {
      result[key.trim().toLowerCase()] = valueParts.join(':').trim()
    }
  }

  return {
    phone: result['kontakt'],
    email: result['email'],
    name: result['jméno'] || result['name'],
    depositAmount: result['kauce'] ? parseInt(result['kauce'], 10) : undefined,
  }
}

/**
 * Parse service ID from event summary.
 */
function parseServiceIdFromSummary(summary: string): string {
  const serviceName = summary.split(' - ')[0]?.trim() || ''

  const serviceMap: Record<string, string> = {
    'Dentální hygiena': 'dentalni-hygiena',
    'Bělení zubů': 'beleni-zubu',
    'Preventivní prohlídka': 'preventivni-prohlidka',
    'Léčba zubního kazu': 'lecba-zubniho-kazu',
    'Extrakce zubu': 'extrakce-zubu',
  }

  return serviceMap[serviceName] || ''
}

/**
 * Get status from calendar event color ID.
 */
function getStatusFromColorId(colorId?: string): string {
  const colorMap: Record<string, string> = {
    '10': 'PAID',
    '6': 'PENDING_PAYMENT',
    '8': 'NO_SHOW',
    '11': 'CANCELLED',
  }
  return colorMap[colorId || ''] || 'PENDING_PAYMENT'
}

// ============================================
// Types
// ============================================

interface CreatePaymentRequest {
  bookingId: string
}

// ============================================
// POST /api/payments/create
// ============================================

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body: CreatePaymentRequest = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Missing bookingId' },
        { status: 400 }
      )
    }

    console.log('[Payment API] Creating payment for booking:', bookingId)

    // 2. Check if Google Calendar is configured
    if (!isCalendarEnabled()) {
      console.warn('[Payment API] Google Calendar not configured - mock payment')

      // Return mock payment URL for testing
      return NextResponse.json({
        success: true,
        paymentUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/rezervace/potvrzeni?bookingId=${bookingId}&mock=true`,
        transId: `mock-${Date.now()}`,
        warning: 'Google Calendar not configured - mock payment',
      })
    }

    // 3. Get booking from Google Calendar
    let event
    try {
      event = await getCalendarEvent(bookingId)
    } catch (error) {
      console.error('[Payment API] Booking not found:', bookingId)
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // 4. Parse booking data from event
    const bookingData = parseEventDescription(event.description || '')
    const serviceId = parseServiceIdFromSummary(event.summary || '')
    const service = getServiceById(serviceId)

    if (!service) {
      console.error('[Payment API] Service not found for booking:', bookingId)
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    // 5. Validate booking status
    const status = getStatusFromColorId(event.colorId)

    if (status === 'PAID') {
      console.log('[Payment API] Booking already paid:', bookingId)
      return NextResponse.json(
        { success: false, error: 'Booking already paid' },
        { status: 400 }
      )
    }

    if (status === 'CANCELLED') {
      console.log('[Payment API] Booking is cancelled:', bookingId)
      return NextResponse.json(
        { success: false, error: 'Booking is cancelled' },
        { status: 400 }
      )
    }

    // 6. Get customer info
    const customerEmail = bookingData.email || ''
    const customerName = bookingData.name || event.summary.split(' - ')[1] || 'Zákazník'
    const customerPhone = bookingData.phone || ''
    const depositAmount = bookingData.depositAmount || service.depositAmount

    if (!customerEmail) {
      console.error('[Payment API] Missing customer email:', bookingId)
      return NextResponse.json(
        { success: false, error: 'Missing customer email' },
        { status: 400 }
      )
    }

    // 7. Create payment label
    const label = `Kauce - ${service.name}`

    console.log('[Payment API] Creating Comgate payment:', {
      bookingId,
      price: depositAmount,
      label,
      email: customerEmail,
    })

    // 8. Create payment via Comgate
    const result = await createPayment({
      bookingId: bookingId, // Event ID = Booking ID
      price: depositAmount,
      label,
      email: customerEmail,
      customerName,
      customerPhone,
    })

    if (!result.success) {
      console.error('[Payment API] Payment creation failed:', result.error)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    console.log('[Payment API] Payment created successfully:', {
      bookingId,
      transId: result.transId,
      redirectUrl: result.redirectUrl,
    })

    // 9. Return payment URL
    return NextResponse.json({
      success: true,
      paymentUrl: result.redirectUrl,
      transId: result.transId,
    })

  } catch (error) {
    console.error('[Payment API] Error creating payment:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ============================================
// GET /api/payments/create
// ============================================

/**
 * GET endpoint pro dokumentaci/debugging.
 */
export async function GET() {
  return NextResponse.json({
    message: 'Payment creation endpoint',
    method: 'POST',
    description: 'Creates a Comgate payment for an existing Google Calendar booking.',
    requiredBody: {
      bookingId: 'string (Google Calendar Event ID)',
    },
    response: {
      success: 'boolean',
      paymentUrl: 'string (if success)',
      transId: 'string (if success)',
      error: 'string (if failed)',
    },
  })
}
