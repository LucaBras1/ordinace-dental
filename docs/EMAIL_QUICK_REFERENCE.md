# Email Integration - Quick Reference Card

Rychlá reference pro email systém. Pro detaily viz [EMAIL_INTEGRATION.md](./EMAIL_INTEGRATION.md).

---

## 📦 Import

```typescript
import {
  sendBookingConfirmation,
  sendPaymentConfirmation,
  sendReminder,
  sendCancellation,
} from '@/lib/email'
```

---

## 🎯 Funkce

### 1. Booking Confirmation

```typescript
const result = await sendBookingConfirmation(booking, paymentUrl)
```

**Kdy:** Po vytvoření rezervace (před platbou)
**Status:** `PENDING_PAYMENT`
**Obsahuje:** Platební link, detail rezervace, storno podmínky

---

### 2. Payment Confirmation

```typescript
const result = await sendPaymentConfirmation(booking)
```

**Kdy:** Po úspěšné platbě kauce
**Status:** `PAID`
**Obsahuje:** Potvrzení kauce, detail návštěvy, co přinést

---

### 3. Reminder

```typescript
const result = await sendReminder(booking)
```

**Kdy:** 24 hodin před termínem (cron job)
**Status:** `PAID`
**Obsahuje:** Připomínka zítra, co přinést, storno varování

---

### 4. Cancellation

```typescript
const result = await sendCancellation(booking, refundAmount?)
```

**Kdy:** Při zrušení rezervace
**Status:** `CANCELLED`
**Obsahuje:** Info o zrušení, vrácení kauce (pokud nárok)

**Refund logic:**
- `refundAmount = depositAmount` → Kauce bude vrácena (≥24h před termínem)
- `refundAmount = undefined` → Kauce propadá (<24h před termínem)

---

## 📄 Booking Type

```typescript
type Booking = {
  id: string
  customerName: string
  customerEmail: string
  appointmentDate: Date
  appointmentTime: string
  depositAmount: number  // v haléřích (500 Kč = 50000)
  status: string
  service: {
    name: string
    price: number  // v haléřích
    duration: number  // v minutách
  }
}
```

---

## ✅ Response Type

```typescript
type EmailResult = {
  success: boolean
  error?: string
}

// Usage:
const result = await sendPaymentConfirmation(booking)

if (result.success) {
  console.log('✓ Email sent')
} else {
  console.error('✗ Email failed:', result.error)
}
```

---

## 🔧 Environment Variables

```bash
# .env.local (development)
RESEND_API_KEY="re_test_xxxxxxxxxx"
EMAIL_FROM="onboarding@resend.dev"
TEST_EMAIL="your@email.com"

# .env (production)
RESEND_API_KEY="re_prod_xxxxxxxxxx"
EMAIL_FROM="Dentální ordinace <rezervace@ordinace.cz>"
CRON_SECRET="random-secure-key"
```

---

## 🧪 Test Endpoints

**Rychlý test (otevřít v prohlížeči):**

```
http://localhost:3000/api/test/email/booking-confirmation
http://localhost:3000/api/test/email/payment-confirmation
http://localhost:3000/api/test/email/reminder
http://localhost:3000/api/test/email/cancellation
```

**Pomocí curl:**

```bash
curl http://localhost:3000/api/test/email/payment-confirmation
```

---

## 📍 Použití v kódu

### Booking Creation

```typescript
// POST /api/bookings
const booking = await prisma.booking.create({...})
const payment = await createComgatePayment({...})

await sendBookingConfirmation(booking, payment.paymentUrl)
```

### Payment Webhook

```typescript
// POST /api/webhooks/comgate
if (status === 'PAID') {
  await prisma.booking.update({...})
  await sendPaymentConfirmation(booking)
}
```

### Reminder Cron

```typescript
// GET /api/cron/send-reminders
const bookings = await prisma.booking.findMany({
  where: { status: 'PAID', appointmentDate: tomorrow },
})

for (const booking of bookings) {
  await sendReminder(booking)
}
```

### Cancellation

```typescript
// POST /api/bookings/[id]/cancel
const hoursBefore = calculateHours(booking.appointmentDate, now)
const refundAmount = hoursBefore >= 24 ? booking.depositAmount : undefined

await prisma.booking.update({ status: 'CANCELLED' })
await sendCancellation(booking, refundAmount)
```

---

## 🎨 Email Šablony

**Soubor:** `src/lib/email.ts`

