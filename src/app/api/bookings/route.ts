/**
 * Bookings API Route
 *
 * POST /api/bookings - Create a new booking as Google Calendar event
 *
 * Google Calendar is the single source of truth for all bookings.
 * Booking ID = Google Calendar Event ID.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createBookingSchema, formatZodError } from '@/lib/validations'
import { getServiceById } from '@/lib/services'
import { createCalendarEvent, isCalendarEnabled } from '@/lib/google-calendar'
import { sendBookingConfirmation } from '@/lib/email'

// Force dynamic rendering for API operations
export const dynamic = 'force-dynamic'

/**
 * POST /api/bookings
 *
 * Creates a new booking as a Google Calendar event with PENDING status.
 * Returns booking details and payment URL for Comgate.
 *
 * @body {CreateBookingInput} - Validated booking data
 *
 * @returns {
 *   booking: {
 *     id: string (Google Calendar Event ID)
 *     serviceId: string
 *     serviceName: string
 *     customerName: string
 *     customerEmail: string
 *     appointmentDate: string
 *     appointmentTime: string
 *     depositAmount: number
 *     status: string
 *   }
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

    // Get service from hardcoded services
    const service = getServiceById(data.serviceId)

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

    // Check if Google Calendar is enabled
    if (!isCalendarEnabled()) {
      console.warn('[API] Google Calendar not configured - creating mock booking')

      // Fallback: Create mock booking when calendar is not configured
      const mockBookingId = `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`

      const mockBooking = {
        id: mockBookingId,
        serviceId: data.serviceId,
        serviceName: service.name,
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
        duration: service.duration,
        price: service.price,
        createdAt: new Date().toISOString(),
        fallbackMode: true,
      }

      // Payment URL will redirect to Comgate
      const paymentUrl = `/api/payments/create?bookingId=${mockBookingId}`

      return NextResponse.json(
        {
          booking: mockBooking,
          paymentUrl,
          warning: 'Google Calendar not configured - booking may not be synced',
        },
        { status: 201 }
      )
    }

    // Create Google Calendar event (status = PENDING)
    console.log('[API] Creating Google Calendar event for booking')

    const eventId = await createCalendarEvent({
      id: `pending-${Date.now()}`, // Temporary ID, will be replaced by event ID
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      appointmentDate: new Date(data.appointmentDate),
      appointmentTime: data.appointmentTime,
      duration: service.duration,
      serviceName: service.name,
      notes: data.notes,
      isFirstVisit: data.isFirstVisit,
      status: 'PENDING', // Orange color in calendar
      depositAmount: service.depositAmount,
      serviceId: service.id,
    })

    console.log('[API] Google Calendar event created:', eventId)

    // Booking object with event ID as booking ID
    const booking = {
      id: eventId, // Google Calendar Event ID = Booking ID
      serviceId: data.serviceId,
      serviceName: service.name,
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
      duration: service.duration,
      price: service.price,
      createdAt: new Date().toISOString(),
    }

    // Payment URL will redirect to Comgate with booking/event ID
    const paymentUrl = `/api/payments/create?bookingId=${eventId}`

    // Send booking confirmation email with payment link
    try {
      await sendBookingConfirmation(
        {
          id: booking.id,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          appointmentDate: new Date(booking.appointmentDate),
          appointmentTime: booking.appointmentTime,
          depositAmount: booking.depositAmount,
          status: booking.status,
          service: {
            name: service.name,
            price: service.price,
            duration: service.duration,
          },
        },
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${paymentUrl}`
      )
      console.log('[API] Booking confirmation email sent')
    } catch (emailError) {
      console.error('[API] Failed to send booking confirmation email:', emailError)
      // Don't fail the booking if email fails
    }

    return NextResponse.json(
      {
        booking,
        paymentUrl,
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('[API] Error creating booking:', error)

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      )
    }

    // Google Calendar API errors
    if (error instanceof Error && error.message.includes('Calendar')) {
      return NextResponse.json(
        {
          error: 'Calendar error',
          message: 'Failed to create calendar event. Please try again.',
        },
        { status: 500 }
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
