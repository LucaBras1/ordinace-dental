import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Technologie | Dentální Hygiena',
  description:
    'Moderní vybavení naší ordinace. Ultrazvukové čištění, Air-Flow systém, digitální RTG a sterilizační technologie.',
  keywords: [
    'technologie',
    'vybavení ordinace',
    'ultrazvuk',
    'Air-Flow',
    'digitální RTG',
  ],
}

const technologies = [
  {
    title: 'Ultrazvukové čištění',
    description:
      'Nejmodernější ultrazvukové přístroje pro šetrné a efektivní odstranění zubního kamene. Minimální vibrace a maximální komfort.',
    image: '/images/technology/ultrasonic.jpg',
    features: [
      'Šetrné k zubní sklovině',
      'Bezbolestné ošetření',
      'Různé režimy intenzity',
    ],
  },
  {
    title: 'Air-Flow systém',
    description:
      'Profesionální Air-Flow přístroj EMS pro dokonalé odstranění pigmentací a biofilmu. Nejnovější generace s glycinovým práškem.',
    image: '/images/technology/air-flow-device.jpg',
    features: [
      'Šetrný glycinový prášek',
      'Příjemná příchuť',
      'Vhodné i pro citlivé zuby',
    ],
  },
  {
    title: 'Digitální RTG',
    description:
      'Moderní digitální rentgen s minimální radiační zátěží. Okamžité zobrazení snímků pro přesnou diagnostiku.',
    image: '/images/technology/digital-xray.jpg',
    features: [
      'Minimální radiace',
      'Okamžité výsledky',
      'Vysoké rozlišení',
    ],
  },
  {
    title: 'Sterilizace',
    description:
      'Certifikované sterilizační přístroje třídy B pro maximální bezpečnost. Každý nástroj prochází kompletním sterilizačním cyklem.',
    image: '/images/technology/sterilization.jpg',
    features: [
      'Sterilizátory třídy B',
      'Certifikované procesy',
      '100% bezpečnost',
    ],
  },
]

const safetyFeatures = [
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
    title: 'Sterilní prostředí',
    description: 'Všechny nástroje procházejí kompletním sterilizačním cyklem',
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
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
    title: 'Jednorázové pomůcky',
    description: 'Používáme jednorázové rukavice, roušky a další pomůcky',
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
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    title: 'Dezinfekce povrchů',
    description: 'Pravidelná dezinfekce všech povrchů a pracovních ploch',
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    title: 'Certifikace',
    description: 'Všechny přístroje jsou pravidelně certifikovány a servisovány',
  },
]

export default function TechnologiePage() {
  return (
    <>
      <PageHeader
        title="Naše technologie"
        subtitle="Investujeme do nejmodernějšího vybavení pro váš maximální komfort a bezpečnost"
        breadcrumbs={[{ label: 'Úvod', href: '/' }, { label: 'Technologie' }]}
      />

      {/* Technologies grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-2">
            {technologies.map((tech, index) => (
              <article
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-card"
              >
                <div className="relative aspect-[16/10] bg-gray-100">
                  <Image
                    src={tech.image}
                    alt={tech.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="heading-3 mb-3">{tech.title}</h2>
                  <p className="body-base mb-4">{tech.description}</p>
                  <ul className="space-y-2">
                    {tech.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-accent-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Safety section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="heading-2 mb-4">Hygiena a bezpečnost</h2>
            <p className="body-large mb-12">
              Vaše bezpečnost je pro nás prioritou. Dodržujeme nejvyšší standardy
              hygieny a sterilizace.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {safetyFeatures.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 text-center shadow-card"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="heading-4 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-4">Přesvědčte se sami</h2>
          <p className="body-large mx-auto mb-8 max-w-2xl">
            Přijďte se podívat na naši ordinaci a moderní vybavení. Rádi vám vše
            ukážeme a vysvětlíme.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/objednavka">Objednat se</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/kontakt">Kontaktovat nás</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
