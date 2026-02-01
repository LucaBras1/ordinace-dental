/**
 * Prisma Seed Script
 * Vytvoří základní služby pro dentální ordinaci
 */

import { PrismaClient } from '@/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Vytvoř Prisma client pro seeding
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required for seeding')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const services = [
  {
    name: 'Dentální hygiena',
    slug: 'dentalni-hygiena',
    description:
      'Profesionální čištění zubů, odstranění zubního kamene a povlaku. Prevence zubního kazu a onemocnění dásní.',
    price: 150000, // 1500 Kč
    depositAmount: 50000, // 500 Kč kauce
    duration: 60, // 60 minut
    displayOrder: 1,
    active: true,
  },
  {
    name: 'Bělení zubů',
    slug: 'beleni-zubu',
    description:
      'Šetrné profesionální bělení zubů pro zářivý úsměv. Výsledky viditelné ihned po ošetření.',
    price: 500000, // 5000 Kč
    depositAmount: 100000, // 1000 Kč kauce
    duration: 90, // 90 minut
    displayOrder: 2,
    active: true,
  },
  {
    name: 'Air-Flow čištění',
    slug: 'air-flow-cisteni',
    description:
      'Moderní metoda odstranění pigmentací a povlaků pomocí tryskání speciálního prášku. Šetrné a efektivní.',
    price: 120000, // 1200 Kč
    depositAmount: 30000, // 300 Kč kauce
    duration: 45, // 45 minut
    displayOrder: 3,
    active: true,
  },
  {
    name: 'Parodontologické ošetření',
    slug: 'parodontologicke-osetreni',
    description:
      'Léčba onemocnění dásní a parodontu. Hloubkové čištění parodontálních chobotů.',
    price: 200000, // 2000 Kč
    depositAmount: 50000, // 500 Kč kauce
    duration: 75, // 75 minut
    displayOrder: 4,
    active: true,
  },
  {
    name: 'Konzultace a vyšetření',
    slug: 'konzultace-vysetreni',
    description:
      'Vstupní konzultace, vyšetření dutiny ústní a doporučení dalšího postupu léčby.',
    price: 50000, // 500 Kč
    depositAmount: 20000, // 200 Kč kauce
    duration: 30, // 30 minut
    displayOrder: 5,
    active: true,
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Vymaž existující služby (pouze pro development)
  if (process.env.NODE_ENV !== 'production') {
    await prisma.service.deleteMany()
    console.log('🗑️  Cleared existing services')
  }

  // Vytvoř služby
  for (const service of services) {
    const created = await prisma.service.create({
      data: service,
    })
    console.log(`✅ Created service: ${created.name} (${created.slug})`)
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
