# Google Calendar Integration

This module provides Google Calendar integration for automatic booking synchronization.

## Features

- ✅ **Automatic Event Creation**: Creates calendar events when bookings are confirmed (payment received)
- ✅ **Event Deletion**: Removes events when bookings are cancelled
- ✅ **Availability Checking**: Checks available time slots based on existing events
- ✅ **Status Updates**: Updates event colors when booking status changes
- ✅ **Email Notifications**: Sends automatic reminders to customers
- ✅ **Office Hours**: Respects configured office hours and lunch breaks

## Quick Start

### 1. Configure Environment Variables

See `docs/google-calendar-setup.md` for detailed setup instructions.

Required variables:
```bash
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REFRESH_TOKEN="..."
GOOGLE_CALENDAR_ID="..."
```

### 2. Check Integration Status

```typescript
import { isCalendarEnabled } from '@/lib/google-calendar'

if (isCalendarEnabled()) {
  console.log('Google Calendar integration is active')
}
```

### 3. Create Calendar Event

```typescript
import { createCalendarEvent } from '@/lib/google-calendar'

const eventId = await createCalendarEvent({
  id: booking.id,
  customerName: 'Jan Novák',
  customerEmail: 'jan@example.cz',
  customerPhone: '+420 123 456 789',
  appointmentDate: new Date('2026-02-05'),
  appointmentTime: '14:00',
  duration: 60,
  serviceName: 'Dentální hygiena',
  notes: 'První návštěva',
  isFirstVisit: true,
  status: 'PAID',
})

// Save eventId to booking.googleEventId
```

### 4. Check Available Slots

```typescript
import { getAvailableSlots } from '@/lib/google-calendar'

const slots = await getAvailableSlots(
  new Date('2026-02-05'),
  30 // slot duration in minutes
)

console.log('Available slots:', slots.filter(s => s.available))
```

## API Functions

### `isCalendarEnabled(): boolean`

Checks if Google Calendar integration is configured.

**Returns:** `true` if all required environment variables are set

**Example:**
```typescript
if (isCalendarEnabled()) {
  // Use calendar features
}
```

---

### `createCalendarEvent(booking): Promise<string>`

Creates a calendar event for a booking.

**Parameters:**
- `booking: BookingCalendarData` - Booking data

**Returns:** Google Calendar event ID (string)

**Throws:** Error if calendar API call fails

**Example:**
```typescript
try {
  const eventId = await createCalendarEvent(bookingData)
  console.log('Event created:', eventId)
} catch (error) {
  console.error('Failed to create event:', error)
}
```

---

### `deleteCalendarEvent(eventId): Promise<void>`

Deletes a calendar event.

**Parameters:**
- `eventId: string` - Google Calendar event ID

**Throws:** Error if calendar API call fails

**Example:**
```typescript
await deleteCalendarEvent('abc123xyz')
```

---

### `updateCalendarEventStatus(eventId, status): Promise<void>`

Updates event color based on booking status.

**Parameters:**
- `eventId: string` - Google Calendar event ID
- `status: string` - Booking status ('PAID', 'PENDING', 'CANCELLED', etc.)

**Example:**
```typescript
await updateCalendarEventStatus('abc123xyz', 'PAID')
```

---

### `listEvents(startDate, endDate): Promise<CalendarEvent[]>`

Lists calendar events in a date range.

**Parameters:**
- `startDate: Date` - Start of range
- `endDate: Date` - End of range

**Returns:** Array of calendar events

**Example:**
```typescript
const start = new Date('2026-02-01')
const end = new Date('2026-02-28')
const events = await listEvents(start, end)
```

---

### `getAvailableSlots(date, slotDuration?): Promise<TimeSlot[]>`

Gets available time slots for a date.

**Parameters:**
- `date: Date` - Date to check
- `slotDuration?: number` - Slot duration in minutes (default: 30)

**Returns:** Array of time slots with availability status

**Example:**
```typescript
const slots = await getAvailableSlots(new Date('2026-02-05'), 30)

// Filter only available slots
const available = slots.filter(s => s.available)

// Show slot times
available.forEach(slot => {
  console.log(`${slot.start} - ${slot.end}`)
})
```

---

### `getAuthorizationUrl(): string`

Generates OAuth2 authorization URL for setup.

**Returns:** Authorization URL

**Use:** During initial setup to obtain refresh token

**Example:**
```typescript
const url = getAuthorizationUrl()
console.log('Visit:', url)
```

---

### `getRefreshToken(code): Promise<string>`

