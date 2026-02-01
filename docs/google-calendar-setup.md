# Google Calendar Integration Setup Guide

This guide walks you through setting up Google Calendar integration for automatic booking synchronization.

## Overview

The Google Calendar integration provides:
- ✅ Automatic event creation when bookings are confirmed (payment received)
- ✅ Event deletion when bookings are cancelled
- ✅ Available time slot checking
- ✅ Event color coding based on booking status
- ✅ Email notifications to customers
- ✅ Automatic reminders (1 day before, 1 hour before)

## Prerequisites

- Google Account with Google Calendar access
- Google Cloud Console access (free)
- Access to your server environment variables

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
3. Name it something like "Ordinace Booking System"

## Step 2: Enable Google Calendar API

1. In your Google Cloud project, go to **APIs & Services** > **Library**
2. Search for "Google Calendar API"
3. Click on it and press **Enable**

## Step 3: Create OAuth2 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure OAuth consent screen:
   - User Type: **External** (or Internal if using Google Workspace)
   - App name: "Ordinace Booking System"
   - User support email: your email
   - Developer contact: your email
   - Scopes: Add `https://www.googleapis.com/auth/calendar`
   - Test users: Add your Google account email

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: "Ordinace Calendar Integration"
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/google/callback`
     - Production: `https://yourdomain.com/api/auth/google/callback`
   - Click **Create**

5. **Save the credentials:**
   - Copy **Client ID** (ends with `.apps.googleusercontent.com`)
   - Copy **Client Secret**

## Step 4: Get Calendar ID

