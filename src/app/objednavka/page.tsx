'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { BookingForm } from './BookingForm'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring } from '@/lib/animations'

const steps = [
  {
    number: '1',
    title: 'Vyplňte formulář',
    description: 'Vyberte službu a preferovaný termín',
  },
  {
    number: '2',
    title: 'Potvrzení',
    description: 'Ozveme se vám pro potvrzení termínu',
  },
  {
    number: '3',
    title: 'Návštěva',
    description: 'Přijďte na domluvený termín',
  },
]

const infoItems = [
  'Vstupní vyšetření je zdarma',
  'Přijímáme většinu pojišťoven',
  'Platba kartou i hotově',
  'Bezbariérový přístup',
]

export default function ObjednavkaPage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      <PageHeader
        title="Online objednání"
        subtitle="Vyberte si službu a preferovaný termín. Ozveme se vám do 24 hodin s potvrzením."
        breadcrumbs={[{ label: 'Úvod', href: '/' }, { label: 'Objednání' }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Form */}
            <AnimatedSection animation="fade-in-left" className="lg:col-span-2">
              <motion.div
                className="rounded-2xl bg-white p-6 shadow-card md:p-8"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={spring.smooth}
              >
                <motion.h2
                  className="heading-3 mb-6"
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{ ...spring.smooth, delay: 0.1 }}
                >
                  Rezervační formulář
                </motion.h2>
                <BookingForm />
              </motion.div>
            </AnimatedSection>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* How it works */}
              <motion.div
                className="rounded-2xl bg-gray-50 p-6"
                initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={spring.smooth}
              >
                <motion.h3
                  className="heading-4 mb-4"
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...spring.smooth, delay: 0.1 }}
                >
                  Jak to funguje
                </motion.h3>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.number}
                      className="flex gap-4"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ ...spring.smooth, delay: 0.1 + index * 0.1 }}
                    >
                      <motion.div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600"
                        whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                        transition={spring.bouncy}
                      >
                        {step.number}
                      </motion.div>
                      <div>
                        <p className="font-medium text-gray-900">{step.title}</p>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Contact */}
              <motion.div
                className="rounded-2xl bg-primary-50 p-6"
                initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring.smooth, delay: 0.2 }}
              >
                <motion.h3
                  className="heading-4 mb-4"
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...spring.smooth, delay: 0.3 }}
                >
                  Raději telefonicky?
                </motion.h3>
                <p className="body-base mb-4">Volejte nás v ordinačních hodinách:</p>
                <motion.a
                  href="tel:+420123456789"
                  className="flex items-center gap-3 text-lg font-semibold text-primary-600 transition-colors hover:text-primary-700"
                  whileHover={prefersReducedMotion ? {} : { x: 4, scale: 1.02 }}
                  transition={spring.snappy}
                >
                  <motion.svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    whileHover={prefersReducedMotion ? {} : { rotate: 15 }}
                    transition={spring.bouncy}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </motion.svg>
                  +420 123 456 789
                </motion.a>
                <p className="mt-3 text-sm text-gray-500">Po-Pá: 8:00 - 17:00</p>
              </motion.div>

              {/* Info box */}
              <motion.div
                className="rounded-2xl border border-gray-200 bg-white p-6"
                initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring.smooth, delay: 0.3 }}
              >
                <motion.h3
                  className="heading-4 mb-4"
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...spring.smooth, delay: 0.4 }}
                >
                  Důležité informace
                </motion.h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  {infoItems.map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-2"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: 10 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ ...spring.smooth, delay: 0.4 + index * 0.08 }}
                    >
                      <motion.svg
                        className="h-5 w-5 flex-shrink-0 text-accent-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={prefersReducedMotion ? {} : { scale: 0 }}
                        whileInView={prefersReducedMotion ? {} : { scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ ...spring.bouncy, delay: 0.5 + index * 0.08 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...spring.smooth, delay: 0.7 }}
                >
                  <Link
                    href="/faq"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                  >
                    <motion.span
                      whileHover={prefersReducedMotion ? {} : { x: -2 }}
                      transition={spring.snappy}
                    >
                      Časté dotazy
                    </motion.span>
                    <motion.svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      whileHover={prefersReducedMotion ? {} : { x: 4 }}
                      transition={spring.snappy}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
