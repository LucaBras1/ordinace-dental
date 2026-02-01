/**
 * Google Calendar Integration Test Script
 *
 * This script tests the Google Calendar integration by:
 * 1. Checking if calendar is enabled
 * 2. Getting available slots for today
 * 3. Creating a test event
 * 4. Listing events
 * 5. Deleting the test event
 *
 * Usage:
 *   npx tsx scripts/calendar-test.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '../.env') })

import {
  isCalendarEnabled,
  getAvailableSlots,
  createCalendarEvent,
  listEvents,
  deleteCalendarEvent,
} from '../src/lib/google-calendar'

async function testCalendarIntegration() {
  console.log('🧪 Google Calendar Integration Test\n')

  // Test 1: Check if calendar is enabled
  console.log('1️⃣ Checking if calendar is enabled...')
  const enabled = isCalendarEnabled()
  console.log(`   ✅ Calendar enabled: ${enabled}\n`)

  if (!enabled) {
    console.error('❌ Google Calendar is not configured.')
    console.log('Please set the following environment variables:')
    console.log('  - GOOGLE_CLIENT_ID')
    console.log('  - GOOGLE_CLIENT_SECRET')
    console.log('  - GOOGLE_REFRESH_TOKEN')
    console.log('  - GOOGLE_CALENDAR_ID')
    console.log('\nSee docs/google-calendar-setup.md for setup instructions.')
    process.exit(1)
  }

  try {
    // Test 2: Get available slots for today
    console.log('2️⃣ Getting available slots for today...')
    const today = new Date()
    const slots = await getAvailableSlots(today, 30)
    const availableCount = slots.filter(s => s.available).length
    console.log(`   ✅ Found ${slots.length} total slots, ${availableCount} available\n`)

    if (slots.length > 0) {
      console.log('   First 5 slots:')
      slots.slice(0, 5).forEach(slot => {
        const status = slot.available ? '✅' : '❌'
        console.log(`   ${status} ${slot.start} - ${slot.end}`)
      })
      console.log()
    }

    // Test 3: Create a test event
    console.log('3️⃣ Creating test calendar event...')
    const testBooking = {
      id: 'test-booking-' + Date.now(),
      customerName: 'Test Patient',
      customerEmail: 'test@example.com',
      customerPhone: '+420 123 456 789',
      appointmentDate: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      appointmentTime: '14:00',
      duration: 30,
      serviceName: 'Test Service (Will Be Deleted)',
      notes: 'This is a test event created by calendar-test.ts script',
      isFirstVisit: true,
      status: 'PAID',
    }

    const eventId = await createCalendarEvent(testBooking)
    console.log(`   ✅ Event created with ID: ${eventId}\n`)

    // Test 4: List events
    console.log('4️⃣ Listing events for next 7 days...')
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    const events = await listEvents(startDate, endDate)
    console.log(`   ✅ Found ${events.length} events\n`)

    if (events.length > 0) {
      console.log('   Recent events:')
      events.slice(0, 5).forEach(event => {
        const start = new Date(event.start)
        console.log(`   - ${event.summary}`)
        console.log(`     ${start.toLocaleString('cs-CZ')}`)
      })
      console.log()
    }

    // Test 5: Delete the test event
    console.log('5️⃣ Cleaning up - deleting test event...')
    await deleteCalendarEvent(eventId)
    console.log(`   ✅ Test event deleted\n`)

    console.log('✅ All tests passed! Google Calendar integration is working correctly.')

  } catch (error) {
    console.error('\n❌ Test failed with error:')
    console.error(error)
    process.exit(1)
  }
}

// Run tests
testCalendarIntegration()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
