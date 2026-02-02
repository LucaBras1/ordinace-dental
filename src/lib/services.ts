/**
 * Services Definition (Hardcoded)
 *
 * This file contains all dental services offered by the clinic.
 * Services are defined as constants - no database required.
 *
 * Prices are in haléře (CZK * 100) for precision:
 * - 150000 = 1500 Kč
 * - 40000 = 400 Kč
 */

// ============================================
// TYPES
// ============================================

export interface Service {
  id: string
  name: string
  slug: string
  description: string
  price: number        // in haléře (CZK * 100)
  depositAmount: number // in haléře (CZK * 100)
  duration: number     // in minutes
  displayOrder: number
  active: boolean
}

// ============================================
// SERVICES DATA
// ============================================

export const SERVICES: Service[] = [
  {
    id: 'dentalni-hygiena',
    name: 'Dentální hygiena',
    slug: 'dentalni-hygiena',
    description: 'Kompletní dentální hygiena včetně odstranění zubního kamene a leštění zubů.',
    price: 150000,      // 1500 Kč
    depositAmount: 40000, // 400 Kč
    duration: 60,
    displayOrder: 1,
    active: true,
  },
  {
    id: 'beleni-zubu',
    name: 'Bělení zubů',
    slug: 'beleni-zubu',
    description: 'Profesionální bělení zubů v ordinaci pro zářivě bílý úsměv.',
    price: 400000,      // 4000 Kč
    depositAmount: 80000, // 800 Kč
    duration: 90,
    displayOrder: 2,
    active: true,
  },
  {
    id: 'preventivni-prohlidka',
    name: 'Preventivní prohlídka',
    slug: 'preventivni-prohlidka',
    description: 'Komplexní vyšetření stavu chrupu a dásní včetně RTG.',
    price: 80000,       // 800 Kč
    depositAmount: 20000, // 200 Kč
    duration: 30,
    displayOrder: 3,
    active: true,
  },
  {
    id: 'lecba-zubniho-kazu',
    name: 'Léčba zubního kazu',
    slug: 'lecba-zubniho-kazu',
    description: 'Ošetření zubního kazu a aplikace výplně.',
    price: 200000,      // 2000 Kč
    depositAmount: 50000, // 500 Kč
    duration: 45,
    displayOrder: 4,
    active: true,
  },
  {
    id: 'extrakce-zubu',
    name: 'Extrakce zubu',
    slug: 'extrakce-zubu',
    description: 'Bezbolestné vytržení zubu včetně lokální anestezie.',
    price: 150000,      // 1500 Kč
    depositAmount: 40000, // 400 Kč
    duration: 30,
    displayOrder: 5,
    active: true,
  },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all active services sorted by displayOrder.
 */
export function getActiveServices(): Service[] {
  return SERVICES
    .filter(service => service.active)
    .sort((a, b) => a.displayOrder - b.displayOrder)
}

/**
 * Get service by ID.
 *
 * @param id - Service ID
 * @returns Service or undefined if not found
 */
export function getServiceById(id: string): Service | undefined {
  return SERVICES.find(service => service.id === id)
}

/**
 * Get service by slug.
 *
 * @param slug - Service slug (URL-friendly name)
 * @returns Service or undefined if not found
 */
export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find(service => service.slug === slug)
}

/**
 * Get services as a lookup map (for quick access by ID).
 */
export function getServicesMap(): Map<string, Service> {
  return new Map(SERVICES.map(service => [service.id, service]))
}

/**
 * Format price from haléře to human-readable string.
 *
 * @param priceInHalere - Price in haléře
 * @returns Formatted price string (e.g., "1 500 Kč")
 */
export function formatPrice(priceInHalere: number): string {
  const czk = priceInHalere / 100
  return czk.toLocaleString('cs-CZ') + ' Kč'
}
