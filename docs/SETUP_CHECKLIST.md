# Comgate Setup Checklist

Tento checklist ti pomůže nastavit Comgate platební integraci krok za krokem.

## Prerequisites

- [ ] PostgreSQL databáze běží a je dostupná
- [ ] `.env` soubor existuje (zkopíruj z `.env.example`)
- [ ] Node.js a npm jsou nainstalované

## 1. Database Setup

```bash
# Vygeneruj Prisma Client
npx prisma generate

# Vytvoř databázové tabulky
npx prisma migrate dev --name init

# (Volitelné) Seed databázi se službami
npx prisma db seed
```

**Ověř:** Otevři Prisma Studio a zkontroluj tabulky
```bash
npx prisma studio
```

## 2. Comgate Account Setup

- [ ] Zaregistruj se na [Comgate](https://www.comgate.cz/)
- [ ] Vytvoř merchant účet (test nebo production)
- [ ] Získej **Merchant ID** z administrace
- [ ] Získej **Secret Key** z administrace
- [ ] Nastav **Callback URL** v Comgate admin panel:
  ```
  https://your-domain.com/api/webhooks/comgate
  ```
  Pro development můžeš použít ngrok:
  ```
  https://your-ngrok-url.ngrok.io/api/webhooks/comgate
  ```

## 3. Environment Variables

Vyplň následující v `.env`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ordinace_dental?schema=public"

# Comgate
COMGATE_MERCHANT_ID="your_merchant_id_here"
COMGATE_SECRET="your_secret_key_here"
COMGATE_TEST_MODE="true"  # false v produkci

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Tvoje doména v produkci
```

**Ověř:** Environment variables jsou načtené
```bash
# V Node.js konzoli
node -e "console.log(process.env.COMGATE_MERCHANT_ID)"
```

## 4. Test Integration (Development)

### 4.1 Spusť development server

```bash
npm run dev
```

Server by měl běžet na `http://localhost:3000`

### 4.2 Test API Endpoints

**Test 1: Payment Creation Endpoint**
```bash
# GET (dokumentace)
curl http://localhost:3000/api/payments/create

# POST (vytvoření platby)
curl -X POST http://localhost:3000/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{"bookingId":"test_booking_123"}'
```

**Test 2: Webhook Endpoint**
```bash
# GET (dokumentace)
curl http://localhost:3000/api/webhooks/comgate

# POST (simulace callback)
curl -X POST http://localhost:3000/api/webhooks/comgate \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "transId=TEST-123&refId=booking_id&status=PAID&price=50000&curr=CZK&email=test@example.com"
```

### 4.3 Test Comgate Functions (Optional)

Pokud máš nainstalované `tsx`:

```bash
# Instalace tsx (pokud nemáš)
npm install -D tsx

# Spuštění test scriptu
npx tsx scripts/test-comgate.ts
```

## 5. Integration Testing (End-to-End)

### 5.1 Vytvoř test booking

1. Otevři Prisma Studio: `npx prisma studio`
2. Vytvoř novou službu (Service) pokud neexistuje
3. Vytvoř test booking s:
   - `status: PENDING_PAYMENT`
   - `depositAmount: 50000` (500 Kč)
   - `customerEmail: your-email@example.com`

### 5.2 Test payment flow

```typescript
// V browser konzoli nebo API client (Postman, Insomnia)
const response = await fetch('http://localhost:3000/api/payments/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bookingId: 'your-booking-id' })
})

const data = await response.json()
console.log(data)
// { success: true, paymentUrl: "...", transId: "..." }

// Otevři paymentUrl v prohlížeči
window.location.href = data.paymentUrl
```

### 5.3 Complete test payment

1. Otevři `paymentUrl` z předchozího kroku
2. Použij testovací platební údaje (viz Comgate dokumentace)
3. Dokonči platbu
4. Comgate by měl zavolat webhook na `/api/webhooks/comgate`
5. Zkontroluj logy serveru - měl by se objevit `[Comgate Webhook]` log
6. Zkontroluj booking v databázi - status by měl být `PAID`

## 6. Frontend Integration

### 6.1 Implementuj booking formulář

Viz `docs/PAYMENT_FLOW_EXAMPLE.tsx` pro kompletní příklad.

Základní flow:
```typescript
// 1. Vytvoř booking
const bookingResponse = await fetch('/api/bookings', {
  method: 'POST',
  body: JSON.stringify(formData)
})
const { booking } = await bookingResponse.json()

// 2. Vytvoř platbu
const paymentResponse = await fetch('/api/payments/create', {
  method: 'POST',
  body: JSON.stringify({ bookingId: booking.id })
})
const { paymentUrl } = await paymentResponse.json()

// 3. Redirect na Comgate
window.location.href = paymentUrl
```

### 6.2 Implementuj potvrzovací stránku

Vytvoř `/objednavka/potvrzeni/page.tsx`:
- Načti booking detail z URL parametru `bookingId`
- Zobraz status platby (PAID / PENDING_PAYMENT)
- Zobraz detail rezervace

## 7. Security Checklist

- [ ] HTTPS enabled v produkci
- [ ] IP whitelisting aktivován v `webhook/route.ts`
- [ ] Signature verification implementována (pokud Comgate poskytuje)
- [ ] `.env` je v `.gitignore`
- [ ] Secrets jsou v environment variables (ne hardcoded)
- [ ] CORS správně nakonfigurován
- [ ] Rate limiting na API endpoints (DoS protection)

## 8. Production Deployment

### 8.1 Update environment variables

```bash
# Na serveru (Vercel, VPS, etc.)
COMGATE_TEST_MODE="false"  # ❗ DŮLEŽITÉ
NEXT_PUBLIC_APP_URL="https://your-production-domain.com"
```

### 8.2 Update Comgate callback URL

V Comgate admin panelu změň callback URL na:
```
https://your-production-domain.com/api/webhooks/comgate
```

### 8.3 Test v produkci

1. Vytvoř test booking na produkčním prostředí
2. Zaplatit malou částku (testovací platba)
3. Ověř že webhook funguje
4. Ověř že booking status je aktualizován
5. Ověř že confirmation email je odeslán (TODO)

## 9. Monitoring & Logging

### 9.1 Setup logging

- [ ] Application logs (console.log → file/service)
- [ ] Error tracking (Sentry, LogRocket, etc.)
- [ ] Payment event logging v databázi

### 9.2 Setup alerts

- [ ] Alert na failed payments
- [ ] Alert na webhook errors
- [ ] Alert na vysoký počet CANCELLED bookings

## 10. Optional Enhancements

- [ ] Google Calendar integrace po úspěšné platbě
- [ ] Email notifikace (confirmation, reminder)
- [ ] SMS notifikace (Twilio)
- [ ] Admin panel pro správu bookings
- [ ] Refund functionality
- [ ] Payment status polling (pro případy kdy webhook selže)
- [ ] Webhook retry mechanism
- [ ] Payment audit log

## Troubleshooting

### Webhook není volán

**Možné příčiny:**
1. Callback URL není správně nastavena v Comgate admin
2. Server není dostupný z internetu (firewall, ngrok vypnutý)
3. HTTPS certifikát je neplatný

**Řešení:**
- Zkontroluj Comgate admin panel
- Testuj webhook ručně s curl
- Použij ngrok pro development
- Zkontroluj server logy

### Platba je vytvořena, ale redirect nefunguje

**Možné příčiny:**
1. Neplatný `NEXT_PUBLIC_APP_URL`
2. CORS issue

**Řešení:**
- Zkontroluj response z `/api/payments/create`
- Ověř že `redirectUrl` je platná

### Booking status se neaktualizuje

**Možné příčiny:**
1. Webhook není volán
2. Database connection error
3. Transaction ID mismatch

**Řešení:**
- Zkontroluj logy webhooku
- Ověř `paymentId` v databázi odpovídá Comgate `transId`

## Support

- **Comgate Dokumentace:** https://help.comgate.cz/docs/cs/api
- **Comgate Support:** podpora@comgate.cz
- **Projekt dokumentace:** `docs/COMGATE_INTEGRATION.md`

---

✅ Po dokončení všech kroků je integrace připravena pro produkci!
