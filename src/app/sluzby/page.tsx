import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Služby | Dentální Hygiena',
  description:
    'Nabízíme profesionální dentální hygienu, bělení zubů, Air-Flow ošetření a parodontologickou péči. Moderní vybavení a individuální přístup.',
  keywords: [
    'dentální hygiena',
    'bělení zubů',
    'Air-Flow',
    'parodontologie',
    'čištění zubů',
  ],
}

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
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.slug}
                className="group overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:shadow-card-hover"
              >
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
                    <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-primary-600">
                      {service.price}
                    </span>
                    <span className="rounded-full bg-white/90 px-3 py-1 text-sm text-gray-600">
                      {service.duration}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="heading-3 mb-3 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h2>
                  <p className="body-base mb-4">{service.description}</p>

                  {/* Features */}
                  <ul className="mb-6 space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
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

                  <Link
                    href={`/sluzby/${service.slug}`}
                    className="inline-flex items-center gap-2 font-medium text-primary-600 transition-colors hover:text-primary-700"
                  >
                    Více informací
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-4 text-white">
            Připraveni na zdravější úsměv?
          </h2>
          <p className="body-large mx-auto mb-8 max-w-2xl text-primary-100">
            Objednejte se ještě dnes a zjistěte, jak vám můžeme pomoci s péčí o
            vaše zuby.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
          </div>
        </div>
      </section>
    </>
  )
}
