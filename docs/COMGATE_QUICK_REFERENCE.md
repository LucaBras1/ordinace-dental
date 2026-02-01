# Comgate Quick Reference

Rychlá referenční příručka pro Comgate integraci.

## API Endpoints

### POST /api/payments/create
Vytvoří Comgate platbu pro existující booking.

**Request:**
```json
{
  "bookingId": "clxyz123abc"
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://payments.comgate.cz/client/...",
  "transId": "ABC-123-456"
}
```

### POST /api/webhooks/comgate
Přijímá callback od Comgate po dokončení platby.

**Comgate pošle:**
```
transId=ABC-123-456
refId=booking_id
status=PAID
price=50000
curr=CZK
email=customer@example.com
```

## Comgate Functions

### createPayment()
```typescript
import { createPayment } from '@/lib/comgate'

const result = await createPayment({
  bookingId: 'booking_123',
  price: 50000, // haléře
  label: 'Kauce - Dentální hygiena',
  email: 'customer@example.com',
  customerName: 'Jan Novák', // optional
  customerPhone: '+420123456789', // optional
})

// result: { success: true, redirectUrl: string, transId: string }
//      OR { success: false, error: string }
```

### verifyPayment()
```typescript
import { verifyPayment } from '@/lib/comgate'

const status = await verifyPayment('ABC-123-456')

// status: { success: true, status: 'PAID', refId: string, price: string, data: {...} }
//      OR { success: false, error: string }
```

### refundPayment()
```typescript
import { refundPayment } from '@/lib/comgate'

const result = await refundPayment({
  transId: 'ABC-123-456',
  amount: 50000, // haléře
  curr: 'CZK', // optional
})

// result: { success: true, message: string }
//      OR { success: false, error: string }
```

## Payment Statuses

| Comgate Status | Booking Status | Popis |
|----------------|----------------|-------|
| `PAID` | `PAID` | Platba úspěšná |
| `PENDING` | `PENDING_PAYMENT` | Čeká na platbu |
| `CANCELLED` | `CANCELLED` | Platba zrušena |
| `TIMEOUT` | `CANCELLED` | Platba vypršela |

## Environment Variables

```bash
COMGATE_MERCHANT_ID="your_merchant_id"
COMGATE_SECRET="your_secret_key"
COMGATE_TEST_MODE="true"  # false v produkci
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Testing Commands

### Manual Payment Creation
```bash
curl -X POST http://localhost:3000/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{"bookingId":"test_booking_123"}'
```

### Manual Webhook Trigger
```bash
curl -X POST http://localhost:3000/api/webhooks/comgate \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "transId=TEST-123&refId=booking_id&status=PAID&price=50000&curr=CZK&email=test@example.com"
```

### Test Script
```bash
npx tsx scripts/test-comgate.ts
```

## Common Code Snippets

### Frontend: Redirect na platbu
```typescript
async function initiatePayment(bookingId: string) {
  const response = await fetch('/api/payments/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId })
  })

  const data = await response.json()

  if (data.success) {
    window.location.href = data.paymentUrl
  }
}
```

### Backend: Update booking po platbě
```typescript
await prisma.booking.update({
  where: { id: bookingId },
  data: {
    status: 'PAID',
    paymentId: transId,
  }
})
```

### Check payment status
```typescript
const status = await verifyPayment(transId)
if (status.success && status.status === 'PAID') {
  // Platba je úspěšná
}
```

## Error Handling

Všechny funkce vracejí standardizovaný formát:

```typescript
type Result<T> =
  | { success: true } & T
  | { success: false; error: string }

// Použití:
const result = await createPayment(params)

if (result.success) {
  // TypeScript ví že result má redirectUrl a transId
  console.log(result.redirectUrl)
} else {
  // TypeScript ví že result má error
  console.error(result.error)
}
```

## Logging

Všechny logy mají prefix `[Comgate]`:

```
[Comgate] Creating payment: { bookingId: '...', ... }
[Comgate] Create response: code=0&message=OK&transId=...
[Comgate] Payment created successfully: { transId: '...', redirectUrl: '...' }
[Comgate Webhook] Incoming request: transId=...
[Comgate Webhook] Payment successful - updating booking to PAID
```

Filtrování logů:
```bash
# V development
npm run dev | grep "\[Comgate\]"

# V production (pokud logy jdou do souboru)
tail -f app.log | grep "\[Comgate\]"
```

## Comgate Test Mode

V test módu (`COMGATE_TEST_MODE=true`):
- Platby nejsou skutečné
- Používej testovací platební údaje z Comgate dokumentace
- Testovací platby se objevují v Comgate admin panelu v sekci "Test platby"

## Security Best Practices

1. **IP Whitelisting** (doporučeno):
```typescript
// V webhook/route.ts
if (!isComgateIP(clientIP)) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
}
```

2. **Signature Verification** (pokud Comgate poskytuje):
```typescript
if (!verifyComgateSignature(data, signature)) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
}
```

3. **Double-check platby**:
```typescript
// Webhook vždy ověří platbu přímo u Comgate
const verification = await verifyPayment(transId)
if (verification.status !== callbackStatus) {
  console.warn('Status mismatch!')
}
```

## Troubleshooting

### Webhook není volán
```bash
# Zkontroluj callback URL v Comgate admin
# Pro development použij ngrok:
ngrok http 3000
# Nastav callback URL: https://your-subdomain.ngrok.io/api/webhooks/comgate
```

### Platba vytvoření selhává
```bash
# Zkontroluj environment variables
node -e "console.log(process.env.COMGATE_MERCHANT_ID)"

# Zkontroluj logy
npm run dev | grep "\[Comgate\]"
```

### Booking status se neaktualizuje
```bash
# Zkontroluj webhook logy
# Ověř že paymentId odpovídá transId
npx prisma studio
# SELECT * FROM bookings WHERE paymentId = 'ABC-123-456'
```

## Files Reference

| File | Description |
|------|-------------|
| `src/lib/comgate.ts` | Core Comgate functions |
| `src/app/api/payments/create/route.ts` | Payment creation endpoint |
| `src/app/api/webhooks/comgate/route.ts` | Webhook handler |
| `docs/COMGATE_INTEGRATION.md` | Full integration docs |
| `docs/PAYMENT_FLOW_EXAMPLE.tsx` | Frontend examples |
| `docs/SETUP_CHECKLIST.md` | Setup guide |
| `scripts/test-comgate.ts` | Test script |

## Support Links

- **Comgate API Docs:** https://help.comgate.cz/docs/cs/api
- **Comgate Support:** podpora@comgate.cz
- **Status Codes:** https://help.comgate.cz/docs/cs/api#status-codes

---

💡 **Tip:** Bookmarkuj tento soubor pro rychlý přístup k běžným úkolům!
