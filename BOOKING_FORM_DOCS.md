# BookingForm.tsx - Dokumentace

## Přehled

Multi-step wizard formulář pro rezervaci služeb v dentální ordinaci s platbou kauce.

**Soubor:** `src/app/objednavka/BookingForm.tsx`

---

## Funkcionality

### 4-krokový wizard

1. **Krok 1: Výběr služby**
   - Načtení služeb z API `/api/services`
   - Zobrazení ceny a výše kauce
   - Doba trvání služby
   - Skeleton loading state

2. **Krok 2: Výběr termínu**
   - Interaktivní kalendář (DateTimePicker)
   - Načtení dostupnosti z API `/api/availability?date=YYYY-MM-DD`
   - Dynamické načítání časových slotů
   - Indikátor načítání

3. **Krok 3: Kontaktní údaje**
   - Jméno a příjmení
   - Telefon (validace +420 formátu)
   - E-mail (validace formátu)
   - Poznámka (nepovinné)
   - Real-time validace s error messages

4. **Krok 4: Souhrn a platba**
   - Přehled všech zadaných údajů
   - Zobrazení celkové ceny a výše zálohy
   - GDPR souhlas (povinný)
   - Informace o platbě
   - Tlačítko pro přesměrování na platební bránu

---

## API Integrace

### GET `/api/services`

**Request:**
```typescript
GET /api/services
```

**Response:**
```typescript
interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  price: number // haléře (1000 = 10 Kč)
  depositAmount: number // haléře
  duration: number // minuty
}

// Response body
Service[]
```

**Příklad:**
```json
[
  {
    "id": "srv_1",
    "name": "Dentální hygiena",
    "slug": "dentalni-hygiena",
    "description": "Profesionální čištění zubů a péče o dásně",
    "price": 150000,
    "depositAmount": 50000,
    "duration": 60
  }
]
```

---

### GET `/api/availability`

**Request:**
```typescript
GET /api/availability?date=YYYY-MM-DD
```

**Query params:**
- `date` (required): ISO date string (např. `2026-02-15`)

**Response:**
```typescript
interface TimeSlot {
  time: string // HH:MM formát (např. "09:00")
  available: boolean
}

interface AvailabilityResponse {
  slots: TimeSlot[]
}
```

**Příklad:**
```json
{
  "slots": [
    { "time": "08:00", "available": true },
    { "time": "08:30", "available": false },
    { "time": "09:00", "available": true }
  ]
}
```

---

### POST `/api/bookings`

**Request:**
```typescript
interface BookingFormData {
  serviceId: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  name: string
  phone: string // +420 123 456 789
  email: string
  note: string
  gdprConsent: boolean
}

POST /api/bookings
Content-Type: application/json

{
  "serviceId": "srv_1",
  "date": "2026-02-15",
  "time": "09:00",
  "name": "Jan Novák",
  "phone": "+420 123 456 789",
  "email": "jan@example.cz",
  "note": "Mám alergii na...",
  "gdprConsent": true
}
```

**Success Response (200):**
```typescript
interface BookingResponse {
  id: string
  paymentUrl: string // URL platební brány
}

// Example
{
  "id": "booking_123",
  "paymentUrl": "https://payment.gateway.com/pay/xyz123"
}
```

**Error Response (4xx/5xx):**
```json
{
  "error": "Termín již není dostupný"
}
```

---

## Validace

### Krok 1 - Výběr služby
- ✅ Služba musí být vybrána

### Krok 2 - Termín
- ✅ Datum musí být vybráno
- ✅ Čas musí být vybrán

### Krok 3 - Kontaktní údaje
- ✅ **Jméno:** Nesmí být prázdné
- ✅ **Telefon:**
  - Nesmí být prázdný
  - Formát: `/^\+420\s?\d{3}\s?\d{3}\s?\d{3}$/`
  - Přijímá: `+420123456789` i `+420 123 456 789`
- ✅ **E-mail:**
  - Nesmí být prázdný
  - Validní e-mail: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Krok 4 - Souhrn
