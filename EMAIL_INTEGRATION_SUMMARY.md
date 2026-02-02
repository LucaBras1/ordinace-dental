# Email Integration - Nodemailer/SMTP

Kompletni email integrace s Nodemailer pro booking system dentalni ordinace.
Pouziva lokalni Postfix SMTP na VPS serveru (dvi12.vas-server.cz).

---

## Vyhody oproti Resend

| Resend (puvodni) | Nodemailer + Postfix (aktualni) |
|------------------|--------------------------------|
| Externi zavislost | Lokalni reseni |
| API klic nutny | Zadne credentials pro localhost |
| Free tier limity (100/den) | Bez limitu |
| Latence (API call) | Rychlejsi (localhost:25) |

---

## Vytvorene soubory

### Core Implementation

| Soubor | Popis |
|--------|-------|
| `src/lib/email.ts` | **Hlavni email modul** - Nodemailer transporter, vsechny email funkce a HTML sablony |
| `src/app/api/webhooks/comgate/route.ts` | Odesila payment confirmation email po uspesne platbe |
| `.env.example` | SMTP konfigurace (`SMTP_HOST`, `SMTP_PORT`, `EMAIL_FROM`) |

### Test Endpoints

| Endpoint | Popis |
|----------|-------|
| `src/app/api/test/email/route.ts` | Hlavni test endpoint s prehledem |
| `src/app/api/test/email/booking-confirmation/route.ts` | Test booking confirmation emailu |
| `src/app/api/test/email/payment-confirmation/route.ts` | Test payment confirmation emailu |
| `src/app/api/test/email/reminder/route.ts` | Test reminder emailu |
| `src/app/api/test/email/cancellation/route.ts` | Test cancellation emailu |

---

## Implementovane funkce

### Email Utility (`src/lib/email.ts`)

```typescript
// 4 hlavni funkce pro odesilani emailu:

sendBookingConfirmation(booking, paymentUrl)
// -> Po vytvoreni rezervace - s platebnim linkem

sendPaymentConfirmation(booking)
// -> Po uspesne platbe - potvrzeni rezervace

sendReminder(booking)
// -> 24h pred terminem - pripominka

sendCancellation(booking, refundAmount?)
// -> Pri zruseni - s/bez vraceni kauce
```

### Nodemailer Transporter

```typescript
// Lazy-loaded transporter s podporou pro:
// - Lokalni Postfix (bez auth)
// - Externi SMTP (s auth)

function getTransporter(): Transporter {
  if (!_transporter) {
    const host = process.env.SMTP_HOST || 'localhost'
    const port = parseInt(process.env.SMTP_PORT || '25', 10)

    _transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      // Auth pouze pokud jsou credentials
      ...(process.env.SMTP_USER && process.env.SMTP_PASS && {
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }),
      tls: {
        rejectUnauthorized: false,
      },
    })
  }
  return _transporter
}
```

---

## Setup

### 1. Environment Variables

#### Pro VPS s lokalnim Postfixem (doporuceno)

```bash
# .env.local
SMTP_HOST="localhost"
SMTP_PORT="25"
EMAIL_FROM="Dentalni ordinace <rezervace@dvi12.vas-server.cz>"
```

#### Pro externi SMTP (Gmail, etc.)

```bash
# .env.local
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@gmail.com"
SMTP_PASS="app-password"
EMAIL_FROM="Dentalni ordinace <your@gmail.com>"
```

### 2. VPS Konfigurace (ověřeno)

```
Mail server: Postfix + Dovecot
Hostname: dvi12.vas-server.cz
TLS: Let's Encrypt certifikáty
mynetworks: 127.0.0.0/8 (localhost může odesílat)
```

### 3. Overeni Postfixu na VPS

```bash
# Zkontrolovat status
systemctl status postfix

# Test odeslani
echo "Test" | mail -s "Test subject" your@email.com

# Sledovat mail log
tail -f /var/log/mail.log
```

---

## Testovani

### Rychly test (v prohlizeci)

