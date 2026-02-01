# Production Checklist - Email Integration

Kontrolní seznam pro nasazení email integrace do produkce.

---

## 🔧 Pre-Production Setup

### 1. Resend Account & Domain

- [ ] Vytvořit Resend účet na [resend.com](https://resend.com)
- [ ] Upgrade na paid plan (pokud očekáváte >100 emailů/den)
- [ ] Přidat vlastní doménu (např. `ordinace.cz`)
- [ ] Nastavit DNS záznamy:

```bash
# SPF record
TXT @ "v=spf1 include:_spf.resend.com ~all"

# DKIM record (poskytne Resend)
TXT resend._domainkey "v=DKIM1; k=rsa; p=MIGfMA0GCS..."

# DMARC record
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@ordinace.cz"
```

- [ ] Ověřit doménu v Resend dashboard
- [ ] Vytvořit production API klíč

### 2. Environment Variables

Nastavit v production environment (Vercel, AWS, apod.):

```bash
# Resend
RESEND_API_KEY="re_prod_xxxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="Dentální ordinace <rezervace@ordinace.cz>"

# Cron secret (pro zabezpečení cron endpointu)
CRON_SECRET="random-secure-secret-key-xxxxx"

# (Optional) Test email pro debugging
TEST_EMAIL="admin@ordinace.cz"
```

**Generování CRON_SECRET:**

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Email Šablony - Aktualizace kontaktů

Editovat `src/lib/email.ts` a nahradit placeholder kontakty:

```typescript
// V každé šabloně najít a nahradit:

<div class="footer">
  <p><strong>Kontakt na ordinaci:</strong></p>
  <p>
    📞 +420 XXX XXX XXX<br>        // ← NAHRADIT reálným telefonem
    📧 info@ordinace.cz<br>         // ← NAHRADIT reálným emailem
    📍 Adresa ordinace, Praha       // ← NAHRADIT reálnou adresou
  </p>
</div>
```

---

## 🧪 Pre-Production Testing

### 1. Email Delivery Test

```bash
# Test všech typů emailů na reálnou adresu
curl https://your-domain.com/api/test/email/booking-confirmation
curl https://your-domain.com/api/test/email/payment-confirmation
curl https://your-domain.com/api/test/email/reminder
curl https://your-domain.com/api/test/email/cancellation
```

**Zkontrolovat:**
- [ ] Email dorazil (ne ve spamu)
- [ ] Všechny linky fungují
- [ ] Obrázky/ikony se zobrazují správně
- [ ] Responzivita na mobilu
- [ ] Čeština správně (diakritika)

### 2. Spam Score Test

1. Odeslat test email na:
   - [Mail-tester.com](https://www.mail-tester.com/)
   - Gmail/Outlook/Apple Mail

2. Zkontrolovat spam score:
   - [ ] SPF: PASS
   - [ ] DKIM: PASS
   - [ ] DMARC: PASS
   - [ ] Score: ≥ 8/10

### 3. Resend Dashboard Monitoring

- [ ] Přihlásit se na [Resend Dashboard](https://resend.com/emails)
- [ ] Zkontrolujte delivery rate
- [ ] Zkontrolujte bounce rate (mělo by být ~0%)
- [ ] Nastavit webhooks pro monitoring (optional)

### 4. End-to-End Flow Test

**Test celého booking flow:**

1. Vytvořit rezervaci přes formulář
   - [ ] Booking confirmation email dorazil
   - [ ] Platební link funguje

2. Zaplatit kauci (test payment)
   - [ ] Payment confirmation email dorazil
   - [ ] Správné údaje (cena, datum, čas)

3. Simulovat reminder (změnit datum v DB na zítřek)
   - [ ] Reminder email dorazil 24h předem

4. Zrušit rezervaci (>24h před termínem)
   - [ ] Cancellation email dorazil
   - [ ] Info o refundu je správné

---

## 🔒 Security Checklist

### 1. Test Endpoints

Odstranit nebo zabezpečit test endpointy:

**Option A: Odstranit**

```bash
rm -rf src/app/api/test/email/
```

**Option B: Environment check**

```typescript
// src/app/api/test/email/route.ts
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    )
  }
  // ... test logic
}
```

**Option C: Authentication**

```typescript
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.TEST_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... test logic
}
```

### 2. Cron Endpoint Protection

Ověřit, že cron endpoint je chráněn:

```typescript
// src/app/api/cron/send-reminders/route.ts

const authHeader = request.headers.get('authorization')
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### 3. Rate Limiting

Implementovat rate limiting pro email odesílání:

```typescript
// Example: Max 5 emails per customer per hour
const recentEmails = await prisma.emailLog.count({
  where: {
    customerEmail: booking.customerEmail,
    createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
  },
})

if (recentEmails >= 5) {
  console.warn('[Email] Rate limit exceeded for:', booking.customerEmail)
  return { success: false, error: 'Rate limit exceeded' }
}
```

### 4. Input Sanitization

Ověřit, že všechny vstupy jsou sanitizovány:

```typescript
// V email šablonách escapovat HTML
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Použití:
<p>Dobrý den <strong>${escapeHtml(booking.customerName)}</strong></p>
```

---

## 📊 Monitoring & Logging

### 1. Error Tracking

Integrovat error tracking service:

**Sentry Example:**

```typescript
import * as Sentry from '@sentry/nextjs'

try {
  const result = await sendPaymentConfirmation(booking)
  if (!result.success) {
    Sentry.captureMessage('Email sending failed', {
      level: 'error',
      extra: {
        bookingId: booking.id,
        email: booking.customerEmail,
        error: result.error,
      },
    })
  }
} catch (error) {
  Sentry.captureException(error)
}
```

### 2. Email Delivery Webhooks

Nastavit Resend webhooks pro monitoring delivery:

1. V Resend dashboard → Settings → Webhooks
2. Přidat endpoint: `https://your-domain.com/api/webhooks/resend`
3. Subscribe to events:
   - `email.sent`
   - `email.delivered`
   - `email.bounced`
   - `email.complained`

```typescript
// src/app/api/webhooks/resend/route.ts

export async function POST(request: NextRequest) {
  const event = await request.json()

  switch (event.type) {
    case 'email.bounced':
      console.error('[Email] Bounced:', event.data.email)
      // Log to database or alert admin
      break

    case 'email.complained':
      console.error('[Email] Spam complaint:', event.data.email)
      // Unsubscribe user or investigate
      break
  }

  return NextResponse.json({ received: true })
}
```

### 3. Logging Best Practices

```typescript
// Structured logging
console.log('[Email]', {
  type: 'payment-confirmation',
  bookingId: booking.id,
  to: booking.customerEmail,
  success: result.success,
  error: result.error || null,
  timestamp: new Date().toISOString(),
})
```

### 4. Metrics & Analytics

Track key metrics:

- Email delivery rate (sent / delivered)
- Bounce rate
- Open rate (pokud používáte tracking)
- Click-through rate (na platební link)
- Time to delivery

---

## 🚀 Deployment Steps

### 1. Pre-deployment

- [ ] Všechny testy proběhly úspěšně
- [ ] Environment variables nastaveny
- [ ] Kontaktní údaje aktualizovány
- [ ] Test endpointy zabezpečeny/odstraněny
- [ ] DNS záznamy ověřeny

### 2. Deploy

```bash
# Vercel
vercel --prod

# Nebo jiný deployment proces
git push origin main
```

### 3. Post-deployment Verification

**Ihned po deployu:**

- [ ] Zkontrolovat, že env variables jsou nastaveny
  ```bash
  vercel env ls
  ```

- [ ] Test email delivery
  ```bash
  curl https://your-domain.com/api/test/email/payment-confirmation
  ```

- [ ] Zkontrolovat Resend dashboard pro delivery

- [ ] Zkontrolovat Vercel logs pro errors
  ```bash
  vercel logs
  ```

### 4. Create Test Booking

Vytvořit real test booking v produkci:

1. Vytvořit rezervaci
   - [ ] Confirmation email dorazil

2. Zaplatit kauci
   - [ ] Payment confirmation email dorazil

3. Zkontrolovat databázi
   - [ ] Booking status: `PAID`
   - [ ] Payment ID je vyplněn

---

## 📈 Performance & Optimization

### 1. Email Queue (Optional)

Pro velké množství emailů použít queue systém:

```typescript
// Example: Bull queue with Redis

import Queue from 'bull'

const emailQueue = new Queue('emails', process.env.REDIS_URL)

emailQueue.process(async (job) => {
  const { type, booking } = job.data

  switch (type) {
    case 'payment-confirmation':
      await sendPaymentConfirmation(booking)
      break
    // ... další typy
  }
})

// Usage:
await emailQueue.add('payment-confirmation', { type: 'payment-confirmation', booking })
```

### 2. Batch Processing (Reminders)

Posílat reminders v batches místo všechny najednou:

```typescript
// Process in batches of 10
const BATCH_SIZE = 10

for (let i = 0; i < bookings.length; i += BATCH_SIZE) {
  const batch = bookings.slice(i, i + BATCH_SIZE)

  await Promise.all(
    batch.map((booking) => sendReminder(booking))
  )

  // Delay between batches (avoid rate limits)
  await new Promise((resolve) => setTimeout(resolve, 1000))
}
```

---

## 📋 Final Checklist

### Pre-Production

- [ ] Resend account vytvořen
- [ ] Vlastní doména přidána a ověřena
- [ ] DNS záznamy (SPF, DKIM, DMARC) nastaveny
- [ ] Production API klíč vygenerován
- [ ] Environment variables nastaveny
- [ ] Kontaktní údaje v šablonách aktualizovány
- [ ] Test endpointy zabezpečeny/odstraněny
- [ ] Spam score test passed (≥8/10)

### Deployment

- [ ] Code deployed to production
- [ ] Environment variables ověřeny
- [ ] Test email odeslaný úspěšně
- [ ] End-to-end flow otestován
- [ ] Resend dashboard monitoring setup

### Post-Production

- [ ] Error tracking nastaveno (Sentry, apod.)
- [ ] Email webhooks nakonfigurovány (optional)
- [ ] Metrics tracking nastaveno
- [ ] Documentation aktualizována
- [ ] Team obeznámen s novým systémem

---

## 🆘 Rollback Plan

Pokud něco selže:

### 1. Okamžitý rollback

```bash
# Vercel
vercel rollback

# Nebo re-deploy předchozí verze
git revert HEAD
git push
```

### 2. Disable email sending

Přidat feature flag:

```typescript
// src/lib/email.ts

async function sendEmail({ to, subject, html }: EmailOptions) {
  // Feature flag - disable all emails
  if (process.env.EMAILS_DISABLED === 'true') {
    console.log('[Email] DISABLED - would send to:', to)
    return { success: true } // Fake success
  }

  // Normal flow...
}
```

Nastavit env variable:

```bash
EMAILS_DISABLED="true"
```

### 3. Fallback to console logging

```typescript
if (!process.env.RESEND_API_KEY) {
  console.log('[Email] NO API KEY - logging instead')
  console.log({ to, subject, html })
  return { success: true }
}
```

---

## 📞 Support Contacts

**Resend Support:**
- Email: support@resend.com
- Docs: [resend.com/docs](https://resend.com/docs)
- Status: [status.resend.com](https://status.resend.com)

**DNS Provider:**
- (Vaše DNS provider support)

**Deployment Platform:**
- Vercel: [vercel.com/support](https://vercel.com/support)
- Nebo váš hosting provider

---

## ✅ Sign-off

Po dokončení všech kroků:

- [ ] Tech Lead approval
- [ ] QA tested and approved
- [ ] Product Owner notified
- [ ] Documentation updated
- [ ] Team trained on new system

**Deployment Date:** _____________

**Deployed By:** _____________

**Verified By:** _____________

---

**Hotovo! Email integration je připravena pro produkci.** 🚀
