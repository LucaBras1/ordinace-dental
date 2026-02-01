# Database Schema - Dentální Ordinace

## Overview
Databázové schéma pro rezervační systém dentální ordinace s online platbou kauce přes Comgate payment gateway. Používá **Prisma 7** s **PostgreSQL** a `@prisma/adapter-pg`.

## Technology Stack
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Adapter**: @prisma/adapter-pg (connection pooling s pg)
- **Generated Client**: `src/generated/prisma/`

## Tables

### services
Definice služeb nabízených ordinací (dentální hygiena, bělení, Air-Flow atd.).

**Columns:**
- `id` (VARCHAR 36): Primary key, CUID
- `name` (VARCHAR): Název služby (např. "Dentální hygiena")
- `slug` (VARCHAR): URL-friendly slug, unique, indexed (např. "dentalni-hygiena")
- `description` (TEXT): Popis služby pro zákazníky
- `price` (INT): Plná cena služby v haléřích (1500 Kč = 150000)
- `depositAmount` (INT): Výše kauce v haléřích (500 Kč = 50000)
- `duration` (INT): Trvání služby v minutách (např. 60)
- `active` (BOOLEAN): Je služba aktivní pro rezervace? (default: true)
- `displayOrder` (INT): Pořadí zobrazení v seznamu (default: 0)
- `createdAt` (TIMESTAMP): Timestamp vytvoření
- `updatedAt` (TIMESTAMP): Timestamp poslední změny

**Indexes:**
- `idx_services_slug`: Na slug pro rychlé URL lookupy
- `idx_services_active_order`: Composite index (active, displayOrder) pro výpis aktivních služeb

**Business Rules:**
- Ceny v haléřích (CZK * 100) pro přesnost bez floating point chyb
- Slug musí být unique pro URL routing
- Active flag pro dočasné skrytí služby bez smazání

**Relationships:**
- One-to-Many s `bookings` (služba může mít mnoho rezervací)

---

### bookings
Rezervace termínů pacientů s platbou kauce.

**Columns:**
- `id` (VARCHAR 36): Primary key, CUID
- `serviceId` (VARCHAR 36): Foreign key → services.id (RESTRICT on delete)
- `customerName` (VARCHAR): Jméno a příjmení pacienta
- `customerEmail` (VARCHAR): Email (pro potvrzení a připomínky), indexed
- `customerPhone` (VARCHAR): Telefon pacienta
- `appointmentDate` (DATE): Datum návštěvy
- `appointmentTime` (VARCHAR): Čas návštěvy jako string "HH:mm" (např. "14:30")
- `status` (ENUM BookingStatus): Stav rezervace (default: PENDING_PAYMENT)
- `depositAmount` (INT): Zaplacená kauce v haléřích
- `paymentId` (VARCHAR): Comgate transaction/payment ID, indexed
- `googleEventId` (VARCHAR): ID události v Google Calendar (pro sync)
- `notes` (TEXT): Poznámky od pacienta nebo ordinace
- `isFirstVisit` (BOOLEAN): Je to první návštěva pacienta? (default: true)
- `gdprConsent` (BOOLEAN): Souhlas se zpracováním osobních údajů (default: false)
- `createdAt` (TIMESTAMP): Timestamp vytvoření rezervace
- `updatedAt` (TIMESTAMP): Timestamp poslední změny
- `cancelledAt` (TIMESTAMP): Timestamp zrušení (NULL pokud není zrušeno)

**Indexes:**
- `idx_bookings_service_id`: Pro dotazy na rezervace konkrétní služby
- `idx_bookings_customer_email`: Pro vyhledání rezervací zákazníka
- `idx_bookings_appointment_date_time`: Composite index pro kalendář
- `idx_bookings_status`: Pro filtrování dle stavu
- `idx_bookings_payment_id`: Pro zpětné vyhledání dle Comgate payment ID
- `idx_bookings_created_at`: Pro řazení a analytics

