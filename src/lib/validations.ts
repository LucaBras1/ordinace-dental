/**
 * Zod Validation Schemas for Booking System
 *
 * Provides type-safe validation for all API inputs.
 */

import { z } from 'zod'

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Phone validation - Czech phone format
 * Supports: +420123456789, 123456789, 123 456 789, +420 123 456 789
 */
const PHONE_REGEX = /^(\+420\s?)?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/

/**
 * Time validation - HH:MM format (24-hour)
 */
const TIME_REGEX = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/

/**
 * Create Booking Schema
 *
 * Used for POST /api/bookings
 */
export const createBookingSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),

  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),

  customerEmail: z
    .string()
    .min(1, 'Email is required')
    .regex(EMAIL_REGEX, 'Invalid email format')
    .toLowerCase()
    .trim(),

  customerPhone: z
    .string()
    .min(1, 'Phone is required')
    .regex(PHONE_REGEX, 'Invalid phone format. Use format: +420 123 456 789 or 123456789')
    .trim(),

  appointmentDate: z
    .string()
    .min(1, 'Appointment date is required')
    .refine(
      (dateStr) => {
        const date = new Date(dateStr)
        return !isNaN(date.getTime()) && date >= new Date(new Date().setHours(0, 0, 0, 0))
      },
      { message: 'Appointment date must be today or in the future' }
    ),

  appointmentTime: z
    .string()
    .min(1, 'Appointment time is required')
    .regex(TIME_REGEX, 'Invalid time format. Use HH:MM (24-hour format)'),

  notes: z.string().max(1000, 'Notes must not exceed 1000 characters').optional(),

  isFirstVisit: z.boolean().default(true),

  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'GDPR consent is required',
  }),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>

/**
 * Update Booking Schema
 *
 * Used for PATCH /api/bookings/[id]
 */
export const updateBookingSchema = z.object({
  status: z.enum(['PENDING_PAYMENT', 'PAID', 'COMPLETED', 'NO_SHOW', 'CANCELLED', 'REFUNDED']).optional(),

  notes: z.string().max(1000, 'Notes must not exceed 1000 characters').optional(),

  paymentId: z.string().optional(),

  googleEventId: z.string().optional(),
})

export type UpdateBookingInput = z.infer<typeof updateBookingSchema>

/**
 * Availability Query Schema
 *
 * Used for GET /api/availability
 */
export const availabilityQuerySchema = z.object({
  date: z
    .string()
    .min(1, 'Date is required')
    .refine(
      (dateStr) => {
        const date = new Date(dateStr)
        return !isNaN(date.getTime())
      },
      { message: 'Invalid date format. Use YYYY-MM-DD' }
    ),
})

export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>

/**
 * Helper function to format Zod errors for API responses
 */
export function formatZodError(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.')
    if (!formatted[path]) {
      formatted[path] = []
    }
    formatted[path].push(issue.message)
  }

  return formatted
}
