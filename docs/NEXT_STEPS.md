# Next Steps - Databáze Setup a Integrace

## Dokončené Úkoly

- [x] Prisma 7 schéma s PostgreSQL adapterem
- [x] Build-time guard v `src/lib/prisma.ts` (Proxy pattern)
- [x] Service model (služby s cenami v haléřích)
- [x] Booking model (rezervace s Comgate integrací)
- [x] Seed script (5 základních služeb)
- [x] Dokumentace schématu a migrací
- [x] .gitignore aktualizace (`src/generated/prisma/`)
- [x] Package.json skripty (db:generate, db:migrate, db:seed, db:studio)
- [x] API route příklad (`/api/services`)

## Následující Kroky

### 1. Database Setup (FIRST!)

```bash
# Vytvořit PostgreSQL databázi
# Option A: Local PostgreSQL
sudo -u postgres psql
CREATE DATABASE ordinace_dental;
CREATE USER ordinace_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ordinace_dental TO ordinace_user;
\q

# Option B: Docker
docker run --name ordinace-postgres \
  -e POSTGRES_DB=ordinace_dental \
  -e POSTGRES_USER=ordinace_user \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  -d postgres:16-alpine

# Option C: Hosted (Railway, Supabase, Neon)
# → Získat connection string z dashboardu
```

### 2. Environment Configuration

```bash
# Vytvořit .env soubor
cp .env.example .env

# Editovat .env a nastavit DATABASE_URL
DATABASE_URL="postgresql://ordinace_user:secure_password@localhost:5432/ordinace_dental?schema=public"
```

### 3. Initial Migration

```bash
# Vygenerovat Prisma Client
npm run db:generate

# Vytvořit tabulky v databázi
npm run db:migrate
# Pojmenuj migraci: initial_schema

# Seed databáze (vytvoří 5 služeb)
npm run db:seed
```

### 4. Verify Setup

```bash
# Otevřít Prisma Studio
npm run db:studio
# → http://localhost:5555

# Zkontroluj že máš:
# - 5 services (Dentální hygiena, Bělení, Air-Flow, Parodontologie, Konzultace)
# - 0 bookings (prázdná tabulka)

# Test API endpoint
npm run dev
# curl http://localhost:3000/api/services
```

### 5. Frontend Integration

#### Vytvořit Booking Form Komponentu

```typescript
// src/components/booking/BookingForm.tsx
"use client"

import { useState, useEffect } from 'react'

interface Service {
  id: string
  name: string
  price: number
  depositAmount: number
  duration: number
}

export function BookingForm() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<string>('')

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data.services))
  }, [])

  return (
    <form>
      <select
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
      >
        <option value="">Vyberte službu</option>
        {services.map(service => (
          <option key={service.id} value={service.id}>
            {service.name} - {service.price / 100} Kč
          </option>
        ))}
      </select>
      {/* Další formulářová pole... */}
    </form>
  )
}
```

#### Vytvořit Booking API Route

```bash
# Vytvořit adresář
mkdir -p src/app/api/bookings

# Vytvořit route
touch src/app/api/bookings/route.ts
```

**Implementace:**
```typescript
// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bookingSchema = z.object({
  serviceId: z.string().cuid(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  appointmentDate: z.string(), // ISO date
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().optional(),
  isFirstVisit: z.boolean().default(true),
  gdprConsent: z.boolean().refine(val => val === true),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = bookingSchema.parse(body)

    // Najdi službu
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Vytvoř rezervaci
    const booking = await prisma.booking.create({
      data: {
        serviceId: data.serviceId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        appointmentDate: new Date(data.appointmentDate),
        appointmentTime: data.appointmentTime,
        depositAmount: service.depositAmount,
        notes: data.notes,
        isFirstVisit: data.isFirstVisit,
        gdprConsent: data.gdprConsent,
        status: 'PENDING_PAYMENT',
      },
      include: {
        service: true
      }
    })

    // TODO: Vytvořit Comgate platbu
    // const paymentUrl = await createComgatePayment(booking)

    return NextResponse.json({
      success: true,
      booking,
      // paymentUrl
    })
  } catch (error) {
    console.error('[API] Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
```

### 6. Comgate Integration

**Vytvořit Comgate service:**

```bash
mkdir -p src/lib/comgate
touch src/lib/comgate/client.ts
```

