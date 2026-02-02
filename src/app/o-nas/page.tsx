'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { AnimatedTimeline } from '@/components/ui/AnimatedTimeline'
import { AnimatedGrid, AnimatedCard } from '@/components/ui/AnimatedGrid'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring } from '@/lib/animations'

const qualifications = [
  'Diplomovaná dentální hygienistka (DiS.)',
  'Certifikát Air-Flow Master',
  'Specializace na parodontologii',
  'Pravidelné vzdělávání a kurzy',
]

const timeline = [
  {
    year: '2010',
    title: 'Studium dentální hygieny',
    description: 'Absolvování vyšší odborné školy zdravotnické',
  },
  {
    year: '2013',
    title: 'První praxe',
    description: 'Začátek kariéry v prestižní pražské klinice',
  },
  {
    year: '2018',
    title: 'Specializace',
    description: 'Rozšíření vzdělání o parodontologii a moderní metody',
  },
  {
    year: '2020',
    title: 'Vlastní ordinace',
    description: 'Otevření vlastní ordinace v centru Prahy',
  },
]

const values = [
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    title: 'Individuální přístup',
    description:
      'Každý pacient je pro mě jedinečný. Přizpůsobuji péči vašim potřebám a přáním.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: 'Bezbolestné ošetření',
    description:
      'Používám šetrné metody a moderní technologie pro maximální komfort.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    title: 'Edukace pacientů',
    description:
      'Věřím v prevenci. Naučím vás správnou péči o zuby pro dlouhodobé zdraví.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: 'Moderní technologie',
    description:
      'Investuji do nejnovějšího vybavení pro nejlepší možné výsledky.',
  },
]

const stats = [
  { value: 10, suffix: '+', label: 'let zkušeností' },
  { value: 5000, suffix: '+', label: 'spokojených pacientů' },
  { value: 99, suffix: '%', label: 'spokojenost' },
  { value: 15000, suffix: '+', label: 'ošetření' },
]

export default function ONasPage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      <PageHeader
        title="O mně"
        subtitle="Vaše zdraví a spokojenost jsou pro mě vždy na prvním místě"
        breadcrumbs={[{ label: 'Úvod', href: '/' }, { label: 'O mně' }]}
      />

      {/* About section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image */}
            <AnimatedSection animation="fade-in-left" className="relative">
              <motion.div
                className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                transition={spring.smooth}
              >
                <Image
                  src="/images/doctor.jpg"
                  alt="Dentální hygienistka"
                  fill
                  className="object-cover"
                />
              </motion.div>
              {/* Stats card */}
              <motion.div
                className="absolute -bottom-6 -right-6 rounded-2xl bg-white p-6 shadow-card md:p-8"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20, scale: 0.9 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  ...spring.bouncy,
                  delay: 0.3,
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 2).map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center"
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        ...spring.smooth,
                        delay: 0.5 + index * 0.1,
                      }}
                    >
                      <p className="text-2xl font-bold text-primary-600">
                        <AnimatedCounter
                          end={stat.value}
                          suffix={stat.suffix}
                          duration={2000}
                        />
                      </p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatedSection>

            {/* Content */}
            <AnimatedSection animation="fade-in-right" delay={0.2}>
              <h2 className="heading-2 mb-6">
                Jsem tu, abych se postarala o váš úsměv
              </h2>
              <div className="space-y-4 body-base">
                <p>
                  Jmenuji se Jana Nováková a jsem diplomovaná dentální
                  hygienistka s více než desetiletou praxí v oboru. Mým posláním
                  je pomáhat lidem dosáhnout zdravého a krásného úsměvu.
                </p>
                <p>
                  Po absolvování studia jsem pracovala v několika prestižních
                  pražských klinikách, kde jsem získala cenné zkušenosti
                  s různými typy pacientů a ošetření. V roce 2020 jsem si
                  splnila sen a otevřela vlastní ordinaci.
                </p>
                <p>
                  Věřím, že prevence je základem zdraví. Proto se zaměřuji nejen
                  na profesionální ošetření, ale také na edukaci pacientů
                  v oblasti správné domácí péče.
                </p>
              </div>

              {/* Qualifications */}
              <div className="mt-8">
                <h3 className="heading-4 mb-4">Kvalifikace</h3>
                <motion.ul
                  className="space-y-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2,
                      },
                    },
                  }}
                >
                  {qualifications.map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: spring.smooth,
                        },
                      }}
                    >
                      <motion.svg
                        className="h-5 w-5 flex-shrink-0 text-accent-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          ...spring.bouncy,
                          delay: 0.3 + index * 0.1,
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <h2 className="heading-2">Můj příběh</h2>
          </AnimatedSection>
          <AnimatedTimeline items={timeline} staggerDelay={0.15} />
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <h2 className="heading-2 mb-4">Můj přístup k pacientům</h2>
            <p className="body-large mx-auto max-w-2xl">
              Každé ošetření stavím na čtyřech základních pilířích
            </p>
          </AnimatedSection>

          <AnimatedGrid columns={4} gap="md" staggerDelay={0.1}>
            {values.map((value, index) => (
              <AnimatedCard key={index} hoverLift tilt tiltIntensity={8}>
                <motion.div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                  transition={spring.bouncy}
                >
                  {value.icon}
                </motion.div>
                <h3 className="heading-4 mb-2">{value.title}</h3>
                <p className="body-base">{value.description}</p>
              </AnimatedCard>
            ))}
          </AnimatedGrid>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 py-16">
        <div className="container-custom">
          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: spring.smooth,
                  },
                }}
              >
                <p className="text-4xl font-bold text-white md:text-5xl">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2500}
                  />
                </p>
                <motion.p
                  className="mt-2 text-primary-100"
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <AnimatedSection as="section" className="section-padding" animation="fade-in-up">
        <div className="container-custom text-center">
          <motion.h2
            className="heading-2 mb-4"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring.smooth}
          >
            Pojďme se seznámit
          </motion.h2>
          <motion.p
            className="body-large mx-auto mb-8 max-w-2xl"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              ...spring.smooth,
              delay: 0.1,
            }}
          >
            Těším se na vaši návštěvu. Objednejte se a společně se postaráme
            o zdraví vašich zubů.
          </motion.p>
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              ...spring.smooth,
              delay: 0.2,
            }}
          >
            <Button asChild size="lg">
              <Link href="/objednavka">Objednat se</Link>
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  )
}
