import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Pojišťovny | Dentální Hygiena',
  description:
    'Informace o smluvních pojišťovnách a úhradách za dentální hygienu. VZP, VOZP, ČPZP, OZP a další.',
  keywords: [
    'pojišťovny',
    'VZP',
    'zdravotní pojištění',
    'úhrada',
    'příspěvky',
  ],
}

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

export default function PojistovnyPage() {
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
          <h2 className="heading-2 mb-8 text-center">Smluvní pojišťovny</h2>
          <p className="body-large mx-auto mb-12 max-w-2xl text-center">
            Jsme smluvním partnerem všech hlavních zdravotních pojišťoven v ČR.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {insuranceCompanies.map((company) => (
              <div
                key={company.code}
                className="rounded-2xl bg-white p-6 text-center shadow-card"
              >
                <div className="mb-2 text-3xl font-bold text-primary-600">
                  {company.abbr}
                </div>
                <p className="text-sm text-gray-600">{company.name}</p>
                <p className="mt-2 text-xs text-gray-400">Kód: {company.code}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage table */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <h2 className="heading-2 mb-8 text-center">Co hradí pojišťovna</h2>
          <p className="body-large mx-auto mb-12 max-w-2xl text-center">
            Přehled služeb a jejich úhrady ze zdravotního pojištění. Přesné
            podmínky se mohou lišit dle pojišťovny.
          </p>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-card">
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
                  <tr key={index}>
                    <td className="px-6 py-4 text-gray-900">{item.service}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                          item.coverage.includes('Hrazeno')
                            ? 'bg-success-100 text-success-700'
                            : item.coverage.includes('Částečně')
                            ? 'bg-warning-100 text-warning-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.coverage}
                      </span>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-gray-500 sm:table-cell">
                      {item.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bonus programs */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-2 mb-8 text-center">Bonusové programy</h2>
          <p className="body-large mx-auto mb-12 max-w-2xl text-center">
            Mnoho pojišťoven nabízí příspěvky na dentální hygienu v rámci
            preventivních programů. Informujte se u své pojišťovny.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {bonusPrograms.map((program, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 shadow-card"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">
                    {program.insurance}
                  </span>
                  <a
                    href={program.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Více info
                  </a>
                </div>
                <h3 className="heading-4 mb-2">{program.program}</h3>
                <p className="body-base">{program.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to claim */}
      <section className="bg-primary-50 py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <h2 className="heading-2 mb-8 text-center">
              Jak uplatnit nárok na příspěvek
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
                  1
                </div>
                <div>
                  <h3 className="heading-4 mb-1">Zkontrolujte podmínky</h3>
                  <p className="body-base">
                    Navštivte web své pojišťovny nebo zavolejte na infolinku a
                    zjistěte, jaké příspěvky nabízí.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
                  2
                </div>
                <div>
                  <h3 className="heading-4 mb-1">Absolvujte ošetření</h3>
                  <p className="body-base">
                    Přijďte k nám na dentální hygienu. Po ošetření vám vystavíme
                    doklad o zaplacení.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
                  3
                </div>
                <div>
                  <h3 className="heading-4 mb-1">Požádejte o příspěvek</h3>
                  <p className="body-base">
                    S dokladem požádejte svou pojišťovnu o proplacení příspěvku
                    - obvykle online nebo na pobočce.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-4">Máte dotazy ohledně pojištění?</h2>
          <p className="body-large mx-auto mb-8 max-w-2xl">
            Rádi vám pomůžeme s informacemi o úhradách a příspěvcích.
            Kontaktujte nás.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/kontakt">Kontaktovat nás</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cenik">Zobrazit ceník</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
