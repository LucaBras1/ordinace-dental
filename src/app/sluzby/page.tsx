'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { AnimatedGrid, AnimatedServiceCard, AnimatedFeatureList } from '@/components/ui/AnimatedGrid'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring } from '@/lib/animations'

const services = [
  {
    slug: 'dentalni-hygiena',
    title: 'Dentální hygiena',
    description:
      'Profesionální čištění zubů ultrazvukem a leštění. Prevence zubního kazu a onemocnění dásní. Doporučujeme navštívit 2x ročně.',
    price: 'od 1 200 Kč',
    duration: '45-60 min',
    image: '/images/services/dental-hygiene.jpg',
    features: [
      'Odstranění zubního kamene',
      'Leštění zubů',
      'Instruktáž správné péče',
      'Individuální plán prevence',
    ],
  },
  {
    slug: 'beleni-zubu',
    title: 'Bělení zubů',
    description:
      'Šetrné bělení zubů pro zářivý úsměv. Používáme osvědčené metody s minimální citlivostí a dlouhotrvajícím efektem.',
    price: 'od 3 500 Kč',
    duration: '60-90 min',
    image: '/images/services/whitening.jpg',
    features: [
      'Profesionální bělící gel',
      'Viditelný výsledek ihned',
      'Šetrné k zubní sklovině',
      'Domácí bělící sada v ceně',
    ],
  },
  {
    slug: 'air-flow',
    title: 'Air-Flow',
    description:
      'Pískování zubů technologií Air-Flow pro dokonalé odstranění pigmentací a plaku. Ideální pro kuřáky a milovníky kávy.',
    price: 'od 800 Kč',
    duration: '30 min',
    image: '/images/services/air-flow.jpg',
    features: [
      'Odstranění pigmentací',
      'Příjemná příchuť',
      'Šetrné k dásním',
      'Okamžitý efekt',
    ],
  },
  {
    slug: 'parodontologie',
    title: 'Parodontologie',
    description:
      'Léčba onemocnění dásní a parodontu. Hluboké čištění parodontálních kapes a prevence ztráty zubů.',
    price: 'od 1 500 Kč',
    duration: '60-90 min',
    image: '/images/services/periodontics.jpg',
    features: [
      'Hluboké čištění kapes',
      'Léčba zánětu dásní',
      'Stabilizace parodontu',
      'Dlouhodobá péče',
    ],
  },
]

export default function SluzbyPage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      <PageHeader
        title="Naše služby"
        subtitle="Poskytujeme komplexní péči o vaše zuby a dásně s využitím moderních technologií"
        breadcrumbs={[{ label: 'Úvod', href: '/' }, { label: 'Služby' }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          {/* Services grid */}
          <AnimatedGrid columns={2} gap="lg" staggerDelay={0.1}>
            {services.map((service, index) => (
              <AnimatedServiceCard key={service.slug} index={index}>
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <motion.span
                      className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-primary-600"
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        ...spring.smooth,
                        delay: 0.3 + index * 0.1,
                      }}
                    >
                      {service.price}
                    </motion.span>
                    <motion.span
                      className="rounded-full bg-white/90 px-3 py-1 text-sm text-gray-600"
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        ...spring.smooth,
                        delay: 0.35 + index * 0.1,
                      }}
                    >
                      {service.duration}
                    </motion.span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="heading-3 mb-3 transition-colors group-hover:text-primary-600">
                    {service.title}
                  </h2>
                  <p className="body-base mb-4">{service.description}</p>

                  {/* Features */}
                  <AnimatedFeatureList features={service.features} className="mb-6" />

                  <Link
                    href={`/sluzby/${service.slug}`}
                    className="inline-flex items-center gap-2 font-medium text-primary-600 transition-colors hover:text-primary-700"
                  >
                    Více informací
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
                </div>
              </AnimatedServiceCard>
            ))}
          </AnimatedGrid>
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection
        as="section"
        className="bg-primary-600 py-16"
        animation="fade-in-up"
      >
        <div className="container-custom text-center">
          <motion.h2
            className="heading-2 mb-4 text-white"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring.smooth}
          >
            Připraveni na zdravější úsměv?
          </motion.h2>
          <motion.p
            className="body-large mx-auto mb-8 max-w-2xl text-primary-100"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              ...spring.smooth,
              delay: 0.1,
            }}
          >
            Objednejte se ještě dnes a zjistěte, jak vám můžeme pomoci s péčí o
            vaše zuby.
          </motion.p>
          <motion.div
            className="flex flex-col justify-center gap-4 sm:flex-row"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              ...spring.smooth,
              delay: 0.2,
            }}
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
              <Link href="/cenik">Zobrazit ceník</Link>
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  )
}
