'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { AnimatedGrid, AnimatedGridItem } from '@/components/ui/AnimatedGrid'
import { SimpleTimeline } from '@/components/ui/AnimatedTimeline'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring } from '@/lib/animations'

const insuranceCompanies = [
  { name: 'Všeobecná zdravotní pojišťovna', code: '111', abbr: 'VZP' },
  { name: 'Vojenská zdravotní pojišťovna', code: '201', abbr: 'VOZP' },
  { name: 'Česká průmyslová zdravotní pojišťovna', code: '205', abbr: 'ČPZP' },
  { name: 'Oborová zdravotní pojišťovna', code: '207', abbr: 'OZP' },
  { name: 'Zaměstnanecká pojišťovna Škoda', code: '209', abbr: 'ZPŠ' },
  { name: 'Zdravotní pojišťovna MV ČR', code: '211', abbr: 'ZPMV' },
  { name: 'RBP, zdravotní pojišťovna', code: '213', abbr: 'RBP' },
]

const coveredServices = [
  {
    service: 'Preventivní prohlídka',
    coverage: 'Hrazeno 1x ročně',
    note: 'U dětí 2x ročně',
  },
  {
    service: 'Odstranění zubního kamene',
    coverage: 'Částečně hrazeno',
    note: 'Dle rozsahu a pojišťovny',
  },
  {
    service: 'Instruktáž hygieny',
    coverage: 'Hrazeno 1x za 3 roky',
    note: 'U dětí častěji',
  },
  {
    service: 'Fluoridace',
    coverage: 'Hrazeno do 18 let',
    note: '2x ročně',
  },
  {
    service: 'Pečetění fisur',
    coverage: 'Hrazeno do 15 let',
    note: 'Pouze u stálých zubů',
  },
  {
    service: 'Air-Flow',
    coverage: 'Nehrazeno',
    note: 'Nadstandardní služba',
  },
  {
    service: 'Bělení zubů',
    coverage: 'Nehrazeno',
    note: 'Kosmetický zákrok',
  },
  {
    service: 'Komplexní dentální hygiena',
    coverage: 'Částečně hrazeno',
    note: 'Doplatek dle rozsahu',
  },
]

const bonusPrograms = [
  {
    insurance: 'VZP',
    program: 'Program Moje VZP',
    benefit: 'Příspěvek až 500 Kč na prevenci',
    link: 'https://www.vzp.cz',
  },
  {
    insurance: 'ČPZP',
    program: 'Zdravý život',
    benefit: 'Příspěvek 300-500 Kč na dentální hygienu',
    link: 'https://www.cpzp.cz',
  },
  {
    insurance: 'OZP',
    program: 'Preventivní program',
    benefit: 'Příspěvek až 400 Kč',
    link: 'https://www.ozp.cz',
  },
  {
    insurance: 'ZPMV',
    program: 'Program prevence',
    benefit: 'Různé příspěvky dle věku',
    link: 'https://www.zpmvcr.cz',
  },
]

const claimSteps = [
  {
    title: 'Zkontrolujte podmínky',
    description:
      'Navštivte web své pojišťovny nebo zavolejte na infolinku a zjistěte, jaké příspěvky nabízí.',
  },
  {
    title: 'Absolvujte ošetření',
    description:
      'Přijďte k nám na dentální hygienu. Po ošetření vám vystavíme doklad o zaplacení.',
  },
  {
    title: 'Požádejte o příspěvek',
    description:
      'S dokladem požádejte svou pojišťovnu o proplacení příspěvku - obvykle online nebo na pobočce.',
  },
]

