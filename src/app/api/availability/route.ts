/**
 * Availability API Route
 *
 * GET /api/availability?date=YYYY-MM-DD - Get available time slots for a specific date
 *
 * Reads occupied slots directly from Google Calendar (single source of truth).
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots, isCalendarEnabled } from '@/lib/google-calendar'
import { availabilityQuerySchema, formatZodError } from '@/lib/validations'

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic'

/**
 * Business hours configuration
 */
const BUSINESS_HOURS = {
  start: '08:00',
  end: '18:00',
  slotDuration: 30, // minutes
  lunchBreak: {
    start: '12:00',
    end: '13:00',
  },
}

/**
 * Generate all possible time slots for a given date.
 * This is used as fallback when Google Calendar is not configured.
 */
function generateTimeSlots(): string[] {
  const slots: string[] = []
  const [startHour, startMin] = BUSINESS_HOURS.start.split(':').map(Number)
  const [endHour, endMin] = BUSINESS_HOURS.end.split(':').map(Number)
  const [lunchStartHour, lunchStartMin] = BUSINESS_HOURS.lunchBreak.start.split(':').map(Number)
  const [lunchEndHour, lunchEndMin] = BUSINESS_HOURS.lunchBreak.end.split(':').map(Number)

  let currentMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  const lunchStartMinutes = lunchStartHour * 60 + lunchStartMin
  const lunchEndMinutes = lunchEndHour * 60 + lunchEndMin

  while (currentMinutes < endMinutes) {
    // Skip lunch break
    if (currentMinutes >= lunchStartMinutes && currentMinutes < lunchEndMinutes) {
      currentMinutes = lunchEndMinutes
      continue
    }

    const hours = Math.floor(currentMinutes / 60)
    const minutes = currentMinutes % 60
    const timeSlot = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    slots.push(timeSlot)
    currentMinutes += BUSINESS_HOURS.slotDuration
  }

  return slots
}

/**
 * GET /api/availability
 *
 * Returns available time slots for a specific date.
 * Reads occupied slots from Google Calendar.
 *
 * @query {string} date - Date in YYYY-MM-DD format
 *
 * @returns {
 *   date: string
 *   slots: Array<{
 *     time: string
 *     available: boolean
 *   }>
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams
    const dateParam = searchParams.get('date')

    // Validate query parameters
    const validationResult = availabilityQuerySchema.safeParse({ date: dateParam })

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: formatZodError(validationResult.error),
        },
        { status: 400 }
      )
    }

    const { date } = validationResult.data

    // Check if the date is a weekend (Saturday or Sunday)
    const dateObj = new Date(date)
    const dayOfWeek = dateObj.getDay()

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json(
        {
          date,
          slots: [],
          message: 'Office is closed on weekends',
        },
        { status: 200 }
      )
    }

    // Check if date is in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const requestedDate = new Date(date)
    requestedDate.setHours(0, 0, 0, 0)

    if (requestedDate < today) {
      return NextResponse.json(
        {
          date,
          slots: [],
          message: 'Cannot book appointments in the past',
        },
        { status: 200 }
      )
    }

    // Get slots from Google Calendar
    if (isCalendarEnabled()) {
      const calendarSlots = await getAvailableSlots(dateObj)

      // Transform to API response format
      const slots = calendarSlots.map(slot => ({
        time: slot.start,
        available: slot.available,
      }))

      return NextResponse.json(
        {
          date,
          slots,
        },
        { status: 200 }
      )
    }

    // Fallback: Google Calendar not configured - return all slots as available
    console.warn('[API] Google Calendar not configured - returning all slots as available')
    const allSlots = generateTimeSlots()
    const slots = allSlots.map(time => ({
      time,
      available: true,
    }))

    return NextResponse.json(
      {
        date,
        slots,
        fallbackMode: true,
        warning: 'Google Calendar not configured - availability may not be accurate',
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('[API] Error fetching availability:', error)

    // Fallback: return all slots as available when error occurs
    const searchParams = request.nextUrl.searchParams
    const dateParam = searchParams.get('date')

    if (dateParam) {
      const dateObj = new Date(dateParam)
      const dayOfWeek = dateObj.getDay()

      // Weekend check
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return NextResponse.json(
          {
            date: dateParam,
            slots: [],
            message: 'Office is closed on weekends',
          },
          { status: 200 }
        )
      }

      // Return all slots as available
      const allSlots = generateTimeSlots()
      const slots = allSlots.map(time => ({
        time,
        available: true,
      }))

      return NextResponse.json(
        {
          date: dateParam,
          slots,
          fallbackMode: true,
          error: 'Could not verify calendar availability',
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch availability',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
