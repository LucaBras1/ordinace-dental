/**
 * Cypress E2E Tests - Booking Flow
 *
 * Run with: npx cypress open
 * or: npx cypress run
 */

describe('Booking Flow - E2E', () => {
  beforeEach(() => {
    // Visit booking page
    cy.visit('/objednavka')

    // Wait for page load
    cy.get('h1').should('be.visible')
  })

  describe('Happy Path - Complete Booking', () => {
    it('should complete full booking flow successfully', () => {
      // Step 1: Service Selection
      cy.contains('Vyberte službu').should('be.visible')

      // Wait for services to load
      cy.get('[data-testid="service-card"]', { timeout: 10000 })
        .should('be.visible')
        .first()
        .click()

      // Check service is selected (highlighted)
      cy.get('[data-testid="service-card"]')
        .first()
        .should('have.class', 'border-primary-500')

      // Progress bar should show step 1 active
      cy.get('[data-testid="progress-step-1"]').should('have.class', 'bg-primary-500')

      // Click next
      cy.contains('button', 'Pokračovat').click()

      // Step 2: Date & Time Selection
      cy.contains('Vyberte termín').should('be.visible')

      // Progress bar should show step 2 active
      cy.get('[data-testid="progress-step-2"]').should('have.class', 'bg-primary-500')

      // Select tomorrow's date
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowDate = tomorrow.getDate()

      cy.contains('button', tomorrowDate.toString())
        .first()
        .click()

      // Wait for time slots to load
      cy.contains('Dostupné časy', { timeout: 10000 }).should('be.visible')

      // Select first available time slot
      cy.get('[data-testid="time-slot"]')
        .filter(':not([disabled])')
        .first()
        .click()

      // Click next
      cy.contains('button', 'Pokračovat').click()

      // Step 3: Contact Information
      cy.contains('Kontaktní údaje').should('be.visible')

      // Fill form
      cy.get('input[name="name"]').type('Jan Testovací')
      cy.get('input[name="phone"]').type('+420 123 456 789')
      cy.get('input[name="email"]').type('jan.testovaci@example.cz')
      cy.get('textarea[name="note"]').type('Testovací poznámka')

      // Click next
      cy.contains('button', 'Pokračovat').click()

      // Step 4: Summary & Payment
      cy.contains('Souhrn rezervace').should('be.visible')

      // Verify summary data
      cy.contains('Jan Testovací').should('be.visible')
      cy.contains('+420 123 456 789').should('be.visible')
      cy.contains('jan.testovaci@example.cz').should('be.visible')

      // Accept GDPR
      cy.get('input[type="checkbox"]').check()

      // Submit button should be enabled
      cy.contains('button', 'Přejít na platbu').should('not.be.disabled')

      // Click submit
      cy.contains('button', 'Přejít na platbu').click()

      // Should redirect to payment URL (or mock)
      // cy.url().should('include', 'payment')
    })
  })

  describe('Validation Tests', () => {
    it('should not allow proceeding without service selection', () => {
      // Try to click next without selecting service
      cy.contains('button', 'Pokračovat').click()

      // Should show error
      cy.contains('Vyberte prosím službu').should('be.visible')

      // Should stay on step 1
      cy.contains('Vyberte službu').should('be.visible')
    })

    it('should validate phone number format', () => {
      // Navigate to step 3 first
      navigateToStep3()

      // Enter invalid phone
      cy.get('input[name="phone"]').type('123456')
      cy.get('input[name="phone"]').blur()

      // Should show error
      cy.contains('Zadejte telefon ve formátu +420').should('be.visible')
    })

    it('should validate email format', () => {
      navigateToStep3()

      // Enter invalid email
      cy.get('input[name="email"]').type('invalid-email')
      cy.get('input[name="email"]').blur()

      // Should show error
      cy.contains('Zadejte platnou e-mailovou adresu').should('be.visible')
    })

    it('should require GDPR consent', () => {
      navigateToStep4()

      // Fill contact info but don't check GDPR
      cy.get('input[name="name"]').type('Test User')
      cy.get('input[name="phone"]').type('+420 123 456 789')
      cy.get('input[name="email"]').type('test@example.cz')

      // GDPR checkbox should be unchecked
      cy.get('input[type="checkbox"]').should('not.be.checked')

      // Submit button should be disabled
      cy.contains('button', 'Přejít na platbu').should('be.disabled')
    })
  })

  describe('Navigation Tests', () => {
    it('should allow going back to previous step', () => {
      // Select service and go to step 2
      cy.get('[data-testid="service-card"]').first().click()
      cy.contains('button', 'Pokračovat').click()

      // Should be on step 2
      cy.contains('Vyberte termín').should('be.visible')

      // Click back
      cy.contains('button', 'Zpět').click()

      // Should be back on step 1
      cy.contains('Vyberte službu').should('be.visible')

      // Service should still be selected
      cy.get('[data-testid="service-card"]')
        .first()
        .should('have.class', 'border-primary-500')
    })

    it('should preserve form data when navigating back and forth', () => {
      navigateToStep3()

      // Fill contact form
      cy.get('input[name="name"]').type('Test User')
      cy.get('input[name="email"]').type('test@example.cz')

      // Go back
      cy.contains('button', 'Zpět').click()

      // Go forward again
      cy.contains('button', 'Pokračovat').click()

      // Data should be preserved
      cy.get('input[name="name"]').should('have.value', 'Test User')
      cy.get('input[name="email"]').should('have.value', 'test@example.cz')
    })
  })

  describe('Progress Bar', () => {
    it('should update progress bar correctly', () => {
      // Step 1 should be active
      cy.get('[data-testid="progress-step-1"]').should('have.class', 'bg-primary-500')
      cy.get('[data-testid="progress-step-2"]').should('have.class', 'bg-gray-200')

      // Navigate to step 2
      cy.get('[data-testid="service-card"]').first().click()
      cy.contains('button', 'Pokračovat').click()

      // Step 1 and 2 should be active
      cy.get('[data-testid="progress-step-1"]').should('have.class', 'bg-primary-500')
      cy.get('[data-testid="progress-step-2"]').should('have.class', 'bg-primary-500')
      cy.get('[data-testid="progress-step-3"]').should('have.class', 'bg-gray-200')
    })
  })

  describe('Loading States', () => {
    it('should show loading skeleton while services load', () => {
      cy.visit('/objednavka')

      // Should show skeleton
      cy.get('[data-testid="service-skeleton"]').should('be.visible')

      // Wait for services to load
      cy.get('[data-testid="service-card"]', { timeout: 10000 }).should('be.visible')

      // Skeleton should be gone
      cy.get('[data-testid="service-skeleton"]').should('not.exist')
    })

    it('should show loading indicator when fetching availability', () => {
      navigateToStep2()

      // Select a date
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      cy.contains('button', tomorrow.getDate().toString()).first().click()

      // Should show loading text
      cy.contains('Načítám dostupné časy').should('be.visible')

      // Wait for slots to load
      cy.get('[data-testid="time-slot"]', { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should show error banner when API fails', () => {
      // Intercept API and force failure
      cy.intercept('GET', '/api/services', {
        statusCode: 500,
        body: { error: 'Server error' },
      })

      cy.visit('/objednavka')

      // Should show error message
      cy.contains(/Chyba při načítání služeb/i, { timeout: 10000 }).should('be.visible')
    })

    it('should handle unavailable time slot', () => {
      // Intercept booking API with conflict
      cy.intercept('POST', '/api/bookings', {
        statusCode: 409,
        body: { error: 'Termín již není dostupný' },
      })

      navigateToStep4Complete()

      // Submit
      cy.contains('button', 'Přejít na platbu').click()

      // Should show error
      cy.contains('Termín již není dostupný').should('be.visible')
    })
  })

  describe('Responsive Design', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1280, height: 720 },
    ]

    viewports.forEach((viewport) => {
      it(`should work correctly on ${viewport.name}`, () => {
        cy.viewport(viewport.width, viewport.height)
        cy.visit('/objednavka')

        // Basic flow should work
        cy.get('[data-testid="service-card"]').first().click()
        cy.contains('button', 'Pokračovat').click()
        cy.contains('Vyberte termín').should('be.visible')
      })
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.visit('/objednavka')

      // Tab through elements
      cy.get('body').tab()
      cy.focused().should('have.attr', 'data-testid', 'service-card')

      // Select with Enter
      cy.focused().type('{enter}')

      // Navigate to next button
      cy.get('button').contains('Pokračovat').focus().type('{enter}')

      // Should advance to step 2
      cy.contains('Vyberte termín').should('be.visible')
    })

    it('should have proper ARIA labels', () => {
      cy.visit('/objednavka')

      // Check for form role
      cy.get('form').should('exist')

      // Check required fields have aria-required
      navigateToStep3()
      cy.get('input[name="name"]').should('have.attr', 'aria-required', 'true')
      cy.get('input[name="email"]').should('have.attr', 'aria-required', 'true')
    })
  })
})

/**
 * Helper Functions
 */

function navigateToStep2() {
  cy.get('[data-testid="service-card"]').first().click()
  cy.contains('button', 'Pokračovat').click()
  cy.contains('Vyberte termín').should('be.visible')
}

function navigateToStep3() {
  navigateToStep2()

  // Select date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  cy.contains('button', tomorrow.getDate().toString()).first().click()

  // Select time
  cy.get('[data-testid="time-slot"]')
    .filter(':not([disabled])')
    .first()
    .click()

  cy.contains('button', 'Pokračovat').click()
  cy.contains('Kontaktní údaje').should('be.visible')
}

function navigateToStep4() {
  navigateToStep3()

  cy.get('input[name="name"]').type('Test User')
  cy.get('input[name="phone"]').type('+420 123 456 789')
  cy.get('input[name="email"]').type('test@example.cz')

  cy.contains('button', 'Pokračovat').click()
  cy.contains('Souhrn rezervace').should('be.visible')
}

function navigateToStep4Complete() {
  navigateToStep4()
  cy.get('input[type="checkbox"]').check()
}