**Enums:**
- `BookingStatus`:
  - `PENDING_PAYMENT`: Vytvořeno, čeká na zaplacení kauce
  - `PAID`: Kauce zaplacena, rezervace potvrzena
  - `COMPLETED`: Návštěva úspěšně proběhla
  - `NO_SHOW`: Pacient nedorazil
  - `CANCELLED`: Zrušeno pacientem nebo ordinací
  - `REFUNDED`: Kauce byla vrácena

**Business Rules:**
- `appointmentTime` jako string pro flexibilitu (není závislý na timezone)
- `depositAmount` kopíruje hodnotu ze service při vytvoření (pro historii)
- `paymentId` se vyplní po úspěšné platbě v Comgate
- `cancelledAt` se nastaví pouze při přechodu do CANCELLED status
- Foreign key RESTRICT na service (nelze smazat službu s existujícími rezervacemi)

**Relationships:**
- Many-to-One s `services` (rezervace patří k jedné službě)

---

## Entity Relationship Diagram

```
┌────────────────────┐       ┌────────────────────┐
│     services       │       │      bookings      │
├────────────────────┤       ├────────────────────┤
│ id (PK)            │◄──────┤ id (PK)            │
│ name               │ 1   ∞ │ serviceId (FK)     │
│ slug (UNIQUE)      │       │ customerName       │
│ description        │       │ customerEmail      │
│ price              │       │ customerPhone      │
│ depositAmount      │       │ appointmentDate    │
│ duration           │       │ appointmentTime    │
│ active             │       │ status (ENUM)      │
│ displayOrder       │       │ depositAmount      │
│ createdAt          │       │ paymentId          │
│ updatedAt          │       │ googleEventId      │
└────────────────────┘       │ notes              │
                             │ isFirstVisit       │
                             │ gdprConsent        │
                             │ createdAt          │
                             │ updatedAt          │
                             │ cancelledAt        │
                             └────────────────────┘
```

## Data Types - Price Handling

**KRITICKÉ: Všechny ceny v haléřích (CZK * 100)**

```typescript
// Správně - ceny v haléřích
const service = {
  price: 150000,        // 1500 Kč
  depositAmount: 50000  // 500 Kč
}

// Pro zobrazení uživateli
const displayPrice = service.price / 100 // 1500
const formatted = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK'
}).format(displayPrice) // "1 500 Kč"
```

**Proč haléře?**
- Žádné floating point chyby (1.50 + 1.50 ≠ 3.00)
- Integer aritmetika je přesná
- Comgate API očekává ceny v haléřích

## Migration Strategy

### Development
```bash
# Vytvoř migraci
npx prisma migrate dev --name initial_schema

# Vygeneruj Prisma Client
npx prisma generate

# Seed databáze
npx prisma db seed
```

### Production
```bash
# Aplikuj migrace
npx prisma migrate deploy

# Vygeneruj client (po git pull)
npx prisma generate

# Seed (pouze při prvním nasazení)
NODE_ENV=production npx prisma db seed
```

### Rollback Strategy
Prisma nepodporuje automatický rollback. Pro rollback:
1. Vytvořit novou migraci s opačnými změnami
2. Nebo: Restore databáze ze zálohy
3. **Vždy zálohovat před migrací v produkci**

## Seed Data

Seed script vytvoří 5 základních služeb:

1. **Dentální hygiena** - 1500 Kč (kauce 500 Kč), 60 min
2. **Bělení zubů** - 5000 Kč (kauce 1000 Kč), 90 min
3. **Air-Flow čištění** - 1200 Kč (kauce 300 Kč), 45 min
4. **Parodontologické ošetření** - 2000 Kč (kauce 500 Kč), 75 min
5. **Konzultace a vyšetření** - 500 Kč (kauce 200 Kč), 30 min

```bash
npx prisma db seed
```

## Performance Considerations

### Query Optimization

