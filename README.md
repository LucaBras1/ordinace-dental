# Dentální Hygiena - Webové stránky ordinace

Moderní webové stránky pro ordinaci dentální hygieny vytvořené v Next.js 14 s TypeScriptem a Tailwind CSS.

## Funkce

- **15 plně responzivních stránek** - od homepage po právní dokumenty
- **Moderní design** - healthcare design s důrazem na důvěru a profesionalitu
- **SEO optimalizace** - meta tagy, strukturovaná data (Schema.org)
- **Přístupnost** - WCAG 2.1 AA kompatibilita, ARIA atributy, screen reader support
- **Rychlý výkon** - staticky generované stránky, optimalizované obrázky
- **Scroll animace** - plynulé fade-in animace při scrollování s respektem k `prefers-reduced-motion`
- **Plně funkční mobile menu** - backdrop overlay, scroll lock, klávesová navigace (Escape)
- **Comgate platební integrace** - online platby kauce s automatickým potvrzením rezervace
- **Email notifikace** - Resend integrace pro potvrzovací emaily a připomínky
- **Database-backed rezervace** - Prisma 7 + PostgreSQL pro správu objednávek

## Struktura stránek

### Hlavní stránky
| Stránka | Popis |
|---------|-------|
| `/` | Homepage s hero sekcí, službami, technologiemi a recenzemi |
| `/o-nas` | Představení dentální hygienistky, příběh, hodnoty |
| `/sluzby` | Přehled všech nabízených služeb |
| `/cenik` | Ceník služeb s informacemi o pojišťovnách |
| `/kontakt` | Kontaktní údaje, mapa, kontaktní formulář |
| `/objednavka` | Online rezervační formulář |

### Detaily služeb
| Stránka | Popis |
|---------|-------|
| `/sluzby/dentalni-hygiena` | Profesionální čištění zubů |
| `/sluzby/beleni-zubu` | Bělení zubů |
| `/sluzby/air-flow` | Pískování technologií Air-Flow |
| `/sluzby/parodontologie` | Léčba onemocnění dásní |

### Informační stránky
| Stránka | Popis |
|---------|-------|
| `/technologie` | Vybavení ordinace |
| `/faq` | Často kladené otázky |
| `/recenze` | Recenze pacientů |
| `/pojistovny` | Informace o pojišťovnách a příspěvcích |

### Právní stránky
| Stránka | Popis |
|---------|-------|
| `/ochrana-osobnich-udaju` | GDPR informace |
| `/pristupnost` | Prohlášení o přístupnosti |

