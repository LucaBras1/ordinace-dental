import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'O mně | Dentální Hygiena',
  description:
    'Jsem diplomovaná dentální hygienistka s více než 10 lety zkušeností. Specializuji se na preventivní péči a moderní metody ošetření.',
  keywords: [
    'dentální hygienistka',
    'o nás',
    'zkušenosti',
    'kvalifikace',
    'přístup k pacientům',
  ],
}

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
  { value: '10+', label: 'let zkušeností' },
  { value: '5 000+', label: 'spokojených pacientů' },
  { value: '99%', label: 'spokojenost' },
  { value: '15 000+', label: 'ošetření' },
]

export default function ONasPage() {
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
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src="/images/doctor.jpg"
                  alt="Dentální hygienistka"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Stats card */}
              <div className="absolute -bottom-6 -right-6 rounded-2xl bg-white p-6 shadow-card md:p-8">
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 2).map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl font-bold text-primary-600">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
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
                <ul className="space-y-3">
                  {qualifications.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
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
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <h2 className="heading-2 mb-12 text-center">Můj příběh</h2>
          <div className="relative mx-auto max-w-3xl">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-primary-200 md:left-1/2 md:-translate-x-1/2" />

            {timeline.map((item, index) => (
              <div
                key={item.year}
                className={`relative mb-8 flex items-start gap-8 last:mb-0 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-primary-500 md:left-1/2" />

                {/* Content */}
                <div
                  className={`ml-12 rounded-xl bg-white p-6 shadow-card md:ml-0 md:w-5/12 ${
                    index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
                  }`}
                >
                  <span className="mb-2 inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-600">
                    {item.year}
                  </span>
                  <h3 className="heading-4 mb-2">{item.title}</h3>
                  <p className="body-base">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-2 mb-4 text-center">Můj přístup k pacientům</h2>
          <p className="body-large mx-auto mb-12 max-w-2xl text-center">
            Každé ošetření stavím na čtyřech základních pilířích
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  {value.icon}
                </div>
                <h3 className="heading-4 mb-2">{value.title}</h3>
                <p className="body-base">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 py-16">
        <div className="container-custom">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-white md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-primary-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-4">Pojďme se seznámit</h2>
          <p className="body-large mx-auto mb-8 max-w-2xl">
            Těším se na vaši návštěvu. Objednejte se a společně se postaráme
            o zdraví vašich zubů.
          </p>
          <Button asChild size="lg">
            <Link href="/objednavka">Objednat se</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