```
http://localhost:3000/api/test/email/booking-confirmation
http://localhost:3000/api/test/email/payment-confirmation
http://localhost:3000/api/test/email/reminder
http://localhost:3000/api/test/email/cancellation
```

### Pomoci curl

```bash
# Booking confirmation
curl http://localhost:3000/api/test/email/booking-confirmation

# Payment confirmation
curl http://localhost:3000/api/test/email/payment-confirmation

# Reminder
curl http://localhost:3000/api/test/email/reminder

# Cancellation
curl http://localhost:3000/api/test/email/cancellation
```

---

## Email Sablony

Vsechny sablony jsou **responzivni HTML** s inline CSS:

| Typ | Popis | Barva headeru |
|-----|-------|---------------|
| Booking Confirmation | Po vytvoreni rezervace s platebnim tlacitkem | Modra (#0070f3) |
| Payment Confirmation | Po uspesne platbe s detaily navstevy | Zelena (#28a745) |
| Reminder | Pripominka 24h pred terminem | Zluta (#ffc107) |
| Cancellation | Pri zruseni s info o kauci | Cervena (#dc3545) |

---

## Email Flow Diagram

```
1. User vytvori rezervaci
   |
   v
POST /api/bookings -> Google Calendar event (oranzovy)
   |
   +-> sendBookingConfirmation()
   |     - Detail rezervace
   |     - Vyse kauce
   |     - Tlacitko "Zaplatit"
   |
   v
2. User zaplati kauci (Comgate)
   |
   v
Webhook /comgate -> Update event (zeleny = PAID)
   |
   +-> sendPaymentConfirmation()
   |     - Potvrzeni kauce
   |     - Detail navstevy
   |     - Co prinest
   |
   v
3. 24h pred terminem (Cron job)
   |
   +-> sendReminder()
   |     - Pripominka zitra
   |     - Co prinest
   |
   v
4. Navsteva probehla / Zruseni
   |
   +-> sendCancellation() (pri zruseni)
         - Info o zruseni
         - Vraceni kauce
```

---

## Troubleshooting

### Email se neodesila

1. Zkontrolovat SMTP_HOST a SMTP_PORT v .env
2. Na VPS: `systemctl status postfix`
3. Kontrola logu: `tail -f /var/log/mail.log`

### Email konci ve spamu

1. Zkontrolovat SPF zaznam pro domenu
2. Zkontrolovat DKIM podpis
3. Zkontrolovat DMARC politiku

### Doporucene DNS zaznamy pro domenu

```dns
# SPF
TXT @ "v=spf1 a mx ip4:YOUR_VPS_IP ~all"

# DKIM (pokud Postfix podporuje)
TXT dkim._domainkey "v=DKIM1; k=rsa; p=..."

# DMARC
TXT _dmarc "v=DMARC1; p=none; rua=mailto:postmaster@vase-domena.cz"
```

---

## Bezpecnost

### Error Handling

Vsechny email funkce jsou **non-blocking**:

```typescript
try {
  const result = await sendPaymentConfirmation(booking)
  if (!result.success) {
    console.error('Email failed:', result.error)
    // Aplikace pokracuje normalne
  }
} catch (error) {
  console.error('Unexpected error:', error)
  // Neblokuje platbu ani kalendar
}
```

### Production Checklist

- [x] Nodemailer integrace
- [x] 4 typy emailu (booking, payment, reminder, cancellation)
- [x] Responzivni HTML sablony
- [x] Automaticke odesilani po platbe (webhook)
- [x] Test endpointy
- [ ] Nastavit SPF/DKIM/DMARC pro domenu (deliverability)
- [ ] Implementovat cron job pro reminders
- [ ] Chranit/odstranit test endpointy v produkci

---

## Odkazy

- [Nodemailer Documentation](https://nodemailer.com/)
- [Postfix Documentation](http://www.postfix.org/documentation.html)
- [Email Design Best Practices](https://www.campaignmonitor.com/resources/guides/email-design/)

---

**Aktualizovano:** 2026-02-02
**Migrace:** Resend -> Nodemailer (lokalni SMTP)
