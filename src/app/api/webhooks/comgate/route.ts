/**
 * Comgate Webhook Handler
 *
 * Tento endpoint přijímá callback notifikace od Comgate po dokončení platby.
 *
 * Comgate odesílá POST request s parametry:
 * - transId: ID transakce
 * - refId: Naše booking ID
 * - status: PAID, CANCELLED, PENDING, ...
 * - price: Částka
 * - curr: Měna (CZK)
 * - email: Email zákazníka
 *
 * Dokumentace: https://help.comgate.cz/docs/cs/api
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyComgateSignature, isComgateIP, verifyPayment } from '@/lib/comgate'
import { createCalendarEvent, isCalendarEnabled } from '@/lib/google-calendar'
import { sendPaymentConfirmation } from '@/lib/email'

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
    const { transId, refId, status } = data

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

    // Pokud chceš IP whitelisting, odkomentuj:
    // if (!isComgateIP(clientIP)) {
    //   console.error('[Comgate Webhook] Unauthorized IP:', clientIP)
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    // }

    // 5. Signature Verification (pokud je implementováno)
    const signature = data.signature || request.headers.get('x-signature') || ''
    // if (signature && !verifyComgateSignature(data, signature)) {
    //   console.error('[Comgate Webhook] Invalid signature')
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    // }

    // 6. Verify payment status directly with Comgate (double-check)
    const verification = await verifyPayment(transId)
    if (!verification.success) {
      console.error('[Comgate Webhook] Payment verification failed:', verification.error)
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // 7. Check if verified status matches callback status
    if (verification.status !== status) {
      console.warn('[Comgate Webhook] Status mismatch:', {
        callbackStatus: status,
        verifiedStatus: verification.status,
      })
    }

    // 8. Find booking by refId
    const booking = await prisma.booking.findUnique({
      where: { id: refId },
      include: { service: true },
    })

    if (!booking) {
      console.error('[Comgate Webhook] Booking not found:', refId)
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    console.log('[Comgate Webhook] Found booking:', {
      id: booking.id,
      currentStatus: booking.status,
      customerEmail: booking.customerEmail,
    })

    // 9. Update booking status based on payment status
    let updateData: any = {
      paymentId: transId,
      updatedAt: new Date(),
    }

    // Map Comgate status to BookingStatus
    switch (status) {
      case 'PAID':
        updateData.status = 'PAID'
        console.log('[Comgate Webhook] Payment successful - updating booking to PAID')
        break

      case 'CANCELLED':
      case 'TIMEOUT':
        updateData.status = 'CANCELLED'
        updateData.cancelledAt = new Date()
        console.log('[Comgate Webhook] Payment cancelled - updating booking to CANCELLED')
        break

      case 'PENDING':
      case 'PROCESSING':
        // Keep current status, just update paymentId
        console.log('[Comgate Webhook] Payment pending - keeping current status')
        break

      default:
        console.warn('[Comgate Webhook] Unknown status:', status)
        break
    }

    // 10. Update booking in database
    const updatedBooking = await prisma.booking.update({
      where: { id: refId },
      data: updateData,
    })

    console.log('[Comgate Webhook] Booking updated:', {
      id: updatedBooking.id,
      status: updatedBooking.status,
      paymentId: updatedBooking.paymentId,
    })

    // 11. Create Google Calendar event (pokud status === PAID)
    if (status === 'PAID' && !updatedBooking.googleEventId && isCalendarEnabled()) {
      try {
        console.log('[Comgate Webhook] Creating Google Calendar event for booking:', refId)

        const eventId = await createCalendarEvent({
          id: updatedBooking.id,
          customerName: updatedBooking.customerName,
          customerEmail: updatedBooking.customerEmail,
          customerPhone: updatedBooking.customerPhone,
          appointmentDate: updatedBooking.appointmentDate,
          appointmentTime: updatedBooking.appointmentTime,
          duration: booking.service.duration,
          serviceName: booking.service.name,
          notes: updatedBooking.notes || undefined,
          isFirstVisit: updatedBooking.isFirstVisit,
          status: updatedBooking.status,
        })

        // Update booking with Google Calendar event ID
        await prisma.booking.update({
          where: { id: refId },
          data: { googleEventId: eventId },
        })

        console.log('[Comgate Webhook] Google Calendar event created:', eventId)
      } catch (calendarError) {
        // Log error but don't fail the webhook (calendar is optional)
        console.error('[Comgate Webhook] Failed to create Google Calendar event:', calendarError)
      }
    }

    // 12. Send confirmation email
    if (status === 'PAID') {
      try {
        console.log('[Comgate Webhook] Sending confirmation email to:', booking.customerEmail)

        const emailResult = await sendPaymentConfirmation({
          id: updatedBooking.id,
          customerName: updatedBooking.customerName,
          customerEmail: updatedBooking.customerEmail,
          appointmentDate: updatedBooking.appointmentDate,
          appointmentTime: updatedBooking.appointmentTime,
          depositAmount: updatedBooking.depositAmount,
          status: updatedBooking.status,
          service: {
            name: booking.service.name,
            price: booking.service.price,
            duration: booking.service.duration,
          },
        })

        if (emailResult.success) {
          console.log('[Comgate Webhook] Confirmation email sent successfully')
        } else {
          console.error('[Comgate Webhook] Failed to send confirmation email:', emailResult.error)
        }
      } catch (emailError) {
        // Log error but don't fail the webhook (email is non-critical)
        console.error('[Comgate Webhook] Error sending confirmation email:', emailError)
      }
    }

    // 13. Return OK response (Comgate očekává status 200)
    return NextResponse.json({
      success: true,
      message: 'Webhook processed',
      bookingId: refId,
      status: updatedBooking.status,
    })

  } catch (error) {
    console.error('[Comgate Webhook] Error processing webhook:', error)

    // Return 200 even on error to prevent Comgate from retrying
    // (ale loguj error pro debugging)
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
 * GET endpoint pro testování/debugging.
 * V produkci by měl být disabled nebo chráněn.
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Comgate webhook endpoint is active',
    method: 'POST',
    requiredParams: ['transId', 'refId', 'status'],
  })
}
