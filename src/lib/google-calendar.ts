/**
 * Google Calendar Integration
 *
 * Provides functionality to sync booking appointments with Google Calendar.
 *
 * Features:
 * - Create calendar events for confirmed bookings
 * - Delete events when bookings are cancelled
 * - Check available time slots
 * - List events in date range
 *
 * OAuth2 Setup Required:
 * 1. Create project in Google Cloud Console
 * 2. Enable Google Calendar API
 * 3. Create OAuth2 credentials (Client ID + Secret)
 * 4. Get refresh token using OAuth2 flow
 * 5. Set environment variables (see .env.example)
 */

import { google, calendar_v3 } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

// ============================================
// TYPES
// ============================================

export interface TimeSlot {
  start: string // "09:00"
  end: string   // "09:30"
  available: boolean
}

export interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: string // ISO datetime
  end: string   // ISO datetime
  colorId?: string
}

export interface BookingData {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  appointmentDate: Date
  appointmentTime: string
  duration: number // minutes
  serviceName: string
  notes?: string
  isFirstVisit: boolean
  status: string
}

// ============================================
// CONFIGURATION
// ============================================

// Office hours configuration
const OFFICE_HOURS = {
  start: '08:00',
  end: '18:00',
  lunchStart: '12:00',
  lunchEnd: '13:00',
  workDays: [1, 2, 3, 4, 5], // Monday to Friday (0 = Sunday, 6 = Saturday)
}

// Default slot duration (can be overridden by service)
const DEFAULT_SLOT_DURATION = 30 // minutes

// Google Calendar color IDs
const CALENDAR_COLORS = {
  PAID: '10',      // Green - confirmed booking
  PENDING: '6',    // Orange - pending payment
  NO_SHOW: '8',    // Gray - patient didn't show up
  CANCELLED: '11', // Red - cancelled
}

// ============================================
// OAUTH2 CLIENT SETUP
// ============================================

/**
 * Creates and configures OAuth2 client for Google Calendar API.
 *
 * Build-time guard: Returns null if credentials are missing (prevents build failure).
 * Runtime: Throws error if credentials are missing.
 */
function createOAuthClient(): OAuth2Client | null {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  // Build-time guard - allow build without credentials
  if (!clientId || !clientSecret || !refreshToken) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[Google Calendar] Missing OAuth2 credentials')
    } else {
      console.warn('[Google Calendar] OAuth2 credentials not set - calendar integration disabled')
    }
    return null
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
  )

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  })

  return oauth2Client
}

// ============================================
// CALENDAR CLIENT
// ============================================

let _calendarClient: calendar_v3.Calendar | null = null

/**
 * Gets or creates Google Calendar client instance.
 *
 * @throws {Error} If OAuth2 credentials are not configured
 */
function getCalendarClient(): calendar_v3.Calendar {
  if (_calendarClient) {
    return _calendarClient
  }

  const auth = createOAuthClient()
  if (!auth) {
    throw new Error('Google Calendar OAuth2 credentials are not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN environment variables.')
  }

  _calendarClient = google.calendar({ version: 'v3', auth })
  return _calendarClient
}

/**
 * Gets the configured Google Calendar ID.
 *
 * @throws {Error} If GOOGLE_CALENDAR_ID is not set
 */
function getCalendarId(): string {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) {
    throw new Error('GOOGLE_CALENDAR_ID environment variable is not set')
  }
  return calendarId
}

/**
 * Checks if Google Calendar integration is enabled.
 *
 * @returns {boolean} True if all required credentials are configured
 */
export function isCalendarEnabled(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN &&
    process.env.GOOGLE_CALENDAR_ID
  )
}

// ============================================
// TIME SLOT UTILITIES
// ============================================

/**
 * Parses time string to minutes since midnight.
 *
 * @param time - Time in "HH:MM" format
 * @returns Minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Formats minutes since midnight to time string.
 *
 * @param minutes - Minutes since midnight
 * @returns Time in "HH:MM" format
 */
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/**
 * Combines date and time into ISO datetime string.
 *
 * @param date - Date object
 * @param time - Time in "HH:MM" format
 * @returns ISO datetime string
 */
