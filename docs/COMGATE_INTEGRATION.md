# Comgate Payment Integration

Kompletní integrace Comgate platební brány pro rezervační systém dentální ordinace.

## Přehled

Tato integrace umožňuje:
- Vytvoření platby (kauce) pro rezervaci
- Webhook callback pro automatické potvrzení platby
- Ověření stavu platby
- Vrácení platby (refund)

## Soubory

```
src/
├── lib/
│   └── comgate.ts                          # Hlavní Comgate utility funkce
├── app/
│   └── api/
│       ├── payments/
│       │   └── create/
│       │       └── route.ts                # API endpoint pro vytvoření platby
│       └── webhooks/
│           └── comgate/
│               └── route.ts                # Webhook handler pro Comgate callback
```

## Konfigurace

### Environment Variables

V `.env` nebo `.env.local`:

```bash
# Comgate Merchant ID (získáš od Comgate)
COMGATE_MERCHANT_ID="your_merchant_id"

# Comgate Secret Key (získáš od Comgate)
COMGATE_SECRET="your_secret_key"

# Test Mode (true pro testovací platby, false pro produkci)
COMGATE_TEST_MODE="true"

# Base URL aplikace (pro callback a redirect)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Comgate Account Setup

1. Zaregistruj se na [Comgate](https://www.comgate.cz/)
2. Získej Merchant ID a Secret z administrace
3. Nastav **Callback URL** v Comgate admin:
   ```
   https://your-domain.com/api/webhooks/comgate
   ```
4. Povolit IP whitelist (volitelné):
   - `185.33.241.0/24`
   - `185.33.242.0/24`

## Použití

### 1. Vytvoření platby (Frontend)

```typescript
// V komponentě po vytvoření rezervace
async function handlePayment(bookingId: string) {
  try {
    const response = await fetch('/api/payments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId }),
    })

    const data = await response.json()

    if (data.success) {
      // Přesměruj uživatele na Comgate platební bránu
      window.location.href = data.paymentUrl
    } else {
      console.error('Chyba vytvoření platby:', data.error)
    }
  } catch (error) {
    console.error('Chyba:', error)
  }
}
```

### 2. Backend API - Vytvoření platby

**Endpoint:** `POST /api/payments/create`

**Request:**
```json
{
  "bookingId": "clxyz123abc"
}
```

**Response (Success):**
```json
{
  "success": true,
  "paymentUrl": "https://payments.comgate.cz/client/instructions/index?id=...",
  "transId": "ABC-123-456"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Booking not found"
}
```

### 3. Webhook Handler

Comgate automaticky volá webhook po dokončení platby:

**Endpoint:** `POST /api/webhooks/comgate`

**Comgate pošle:**
```
transId=ABC-123-456&refId=clxyz123abc&status=PAID&price=50000&curr=CZK&email=customer@example.com
```

**Handler automaticky:**
1. Ověří platbu přímo u Comgate (double-check)
2. Najde booking podle `refId`
3. Aktualizuje status na `PAID`
4. (TODO) Vytvoří Google Calendar event
5. (TODO) Pošle potvrzovací email

### 4. Přímé použití Comgate funkcí

```typescript
import { createPayment, verifyPayment, refundPayment } from '@/lib/comgate'

// Vytvoření platby
const result = await createPayment({
  bookingId: 'booking_123',
  price: 50000, // 500 Kč v haléřích
  label: 'Kauce - Dentální hygiena',
  email: 'customer@example.com',
  customerName: 'Jan Novák',
  customerPhone: '+420123456789',
})

if (result.success) {
  console.log('Redirect URL:', result.redirectUrl)
  console.log('Transaction ID:', result.transId)
}

// Ověření platby
const status = await verifyPayment('ABC-123-456')
if (status.success && status.status === 'PAID') {
  console.log('Platba úspěšná')
}

