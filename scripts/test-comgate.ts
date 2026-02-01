/**
 * Comgate Integration Test Script
 *
 * Tento skript slouží k testování Comgate integrace.
 * Spusť pomocí: tsx scripts/test-comgate.ts
 *
 * Prerekvizity:
 * - npm install -D tsx
 * - Vyplněné environment variables v .env
 */

import { createPayment, verifyPayment, refundPayment } from '../src/lib/comgate'

// ============================================
// CONFIG
// ============================================

const TEST_BOOKING = {
  bookingId: 'test_booking_' + Date.now(),
  price: 50000, // 500 Kč v haléřích
  label: 'Test Platba - Dentální hygiena',
  email: 'test@example.com',
  customerName: 'Test User',
  customerPhone: '+420123456789',
}

// ============================================
// TESTS
// ============================================

async function testCreatePayment() {
  console.log('\n=== TEST 1: Vytvoření platby ===')
  console.log('Parametry:', TEST_BOOKING)

  const result = await createPayment(TEST_BOOKING)

  if (result.success) {
    console.log('✓ Platba vytvořena úspěšně')
    console.log('  Transaction ID:', result.transId)
    console.log('  Redirect URL:', result.redirectUrl)
    console.log('\nOtevři tento URL v prohlížeči pro dokončení testovací platby:')
    console.log(result.redirectUrl)
    return result.transId
  } else {
    console.log('✗ Chyba vytvoření platby:', result.error)
    return null
  }
}

async function testVerifyPayment(transId: string) {
  console.log('\n=== TEST 2: Ověření platby ===')
  console.log('Transaction ID:', transId)

  const result = await verifyPayment(transId)

  if (result.success) {
    console.log('✓ Platba ověřena úspěšně')
    console.log('  Status:', result.status)
    console.log('  RefId:', result.refId)
    console.log('  Price:', result.price)
    console.log('  Data:', result.data)
    return result.status
  } else {
    console.log('✗ Chyba ověření platby:', result.error)
    return null
  }
}

async function testRefundPayment(transId: string) {
  console.log('\n=== TEST 3: Vrácení platby ===')
  console.log('Transaction ID:', transId)
  console.log('Amount: 50000 (500 Kč)')

  const result = await refundPayment({
    transId,
    amount: 50000,
  })

  if (result.success) {
    console.log('✓ Refund úspěšný')
    console.log('  Message:', result.message)
  } else {
    console.log('✗ Chyba refundu:', result.error)
  }
}

// ============================================
// MOCK WEBHOOK TEST
// ============================================

async function testWebhook(bookingId: string, transId: string) {
  console.log('\n=== TEST 4: Webhook Simulation ===')

  const webhookUrl = process.env.NEXT_PUBLIC_APP_URL + '/api/webhooks/comgate'

  const params = new URLSearchParams({
    transId,
    refId: bookingId,
    status: 'PAID',
    price: '50000',
    curr: 'CZK',
    email: 'test@example.com',
  })

  console.log('Webhook URL:', webhookUrl)
  console.log('Parametry:', params.toString())

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✓ Webhook úspěšně zpracován')
      console.log('  Response:', data)
    } else {
      console.log('✗ Webhook selhal')
      console.log('  Status:', response.status)
      console.log('  Response:', data)
    }
  } catch (error) {
    console.log('✗ Chyba volání webhooku:', error)
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('╔════════════════════════════════════════════╗')
  console.log('║  Comgate Integration Test Suite           ║')
  console.log('╚════════════════════════════════════════════╝')

  // Zkontroluj environment variables
  const requiredVars = [
    'COMGATE_MERCHANT_ID',
    'COMGATE_SECRET',
    'NEXT_PUBLIC_APP_URL',
  ]

  const missing = requiredVars.filter(v => !process.env[v])
  if (missing.length > 0) {
    console.error('\n✗ Chybí environment variables:', missing.join(', '))
    console.error('Zkontroluj .env soubor')
    process.exit(1)
  }

  console.log('\n✓ Environment variables OK')
  console.log('  Merchant ID:', process.env.COMGATE_MERCHANT_ID)
  console.log('  Test Mode:', process.env.COMGATE_TEST_MODE === 'true' ? 'ANO' : 'NE')

  // Test 1: Vytvoření platby
  const transId = await testCreatePayment()
  if (!transId) {
    console.error('\nTests failed - cannot continue without transaction ID')
    process.exit(1)
  }

  // Počkej chvíli (v reálném testu by uživatel zaplatil)
  console.log('\n⏳ Čekám 3 sekundy před dalšími testy...')
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Test 2: Ověření platby
  const status = await testVerifyPayment(transId)

  // Test 3: Refund (jen pokud je platba PAID)
  if (status === 'PAID') {
    console.log('\n⚠️  Refund test je zakomentován (odkomentuj pokud chceš testovat)')
    // await testRefundPayment(transId)
  }

  // Test 4: Webhook (vyžaduje běžící dev server)
  if (process.env.TEST_WEBHOOK === 'true') {
    await testWebhook(TEST_BOOKING.bookingId, transId)
  } else {
    console.log('\n⏭️  Webhook test přeskočen (nastav TEST_WEBHOOK=true pro aktivaci)')
  }

  console.log('\n╔════════════════════════════════════════════╗')
  console.log('║  Tests Completed                           ║')
  console.log('╚════════════════════════════════════════════╝\n')

  console.log('Next steps:')
  console.log('1. Otevři payment URL v prohlížeči')
  console.log('2. Dokonči testovací platbu')
  console.log('3. Zkontroluj webhook byl zavolán')
  console.log('4. Zkontroluj booking status v databázi')
}

// Run tests
main().catch(error => {
  console.error('\n✗ Neočekávaná chyba:', error)
  process.exit(1)
})
