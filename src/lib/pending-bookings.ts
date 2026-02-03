/**
 * Pending Bookings Storage
 *
 * In-memory storage for booking data BEFORE payment is completed.
 * This is needed because we don't create Google Calendar events until
 * payment is successful (to integrate with SmartMEDIX).
 *
 * Flow:
 * 1. User submits booking form → data stored here with UUID
 * 2. User redirected to Comgate payment
 * 3. On successful payment → webhook retrieves data, creates GCal event
 * 4. On failed/cancelled payment → data is cleaned up, no event created
 *
 * Data has 30-minute TTL (payment must complete within this time).
 */

import crypto from 'crypto'

// ============================================
// TYPES
// ============================================

export interface PendingBookingData {
  // Service info
  serviceId: string
  serviceName: string
  duration: number
  price: number
  depositAmount: number

  // Customer info
  customerName: string
  customerEmail: string
  customerPhone: string

  // Appointment info
  appointmentDate: string // ISO date string
  appointmentTime: string // "HH:MM"

  // Additional info
  notes?: string
  isFirstVisit: boolean
  gdprConsent: boolean

  // Metadata
  createdAt: string // ISO datetime
}

interface PendingBookingEntry {
  data: PendingBookingData
  expires: number // Unix timestamp (ms)
}

// ============================================
// CONFIGURATION
// ============================================

/**
 * Time-to-live for pending bookings in milliseconds.
 * Payment must complete within this time, otherwise booking data is lost.
 */
const PENDING_BOOKING_TTL_MS = 30 * 60 * 1000 // 30 minutes

/**
 * Cleanup interval for expired entries.
 */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

// ============================================
// IN-MEMORY STORAGE
// ============================================

/**
 * In-memory map storing pending bookings.
 * Key: UUID, Value: { data, expires }
 *
 * Note: This is reset on server restart. For production with multiple
 * instances, consider using Redis or similar distributed cache.
 */
const pendingBookings = new Map<string, PendingBookingEntry>()

// ============================================
// PUBLIC API
// ============================================

/**
 * Stores pending booking data and returns a unique ID.
 *
 * @param data - Booking data to store
 * @returns UUID for retrieving the booking later
 *
 * @example
 * ```typescript
 * const pendingId = storePendingBooking({
 *   serviceId: 'dentalni-hygiena',
 *   serviceName: 'Dentální hygiena',
 *   customerName: 'Jan Novák',
 *   // ... other fields
 * })
 * // Use pendingId as refId for Comgate payment
 * ```
 */
export function storePendingBooking(data: PendingBookingData): string {
  const id = crypto.randomUUID()
  const expires = Date.now() + PENDING_BOOKING_TTL_MS

  pendingBookings.set(id, { data, expires })

  console.log('[PendingBookings] Stored pending booking:', {
    id,
    serviceName: data.serviceName,
    customerName: data.customerName,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    expiresIn: `${PENDING_BOOKING_TTL_MS / 60000} minutes`,
  })

  return id
}

/**
 * Retrieves pending booking data by ID.
 *
 * @param id - UUID of the pending booking
 * @returns Booking data if found and not expired, null otherwise
 *
 * @example
 * ```typescript
 * const bookingData = getPendingBooking(refId)
 * if (!bookingData) {
 *   return error('Booking expired or not found')
 * }
 * // Create GCal event with bookingData
 * ```
 */
export function getPendingBooking(id: string): PendingBookingData | null {
  const entry = pendingBookings.get(id)

  if (!entry) {
    console.log('[PendingBookings] Pending booking not found:', id)
    return null
  }

  if (entry.expires < Date.now()) {
    console.log('[PendingBookings] Pending booking expired:', id)
    pendingBookings.delete(id)
    return null
  }

  console.log('[PendingBookings] Retrieved pending booking:', {
    id,
    serviceName: entry.data.serviceName,
    customerName: entry.data.customerName,
  })

  return entry.data
}

/**
 * Deletes a pending booking by ID.
 * Call this after successfully creating the GCal event or when payment fails.
 *
 * @param id - UUID of the pending booking to delete
 */
export function deletePendingBooking(id: string): void {
  const existed = pendingBookings.delete(id)

  if (existed) {
    console.log('[PendingBookings] Deleted pending booking:', id)
  }
}

/**
 * Gets the count of currently pending bookings (for monitoring).
 *
 * @returns Number of pending bookings in storage
 */
export function getPendingBookingsCount(): number {
  return pendingBookings.size
}

// ============================================
// CLEANUP
// ============================================

/**
 * Cleans up expired pending bookings.
 * Called automatically by interval, but can also be called manually.
 */
export function cleanupExpiredBookings(): number {
  const now = Date.now()
  let cleaned = 0
  const idsToDelete: string[] = []

  pendingBookings.forEach((entry, id) => {
    if (entry.expires < now) {
      idsToDelete.push(id)
    }
  })

  idsToDelete.forEach((id) => {
    pendingBookings.delete(id)
    cleaned++
    console.log('[PendingBookings] Cleaned up expired booking:', id)
  })

  if (cleaned > 0) {
    console.log('[PendingBookings] Cleanup completed:', {
      cleaned,
      remaining: pendingBookings.size,
    })
  }

  return cleaned
}

// Start periodic cleanup (only in non-test environment)
if (typeof setInterval !== 'undefined' && process.env.NODE_ENV !== 'test') {
  setInterval(() => {
    cleanupExpiredBookings()
  }, CLEANUP_INTERVAL_MS)
}
