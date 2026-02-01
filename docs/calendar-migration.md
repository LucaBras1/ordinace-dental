# Google Calendar Integration - Migration & Updates

## Updating from No Calendar to Calendar Integration

### Database Migration

**No migration required!** The `googleEventId` field already exists in the schema:

```prisma
model Booking {
  // ...
  googleEventId   String?  // Already present
  // ...
}
```

If you're updating an existing production database, no migration is needed.

### Backfilling Existing Bookings

If you have existing PAID bookings without calendar events:

#### Step 1: Create Backfill Script

```typescript
// scripts/backfill-calendar-events.ts
import { prisma } from '../src/lib/prisma'
import { createCalendarEvent } from '../src/lib/google-calendar'

async function backfillCalendarEvents() {
  // Get all PAID bookings without calendar events
  const bookings = await prisma.booking.findMany({
    where: {
      status: 'PAID',
      googleEventId: null,
      appointmentDate: {
        gte: new Date(), // Only future appointments
      },
    },
    include: {
      service: true,
    },
  })

  console.log(`Found ${bookings.length} bookings to backfill`)

  for (const booking of bookings) {
    try {
      const eventId = await createCalendarEvent({
        id: booking.id,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        appointmentDate: booking.appointmentDate,
        appointmentTime: booking.appointmentTime,
        duration: booking.service.duration,
        serviceName: booking.service.name,
        notes: booking.notes || undefined,
        isFirstVisit: booking.isFirstVisit,
        status: booking.status,
      })

      await prisma.booking.update({
        where: { id: booking.id },
        data: { googleEventId: eventId },
      })

      console.log(`✅ Created event for booking ${booking.id}`)
    } catch (error) {
      console.error(`❌ Failed for booking ${booking.id}:`, error)
    }
  }

  console.log('Backfill complete!')
}

backfillCalendarEvents()
```

#### Step 2: Run Backfill

```bash
npx tsx scripts/backfill-calendar-events.ts
```

⚠️ **Warning:** This will create calendar events for all future PAID bookings. Test on a development calendar first!

## Updating Google Calendar API Version

The current implementation uses Calendar API v3. To update:

### Check Latest Version

Visit: https://developers.google.com/calendar/api/v3/reference

### Update Code

If Google releases v4:

1. Update import in `src/lib/google-calendar.ts`:
   ```typescript
   import { google, calendar_v4 } from 'googleapis'
   ```

2. Update client creation:
   ```typescript
   _calendarClient = google.calendar({ version: 'v4', auth })
   ```

3. Test all operations
4. Update documentation

## Updating OAuth2 Credentials

### When to Update

- Credentials compromised
- Moving to production
- Changing domains
- Adding redirect URIs

### Steps

1. **Create New Credentials**
   - Go to Google Cloud Console
   - Create new OAuth client ID
   - Configure redirect URIs

2. **Update Environment Variables**
   ```bash
   GOOGLE_CLIENT_ID="new_client_id"
   GOOGLE_CLIENT_SECRET="new_client_secret"
   ```

3. **Obtain New Refresh Token**
   - Clear old token from `.env`
   - Visit `/api/calendar/setup`
   - Follow OAuth flow
   - Add new refresh token to `.env`

4. **Test Integration**
   ```bash
   npm run calendar:test
   ```

5. **Deploy Changes**
   - Update production environment variables
   - Restart application

## Switching Calendars

To use a different Google Calendar:

### Steps

1. **Create or Select Calendar**
   - In Google Calendar, create new calendar
   - Or select existing calendar

2. **Get Calendar ID**
   - Calendar settings → Integrate calendar
   - Copy Calendar ID

3. **Update Environment Variable**
   ```bash
   GOOGLE_CALENDAR_ID="new_calendar_id@group.calendar.google.com"
   ```

4. **Restart Application**

5. **Migrate Existing Events (Optional)**
   - Manually move events in Google Calendar UI
   - Or create script to copy events

## Changing Office Hours

### Configuration Location

File: `src/lib/google-calendar.ts`

```typescript
const OFFICE_HOURS = {
  start: '08:00',      // Change opening time
  end: '18:00',        // Change closing time
  lunchStart: '12:00', // Change lunch start
  lunchEnd: '13:00',   // Change lunch end
  workDays: [1, 2, 3, 4, 5], // Change working days
}
```

### Examples

#### Add Saturday
```typescript
workDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
```

#### Extended Hours
```typescript
start: '07:00',
end: '20:00',
```

#### Split Shift (Not Supported Yet)
For complex schedules, you'll need to extend the code:

```typescript
// Would need custom implementation
const OFFICE_HOURS_COMPLEX = {
  shifts: [
    { start: '08:00', end: '12:00' },
    { start: '14:00', end: '18:00' },
  ],
}
```

## Updating Event Colors

### Configuration Location

File: `src/lib/google-calendar.ts`

```typescript
const CALENDAR_COLORS = {
  PAID: '10',      // Green
  PENDING: '6',    // Orange
  NO_SHOW: '8',    // Gray
  CANCELLED: '11', // Red
}
```

### Available Colors

Google Calendar Color IDs:
- `1` - Lavender
- `2` - Sage
- `3` - Grape
- `4` - Flamingo
- `5` - Banana
- `6` - Tangerine (Orange)
- `7` - Peacock (Blue)
- `8` - Graphite (Gray)
- `9` - Blueberry (Dark blue)
- `10` - Basil (Green)
- `11` - Tomato (Red)

### Example: Add Status Color

1. Add new booking status to schema
2. Add color mapping:
   ```typescript
   const CALENDAR_COLORS = {
     PAID: '10',
     PENDING: '6',
     NO_SHOW: '8',
     CANCELLED: '11',
     CONFIRMED: '9',  // New: Dark blue
   }
   ```

