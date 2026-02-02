# Dentální Hygiena - Webové stránky ordinace

Moderní webové stránky pro ordinaci dentální hygieny vytvořené v Next.js 14 s TypeScriptem a Tailwind CSS.

## Architektura

**Google Calendar = Single Source of Truth**

Projekt používá Google Calendar jako jediný zdroj pravdy pro rezervace. Žádná databáze není potřeba.

```
Rezervace (Booking) = Google Calendar Event
    ↓
Booking ID = Event ID
    ↓
Event Description obsahuje strukturovaná data:
  - Jméno, Email, Telefon zákazníka
  - Status platby, Kauce, Service ID
    ↓
Event Color = Status:
  - Orange = PENDING_PAYMENT
  - Green = PAID
  - Red = CANCELLED
```

## Funkce

- **15 plně responzivních stránek** - od homepage po právní dokumenty
- **Moderní design** - healthcare design s důrazem na důvěru a profesionalitu
- **SEO optimalizace** - meta tagy, strukturovaná data (Schema.org)
- **Přístupnost** - WCAG 2.1 AA kompatibilita, ARIA atributy, screen reader support
- **Rychlý výkon** - staticky generované stránky, optimalizované obrázky
- **Scroll animace** - plynulé fade-in animace při scrollování s respektem k `prefers-reduced-motion`
- **Plně funkční mobile menu** - backdrop overlay, scroll lock, klávesová navigace (Escape)
- **Comgate platební integrace** - online platby kauce s automatickým potvrzením rezervace
- **Email notifikace** - Nodemailer/SMTP integrace pro potvrzovací emaily a připomínky
- **Google Calendar integrace** - rezervace jako události, real-time dostupnost

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
- **Kalendář:** [Google Calendar API](https://developers.google.com/calendar) - single source of truth
- **Platby:** [Comgate](https://www.comgate.cz/) Payment Gateway
- **Email:** [Nodemailer](https://nodemailer.com/) s lokálním SMTP (Postfix)

## API Endpoints

### Služby
| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/api/services` | GET | Seznam služeb (hardcoded) |

### Dostupnost
| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/api/availability?date=YYYY-MM-DD` | GET | Volné sloty z Google Calendar |

### Rezervace
| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/api/bookings` | POST | Vytvoření rezervace (→ Google Calendar event) |
| `/api/bookings/[id]` | GET | Detail rezervace z kalendáře |
| `/api/bookings/[id]` | PATCH | Aktualizace stavu rezervace |

### Platby
| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/api/payments/create` | POST | Vytvoření Comgate platby |
| `/api/webhooks/comgate` | POST | Webhook pro platební notifikace |

## Instalace

```bash
# Klonování repozitáře
git clone https://github.com/user/ordinace-dental.git
cd ordinace-dental

# Instalace závislostí
npm install

# Kopírovat .env.example do .env a vyplnit hodnoty
cp .env.example .env

# Spuštění development serveru
npm run dev

# Build pro produkci
npm run build

# Spuštění produkčního serveru
npm start
```

### Environment Variables

```bash
# Google Calendar API (POVINNÉ)
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"
GOOGLE_REFRESH_TOKEN="xxx"
GOOGLE_CALENDAR_ID="xxx@group.calendar.google.com"

# Comgate Payments
COMGATE_MERCHANT_ID="your_merchant_id"
COMGATE_SECRET="your_secret_key"
COMGATE_TEST_MODE="true"  # false v produkci

# SMTP Email (Nodemailer)
# Pro lokální Postfix na VPS:
SMTP_HOST="localhost"
SMTP_PORT="25"
# Pro externí SMTP (volitelné):
# SMTP_USER="user"
# SMTP_PASS="password"
EMAIL_FROM="Dentální ordinace <rezervace@dvi12.vas-server.cz>"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Google Calendar Setup

1. Vytvořit projekt v [Google Cloud Console](https://console.cloud.google.com/)
2. Aktivovat **Google Calendar API** (APIs & Services → Library)
3. Vytvořit OAuth 2.0 credentials (APIs & Services → Credentials)
4. Získat refresh token pomocí [OAuth Playground](https://developers.google.com/oauthplayground/)
5. Vytvořit kalendář pro rezervace v Google Calendar
6. Zkopírovat Calendar ID z nastavení kalendáře

## Struktura projektu

```
src/
├── app/                    # Next.js App Router stránky
│   ├── api/               # API routes
│   │   ├── availability/  # Dostupnost z Google Calendar
│   │   ├── bookings/      # Vytvoření/čtení rezervací
│   │   ├── payments/      # Platební API
│   │   ├── services/      # Seznam služeb
│   │   └── webhooks/      # Comgate callback
│   ├── layout.tsx         # Root layout (Header + Footer)
│   ├── globals.css        # Globální styly + animace
│   ├── page.tsx           # Homepage
│   ├── kontakt/           # Kontaktní stránka
│   ├── sluzby/            # Služby + detaily
│   ├── cenik/             # Ceník
│   ├── o-nas/             # O nás
│   ├── objednavka/        # Online rezervace
│   └── ...                # Další stránky
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Hero, Services, About, etc.
│   ├── booking/           # Rezervační komponenty
│   └── ui/                # Reusable UI komponenty
├── hooks/                 # Custom React hooks
├── lib/
│   ├── google-calendar.ts # Google Calendar API integrace
│   ├── services.ts        # Hardcoded služby
│   ├── comgate.ts         # Comgate platební integrace
│   ├── email.ts           # Nodemailer email integrace
│   └── utils.ts           # Utility funkce
└── types/                 # TypeScript typy
```

## Služby

Služby jsou definovány v `src/lib/services.ts`:

| Služba | Cena | Kauce | Trvání |
|--------|------|-------|--------|
| Dentální hygiena | 1 500 Kč | 400 Kč | 60 min |
| Bělení zubů | 4 000 Kč | 800 Kč | 90 min |
| Preventivní prohlídka | 800 Kč | 200 Kč | 30 min |
| Léčba zubního kazu | 2 000 Kč | 500 Kč | 45 min |
| Extrakce zubu | 1 500 Kč | 400 Kč | 30 min |

## Booking Flow

```
1. Zákazník vybere službu a termín
   ↓
2. POST /api/bookings → vytvoří Google Calendar event (oranžový)
   ↓
3. Redirect na Comgate platební bránu
   ↓
4. Zákazník zaplatí kauci
   ↓
5. Comgate webhook → aktualizuje event (zelený = PAID)
   ↓
6. Email potvrzení zákazníkovi
```

## UI Komponenty

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

## Scripts

```bash
npm run dev         # Spuštění dev serveru
npm run build       # Produkční build
npm run start       # Spuštění produkce
npm run lint        # ESLint kontrola
```

## Email Notifikace

| Email | Kdy se odesílá |
|-------|----------------|
| Booking Confirmation | Po vytvoření rezervace (s platebním linkem) |
| Payment Confirmation | Po úspěšné platbě kauce |
| Reminder | 24h před termínem |
| Cancellation | Při zrušení rezervace |

## Barevná paleta

| Barva | Hodnota | Použití |
|-------|---------|---------|
| Primary | `#2E9BB8` | Hlavní akcentová barva (lékařská modrá) |
| Accent | `#1AB69A` | Sekundární akcent (čistá máta) |
| Gray | Tailwind grays | Texty, pozadí |

## Deployment

Projekt je připraven pro deployment na:
- Vercel (doporučeno)
- Netlify
- VPS s Node.js

## Licence

Tento projekt je soukromý a není určen k veřejné distribuci.

---

Vytvořeno s pomocí [Claude Code](https://claude.ai/claude-code)
