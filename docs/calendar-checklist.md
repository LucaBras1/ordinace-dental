# Google Calendar Integration - Setup Checklist

## Pre-Setup

- [ ] Google Account with Calendar access
- [ ] Access to Google Cloud Console
- [ ] Project directory accessible
- [ ] `.env` file exists

## Google Cloud Console Setup

### 1. Create Project
- [ ] Visit https://console.cloud.google.com/
- [ ] Create new project: "Ordinace Booking System"
- [ ] Note project ID

### 2. Enable API
- [ ] Navigate to **APIs & Services** > **Library**
- [ ] Search "Google Calendar API"
- [ ] Click **Enable**

### 3. Configure OAuth Consent
- [ ] Go to **APIs & Services** > **OAuth consent screen**
- [ ] User Type: **External**
- [ ] App name: "Ordinace Booking System"
- [ ] User support email: ___________________
- [ ] Developer contact email: ___________________
- [ ] Add scope: `https://www.googleapis.com/auth/calendar`
- [ ] Add test user: ___________________
- [ ] Click **Save and Continue**

### 4. Create OAuth Credentials
- [ ] Go to **APIs & Services** > **Credentials**
- [ ] Click **Create Credentials** > **OAuth client ID**
- [ ] Application type: **Web application**
- [ ] Name: "Ordinace Calendar Integration"
- [ ] Authorized redirect URIs:
  - [ ] Development: `http://localhost:3000/api/auth/google/callback`
  - [ ] Production: `https://yourdomain.com/api/auth/google/callback`
- [ ] Click **Create**
- [ ] **Copy Client ID:** ___________________
- [ ] **Copy Client Secret:** ___________________

## Google Calendar Setup

### 5. Create Dedicated Calendar
- [ ] Visit https://calendar.google.com/
- [ ] Click **+** next to "Other calendars"
- [ ] Select **Create new calendar**
- [ ] Name: "Ordinace Rezervace"
- [ ] Time zone: **Europe/Prague**
- [ ] Click **Create calendar**

### 6. Get Calendar ID
- [ ] Find calendar in list (may take a minute to appear)
- [ ] Click three dots (**⋮**) next to calendar name
- [ ] Select **Settings and sharing**
- [ ] Scroll to **Integrate calendar** section
- [ ] **Copy Calendar ID:** ___________________

### 7. Configure Calendar Sharing (Optional)
- [ ] In calendar settings, go to **Share with specific people**
- [ ] Add staff members with appropriate permissions
- [ ] Set permissions (see events, make changes, etc.)

## Local Environment Setup

### 8. Configure Environment Variables
- [ ] Open `.env` file in project root
- [ ] Add Google credentials:

```bash
GOOGLE_CLIENT_ID="paste_client_id_here"
GOOGLE_CLIENT_SECRET="paste_client_secret_here"
GOOGLE_CALENDAR_ID="paste_calendar_id_here"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

### 9. Start Development Server
```bash
npm run dev
```
- [ ] Server starts successfully
- [ ] No errors in console

### 10. Obtain Refresh Token

#### Step 1: Get Authorization URL
- [ ] Visit: http://localhost:3000/api/calendar/setup
- [ ] Copy authorization URL from response
- [ ] Open URL in browser

#### Step 2: Authorize Application
- [ ] Sign in with Google account (must be test user if app not published)
- [ ] Click **Continue** on consent screen
- [ ] Grant calendar access permissions
- [ ] You'll be redirected to callback (may show error - this is OK)

#### Step 3: Copy Authorization Code
- [ ] Look at browser URL bar
- [ ] Find `code=` parameter
- [ ] Copy entire code (everything between `code=` and `&scope`)
- [ ] Example: `4/0AY0e-g7abc123...xyz789`

#### Step 4: Exchange Code for Refresh Token
Using curl (Git Bash on Windows):
```bash
curl -X POST http://localhost:3000/api/calendar/setup \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"paste_your_code_here\"}"
```

Or using PowerShell:
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/calendar/setup" `
  -ContentType "application/json" `
  -Body '{"code":"paste_your_code_here"}'
```

- [ ] Request successful
- [ ] **Copy refresh token from response:** ___________________

### 11. Add Refresh Token to .env
- [ ] Add to `.env`:
```bash
GOOGLE_REFRESH_TOKEN="paste_refresh_token_here"
```
- [ ] Save file

### 12. Restart Development Server
```bash
# Stop server (Ctrl+C)
npm run dev
```
- [ ] Server restarts successfully
- [ ] No calendar-related errors in console

## Testing

### 13. Run Test Script
```bash
npm run calendar:test
```

Expected output:
- [ ] ✅ Calendar enabled: true
- [ ] ✅ Found available slots
- [ ] ✅ Test event created
- [ ] ✅ Events listed
- [ ] ✅ Test event deleted
- [ ] ✅ All tests passed

