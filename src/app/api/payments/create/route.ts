/**
 * Payment Creation API
 *
 * POST /api/payments/create
 *
 * Vytvoří Comgate platbu pro existující booking a vrátí redirect URL.
 *
 * Request Body:
 * {
 *   bookingId: string
 * }
 *
 * Response:
 * {
 *   success: true,
 *   paymentUrl: string,
 *   transId: string
 * }
 *
 * Usage:
 * ```typescript
 * const response = await fetch('/api/payments/create', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ bookingId: 'booking_123' })
 * })
 * const data = await response.json()
 * if (data.success) {
 *   window.location.href = data.paymentUrl
 * }
 * ```
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPayment } from '@/lib/comgate'

// ============================================
// TYPES
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

    // 2. Find booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    })

    if (!booking) {
      console.error('[Payment API] Booking not found:', bookingId)
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // 3. Validate booking status
    if (booking.status === 'PAID') {
      console.log('[Payment API] Booking already paid:', bookingId)
      return NextResponse.json(
        { success: false, error: 'Booking already paid' },
        { status: 400 }
      )
    }

    if (booking.status === 'CANCELLED' || booking.status === 'REFUNDED') {
      console.log('[Payment API] Booking is cancelled/refunded:', bookingId)
      return NextResponse.json(
        { success: false, error: 'Booking is cancelled or refunded' },
        { status: 400 }
      )
    }

    // 4. Create payment label
    const label = `Kauce - ${booking.service.name}`

    console.log('[Payment API] Creating Comgate payment:', {
      bookingId,
      price: booking.depositAmount,
      label,
      email: booking.customerEmail,
    })

    // 5. Create payment via Comgate
    const result = await createPayment({
      bookingId: booking.id,
      price: booking.depositAmount,
      label,
      email: booking.customerEmail,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
    })

    if (!result.success) {
      console.error('[Payment API] Payment creation failed:', result.error)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // 6. Update booking with payment ID
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentId: result.transId,
        updatedAt: new Date(),
      },
    })

    console.log('[Payment API] Payment created successfully:', {
      bookingId,
      transId: result.transId,
      redirectUrl: result.redirectUrl,
    })

    // 7. Return payment URL
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
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Payment creation endpoint',
    method: 'POST',
    requiredBody: {
      bookingId: 'string',
    },
    response: {
      success: 'boolean',
      paymentUrl: 'string (if success)',
      transId: 'string (if success)',
      error: 'string (if failed)',
    },
    example: {
      request: {
        bookingId: 'clxyz123abc',
      },
      response: {
        success: true,
        paymentUrl: 'https://payments.comgate.cz/client/instructions/index?id=...',
        transId: 'ABC-123-456',
      },
    },
  })
}
