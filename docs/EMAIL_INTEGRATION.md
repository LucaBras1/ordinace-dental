# Email Integration - Resend

Email integrace pro booking systém dentální ordinace s využitím služby [Resend](https://resend.com).

## Obsah

- [Implementované email typy](#implementované-email-typy)
- [Setup](#setup)
- [Konfigurace](#konfigurace)
- [API Usage](#api-usage)
- [Email Templates](#email-templates)
- [Automatické triggery](#automatické-triggery)
- [Testing](#testing)

---

## Implementované email typy

### 1. Booking Confirmation (Potvrzení rezervace)
**Kdy:** Ihned po vytvoření rezervace (status: `PENDING_PAYMENT`)

**Obsah:**
- Poděkování za rezervaci
- Detail služby, datum, čas, trvání
- Výše kauce k zaplacení
- Tlačítko "Zaplatit kauci" s platebním linkem
- Storno podmínky
- Kontaktní údaje ordinace

### 2. Payment Confirmation (Potvrzení platby)
**Kdy:** Po úspěšné platbě kauce (status: `PAID`)

**Obsah:**
- Potvrzení přijetí kauce
- Detail návštěvy (služba, datum, čas)
- Rozpis platby (celková cena, kauce, zbývá doplatit)
- Co si přinést na návštěvu
- Storno podmínky a možnost zrušení

### 3. Reminder (Připomínka)
**Kdy:** 24 hodin před termínem návštěvy

**Obsah:**
- Připomínka termínu zítra
- Detail návštěvy
- Částka k doplacení
- Co si přinést
- Varování o storno podmínkách

### 4. Cancellation (Zrušení)
**Kdy:** Když je rezervace zrušena

**Obsah:**
- Informace o zrušení rezervace
- Detail zrušeného termínu
- Info o vrácení kauce (pokud nárok)
- Možnost vytvoření nové rezervace

---

## Setup

### 1. Registrace na Resend

1. Vytvořte účet na [resend.com](https://resend.com)
2. Vytvořte API klíč v sekci [API Keys](https://resend.com/api-keys)
3. (Volitelně) Nakonfigurujte vlastní doménu pro odesílání emailů

### 2. Konfigurace domény (doporučeno)

Pro produkční prostředí doporučujeme nakonfigurovat vlastní doménu:

1. V Resend dashboard přidejte doménu (např. `ordinace.cz`)
2. Přidejte DNS záznamy (SPF, DKIM, DMARC)
3. Ověřte doménu

### 3. Environment Variables

Přidejte do `.env` nebo `.env.local`:

```bash
# Resend API Key
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Email "from" address
EMAIL_FROM="Dentální ordinace <rezervace@ordinace.cz>"
```

**Poznámka:**
- V development módu můžete používat `onboarding@resend.dev`
- Pro produkci je nutné ověřit vlastní doménu

---

## Konfigurace

### Domain Setup (Production)

```bash
# DNS záznamy (příklad pro ordinace.cz)

# SPF record
TXT @ "v=spf1 include:_spf.resend.com ~all"

# DKIM record (poskytne Resend)
TXT resend._domainkey "v=DKIM1; k=rsa; p=MIGfMA0GCS..."

# DMARC record
TXT _dmarc "v=DMARC1; p=none; rua=mailto:dmarc@ordinace.cz"
```

### Sender Address

V production použijte ověřenou doménu:

```bash
EMAIL_FROM="Dentální ordinace <rezervace@ordinace.cz>"
```

Formát: `"Display Name <email@domain.com>"`

---

## API Usage

### Import

```typescript
import {
  sendBookingConfirmation,
  sendPaymentConfirmation,
  sendReminder,
  sendCancellation,
} from '@/lib/email'
```

### 1. Booking Confirmation

```typescript
// Po vytvoření rezervace (před platbou)
const result = await sendBookingConfirmation(
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
  paymentUrl // Comgate payment URL
)

if (result.success) {
  console.log('Booking confirmation email sent')
} else {
  console.error('Failed to send email:', result.error)
}
```

### 2. Payment Confirmation

```typescript
// Po úspěšné platbě (webhook handler)
const result = await sendPaymentConfirmation({
  id: booking.id,
  customerName: booking.customerName,
  customerEmail: booking.customerEmail,
  appointmentDate: booking.appointmentDate,
  appointmentTime: booking.appointmentTime,
  depositAmount: booking.depositAmount,
  status: 'PAID',
  service: {
    name: booking.service.name,
    price: booking.service.price,
    duration: booking.service.duration,
  },
})
```

### 3. Reminder (Připomínka)

```typescript
// Cron job - 24h před termínem
const bookings = await prisma.booking.findMany({
  where: {
    status: 'PAID',
    appointmentDate: tomorrow,
  },
  include: { service: true },
})

for (const booking of bookings) {
  await sendReminder({
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
}
```

### 4. Cancellation (Zrušení)

```typescript
// Při zrušení rezervace
const hoursBefore = calculateHoursBefore(booking.appointmentDate, new Date())
const refundAmount = hoursBefore >= 24 ? booking.depositAmount : undefined

await sendCancellation(
  {
    id: booking.id,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    appointmentDate: booking.appointmentDate,
    appointmentTime: booking.appointmentTime,
    depositAmount: booking.depositAmount,
    status: 'CANCELLED',
    service: {
      name: booking.service.name,
      price: booking.service.price,
      duration: booking.service.duration,
    },
  },
  refundAmount // undefined pokud kauce propadá
)
```

---

## Email Templates

Všechny šablony jsou inline HTML s responzivním designem.

### Struktura šablony

```html
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Title</title>
  <style>
    /* Inline CSS pro maximální kompatibilitu */
    body { font-family: sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    /* ... */
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Hlavička</h1>
    </div>
    <!-- Obsah -->
    <div class="footer">
      <!-- Kontakty -->
    </div>
  </div>
</body>
</html>
```

### Customizace

Pro změnu designu editujte šablony v `src/lib/email.ts`:

- `bookingConfirmationTemplate()`
- `paymentConfirmationTemplate()`
- `reminderTemplate()`
- `cancellationTemplate()`

### Color scheme

```css
--primary: #0070f3    /* Blue - primary actions */
--success: #28a745    /* Green - success states */
--warning: #ffc107    /* Yellow - warnings/reminders */
--danger: #dc3545     /* Red - errors/cancellations */
--info: #17a2b8       /* Cyan - info boxes */
```

---

## Automatické triggery

### Webhook Handler (Comgate)

Po úspěšné platbé (`POST /api/webhooks/comgate`):

```typescript
// src/app/api/webhooks/comgate/route.ts

if (status === 'PAID') {
  // 1. Update booking status
  const updatedBooking = await prisma.booking.update({
    where: { id: refId },
    data: { status: 'PAID', paymentId: transId },
  })

  // 2. Send confirmation email
  await sendPaymentConfirmation({
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
}
```

### Booking Creation (API)

Po vytvoření rezervace (`POST /api/bookings`):

```typescript
// src/app/api/bookings/route.ts

const booking = await prisma.booking.create({ data })

// Create payment
const payment = await createComgatePayment(booking)

// Send booking confirmation with payment link
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
      name: service.name,
      price: service.price,
      duration: service.duration,
    },
  },
  payment.paymentUrl
)
```

### Cron Job - Reminders (TODO)

Pro automatické připomínky vytvořte cron job nebo použijte Vercel Cron:

```typescript
// src/app/api/cron/send-reminders/route.ts

export async function GET() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const bookings = await prisma.booking.findMany({
    where: {
      status: 'PAID',
      appointmentDate: {
        gte: tomorrow,
        lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: { service: true },
  })

  let sent = 0
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
    if (result.success) sent++
  }

  return NextResponse.json({ sent, total: bookings.length })
}
```

---

## Testing

### 1. Local Testing (Development)

V development módu použijte Resend onboarding email:

```bash
# .env.local
RESEND_API_KEY="re_your_test_api_key"
EMAIL_FROM="onboarding@resend.dev"
```

### 2. Test Email Endpoint

Vytvořte test endpoint:

```typescript
// src/app/api/test/email/route.ts

import { NextResponse } from 'next/server'
import { sendPaymentConfirmation } from '@/lib/email'

export async function GET() {
  const testBooking = {
    id: 'test-booking-123',
    customerName: 'Jan Novák',
    customerEmail: 'test@example.com',
    appointmentDate: new Date('2024-02-15'),
    appointmentTime: '14:00',
    depositAmount: 50000, // 500 Kč
    status: 'PAID',
    service: {
      name: 'Dentální hygiena',
      price: 150000, // 1500 Kč
      duration: 60,
    },
  }

  const result = await sendPaymentConfirmation(testBooking)

  return NextResponse.json({
    success: result.success,
    error: result.error,
  })
}
```

Otestujte:

```bash
curl http://localhost:3000/api/test/email
```

### 3. Resend Dashboard

Zkontrolujte odeslané emaily v [Resend Dashboard](https://resend.com/emails):

- Status odeslání (sent, delivered, bounced)
- Email náhled
- Delivery logs
- Error messages

### 4. Email Preview

Pro náhled šablon bez odesílání použijte HTML export:

```typescript
import { bookingConfirmationTemplate } from '@/lib/email'

const html = bookingConfirmationTemplate(testBooking, 'https://example.com/pay')
console.log(html)
// Copy HTML do souboru a otevřete v prohlížeči
```

---

## Error Handling

Všechny email funkce jsou **non-blocking** - pokud selže odeslání emailu, neblokují se další operace (platba, kalendář).

```typescript
try {
  const result = await sendPaymentConfirmation(booking)
  if (result.success) {
    console.log('Email sent successfully')
  } else {
    console.error('Email sending failed:', result.error)
    // Můžete logovat do Sentry, DataDog, apod.
  }
} catch (error) {
  console.error('Unexpected email error:', error)
  // Aplikace pokračuje normálně
}
```

---

## Troubleshooting

### Email se neodesílá

1. **Zkontrolujte API klíč:**
   ```bash
   echo $RESEND_API_KEY
   ```

2. **Zkontrolujte sender doménu:**
   - V development módu použijte `onboarding@resend.dev`
   - V production použijte ověřenou doménu

3. **Zkontrolujte logs:**
   ```bash
   # Vercel logs
   vercel logs

   # Local console
   npm run dev
   # Zkontrolujte terminal output
   ```

### Email končí ve spamu

1. Nakonfigurujte SPF, DKIM, DMARC DNS záznamy
2. Použijte ověřenou doménu (ne `onboarding@resend.dev`)
3. Přidejte link pro unsubscribe (GDPR compliance)

### Rate Limits

Resend limity (free tier):

- **100 emailů/den** (free)
- **3,000 emailů/měsíc** (free)

Pro produkci zvažte upgrade na [paid plan](https://resend.com/pricing).

---

## Budoucí vylepšení

### 1. React Email šablony

Místo inline HTML použít [React Email](https://react.email):

```bash
npm install @react-email/components
```

```tsx
// src/emails/payment-confirmation.tsx
import { Html, Button, Text } from '@react-email/components'

export default function PaymentConfirmation({ booking }) {
  return (
    <Html>
      <Text>Dobrý den {booking.customerName}</Text>
      <Button href={booking.detailUrl}>Detail rezervace</Button>
    </Html>
  )
}
```

### 2. Email Analytics

Trackování otevření a kliků:

```typescript
const { data } = await resend.emails.send({
  from,
  to,
  subject,
  html,
  tags: [
    { name: 'category', value: 'payment-confirmation' },
    { name: 'bookingId', value: booking.id },
  ],
})
```

### 3. Lokalizace

Podpora více jazyků (čeština, angličtina):

```typescript
function getTemplate(locale: 'cs' | 'en') {
  return locale === 'cs' ? 'Rezervace vytvořena' : 'Booking created'
}
```

---

## Kontaktní údaje v emailech

Aktualizujte kontaktní údaje ordinace v šablonách (`src/lib/email.ts`):

```html
<div class="footer">
  <p><strong>Kontakt na ordinaci:</strong></p>
  <p>
    📞 +420 XXX XXX XXX<br>
    📧 info@ordinace.cz<br>
    📍 Adresa ordinace, Praha
  </p>
</div>
```

Nahraďte:
- Telefonní číslo
- Email
- Adresu ordinace

---

## Odkazy

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [React Email](https://react.email)
- [Email Design Best Practices](https://www.campaignmonitor.com/resources/guides/email-design/)