function combineDateAndTime(date: Date, time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const combined = new Date(date)
  combined.setHours(hours, minutes, 0, 0)
  return combined.toISOString()
}

/**
 * Checks if a date is a working day.
 *
 * @param date - Date to check
 * @returns True if date is a working day
 */
function isWorkingDay(date: Date): boolean {
  const dayOfWeek = date.getDay()
  return OFFICE_HOURS.workDays.includes(dayOfWeek)
}

// ============================================
// CALENDAR OPERATIONS
// ============================================

/**
 * Creates a Google Calendar event for a booking.
 *
 * @param booking - Booking data to create event from
 * @returns Google Calendar event ID
 * @throws {Error} If calendar API call fails
 */
export async function createCalendarEvent(booking: BookingData): Promise<string> {
  try {
    const calendar = getCalendarClient()
    const calendarId = getCalendarId()

    // Build event summary
    const summary = `${booking.serviceName} - ${booking.customerName}`

    // Build event description
    const description = [
      `Kontakt: ${booking.customerPhone}`,
      `Email: ${booking.customerEmail}`,
      `První návštěva: ${booking.isFirstVisit ? 'Ano' : 'Ne'}`,
      booking.notes ? `Poznámka: ${booking.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    // Calculate event times
    const startDateTime = combineDateAndTime(booking.appointmentDate, booking.appointmentTime)
    const endTime = new Date(startDateTime)
    endTime.setMinutes(endTime.getMinutes() + booking.duration)

    // Determine color based on status
    const colorId = CALENDAR_COLORS[booking.status as keyof typeof CALENDAR_COLORS] || CALENDAR_COLORS.PENDING

    // Create event
    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: 'Europe/Prague',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Europe/Prague',
      },
      colorId,
      attendees: [
        { email: booking.customerEmail },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 },       // 1 hour before
        ],
      },
    }

    console.log('[Google Calendar] Creating event:', {
      bookingId: booking.id,
      summary,
      start: startDateTime,
    })

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: 'all', // Send email notifications to attendees
    })

    const eventId = response.data.id
    if (!eventId) {
      throw new Error('Failed to create calendar event - no event ID returned')
    }

    console.log('[Google Calendar] Event created:', eventId)
    return eventId

  } catch (error) {
    console.error('[Google Calendar] Error creating event:', error)
    throw new Error(`Failed to create Google Calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Deletes a Google Calendar event.
 *
 * @param eventId - Google Calendar event ID to delete
 * @throws {Error} If calendar API call fails
 */
export async function deleteCalendarEvent(eventId: string): Promise<void> {
  try {
    const calendar = getCalendarClient()
    const calendarId = getCalendarId()

    console.log('[Google Calendar] Deleting event:', eventId)

    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: 'all', // Notify attendees about cancellation
    })

    console.log('[Google Calendar] Event deleted:', eventId)

  } catch (error) {
    console.error('[Google Calendar] Error deleting event:', error)
    throw new Error(`Failed to delete Google Calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Updates a Google Calendar event's color (e.g., when booking status changes).
 *
 * @param eventId - Google Calendar event ID
 * @param status - New booking status
 * @throws {Error} If calendar API call fails
 */
export async function updateCalendarEventStatus(eventId: string, status: string): Promise<void> {
  try {
    const calendar = getCalendarClient()
    const calendarId = getCalendarId()

    const colorId = CALENDAR_COLORS[status as keyof typeof CALENDAR_COLORS] || CALENDAR_COLORS.PENDING

    console.log('[Google Calendar] Updating event status:', { eventId, status, colorId })

    await calendar.events.patch({
      calendarId,
      eventId,
      requestBody: {
        colorId,
      },
      sendUpdates: 'none', // Don't notify on color change
    })

    console.log('[Google Calendar] Event status updated:', eventId)

  } catch (error) {
    console.error('[Google Calendar] Error updating event status:', error)
    throw new Error(`Failed to update Google Calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Lists events in a date range.
 *
 * @param startDate - Start of date range
 * @param endDate - End of date range
 * @returns Array of calendar events
 */
export async function listEvents(
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  try {
    const calendar = getCalendarClient()
    const calendarId = getCalendarId()

    console.log('[Google Calendar] Listing events:', {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    })

    const response = await calendar.events.list({
      calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = response.data.items || []

    return events.map((event) => ({
      id: event.id || '',
      summary: event.summary || '',
      description: event.description ?? undefined,
      start: event.start?.dateTime || event.start?.date || '',
      end: event.end?.dateTime || event.end?.date || '',
      colorId: event.colorId ?? undefined,
    }))

  } catch (error) {
    console.error('[Google Calendar] Error listing events:', error)
    throw new Error(`Failed to list Google Calendar events: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Gets available time slots for a specific date.
 *
 * @param date - Date to check availability
 * @param slotDuration - Duration of each slot in minutes (default: 30)
 * @returns Array of time slots with availability status
 */
export async function getAvailableSlots(
  date: Date,
  slotDuration: number = DEFAULT_SLOT_DURATION
): Promise<TimeSlot[]> {
  try {
    // Check if date is a working day
    if (!isWorkingDay(date)) {
      console.log('[Google Calendar] Not a working day:', date.toDateString())
      return []
    }

    // Get events for the day
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const events = await listEvents(startOfDay, endOfDay)

    // Generate all possible slots
    const slots: TimeSlot[] = []
    const officeStart = timeToMinutes(OFFICE_HOURS.start)
    const officeEnd = timeToMinutes(OFFICE_HOURS.end)
    const lunchStart = timeToMinutes(OFFICE_HOURS.lunchStart)
    const lunchEnd = timeToMinutes(OFFICE_HOURS.lunchEnd)

    for (let minutes = officeStart; minutes < officeEnd; minutes += slotDuration) {
      const slotStart = minutes
      const slotEnd = minutes + slotDuration

      // Skip lunch break
      if (slotStart >= lunchStart && slotStart < lunchEnd) {
        continue
      }

      const slot: TimeSlot = {
        start: minutesToTime(slotStart),
        end: minutesToTime(slotEnd),
        available: true,
      }

      // Check if slot conflicts with existing events
      for (const event of events) {
        const eventStart = new Date(event.start)
        const eventEnd = new Date(event.end)
        const eventStartMinutes = eventStart.getHours() * 60 + eventStart.getMinutes()
        const eventEndMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes()

        // Check for overlap
        if (slotStart < eventEndMinutes && slotEnd > eventStartMinutes) {
          slot.available = false
          break
        }
      }

      slots.push(slot)
    }

    console.log('[Google Calendar] Available slots for', date.toDateString(), ':', slots.filter(s => s.available).length)
    return slots

  } catch (error) {
    console.error('[Google Calendar] Error getting available slots:', error)
    // Return empty array on error (non-blocking)
    return []
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generates OAuth2 authorization URL for obtaining refresh token.
 * Use this during initial setup to get user consent and refresh token.
 *
 * @returns Authorization URL for user to visit
 */
export function getAuthorizationUrl(): string {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
  )

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent', // Force consent screen to get refresh token
  })

  return url
}

/**
 * Exchanges authorization code for refresh token.
 * Use this in the OAuth2 callback to get the refresh token.
 *
 * @param code - Authorization code from OAuth2 callback
 * @returns Refresh token to store in environment variables
 */
export async function getRefreshToken(code: string): Promise<string> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
  )

  const { tokens } = await oauth2Client.getToken(code)

  if (!tokens.refresh_token) {
    throw new Error('No refresh token received. Make sure to use access_type=offline and prompt=consent.')
  }

  return tokens.refresh_token
}
