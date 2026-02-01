/**
 * Booking types - shared between frontend and backend
 */

/**
 * Service from database/API
 */
export interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  price: number // Cena v haléřích (100 = 1 Kč)
  depositAmount: number // Výše zálohy v haléřích
  duration: number // Doba trvání v minutách
}

/**
 * Time slot for availability
 */
export interface TimeSlot {
  time: string // HH:MM formát (např. "09:00")
  available: boolean
}

/**
 * Availability response from API
 */
export interface AvailabilityResponse {
  date: string // YYYY-MM-DD
  slots: TimeSlot[]
}

/**
 * Booking form data sent to API
 */
export interface BookingFormData {
  serviceId: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  name: string
  phone: string // +420 format
  email: string
  note: string
  gdprConsent: boolean
}

/**
 * Booking response from API after creation
 */
export interface BookingResponse {
  id: string
  paymentUrl: string // URL platební brány
}

/**
 * Booking status
 */
export enum BookingStatus {
  PENDING = 'PENDING', // Čeká na platbu zálohy
  CONFIRMED = 'CONFIRMED', // Záloha zaplacena
  CANCELLED = 'CANCELLED', // Zrušeno
  COMPLETED = 'COMPLETED', // Dokončeno
}

/**
 * Full booking object (for admin/database)
 */
export interface Booking extends BookingFormData {
  id: string
  status: BookingStatus
  depositPaid: boolean
  depositPaidAt: Date | null
  totalPrice: number // haléře
  depositAmount: number // haléře
  createdAt: Date
  updatedAt: Date
}

/**
 * Payment status from payment gateway
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Payment webhook data
 */
export interface PaymentWebhook {
  bookingId: string
  paymentId: string
  status: PaymentStatus
  amount: number // haléře
  paidAt?: Date
}
