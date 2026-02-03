# Dentální Hygiena - Webové stránky ordinace

Moderní webové stránky pro ordinaci dentální hygieny vytvořené v Next.js 14 s TypeScriptem a Tailwind CSS.

## Architektura

**Google Calendar = Single Source of Truth**

Projekt používá Google Calendar jako jediný zdroj pravdy pro rezervace. Žádná databáze není potřeba. Kalendář je sdílený s programem **SmartMEDIX** pro oboustrannou synchronizaci.

```
┌─────────────────────┐              ┌──────────────────────┐
│   Web (Ordinace)    │              │   SmartMEDIX         │
│   Next.js app       │              │   Desktop app        │
│                     │              │                      │
│  [Booking Form]     │              │  [Plánovač]          │
│       ↓             │              │       ↕              │
│  [Comgate platba]   │              │  [Lokální DB]        │
│       ↓ (po platbě) │              │       ↕              │
│  [Google Cal API]───┼──────────────┼──[Google Cal sync]   │
└─────────────────────┘              └──────────────────────┘
                    ↘                ↙
              ┌─────────────────────────────┐
              │      GOOGLE CALENDAR        │
              │   (Single Source of Truth)  │
              │                             │
              │  Event = Rezervace          │
              │  - Summary: Služba + Jméno  │
              │  - Description: Kontakty    │
              │  - Color: Status platby     │
              │  - Zdroj: WEB / SmartMEDIX  │
              └─────────────────────────────┘
```

### Klíčové principy

- **SmartMEDIX = primární zdroj pravdy** - v případě konfliktu platí data z Medix
- **Platba = podmínka pro rezervaci** - GCal event se vytváří POUZE po úspěšné platbě
- **Žádné "ghost" eventy** - nedokončené platby nevytváří záznamy v kalendáři
- **Zdroj: WEB** - webové rezervace jsou označeny pro rozlišení od SmartMEDIX

### Event struktura

```
Rezervace (Booking) = Google Calendar Event
    ↓
Event Summary: "Služba - Jméno zákazníka"
    ↓
Event Description obsahuje strukturovaná data:
  - Jméno, Email, Telefon zákazníka
  - Status platby, Kauce (ZAPLACENO)
  - ServiceID, Poznámky
  - Zdroj: WEB
    ↓
Event Color = Status:
  - Green (10) = PAID (zaplaceno)
  - Orange (6) = PENDING_PAYMENT (čeká na platbu)
  - Red (11) = CANCELLED (zrušeno)
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
- **SmartMEDIX kompatibilita** - oboustranná synchronizace s ordinačním systémem

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

### Booking stránky
| Stránka | Popis |
|---------|-------|
| `/objednavka` | Rezervační formulář |
| `/objednavka/uspech` | Potvrzení úspěšné rezervace |
| `/objednavka/zruseno` | Zrušená/neúspěšná platba |
| `/objednavka/chyba` | Error page (expirovaná rezervace, chyba platby) |

## Technologie

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Jazyk:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI komponenty:** Vlastní komponenty s [Radix UI](https://www.radix-ui.com/)
- **Animace:** [Framer Motion](https://www.framer.com/motion/)
- **Fonty:** Inter (body), Playfair Display (headings)
- **Kalendář:** [Google Calendar API](https://developers.google.com/calendar) - single source of truth
- **Platby:** [Comgate](https://www.comgate.cz/) Payment Gateway
- **Email:** [Nodemailer](https://nodemailer.com/) s lokálním SMTP (Postfix)
- **Ordinační systém:** [SmartMEDIX](https://www.smartmedix.cz/) - kompatibilita přes Google Calendar

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
| `/api/bookings` | POST | Vytvoření pending rezervace (vrací pendingBookingId) |
| `/api/bookings/[id]` | GET | Detail rezervace z kalendáře |
| `/api/bookings/[id]` | PATCH | Aktualizace stavu rezervace |
| `/api/bookings/[id]/cancel` | POST | Zrušení rezervace s emailem |

### Platby
| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/api/payments/create` | GET | Vytvoření platby (redirect z formuláře) |
| `/api/payments/create` | POST | Vytvoření platby (programmatic) |
| `/api/webhooks/comgate` | POST | Webhook - vytvoří GCal event po úspěšné platbě |

### Cron Jobs
| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/api/cron/send-reminders` | GET | Odeslání připomínek (24h před termínem) |

## Instalace

```bash
# Klonování repozitáře
git clone https://github.com/LucaBras1/ordinace-dental.git
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

### SmartMEDIX Setup

Pro integraci se SmartMEDIX (dle manuálu str. 8153-8235):

1. **Google Cloud Console:**
   - Vytvořit OAuth2 credentials (Credentials → Create → OAuth Client ID → Other)
   - Stáhnout JSON soubor s credentials

