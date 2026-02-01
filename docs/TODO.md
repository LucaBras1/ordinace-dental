# TODO - Email & Payment Integration

## ✅ Dokončeno

1. **Email Integration**
   - ✅ Vytvořen `src/lib/email.ts` s Resend integrací
   - ✅ Implementovány všechny email šablony:
     - Booking confirmation (s platebním linkem)
     - Payment confirmation
     - Reminder (24h před termínem)
     - Cancellation
   - ✅ Aktualizován webhook handler pro odesílání payment confirmation
   - ✅ Přidány env variables do `.env.example`
   - ✅ Vytvořena dokumentace `docs/EMAIL_INTEGRATION.md`

## 🔨 Zbývá implementovat

### 1. Booking API - Email po vytvoření rezervace

**Soubor:** `src/app/api/bookings/route.ts`

Po vytvoření bookingu (před platbou) je potřeba odeslat confirmation email s platebním linkem:

```typescript
import { sendBookingConfirmation } from '@/lib/email'
import { createComgatePayment } from '@/lib/comgate'

// Po vytvoření bookingu:
const booking = await prisma.booking.create({...})

// 1. Vytvořit platební link v Comgate
const payment = await createComgatePayment({
  amount: service.depositAmount,
  refId: booking.id,
  email: booking.customerEmail,
  label: `Kauce - ${service.name}`,
})

// 2. Odeslat confirmation email s platebním linkem
await sendBookingConfirmation(
  {
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
  },
  payment.paymentUrl
)

// 3. Vrátit booking a platební URL
return NextResponse.json({
  booking,
  paymentUrl: payment.paymentUrl,
}, { status: 201 })
```

### 2. Cron Job - Automatické připomínky

**Soubor:** `src/app/api/cron/send-reminders/route.ts` (vytvořit)

Cron job pro odesílání připomínek 24h před termínem:

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendReminder } from '@/lib/email'

export async function GET(request: Request) {
  // Ověření cron secret (zabezpečení)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Získat zítřejší den
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const tomorrowEnd = new Date(tomorrow)
  tomorrowEnd.setHours(23, 59, 59, 999)

  // Najít všechny zaplacené rezervace na zítřek
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

  // Odeslat připomínky
  let sent = 0
  let failed = 0

  for (const booking of bookings) {
    const result = await sendReminder({
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

    if (result.success) {
      sent++
    } else {
      failed++
      console.error(`Failed to send reminder for booking ${booking.id}:`, result.error)
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    failed,
    total: bookings.length,
  })
}
```

**Konfigurace Vercel Cron:**

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

**Environment variables:**

```bash
CRON_SECRET="your-random-secret-key"
```

### 3. Booking Cancellation - Email při zrušení

**Soubor:** `src/app/api/bookings/[id]/cancel/route.ts` (vytvořit)

API endpoint pro zrušení rezervace s odesláním cancellation emailu:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendCancellation } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id

    // Najít rezervaci
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

    // Zkontrolovat, zda lze zrušit
    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot cancel this booking' },
        { status: 400 }
      )
    }

    // Vypočítat hodin před termínem
    const now = new Date()
    const appointmentDateTime = new Date(booking.appointmentDate)
    const [hours, minutes] = booking.appointmentTime.split(':')
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes))

    const hoursBefore = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    // Určit, zda vrátit kauci (>=24h před termínem)
    const refundAmount = hoursBefore >= 24 ? booking.depositAmount : undefined

    // Aktualizovat status na CANCELLED
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    })

    // TODO: Refund payment via Comgate (pokud refundAmount)
    if (refundAmount) {
      // await refundComgatePayment(booking.paymentId, refundAmount)
    }

    // Odeslat cancellation email
    await sendCancellation(
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

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      refunded: refundAmount !== undefined,
      refundAmount,
    })
  } catch (error) {
    console.error('[API] Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 4. Environment Setup

**Development:**

```bash
# .env.local
RESEND_API_KEY="re_test_key_xxxxxxxxxx"
EMAIL_FROM="onboarding@resend.dev"
CRON_SECRET="dev-secret-key"
```

**Production:**

1. Registrovat doménu na Resend.com
2. Nastavit DNS záznamy (SPF, DKIM, DMARC)
3. Ověřit doménu
4. Nastavit production env variables:

```bash
RESEND_API_KEY="re_prod_key_xxxxxxxxxx"
EMAIL_FROM="Dentální ordinace <rezervace@ordinace.cz>"
CRON_SECRET="random-secure-key"
```

### 5. Testing

**Test email endpoint:**

```typescript
// src/app/api/test/email/route.ts
import { NextResponse } from 'next/server'
import { sendPaymentConfirmation } from '@/lib/email'

export async function GET() {
  const result = await sendPaymentConfirmation({
    id: 'test-123',
    customerName: 'Test Uživatel',
    customerEmail: 'test@example.com',
    appointmentDate: new Date('2024-02-15'),
    appointmentTime: '14:00',
    depositAmount: 50000,
    status: 'PAID',
    service: {
      name: 'Dentální hygiena',
      price: 150000,
      duration: 60,
    },
  })

  return NextResponse.json(result)
}
```

Test:
```bash
curl http://localhost:3000/api/test/email
```

---

## 📋 Kontrolní seznam

- [ ] Integrace Comgate payment v booking API
- [ ] Odeslání booking confirmation emailu po vytvoření rezervace
- [ ] Vytvoření cron job endpointu pro reminders
- [ ] Konfigurace Vercel Cron
- [ ] Vytvoření cancel endpoint s cancellation emailem
- [ ] Setup Resend production domény
- [ ] Konfigurace DNS záznamů
- [ ] Aktualizace kontaktních údajů v email šablonách
- [ ] Otestování všech email flow
- [ ] Monitoring email delivery (Resend dashboard)

---

## 📚 Dokumentace

- [Email Integration Guide](./EMAIL_INTEGRATION.md) - Kompletní dokumentace email systému
- [Resend Documentation](https://resend.com/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
