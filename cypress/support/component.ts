/**
 * Cypress Component Testing Support File
 *
 * This file is processed and loaded automatically before your component test files.
 *
 * @see https://docs.cypress.io/guides/component-testing/component-test-setup
 */

// Import commands
import './commands'

// Import Testing Library commands
import '@testing-library/cypress/add-commands'

// Import mount function for React
import { mount } from 'cypress/react18'

// Augment the Cypress namespace to include type definitions for mount command
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add('mount', mount)
