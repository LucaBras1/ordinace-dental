/**
 * Test: Booking Confirmation Email
 *
 * Development-only endpoint.
 */

import { NextResponse } from 'next/server'
import { sendBookingConfirmation } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Production guard
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const result = await sendBookingConfirmation(
    {
      id: 'test-booking-123',
      customerName: 'Jan Novák',
      customerEmail: process.env.TEST_EMAIL || 'test@example.com',
      appointmentDate: new Date('2024-02-15'),
      appointmentTime: '14:00',
      depositAmount: 50000, // 500 Kč
      status: 'PENDING_PAYMENT',
      service: {
        name: 'Dentální hygiena',
        price: 150000, // 1500 Kč
        duration: 60,
      },
    },
    'https://payments.comgate.cz/client/instructions/index?id=TEST123'
  )

  return NextResponse.json({
    emailType: 'booking-confirmation',
    ...result,
  })
}
