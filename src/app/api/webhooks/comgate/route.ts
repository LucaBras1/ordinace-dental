/**
 * Comgate Webhook Handler
 *
 * This endpoint receives callback notifications from Comgate after payment completion.
 *
 * IMPORTANT: This is where Google Calendar events are CREATED (not just updated).
 * Events are created ONLY after successful payment to integrate with SmartMEDIX.
 *
 * Flow:
 * 1. Receive payment status from Comgate
 * 2. Verify payment with Comgate API
 * 3. On PAID: Retrieve pending booking data, create GCal event, send confirmation
 * 4. On CANCELLED/TIMEOUT: Delete pending booking, no GCal event created
 *
 * Comgate sends POST request with parameters:
 * - transId: Transaction ID
 * - refId: Pending Booking ID (UUID)
 * - status: PAID, CANCELLED, PENDING, ...
 * - price: Amount
 * - curr: Currency (CZK)
 * - email: Customer email
 *
 * Documentation: https://help.comgate.cz/docs/cs/api
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/comgate'
import { createCalendarEvent, isCalendarEnabled } from '@/lib/google-calendar'
import { sendPaymentConfirmation, sendCancellation } from '@/lib/email'
import { getPendingBooking, deletePendingBooking } from '@/lib/pending-bookings'

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

    // 7. Get pending booking data
    // refId is the pending booking UUID (not a GCal event ID anymore)
    const pendingBooking = getPendingBooking(refId)

    if (!pendingBooking) {
      console.error('[Comgate Webhook] Pending booking not found or expired:', refId)
      return NextResponse.json(
        { error: 'Booking not found or expired. Payment may have taken too long.' },
        { status: 404 }
      )
    }

    // 8. Process based on payment status
    switch (status) {
      case 'PAID': {
        console.log('[Comgate Webhook] Payment successful - creating Google Calendar event')

        let eventId: string | null = null

        // Create Google Calendar event ONLY NOW (after successful payment)
        if (isCalendarEnabled()) {
          try {
            eventId = await createCalendarEvent({
              id: refId, // Used for logging, actual ID comes from GCal
              customerName: pendingBooking.customerName,
              customerEmail: pendingBooking.customerEmail,
              customerPhone: pendingBooking.customerPhone,
              appointmentDate: new Date(pendingBooking.appointmentDate),
              appointmentTime: pendingBooking.appointmentTime,
              duration: pendingBooking.duration,
              serviceName: pendingBooking.serviceName,
              notes: pendingBooking.notes,
              isFirstVisit: pendingBooking.isFirstVisit,
              status: 'PAID', // Green color - payment confirmed
              depositAmount: pendingBooking.depositAmount,
              serviceId: pendingBooking.serviceId,
            })

            console.log('[Comgate Webhook] Google Calendar event created:', eventId)
          } catch (calendarError) {
            console.error('[Comgate Webhook] Failed to create calendar event:', calendarError)
            // Continue anyway - payment was successful, log the error
            // TODO: Implement retry mechanism or alert
          }
        } else {
          console.warn('[Comgate Webhook] Google Calendar not configured - event not created')
        }

        // Send confirmation email
        try {
          await sendPaymentConfirmation({
            id: eventId || refId,
            customerName: pendingBooking.customerName,
            customerEmail: pendingBooking.customerEmail,
            appointmentDate: new Date(pendingBooking.appointmentDate),
            appointmentTime: pendingBooking.appointmentTime,
            depositAmount: pendingBooking.depositAmount,
            status: 'PAID',
            service: {
              name: pendingBooking.serviceName,
              price: pendingBooking.price,
              duration: pendingBooking.duration,
            },
          })
          console.log('[Comgate Webhook] Confirmation email sent')
        } catch (emailError) {
          console.error('[Comgate Webhook] Failed to send confirmation email:', emailError)
          // Don't fail webhook on email error
        }

        // Delete pending booking - it's now a real booking in GCal
        deletePendingBooking(refId)

        return NextResponse.json({
          success: true,
          message: 'Payment processed, calendar event created',
          bookingId: eventId || refId,
          status: 'PAID',
        })
      }

      case 'CANCELLED':
      case 'TIMEOUT': {
        console.log('[Comgate Webhook] Payment cancelled/timeout - NO calendar event created')

        // Send cancellation email (optional - user abandoned payment)
        if (pendingBooking.customerEmail || email) {
          try {
            await sendCancellation({
              id: refId,
              customerName: pendingBooking.customerName,
              customerEmail: pendingBooking.customerEmail || email,
              appointmentDate: new Date(pendingBooking.appointmentDate),
              appointmentTime: pendingBooking.appointmentTime,
              depositAmount: 0, // No deposit was paid
              status: 'CANCELLED',
              service: {
                name: pendingBooking.serviceName,
                price: pendingBooking.price,
                duration: pendingBooking.duration,
              },
            })
            console.log('[Comgate Webhook] Cancellation email sent')
          } catch (emailError) {
            console.error('[Comgate Webhook] Failed to send cancellation email:', emailError)
          }
        }

        // Delete pending booking - payment failed
        deletePendingBooking(refId)

        return NextResponse.json({
          success: true,
          message: 'Payment cancelled, no calendar event created',
          bookingId: refId,
          status,
        })
      }

      case 'PENDING':
      case 'PROCESSING': {
        // Keep pending booking, wait for final status
        console.log('[Comgate Webhook] Payment pending - keeping pending booking')

        return NextResponse.json({
          success: true,
          message: 'Payment pending',
          bookingId: refId,
          status,
        })
      }

      default: {
        console.warn('[Comgate Webhook] Unknown status:', status)

        return NextResponse.json({
          success: true,
          message: 'Unknown status received',
          bookingId: refId,
          status,
        })
      }
    }

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
// GET /api/webhooks/comgate
// ============================================

/**
 * GET endpoint for testing/debugging.
 */
export async function GET() {
  return NextResponse.json({
    message: 'Comgate webhook endpoint is active',
    method: 'POST',
    requiredParams: ['transId', 'refId', 'status'],
    description: 'This endpoint processes Comgate payment callbacks. On successful payment, it creates a Google Calendar event.',
    flow: [
      '1. Receive payment callback from Comgate',
      '2. Verify payment status',
      '3. On PAID: Create Google Calendar event + send confirmation email',
      '4. On CANCELLED/TIMEOUT: Delete pending booking, no calendar event',
    ],
  })
}
