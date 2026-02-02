/**
 * Cypress E2E Support File
 *
 * This file is processed and loaded automatically before your test files.
 * Put global configuration and behavior that modifies Cypress here.
 *
 * @see https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Support-file
 */

// Import commands
import './commands'

// Import Testing Library commands
import '@testing-library/cypress/add-commands'

// Prevent Cypress from failing tests on uncaught exceptions from the app
Cypress.on('uncaught:exception', (err, runnable) => {
  // Log the error for debugging
  console.error('Uncaught exception:', err.message)

  // Return false to prevent the error from failing the test
  // This is useful for Next.js apps that may throw hydration errors
  // or other non-critical errors during development
  return false
})

// Configure viewport for mobile tests
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport(375, 667) // iPhone SE
})

// Configure viewport for tablet tests
Cypress.Commands.add('setTabletViewport', () => {
  cy.viewport(768, 1024) // iPad
})

// Configure viewport for desktop tests
Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720) // Desktop
})

// Before each test, wait for app to be ready
beforeEach(() => {
  // Clear localStorage and sessionStorage
  cy.window().then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
})

// Global type declarations for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Set viewport to mobile size (375x667)
       */
      setMobileViewport(): Chainable<void>

      /**
       * Set viewport to tablet size (768x1024)
       */
      setTabletViewport(): Chainable<void>

      /**
       * Set viewport to desktop size (1280x720)
       */
      setDesktopViewport(): Chainable<void>
    }
  }
}