**Implementace:**
```typescript
// src/lib/comgate/client.ts
interface ComgatePaymentParams {
  price: number // v haléřích
  label: string
  refId: string // booking.id
  email: string
  method?: 'ALL' | 'CARD_CZ' | 'CARD_ALL'
}

export async function createComgatePayment(params: ComgatePaymentParams) {
  const merchantId = process.env.COMGATE_MERCHANT_ID!
  const secret = process.env.COMGATE_SECRET!
  const testMode = process.env.COMGATE_TEST_MODE === 'true'

  const url = testMode
    ? 'https://payments.comgate.cz/v1.0/create'
    : 'https://payments.comgate.cz/v1.0/create'

  // TODO: Implementovat Comgate API call
  // Viz: https://help.comgate.cz/docs/cs/api-platebni-brana

  return {
    transId: 'ABC123',
    redirectUrl: 'https://payments.comgate.cz/client/...'
  }
}
```

### 7. Email Notifications

**Vytvořit email service:**

```bash
mkdir -p src/lib/email
touch src/lib/email/templates.ts
```

**Možnosti:**
- Resend (https://resend.com) - doporučeno
- Nodemailer + SMTP
- SendGrid
- Mailgun

**Template příklad:**
```typescript
// src/lib/email/templates.ts
export function bookingConfirmationEmail(booking: Booking) {
  return {
    subject: `Potvrzení rezervace - ${booking.service.name}`,
    html: `
      <h1>Rezervace potvrzena</h1>
      <p>Dobrý den ${booking.customerName},</p>
      <p>Vaše rezervace byla úspěšně vytvořena:</p>
      <ul>
        <li>Služba: ${booking.service.name}</li>
        <li>Datum: ${booking.appointmentDate}</li>
        <li>Čas: ${booking.appointmentTime}</li>
        <li>Kauce: ${booking.depositAmount / 100} Kč</li>
      </ul>
      <p>Těšíme se na Vaši návštěvu!</p>
    `
  }
}
```

### 8. Google Calendar Integration

**Vytvořit Google Calendar service:**

```bash
touch src/lib/google-calendar.ts
```

**Setup:**
1. Vytvořit projekt v Google Cloud Console
2. Povolit Google Calendar API
3. Vytvořit Service Account
4. Získat credentials JSON
5. Sdílet kalendář se service account email

**Implementace:**
```typescript
// src/lib/google-calendar.ts
import { google } from 'googleapis'

export async function createCalendarEvent(booking: Booking) {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
    scopes: ['https://www.googleapis.com/auth/calendar']
  })

  const calendar = google.calendar({ version: 'v3', auth })

  const event = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    requestBody: {
      summary: `${booking.service.name} - ${booking.customerName}`,
      description: `Email: ${booking.customerEmail}\nTelefon: ${booking.customerPhone}`,
      start: {
        dateTime: `${booking.appointmentDate}T${booking.appointmentTime}:00`,
        timeZone: 'Europe/Prague'
      },
      end: {
        dateTime: calculateEndTime(booking),
        timeZone: 'Europe/Prague'
      }
    }
  })

  return event.data.id
}
```

### 9. Admin Dashboard

**Vytvořit admin stránky:**

```bash
mkdir -p src/app/admin/bookings
touch src/app/admin/bookings/page.tsx
```

**Features:**
- Seznam všech rezervací
- Filter dle statusu (PENDING_PAYMENT, PAID, COMPLETED)
- Detail rezervace
- Akce: Potvrdit platbu, Zrušit, Označit jako COMPLETED/NO_SHOW
- Export do CSV

### 10. Testing

**Unit tests:**
```bash
npm install --save-dev vitest @testing-library/react
```

**E2E tests:**
```bash
npm install --save-dev @playwright/test
```

**Test příklad:**
```typescript
// src/app/api/services/route.test.ts
import { GET } from './route'

describe('GET /api/services', () => {
  it('returns active services', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.services).toBeInstanceOf(Array)
    expect(data.services.length).toBeGreaterThan(0)
  })
})
```

## Production Deployment Checklist

- [ ] Database setup (produkční PostgreSQL)
- [ ] Environment variables nastaveny
- [ ] Prisma generate před buildem
- [ ] Database migrace deployed (`npx prisma migrate deploy`)
- [ ] Comgate production credentials
- [ ] Email service nakonfigurován
- [ ] Google Calendar (optional) nakonfigurován
- [ ] SSL certifikát (HTTPS)
- [ ] Backup strategie databáze
- [ ] Monitoring (Sentry, LogRocket)
- [ ] Analytics (Google Analytics)

## Užitečné Odkazy

- [Prisma 7 Documentation](https://www.prisma.io/docs)
- [Comgate API Docs](https://help.comgate.cz/docs/cs/api-platebni-brana)
- [Google Calendar API](https://developers.google.com/calendar/api/guides/overview)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod Validation](https://zod.dev/)

---

**Last Updated:** 2026-02-01
