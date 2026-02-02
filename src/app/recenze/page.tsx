'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { AnimatedGrid, AnimatedGridItem } from '@/components/ui/AnimatedGrid'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring } from '@/lib/animations'

const reviews = [
  {
    name: 'Marie K.',
    date: '2024',
    rating: 5,
    text: 'Konečně jsem našla dentální hygienistku, ke které se nebojím chodit. Paní hygienistka je velmi příjemná, profesionální a hlavně - ošetření je skutečně bezbolestné! Doporučuji všem.',
    service: 'Dentální hygiena',
  },
  {
    name: 'Petr N.',
    date: '2024',
    rating: 5,
    text: 'Po letech odkládání jsem se konečně odhodlal k návštěvě. Překvapilo mě, jak je vše moderní a profesionální. Zuby mám čisté jako nikdy předtím a už se těším na další návštěvu.',
    service: 'Komplexní hygiena',
  },
  {
    name: 'Jana S.',
    date: '2024',
    rating: 5,
    text: 'Bělení zubů dopadlo skvěle! Zuby jsou viditelně bělejší a celý proces byl velmi příjemný. Dostala jsem i domácí sadu na udržení výsledků. Moc děkuji!',
    service: 'Bělení zubů',
  },
  {
    name: 'Tomáš H.',
    date: '2024',
    rating: 5,
    text: 'Jako kuřák jsem měl problém s pigmentacemi. Air-Flow je úžasná technologie - zuby jsou perfektně čisté a celé ošetření trvalo jen půl hodiny.',
    service: 'Air-Flow',
  },
  {
    name: 'Alena M.',
    date: '2024',
    rating: 5,
    text: 'Chodím sem pravidelně už 3 roky a jsem maximálně spokojená. Ordinace je krásná, čistá a personál vždy milý. Nikdy jsem neměla žádný problém s objednáním.',
    service: 'Dentální hygiena',
  },
  {
    name: 'Lukáš D.',
    date: '2023',
    rating: 5,
    text: 'Měl jsem problémy s dásněmi a bál jsem se nejhoršího. Po parodontologickém ošetření se vše zlepšilo. Paní hygienistka mi vše vysvětlila a naučila mě správnou péči.',
    service: 'Parodontologie',
  },
  {
    name: 'Eva P.',
    date: '2023',
    rating: 4,
    text: 'Velmi příjemná zkušenost. Jediné, co bych vytkla, je trochu delší čekání na termín - ale chápu, že kvalitní péče má svou cenu. Jinak naprostá spokojenost.',
    service: 'Dentální hygiena',
  },
  {
    name: 'Martin V.',
    date: '2023',
    rating: 5,
    text: 'Nosím rovnátka a dentální hygiena je pro mě nezbytná. Tady se o moje zuby starají perfektně. Používají speciální nástavce a jsou velmi pečliví.',
    service: 'Hygiena s rovnátky',
  },
]

const stats = {
  rating: 4.9,
  reviews: 127,
  recommendation: 99,
}

function AnimatedStarRating({ rating, delay = 0 }: { rating: number; delay?: number }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star, index) => (
        <motion.svg
          key={star}
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
          whileInView={prefersReducedMotion ? {} : { scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{
            ...spring.bouncy,
            delay: delay + index * 0.05,
          }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      ))}
    </div>
  )
}

export default function RecenzePage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      <PageHeader
        title="Co o nás říkají pacienti"
        subtitle="Přečtěte si skutečné recenze od našich spokojených pacientů"
        breadcrumbs={[{ label: 'Úvod', href: '/' }, { label: 'Recenze' }]}
      />

      {/* Stats */}
      <AnimatedSection
        as="section"
        className="bg-primary-50 py-12"
        animation="fade-in-up"
      >
        <div className="container-custom">
          <motion.div
            className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <motion.div
              className="text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: spring.smooth },
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-bold text-primary-600">
                  <AnimatedCounter end={stats.rating} duration={2000} />
                </span>
                <motion.svg
                  className="h-8 w-8 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
                  whileInView={prefersReducedMotion ? {} : { scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring.bouncy, delay: 0.3 }}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              </div>
              <p className="text-gray-600">hodnocení na Google</p>
            </motion.div>

            <motion.div
              className="text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: spring.smooth },
              }}
            >
              <p className="text-4xl font-bold text-primary-600">
                <AnimatedCounter end={stats.reviews} suffix="+" duration={2000} />
              </p>
              <p className="text-gray-600">recenzí</p>
            </motion.div>

            <motion.div
              className="text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: spring.smooth },
              }}
            >
              <p className="text-4xl font-bold text-primary-600">
                <AnimatedCounter end={stats.recommendation} suffix="%" duration={2000} />
              </p>
              <p className="text-gray-600">doporučení</p>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Reviews */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedGrid columns={3} gap="md" staggerDelay={0.08}>
            {reviews.map((review, index) => (
              <AnimatedGridItem
                key={index}
                hoverLift
                className="rounded-2xl bg-white p-6 shadow-card"
              >
                <div className="mb-4 flex items-center justify-between">
                  <AnimatedStarRating rating={review.rating} delay={index * 0.05} />
                  <motion.span
                    className="text-sm text-gray-400"
                    initial={prefersReducedMotion ? {} : { opacity: 0 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    {review.date}
                  </motion.span>
                </div>

                <motion.div
                  className="relative"
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <svg
                    className="absolute -left-2 -top-2 h-8 w-8 text-primary-100"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="body-base mb-4 pl-4 italic text-gray-700">
                    {review.text}
                  </p>
                </motion.div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="font-medium text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.service}</p>
                  </div>
                  <svg
                    className="h-6 w-6 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </div>
              </AnimatedGridItem>
            ))}
          </AnimatedGrid>
        </div>
      </section>

      {/* Google link */}
      <AnimatedSection
        as="section"
        className="bg-gray-50 py-16"
        animation="fade-in-up"
      >
        <div className="container-custom text-center">
          <motion.h2
            className="heading-2 mb-4"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring.smooth}
          >
            Napište nám recenzi
          </motion.h2>
          <motion.p
            className="body-large mx-auto mb-8 max-w-2xl"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring.smooth, delay: 0.1 }}
          >
            Byli jste u nás spokojeni? Budeme rádi za vaši recenzi na Google.
            Pomůžete tak ostatním najít kvalitní péči.
          </motion.p>
          <motion.div
            className="flex flex-col justify-center gap-4 sm:flex-row"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring.smooth, delay: 0.2 }}
          >
            <Button asChild size="lg">
              <a
                href="https://g.page/review"
                target="_blank"
                rel="noopener noreferrer"
              >
                Napsat recenzi na Google
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/objednavka">Objednat se</Link>
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  )
}
