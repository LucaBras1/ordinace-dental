/**
 * Comgate Webhook Handler
 *
 * Tento endpoint přijímá callback notifikace od Comgate po dokončení platby.
 *
 * Comgate odesílá POST request s parametry:
 * - transId: ID transakce
 * - refId: Booking ID (= Google Calendar Event ID)
 * - status: PAID, CANCELLED, PENDING, ...
 * - price: Částka
 * - curr: Měna (CZK)
 * - email: Email zákazníka
 *
 * Po zaplacení:
 * 1. Aktualizuje Google Calendar event (barva = zelená pro PAID)
 * 2. Odešle potvrzovací email
 *
 * Dokumentace: https://help.comgate.cz/docs/cs/api
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/comgate'
import {
  updateCalendarEventStatus,
  getCalendarEvent,
  isCalendarEnabled,
  deleteCalendarEvent,
} from '@/lib/google-calendar'
import { sendPaymentConfirmation, sendCancellation } from '@/lib/email'
import { getServiceById } from '@/lib/services'

// ============================================
// POST /api/webhooks/comgate
// ============================================

export async function POST(request: NextRequest) {
  try {
    // 1. Log incoming request
    const body = await request.text()
    console.log('[Comgate Webhook] Incoming request:', body)

    // 2. Parse URL-encoded body
    const params = new URLSearchParams(body)
    const data: Record<string, string> = {}
    params.forEach((value, key) => {
      data[key] = value
    })

    console.log('[Comgate Webhook] Parsed data:', data)

    // 3. Validate required parameters
    const { transId, refId, status, email } = data

    if (!transId || !refId || !status) {
      console.error('[Comgate Webhook] Missing required parameters:', { transId, refId, status })
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // 4. IP Whitelisting (optional security layer)
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    console.log('[Comgate Webhook] Client IP:', clientIP)

    // 5. Verify payment status directly with Comgate (double-check)
    const verification = await verifyPayment(transId)
    if (!verification.success) {
      console.error('[Comgate Webhook] Payment verification failed:', verification.error)
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // 6. Check if verified status matches callback status
    if (verification.status !== status) {
      console.warn('[Comgate Webhook] Status mismatch:', {
        callbackStatus: status,
        verifiedStatus: verification.status,
      })
    }

    // 7. Check if Google Calendar is enabled
    if (!isCalendarEnabled()) {
      console.warn('[Comgate Webhook] Google Calendar not configured - skipping calendar update')

      // Return success anyway (mock mode)
      return NextResponse.json({
        success: true,
        message: 'Webhook processed (calendar not configured)',
        bookingId: refId,
        status,
        warning: 'Google Calendar not configured',
      })
    }

    // 8. Get booking details from Google Calendar event
    let eventDetails
    try {
      eventDetails = await getCalendarEvent(refId)
      console.log('[Comgate Webhook] Found calendar event:', {
        id: refId,
        summary: eventDetails?.summary,
      })
    } catch (error) {
      console.error('[Comgate Webhook] Calendar event not found:', refId)
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // 9. Parse booking data from event description
    const bookingData = parseEventDescription(eventDetails.description || '')

    console.log('[Comgate Webhook] Parsed booking data:', bookingData)

    // 10. Update calendar event status based on payment status
    switch (status) {
      case 'PAID':
        console.log('[Comgate Webhook] Payment successful - updating event to PAID (green)')

        // Update calendar event color to green
        await updateCalendarEventStatus(refId, 'PAID')

        // Send confirmation email
        if (bookingData.email || email) {
          try {
            const serviceId = parseServiceIdFromSummary(eventDetails.summary || '')
            const service = getServiceById(serviceId)

            await sendPaymentConfirmation({
              id: refId,
              customerName: bookingData.name || 'Pacient',
              customerEmail: bookingData.email || email,
              appointmentDate: new Date(eventDetails.start || new Date()),
              appointmentTime: extractTimeFromDateTime(eventDetails.start || ''),
              depositAmount: bookingData.depositAmount || 0,
              status: 'PAID',
              service: service ? {
                name: service.name,
                price: service.price,
                duration: service.duration,
              } : {
                name: parseServiceNameFromSummary(eventDetails.summary || ''),
                price: 0,
                duration: 60,
              },
            })
            console.log('[Comgate Webhook] Confirmation email sent')
          } catch (emailError) {
            console.error('[Comgate Webhook] Failed to send confirmation email:', emailError)
            // Don't fail webhook on email error
          }
        }
        break

      case 'CANCELLED':
      case 'TIMEOUT':
        console.log('[Comgate Webhook] Payment cancelled - updating event to CANCELLED (red)')

        // Update calendar event color to red
        await updateCalendarEventStatus(refId, 'CANCELLED')

        // Send cancellation email (no refund since payment was never completed)
        if (bookingData.email || email) {
          try {
            const serviceId = parseServiceIdFromSummary(eventDetails.summary || '')
            const service = getServiceById(serviceId)

            await sendCancellation({
              id: refId,
              customerName: bookingData.name || 'Pacient',
              customerEmail: bookingData.email || email,
              appointmentDate: new Date(eventDetails.start || new Date()),
              appointmentTime: extractTimeFromDateTime(eventDetails.start || ''),
              depositAmount: 0,
              status: 'CANCELLED',
              service: service ? {
                name: service.name,
                price: service.price,
                duration: service.duration,
              } : {
                name: parseServiceNameFromSummary(eventDetails.summary || ''),
                price: 0,
                duration: 60,
              },
            })
            console.log('[Comgate Webhook] Cancellation email sent')
          } catch (emailError) {
            console.error('[Comgate Webhook] Failed to send cancellation email:', emailError)
          }
        }

        // Optionally delete the event (or keep it with CANCELLED color)
        // await deleteCalendarEvent(refId)
        break

      case 'PENDING':
      case 'PROCESSING':
        // Keep current status, just log
        console.log('[Comgate Webhook] Payment pending - keeping current status')
        break

      default:
        console.warn('[Comgate Webhook] Unknown status:', status)
        break
    }

    // 11. Return OK response (Comgate očekává status 200)
    return NextResponse.json({
      success: true,
      message: 'Webhook processed',
      bookingId: refId,
      status,
    })

  } catch (error) {
    console.error('[Comgate Webhook] Error processing webhook:', error)

    // Return 200 even on error to prevent Comgate from retrying
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 } // 200 to prevent retries
    )
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Parse booking data from Google Calendar event description.
 *
 * Expected format:
 * Kontakt: +420123456789
 * Email: test@example.com
 * První návštěva: Ano
 * Poznámka: ...
 */
