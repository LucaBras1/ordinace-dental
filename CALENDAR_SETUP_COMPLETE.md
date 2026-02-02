# ✅ Google Calendar Integration - Setup Complete

**Date:** 2026-02-01
**Status:** Ready for Configuration
**Version:** 1.0.0

---

## What Was Created

### 🔧 Core Library
- **`src/lib/google-calendar.ts`** (573 lines)
  - OAuth2 client setup with build-time guard
  - Event creation, deletion, and updates
  - Available slots calculation
  - Office hours configuration
  - Event color coding by status

### 🌐 API Endpoints
- **`/api/calendar/setup`** - OAuth2 setup helper (GET/POST)
- **`/api/calendar/slots`** - Check available time slots (GET)

### 🔄 Integration
- **`src/app/api/webhooks/comgate/route.ts`** - Updated to create calendar events on payment
- **`.env.example`** - Updated with Google Calendar environment variables

### 📝 Documentation
- **`docs/google-calendar-setup.md`** - Complete setup guide (step-by-step)
- **`docs/calendar-quick-reference.md`** - Quick commands and API reference
- **`docs/calendar-checklist.md`** - Setup checklist (printable)
- **`docs/calendar-migration.md`** - Migration and update guide
- **`src/lib/README-calendar.md`** - Developer API documentation
- **`CALENDAR_INTEGRATION.md`** - Implementation summary

### 🧪 Testing
- **`scripts/calendar-test.ts`** - Automated test script
- **`package.json`** - Added `calendar:test` script

### 📦 Types
- **`src/types/calendar.ts`** - TypeScript type definitions

### 📚 Dependencies Added
```json
{
  "googleapis": "^171.0.0",
  "tsx": "^4.21.0" (devDependency)
}
```

---

## What You Need to Do Next

### 1. Google Cloud Setup (15 minutes)

Follow **`docs/google-calendar-setup.md`** or use checklist **`docs/calendar-checklist.md`**:

1. Create Google Cloud project
2. Enable Google Calendar API
3. Create OAuth2 credentials
4. Get Client ID and Client Secret

### 2. Google Calendar Setup (5 minutes)

1. Create dedicated calendar "Ordinace Rezervace"
2. Get Calendar ID from settings

### 3. Local Configuration (10 minutes)

1. Add to `.env`:
   ```bash
   GOOGLE_CLIENT_ID="your_client_id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your_client_secret"
   GOOGLE_CALENDAR_ID="your_calendar_id@group.calendar.google.com"
   GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. Get refresh token:
   - Visit: http://localhost:3000/api/calendar/setup
   - Follow OAuth flow
   - Add refresh token to `.env`

4. Restart server

### 4. Test Integration (5 minutes)

```bash
npm run calendar:test
```

Expected output:
```
✅ Calendar enabled: true
✅ Found X available slots
✅ Event created
✅ Events listed
✅ Test event deleted
✅ All tests passed!
```

---

## Quick Start Commands

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Test calendar integration
npm run calendar:test

# Check available slots
curl "http://localhost:3000/api/calendar/slots?date=2026-02-05"

# OAuth setup (first time)
curl http://localhost:3000/api/calendar/setup
```

---

## Features

### ✅ Automatic Event Creation
When booking is paid, webhook automatically:
1. Creates Google Calendar event
2. Adds customer as attendee
3. Sets automatic reminders (1 day + 1 hour before)
4. Colors event green (PAID status)
5. Stores event ID in database

### ✅ Event Format
**Title:** `Dentální hygiena - Jan Novák`

**Description:**
```
Kontakt: +420 123 456 789
Email: jan@example.cz
První návštěva: Ano
Poznámka: Customer notes here
```

**Reminders:**
- Email: 24 hours before
- Popup: 1 hour before

