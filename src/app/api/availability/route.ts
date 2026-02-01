/**
 * Availability API Route
 *
 * GET /api/availability?date=YYYY-MM-DD - Get available time slots for a specific date
 */

import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { availabilityQuerySchema, formatZodError } from '@/lib/validations'

/**
 * Business hours configuration
 * TODO: Move to environment variables or database configuration
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
 * Generate time slots for a given date
 */
function generateTimeSlots(date: string): string[] {
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
 * Slots are marked as unavailable if they have existing bookings.
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

    // Generate all possible time slots
    const allSlots = generateTimeSlots(date)

    // Fetch existing bookings for this date
    const existingBookings = await prisma.booking.findMany({
      where: {
        appointmentDate: new Date(date),
        status: {
          in: ['PENDING_PAYMENT', 'PAID'],
        },
      },
      select: {
        appointmentTime: true,
      },
    })

    // Create a set of booked times for efficient lookup
    const bookedTimes = new Set(existingBookings.map((b) => b.appointmentTime))

    // Map slots with availability
    const slots = allSlots.map((time) => ({
      time,
      available: !bookedTimes.has(time),
    }))

    return NextResponse.json(
      {
        date,
        slots,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Error fetching availability:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch availability',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
