/**
 * Booking Cancellation API Route
 *
 * POST /api/bookings/[id]/cancel
 *
 * Cancels a booking:
 * 1. Updates Google Calendar event status to CANCELLED (red color)
 * 2. Sends cancellation email to customer
 * 3. Optionally initiates refund via Comgate (if cancelled 24h+ before appointment)
 *
 * Refund policy:
 * - Cancellation 24+ hours before appointment: Full refund
 * - Cancellation less than 24 hours before: No refund (deposit forfeited)
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getCalendarEvent,
  updateCalendarEventStatus,
  isCalendarEnabled,
} from '@/lib/google-calendar'
import { sendCancellation } from '@/lib/email'
import { getServiceById, getServiceByName } from '@/lib/services'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * Parse booking data from Google Calendar event description.
 */
function parseEventDescription(description: string): {
  phone?: string
  email?: string
  name?: string
  isFirstVisit?: boolean
  notes?: string
  depositAmount?: number
  status?: string
  serviceId?: string
} {
  const lines = description.split('\n')
  const result: Record<string, string> = {}

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim().toLowerCase()
      const value = line.substring(colonIndex + 1).trim()
      result[key] = value
    }
  }

  return {
    phone: result['kontakt'],
    email: result['email'],
    name: result['jméno'] || result['jmeno'] || result['name'],
    isFirstVisit: result['první návštěva']?.toLowerCase() === 'ano',
    notes: result['poznámka'] || result['poznamka'],
    depositAmount: result['kauce'] ? parseInt(result['kauce'], 10) : undefined,
    status: result['status'],
    serviceId: result['serviceid'],
  }
}

/**
 * Parse service name from event summary.
 * Format: "Service Name - Customer Name"
 */
function parseServiceNameFromSummary(summary: string): string {
  return summary.split(' - ')[0]?.trim() || ''
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

/**
 * Map Google Calendar color ID to booking status.
 */
function getStatusFromColorId(colorId?: string): string {
  const colorMap: Record<string, string> = {
    '10': 'PAID',      // Green
    '6': 'PENDING_PAYMENT', // Orange
    '8': 'NO_SHOW',    // Gray
    '11': 'CANCELLED', // Red
  }

  return colorMap[colorId || ''] || 'PENDING_PAYMENT'
}

/**
 * Check if cancellation is within refund window (24+ hours before appointment).
 */
function isRefundEligible(appointmentDate: Date): boolean {
  const now = new Date()
  const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  return hoursUntilAppointment >= 24
}

/**
 * POST /api/bookings/[id]/cancel
 *
 * Cancels a booking and sends cancellation email.
 *
 * @param {string} id - Booking ID (= Google Calendar Event ID)
 *
 * Request body (optional):
 * {
 *   reason?: string - Cancellation reason (for logging)
 *   skipEmail?: boolean - Skip sending cancellation email
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   booking: { id, status, refundEligible, refundAmount? }
 *   message: string
 * }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  console.log('[API] Processing booking cancellation')

  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 }
      )
    }

    // Parse optional request body
    let body: { reason?: string; skipEmail?: boolean } = {}
    try {
      const text = await request.text()
      if (text) {
        body = JSON.parse(text)
      }
    } catch {
      // Ignore JSON parse errors - body is optional
    }

    // Check if calendar is configured
    if (!isCalendarEnabled()) {
      return NextResponse.json(
        {
          error: 'Calendar not configured',
          message: 'Google Calendar integration is not configured',
        },
        { status: 503 }
      )
    }

    // Get the calendar event
    let event
    try {
      event = await getCalendarEvent(id)
    } catch (error) {
      console.error('[API] Event not found:', id, error)
      return NextResponse.json(
        {
          error: 'Booking not found',
          message: `Booking with ID ${id} does not exist`,
        },
        { status: 404 }
      )
    }

    // Parse booking data
    const bookingData = parseEventDescription(event.description || '')
    const currentStatus = getStatusFromColorId(event.colorId)

    // Check if already cancelled
    if (currentStatus === 'CANCELLED') {
      return NextResponse.json(
        {
          error: 'Already cancelled',
          message: 'This booking has already been cancelled',
        },
        { status: 400 }
      )
    }

    // Get service info
    const serviceName = parseServiceNameFromSummary(event.summary || '')
    const service = bookingData.serviceId
      ? getServiceById(bookingData.serviceId)
      : getServiceByName(serviceName)

    // Parse appointment date
    const appointmentDate = new Date(event.start)

    // Determine refund eligibility
    const refundEligible = isRefundEligible(appointmentDate)
    const depositAmount = bookingData.depositAmount || service?.depositAmount || 0
    const refundAmount = refundEligible ? depositAmount : undefined

    console.log('[API] Cancellation details:', {
      bookingId: id,
      appointmentDate: appointmentDate.toISOString(),
      refundEligible,
      depositAmount,
      refundAmount,
      reason: body.reason,
    })

    // Update calendar event status to CANCELLED
    await updateCalendarEventStatus(id, 'CANCELLED')
    console.log('[API] Calendar event updated to CANCELLED')

    // Send cancellation email (unless skipped)
    if (!body.skipEmail && bookingData.email) {
      const booking = {
        id: event.id,
        customerName: bookingData.name || event.summary.split(' - ')[1] || 'Vážený klient',
        customerEmail: bookingData.email,
        appointmentDate,
        appointmentTime: extractTimeFromDateTime(event.start),
        depositAmount,
        status: 'CANCELLED',
        service: {
          name: service?.name || serviceName || 'Služba',
          price: service?.price || 0,
          duration: service?.duration || 30,
        },
      }

      const emailResult = await sendCancellation(booking, refundAmount)

      if (!emailResult.success) {
        console.error('[API] Failed to send cancellation email:', emailResult.error)
        // Continue anyway - cancellation succeeded, email is secondary
      } else {
        console.log('[API] Cancellation email sent to:', bookingData.email)
      }
    }

    // TODO: Initiate Comgate refund if eligible
    // This would require implementing refund API call to Comgate
    // For now, manual refund is required via Comgate admin panel
    if (refundEligible && depositAmount > 0) {
      console.log('[API] Refund eligible - manual refund required via Comgate admin panel')
      // Future: await initiateComgateRefund(bookingId, depositAmount)
    }

    return NextResponse.json({
      success: true,
      booking: {
        id,
        status: 'CANCELLED',
        previousStatus: currentStatus,
        refundEligible,
        refundAmount: refundEligible ? depositAmount : 0,
        appointmentDate: appointmentDate.toISOString(),
      },
      message: refundEligible
        ? `Rezervace byla zrušena. Kauce ${depositAmount / 100} Kč bude vrácena do 5 pracovních dnů.`
        : 'Rezervace byla zrušena. Kauce propadá dle storno podmínek (zrušení méně než 24h před termínem).',
    })
  } catch (error) {
    console.error('[API] Cancellation error:', error)

    return NextResponse.json(
      {
        error: 'Cancellation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