2. **SmartMEDIX:**
   - Otevřít Konfigurace → Google kalendář
   - Vybrat lékaře a kliknout "Načíst konfiguraci"
   - Vybrat stažený JSON soubor
   - Kliknout "Přihlášení" → vygeneruje se URL
   - Otevřít URL v prohlížeči, přihlásit se Google účtem
   - Zkopírovat autorizační kód zpět do SmartMEDIX
   - **Vybrat STEJNÝ kalendář jako webová aplikace** (`GOOGLE_CALENDAR_ID`)
   - Zaškrtnout "Kalendář je aktivní"

3. **Ověření:**
   - Vytvořit testovací rezervaci v SmartMEDIX
   - Ověřit, že se objeví v Google Calendar
   - Na webu ověřit, že slot je obsazený

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
│   │   ├── page.tsx       # Booking form
│   │   ├── uspech/        # Success page
│   │   ├── zruseno/       # Cancelled page
│   │   └── chyba/         # Error page
│   └── ...                # Další stránky
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Hero, Services, About, etc.
│   ├── booking/           # Rezervační komponenty
│   └── ui/                # Reusable UI komponenty
├── hooks/                 # Custom React hooks
├── lib/
│   ├── google-calendar.ts # Google Calendar API integrace
│   ├── pending-bookings.ts # In-memory storage před platbou
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
2. POST /api/bookings → uloží do pending storage (30min TTL)
   ↓
3. Redirect na GET /api/payments/create → Comgate platební brána
   ↓
4. Zákazník zaplatí kauci
   ↓
5. Comgate webhook (PAID) → vytvoří Google Calendar event (zelený)
   ↓
6. Email potvrzení zákazníkovi
   ↓
7. Rezervace viditelná v SmartMEDIX

❌ Při neúspěšné platbě (CANCELLED/TIMEOUT):
   - Pending booking se smaže
   - ŽÁDNÝ Google Calendar event se nevytváří
   - Slot zůstává volný
```

### Pending Bookings

Před zaplacením jsou data rezervace uložena v `pending-bookings.ts`:
- In-memory Map storage
- UUID klíč (použit jako `refId` pro Comgate)
- 30 minutové TTL
- Automatický cleanup každých 5 minut

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
npm run test        # Vitest unit testy
npm run test:watch  # Vitest watch mode
npm run cypress     # Cypress GUI
npm run cypress:run # Cypress headless
```

## Testování

### Unit Testy (Vitest)
```bash
npm run test
```

Testy pokrývají:
- BookingForm komponenta (20 testů)
- Service selection, navigation, error handling
- Progress bar, accessibility, price formatting

### E2E Testy (Cypress)
```bash
npm run cypress
```

E2E testy pokrývají celý booking flow:
- Výběr služby → Výběr termínu → Kontaktní údaje → Platba
- Validace formulářů
- Responsive design (mobile, tablet, desktop)
- Error handling

## Email Notifikace

| Email | Kdy se odesílá |
|-------|----------------|
| Payment Confirmation | Po úspěšné platbě kauce (z webhook) |
| Reminder | 24h před termínem |
| Cancellation | Při zrušení rezervace / neúspěšné platbě |

## SmartMEDIX Integrace

### Jak to funguje

1. **Web rezervace:**
   - Zákazník vyplní formulář na webu
   - Po platbě se vytvoří GCal event s `Zdroj: WEB`
   - Event se automaticky synchronizuje do SmartMEDIX

2. **SmartMEDIX rezervace:**
   - Lékař/recepce vytvoří rezervaci v SmartMEDIX
   - Event se synchronizuje do Google Calendar
   - Na webu se slot zobrazí jako obsazený

3. **Zrušení:**
   - Při zrušení v SmartMEDIX → event zmizí z GCal → slot volný na webu
   - Při zrušení přes web → email zákazníkovi, event aktualizován

### Rozlišení zdrojů

Webové rezervace obsahují v description:
```
Zdroj: WEB
```

SmartMEDIX rezervace tento řádek nemají, což umožňuje rozlišit původ.

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

### Důležité poznámky pro produkci

1. **Pending bookings persistence:**
   - Aktuálně in-memory storage
   - Při restartu serveru se pending bookings ztratí
   - Pro HA deployment zvážit Redis

2. **Environment variables:**
   - Všechny `GOOGLE_*` proměnné musí být nastaveny
   - `COMGATE_TEST_MODE=false` pro produkci

3. **CRON job:**
   - Nastavit cron pro `/api/cron/send-reminders` (každou hodinu)

## Licence

Tento projekt je soukromý a není určen k veřejné distribuci.

---

Vytvořeno s pomocí [Claude Code](https://claude.ai/claude-code)