// Refund
const refund = await refundPayment({
  transId: 'ABC-123-456',
  amount: 50000, // 500 Kč v haléřích
})
```

## Stavy platby

| Comgate Status | Booking Status | Popis |
|---------------|----------------|-------|
| `PAID` | `PAID` | Platba úspěšná, kauce zaplacena |
| `PENDING` | `PENDING_PAYMENT` | Platba čeká na dokončení |
| `CANCELLED` | `CANCELLED` | Platba zrušena |
| `TIMEOUT` | `CANCELLED` | Platba vypršela (timeout) |

## Bezpečnost

### 1. IP Whitelisting (Doporučeno)

V `src/app/api/webhooks/comgate/route.ts` odkomentuj:

```typescript
if (!isComgateIP(clientIP)) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
}
```

### 2. Signature Verification

Pokud Comgate odesílá signature (závisí na konfiguraci):

```typescript
// V src/lib/comgate.ts implementuj:
export function verifyComgateSignature(
  params: Record<string, string>,
  signature: string
): boolean {
  const config = getComgateConfig()
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')

  const hash = crypto
    .createHmac('sha256', config.secret)
    .update(sortedParams)
    .digest('hex')

  return hash === signature
}
```

### 3. HTTPS Only

V produkci **MUSÍ** být webhook endpoint na HTTPS.

### 4. Secrets Management

**NIKDY** necommituj `.env` do Git. Používej:
- `.env.local` pro development
- Environment variables na serveru (Vercel, VPS)
- Secrets manager (AWS Secrets Manager, etc.)

## Testing

### Test Mode

Pro testování nastav:
```bash
COMGATE_TEST_MODE="true"
```

### Testovací platební údaje

Comgate poskytuje testovací karty (viz Comgate dokumentace).

### Manual Webhook Testing

```bash
curl -X POST http://localhost:3000/api/webhooks/comgate \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "transId=TEST-123&refId=booking_id&status=PAID&price=50000&curr=CZK&email=test@example.com"
```

## Flow Diagram

```
1. Uživatel vytvoří rezervaci
   ↓
2. Frontend volá POST /api/payments/create
   ↓
3. Backend vytvoří Comgate platbu
   ↓
4. Uživatel je přesměrován na Comgate
   ↓
5. Uživatel zaplatí
   ↓
6. Comgate pošle callback na /api/webhooks/comgate
   ↓
7. Webhook ověří platbu a aktualizuje booking status
   ↓
8. (TODO) Vytvoří Google Calendar event
   ↓
9. (TODO) Pošle confirmation email
   ↓
10. Uživatel je přesměrován zpět na potvrzení
```

## Error Handling

Všechny funkce vracejí standardizovaný formát:

```typescript
// Success
{ success: true, ...data }

// Error
{ success: false, error: string }
```

Logy:
- Console logs pro debugging
- Prefix `[Comgate]` pro snadné filtrování
- Error details vždy logované

## TODO

- [ ] Implementovat Google Calendar integraci po úspěšné platbě
- [ ] Implementovat email notifikace
- [ ] Implementovat signature verification (pokud Comgate poskytuje)
- [ ] Přidat retry mechanismus pro webhook failures
- [ ] Implementovat webhook event log (auditní trail)
- [ ] Přidat admin panel pro monitoring plateb
- [ ] Unit testy pro Comgate funkce
- [ ] E2E testy pro payment flow

## Dokumentace Comgate

- [API Dokumentace](https://help.comgate.cz/docs/cs/api)
- [Callback URL Setup](https://help.comgate.cz/docs/cs/api#callback)
- [Status Codes](https://help.comgate.cz/docs/cs/api#status-codes)

## Support

Pro problémy s Comgate integrací:
1. Zkontroluj logy v console (`[Comgate]` prefix)
2. Ověř environment variables
3. Testuj webhook s curl
4. Kontaktuj Comgate support: [podpora@comgate.cz](mailto:podpora@comgate.cz)
