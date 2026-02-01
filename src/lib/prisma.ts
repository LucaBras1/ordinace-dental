/**
 * Prisma 7 Client with PostgreSQL Adapter
 *
 * CRITICAL - Build-time Guard:
 * Prisma 7 s PostgreSQL adapterem vyžaduje DATABASE_URL při runtime,
 * ale NE při build time. Tento soubor používá Proxy pattern místo throw
 * na top-level, aby build Next.js neselhal.
 */

import { PrismaClient } from '@/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

/**
 * Vytvoří Prisma client s PostgreSQL adapterem.
 *
 * Build-time behavior:
 * - Pokud DATABASE_URL není nastaveno, vrátí Proxy objekt
 * - Proxy dovolí build proběhnout, ale vyhodí error při runtime použití
 *
 * Runtime behavior:
 * - Vyžaduje DATABASE_URL environment variable
 * - Vytvoří connection pool a Prisma client s pg adapterem
 */
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  // Build-time guard - vrátí proxy místo throw
  if (!connectionString) {
    console.warn('[Prisma] DATABASE_URL not set - database operations will fail at runtime')
    return new Proxy({} as PrismaClient, {
      get: (target, prop) => {
        // Povolit Promise-related properties pro kompatibilitu
        if (prop === 'then' || prop === 'catch' || typeof prop === 'symbol') {
          return undefined
        }
        // Runtime error při skutečném použití
        return () => {
          throw new Error('DATABASE_URL environment variable is not set')
        }
      },
    })
  }

  // Vytvoř PostgreSQL connection pool
  const pool = new Pool({ connectionString })

  // Vytvoř Prisma adapter pro pg
  const adapter = new PrismaPg(pool)

  // Vytvoř Prisma client s adapterem
  return new PrismaClient({ adapter })
}

// Global Prisma instance (singleton pattern pro development)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Export singleton instance
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// V development módu používat singleton pro hot reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * Explicitní disconnect pro graceful shutdown.
 * Použij v API routes nebo server shutdown handlers.
 */
export async function disconnectPrisma() {
  await prisma.$disconnect()
}
