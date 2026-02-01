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
 * Fallback services for mock mode (must match services/route.ts)
 */
const FALLBACK_SERVICES: Record<
  string,
  { id: string; name: string; depositAmount: number; price: number; duration: number; active: boolean }
> = {
  'dentalni-hygiena': {
    id: 'dentalni-hygiena',
    name: 'Dentální hygiena',
    depositAmount: 40000,
    price: 150000,
    duration: 60,
    active: true,
  },
  'beleni-zubu': {
    id: 'beleni-zubu',
    name: 'Bělení zubů',
    depositAmount: 80000,
    price: 400000,
    duration: 90,
    active: true,
  },
  'preventivni-prohlidka': {
    id: 'preventivni-prohlidka',
    name: 'Preventivní prohlídka',
    depositAmount: 20000,
    price: 80000,
    duration: 30,
    active: true,
  },
  'lecba-zubniho-kazu': {
    id: 'lecba-zubniho-kazu',
    name: 'Léčba zubního kazu',
    depositAmount: 50000,
    price: 200000,
    duration: 45,
    active: true,
  },
  'extrakce-zubu': {
    id: 'extrakce-zubu',
    name: 'Extrakce zubu',
    depositAmount: 40000,
    price: 150000,
    duration: 30,
    active: true,
  },
}

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

    // Try to get service from database first, fall back to hardcoded
    let service: { id: string; name: string; depositAmount: number; price: number; duration: number; active: boolean } | null = null
    let useFallback = false

    try {
      const dbService = await prisma.service.findUnique({
        where: { id: data.serviceId },
        select: {
          id: true,
          name: true,
          depositAmount: true,
          price: true,
          duration: true,
          active: true,
        },
      })
      service = dbService
    } catch {
      // Database not available, use fallback
      useFallback = true
      service = FALLBACK_SERVICES[data.serviceId] || null
    }

    if (!service) {
      // Check fallback services if not found in database
      if (!useFallback && FALLBACK_SERVICES[data.serviceId]) {
        service = FALLBACK_SERVICES[data.serviceId]
        useFallback = true
      } else {
        return NextResponse.json(
          {
            error: 'Service not found',
            message: `Service with ID ${data.serviceId} does not exist`,
          },
          { status: 404 }
        )
      }
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

    // If using fallback mode (no database), return mock booking
    if (useFallback) {
      const mockBooking = {
        id: `mock-${Date.now()}`,
        serviceId: data.serviceId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        notes: data.notes || null,
        isFirstVisit: data.isFirstVisit,
        gdprConsent: data.gdprConsent,
        depositAmount: service.depositAmount,
        status: 'PENDING_PAYMENT',
        service: {
          name: service.name,
          price: service.price,
          duration: service.duration,
        },
        createdAt: new Date().toISOString(),
        fallbackMode: true,
      }

      const paymentUrl = `/payment/${mockBooking.id}`

      return NextResponse.json(
        {
          booking: mockBooking,
          paymentUrl,
          message: 'Mock booking created (database not available)',
        },
        { status: 201 }
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
