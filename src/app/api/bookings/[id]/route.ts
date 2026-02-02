/**
 * Individual Booking API Route
 *
 * GET /api/bookings/[id] - Get booking details from Google Calendar
 * PATCH /api/bookings/[id] - Update booking status in Google Calendar
 *
 * Booking ID = Google Calendar Event ID
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getCalendarEvent,
  updateCalendarEventStatus,
  deleteCalendarEvent,
  isCalendarEnabled,
} from '@/lib/google-calendar'
import { getServiceById } from '@/lib/services'
import { updateBookingSchema, formatZodError } from '@/lib/validations'

// Force dynamic rendering for API operations
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
    status: result['status'],
  }
}

/**
 * Parse service ID from event summary.
 */
function parseServiceIdFromSummary(summary: string): string {
  const serviceName = summary.split(' - ')[0]?.trim() || ''

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
 * GET /api/bookings/[id]
 *
 * Returns booking details from Google Calendar event.
 *
 * @param {string} id - Booking ID (= Google Calendar Event ID)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if Google Calendar is enabled
    if (!isCalendarEnabled()) {
      return NextResponse.json(
        {
          error: 'Calendar not configured',
          message: 'Google Calendar integration is not configured',
        },
        { status: 503 }
      )
    }

    // Get event from Google Calendar
    const event = await getCalendarEvent(id)

    if (!event) {
      return NextResponse.json(
        {
          error: 'Booking not found',
          message: `Booking with ID ${id} does not exist`,
        },
        { status: 404 }
      )
    }

    // Parse booking data from event
    const bookingData = parseEventDescription(event.description || '')
    const serviceId = parseServiceIdFromSummary(event.summary || '')
    const service = getServiceById(serviceId)

    // Construct booking object from event data
    const booking = {
      id: event.id,
      customerName: bookingData.name || event.summary.split(' - ')[1] || 'Neznámý',
      customerEmail: bookingData.email || '',
      customerPhone: bookingData.phone || '',
      appointmentDate: event.start?.split('T')[0] || '',
      appointmentTime: extractTimeFromDateTime(event.start || ''),
      notes: bookingData.notes || null,
      isFirstVisit: bookingData.isFirstVisit || false,
      depositAmount: bookingData.depositAmount || service?.depositAmount || 0,
      status: getStatusFromColorId(event.colorId),
      service: service ? {
        id: service.id,
        name: service.name,
        slug: service.slug,
        description: service.description,
        price: service.price,
        depositAmount: service.depositAmount,
        duration: service.duration,
      } : null,
      googleEventId: event.id,
    }

    return NextResponse.json(
      {
        booking,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Error fetching booking:', error)

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          error: 'Booking not found',
          message: 'Booking does not exist in calendar',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch booking',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/bookings/[id]
 *
 * Updates booking status in Google Calendar (primarily for admin status changes).
 *
 * @param {string} id - Booking ID (= Google Calendar Event ID)
 * @body {UpdateBookingInput} - Fields to update
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Parse request body
    const body = await request.json()

    // Validate input with Zod
    const validationResult = updateBookingSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: formatZodError(validationResult.error),
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if Google Calendar is enabled
    if (!isCalendarEnabled()) {
      return NextResponse.json(
        {
          error: 'Calendar not configured',
          message: 'Google Calendar integration is not configured',
        },
        { status: 503 }
      )
    }

    // Check if event exists
    let event
    try {
      event = await getCalendarEvent(id)
    } catch {
      return NextResponse.json(
        {
          error: 'Booking not found',
          message: `Booking with ID ${id} does not exist`,
        },
        { status: 404 }
      )
    }

    // Update status if provided
    if (data.status !== undefined) {
      await updateCalendarEventStatus(id, data.status)
    }

    // If status is CANCELLED, optionally delete the event
    if (data.status === 'CANCELLED') {
      // Keep the event with CANCELLED color instead of deleting
      // await deleteCalendarEvent(id)
    }

    // Get updated event
    const updatedEvent = await getCalendarEvent(id)
    const bookingData = parseEventDescription(updatedEvent.description || '')
    const serviceId = parseServiceIdFromSummary(updatedEvent.summary || '')
    const service = getServiceById(serviceId)

    const updatedBooking = {
      id: updatedEvent.id,
      customerName: bookingData.name || updatedEvent.summary.split(' - ')[1] || 'Neznámý',
      customerEmail: bookingData.email || '',
      customerPhone: bookingData.phone || '',
      appointmentDate: updatedEvent.start?.split('T')[0] || '',
      appointmentTime: extractTimeFromDateTime(updatedEvent.start || ''),
      notes: data.notes || bookingData.notes || null,
      status: data.status || getStatusFromColorId(updatedEvent.colorId),
      service: service ? {
        id: service.id,
        name: service.name,
        slug: service.slug,
        price: service.price,
        depositAmount: service.depositAmount,
        duration: service.duration,
      } : null,
    }

    return NextResponse.json(
      {
        booking: updatedBooking,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Error updating booking:', error)

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to update booking',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
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
