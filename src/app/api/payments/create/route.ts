/**
 * Payment Creation API
 *
 * POST /api/payments/create
 * GET /api/payments/create?pendingBookingId=<id>
 *
 * Creates a Comgate payment for a pending booking and returns redirect URL.
 *
 * IMPORTANT: This endpoint now works with PENDING BOOKINGS (in-memory),
 * not Google Calendar events. The GCal event is created AFTER payment
 * succeeds (in the Comgate webhook).
 *
 * Request:
 * - POST body: { pendingBookingId: string }
 * - GET query: ?pendingBookingId=<uuid>
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
import { getPendingBooking } from '@/lib/pending-bookings'

// ============================================
// GET /api/payments/create?pendingBookingId=<id>
// ============================================

/**
 * GET endpoint for creating payment (redirect from booking form).
 * The booking form redirects here with pendingBookingId in query params.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pendingBookingId = searchParams.get('pendingBookingId')

    if (!pendingBookingId) {
      return NextResponse.json(
        { success: false, error: 'Missing pendingBookingId parameter' },
        { status: 400 }
      )
    }

    console.log('[Payment API] Creating payment for pending booking:', pendingBookingId)

    // Get pending booking data
    const pendingBooking = getPendingBooking(pendingBookingId)

    if (!pendingBooking) {
      console.error('[Payment API] Pending booking not found or expired:', pendingBookingId)
      // Redirect to error page instead of JSON response (user-facing)
      return NextResponse.redirect(
        new URL(`/objednavka/chyba?reason=expired`, request.url)
      )
    }

    // Create Comgate payment
    const label = `Kauce - ${pendingBooking.serviceName}`

    console.log('[Payment API] Creating Comgate payment:', {
      pendingBookingId,
      price: pendingBooking.depositAmount,
      label,
      email: pendingBooking.customerEmail,
    })

    const result = await createPayment({
      bookingId: pendingBookingId, // UUID is used as refId
      price: pendingBooking.depositAmount,
      label,
      email: pendingBooking.customerEmail,
      customerName: pendingBooking.customerName,
      customerPhone: pendingBooking.customerPhone,
    })

    if (!result.success) {
      console.error('[Payment API] Payment creation failed:', result.error)
      return NextResponse.redirect(
        new URL(`/objednavka/chyba?reason=payment_failed&error=${encodeURIComponent(result.error)}`, request.url)
      )
    }

    console.log('[Payment API] Redirecting to Comgate:', {
      pendingBookingId,
      transId: result.transId,
    })

    // Redirect to Comgate payment page
    return NextResponse.redirect(result.redirectUrl)

  } catch (error) {
    console.error('[Payment API] Error creating payment:', error)
    return NextResponse.redirect(
      new URL('/objednavka/chyba?reason=unknown', request.url)
    )
  }
}

// ============================================
// POST /api/payments/create
// ============================================

interface CreatePaymentRequest {
  pendingBookingId: string
}

/**
 * POST endpoint for programmatic payment creation.
 * Returns payment URL in JSON response instead of redirect.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: CreatePaymentRequest = await request.json()
    const { pendingBookingId } = body

    if (!pendingBookingId) {
      return NextResponse.json(
        { success: false, error: 'Missing pendingBookingId' },
        { status: 400 }
      )
    }

    console.log('[Payment API] Creating payment for pending booking:', pendingBookingId)

    // Get pending booking data
    const pendingBooking = getPendingBooking(pendingBookingId)

    if (!pendingBooking) {
      console.error('[Payment API] Pending booking not found or expired:', pendingBookingId)
      return NextResponse.json(
        { success: false, error: 'Booking not found or expired. Please start a new booking.' },
        { status: 404 }
      )
    }

    // Create Comgate payment
    const label = `Kauce - ${pendingBooking.serviceName}`

    console.log('[Payment API] Creating Comgate payment:', {
      pendingBookingId,
      price: pendingBooking.depositAmount,
      label,
      email: pendingBooking.customerEmail,
    })

    const result = await createPayment({
      bookingId: pendingBookingId, // UUID is used as refId for Comgate
      price: pendingBooking.depositAmount,
      label,
      email: pendingBooking.customerEmail,
      customerName: pendingBooking.customerName,
      customerPhone: pendingBooking.customerPhone,
    })

    if (!result.success) {
      console.error('[Payment API] Payment creation failed:', result.error)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    console.log('[Payment API] Payment created successfully:', {
      pendingBookingId,
      transId: result.transId,
      redirectUrl: result.redirectUrl,
    })

    return NextResponse.json({
      success: true,
      paymentUrl: result.redirectUrl,
      transId: result.transId,
      pendingBookingId,
    })

  } catch (error) {
    console.error('[Payment API] Error creating payment:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
