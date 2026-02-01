/**
 * Test: Cancellation Email (with refund)
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendCancellation } from '@/lib/email'

export const dynamic = 'force-dynamic'

/**
 * GET /api/test/email/cancellation
 * Test cancellation with full refund (>24h before appointment)
 */
export async function GET() {
  const result = await sendCancellation(
    {
      id: 'test-booking-123',
      customerName: 'Jan Novák',
      customerEmail: process.env.TEST_EMAIL || 'test@example.com',
      appointmentDate: new Date('2024-02-15'),
      appointmentTime: '14:00',
      depositAmount: 50000, // 500 Kč
      status: 'CANCELLED',
      service: {
        name: 'Dentální hygiena',
        price: 150000, // 1500 Kč
        duration: 60,
      },
    },
    50000 // Full refund
  )

  return NextResponse.json({
    emailType: 'cancellation',
    refundType: 'full',
    refundAmount: 50000,
    ...result,
  })
}

/**
 * POST /api/test/email/cancellation
 * Test cancellation with custom refund amount (or no refund)
 *
 * Body: { refund?: number } // refund amount in haléře, undefined = no refund
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const refundAmount = body.refund !== undefined ? body.refund : undefined

  const result = await sendCancellation(
    {
      id: 'test-booking-123',
      customerName: 'Jan Novák',
      customerEmail: process.env.TEST_EMAIL || 'test@example.com',
      appointmentDate: new Date('2024-02-15'),
      appointmentTime: '14:00',
      depositAmount: 50000, // 500 Kč
      status: 'CANCELLED',
      service: {
        name: 'Dentální hygiena',
        price: 150000, // 1500 Kč
        duration: 60,
      },
    },
    refundAmount
  )

  return NextResponse.json({
    emailType: 'cancellation',
    refundType: refundAmount !== undefined ? 'partial/full' : 'none',
    refundAmount,
    ...result,
  })
}
