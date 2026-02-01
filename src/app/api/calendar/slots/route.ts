/**
 * Calendar Availability API
 *
 * Provides endpoints to check available time slots for booking appointments.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots, isCalendarEnabled } from '@/lib/google-calendar'

// ============================================
// GET /api/calendar/slots?date=YYYY-MM-DD&duration=30
// ============================================

/**
 * Returns available time slots for a specific date.
 *
 * Query params:
 * - date: Date in YYYY-MM-DD format (required)
 * - duration: Slot duration in minutes (optional, default: 30)
 */
export async function GET(request: NextRequest) {
  try {
    // Check if calendar integration is enabled
    if (!isCalendarEnabled()) {
      return NextResponse.json(
        {
          error: 'Google Calendar integration is not configured',
          message: 'Please configure Google Calendar credentials to use this feature',
        },
        { status: 503 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const dateParam = searchParams.get('date')
    const durationParam = searchParams.get('duration')

    // Validate date parameter
    if (!dateParam) {
      return NextResponse.json(
        {
          error: 'Missing date parameter',
          message: 'Please provide date in YYYY-MM-DD format',
        },
        { status: 400 }
      )
    }

    // Parse date
    const date = new Date(dateParam)
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        {
          error: 'Invalid date format',
          message: 'Date must be in YYYY-MM-DD format',
        },
        { status: 400 }
      )
    }

    // Parse duration (optional)
    const duration = durationParam ? parseInt(durationParam, 10) : 30
    if (isNaN(duration) || duration <= 0) {
      return NextResponse.json(
        {
          error: 'Invalid duration',
          message: 'Duration must be a positive number in minutes',
        },
        { status: 400 }
      )
    }

    // Get available slots
    const slots = await getAvailableSlots(date, duration)

    return NextResponse.json({
      date: dateParam,
      duration,
      totalSlots: slots.length,
      availableSlots: slots.filter(s => s.available).length,
      slots,
    })

  } catch (error) {
    console.error('[Calendar Slots API] Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to get available slots',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
