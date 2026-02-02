/**
 * Services API Route
 *
 * GET /api/services - Get all active services with prices and deposits
 *
 * Services are hardcoded in src/lib/services.ts - no database required.
 */

import { NextResponse } from 'next/server'
import { getActiveServices } from '@/lib/services'

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
 *     description: string
 *     price: number (in haléře)
 *     depositAmount: number (in haléře)
 *     duration: number (in minutes)
 *     displayOrder: number
 *   }>
 * }
 */
export async function GET() {
  const services = getActiveServices()

  // Map to API response format (exclude 'active' field)
  const response = services.map(({ active, ...service }) => service)

  return NextResponse.json({ services: response }, { status: 200 })
}