## Technologie

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Jazyk:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI komponenty:** Vlastní komponenty s [Radix UI](https://www.radix-ui.com/)
- **Fonty:** Inter (body), Playfair Display (headings)
- **Database:** [Prisma 7](https://www.prisma.io/) + PostgreSQL
- **Platby:** [Comgate](https://www.comgate.cz/) Payment Gateway
- **Email:** [Resend](https://resend.com/) Transactional Email Service

## UI Komponenty

Projekt obsahuje vlastní knihovnu UI komponent:

| Komponenta | Popis |
|------------|-------|
| `Button` | Tlačítko s variantami (primary, secondary, outline, ghost) |
| `PageHeader` | Hlavička podstránek s breadcrumbs |
| `Breadcrumbs` | Drobečková navigace se Schema.org |
| `Card` | Univerzální karta |
| `Input` | Formulářový input s validací |
| `Textarea` | Víceřádkové textové pole |
| `Select` | Dropdown výběr |
| `Accordion` | Akordeon pro FAQ sekce s ARIA atributy |
| `PriceTable` | Tabulka s cenami |
| `ContactInfo` | Kontaktní údaje s hodinami |
| `Map` | Embed mapa |
| `AnimatedSection` | Wrapper pro scroll-triggered animace |
| `AnimatedItem` | Staggered animace pro položky v seznamech |

## Custom Hooks

| Hook | Popis |
|------|-------|
| `useScrollAnimation` | Intersection Observer hook pro scroll animace s podporou `prefers-reduced-motion` |

## Instalace

```bash
# Klonování repozitáře
git clone https://github.com/LucaBras1/ordinace-dental.git
cd ordinace-dental

# Instalace závislostí
npm install

# Kopírovat .env.example do .env a vyplnit hodnoty
cp .env.example .env

# Vygenerovat Prisma Client
npx prisma generate

# Spustit databázové migrace
npx prisma migrate dev

# Spuštění development serveru
npm run dev

# Build pro produkci
npm run build

# Spuštění produkčního serveru
npm start
```

### Environment Variables

Vyplň následující proměnné v `.env`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ordinace_dental"

# Comgate Payments
COMGATE_MERCHANT_ID="your_merchant_id"
COMGATE_SECRET="your_secret_key"
COMGATE_TEST_MODE="true"  # false v produkci

# Resend Email
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="Dentální ordinace <rezervace@ordinace.cz>"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Dokumentace:**
- Platby: [docs/COMGATE_INTEGRATION.md](./docs/COMGATE_INTEGRATION.md)
- Email: [docs/EMAIL_INTEGRATION.md](./docs/EMAIL_INTEGRATION.md)

## Struktura projektu

```
src/
├── app/                    # Next.js App Router stránky
│   ├── api/               # API routes
│   │   ├── payments/      # Platební API
│   │   │   └── create/    # Vytvoření platby
│   │   └── webhooks/      # Webhooks
│   │       └── comgate/   # Comgate callback
│   ├── layout.tsx         # Root layout (Header + Footer)
│   ├── globals.css        # Globální styly + animace
│   ├── page.tsx           # Homepage
│   ├── kontakt/           # Kontaktní stránka
│   ├── sluzby/            # Služby + detaily
│   ├── cenik/             # Ceník
│   ├── o-nas/             # O nás
│   ├── objednavka/        # Online rezervace
│   ├── technologie/       # Vybavení ordinace
│   ├── faq/               # FAQ
│   ├── recenze/           # Recenze
│   ├── pojistovny/        # Pojišťovny
│   ├── ochrana-osobnich-udaju/  # GDPR
│   └── pristupnost/       # Přístupnost
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Hero, Services, About, etc.
│   └── ui/                # Reusable UI komponenty
├── generated/
│   └── prisma/            # Generovaný Prisma Client
├── hooks/
│   └── useScrollAnimation.ts  # Intersection Observer hook
├── lib/
│   ├── comgate.ts         # Comgate platební integrace
│   ├── email.ts           # Resend email integrace
│   ├── prisma.ts          # Prisma 7 client s pg adapter
│   └── utils.ts           # Utility funkce (cn)
├── prisma/
│   └── schema.prisma      # Databázové schema
├── docs/
│   ├── COMGATE_INTEGRATION.md  # Platební brána
│   └── EMAIL_INTEGRATION.md    # Email systém
└── public/
    ├── images/            # Obrázky
    └── logo.svg           # Logo
```

## Barevná paleta

| Barva | Hodnota | Použití |
|-------|---------|---------|
| Primary | `#2E9BB8` | Hlavní akcentová barva (lékařská modrá) |
| Accent | `#1AB69A` | Sekundární akcent (čistá máta) |
| Gray | Tailwind grays | Texty, pozadí |

## Scripts

```bash
npm run dev         # Spuštění dev serveru
npm run build       # Produkční build
npm run start       # Spuštění produkce
npm run lint        # ESLint kontrola

# Database skripty
npm run db:generate # Vygenerovat Prisma Client
npm run db:migrate  # Vytvořit a aplikovat migraci
npm run db:seed     # Seed databáze (vytvoří služby)
npm run db:studio   # Otevřít Prisma Studio (GUI)
```

## Database Schema

**Dokumentace:** [docs/database-schema.md](docs/database-schema.md)

### Services (služby)
- Dentální hygiena, Bělení zubů, Air-Flow čištění, Parodontologie, Konzultace
- Ceny a kauční částky v haléřích (INT)
- Duration v minutách pro slot alokaci

### Bookings (rezervace)
- Customer info (jméno, email, telefon)
- Appointment datetime (DATE + TIME string)
- Status: PENDING_PAYMENT → PAID → COMPLETED
- Payment ID (Comgate integration)
- Google Calendar Event ID (sync)
- GDPR consent tracking

**Migration Guide:** [docs/database-migration-guide.md](docs/database-migration-guide.md)

## Email Integration

Projekt obsahuje kompletní email systém pro notifikace zákazníků:

### Email typy

| Email | Kdy se odesílá | Obsahuje |
|-------|----------------|----------|
| **Booking Confirmation** | Po vytvoření rezervace | Platební link, detail rezervace, storno podmínky |
| **Payment Confirmation** | Po úspěšné platbě kauce | Potvrzení rezervace, co přinést, detail návštěvy |
| **Reminder** | 24h před termínem | Připomínka návštěvy, co přinést |
| **Cancellation** | Při zrušení rezervace | Info o zrušení, vrácení kauce (pokud nárok) |

### Použití

```typescript
import { sendPaymentConfirmation } from '@/lib/email'

// Po úspěšné platbě
await sendPaymentConfirmation({
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
})
```

### Testování

```bash
# Quick test (otevřít v prohlížeči)
http://localhost:3000/api/test/email/payment-confirmation

# Nebo pomocí curl
curl http://localhost:3000/api/test/email/payment-confirmation
```

**Dokumentace:**
- [EMAIL_INTEGRATION.md](./docs/EMAIL_INTEGRATION.md) - Kompletní dokumentace
- [EMAIL_TESTING.md](./docs/EMAIL_TESTING.md) - Testing guide
- [EMAIL_QUICK_REFERENCE.md](./docs/EMAIL_QUICK_REFERENCE.md) - Quick reference

## Deployment

Projekt je připraven pro deployment na:
- Vercel (doporučeno)
- Netlify
- VPS s Node.js

## Licence

Tento projekt je soukromý a není určen k veřejné distribuci.

---

Vytvořeno s pomocí [Claude Code](https://claude.ai/claude-code)
