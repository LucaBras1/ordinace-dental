# Test IDs Guide - BookingForm

Pro snadnější E2E testování s Cypress/Playwright doporučuji přidat `data-testid` atributy.

---

## Co jsou data-testid?

Jsou to HTML atributy používané výhradně pro testování:

```tsx
<button data-testid="submit-button">Submit</button>
```

**Výhody:**
- Nezávislé na textu (můžete změnit text bez rozbití testů)
- Nezávislé na CSS třídách (refactoring designu nerozbije testy)
- Explicitní označení testovatelných elementů

---

## Doporučené data-testid pro BookingForm

### Progress Bar

```tsx
// Kroužky
<div data-testid="progress-step-1">1</div>
<div data-testid="progress-step-2">2</div>
<div data-testid="progress-step-3">3</div>
<div data-testid="progress-step-4">4</div>
```

### Krok 1: Služby

```tsx
// Loading skeleton
<div data-testid="service-skeleton" className="..." />

// Služební karta
<button
  data-testid="service-card"
  data-service-id={service.id}
  onClick={...}
>
  {/* ... */}
</button>

// Error state
<div data-testid="services-error">Error message</div>
```

### Krok 2: Termín

```tsx
// DateTimePicker wrapper
<div data-testid="datetime-picker">
  <DateTimePicker {...props} />
</div>

// Time slot button (v DateTimePicker.tsx)
<button
  data-testid="time-slot"
  data-time={slot.time}
  data-available={slot.available}
>
  {slot.time}
</button>

// Loading indicator
<div data-testid="slots-loading">Načítám...</div>
```

### Krok 3: Kontakt

```tsx
// Inputs už mají name, ale můžete přidat i data-testid
<Input
  data-testid="contact-name"
  name="name"
  {...props}
/>

<Input
  data-testid="contact-phone"
  name="phone"
  {...props}
/>

<Input
  data-testid="contact-email"
  name="email"
  {...props}
/>

<Textarea
  data-testid="contact-note"
  name="note"
  {...props}
/>
```

### Krok 4: Souhrn

```tsx
// Summary sections
<div data-testid="summary-service">...</div>
<div data-testid="summary-datetime">...</div>
<div data-testid="summary-contact">...</div>
<div data-testid="summary-price">...</div>

// GDPR checkbox
<input
  data-testid="gdpr-consent"
  type="checkbox"
  {...props}
/>
```

### Navigace

```tsx
// Back button
<Button
  data-testid="button-back"
  onClick={goToPrevStep}
>
  Zpět
</Button>

// Next/Continue button
<Button
  data-testid="button-next"
  onClick={goToNextStep}
>
  Pokračovat
</Button>

// Submit button
<Button
  data-testid="button-submit"
  type="submit"
>
  Přejít na platbu
</Button>
```

### Error messages

```tsx
// Global error banner
<div data-testid="error-banner">
  {error}
</div>

// Field errors
<p data-testid="error-service">Vyberte prosím službu</p>
<p data-testid="error-date">Vyberte prosím datum</p>
<p data-testid="error-time">Vyberte prosím čas</p>
<p data-testid="error-name">...</p>
<p data-testid="error-phone">...</p>
<p data-testid="error-email">...</p>
<p data-testid="error-gdpr">...</p>
```

---

## Implementace v BookingForm.tsx

### Příklad 1: Progress Bar

**Před:**
```tsx
<div className={cn('flex h-10 w-10 ...')}>
  {step}
</div>
```

**Po:**
```tsx
<div
  data-testid={`progress-step-${step}`}
  className={cn('flex h-10 w-10 ...')}
>
  {step}
</div>
```

### Příklad 2: Služební karta

**Před:**
```tsx
<button
  key={service.id}
  onClick={() => setSelectedServiceId(service.id)}
  className={...}
>
  {/* content */}
</button>
```

**Po:**
```tsx
<button
  key={service.id}
  data-testid="service-card"
  data-service-id={service.id}
  onClick={() => setSelectedServiceId(service.id)}
  className={...}
>
  {/* content */}
</button>
```