- ✅ GDPR souhlas musí být zaškrtnutý

---

## UI/UX Features

### Progress bar
- Vizuální indikace aktuálního kroku
- Zvýraznění dokončených kroků
- Popisky kroků pod progress barem

### Animace
- Použití `framer-motion` pro plynulé přechody mezi kroky
- `AnimatePresence` s `mode="wait"`
- Slide-in animace (opacity + x-offset)

### Loading states
- **Načítání služeb:** Skeleton placeholders (3 karty)
- **Načítání dostupnosti:** "Načítám dostupné časy..."
- **Odesílání formuláře:** Button s `isLoading` prop

### Error handling
- Globální error banner (červený alert)
- Inline validační chyby u inputů
- Error messages v češtině

### Responsive design
- Mobile-first přístup
- Grid layout pro inputs (2 sloupce na SM+)
- Optimalizované touch targets

---

## Komponenty použité

| Komponenta | Cesta | Použití |
|------------|-------|---------|
| `Button` | `@/components/ui/Button` | Navigace, submit |
| `Input` | `@/components/ui/Input` | Jméno, telefon, e-mail |
| `Textarea` | `@/components/ui/Textarea` | Poznámka |
| `DateTimePicker` | `@/components/booking/DateTimePicker` | Výběr data a času |

---

## Datové formáty

### Ceny
- **Backend:** Ceny jsou v **haléřích** (integer)
- **Frontend:** Zobrazení pomocí `formatPrice()` funkce
  ```typescript
  formatPrice(150000) // "1 500 Kč"
  ```

### Datum a čas
- **Date object → API:** `YYYY-MM-DD` (ISO split)
  ```typescript
  selectedDate.toISOString().split('T')[0]
  ```
- **API → Display:** `toLocaleDateString('cs-CZ')` s options
  ```typescript
  selectedDate.toLocaleDateString('cs-CZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  // "pátek 15. února 2026"
  ```

---

## Flow diagram

```
┌─────────────────┐
│ Krok 1: Služba  │
│ - Fetch services│
│ - Vyber službu  │
└────────┬────────┘
         │ [Pokračovat]
         ▼
┌─────────────────────┐
│ Krok 2: Termín      │
│ - Vyber datum       │
│ - Fetch availability│
│ - Vyber čas         │
└─────────┬───────────┘
          │ [Pokračovat]
          ▼
┌─────────────────────┐
│ Krok 3: Kontakt     │
│ - Zadej jméno       │
│ - Zadej telefon     │
│ - Zadej e-mail      │
│ - Poznámka (opt)    │
└─────────┬───────────┘
          │ [Pokračovat]
          ▼
┌─────────────────────────┐
│ Krok 4: Souhrn a platba │
│ - Zobraz souhrn         │
│ - GDPR souhlas          │
│ - [Přejít na platbu]    │
└─────────┬───────────────┘
          │ [Submit]
          ▼
┌─────────────────────────┐
│ POST /api/bookings      │
│ - Získej paymentUrl     │
│ - Redirect na payment   │
└─────────────────────────┘
```

---

## Error handling

### Síťové chyby (fetch)
```typescript
try {
  const response = await fetch('/api/services')
  if (!response.ok) {
    throw new Error('Nepodařilo se načíst služby')
  }
  // ...
} catch (err) {
  setError(err.message)
}
```

### Validační chyby
```typescript
const errors: Record<string, string> = {}

if (!name.trim()) {
  errors.name = 'Vyplňte prosím jméno a příjmení'
}

setErrors(errors)
```

### API errors při POST
```typescript
const response = await fetch('/api/bookings', { ... })

if (!response.ok) {
  const errorData = await response.json()
  throw new Error(errorData.error || 'Nepodařilo se vytvořit rezervaci')
}
```

---

## Accessibility