export default function PojistovnyPage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      <PageHeader
        title="Pojišťovny"
        subtitle="Informace o smluvních pojišťovnách a možnostech příspěvků na dentální hygienu"
        breadcrumbs={[{ label: 'Úvod', href: '/' }, { label: 'Pojišťovny' }]}
      />

      {/* Insurance companies */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <h2 className="heading-2 mb-4">Smluvní pojišťovny</h2>
            <p className="body-large mx-auto max-w-2xl">
              Jsme smluvním partnerem všech hlavních zdravotních pojišťoven v ČR.
            </p>
          </AnimatedSection>

          <AnimatedGrid columns={4} gap="sm" staggerDelay={0.08}>
            {insuranceCompanies.map((company) => (
              <AnimatedGridItem
                key={company.code}
                hoverLift
                className="rounded-2xl bg-white p-6 text-center shadow-card"
              >
                <motion.div
                  className="mb-2 text-3xl font-bold text-primary-600"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                  transition={spring.bouncy}
                >
                  {company.abbr}
                </motion.div>
                <p className="text-sm text-gray-600">{company.name}</p>
                <p className="mt-2 text-xs text-gray-400">Kód: {company.code}</p>
              </AnimatedGridItem>
            ))}
          </AnimatedGrid>
        </div>
      </section>

      {/* Coverage table */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <h2 className="heading-2 mb-4">Co hradí pojišťovna</h2>
            <p className="body-large mx-auto max-w-2xl">
              Přehled služeb a jejich úhrady ze zdravotního pojištění. Přesné
              podmínky se mohou lišit dle pojišťovny.
            </p>
          </AnimatedSection>

          <motion.div
            className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-card"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring.smooth}
          >
            <table className="w-full">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Služba
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Úhrada
                  </th>
                  <th className="hidden px-6 py-4 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                    Poznámka
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coveredServices.map((item, index) => (
                  <motion.tr
                    key={index}
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
                        : { backgroundColor: 'rgba(46, 155, 184, 0.05)' }
                    }
                  >
                    <td className="px-6 py-4 text-gray-900">{item.service}</td>
                    <td className="px-6 py-4">
                      <motion.span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                          item.coverage.includes('Hrazeno')
                            ? 'bg-success-100 text-success-700'
                            : item.coverage.includes('Částečně')
                              ? 'bg-warning-100 text-warning-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}
                        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                        transition={spring.bouncy}
                      >
                        {item.coverage}
                      </motion.span>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-gray-500 sm:table-cell">
                      {item.note}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Bonus programs */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <h2 className="heading-2 mb-4">Bonusové programy</h2>
            <p className="body-large mx-auto max-w-2xl">
              Mnoho pojišťoven nabízí příspěvky na dentální hygienu v rámci
              preventivních programů. Informujte se u své pojišťovny.
            </p>
          </AnimatedSection>

          <AnimatedGrid columns={2} gap="md" staggerDelay={0.1}>
            {bonusPrograms.map((program, index) => (
              <AnimatedGridItem
                key={index}
                hoverLift
                className="rounded-2xl bg-white p-6 shadow-card"
              >
                <div className="mb-4 flex items-center justify-between">
                  <motion.span
                    className="text-2xl font-bold text-primary-600"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                    transition={spring.bouncy}
                  >
                    {program.insurance}
                  </motion.span>
                  <motion.a
                    href={program.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:underline"
                    whileHover={prefersReducedMotion ? {} : { x: 4 }}
                    transition={spring.snappy}
                  >
                    Více info
                  </motion.a>
                </div>
                <h3 className="heading-4 mb-2">{program.program}</h3>
                <p className="body-base">{program.benefit}</p>
              </AnimatedGridItem>
            ))}
          </AnimatedGrid>
        </div>
      </section>

      {/* How to claim */}
      <AnimatedSection
        as="section"
        className="bg-primary-50 py-16"
        animation="fade-in-up"
      >
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <motion.h2
              className="heading-2 mb-8 text-center"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={spring.smooth}
            >
              Jak uplatnit nárok na příspěvek
            </motion.h2>
            <SimpleTimeline items={claimSteps} staggerDelay={0.15} />
          </div>
        </div>
      </AnimatedSection>

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
            Máte dotazy ohledně pojištění?
          </motion.h2>
          <motion.p
            className="body-large mx-auto mb-8 max-w-2xl"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring.smooth, delay: 0.1 }}
          >
            Rádi vám pomůžeme s informacemi o úhradách a příspěvcích.
            Kontaktujte nás.
          </motion.p>
          <motion.div
            className="flex flex-col justify-center gap-4 sm:flex-row"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring.smooth, delay: 0.2 }}
          >
            <Button asChild size="lg">
              <Link href="/kontakt">Kontaktovat nás</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cenik">Zobrazit ceník</Link>
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  )
}