```typescript
// Špatně - N+1 query problém
const bookings = await prisma.booking.findMany()
for (const booking of bookings) {
  const service = await prisma.service.findUnique({
    where: { id: booking.serviceId }
  })
}

// Správně - Eager loading s include
const bookings = await prisma.booking.findMany({
  include: {
    service: true
  }
})
```

### Index Usage

```typescript
// Využívá idx_bookings_appointment_date_time
const todayBookings = await prisma.booking.findMany({
  where: {
    appointmentDate: new Date('2026-02-01'),
    appointmentTime: { gte: '09:00' }
  },
  orderBy: { appointmentTime: 'asc' }
})

// Využívá idx_bookings_status
const pendingPayments = await prisma.booking.findMany({
  where: { status: 'PENDING_PAYMENT' },
  take: 20
})
```

## Security Considerations

### Environment Variables
```bash
# NIKDY necommitovat!
DATABASE_URL="postgresql://user:password@localhost:5432/db"
COMGATE_SECRET="secret_key"
```

### Data Validation
- Email validace před zápisem do DB
- Phone number sanitization (odstranit mezery, pomlčky)
- GDPR consent MUSÍ být true před uložením booking

### PII Protection
- `customerEmail`, `customerPhone`, `customerName` obsahují osobní údaje
- Implementovat data retention policy (např. smazat po 2 letech)
- Logovat pouze anonymizovaná data (booking ID, ne jméno)

## Common Queries

### Volné termíny (simplified)
```typescript
// Najdi všechny zabrané sloty na daný den
const bookedSlots = await prisma.booking.findMany({
  where: {
    appointmentDate: date,
    status: { in: ['PAID', 'PENDING_PAYMENT'] }
  },
  select: {
    appointmentTime: true,
    service: { select: { duration: true } }
  }
})

// Vyfiltruj dostupné sloty (logika v aplikaci)
```

### Statistiky pro admin
```typescript
// Počet rezervací dle statusu
const stats = await prisma.booking.groupBy({
  by: ['status'],
  _count: { id: true }
})

// Příjmy z kaucí (zaplacené)
const revenue = await prisma.booking.aggregate({
  where: { status: 'PAID' },
  _sum: { depositAmount: true }
})
```

## Prisma 7 Specifics

### Build-time Guard Pattern
`src/lib/prisma.ts` používá **Proxy pattern** místo `throw new Error()` na top-level, protože:
- `DATABASE_URL` není dostupné při `next build`
- Přímý throw by způsobil build error
- Proxy dovolí build proběhnout a vyhodí error až při runtime použití

### PostgreSQL Adapter
```typescript
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```

**Výhody:**
- Nativní connection pooling přes pg
- Lepší performance než default connector
- Více kontroly nad pool configuration

## Integration Points

### Comgate Payment Gateway
- `booking.paymentId` → Comgate transaction ID
- Po úspěšné platbě: Update status → PAID
- Webhook endpoint validuje `paymentId` a aktualizuje booking

### Google Calendar API
- `booking.googleEventId` → Google Calendar Event ID
- Při vytvoření PAID booking → vytvořit event v kalendáři
- Při zrušení → smazat event z kalendáře
- Sync appointmentDate, appointmentTime, duration

### Email Notifications
- PENDING_PAYMENT → platební link + instrukce
- PAID → potvrzení rezervace + reminder 24h před
- CANCELLED → info o zrušení + refund status

## Future Enhancements

### Možná rozšíření schématu:
- **Staff model** - zaměstnanci ordinace (zubaři, hygienistky)
- **WorkingHours model** - pracovní doba ordinace (pro automatické sloty)
- **BlockedSlots model** - blokované termíny (dovolená, svátky)
- **Reviews model** - hodnocení a recenze služeb
- **Notifications model** - log odeslaných notifikací
- **Refunds model** - detailní historie vrácení kaucí

---

**Generated:** 2026-02-01
**Prisma Version:** 7.x
**Database:** PostgreSQL