1. Open [Google Calendar](https://calendar.google.com/)
2. Create a dedicated calendar for bookings (recommended):
   - On the left, click **+** next to "Other calendars"
   - Select **Create new calendar**
   - Name: "Ordinace Rezervace"
   - Time zone: Europe/Prague
   - Click **Create calendar**

3. Get Calendar ID:
   - Find your calendar in the list on the left
   - Click the three dots next to it
   - Select **Settings and sharing**
   - Scroll down to **Integrate calendar**
   - Copy the **Calendar ID** (looks like `abc123@group.calendar.google.com`)

## Step 5: Configure Environment Variables

Add these to your `.env` file:

```bash
# Google Calendar Integration
GOOGLE_CLIENT_ID="your_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_client_secret"
GOOGLE_CALENDAR_ID="your_calendar_id@group.calendar.google.com"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

**Don't set `GOOGLE_REFRESH_TOKEN` yet** - we'll get it in the next step.

## Step 6: Obtain Refresh Token

This is the trickiest part. You need to authorize the app to access your calendar.

### Option A: Using the Setup API (Easiest)

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit the setup endpoint:
   ```
   http://localhost:3000/api/calendar/setup
   ```

3. Click the authorization URL provided

4. Sign in with your Google account

5. Grant calendar access permissions

6. After redirecting, you'll see an error page - **this is normal!**

7. Copy the `code` parameter from the URL:
   ```
   http://localhost:3000/api/auth/google/callback?code=4/0AY0e-g7...&scope=...
   ```
   Copy everything after `code=` and before `&scope`

8. Use the code to get refresh token (using curl, Postman, or Thunder Client):
   ```bash
   curl -X POST http://localhost:3000/api/calendar/setup \
     -H "Content-Type: application/json" \
     -d '{"code":"YOUR_CODE_HERE"}'
   ```

9. Copy the `refreshToken` from the response

10. Add it to your `.env`:
    ```bash
    GOOGLE_REFRESH_TOKEN="your_refresh_token_here"
    ```

11. Restart your development server

### Option B: Using OAuth2 Playground

1. Go to [OAuth2 Playground](https://developers.google.com/oauthplayground/)

2. Click the gear icon (⚙️) in the top right

3. Check **Use your own OAuth credentials**

4. Enter your Client ID and Client Secret

5. In the left panel, find **Calendar API v3**

6. Select `https://www.googleapis.com/auth/calendar`

7. Click **Authorize APIs**

8. Sign in and grant permissions

9. Click **Exchange authorization code for tokens**

10. Copy the **Refresh token**

11. Add it to your `.env`:
    ```bash
    GOOGLE_REFRESH_TOKEN="your_refresh_token_here"
    ```

## Step 7: Test Integration

1. Restart your application:
   ```bash
   npm run dev
   ```

2. Test available slots API:
   ```bash
   curl "http://localhost:3000/api/calendar/slots?date=2026-02-05&duration=30"
   ```

   Expected response:
   ```json
   {
     "date": "2026-02-05",
     "duration": 30,
     "totalSlots": 16,
     "availableSlots": 16,
     "slots": [...]
   }
   ```

3. Create a test booking and complete payment (or use test payment)

4. Check your Google Calendar - you should see the event!

## Calendar Event Format

Events created in Google Calendar will have:

**Title:** `[Service Name] - [Customer Name]`
- Example: "Dentální hygiena - Jan Novák"

**Description:**
```
Kontakt: +420 123 456 789
Email: jan@example.cz
První návštěva: Ano
Poznámka: Customer's notes here
```

**Color Coding:**
- 🟢 Green (`PAID`) - Confirmed booking, payment received
- 🟠 Orange (`PENDING`) - Awaiting payment
- ⚫ Gray (`NO_SHOW`) - Patient didn't show up
- 🔴 Red (`CANCELLED`) - Cancelled booking

**Reminders:**
- Email: 1 day before appointment
- Popup: 1 hour before appointment

## Office Hours Configuration

Default configuration in `src/lib/google-calendar.ts`:

```typescript
const OFFICE_HOURS = {
  start: '08:00',      // Opening time
  end: '18:00',        // Closing time
  lunchStart: '12:00', // Lunch break start
  lunchEnd: '13:00',   // Lunch break end
  workDays: [1, 2, 3, 4, 5], // Monday-Friday
}
```

To modify:
1. Edit `src/lib/google-calendar.ts`
2. Update the `OFFICE_HOURS` constant
3. Restart your application

## Troubleshooting

### "Missing OAuth2 credentials" Error

**Problem:** Environment variables not set correctly.

**Solution:**
1. Check `.env` file exists
2. Verify all 4 variables are set:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
   - `GOOGLE_CALENDAR_ID`
3. Restart your application

### "Invalid refresh token" Error

**Problem:** Refresh token expired or invalid.

**Solution:**
1. Go back to Step 6 and get a new refresh token
2. Make sure to use `access_type=offline` and `prompt=consent`
3. Update `.env` with new token
4. Restart application

### Events Not Created

**Problem:** Calendar integration failing silently.

**Solution:**
1. Check server logs for `[Google Calendar]` messages
2. Verify calendar ID is correct
3. Ensure calendar is shared with the Google account you authorized
4. Test with `/api/calendar/slots` endpoint

### "Calendar not found" Error

**Problem:** Calendar ID is incorrect or calendar doesn't exist.

**Solution:**
1. Go to Google Calendar settings
2. Verify calendar exists
3. Copy the correct Calendar ID from settings
4. Update `.env` file
5. Restart application

### Slots API Returns Empty Array

**Problem:** Could be non-working day or all slots booked.

**Solution:**
1. Check if date is Monday-Friday (weekends return empty)
2. Check if date is in the past
3. Try different date
4. Check Google Calendar for existing events on that day

## Production Deployment

### Environment Variables

Add these to your production server environment:

```bash
GOOGLE_CLIENT_ID="production_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="production_client_secret"
GOOGLE_REFRESH_TOKEN="production_refresh_token"
GOOGLE_CALENDAR_ID="production_calendar_id@group.calendar.google.com"
GOOGLE_REDIRECT_URI="https://yourdomain.com/api/auth/google/callback"
```

### Security Considerations

1. **Never commit `.env` file** - already in `.gitignore`
2. **Use different credentials** for production and development
3. **Restrict OAuth redirect URIs** to your actual domain
4. **Disable setup endpoint** in production:
   - Delete `/api/calendar/setup/route.ts`, OR
   - Add authentication middleware, OR
   - Use environment variable to enable/disable

### Monitoring

Monitor these logs in production:

```
[Google Calendar] Creating event: ...
[Google Calendar] Event created: ...
[Google Calendar] Error creating event: ...
```

Set up alerts for repeated errors.

## API Endpoints

### Get Available Slots

```http
GET /api/calendar/slots?date=2026-02-05&duration=30
```

**Query Parameters:**
- `date` (required): Date in YYYY-MM-DD format
- `duration` (optional): Slot duration in minutes (default: 30)

**Response:**
```json
{
  "date": "2026-02-05",
  "duration": 30,
  "totalSlots": 16,
  "availableSlots": 12,
  "slots": [
    {
      "start": "08:00",
      "end": "08:30",
      "available": true
    },
    ...
  ]
}
```

### Setup OAuth (Development Only)

```http
GET /api/calendar/setup
```

Returns authorization URL for getting refresh token.

```http
POST /api/calendar/setup
Content-Type: application/json

{
  "code": "authorization_code_from_callback"
}
```

Returns refresh token to add to environment variables.

## Next Steps

After setup is complete:

1. ✅ Test with real bookings
2. ✅ Configure office hours if needed
3. ✅ Set up email notifications (separate feature)
4. ✅ Monitor calendar events in production
5. ✅ Train staff on Google Calendar interface

## Support

For issues or questions:

1. Check server logs for `[Google Calendar]` messages
2. Review this setup guide
3. Check Google Calendar API documentation
4. Verify all environment variables are set correctly
