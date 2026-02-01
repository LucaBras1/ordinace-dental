/**
 * Bookings API Route
 *
 * POST /api/bookings - Create a new booking with PENDING_PAYMENT status
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createBookingSchema, formatZodError } from '@/lib/validations'

// Force dynamic rendering for database operations
export const dynamic = 'force-dynamic'

/**
 * POST /api/bookings
 *
 * Creates a new booking with PENDING_PAYMENT status.
 * Returns booking details and payment URL for Comgate.
 *
 * @body {CreateBookingInput} - Validated booking data
 *
 * @returns {
 *   booking: Booking
 *   paymentUrl: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate input with Zod
    const validationResult = createBookingSchema.safeParse(body)

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

    // Verify service exists and is active
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      select: {
        id: true,
        name: true,
        depositAmount: true,
        active: true,
      },
    })

    if (!service) {
      return NextResponse.json(
        {
          error: 'Service not found',
          message: `Service with ID ${data.serviceId} does not exist`,
        },
        { status: 404 }
      )
    }

    if (!service.active) {
      return NextResponse.json(
        {
          error: 'Service unavailable',
          message: `Service ${service.name} is currently unavailable`,
        },
        { status: 400 }
      )
    }

    // Check for duplicate booking (same email, date, time)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        customerEmail: data.customerEmail,
        appointmentDate: new Date(data.appointmentDate),
        appointmentTime: data.appointmentTime,
        status: {
          in: ['PENDING_PAYMENT', 'PAID'],
        },
      },
    })

    if (existingBooking) {
      return NextResponse.json(
        {
          error: 'Duplicate booking',
          message: 'You already have a booking for this date and time',
        },
        { status: 409 }
      )
    }

    // Create booking with PENDING_PAYMENT status
    const booking = await prisma.booking.create({
      data: {
        serviceId: data.serviceId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        appointmentDate: new Date(data.appointmentDate),
        appointmentTime: data.appointmentTime,
        notes: data.notes || null,
        isFirstVisit: data.isFirstVisit,
        gdprConsent: data.gdprConsent,
        depositAmount: service.depositAmount,
        status: 'PENDING_PAYMENT',
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
            duration: true,
          },
        },
      },
    })

    // TODO: Generate Comgate payment URL
    // For now, return a placeholder URL
    const paymentUrl = `/payment/${booking.id}`

    return NextResponse.json(
      {
        booking,
        paymentUrl,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API] Error creating booking:', error)

    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('Prisma')) {
      return NextResponse.json(
        {
          error: 'Database error',
          message: 'Failed to create booking. Please try again.',
        },
        { status: 500 }
      )
    }

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
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
