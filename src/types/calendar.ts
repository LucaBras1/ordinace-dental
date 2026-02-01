/**
 * Google Calendar Integration Types
 */

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

export interface BookingCalendarData {
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

export interface AvailableSlotsResponse {
  date: string
  duration: number
  totalSlots: number
  availableSlots: number
  slots: TimeSlot[]
}

export interface CalendarSetupResponse {
  message: string
  authorizationUrl?: string
  refreshToken?: string
  instructions?: string[]
  warning?: string
  configured?: boolean
  error?: string
}
