/**
 * Email Testing Endpoint
 *
 * Development-only endpoint for testing email templates.
 * DO NOT deploy to production or protect with authentication.
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  sendBookingConfirmation,
  sendPaymentConfirmation,
  sendReminder,
  sendCancellation,
} from '@/lib/email'

// Prevent this endpoint from being cached
export const dynamic = 'force-dynamic'

/**
 * Test booking data
 */
const testBooking = {
  id: 'test-booking-clx123456',
  customerName: 'Jan Novák',
  customerEmail: process.env.TEST_EMAIL || 'test@example.com',
  appointmentDate: new Date('2024-02-15T00:00:00.000Z'),
  appointmentTime: '14:00',
  depositAmount: 50000, // 500 Kč
  status: 'PAID' as const,
  service: {
    name: 'Dentální hygiena',
    price: 150000, // 1500 Kč
    duration: 60, // 60 minut
  },
}

/**
 * GET /api/test/email
 *
 * Returns list of available test endpoints.
 */
export async function GET() {
  return NextResponse.json({
    message: 'Email testing endpoint',
    availableTests: [
      'GET /api/test/email/booking-confirmation',
      'GET /api/test/email/payment-confirmation',
      'GET /api/test/email/reminder',
      'GET /api/test/email/cancellation',
      'GET /api/test/email/cancellation-no-refund',
    ],
    testEmail: testBooking.customerEmail,
    note: 'Set TEST_EMAIL environment variable to override recipient',
  })
}

/**
 * POST /api/test/email
 *
 * Test specific email type with custom data.
 *
 * Body:
 * {
 *   type: 'booking-confirmation' | 'payment-confirmation' | 'reminder' | 'cancellation',
 *   email?: string,
 *   customerName?: string,
 *   appointmentDate?: string,
 *   appointmentTime?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, email, customerName, appointmentDate, appointmentTime } = body

    // Override test booking with custom values
    const customBooking = {
      ...testBooking,
      customerEmail: email || testBooking.customerEmail,
      customerName: customerName || testBooking.customerName,
      appointmentDate: appointmentDate ? new Date(appointmentDate) : testBooking.appointmentDate,
      appointmentTime: appointmentTime || testBooking.appointmentTime,
    }

    let result

    switch (type) {
      case 'booking-confirmation':
        result = await sendBookingConfirmation(
          customBooking,
          'https://payments.comgate.cz/client/instructions/index?id=TEST123'
        )
        break

      case 'payment-confirmation':
        result = await sendPaymentConfirmation(customBooking)
        break

      case 'reminder':
        result = await sendReminder(customBooking)
        break

      case 'cancellation':
        result = await sendCancellation(customBooking, customBooking.depositAmount)
        break

      case 'cancellation-no-refund':
        result = await sendCancellation(customBooking, undefined)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: result.success,
      error: result.error,
      type,
      recipient: customBooking.customerEmail,
    })
  } catch (error) {
    console.error('[Test Email] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
