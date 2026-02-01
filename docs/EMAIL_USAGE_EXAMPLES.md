# Email Usage Examples

Praktické příklady použití email funkcí v různých částech aplikace.

---

## Import

```typescript
import {
  sendBookingConfirmation,
  sendPaymentConfirmation,
  sendReminder,
  sendCancellation,
} from '@/lib/email'
```

---

## 1. Booking Creation (POST /api/bookings)

Po vytvoření rezervace odeslat confirmation email s platebním linkem.

```typescript
// src/app/api/bookings/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createComgatePayment } from '@/lib/comgate'
import { sendBookingConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    // 1. Validate input
    const data = await request.json()

    // 2. Get service
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    })

    // 3. Create booking
    const booking = await prisma.booking.create({
      data: {
        serviceId: data.serviceId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        appointmentDate: new Date(data.appointmentDate),
        appointmentTime: data.appointmentTime,
        depositAmount: service.depositAmount,
        status: 'PENDING_PAYMENT',
        notes: data.notes || null,
        isFirstVisit: data.isFirstVisit,
        gdprConsent: data.gdprConsent,
      },
      include: { service: true },
    })

    // 4. Create Comgate payment
    const payment = await createComgatePayment({
      amount: service.depositAmount,
      refId: booking.id,
      email: booking.customerEmail,
      label: `Kauce - ${service.name}`,
    })

    // 5. Send booking confirmation email with payment link
    const emailResult = await sendBookingConfirmation(
      {
        id: booking.id,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        appointmentDate: booking.appointmentDate,
        appointmentTime: booking.appointmentTime,
        depositAmount: booking.depositAmount,
        status: booking.status,
        service: {
          name: service.name,
          price: service.price,
          duration: service.duration,
        },
      },
      payment.paymentUrl
    )

    if (!emailResult.success) {
      console.error('[Booking] Failed to send confirmation email:', emailResult.error)
      // Continue anyway - email failure shouldn't block booking
    }

    // 6. Return booking and payment URL
    return NextResponse.json(
      {
        booking,
        paymentUrl: payment.paymentUrl,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Booking] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 2. Payment Webhook (POST /api/webhooks/comgate)

Po úspěšné platbě odeslat payment confirmation.

```typescript
// src/app/api/webhooks/comgate/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPayment } from '@/lib/comgate'
import { sendPaymentConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    // 1. Parse webhook data
    const body = await request.text()
    const params = new URLSearchParams(body)
    const { transId, refId, status } = Object.fromEntries(params)

    // 2. Verify payment with Comgate
    const verification = await verifyPayment(transId)
    if (!verification.success) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // 3. Find booking
    const booking = await prisma.booking.findUnique({
      where: { id: refId },
      include: { service: true },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // 4. Update booking status
    if (status === 'PAID') {
      const updatedBooking = await prisma.booking.update({
        where: { id: refId },
        data: {
          status: 'PAID',
          paymentId: transId,
          updatedAt: new Date(),
        },
      })

      // 5. Send payment confirmation email
      const emailResult = await sendPaymentConfirmation({
        id: updatedBooking.id,
        customerName: updatedBooking.customerName,
        customerEmail: updatedBooking.customerEmail,
        appointmentDate: updatedBooking.appointmentDate,
        appointmentTime: updatedBooking.appointmentTime,
        depositAmount: updatedBooking.depositAmount,
        status: updatedBooking.status,
        service: {
          name: booking.service.name,
          price: booking.service.price,
          duration: booking.service.duration,
        },
      })

      if (!emailResult.success) {
        console.error('[Webhook] Failed to send payment confirmation:', emailResult.error)
        // Continue anyway - email failure shouldn't block webhook
      }

      console.log('[Webhook] Payment confirmed, email sent to:', booking.customerEmail)
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed',
      bookingId: refId,
      status: status,
    })
  } catch (error) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 200 } // Return 200 to prevent Comgate retries
    )
  }
}
```

---

## 3. Reminder Cron Job (GET /api/cron/send-reminders)

Automaticky odesílat připomínky 24h před termínem.

```typescript
// src/app/api/cron/send-reminders/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendReminder } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    // 1. Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Calculate tomorrow's date range
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const tomorrowEnd = new Date(tomorrow)
    tomorrowEnd.setHours(23, 59, 59, 999)

    console.log('[Cron] Sending reminders for:', tomorrow.toISOString())

    // 3. Find all paid bookings for tomorrow
    const bookings = await prisma.booking.findMany({
      where: {
        status: 'PAID',
        appointmentDate: {
          gte: tomorrow,
          lte: tomorrowEnd,
        },
      },
      include: {
        service: true,
      },
    })

    console.log('[Cron] Found bookings:', bookings.length)

    // 4. Send reminder emails
    let sent = 0
    let failed = 0

    for (const booking of bookings) {
      const emailResult = await sendReminder({
        id: booking.id,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        appointmentDate: booking.appointmentDate,
        appointmentTime: booking.appointmentTime,
        depositAmount: booking.depositAmount,
        status: booking.status,
        service: {
          name: booking.service.name,
          price: booking.service.price,
          duration: booking.service.duration,
        },
      })

      if (emailResult.success) {
        sent++
        console.log('[Cron] Reminder sent to:', booking.customerEmail)
      } else {
        failed++
        console.error(
          `[Cron] Failed to send reminder to ${booking.customerEmail}:`,
          emailResult.error
        )
      }
    }

    // 5. Return summary
    return NextResponse.json({
      success: true,
      date: tomorrow.toISOString(),
      sent,
      failed,
      total: bookings.length,
    })
  } catch (error) {
    console.error('[Cron] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
```

**Vercel Cron Configuration:**

Přidat do `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 10 * * *"
    }
  ]
}
```

Schedule = každý den v 10:00 UTC (11:00 CET / 12:00 CEST)

---

## 4. Booking Cancellation (POST /api/bookings/[id]/cancel)

Zrušit rezervaci a odeslat cancellation email.

```typescript
// src/app/api/bookings/[id]/cancel/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendCancellation } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id

    // 1. Find booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // 2. Check if can be cancelled
    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot cancel this booking' },
        { status: 400 }
      )
    }

    // 3. Calculate hours before appointment
    const now = new Date()
    const appointmentDateTime = new Date(booking.appointmentDate)
    const [hours, minutes] = booking.appointmentTime.split(':')
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes))

    const hoursBefore =
      (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    // 4. Determine refund amount (>=24h = full refund, <24h = no refund)
    const refundAmount = hoursBefore >= 24 ? booking.depositAmount : undefined

    console.log('[Cancellation]', {
      bookingId,
      hoursBefore: hoursBefore.toFixed(1),
      refundAmount,
    })

    // 5. Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    })

    // 6. TODO: Refund payment via Comgate (if refundAmount > 0)
    if (refundAmount) {
      console.log('[Cancellation] TODO: Refund payment:', booking.paymentId)
      // await refundComgatePayment(booking.paymentId, refundAmount)
    }

    // 7. Send cancellation email
    const emailResult = await sendCancellation(
      {
        id: updatedBooking.id,
        customerName: updatedBooking.customerName,
        customerEmail: updatedBooking.customerEmail,
        appointmentDate: updatedBooking.appointmentDate,
        appointmentTime: updatedBooking.appointmentTime,
        depositAmount: updatedBooking.depositAmount,
        status: updatedBooking.status,
        service: {
          name: booking.service.name,
          price: booking.service.price,
          duration: booking.service.duration,
        },
      },
      refundAmount
    )

    if (!emailResult.success) {
      console.error('[Cancellation] Failed to send email:', emailResult.error)
      // Continue anyway
    }

    console.log('[Cancellation] Email sent to:', booking.customerEmail)

    // 8. Return result
    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      refunded: refundAmount !== undefined,
      refundAmount,
      hoursBefore: parseFloat(hoursBefore.toFixed(1)),
    })
  } catch (error) {
    console.error('[Cancellation] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 5. Manual Email Sending

Pokud potřebujete odeslat email manuálně (např. z admin panelu):

```typescript
// Example: Admin panel - Resend confirmation email

import { sendPaymentConfirmation } from '@/lib/email'
import { prisma } from '@/lib/prisma'

async function resendConfirmationEmail(bookingId: string) {
  // Get booking with service
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true },
  })

  if (!booking) {
    throw new Error('Booking not found')
  }

  // Send email
  const result = await sendPaymentConfirmation({
    id: booking.id,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    appointmentDate: booking.appointmentDate,
    appointmentTime: booking.appointmentTime,
    depositAmount: booking.depositAmount,
    status: booking.status,
    service: {
      name: booking.service.name,
      price: booking.service.price,
      duration: booking.service.duration,
    },
  })

  if (!result.success) {
    throw new Error(`Failed to send email: ${result.error}`)
  }

  return { success: true }
}
```

---

## Error Handling Best Practices

### Non-blocking (email failure shouldn't break flow)

```typescript
try {
  const result = await sendPaymentConfirmation(booking)

  if (result.success) {
    console.log('✓ Email sent successfully')
  } else {
    console.error('✗ Email failed:', result.error)
    // Log to monitoring service (Sentry, DataDog, etc.)
    // But continue with the main flow
  }
} catch (error) {
  console.error('✗ Unexpected email error:', error)
  // Log error but don't throw - email is non-critical
}
```

### Blocking (email must be sent)

```typescript
const result = await sendBookingConfirmation(booking, paymentUrl)

if (!result.success) {
  // Email is critical - rollback booking?
  await prisma.booking.delete({ where: { id: booking.id } })

  return NextResponse.json(
    {
      error: 'Failed to send confirmation email',
      details: result.error,
    },
    { status: 500 }
  )
}
```

---

## Logging Examples

### Success

```typescript
console.log('[Email] Sending payment confirmation to:', booking.customerEmail)
console.log('[Email] ✓ Successfully sent email ID:', emailId)
```

### Failure

```typescript
console.error('[Email] ✗ Failed to send payment confirmation:', {
  bookingId: booking.id,
  email: booking.customerEmail,
  error: result.error,
})
```

### With context

```typescript
console.log('[Booking Creation]', {
  bookingId: booking.id,
  customerEmail: booking.customerEmail,
  paymentUrl: payment.paymentUrl,
  emailSent: result.success,
})
```

---

## Testing in Development

```typescript
// Override email recipient for testing
const testEmail = process.env.NODE_ENV === 'development'
  ? process.env.TEST_EMAIL || booking.customerEmail
  : booking.customerEmail

await sendPaymentConfirmation({
  ...booking,
  customerEmail: testEmail,
})
```

---

## Summary

**Booking Flow:**
1. `POST /api/bookings` → `sendBookingConfirmation()` with payment link
2. User pays → Comgate webhook → `sendPaymentConfirmation()`
3. 24h before → Cron job → `sendReminder()`
4. If cancelled → `POST /api/bookings/[id]/cancel` → `sendCancellation()`

**Best Practices:**
- ✅ Always use try/catch
- ✅ Log errors but don't throw (non-blocking)
- ✅ Check `result.success` before assuming email was sent
- ✅ Use `TEST_EMAIL` in development
- ✅ Include relevant context in logs
