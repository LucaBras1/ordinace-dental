# Google Calendar Integration - Quick Reference

## Installation Status ✅

All files created and dependencies installed.

## Setup in 5 Steps

1. **Create Google Cloud Project**
   - Visit: https://console.cloud.google.com/
   - Enable Google Calendar API

2. **Create OAuth2 Credentials**
   - Type: Web application
   - Redirect URI: `http://localhost:3000/api/auth/google/callback`

3. **Add to .env**
   ```bash
   GOOGLE_CLIENT_ID="your_id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your_secret"
   GOOGLE_CALENDAR_ID="your_calendar@group.calendar.google.com"
   ```

4. **Get Refresh Token**
   ```bash
   npm run dev
   # Visit http://localhost:3000/api/calendar/setup
   # Follow instructions
   # Add GOOGLE_REFRESH_TOKEN to .env
   ```

5. **Test It**
   ```bash
   npm run calendar:test
   ```

## Common Commands

```bash
# Start dev server
npm run dev

# Test calendar integration
npm run calendar:test

# Check available slots
curl "http://localhost:3000/api/calendar/slots?date=2026-02-05"

# Setup OAuth (first time only)
curl http://localhost:3000/api/calendar/setup
```

## File Locations

```
src/lib/google-calendar.ts          # Main library
src/app/api/calendar/setup/route.ts # OAuth setup helper
src/app/api/calendar/slots/route.ts # Check availability
scripts/calendar-test.ts             # Test script
docs/google-calendar-setup.md       # Full setup guide
```

## Environment Variables

Required:
```bash
GOOGLE_CLIENT_ID=""        # From Google Cloud Console
GOOGLE_CLIENT_SECRET=""    # From Google Cloud Console
GOOGLE_REFRESH_TOKEN=""    # From OAuth flow
GOOGLE_CALENDAR_ID=""      # From Google Calendar settings
GOOGLE_REDIRECT_URI=""     # Optional, defaults to localhost:3000
```

## API Usage

### Check if Enabled
```typescript
import { isCalendarEnabled } from '@/lib/google-calendar'

if (isCalendarEnabled()) {
  // Use calendar features
}
```

### Create Event
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
```

### Get Available Slots
```typescript
import { getAvailableSlots } from '@/lib/google-calendar'

const slots = await getAvailableSlots(
  new Date('2026-02-05'),
  30 // minutes
)

const available = slots.filter(s => s.available)
```

### Delete Event
```typescript
import { deleteCalendarEvent } from '@/lib/google-calendar'

await deleteCalendarEvent(eventId)
```

## Configuration

Edit `src/lib/google-calendar.ts`:

### Office Hours
```typescript
const OFFICE_HOURS = {
  start: '08:00',
  end: '18:00',
  lunchStart: '12:00',
  lunchEnd: '13:00',
  workDays: [1, 2, 3, 4, 5], // Mon-Fri
}
```

### Event Colors
```typescript
const CALENDAR_COLORS = {
  PAID: '10',      // Green
  PENDING: '6',    // Orange
  NO_SHOW: '8',    // Gray
  CANCELLED: '11', // Red
}
```

## Webhook Integration

Already integrated in `src/app/api/webhooks/comgate/route.ts`:

```typescript
if (status === 'PAID' && isCalendarEnabled()) {
  const eventId = await createCalendarEvent(booking)
  await prisma.booking.update({
    where: { id: booking.id },
    data: { googleEventId: eventId },
  })
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Calendar not enabled | Check all 4 env vars are set |
| Invalid refresh token | Re-run OAuth setup |
| Events not created | Check webhook logs |
| Build fails | Shouldn't happen - check imports |
| No available slots | Check if working day (Mon-Fri) |

## Testing Checklist

- [ ] Environment variables set in `.env`
- [ ] Run `npm run calendar:test` - all tests pass
- [ ] Visit `/api/calendar/slots?date=2026-02-05` - returns slots
- [ ] Create test booking - check Google Calendar
- [ ] Cancel booking - event deleted from calendar

## Production Deployment

1. Create production OAuth credentials
2. Use different redirect URI: `https://yourdomain.com/api/auth/google/callback`
3. Set environment variables on server
4. Disable/protect `/api/calendar/setup` endpoint
5. Test with real booking

## Support

Full documentation: `docs/google-calendar-setup.md`
Module docs: `src/lib/README-calendar.md`
Implementation summary: `CALENDAR_INTEGRATION.md`
