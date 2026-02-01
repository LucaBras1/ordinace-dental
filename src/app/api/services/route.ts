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
 * GET /api/services
 *
 * Returns list of active services ordered by displayOrder.
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

    return NextResponse.json(
      {
        services,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Error fetching services:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch services',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
