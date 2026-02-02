'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { AnimatedGrid, AnimatedGridItem } from '@/components/ui/AnimatedGrid'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring } from '@/lib/animations'

const mainServices = [
  {
    name: 'Vstupní vyšetření + konzultace',
    description: 'Zhodnocení stavu ústní hygieny a sestavení plánu péče',
    price: 'zdarma',
    note: 'při objednání ošetření',
  },
  {
    name: 'Dentální hygiena - základní',
    description: 'Odstranění zubního kamene, leštění, instruktáž',
    price: '1 200 Kč',
  },
  {
    name: 'Dentální hygiena - komplexní',
    description: 'Základní hygiena + Air-Flow + fluoridace',
    price: '1 800 Kč',
  },
  {
    name: 'Air-Flow ošetření',
    description: 'Pískování pro odstranění pigmentací',
    price: '800 Kč',
  },
  {
    name: 'Bělení zubů - ordinační',
    description: 'Profesionální bělení v ordinaci',
    price: '3 500 Kč',
  },
  {
    name: 'Bělení zubů - domácí sada',
    description: 'Individuální nosiče + bělící gel',
    price: '2 500 Kč',
  },
]

const additionalServices = [
  {
    name: 'Parodontologické ošetření - 1 kvadrant',
    description: 'Hluboké čištění parodontálních kapes',
    price: '1 500 Kč',
  },
  {
    name: 'Parodontologické ošetření - celá ústa',
    description: 'Kompletní hluboké čištění všech kvadrantů',
    price: '5 000 Kč',
  },
  {
    name: 'Fluoridace',
    description: 'Aplikace fluoridového laku',
    price: '300 Kč',
  },
  {
    name: 'Pečetění fisur',
    description: 'Preventivní ošetření jednoho zubu',
    price: '400 Kč',
    note: 'za zub',
  },
  {
    name: 'Kontrolní návštěva',
    description: 'Kontrola stavu po ošetření',
    price: 'zdarma',
  },
]

const insuranceCompanies = [
  { name: 'VZP', code: '111' },
  { name: 'VOZP', code: '201' },
  { name: 'ČPZP', code: '205' },
  { name: 'OZP', code: '207' },
  { name: 'ZPŠ', code: '209' },
  { name: 'ZPMV', code: '211' },
  { name: 'RBP', code: '213' },
]

interface PriceItem {
  name: string
  description?: string
  price: string
  note?: string
}

function AnimatedPriceTable({
  title,
  items,
}: {
  title: string
  items: PriceItem[]
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="rounded-2xl bg-white p-6 shadow-card"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring.smooth}
    >
      <h3 className="heading-4 mb-6">{title}</h3>
      <div className="divide-y divide-gray-100">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              ...spring.smooth,
              delay: index * 0.05,
            }}
            whileHover={
              prefersReducedMotion
                ? {}
                : {
                    backgroundColor: 'rgba(46, 155, 184, 0.05)',
                    x: 4,
                  }
            }
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              {item.description && (
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 sm:text-right">
              <motion.span
                className="text-lg font-semibold text-primary-600"
                initial={prefersReducedMotion ? {} : { scale: 0.9 }}
                whileInView={prefersReducedMotion ? {} : { scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  ...spring.bouncy,
                  delay: index * 0.05 + 0.1,
                }}
              >
                {item.price}
              </motion.span>
              {item.note && (
                <span className="text-sm text-gray-400">({item.note})</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function CenikPage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      <PageHeader
        title="Ceník služeb"
        subtitle="Transparentní ceny bez skrytých poplatků. Cena je vždy stanovena individuálně podle rozsahu ošetření."
        breadcrumbs={[{ label: 'Úvod', href: '/' }, { label: 'Ceník' }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          {/* Info box */}
          <AnimatedSection animation="fade-in-up" className="mb-12">
            <div className="rounded-2xl bg-primary-50 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <motion.div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                  transition={spring.bouncy}
                >
                  <svg
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>
                <div>
                  <h2 className="heading-4 mb-2">Individuální kalkulace</h2>
                  <p className="body-base">
                    Každý pacient je jedinečný a výsledná cena závisí na aktuálním
                    stavu ústní hygieny, množství zubního kamene a dalších
                    faktorech. Přesnou cenu vám sdělíme při vstupním vyšetření,
                    které je{' '}
                    <strong className="text-primary-600">zdarma</strong>.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Price tables */}
          <div className="grid gap-8 lg:grid-cols-2">
            <AnimatedPriceTable title="Hlavní služby" items={mainServices} />
            <AnimatedPriceTable title="Doplňkové služby" items={additionalServices} />
          </div>

          {/* Insurance section */}
          <AnimatedSection animation="fade-in-up" delay={0.2} className="mt-12">
            <div className="rounded-2xl bg-white p-6 shadow-card md:p-8">
              <h2 className="heading-3 mb-6">Smluvní pojišťovny</h2>
              <p className="body-base mb-6">
                Jsme smluvním partnerem většiny zdravotních pojišťoven. Část
                ošetření může být hrazena z vašeho pojištění - informujte se o
                výhodách vašeho pojistného plánu.
              </p>
              <motion.div
                className="flex flex-wrap gap-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                {insuranceCompanies.map((company, index) => (
                  <motion.div
                    key={company.code}
                    className="rounded-xl bg-gray-100 px-4 py-2"
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        transition: spring.bouncy,
                      },
                    }}
                    whileHover={
                      prefersReducedMotion
                        ? {}
                        : {
                            scale: 1.05,
                            backgroundColor: 'rgba(46, 155, 184, 0.1)',
                          }
                    }
                  >
                    <span className="font-medium text-gray-900">
                      {company.name}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({company.code})
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Payment methods */}
          <AnimatedSection animation="fade-in-up" delay={0.3} className="mt-8">
            <div className="rounded-2xl bg-white p-6 shadow-card md:p-8">
              <h2 className="heading-3 mb-6">Platební metody</h2>
              <AnimatedGrid columns={3} gap="md" staggerDelay={0.1}>
                <AnimatedGridItem hoverLift className="flex items-center gap-4">
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                    transition={spring.bouncy}
                  >
                    <svg
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <p className="font-medium text-gray-900">Hotově</p>
                    <p className="text-sm text-gray-500">CZK, EUR</p>
                  </div>
                </AnimatedGridItem>

                <AnimatedGridItem hoverLift className="flex items-center gap-4">
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                    transition={spring.bouncy}
                  >
                    <svg
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <p className="font-medium text-gray-900">Platební kartou</p>
                    <p className="text-sm text-gray-500">
                      Visa, Mastercard, Maestro
                    </p>
                  </div>
                </AnimatedGridItem>

                <AnimatedGridItem hoverLift className="flex items-center gap-4">
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                    transition={spring.bouncy}
                  >
                    <svg
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <p className="font-medium text-gray-900">Mobilem</p>
                    <p className="text-sm text-gray-500">Apple Pay, Google Pay</p>
                  </div>
                </AnimatedGridItem>
              </AnimatedGrid>
            </div>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection animation="fade-in-up" delay={0.4} className="mt-12 text-center">
            <p className="body-large mb-6">
              Máte dotazy ohledně cen nebo pojištění?
            </p>
            <motion.div
              className="flex flex-col justify-center gap-4 sm:flex-row"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring.smooth, delay: 0.2 }}
            >
              <Button asChild size="lg">
                <Link href="/objednavka">Objednat se</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/kontakt">Kontaktovat nás</Link>
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
