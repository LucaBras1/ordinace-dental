'use client'

import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { ContactInfo } from '@/components/ui/ContactInfo'
import { Map } from '@/components/ui/Map'
import { ContactForm } from './ContactForm'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { AnimatedGrid, AnimatedGridItem } from '@/components/ui/AnimatedGrid'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring } from '@/lib/animations'

const transportOptions = [
  {
    icon: (
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
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    ),
    title: 'Metrem',
    description:
      'Stanice Náměstí Míru (linka A) - 5 minut chůze po ulici Korunní.',
  },
  {
    icon: (
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
          d="M8 7h8m-8 4h8m-8 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
        />
      </svg>
    ),
    title: 'Tramvají',
    description:
      'Zastávka Vinohradská tržnice - tramvaje č. 11, 13 (Vinohradská ulice).',
  },
  {
    icon: (
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
          d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2M5 17l-1 4m16-4l1 4M7 13h.01M17 13h.01"
        />
      </svg>
    ),
    title: 'Autem',
    description:
      'Parkování v přilehlých ulicích. Modrá zóna P2 - rezidentní parkování.',
  },
]

export default function KontaktPage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      <PageHeader
        title="Kontaktujte nás"
        subtitle="Rádi vám odpovíme na vaše dotazy nebo vás objednáme na vyšetření"
        breadcrumbs={[{ label: 'Úvod', href: '/' }, { label: 'Kontakt' }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact info */}
            <AnimatedSection animation="fade-in-left">
              <h2 className="heading-3 mb-6">Kontaktní údaje</h2>
              <ContactInfo className="mb-8" />

              {/* Map */}
              <motion.div
                className="mt-8"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring.smooth, delay: 0.2 }}
              >
                <h3 className="heading-4 mb-4">Kde nás najdete</h3>
                <motion.div
                  className="overflow-hidden rounded-2xl"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                  transition={spring.smooth}
                >
                  <Map className="h-[300px]" />
                </motion.div>
              </motion.div>
            </AnimatedSection>

            {/* Contact form */}
            <AnimatedSection animation="fade-in-right" delay={0.1}>
              <motion.div
                className="rounded-2xl bg-gray-50 p-6 md:p-8"
                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={spring.smooth}
              >
                <h2 className="heading-3 mb-2">Napište nám</h2>
                <p className="body-base mb-6">
                  Vyplňte formulář a my se vám co nejdříve ozveme.
                </p>
                <ContactForm />
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How to get there */}
      <AnimatedSection as="section" className="bg-gray-50 py-16" animation="fade-in-up">
        <div className="container-custom">
          <motion.h2
            className="heading-2 mb-8 text-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring.smooth}
          >
            Jak se k nám dostanete
          </motion.h2>

          <AnimatedGrid columns={3} gap="md" staggerDelay={0.1}>
            {transportOptions.map((option, index) => (
              <AnimatedGridItem
                key={index}
                hoverLift
                className="rounded-2xl bg-white p-6 shadow-card"
              >
                <motion.div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                  transition={spring.bouncy}
                >
                  {option.icon}
                </motion.div>
                <h3 className="heading-4 mb-2">{option.title}</h3>
                <p className="body-base">{option.description}</p>
              </AnimatedGridItem>
            ))}
          </AnimatedGrid>
        </div>
      </AnimatedSection>
    </>
  )
}
