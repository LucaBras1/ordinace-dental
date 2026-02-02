'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { AnimatedGrid, AnimatedGridItem } from '@/components/ui/AnimatedGrid'
import { AnimatedTimeline } from '@/components/ui/AnimatedTimeline'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring } from '@/lib/animations'

interface ServiceData {
  title: string
  subtitle: string
  description: string
  image: string
  price: string
  duration: string
  metaDescription: string
  steps: { title: string; description: string }[]
  forWhom: string[]
  benefits: { title: string; description: string }[]
  faq: { question: string; answer: string }[]
}

interface ServiceDetailContentProps {
  service: ServiceData
}

export function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  const prefersReducedMotion = useReducedMotion()

  // Convert steps to timeline format
  const timelineItems = service.steps.map((step) => ({
    title: step.title,
    description: step.description,
  }))

  return (
    <>
      <PageHeader
        title={service.title}
        subtitle={service.subtitle}
        breadcrumbs={[
          { label: 'Úvod', href: '/' },
          { label: 'Služby', href: '/sluzby' },
          { label: service.title },
        ]}
        showBreadcrumbs={true}
      />

      {/* Hero image */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={prefersReducedMotion ? {} : { scale: 1.1 }}
          animate={prefersReducedMotion ? {} : { scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="container-custom relative flex h-full items-end pb-8">
          <motion.div
            className="flex flex-wrap gap-4"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ ...spring.smooth, delay: 0.3 }}
          >
            <motion.span
              className="rounded-full bg-white/90 px-4 py-2 font-semibold text-primary-600"
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              transition={spring.bouncy}
            >
              {service.price}
            </motion.span>
            <motion.span
              className="rounded-full bg-white/90 px-4 py-2 text-gray-700"
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              transition={spring.bouncy}
            >
              {service.duration}
            </motion.span>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <AnimatedSection as="section" className="section-padding" animation="fade-in-up">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <motion.p
              className="body-large text-center"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={spring.smooth}
            >
              {service.description}
            </motion.p>
          </div>
        </div>
      </AnimatedSection>

      {/* How it works - Timeline */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <h2 className="heading-2">Jak ošetření probíhá</h2>
          </AnimatedSection>
          <div className="mx-auto max-w-4xl">
            <AnimatedTimeline items={timelineItems} staggerDelay={0.15} />
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <AnimatedSection animation="fade-in-left">
              <h2 className="heading-2 mb-6">Pro koho je služba určena</h2>
              <ul className="space-y-4">
                {service.forWhom.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...spring.smooth, delay: index * 0.1 }}
                  >
                    <motion.svg
                      className="h-6 w-6 flex-shrink-0 text-accent-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={prefersReducedMotion ? {} : { scale: 0 }}
                      whileInView={prefersReducedMotion ? {} : { scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ ...spring.bouncy, delay: index * 0.1 + 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                    <span className="body-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </AnimatedSection>

            {/* Benefits */}
            <AnimatedGrid columns={2} gap="sm" staggerDelay={0.1}>
              {service.benefits.map((benefit, index) => (
                <AnimatedGridItem
                  key={index}
                  hoverLift
                  className="rounded-xl bg-primary-50 p-6"
                >
                  <motion.h3
                    className="heading-4 mb-2 text-primary-700"
                    whileHover={prefersReducedMotion ? {} : { x: 4 }}
                    transition={spring.snappy}
                  >
                    {benefit.title}
                  </motion.h3>
                  <p className="text-sm text-primary-600/80">
                    {benefit.description}
                  </p>
                </AnimatedGridItem>
              ))}
            </AnimatedGrid>
          </div>
        </div>
      </section>

      {/* Price CTA */}
      <AnimatedSection as="section" className="bg-primary-600 py-12" animation="fade-in-up">
        <div className="container-custom">
          <motion.div
            className="flex flex-col items-center justify-between gap-6 md:flex-row"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
            viewport={{ once: true }}
            transition={spring.smooth}
          >
            <div className="text-center md:text-left">
              <motion.p
                className="text-lg text-primary-100"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring.smooth, delay: 0.1 }}
              >
                Cena ošetření:{' '}
                <motion.span
                  className="font-bold text-white"
                  initial={prefersReducedMotion ? {} : { scale: 0.9 }}
                  whileInView={prefersReducedMotion ? {} : { scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...spring.bouncy, delay: 0.2 }}
                >
                  {service.price}
                </motion.span>
              </motion.p>
              <motion.p
                className="text-primary-200"
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ...spring.smooth, delay: 0.2 }}
              >
                Délka: {service.duration}
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring.smooth, delay: 0.3 }}
            >
              <Button asChild size="lg" variant="secondary">
                <Link href="/objednavka">Objednat se online</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <a href="tel:+420123456789">Zavolat</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection as="section" className="section-padding" animation="fade-in-up">
        <div className="container-custom">
          <motion.h2
            className="heading-2 mb-8 text-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring.smooth}
          >
            Často kladené dotazy
          </motion.h2>
          <div className="mx-auto max-w-3xl">
            <Accordion>
              {service.faq.map((item, index) => (
                <AccordionItem key={index} title={item.question}>
                  {item.answer}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <motion.div
            className="mt-8 text-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring.smooth, delay: 0.2 }}
          >
            <p className="body-base mb-4">Máte další otázky?</p>
            <Button asChild variant="outline">
              <Link href="/kontakt">Kontaktujte nás</Link>
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  )
}