## Adding Custom Event Fields

To add custom data to calendar events:

### Update Event Description

File: `src/lib/google-calendar.ts`, function `createCalendarEvent`:

```typescript
const description = [
  `Kontakt: ${booking.customerPhone}`,
  `Email: ${booking.customerEmail}`,
  `První návštěva: ${booking.isFirstVisit ? 'Ano' : 'Ne'}`,
  booking.notes ? `Poznámka: ${booking.notes}` : '',
  // Add custom field:
  booking.insuranceCompany ? `Pojišťovna: ${booking.insuranceCompany}` : '',
]
  .filter(Boolean)
  .join('\n')
```

### Add Event Properties

```typescript
const event = {
  summary,
  description,
  start: { ... },
  end: { ... },
  colorId,
  // Add custom properties:
  extendedProperties: {
    private: {
      bookingId: booking.id,
      customField: booking.customValue,
    },
  },
}
```

## Updating Dependencies

### Update googleapis

```bash
npm update googleapis
```

### Check Breaking Changes

1. Review changelog: https://github.com/googleapis/google-api-nodejs-client/releases
2. Run tests: `npm run calendar:test`
3. Test in development
4. Deploy to production

### Version Pinning

For stability, consider pinning version in `package.json`:

```json
{
  "dependencies": {
    "googleapis": "171.0.0"  // Exact version
  }
}
```

## Implementing Two-Way Sync

Current implementation is **one-way** (app → calendar). For two-way sync:

### Requirements

1. **Webhook Endpoint** for Google Calendar
2. **Watch Channel** subscription
3. **Sync Logic** to handle external changes

### High-Level Implementation

```typescript
// 1. Create webhook endpoint
// src/app/api/webhooks/calendar/route.ts
export async function POST(request: NextRequest) {
  // Handle calendar change notifications
  // Update database based on calendar changes
}

// 2. Set up watch channel
import { google } from 'googleapis'

async function setupCalendarWatch() {
  const calendar = getCalendarClient()

  await calendar.events.watch({
    calendarId: getCalendarId(),
    requestBody: {
      id: 'unique-channel-id',
      type: 'web_hook',
      address: 'https://yourdomain.com/api/webhooks/calendar',
    },
  })
}
```

⚠️ **Complex Feature:** Requires careful implementation to avoid sync conflicts.

## Multi-Calendar Support

To support multiple calendars (e.g., per doctor):

### Database Changes

```prisma
model Booking {
  // ...
  doctorId        String?
  googleEventId   String?
  googleCalendarId String? // Store which calendar
}

model Doctor {
  id              String @id
  name            String
  googleCalendarId String
  bookings        Booking[]
}
```

### Code Changes

```typescript
// src/lib/google-calendar.ts
export async function createCalendarEvent(
  booking: BookingData,
  calendarId?: string // Make calendar ID dynamic
): Promise<string> {
  const targetCalendar = calendarId || getCalendarId()

  const response = await calendar.events.insert({
    calendarId: targetCalendar,
    requestBody: event,
  })

  return response.data.id!
}
```

## Timezone Support

Current implementation assumes **Europe/Prague**. For international support:

### Make Timezone Configurable

```typescript
// src/lib/google-calendar.ts
const DEFAULT_TIMEZONE = process.env.CALENDAR_TIMEZONE || 'Europe/Prague'

const event = {
  start: {
    dateTime: startDateTime,
    timeZone: DEFAULT_TIMEZONE,
  },
  end: {
    dateTime: endTime.toISOString(),
    timeZone: DEFAULT_TIMEZONE,
  },
}
```

### Per-Booking Timezone

```typescript
interface BookingData {
  // ...
  timezone?: string
}

// Use booking.timezone or default
const timezone = booking.timezone || DEFAULT_TIMEZONE
```

## Rollback Procedure

If you need to disable calendar integration:

### Emergency Disable

1. **Comment out webhook integration**
   ```typescript
   // src/app/api/webhooks/comgate/route.ts
   /*
   if (status === 'PAID' && isCalendarEnabled()) {
     await createCalendarEvent(booking)
   }
   */
   ```

2. **Restart application**

### Gradual Rollback

1. **Stop creating new events**
   - Remove environment variables
   - Or add feature flag

2. **Keep existing events**
   - Don't delete from calendar
   - Clean up manually later

3. **Remove code** (if permanent)
   - Delete `src/lib/google-calendar.ts`
   - Remove API routes
   - Remove from webhook handler
   - Remove dependencies

## Testing After Updates

### Full Test Checklist

After any update, run:

1. **Environment Check**
   ```bash
   npm run calendar:test
   ```

2. **API Endpoints**
   ```bash
   curl http://localhost:3000/api/calendar/setup
   curl "http://localhost:3000/api/calendar/slots?date=2026-02-05"
   ```

3. **Integration Test**
   - Create test booking
   - Complete payment
   - Check calendar event created
   - Cancel booking
   - Check event deleted

4. **Load Test** (Production)
   - Monitor for errors
   - Check API quota
   - Verify performance

## Support & Resources

- **Google Calendar API Docs:** https://developers.google.com/calendar/api/v3/reference
- **googleapis Library:** https://github.com/googleapis/google-api-nodejs-client
- **OAuth2 Guide:** https://developers.google.com/identity/protocols/oauth2
- **Project Docs:** `docs/google-calendar-setup.md`

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-02-01 | 1.0.0 | Initial implementation |

---

**For major updates, always:**
1. ✅ Test in development first
2. ✅ Review Google Calendar API changelog
3. ✅ Backup production database
4. ✅ Have rollback plan ready
5. ✅ Monitor after deployment
