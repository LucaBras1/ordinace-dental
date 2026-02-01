/**
 * Test: Payment Confirmation Email
 */

import { NextResponse } from 'next/server'
import { sendPaymentConfirmation } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result = await sendPaymentConfirmation({
    id: 'test-booking-123',
    customerName: 'Jan Novák',
    customerEmail: process.env.TEST_EMAIL || 'test@example.com',
    appointmentDate: new Date('2024-02-15'),
    appointmentTime: '14:00',
    depositAmount: 50000, // 500 Kč
    status: 'PAID',
    service: {
      name: 'Dentální hygiena',
      price: 150000, // 1500 Kč
      duration: 60,
    },
  })

  return NextResponse.json({
    emailType: 'payment-confirmation',
    ...result,
  })
}
