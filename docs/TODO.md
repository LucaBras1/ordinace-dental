# TODO - Project Status

## ✅ Dokončeno

### Email Integration
- ✅ Vytvořen `src/lib/email.ts` s Nodemailer integrací
- ✅ Implementovány všechny email šablony:
  - Booking confirmation (s platebním linkem)
  - Payment confirmation
  - Reminder (24h před termínem)
  - Cancellation (s/bez refundu)
- ✅ Aktualizován webhook handler pro odesílání payment confirmation
- ✅ Vytvořena dokumentace `docs/EMAIL_INTEGRATION.md`

### Google Calendar Integration
- ✅ Google Calendar jako single source of truth
- ✅ OAuth2 autentizace s refresh tokenem
- ✅ Vytváření/mazání/aktualizace eventů
- ✅ Availability checking (volné sloty)
- ✅ Barvy eventů podle statusu (PAID=zelená, PENDING=oranžová, CANCELLED=červená)

### Booking System
- ✅ 4-step booking wizard (služba → termín → kontakt → platba)
- ✅ Validace formulářů (Zod)
- ✅ Comgate platební integrace
- ✅ Email notifikace při vytvoření/platbě/zrušení

### API Endpoints
- ✅ `/api/services` - Seznam služeb
- ✅ `/api/availability` - Dostupné sloty z kalendáře
- ✅ `/api/bookings` - Vytvoření rezervace
- ✅ `/api/bookings/[id]` - GET/PATCH rezervace
- ✅ `/api/bookings/[id]/cancel` - Zrušení rezervace
- ✅ `/api/cron/send-reminders` - Cron job pro připomínky
- ✅ `/api/payments/create` - Vytvoření Comgate platby
- ✅ `/api/webhooks/comgate` - Webhook pro platby

### Testing
- ✅ Vitest setup s mocky (matchMedia, IntersectionObserver, ResizeObserver)
- ✅ BookingForm unit testy (20 testů)
- ✅ Cypress E2E konfigurace
- ✅ Cypress support files a custom commands
- ✅ Booking flow E2E testy

### Security
- ✅ Production guard na test endpointech (`/api/test/*`)
- ✅ CRON_SECRET autentizace pro cron endpointy

## 🔨 Zbývá dokončit

### Google Calendar OAuth
- [ ] Získat refresh token pro produkci (zubykorunni@gmail.com)
- [ ] Nastavit GOOGLE_REFRESH_TOKEN v produkčním .env

### Cron Job Setup
- [ ] Nastavit CRON_SECRET v produkci
- [ ] Nakonfigurovat denní cron (GitHub Actions nebo server cron)
  ```bash
  # Příklad: denně v 10:00
  0 10 * * * curl -H "Authorization: Bearer $CRON_SECRET" https://example.com/api/cron/send-reminders
  ```

### Comgate
- [ ] Nastavit produkční credentials (COMGATE_MERCHANT_ID, COMGATE_SECRET)
- [ ] Implementovat automatický refund (volitelné)

### Produkční Checklist
- [ ] SSL certifikát
- [ ] Postfix SMTP funguje
- [ ] DNS záznamy (SPF, DKIM)
- [ ] Kontaktní údaje v email šablonách
- [ ] Google Analytics (volitelné)
- [ ] Monitoring/error tracking (volitelné)

## 📋 Environment Variables Checklist

```bash
# Google Calendar (POVINNÉ)
GOOGLE_CLIENT_ID="✅ nastaveno"
GOOGLE_CLIENT_SECRET="✅ nastaveno"
GOOGLE_CALENDAR_ID="✅ nastaveno"
GOOGLE_REFRESH_TOKEN="❌ CHYBÍ - získat přes /api/calendar/setup"

# Comgate
COMGATE_MERCHANT_ID="❌ nastavit produkční"
COMGATE_SECRET="❌ nastavit produkční"
COMGATE_TEST_MODE="true → false v produkci"

# Email
SMTP_HOST="localhost"
SMTP_PORT="25"
EMAIL_FROM="✅ nastaveno"

# App
NEXT_PUBLIC_APP_URL="❌ změnit na produkční URL"

# Cron
CRON_SECRET="❌ vygenerovat: openssl rand -hex 32"
```

## 📚 Dokumentace

- [Email Integration](./EMAIL_INTEGRATION.md)
- [Google Calendar Setup](./google-calendar-setup.md)
- [Comgate Integration](./COMGATE_INTEGRATION.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)

---

**Last Updated:** 2026-02-02
