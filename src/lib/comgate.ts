/**
 * Comgate Payment Gateway Integration
 *
 * Dokumentace: https://help.comgate.cz/docs/cs/api
 *
 * Environment Variables:
 * - COMGATE_MERCHANT_ID: ID obchodníka (merchant)
 * - COMGATE_SECRET: Tajný klíč pro podepisování požadavků
 * - COMGATE_TEST_MODE: "true" pro testovací režim
 * - NEXT_PUBLIC_APP_URL: Base URL aplikace pro redirect/callback
 */

import crypto from 'crypto'

// ============================================
// TYPES
// ============================================

export interface ComgateConfig {
  merchantId: string
  secret: string
  testMode: boolean
  baseUrl: string
}

export interface CreatePaymentParams {
  /** ID rezervace (použije se jako refId) */
  bookingId: string
  /** Částka v haléřích (CZK * 100) */
  price: number
  /** Popis platby */
  label: string
  /** Email zákazníka */
  email: string
  /** Jméno zákazníka (volitelné) */
  customerName?: string
  /** Telefon zákazníka (volitelné) */
  customerPhone?: string
}

export interface ComgateCreateResponse {
  code: string
  message: string
  transId?: string
  redirect?: string
}

export interface ComgateStatusResponse {
  code: string
  message: string
  transId?: string
  refId?: string
  status?: string
  price?: string
  curr?: string
  label?: string
  email?: string
  method?: string
  account?: string
  payerId?: string
  fee?: string
}

export interface ComgateRefundParams {
  transId: string
  amount: number
  curr?: string
}

// ============================================
// CONFIGURATION
// ============================================

/**
 * Načte Comgate konfiguraci z environment variables.
 * Vyhodí error pokud chybí povinné hodnoty.
 */
export function getComgateConfig(): ComgateConfig {
  const merchantId = process.env.COMGATE_MERCHANT_ID
  const secret = process.env.COMGATE_SECRET
  const testMode = process.env.COMGATE_TEST_MODE === 'true'
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (!merchantId || !secret) {
    throw new Error('Missing required Comgate configuration: COMGATE_MERCHANT_ID and COMGATE_SECRET')
  }

  return { merchantId, secret, testMode, baseUrl }
}

// ============================================
// API ENDPOINTS
// ============================================

const COMGATE_API_BASE = 'https://payments.comgate.cz'

const ENDPOINTS = {
  create: `${COMGATE_API_BASE}/v1.0/create`,
  status: `${COMGATE_API_BASE}/v1.0/status`,
  refund: `${COMGATE_API_BASE}/v1.0/refund`,
} as const

// ============================================
// PAYMENT CREATION
// ============================================

/**
 * Vytvoří platbu v Comgate a vrátí redirect URL.
 *
 * @param params - Parametry platby
 * @returns Redirect URL pro přesměrování zákazníka nebo error
 *
 * @example
 * ```typescript
 * const result = await createPayment({
 *   bookingId: 'booking_123',
 *   price: 50000, // 500 Kč v haléřích
 *   label: 'Kauce - Dentální hygiena',
 *   email: 'customer@example.com',
 * })
 *
 * if (result.success) {
 *   redirect(result.redirectUrl)
 * }
 * ```
 */
