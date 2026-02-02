# Next Steps - Produkční Deployment

## Architektura

**Google Calendar = Single Source of Truth**

Projekt nepoužívá databázi. Všechny rezervace jsou ukládány jako Google Calendar events.

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
  - Orange (#6) = PENDING_PAYMENT
  - Green (#10) = PAID
  - Red (#11) = CANCELLED
  - Gray (#8) = NO_SHOW
```

## Dokončené Úkoly

### Core Features
- [x] Google Calendar integrace (OAuth2, events, availability)
- [x] Booking wizard (4 kroky)
- [x] Comgate platební integrace
- [x] Email notifikace (Nodemailer)
- [x] Cron job pro připomínky (`/api/cron/send-reminders`)
- [x] Cancellation endpoint (`/api/bookings/[id]/cancel`)

### Testing
- [x] Vitest unit testy (20 testů)
- [x] Cypress E2E konfigurace
- [x] Booking flow E2E testy

### Security
- [x] Production guard na test endpointech
- [x] CRON_SECRET autentizace

---

## Následující Kroky

### 1. Google Calendar OAuth Token (KRITICKÉ)

```bash
# 1. Spustit dev server
npm run dev

# 2. Otevřít v prohlížeči
http://localhost:3000/api/calendar/setup

# 3. Přihlásit se účtem zubykorunni@gmail.com

# 4. Po autorizaci získat refresh token z odpovědi

# 5. Přidat do .env
GOOGLE_REFRESH_TOKEN="1//0xxx..."

# 6. Restartovat server a otestovat
npm run calendar:test
```

### 2. CRON_SECRET Generování

```bash
# Vygenerovat bezpečný secret
openssl rand -hex 32

# Přidat do .env
CRON_SECRET="váš_vygenerovaný_secret"
```

### 3. Cron Job Konfigurace

**Možnost A: Server cron (VPS)**
```bash
# Editovat crontab
crontab -e

# Přidat řádek (denně v 10:00)
0 10 * * * curl -H "Authorization: Bearer $CRON_SECRET" https://váš-web.cz/api/cron/send-reminders
```

**Možnost B: GitHub Actions**
```yaml
# .github/workflows/reminders.yml
name: Send Reminders

on:
  schedule:
    - cron: '0 10 * * *'  # Denně v 10:00 UTC

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Call reminder endpoint
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://váš-web.cz/api/cron/send-reminders
```

### 4. Comgate Produkční Credentials

1. Přihlásit se do Comgate admin panelu
2. Získat produkční Merchant ID a Secret
3. Aktualizovat `.env`:
   ```bash
   COMGATE_MERCHANT_ID="produkční_id"
   COMGATE_SECRET="produkční_secret"
   COMGATE_TEST_MODE="false"
   ```

### 5. Kontaktní Údaje

Aktualizovat v `.env`:
```bash
CONTACT_PHONE="+420 XXX XXX XXX"
CONTACT_EMAIL="info@váš-web.cz"
CONTACT_ADDRESS="Ulice 123, Město"
```

---

## Testování

### Unit Testy
```bash
npm run test
# Očekávaný výstup: 20 testů passed
```

### E2E Testy
```bash
# GUI mode
npm run cypress

# Headless mode
npm run cypress:run
```

### Manual Testing Checklist

- [ ] Homepage se načte správně
- [ ] Booking flow funguje (všechny 4 kroky)
- [ ] Google Calendar vytvoří event po rezervaci
- [ ] Comgate platba funguje (test mode)
- [ ] Email se odešle po vytvoření rezervace
- [ ] Email se odešle po úspěšné platbě
- [ ] Cancellation endpoint funguje
- [ ] Cron reminder endpoint funguje

---

## Produkční Checklist

### Povinné
- [ ] GOOGLE_REFRESH_TOKEN nastaven
- [ ] CRON_SECRET nastaven
- [ ] COMGATE produkční credentials
- [ ] NEXT_PUBLIC_APP_URL = produkční URL
- [ ] SSL certifikát aktivní

### Email
- [ ] SMTP/Postfix funguje
- [ ] SPF DNS záznam
- [ ] DKIM podpis (volitelné, ale doporučené)
- [ ] Test odeslání emailu

### Monitoring (volitelné)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Uptime monitoring

---

## Užitečné Příkazy

```bash
# Development
npm run dev

# Build & Start
npm run build && npm start

# Testy
npm run test
npm run cypress:run

# Lint
npm run lint

# Calendar test
npm run calendar:test
```

---

## Dokumentace

| Dokument | Popis |
|----------|-------|
| [Email Integration](./EMAIL_INTEGRATION.md) | Nodemailer konfigurace a šablony |
| [Google Calendar Setup](./google-calendar-setup.md) | OAuth2 a API integrace |
| [Comgate Integration](./COMGATE_INTEGRATION.md) | Platební brána |
| [Production Checklist](./PRODUCTION_CHECKLIST.md) | Deployment checklist |

---

**Last Updated:** 2026-02-02
