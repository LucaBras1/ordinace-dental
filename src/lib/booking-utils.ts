/**
 * Booking utility functions
 */

/**
 * Format price from halers to CZK string
 * @param priceInHalers - Price in halers (100 = 1 CZK)
 * @returns Formatted price string (e.g., "1 500 Kč")
 */
export function formatPrice(priceInHalers: number): string {
  const priceInCzk = priceInHalers / 100
  return `${priceInCzk.toLocaleString('cs-CZ')} Kč`
}

/**
 * Format date to Czech locale string
 * @param date - Date object
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  return date.toLocaleDateString('cs-CZ', options)
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 * @param date - Date object
 * @returns ISO date string
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Validate phone number (Czech +420 format)
 * @param phone - Phone number string
 * @returns True if valid, false otherwise
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+420\s?\d{3}\s?\d{3}\s?\d{3}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Validate email format
 * @param email - Email string
 * @returns True if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Format phone number to display format
 * @param phone - Phone number string
 * @returns Formatted phone (e.g., "+420 123 456 789")
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '')
  if (cleaned.startsWith('+420')) {
    const number = cleaned.substring(4)
    return `+420 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`
  }
  return phone
}

/**
 * Check if date is a weekend
 * @param date - Date object
 * @returns True if weekend, false otherwise
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

/**
 * Check if date is in the past
 * @param date - Date object
 * @returns True if in the past, false otherwise
 */
export function isPastDate(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

/**
 * Get Czech day name
 * @param date - Date object
 * @returns Day name in Czech (e.g., "pondělí")
 */
export function getCzechDayName(date: Date): string {
  return date.toLocaleDateString('cs-CZ', { weekday: 'long' })
}

/**
 * Generate time slots for a day
 * @param startHour - Start hour (24h format)
 * @param endHour - End hour (24h format)
 * @param slotDuration - Duration in minutes
 * @returns Array of time strings (HH:MM)
 */
export function generateTimeSlots(
  startHour: number = 8,
  endHour: number = 17,
  slotDuration: number = 30
): string[] {
  const slots: string[] = []

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push(timeString)
    }
  }

  return slots
}

/**
 * Calculate end time for a booking
 * @param startTime - Start time (HH:MM)
 * @param duration - Duration in minutes
 * @returns End time (HH:MM)
 */
export function calculateEndTime(startTime: string, duration: number): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + duration
  const endHours = Math.floor(totalMinutes / 60) % 24
  const endMinutes = totalMinutes % 60

  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
}

/**
 * Format time range
 * @param startTime - Start time (HH:MM)
 * @param endTime - End time (HH:MM)
 * @returns Formatted time range (e.g., "09:00 - 10:30")
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime} - ${endTime}`
}

/**
 * Get booking status label in Czech
 * @param status - Booking status enum value
 * @returns Czech label
 */
export function getBookingStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Čeká na platbu',
    CONFIRMED: 'Potvrzeno',
    CANCELLED: 'Zrušeno',
    COMPLETED: 'Dokončeno',
  }

  return labels[status] || status
}

/**
 * Get booking status color class
 * @param status - Booking status enum value
 * @returns Tailwind color class
 */
export function getBookingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
  }

  return colors[status] || 'bg-gray-100 text-gray-800'
}