export async function createPayment(
  params: CreatePaymentParams
): Promise<{ success: true; redirectUrl: string; transId: string } | { success: false; error: string }> {
  try {
    const config = getComgateConfig()

    // Callback URL kam Comgate pošle výsledek platby
    const callbackUrl = `${config.baseUrl}/api/webhooks/comgate`

    // Redirect URL kam se vrátí uživatel po platbě
    const returnUrl = `${config.baseUrl}/objednavka/potvrzeni?bookingId=${params.bookingId}`

    // Sestavení parametrů pro Comgate API
    const requestParams = new URLSearchParams({
      merchant: config.merchantId,
      price: params.price.toString(),
      curr: 'CZK',
      label: params.label,
      refId: params.bookingId,
      email: params.email,
      method: 'ALL', // Všechny platební metody
      prepareOnly: 'true', // Vytvoří platbu, ale nevyžaduje immediate payment
      country: 'CZ',
      lang: 'cs',
      // Callback URL pro notifikaci (POST)
      redirect: callbackUrl,
      // Return URL pro redirect po platbě
      //returnurl: returnUrl, // Uncomment pokud chceš custom return URL
    })

    // Přidat volitelné parametry
    if (params.customerName) {
      requestParams.append('name', params.customerName)
    }
    if (params.customerPhone) {
      requestParams.append('phone', params.customerPhone)
    }

    // Test mode
    if (config.testMode) {
      requestParams.append('test', 'true')
    }

    console.log('[Comgate] Creating payment:', {
      bookingId: params.bookingId,
      price: params.price,
      email: params.email,
      testMode: config.testMode,
    })

    // Volání Comgate API
    const response = await fetch(ENDPOINTS.create, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestParams.toString(),
    })

    const textResponse = await response.text()
    console.log('[Comgate] Create response:', textResponse)

    // Parse response (formát: code=0&message=OK&transId=XXX&redirect=URL)
    const result = parseComgateResponse(textResponse)

    if (result.code !== '0') {
      console.error('[Comgate] Payment creation failed:', result)
      return {
        success: false,
        error: result.message || 'Payment creation failed',
      }
    }

    if (!result.transId || !result.redirect) {
      return {
        success: false,
        error: 'Missing transaction ID or redirect URL',
      }
    }

    console.log('[Comgate] Payment created successfully:', {
      transId: result.transId,
      redirectUrl: result.redirect,
    })

    return {
      success: true,
      redirectUrl: result.redirect,
      transId: result.transId,
    }
  } catch (error) {
    console.error('[Comgate] Payment creation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ============================================
// PAYMENT VERIFICATION
// ============================================

/**
 * Ověří stav platby v Comgate.
 *
 * @param transId - Comgate transaction ID
 * @returns Status platby nebo error
 *
 * @example
 * ```typescript
 * const status = await verifyPayment('ABC-123-456')
 * if (status.success && status.status === 'PAID') {
 *   // Platba byla úspěšná
 * }
 * ```
 */
export async function verifyPayment(
  transId: string
): Promise<
  | { success: true; status: string; refId: string; price: string; data: ComgateStatusResponse }
  | { success: false; error: string }
> {
  try {
    const config = getComgateConfig()

    const requestParams = new URLSearchParams({
      merchant: config.merchantId,
      transId: transId,
    })

    console.log('[Comgate] Verifying payment:', { transId })

    const response = await fetch(ENDPOINTS.status, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestParams.toString(),
    })

    const textResponse = await response.text()
    console.log('[Comgate] Status response:', textResponse)

    const result = parseComgateResponse(textResponse) as unknown as ComgateStatusResponse

    if (result.code !== '0') {
      console.error('[Comgate] Payment verification failed:', result)
      return {
        success: false,
        error: result.message || 'Payment verification failed',
      }
    }

    if (!result.status || !result.refId) {
      return {
        success: false,
        error: 'Missing status or refId in response',
      }
    }

    console.log('[Comgate] Payment verified:', {
      transId,
      status: result.status,
      refId: result.refId,
    })

    return {
      success: true,
      status: result.status,
      refId: result.refId,
      price: result.price || '0',
      data: result,
    }
  } catch (error) {
    console.error('[Comgate] Payment verification error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ============================================
// PAYMENT REFUND
// ============================================

/**
 * Vrátí platbu (refund) přes Comgate.
 *
 * @param params - Parametry refundu
 * @returns Výsledek refundu
 *
 * @example
 * ```typescript
 * const result = await refundPayment({
 *   transId: 'ABC-123-456',
 *   amount: 50000, // 500 Kč v haléřích
 * })
 * ```
 */
export async function refundPayment(
  params: ComgateRefundParams
): Promise<{ success: true; message: string } | { success: false; error: string }> {
  try {
    const config = getComgateConfig()

    const requestParams = new URLSearchParams({
      merchant: config.merchantId,
      transId: params.transId,
      amount: params.amount.toString(),
      curr: params.curr || 'CZK',
    })

    console.log('[Comgate] Refunding payment:', {
      transId: params.transId,
      amount: params.amount,
    })

    const response = await fetch(ENDPOINTS.refund, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestParams.toString(),
    })

    const textResponse = await response.text()
    console.log('[Comgate] Refund response:', textResponse)

    const result = parseComgateResponse(textResponse)

    if (result.code !== '0') {
      console.error('[Comgate] Refund failed:', result)
      return {
        success: false,
        error: result.message || 'Refund failed',
      }
    }

    console.log('[Comgate] Refund successful:', { transId: params.transId })

    return {
      success: true,
      message: result.message || 'Refund successful',
    }
  } catch (error) {
    console.error('[Comgate] Refund error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Parse Comgate response (formát: key=value&key2=value2)
 */
function parseComgateResponse(text: string): Record<string, string> {
  const params = new URLSearchParams(text)
  const result: Record<string, string> = {}

  params.forEach((value, key) => {
    result[key] = value
  })

  return result
}

/**
 * Verifikuje Comgate callback signature.
 *
 * Comgate generuje signature jako HMAC-SHA256 z parametrů v abecedním pořadí
 * spojených s '&' a podepsaných merchant secret.
 *
 * @param params - Parametry z callback requestu (bez 'signature')
 * @param signature - Signature z callback requestu
 * @returns true pokud je signature validní
 */
export function verifyComgateSignature(
  params: Record<string, string>,
  signature: string
): boolean {
  try {
    const config = getComgateConfig()

    // Odstranit signature z parametrů pro výpočet
    const paramsWithoutSig = { ...params }
    delete paramsWithoutSig.signature

    // Seřadit klíče abecedně
    const sortedKeys = Object.keys(paramsWithoutSig).sort()

    // Sestavit string pro podpis: key1=value1&key2=value2...
    const signatureBase = sortedKeys
      .map(key => `${key}=${paramsWithoutSig[key]}`)
      .join('&')

    // Vypočítat HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', config.secret)
      .update(signatureBase)
      .digest('hex')

    // Porovnat signatures (case-insensitive)
    const isValid = expectedSignature.toLowerCase() === signature.toLowerCase()

    if (!isValid) {
      console.warn('[Comgate] Signature verification failed:', {
        expected: expectedSignature,
        received: signature,
      })
    }

    return isValid
  } catch (error) {
    console.error('[Comgate] Signature verification error:', error)
    return false
  }
}

/**
 * Ověří, zda callback pochází z povolené IP adresy Comgate.
 *
 * Comgate IP ranges (dle dokumentace):
 * - 185.33.241.0/24
 * - 185.33.242.0/24
 */
export function isComgateIP(ip: string): boolean {
  // Simplified check - v produkci použít ip-range-check library
  const comgateRanges = [
    '185.33.241.',
    '185.33.242.',
  ]

  return comgateRanges.some(range => ip.startsWith(range))
}