- ✅ Semantic HTML (`<form>`, `<label>`, `<button>`)
- ✅ `aria-invalid` na inputs s chybou
- ✅ `aria-describedby` pro error/helper text
- ✅ Required asterisk (*) u povinných polí
- ✅ Keyboard navigace (focus states z UI komponent)
- ✅ Screen reader friendly error messages

---

## Tailwind classes použité

### Layout
- `max-w-3xl mx-auto` - Omezení šířky formuláře
- `space-y-X` - Vertikální spacing
- `grid gap-5 sm:grid-cols-2` - Responsive grid

### Colors (custom design system)
- `bg-primary-500`, `text-primary-600` - Primární barva
- `bg-accent-600` - Akcent (záloha)
- `bg-error-50`, `text-error-500` - Chybové stavy
- `bg-blue-50`, `text-blue-700` - Info bannery

### Interactive states
- `hover:shadow-md`, `hover:border-primary-200`
- `active:bg-primary-100`
- `disabled:opacity-50`

---

## Možná vylepšení

### Pro budoucí iterace:
1. **Persistent state** - LocalStorage pro uložení rozpracovaného formuláře
2. **URL query params** - Pre-fill služby z URL (`?service=dentalni-hygiena`)
3. **Recap před platbou** - Možnost upravit jakýkoliv krok před platbou
4. **Multi-language** - i18n podpora (CZ/EN)
5. **Calendar busy indicator** - Vizuální zobrazení obsazenosti v kalendáři
6. **Email preview** - Náhled potvrzovacího e-mailu
7. **Alternative payment** - Možnost platby na místě (bez zálohy)
8. **Promo kódy** - Slevové kupóny

---

## Testing checklist

### Manuální testování:

**Krok 1:**
- [ ] Služby se načtou správně
- [ ] Loading skeleton se zobrazí
- [ ] Výběr služby zvýrazní kartu
- [ ] Error message při nenačtení služeb
- [ ] Validace: Nelze pokračovat bez výběru služby

**Krok 2:**
- [ ] Kalendář zobrazuje správný měsíc
- [ ] Víkendy jsou disabled
- [ ] Past dates jsou disabled
- [ ] Po výběru data se načtou sloty
- [ ] Vybraný slot je zvýrazněn
- [ ] Validace: Nelze pokračovat bez data/času

**Krok 3:**
- [ ] Validace prázdného jména
- [ ] Validace formátu telefonu
- [ ] Validace formátu e-mailu
- [ ] Poznámka je nepovinná
- [ ] Error messages se zobrazují správně
- [ ] Errors zmizí při opravě inputu

**Krok 4:**
- [ ] Souhrn zobrazuje všechny údaje
- [ ] Ceny jsou správně formátované
- [ ] Datum v českém formátu
- [ ] GDPR checkbox je required
- [ ] Submit button disabled bez GDPR
- [ ] Redirect na paymentUrl po úspěchu

**Navigace:**
- [ ] Tlačítko "Zpět" funguje
- [ ] Zpět zachovává zadaná data
- [ ] Progress bar se správně updatuje
- [ ] Animace přechodů jsou plynulé

**Responsive:**
- [ ] Mobile < 640px
- [ ] Tablet 640px - 1024px
- [ ] Desktop > 1024px

---

## Typové definice

```typescript
// Služba z API
interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  price: number // haléře
  depositAmount: number // haléře
  duration: number // minuty
}

// Časový slot
interface TimeSlot {
  time: string // HH:MM
  available: boolean
}

// Data odesílaná na backend
interface BookingFormData {
  serviceId: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  name: string
  phone: string
  email: string
  note: string
  gdprConsent: boolean
}

// Kroky wizardu
type Step = 1 | 2 | 3 | 4
```

---

## Závěr

BookingForm.tsx je plně funkční multi-step formulář s:
- ✅ API integrací pro služby a dostupnost
- ✅ Real-time validací
- ✅ Animacemi přechodů
- ✅ Platbou kauce přes platební bránu
- ✅ Responzivním designem
- ✅ Accessibility best practices
- ✅ Error handlingem

**Ready pro QA testing a deployment.**
