/**
 * Bookings API Route
 *
 * POST /api/bookings - Create a new pending booking
 *
 * IMPORTANT: This endpoint does NOT create a Google Calendar event!
 * The GCal event is created ONLY after successful payment (in webhook).
 *
 * This approach enables integration with SmartMEDIX:
 * - SmartMEDIX is the primary source of truth
 * - Web reservations appear in calendar only after payment
 * - No "ghost" events from abandoned payments
 *
 * Flow:
 * 1. Validate booking data
 * 2. Store in pending bookings (in-memory, 30min TTL)
 * 3. Return payment URL with pending booking ID
 * 4. Comgate webhook creates GCal event after successful payment
 */

import { NextRequest, NextResponse } from 'next/server'
import { createBookingSchema, formatZodError } from '@/lib/validations'
import { getServiceById } from '@/lib/services'
import { storePendingBooking, PendingBookingData } from '@/lib/pending-bookings'

// Force dynamic rendering for API operations
export const dynamic = 'force-dynamic'

/**
 * POST /api/bookings
 *
 * Creates a new pending booking and returns payment URL.
 * The Google Calendar event is created ONLY after successful payment.
 *
 * @body {CreateBookingInput} - Validated booking data
 *
 * @returns {
 *   pendingBookingId: string (UUID for payment reference)
 *   booking: {
 *     serviceId: string
 *     serviceName: string
 *     customerName: string
 *     customerEmail: string
 *     appointmentDate: string
 *     appointmentTime: string
 *     depositAmount: number
 *     status: 'PENDING_PAYMENT'
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

    // Prepare pending booking data
    const pendingData: PendingBookingData = {
      serviceId: data.serviceId,
      serviceName: service.name,
      duration: service.duration,
      price: service.price,
      depositAmount: service.depositAmount,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      notes: data.notes,
      isFirstVisit: data.isFirstVisit,
      gdprConsent: data.gdprConsent,
      createdAt: new Date().toISOString(),
    }

    // Store pending booking (NOT in Google Calendar yet!)
    const pendingBookingId = storePendingBooking(pendingData)

    console.log('[API] Created pending booking:', {
      pendingBookingId,
      serviceName: service.name,
      customerName: data.customerName,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
    })

    // Booking object for response (without ID - it doesn't exist in GCal yet)
    const booking = {
      pendingId: pendingBookingId,
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

    // Payment URL with pending booking ID (NOT GCal event ID)
    const paymentUrl = `/api/payments/create?pendingBookingId=${pendingBookingId}`

    // NOTE: Confirmation email is sent from webhook AFTER successful payment
    // This ensures we don't send emails for abandoned payments

    return NextResponse.json(
      {
        pendingBookingId,
        booking,
        paymentUrl,
        message: 'Booking created. Please complete payment to confirm your appointment.',
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

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