### Příklad 3: Time slot (v DateTimePicker.tsx)

**Před:**
```tsx
<button
  onClick={() => onTimeChange(slot.time)}
  className={...}
>
  {slot.time}
</button>
```

**Po:**
```tsx
<button
  data-testid="time-slot"
  data-time={slot.time}
  data-available={slot.available}
  onClick={() => onTimeChange(slot.time)}
  className={...}
>
  {slot.time}
</button>
```

---

## Použití v testech

### Cypress příklad

```typescript
// Select by data-testid
cy.get('[data-testid="service-card"]').first().click()

// Select by specific service ID
cy.get('[data-testid="service-card"][data-service-id="srv_1"]').click()

// Check progress
cy.get('[data-testid="progress-step-2"]').should('have.class', 'bg-primary-500')

// Select time slot
cy.get('[data-testid="time-slot"][data-available="true"]').first().click()

// Fill contact form
cy.get('[data-testid="contact-name"]').type('Jan Novák')
cy.get('[data-testid="contact-email"]').type('jan@example.cz')

// Check GDPR
cy.get('[data-testid="gdpr-consent"]').check()

// Submit
cy.get('[data-testid="button-submit"]').click()
```

### Playwright příklad

```typescript
// Select service
await page.getByTestId('service-card').first().click()

// Select time
await page.getByTestId('time-slot').filter({ hasData: { available: 'true' } }).first().click()

// Fill form
await page.getByTestId('contact-name').fill('Jan Novák')

// Submit
await page.getByTestId('button-submit').click()
```

---

## Best Practices

### ✅ DO

```tsx
// Descriptive, semantic names
<button data-testid="button-submit">Submit</button>

// Use kebab-case
<div data-testid="contact-form">...</div>

// Add data attributes for dynamic content
<button
  data-testid="service-card"
  data-service-id={service.id}
/>
```

### ❌ DON'T

```tsx
// Too generic
<button data-testid="button1">...</button>

// Using classes for testing (fragile)
cy.get('.bg-primary-500').click()

// Using text content (fragile)
cy.contains('Pokračovat').click() // Breaks if text changes
```

---

## Kompletní příklad

```tsx
// BookingForm.tsx excerpt
export function BookingForm() {
  // ...

  return (
    <div className="...">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                data-testid={`progress-step-${step}`}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  currentStep >= step ? 'bg-primary-500' : 'bg-gray-200'
                )}
              >
                {step}
              </div>
              {/* ... */}
            </div>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div data-testid="error-banner" className="...">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Services */}
        {currentStep === 1 && (
          <div>
            {isLoadingServices ? (
              <div data-testid="service-skeleton" className="...">
                {/* skeleton */}
              </div>
            ) : (
              services.map((service) => (
                <button
                  key={service.id}
                  data-testid="service-card"
                  data-service-id={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                >
                  {service.name}
                </button>
              ))
            )}

            {errors.service && (
              <p data-testid="error-service">{errors.service}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <Button
            data-testid="button-back"
            onClick={goToPrevStep}
          >
            Zpět
          </Button>

          {currentStep < 4 ? (
            <Button
              data-testid="button-next"
              onClick={goToNextStep}
            >
              Pokračovat
            </Button>
          ) : (
            <Button
              data-testid="button-submit"
              type="submit"
            >
              Přejít na platbu
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
```

---

## Výsledek

Po přidání data-testid budete mít:

✅ **Spolehlivější testy** - nezávislé na textu a CSS
✅ **Snadnější debugging** - rychlé nalezení elementů
✅ **Lepší CI/CD** - stabilnější automatizované testy
✅ **Dokumentace** - testid slouží jako dokumentace UI

---

## Next Steps

1. Přidejte data-testid do `BookingForm.tsx`
2. Přidejte data-testid do `DateTimePicker.tsx`
3. Update Cypress testy v `cypress/e2e/booking-flow.cy.ts`
4. Spusťte testy: `npx cypress run`

**Tip:** Přidávejte data-testid postupně - začněte u kritických elementů (buttons, inputs, cards).
