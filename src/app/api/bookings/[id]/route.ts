/**
 * Individual Booking API Route
 *
 * GET /api/bookings/[id] - Get booking details
 * PATCH /api/bookings/[id] - Update booking (admin - status change)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateBookingSchema, formatZodError } from '@/lib/validations'

// Force dynamic rendering for database operations
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/bookings/[id]
 *
 * Returns booking details including related service information.
 *
 * @param {string} id - Booking ID
 *
 * @returns {
 *   booking: Booking & { service: Service }
 * }
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            price: true,
            depositAmount: true,
            duration: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        {
          error: 'Booking not found',
          message: `Booking with ID ${id} does not exist`,
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        booking,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Error fetching booking:', error)

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
 * Updates booking details (primarily for admin status changes).
 *
 * @param {string} id - Booking ID
 * @body {UpdateBookingInput} - Fields to update
 *
 * @returns {
 *   booking: Booking
 * }
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

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    })

    if (!existingBooking) {
      return NextResponse.json(
        {
          error: 'Booking not found',
          message: `Booking with ID ${id} does not exist`,
        },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {}

    if (data.status !== undefined) {
      updateData.status = data.status

      // Set cancelledAt timestamp if status is CANCELLED
      if (data.status === 'CANCELLED') {
        updateData.cancelledAt = new Date()
      }
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes
    }

    if (data.paymentId !== undefined) {
      updateData.paymentId = data.paymentId
    }

    if (data.googleEventId !== undefined) {
      updateData.googleEventId = data.googleEventId
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            depositAmount: true,
            duration: true,
          },
        },
      },
    })

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
