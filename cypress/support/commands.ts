/**
 * Cypress Custom Commands
 *
 * Custom commands for common test operations.
 *
 * @see https://docs.cypress.io/api/cypress-api/custom-commands
 */

// ============================================
// BOOKING FLOW COMMANDS
// ============================================

/**
 * Select a service in the booking wizard
 */
Cypress.Commands.add('selectService', (index: number = 0) => {
  cy.get('[data-testid="service-card"]')
    .eq(index)
    .should('be.visible')
    .click()
})

/**
 * Navigate to next step in booking wizard
 */
Cypress.Commands.add('goToNextStep', () => {
  cy.contains('button', 'Pokracovat').click()
})

/**
 * Navigate to previous step in booking wizard
 */
Cypress.Commands.add('goToPreviousStep', () => {
  cy.contains('button', 'Zpet').click()
})

/**
 * Select a date in the calendar
 */
Cypress.Commands.add('selectDate', (dayOffset: number = 1) => {
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + dayOffset)
  const day = targetDate.getDate()

  cy.contains('button', day.toString()).first().click()
})

/**
 * Select a time slot
 */
Cypress.Commands.add('selectTimeSlot', (index: number = 0) => {
  cy.get('[data-testid="time-slot"]')
    .filter(':not([disabled])')
    .eq(index)
    .click()
})

/**
 * Fill contact form with test data
 */
Cypress.Commands.add(
  'fillContactForm',
  (data?: { name?: string; phone?: string; email?: string; note?: string }) => {
    const defaults = {
      name: 'Test User',
      phone: '+420 123 456 789',
      email: 'test@example.cz',
      note: '',
    }
    const formData = { ...defaults, ...data }

    cy.get('input[name="name"]').clear().type(formData.name)
    cy.get('input[name="phone"]').clear().type(formData.phone)
    cy.get('input[name="email"]').clear().type(formData.email)

    if (formData.note) {
      cy.get('textarea[name="note"]').clear().type(formData.note)
    }
  }
)

/**
 * Accept GDPR consent
 */
Cypress.Commands.add('acceptGdpr', () => {
  cy.get('input[type="checkbox"]').check()
})

/**
 * Complete booking flow up to summary step
 */
Cypress.Commands.add(
  'completeBookingToSummary',
  (contactData?: { name?: string; phone?: string; email?: string }) => {
    // Step 1: Select service
    cy.selectService(0)
    cy.goToNextStep()

    // Step 2: Select date and time
    cy.selectDate(1) // Tomorrow
    cy.selectTimeSlot(0)
    cy.goToNextStep()

    // Step 3: Fill contact form
    cy.fillContactForm(contactData)
    cy.goToNextStep()

    // Should be on step 4 - summary
    cy.contains('Souhrn rezervace').should('be.visible')
  }
)

// ============================================
// API MOCKING COMMANDS
// ============================================

/**
 * Mock services API response
 */
Cypress.Commands.add('mockServicesApi', (services?: unknown[]) => {
  const defaultServices = [
    {
      id: 'service-1',
      name: 'Dentalni hygiena',
      description: 'Profesionalni cisteni zubu',
      price: 150000, // 1500 Kc
      duration: 60,
      deposit: 50000, // 500 Kc
    },
    {
      id: 'service-2',
      name: 'Bezny vysetreni',
      description: 'Preventivni prohlidka',
      price: 80000, // 800 Kc
      duration: 30,
      deposit: 30000, // 300 Kc
    },
  ]

  cy.intercept('GET', '/api/services', {
    statusCode: 200,
    body: services || defaultServices,
  }).as('getServices')
})

/**
 * Mock availability API response
 */
Cypress.Commands.add('mockAvailabilityApi', (slots?: unknown[]) => {
  const defaultSlots = [
    { start: '09:00', end: '09:30', available: true },
    { start: '09:30', end: '10:00', available: true },
    { start: '10:00', end: '10:30', available: false },
    { start: '10:30', end: '11:00', available: true },
    { start: '14:00', end: '14:30', available: true },
    { start: '14:30', end: '15:00', available: true },
  ]

  cy.intercept('GET', '/api/availability*', {
    statusCode: 200,
    body: slots || defaultSlots,
  }).as('getAvailability')
})

/**
 * Mock booking creation API
 */
Cypress.Commands.add('mockBookingApi', (response?: unknown) => {
  const defaultResponse = {
    success: true,
    bookingId: 'test-booking-123',
    paymentUrl: 'https://payments.comgate.cz/client/instructions/index?id=TEST',
  }

  cy.intercept('POST', '/api/bookings', {
    statusCode: 200,
    body: response || defaultResponse,
  }).as('createBooking')
})

// ============================================
// TYPE DECLARATIONS
// ============================================

declare global {
  namespace Cypress {
    interface Chainable {
      // Booking flow commands
      selectService(index?: number): Chainable<void>
      goToNextStep(): Chainable<void>
      goToPreviousStep(): Chainable<void>
      selectDate(dayOffset?: number): Chainable<void>
      selectTimeSlot(index?: number): Chainable<void>
      fillContactForm(data?: {
        name?: string
        phone?: string
        email?: string
        note?: string
      }): Chainable<void>
      acceptGdpr(): Chainable<void>
      completeBookingToSummary(contactData?: {
        name?: string
        phone?: string
        email?: string
      }): Chainable<void>

      // API mocking commands
      mockServicesApi(services?: unknown[]): Chainable<void>
      mockAvailabilityApi(slots?: unknown[]): Chainable<void>
      mockBookingApi(response?: unknown): Chainable<void>
    }
  }
}

export {}