Exchanges authorization code for refresh token.

**Parameters:**
- `code: string` - Authorization code from OAuth callback

**Returns:** Refresh token

**Use:** During initial setup after user authorization

**Example:**
```typescript
const refreshToken = await getRefreshToken('4/0AY0e-g7...')
console.log('Add to .env:', refreshToken)
```

## Configuration

### Office Hours

Edit `OFFICE_HOURS` in `src/lib/google-calendar.ts`:

```typescript
const OFFICE_HOURS = {
  start: '08:00',      // Opening time
  end: '18:00',        // Closing time
  lunchStart: '12:00', // Lunch break start
  lunchEnd: '13:00',   // Lunch break end
  workDays: [1, 2, 3, 4, 5], // Days of week (0=Sun, 6=Sat)
}
```

### Event Colors

Edit `CALENDAR_COLORS` in `src/lib/google-calendar.ts`:

```typescript
const CALENDAR_COLORS = {
  PAID: '10',      // Green
  PENDING: '6',    // Orange
  NO_SHOW: '8',    // Gray
  CANCELLED: '11', // Red
}
```

Google Calendar Color IDs:
- 1: Lavender
- 2: Sage
- 3: Grape
- 4: Flamingo
- 5: Banana
- 6: Tangerine
- 7: Peacock
- 8: Graphite
- 9: Blueberry
- 10: Basil
- 11: Tomato

## Error Handling

All functions throw errors on failure. Always use try-catch:

```typescript
try {
  const eventId = await createCalendarEvent(booking)
  // Success
} catch (error) {
  console.error('Calendar error:', error)
  // Handle error (log, notify, etc.)
  // Don't fail the entire operation - calendar is optional
}
```

**Important:** Calendar operations are **non-critical**. If calendar fails, the booking should still succeed. Always catch errors and log them, but don't block the main flow.

## Testing

### Test Available Slots

```bash
curl "http://localhost:3000/api/calendar/slots?date=2026-02-05&duration=30"
```

### Test Event Creation

Create a test booking and complete payment. Check Google Calendar for the event.

### Test Event Deletion

Cancel a booking. Check that the event is removed from Google Calendar.

## Troubleshooting

### Calendar Integration Not Working

1. Check if enabled:
   ```typescript
   console.log('Enabled:', isCalendarEnabled())
   ```

2. Check environment variables:
   ```bash
   echo $GOOGLE_CLIENT_ID
   echo $GOOGLE_CLIENT_SECRET
   echo $GOOGLE_REFRESH_TOKEN
   echo $GOOGLE_CALENDAR_ID
   ```

3. Check server logs for `[Google Calendar]` messages

### Events Not Created

1. Check booking status - only `PAID` status creates events
2. Verify `googleEventId` is saved to database after creation
3. Check calendar API quota (unlikely, but possible)

### "Invalid credentials" Error

1. Refresh token may have expired
2. Go through OAuth setup again to get new refresh token
3. Update `.env` and restart application

## Integration Points

### Comgate Webhook

When payment is confirmed, webhook creates calendar event:

```typescript
// src/app/api/webhooks/comgate/route.ts
if (status === 'PAID' && !booking.googleEventId && isCalendarEnabled()) {
  const eventId = await createCalendarEvent(booking)
  await prisma.booking.update({
    where: { id: booking.id },
    data: { googleEventId: eventId },
  })
}
```

### Booking Cancellation

When booking is cancelled, delete calendar event:

```typescript
if (booking.googleEventId) {
  await deleteCalendarEvent(booking.googleEventId)
}
```

### Frontend Availability Check

Check available slots before showing booking form:

```typescript
const response = await fetch(
  `/api/calendar/slots?date=${date}&duration=${serviceDuration}`
)
const { slots } = await response.json()
```

## Best Practices

1. ✅ **Always check `isCalendarEnabled()`** before using calendar features
2. ✅ **Use try-catch** for all calendar operations
3. ✅ **Don't block main flow** - calendar is optional, bookings should work without it
4. ✅ **Log errors** for monitoring and debugging
5. ✅ **Test with different time zones** if serving international customers
6. ✅ **Monitor API quota** in Google Cloud Console
7. ✅ **Keep refresh token secure** - never commit to git

## Related Documentation

- [Google Calendar Setup Guide](../../docs/google-calendar-setup.md)
- [Google Calendar API Documentation](https://developers.google.com/calendar/api/v3/reference)
- [OAuth2 Authentication](https://developers.google.com/identity/protocols/oauth2)
