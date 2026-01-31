import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { PriceTable } from '@/components/ui/PriceTable'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Ceník | Dentální Hygiena',
  description:
    'Přehledný ceník služeb dentální hygieny. Transparentní ceny, možnost platby kartou i hotově. Smluvní pojišťovny.',
  keywords: ['ceník', 'ceny dentální hygieny', 'kolik stojí', 'pojišťovny'],
}

const mainServices = [
  {
    name: 'Vstupní vyšetření + konzultace',
    description: 'Zhodnocení stavu ústní hygieny a sestavení plánu péče',
    price: 'zdarma',
    note: 'při objednání ošetření',
  },
  {
    name: 'Dentální hygiena - základní',
    description: 'Odstranění zubního kamene, leštění, instruktáž',
    price: '1 200 Kč',
  },
  {
    name: 'Dentální hygiena - komplexní',
    description: 'Základní hygiena + Air-Flow + fluoridace',
    price: '1 800 Kč',
  },
  {
    name: 'Air-Flow ošetření',
    description: 'Pískování pro odstranění pigmentací',
    price: '800 Kč',
  },
  {
    name: 'Bělení zubů - ordinační',
    description: 'Profesionální bělení v ordinaci',
    price: '3 500 Kč',
  },
  {
    name: 'Bělení zubů - domácí sada',
    description: 'Individuální nosiče + bělící gel',
    price: '2 500 Kč',
  },
]

const additionalServices = [
  {
    name: 'Parodontologické ošetření - 1 kvadrant',
    description: 'Hluboké čištění parodontálních kapes',
    price: '1 500 Kč',
  },
  {
    name: 'Parodontologické ošetření - celá ústa',
    description: 'Kompletní hluboké čištění všech kvadrantů',
    price: '5 000 Kč',
  },
  {
    name: 'Fluoridace',
    description: 'Aplikace fluoridového laku',
    price: '300 Kč',
  },
  {
    name: 'Pečetění fisur',
    description: 'Preventivní ošetření jednoho zubu',
    price: '400 Kč',
    note: 'za zub',
  },
  {
    name: 'Kontrolní návštěva',
    description: 'Kontrola stavu po ošetření',
    price: 'zdarma',
  },
]

const insuranceCompanies = [
  { name: 'VZP', code: '111' },
  { name: 'VOZP', code: '201' },
  { name: 'ČPZP', code: '205' },
  { name: 'OZP', code: '207' },
  { name: 'ZPŠ', code: '209' },
  { name: 'ZPMV', code: '211' },
  { name: 'RBP', code: '213' },
]

export default function CenikPage() {
  return (
    <>
      <PageHeader
        title="Ceník služeb"
        subtitle="Transparentní ceny bez skrytých poplatků. Cena je vždy stanovena individuálně podle rozsahu ošetření."
        breadcrumbs={[{ label: 'Úvod', href: '/' }, { label: 'Ceník' }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          {/* Info box */}
          <div className="mb-12 rounded-2xl bg-primary-50 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="heading-4 mb-2">Individuální kalkulace</h2>
                <p className="body-base">
                  Každý pacient je jedinečný a výsledná cena závisí na aktuálním
                  stavu ústní hygieny, množství zubního kamene a dalších
                  faktorech. Přesnou cenu vám sdělíme při vstupním vyšetření,
                  které je{' '}
                  <strong className="text-primary-600">zdarma</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Price tables */}
          <div className="grid gap-8 lg:grid-cols-2">
            <PriceTable title="Hlavní služby" items={mainServices} />
            <PriceTable title="Doplňkové služby" items={additionalServices} />
          </div>

          {/* Insurance section */}
          <div className="mt-12 rounded-2xl bg-white p-6 shadow-card md:p-8">
            <h2 className="heading-3 mb-6">Smluvní pojišťovny</h2>
            <p className="body-base mb-6">
              Jsme smluvním partnerem většiny zdravotních pojišťoven. Část
              ošetření může být hrazena z vašeho pojištění - informujte se o
              výhodách vašeho pojistného plánu.
            </p>
            <div className="flex flex-wrap gap-3">
              {insuranceCompanies.map((company) => (
                <div
                  key={company.code}
                  className="rounded-xl bg-gray-100 px-4 py-2"
                >
                  <span className="font-medium text-gray-900">
                    {company.name}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({company.code})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment methods */}
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-card md:p-8">
            <h2 className="heading-3 mb-6">Platební metody</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <svg
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Hotově</p>
                  <p className="text-sm text-gray-500">CZK, EUR</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <svg
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Platební kartou</p>
                  <p className="text-sm text-gray-500">
                    Visa, Mastercard, Maestro
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <svg
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mobilem</p>
                  <p className="text-sm text-gray-500">Apple Pay, Google Pay</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="body-large mb-6">
              Máte dotazy ohledně cen nebo pojištění?
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
        </div>
      </section>
    </>
  )
}