### ✅ Color Coding
- 🟢 Green - PAID (confirmed)
- 🟠 Orange - PENDING (awaiting payment)
- ⚫ Gray - NO_SHOW (didn't show up)
- 🔴 Red - CANCELLED

### ✅ Office Hours
- **Working Days:** Monday-Friday
- **Hours:** 08:00-18:00
- **Lunch Break:** 12:00-13:00 (blocked)
- **Slot Duration:** 30 minutes (configurable per service)

### ✅ Available Slots API
Check which time slots are free before showing booking form:

```typescript
const response = await fetch(
  `/api/calendar/slots?date=2026-02-05&duration=60`
)
const { slots } = await response.json()
```

### ✅ Build-Time Safe
Uses same pattern as Prisma 7 - won't break builds if credentials missing:

```typescript
if (!credentials) {
  console.warn('[Calendar] Not configured')
  return null // Don't throw during build
}
```

---

## File Structure

```
ordinace/
├── src/
│   ├── lib/
│   │   ├── google-calendar.ts          # Main library ⭐
│   │   └── README-calendar.md          # API docs
│   ├── app/api/
│   │   ├── calendar/
│   │   │   ├── setup/route.ts          # OAuth setup
│   │   │   └── slots/route.ts          # Availability check
│   │   └── webhooks/comgate/route.ts   # Updated (creates events)
│   └── types/
│       └── calendar.ts                  # TypeScript types
├── scripts/
│   └── calendar-test.ts                 # Test script
├── docs/
│   ├── google-calendar-setup.md         # Setup guide ⭐
│   ├── calendar-quick-reference.md      # Quick reference
│   ├── calendar-checklist.md            # Setup checklist
│   └── calendar-migration.md            # Migration guide
├── .env.example                         # Updated with Google vars
├── CALENDAR_INTEGRATION.md              # Implementation summary
└── package.json                         # Updated (googleapis, tsx)
```

⭐ = Start here

---

## Integration Points

### Comgate Webhook (Automatic)
File: `src/app/api/webhooks/comgate/route.ts`

```typescript
if (status === 'PAID' && isCalendarEnabled()) {
  const eventId = await createCalendarEvent(booking)
  await prisma.booking.update({
    where: { id },
    data: { googleEventId: eventId }
  })
}
```

### Frontend (You Need to Add)
Check available slots before showing time picker:

```typescript
import { useState, useEffect } from 'react'

function BookingForm({ selectedDate, serviceDuration }) {
  const [slots, setSlots] = useState([])

  useEffect(() => {
    fetch(`/api/calendar/slots?date=${selectedDate}&duration=${serviceDuration}`)
      .then(r => r.json())
      .then(data => setSlots(data.slots.filter(s => s.available)))
  }, [selectedDate, serviceDuration])

  return (
    <select>
      {slots.map(slot => (
        <option key={slot.start} value={slot.start}>
          {slot.start} - {slot.end}
        </option>
      ))}
    </select>
  )
}
```

---

## Configuration

### Change Office Hours
Edit `src/lib/google-calendar.ts`:

```typescript
const OFFICE_HOURS = {
  start: '08:00',      // Change me
  end: '18:00',        // Change me
  lunchStart: '12:00', // Change me
  lunchEnd: '13:00',   // Change me
  workDays: [1, 2, 3, 4, 5], // Change me (0=Sun, 6=Sat)
}
```

### Change Event Colors
Edit `src/lib/google-calendar.ts`:

```typescript
const CALENDAR_COLORS = {
  PAID: '10',      // Green (change to any color ID 1-11)
  PENDING: '6',    // Orange
  NO_SHOW: '8',    // Gray
  CANCELLED: '11', // Red
}
```

---

## Security

### ✅ Already Implemented
- Environment variables (not in git)
- Build-time guard (won't fail builds)
- Non-blocking errors (calendar optional)
- OAuth2 refresh tokens (secure)

### ⚠️ Before Production
- [ ] Disable or protect `/api/calendar/setup` endpoint
- [ ] Use different OAuth credentials for production
- [ ] Update redirect URI to production domain
- [ ] Test with real bookings

---

## Troubleshooting

### Calendar Not Working

1. **Check if enabled:**
   ```bash
   npm run calendar:test
   ```

2. **Check environment variables:**
   ```bash
   # In your terminal
   echo $GOOGLE_CLIENT_ID
   echo $GOOGLE_CLIENT_SECRET
   echo $GOOGLE_REFRESH_TOKEN
   echo $GOOGLE_CALENDAR_ID
   ```

3. **Check server logs:**
   Look for `[Google Calendar]` messages

### Common Issues

| Problem | Solution |
|---------|----------|
| "Calendar not configured" | Check all 4 env vars are set |
| "Invalid refresh token" | Re-run OAuth setup |
| Events not created | Check webhook logs, verify status is PAID |
| Build fails | Shouldn't happen - check imports |
| No available slots | Check if working day (Mon-Fri) |

---

## Documentation Quick Links

- 📖 **[Setup Guide](docs/google-calendar-setup.md)** - Step-by-step setup
- ⚡ **[Quick Reference](docs/calendar-quick-reference.md)** - Commands & API
- ✅ **[Checklist](docs/calendar-checklist.md)** - Printable setup checklist
- 🔄 **[Migration](docs/calendar-migration.md)** - Updates & changes
- 👨‍💻 **[API Docs](src/lib/README-calendar.md)** - Developer reference
- 📊 **[Implementation](CALENDAR_INTEGRATION.md)** - Technical details

---

## Next Steps

1. ⬜ **Setup Google Cloud** (15 min)
   - Create project
   - Enable Calendar API
   - Create OAuth credentials

2. ⬜ **Configure Environment** (10 min)
   - Add credentials to `.env`
   - Get refresh token
   - Restart server

3. ⬜ **Test Integration** (5 min)
   - Run `npm run calendar:test`
   - Create test booking
   - Verify in Google Calendar

4. ⬜ **Frontend Integration** (30 min)
   - Add available slots check
   - Show time picker with free slots
   - Handle no-slots-available case

5. ⬜ **Production Deploy** (varies)
   - Create production OAuth credentials
   - Set production env vars
   - Test on production

---

## Support

**Questions?** Check documentation first:
1. Setup issues → `docs/google-calendar-setup.md`
2. API usage → `src/lib/README-calendar.md`
3. Quick commands → `docs/calendar-quick-reference.md`

**Still stuck?**
- Check server logs for `[Google Calendar]` messages
- Run `npm run calendar:test` for diagnostics
- Review `docs/calendar-checklist.md`

---

## Summary

✅ **All code files created**
✅ **Dependencies installed**
✅ **Documentation complete**
✅ **Test script ready**
✅ **Webhook integrated**
✅ **Build-time safe**

⏭️ **Next:** Configure Google Cloud & get OAuth credentials

**Time to Production:** ~30 minutes (after credentials obtained)

---

**Created by:** Backend Developer Agent
**Date:** 2026-02-01
**Ready for:** Google Cloud setup and testing

🚀 **You're all set! Follow the setup guide to go live.**