### 14. Test API Endpoints

#### Check Setup Status
```bash
curl http://localhost:3000/api/calendar/setup
```
- [ ] Returns: `"configured": true`

#### Check Available Slots
```bash
curl "http://localhost:3000/api/calendar/slots?date=2026-02-05&duration=30"
```
- [ ] Returns slots array
- [ ] Shows available/unavailable slots

### 15. Test with Real Booking

#### Create Test Booking
- [ ] Create booking via frontend/API
- [ ] Complete payment (use test mode)
- [ ] Check database: booking.status = 'PAID'
- [ ] Check database: booking.googleEventId exists

#### Verify in Google Calendar
- [ ] Open Google Calendar
- [ ] Find "Ordinace Rezervace" calendar
- [ ] Event appears with correct:
  - [ ] Date and time
  - [ ] Title: "[Service] - [Name]"
  - [ ] Description with contact info
  - [ ] Green color (PAID status)
  - [ ] Reminders set

### 16. Test Cancellation
- [ ] Cancel the test booking
- [ ] Check Google Calendar
- [ ] Event should be deleted

## Production Deployment

### 17. Create Production Credentials

#### Update OAuth Consent Screen
- [ ] Add production domain
- [ ] Submit for verification (if needed)

#### Create Production OAuth Client
- [ ] Create new OAuth client ID
- [ ] Add production redirect URI
- [ ] Copy new Client ID and Secret

### 18. Production Environment Variables
On production server, set:
```bash
GOOGLE_CLIENT_ID="production_client_id"
GOOGLE_CLIENT_SECRET="production_client_secret"
GOOGLE_CALENDAR_ID="production_calendar_id"
GOOGLE_REFRESH_TOKEN="production_refresh_token"
GOOGLE_REDIRECT_URI="https://yourdomain.com/api/auth/google/callback"
```

### 19. Security
- [ ] Remove or protect `/api/calendar/setup` endpoint
- [ ] Verify `.env` is in `.gitignore`
- [ ] Never commit credentials to git
- [ ] Use different credentials for dev/prod
- [ ] Restrict OAuth redirect URIs

### 20. Production Testing
- [ ] Deploy application
- [ ] Test booking creation
- [ ] Verify event created in calendar
- [ ] Test booking cancellation
- [ ] Verify event deleted from calendar
- [ ] Check email notifications

## Monitoring

### 21. Set Up Logging
- [ ] Configure log aggregation (optional)
- [ ] Monitor for `[Google Calendar]` log messages
- [ ] Set up alerts for repeated errors

### 22. Check Google Cloud Console
- [ ] Monitor API quota usage
- [ ] Check for API errors
- [ ] Review OAuth consent screen status

## Troubleshooting

### Common Issues

#### "Calendar not configured"
- [ ] All 4 environment variables set?
- [ ] Restart server after adding variables?
- [ ] Variables in correct format?

#### "Invalid refresh token"
- [ ] Token copied completely?
- [ ] Using correct Google account?
- [ ] Try obtaining new token

#### Events not appearing
- [ ] Booking status is PAID?
- [ ] Calendar ID correct?
- [ ] Check server logs
- [ ] Webhook processing successfully?

#### Build fails
- [ ] Should NOT happen (build-time guard)
- [ ] Check if googleapis installed
- [ ] Verify imports are correct

## Documentation Reference

- [ ] Read `docs/google-calendar-setup.md` - Full setup guide
- [ ] Read `docs/calendar-quick-reference.md` - Quick commands
- [ ] Read `src/lib/README-calendar.md` - API documentation
- [ ] Read `CALENDAR_INTEGRATION.md` - Implementation details

## Training

### Staff Training
- [ ] Show how to view calendar
- [ ] Explain color coding
- [ ] How to manually add/edit events
- [ ] How to handle conflicts
- [ ] Calendar sharing permissions

### Customer Communication
- [ ] Update website with calendar features
- [ ] Email templates mention automatic reminders
- [ ] FAQ about calendar invites
- [ ] Privacy policy updated (calendar data)

## Maintenance

### Regular Checks
- [ ] Monthly: Check API quota usage
- [ ] Monthly: Review error logs
- [ ] Quarterly: Test OAuth flow still works
- [ ] Yearly: Review calendar settings

### Updates
- [ ] Keep `googleapis` package updated
- [ ] Monitor for Google Calendar API changes
- [ ] Test after major Next.js updates

## Sign-Off

Setup completed by: ___________________

Date: ___________________

Verified by: ___________________

Date: ___________________

Notes:
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

**Next Steps After Completion:**
1. ✅ Archive this checklist
2. ✅ Update project documentation
3. ✅ Train staff on calendar usage
4. ✅ Monitor first week of production usage
5. ✅ Gather feedback and iterate
