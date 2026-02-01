/**
 * Services API Route
 *
 * GET /api/services - Get all active services with prices and deposits
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering since we fetch from database
export const dynamic = 'force-dynamic'

/**
 * Fallback services when database is not available
 * Prices are in haléře (1 CZK = 100 haléřů)
 */
const FALLBACK_SERVICES = [
  {
    id: 'dentalni-hygiena',
    name: 'Dentální hygiena',
    slug: 'dentalni-hygiena',
    description: 'Kompletní dentální hygiena včetně odstranění zubního kamene a leštění zubů.',
    price: 150000, // 1500 Kč
    depositAmount: 40000, // 400 Kč
    duration: 60,
    displayOrder: 1,
  },
  {
    id: 'beleni-zubu',
    name: 'Bělení zubů',
    slug: 'beleni-zubu',
    description: 'Profesionální bělení zubů v ordinaci pro zářivě bílý úsměv.',
    price: 400000, // 4000 Kč
    depositAmount: 80000, // 800 Kč
    duration: 90,
    displayOrder: 2,
  },
  {
    id: 'preventivni-prohlidka',
    name: 'Preventivní prohlídka',
    slug: 'preventivni-prohlidka',
    description: 'Komplexní vyšetření stavu chrupu a dásní včetně RTG.',
    price: 80000, // 800 Kč
    depositAmount: 20000, // 200 Kč
    duration: 30,
    displayOrder: 3,
  },
  {
    id: 'lecba-zubniho-kazu',
    name: 'Léčba zubního kazu',
    slug: 'lecba-zubniho-kazu',
    description: 'Ošetření zubního kazu a aplikace výplně.',
    price: 200000, // 2000 Kč
    depositAmount: 50000, // 500 Kč
    duration: 45,
    displayOrder: 4,
  },
  {
    id: 'extrakce-zubu',
    name: 'Extrakce zubu',
    slug: 'extrakce-zubu',
    description: 'Bezbolestné vytržení zubu včetně lokální anestezie.',
    price: 150000, // 1500 Kč
    depositAmount: 40000, // 400 Kč
    duration: 30,
    displayOrder: 5,
  },
]

/**
 * GET /api/services
 *
 * Returns list of active services ordered by displayOrder.
 * Falls back to hardcoded services when database is not available.
 *
 * @returns {
 *   services: Array<{
 *     id: string
 *     name: string
 *     slug: string
 *     description: string | null
 *     price: number (in haléře)
 *     depositAmount: number (in haléře)
 *     duration: number (in minutes)
 *     displayOrder: number
 *   }>
 * }
 */
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: {
        active: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        depositAmount: true,
        duration: true,
        displayOrder: true,
      },
    })

    // If no services in database, return fallback
    if (services.length === 0) {
      console.log('[API] No services in database, using fallback services')
      return NextResponse.json({ services: FALLBACK_SERVICES }, { status: 200 })
    }

    return NextResponse.json({ services }, { status: 200 })
  } catch (error) {
    console.error('[API] Error fetching services, using fallback:', error)

    // Return fallback services when database is not available
    return NextResponse.json({ services: FALLBACK_SERVICES }, { status: 200 })
  }
}
