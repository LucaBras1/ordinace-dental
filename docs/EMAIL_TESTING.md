# Email Testing Guide

Návod pro testování email integrace během vývoje.

## Setup

### 1. Nastavení test emailu

Přidejte do `.env.local`:

```bash
TEST_EMAIL="your-email@example.com"
```

Všechny test emaily budou odesílány na tuto adresu.

### 2. Resend API klíč

V development módu použijte Resend test klíč:

```bash
RESEND_API_KEY="re_test_xxxxxxxxxx"
EMAIL_FROM="onboarding@resend.dev"
```

## Test Endpoints

### Quick Tests (GET requests)

Jednoduchý způsob testování - stačí otevřít URL v prohlížeči:

#### 1. Booking Confirmation
```
GET http://localhost:3000/api/test/email/booking-confirmation
```

Odešle email s potvrzením rezervace a platebním linkem.

#### 2. Payment Confirmation
```
GET http://localhost:3000/api/test/email/payment-confirmation
```

Odešle email s potvrzením platby.

#### 3. Reminder
```
GET http://localhost:3000/api/test/email/reminder
```

Odešle připomínku návštěvy (termín nastaven na zítřek).

#### 4. Cancellation (s refundem)
```
GET http://localhost:3000/api/test/email/cancellation
```

Odešle email o zrušení s vrácením kauce.

### Advanced Tests (POST requests)

Pro testování s vlastními daty použijte POST:

#### Custom Email Test

```bash
curl -X POST http://localhost:3000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment-confirmation",
    "email": "custom@example.com",
    "customerName": "Custom User",
    "appointmentDate": "2024-03-01",
    "appointmentTime": "10:30"
  }'
```

**Supported types:**
- `booking-confirmation`
- `payment-confirmation`
- `reminder`
- `cancellation`
- `cancellation-no-refund`

#### Cancellation bez refundu

```bash
curl -X POST http://localhost:3000/api/test/email/cancellation \
  -H "Content-Type: application/json" \
  -d '{ "refund": 0 }'
```

## Workflow

### Rychlý test všech emailů

```bash
# 1. Booking confirmation
curl http://localhost:3000/api/test/email/booking-confirmation

# 2. Payment confirmation
curl http://localhost:3000/api/test/email/payment-confirmation

# 3. Reminder
curl http://localhost:3000/api/test/email/reminder

# 4. Cancellation with refund
curl http://localhost:3000/api/test/email/cancellation

# 5. Cancellation without refund
curl -X POST http://localhost:3000/api/test/email/cancellation \
  -H "Content-Type: application/json" \
  -d '{ "refund": 0 }'
```

### Testing v prohlížeči

1. Spusťte dev server:
   ```bash
   npm run dev
   ```

2. Otevřete v prohlížeči:
   ```
   http://localhost:3000/api/test/email
   ```

3. Klikněte na jednotlivé test endpointy nebo je zkopírujte do nové záložky.

## Kontrola odeslaných emailů

### Resend Dashboard

1. Přihlaste se na [resend.com](https://resend.com)
2. Přejděte na [Emails](https://resend.com/emails)
3. Zkontrolujte:
   - Status (sent, delivered, bounced, failed)
   - Preview emailu
   - Delivery logs
   - Error messages (pokud selhalo)

### Response z API

Každý test endpoint vrací JSON response:

```json
{
  "emailType": "payment-confirmation",
  "success": true
}
```

Nebo při chybě:

```json
{
  "emailType": "payment-confirmation",
  "success": false,
  "error": "RESEND_API_KEY environment variable is not set"
}
```

## Troubleshooting

### Email se neodesílá

1. **Zkontrolujte API klíč:**
   ```bash
   echo $RESEND_API_KEY
   ```

2. **Zkontrolujte logs:**
   ```bash
   npm run dev
   ```
   Sledujte terminal output - měli byste vidět:
   ```
   [Email] Sending "Platba přijata - potvrzení rezervace" to test@example.com
   [Email] Successfully sent email: abc123
   ```

3. **Zkontrolujte Resend dashboard:**
   - Přejděte na [Emails](https://resend.com/emails)
   - Zkontrolujte status posledního emailu

### Email končí ve spamu

V development módu (s `onboarding@resend.dev`) je normální, že emaily mohou končit ve spamu.

Pro production:
1. Nakonfigurujte vlastní doménu na Resend
2. Přidejte SPF, DKIM, DMARC DNS záznamy
3. Ověřte doménu

## Email Template Preview

Pro náhled HTML šablony bez odesílání:

1. Otevřete `src/lib/email.ts`
2. Najděte funkci šablony (např. `paymentConfirmationTemplate`)
3. Zkopírujte HTML výstup
4. Vytvořte `.html` soubor a otevřete v prohlížeči

Nebo použijte nástroj jako [Mailtrap](https://mailtrap.io/) pro testování emailů bez skutečného odesílání.

## Production Testing

Před nasazením do produkce:

### 1. Test s reálnou doménou

```bash
# .env
RESEND_API_KEY="re_prod_key_xxx"
EMAIL_FROM="Dentální ordinace <rezervace@ordinace.cz>"
TEST_EMAIL="your-real-email@gmail.com"
```

### 2. Test delivery

- Zkontrolujte, že email nedopadne do spamu
- Ověřte všechny linky ve worku
- Zkontrolujte responzivitu na mobilu

### 3. Test všech flow

- ✅ Booking created → Email sent → Payment link works
- ✅ Payment completed → Email sent → Correct details
- ✅ Reminder → Email sent 24h before → Correct date/time
- ✅ Cancellation with refund → Email sent → Refund info correct
- ✅ Cancellation without refund → Email sent → No refund info

## Disable Test Endpoints in Production

Pro zabezpečení ODSTRAŇTE nebo CHRAŇTE test endpointy v produkci:

### Option 1: Odstranit soubory

Před nasazením smažte:
```bash
rm -rf src/app/api/test/
```

### Option 2: Environment check

Přidat do každého test endpointu:

```typescript
export async function GET() {
  // Disable in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    )
  }

  // Test logic...
}
```

### Option 3: Authentication

Vyžadovat secret token:

```typescript
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.TEST_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Test logic...
}
```

## Summary

- ✅ Pro rychlý test použijte GET endpointy (otevřít v prohlížeči)
- ✅ Pro custom data použijte POST s JSON body
- ✅ Zkontrolujte Resend dashboard pro delivery status
- ✅ Před production nasazením otestujte s reálnou doménou
- ✅ Odstraňte nebo chraňte test endpointy v produkci
