# Quick Start Guide - BookingForm

Rychlý návod k použití booking formuláře s Google Calendar a Comgate platební bránou.

---

## Architektura

Projekt používá:
- **Google Calendar** - Správa termínů a dostupnosti
- **Comgate** - Platební brána pro zálohy
- **Nodemailer** - E-mailové notifikace

---

## Rychlý start

### 1. Zkontrolovat závislosti

```bash
npm list framer-motion googleapis nodemailer
```

### 2. Nastavit environment variables

Vytvořte `.env.local` s těmito proměnnými:

```env
# Google Calendar
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_CALENDAR_ID="your-calendar-id@group.calendar.google.com"

# Comgate
COMGATE_MERCHANT_ID="your_merchant_id"
COMGATE_SECRET="your_secret"
COMGATE_TEST_MODE="true"

# Email (Nodemailer)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-password"
EMAIL_FROM="ordinace@example.com"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Spustit aplikaci

```bash
npm run dev
```

Otevřete `http://localhost:3000/objednavka`

---

## Detailní setup

Pro kompletní návod k nastavení Google Calendar viz:
- **[CALENDAR_SETUP_COMPLETE.md](./CALENDAR_SETUP_COMPLETE.md)** - Krok za krokem setup guide
- **[CALENDAR_INTEGRATION.md](./CALENDAR_INTEGRATION.md)** - Technická dokumentace API

---

## Testování

### Booking Flow

1. **Krok 1:** Vyberte službu
2. **Krok 2:** Vyberte datum a čas (načítá se z Google Calendar)
3. **Krok 3:** Vyplňte kontaktní údaje
4. **Krok 4:** Potvrďte a zaplaťte zálohu

### Test platby (Comgate sandbox)

V testovacím režimu (`COMGATE_TEST_MODE=true`) můžete používat testovací karty.

---

## Troubleshooting

### Google Calendar nefunguje

1. Zkontrolujte že service account má přístup ke kalendáři
2. Ověřte formát private key (musí obsahovat `\n` pro nové řádky)
3. Viz `CALENDAR_SETUP_COMPLETE.md` pro debugging

### E-maily se neodesílají

1. Zkontrolujte SMTP credentials
2. Pro Gmail použijte App Password (ne běžné heslo)

---

## Dokumentace

| Dokument | Obsah |
|----------|-------|
| [README_BOOKING.md](./README_BOOKING.md) | Přehled dokumentace |
| [BOOKING_FORM_DOCS.md](./BOOKING_FORM_DOCS.md) | Technická dokumentace formuláře |
| [CALENDAR_INTEGRATION.md](./CALENDAR_INTEGRATION.md) | Google Calendar API |
| [CALENDAR_SETUP_COMPLETE.md](./CALENDAR_SETUP_COMPLETE.md) | Setup guide |
| [src/lib/README-calendar.md](./src/lib/README-calendar.md) | API reference |

---

## Checklist

### Development
- [x] BookingForm implementován
- [x] Google Calendar integrace
- [x] Comgate platební brána
- [x] E-mailové notifikace
- [ ] Nastavit environment variables
- [ ] Otestovat booking flow

### Production
- [ ] Nastavit production credentials
- [ ] Vypnout test mode (`COMGATE_TEST_MODE=false`)
- [ ] Ověřit e-mailovou deliverability
- [ ] Deploy