```typescript
// 4 template funkce:
bookingConfirmationTemplate(booking, paymentUrl)
paymentConfirmationTemplate(booking)
reminderTemplate(booking)
cancellationTemplate(booking, refundAmount?)
```

**HTML structure:**
```html
<div class="container">
  <div class="header">
    <h1>Hlavička</h1>
  </div>

  <div class="detail-box">
    <!-- Detail rezervace -->
  </div>

  <div class="info">
    <!-- Info boxy -->
  </div>

  <div class="footer">
    <!-- Kontakty -->
  </div>
</div>
```

---

## 🎨 Color Scheme

```css
--primary: #0070f3    /* Blue - primary actions */
--success: #28a745    /* Green - success states */
--warning: #ffc107    /* Yellow - warnings/reminders */
--danger: #dc3545     /* Red - errors/cancellations */
--info: #17a2b8       /* Cyan - info boxes */
```

---

## 🚨 Error Handling

### Non-blocking (doporučeno)

```typescript
try {
  const result = await sendPaymentConfirmation(booking)
  if (!result.success) {
    console.error('Email failed:', result.error)
    // Continue anyway
  }
} catch (error) {
  console.error('Unexpected error:', error)
  // Continue anyway
}
```

### Blocking (kritický email)

```typescript
const result = await sendBookingConfirmation(booking, paymentUrl)
if (!result.success) {
  throw new Error(`Email failed: ${result.error}`)
}
```

---

## 📊 Kontrola

**Resend Dashboard:**
[resend.com/emails](https://resend.com/emails)

**Check delivery status:**
- Status: sent, delivered, bounced, failed
- Preview emailu
- Delivery logs

**Vercel Logs:**

```bash
vercel logs --follow
```

---

## 🔒 Security

### Test endpoints v produkci

```typescript
// Option 1: Disable
if (process.env.NODE_ENV === 'production') {
  return NextResponse.json({ error: 'Not available' }, { status: 403 })
}

// Option 2: Auth
const auth = request.headers.get('authorization')
if (auth !== `Bearer ${process.env.TEST_SECRET}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Cron endpoint protection

```typescript
const auth = request.headers.get('authorization')
if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

---

## 📈 Metrics

**Key metrics:**
- Delivery rate: `delivered / sent`
- Bounce rate: `bounced / sent`
- Email sending time: `< 2s`

**Resend Limits (Free):**
- 100 emails/day
- 3,000 emails/month

**Paid:** Unlimited

---

## 🔗 Odkazy

| Dokument | Popis |
|----------|-------|
| [EMAIL_INTEGRATION.md](./EMAIL_INTEGRATION.md) | Kompletní dokumentace |
| [EMAIL_TESTING.md](./EMAIL_TESTING.md) | Testing guide |
| [EMAIL_USAGE_EXAMPLES.md](./EMAIL_USAGE_EXAMPLES.md) | Code examples |
| [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) | Production deployment |
| [TODO.md](./TODO.md) | Zbývající integrace |

**External:**
- [Resend Docs](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [React Email](https://react.email)

---

## 🆘 Troubleshooting

### Email se neodesílá

1. Check API key: `echo $RESEND_API_KEY`
2. Check logs: `npm run dev` (terminal output)
3. Check Resend dashboard: [resend.com/emails](https://resend.com/emails)

### Email ve spamu

1. Nakonfigurovat SPF, DKIM, DMARC
2. Použít ověřenou doménu (ne `onboarding@resend.dev`)
3. Test spam score: [mail-tester.com](https://www.mail-tester.com/)

### API error

```
Error: RESEND_API_KEY environment variable is not set
```

→ Přidat do `.env.local`:
```bash
RESEND_API_KEY="re_xxxxxxxxxx"
```

---

## 💡 Pro Tip

**Development setup (1 minuta):**

```bash
# 1. Registrovat na resend.com
# 2. Vytvořit API key
# 3. Přidat do .env.local:

RESEND_API_KEY="re_your_key"
EMAIL_FROM="onboarding@resend.dev"
TEST_EMAIL="your@email.com"

# 4. Test:
npm run dev
curl http://localhost:3000/api/test/email/payment-confirmation

# 5. Check email inbox ✓
```

---

**Tato karta obsahuje 80% toho, co potřebujete. Pro zbývajících 20% viz [EMAIL_INTEGRATION.md](./EMAIL_INTEGRATION.md).** 📚