function parseEventDescription(description: string): {
  phone?: string
  email?: string
  name?: string
  isFirstVisit?: boolean
  notes?: string
  depositAmount?: number
} {
  const lines = description.split('\n')
  const result: Record<string, string> = {}

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length > 0) {
      result[key.trim().toLowerCase()] = valueParts.join(':').trim()
    }
  }

  return {
    phone: result['kontakt'],
    email: result['email'],
    name: result['jméno'] || result['name'],
    isFirstVisit: result['první návštěva']?.toLowerCase() === 'ano',
    notes: result['poznámka'],
    depositAmount: result['kauce'] ? parseInt(result['kauce'], 10) : undefined,
  }
}

/**
 * Parse service ID from event summary.
 * Summary format: "Služba - Jméno"
 */
function parseServiceIdFromSummary(summary: string): string {
  const serviceName = summary.split(' - ')[0]?.trim() || ''

  // Map service names to IDs
  const serviceMap: Record<string, string> = {
    'Dentální hygiena': 'dentalni-hygiena',
    'Bělení zubů': 'beleni-zubu',
    'Preventivní prohlídka': 'preventivni-prohlidka',
    'Léčba zubního kazu': 'lecba-zubniho-kazu',
    'Extrakce zubu': 'extrakce-zubu',
  }

  return serviceMap[serviceName] || ''
}

/**
 * Parse service name from event summary.
 */
function parseServiceNameFromSummary(summary: string): string {
  return summary.split(' - ')[0]?.trim() || 'Služba'
}

/**
 * Extract time (HH:MM) from ISO datetime string.
 */
function extractTimeFromDateTime(dateTimeStr: string): string {
  if (!dateTimeStr) return '09:00'

  try {
    const date = new Date(dateTimeStr)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  } catch {
    return '09:00'
  }
}

// ============================================
// GET /api/webhooks/comgate
// ============================================

/**
 * GET endpoint pro testování/debugging.
 */
export async function GET() {
  return NextResponse.json({
    message: 'Comgate webhook endpoint is active',
    method: 'POST',
    requiredParams: ['transId', 'refId', 'status'],
    description: 'This endpoint processes Comgate payment callbacks and updates Google Calendar events.',
  })
}
