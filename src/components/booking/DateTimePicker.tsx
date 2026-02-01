'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface TimeSlot {
  time: string
  available: boolean
}

interface DateTimePickerProps {
  selectedDate: Date | null
  selectedTime: string | null
  onDateChange: (date: Date) => void
  onTimeChange: (time: string) => void
  availableSlots?: Record<string, TimeSlot[]>
  className?: string
}

const DAYS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
const MONTHS = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
]

// Default time slots for demonstration
const DEFAULT_SLOTS: TimeSlot[] = [
  { time: '08:00', available: true },
  { time: '08:30', available: true },
  { time: '09:00', available: false },
  { time: '09:30', available: true },
  { time: '10:00', available: true },
  { time: '10:30', available: false },
  { time: '11:00', available: true },
  { time: '11:30', available: true },
  { time: '13:00', available: true },
  { time: '13:30', available: false },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: false },
  { time: '16:00', available: true },
]

export function DateTimePicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  availableSlots,
  className,
}: DateTimePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Adjust to start from Monday (0 = Monday, 6 = Sunday)
    let startOffset = firstDay.getDay() - 1
    if (startOffset < 0) startOffset = 6

    const days: (Date | null)[] = []

    // Previous month days
    for (let i = 0; i < startOffset; i++) {
      days.push(null)
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }, [currentMonth])

  const timeSlots = useMemo(() => {
    if (!selectedDate) return []

    const dateKey = selectedDate.toISOString().split('T')[0]
    return availableSlots?.[dateKey] || DEFAULT_SLOTS
  }, [selectedDate, availableSlots])

  const isDateAvailable = (date: Date) => {
    const day = date.getDay()
    // Exclude weekends (0 = Sunday, 6 = Saturday)
    if (day === 0 || day === 6) return false
    // Exclude past dates
    if (date < today) return false
    return true
  }

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Calendar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-soft">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            disabled={currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
            aria-label="Předchozí měsíc"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-lg font-semibold text-gray-900">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>

          <button
            onClick={nextMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors touch-target"
            aria-label="Další měsíc"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const available = isDateAvailable(date)
            const selected = isDateSelected(date)
            const isToday = date.toDateString() === today.toDateString()

            return (
              <button
                key={date.toISOString()}
                onClick={() => available && onDateChange(date)}
                disabled={!available}
                className={cn(
                  'aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all touch-target',
                  available
                    ? selected
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'hover:bg-primary-50 text-gray-900 active:bg-primary-100'
                    : 'text-gray-300 cursor-not-allowed',
                  isToday && !selected && 'ring-2 ring-primary-200'
                )}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">
            Dostupné časy pro {selectedDate.getDate()}. {MONTHS[selectedDate.getMonth()].toLowerCase()}
          </h4>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && onTimeChange(slot.time)}
                disabled={!slot.available}
                className={cn(
                  'py-3 px-4 rounded-xl text-sm font-medium transition-all touch-target',
                  slot.available
                    ? selectedTime === slot.time
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-900 hover:border-primary-300 hover:bg-primary-50 active:bg-primary-100'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-primary-500" />
              <span>Vybráno</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full border border-gray-200 bg-white" />
              <span>Volné</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-gray-200" />
              <span>Obsazeno</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
