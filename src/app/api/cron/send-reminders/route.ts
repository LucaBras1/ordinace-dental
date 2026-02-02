/**
 * Cron Job: Send Reminder Emails
 *
 * GET /api/cron/send-reminders
 *
 * Sends reminder emails to customers with appointments scheduled for tomorrow.
 * This endpoint should be called by a cron job (e.g., GitHub Actions, server cron)
 * once daily, preferably in the morning.
 *
 * Security:
 * - Uses CRON_SECRET environment variable for authentication
 * - Returns minimal information to prevent information disclosure
 *
 * Usage:
 * - Cron: curl -H "Authorization: Bearer $CRON_SECRET" https://example.com/api/cron/send-reminders
 * - GitHub Actions: Add CRON_SECRET to repository secrets
 */

import { NextRequest, NextResponse } from 'next/server'
import { listEvents, isCalendarEnabled } from '@/lib/google-calendar'
import { sendReminder } from '@/lib/email'
import { getServiceById, getServiceByName } from '@/lib/services'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Revalidate never (always fresh)
export const revalidate = 0

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
 * Verify cron secret for authentication.
 */
function verifyCronSecret(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET

  // If no secret is configured, deny access in production
  if (!cronSecret) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Cron] CRON_SECRET not configured - denying access')
      return false
    }
    // Allow in development without secret
    return true
  }

  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return false
  }

  // Support both "Bearer TOKEN" and plain "TOKEN"
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : authHeader

  return token === cronSecret
}

/**
 * GET /api/cron/send-reminders
 *
 * Sends reminder emails to customers with appointments tomorrow.
 */
export async function GET(request: NextRequest) {
  console.log('[Cron] Starting send-reminders job')

  // Verify authentication
  if (!verifyCronSecret(request)) {
    console.warn('[Cron] Unauthorized access attempt')
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Check if calendar is configured
  if (!isCalendarEnabled()) {
    console.error('[Cron] Google Calendar not configured')
    return NextResponse.json(
      { error: 'Calendar not configured' },
      { status: 503 }
    )
  }

  try {
    // Calculate tomorrow's date range
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    console.log('[Cron] Fetching events for:', {
      start: tomorrow.toISOString(),
      end: dayAfterTomorrow.toISOString(),
    })

    // Get all events for tomorrow
    const events = await listEvents(tomorrow, dayAfterTomorrow)

    console.log(`[Cron] Found ${events.length} events for tomorrow`)

    // Track results
    const results = {
      total: events.length,
      sent: 0,
      skipped: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each event
    for (const event of events) {
      try {
        // Parse event data
        const bookingData = parseEventDescription(event.description || '')
        const status = getStatusFromColorId(event.colorId)

        // Skip cancelled or no-show events
        if (status === 'CANCELLED' || status === 'NO_SHOW') {
          console.log(`[Cron] Skipping event ${event.id} - status: ${status}`)
          results.skipped++
          continue
        }

        // Skip if no email address
        if (!bookingData.email) {
          console.log(`[Cron] Skipping event ${event.id} - no email address`)
          results.skipped++
          continue
        }

        // Get service info
        const serviceName = parseServiceNameFromSummary(event.summary || '')
        const service = bookingData.serviceId
          ? getServiceById(bookingData.serviceId)
          : getServiceByName(serviceName)

        if (!service) {
          console.warn(`[Cron] Could not find service for event ${event.id}: ${serviceName}`)
        }

        // Prepare booking data for email
        const booking = {
          id: event.id,
          customerName: bookingData.name || event.summary.split(' - ')[1] || 'Vážený klient',
          customerEmail: bookingData.email,
          appointmentDate: new Date(event.start),
          appointmentTime: extractTimeFromDateTime(event.start),
          depositAmount: bookingData.depositAmount || service?.depositAmount || 0,
          status,
          service: {
            name: service?.name || serviceName || 'Služba',
            price: service?.price || 0,
            duration: service?.duration || 30,
          },
        }

        // Send reminder email
        console.log(`[Cron] Sending reminder to ${booking.customerEmail} for ${booking.appointmentTime}`)

        const result = await sendReminder(booking)

        if (result.success) {
          console.log(`[Cron] Successfully sent reminder to ${booking.customerEmail}`)
          results.sent++
        } else {
          console.error(`[Cron] Failed to send reminder to ${booking.customerEmail}:`, result.error)
          results.failed++
          results.errors.push(`${booking.customerEmail}: ${result.error}`)
        }
      } catch (eventError) {
        console.error(`[Cron] Error processing event ${event.id}:`, eventError)
        results.failed++
        results.errors.push(
          `Event ${event.id}: ${eventError instanceof Error ? eventError.message : 'Unknown error'}`
        )
      }
    }

    console.log('[Cron] Job completed:', results)

    // Return results
    return NextResponse.json({
      success: true,
      results: {
        total: results.total,
        sent: results.sent,
        skipped: results.skipped,
        failed: results.failed,
        ...(results.errors.length > 0 && { errors: results.errors }),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Cron] Job failed:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process reminders',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
