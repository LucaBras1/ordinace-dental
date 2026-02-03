import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Platba zrušena | Dentální Hygiena',
  description: 'Platba byla zrušena. Můžete to zkusit znovu nebo nás kontaktovat.',
}

export default function ZrusenoPage() {
  return (
    <>
      <PageHeader
        title="Platba zrušena"
        subtitle="Vaše platba nebyla dokončena"
        breadcrumbs={[
          { label: 'Úvod', href: '/' },
          { label: 'Objednání', href: '/objednavka' },
          { label: 'Zrušeno' },
        ]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl bg-white p-8 shadow-card text-center">
              {/* Warning Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                <svg
                  className="h-10 w-10 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h2 className="heading-2 mb-4 text-amber-600">
                Platba nebyla dokončena
              </h2>

              <p className="body-large mb-6 text-gray-600">
                Vaše platba byla zrušena nebo vypršela. Nebojte se, žádné peníze
                nebyly strženy z vašeho účtu.
              </p>

              {/* Info Box */}
              <div className="mb-8 rounded-xl bg-blue-50 p-6 text-left">
                <h3 className="mb-3 font-semibold text-blue-900">
                  Co můžete udělat:
                </h3>
                <ul className="space-y-3 text-blue-800">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-sm font-semibold">
                      1
                    </span>
                    <span>
                      <strong>Zkusit to znovu</strong> – vraťte se k rezervaci
                      a dokončete platbu
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-sm font-semibold">
                      2
                    </span>
                    <span>
                      <strong>Kontaktovat nás</strong> – pokud máte problémy
                      s platbou, rádi vám pomůžeme
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-sm font-semibold">
                      3
                    </span>
                    <span>
                      <strong>Zavolat</strong> – můžete si termín rezervovat
                      telefonicky
                    </span>
                  </li>
                </ul>
              </div>

              {/* Reasons Box */}
              <div className="mb-8 rounded-xl bg-gray-50 p-6 text-left">
                <h3 className="mb-3 font-semibold text-gray-900">
                  Možné důvody zrušení:
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    Platba byla zrušena uživatelem
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    Vypršel časový limit pro platbu
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    Problém s kartou nebo bankovním účtem
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    Technický problém při zpracování
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/objednavka"
                  className="btn btn-primary"
                >
                  Zkusit znovu
                </Link>
                <Link
                  href="/kontakt"
                  className="btn btn-outline"
                >
                  Kontaktovat ordinaci
                </Link>
              </div>
            </div>

            {/* Help Box */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 text-center">
              <p className="text-gray-600">
                Potřebujete pomoc?{' '}
                <Link
                  href="/kontakt"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  Kontaktujte nás
                </Link>{' '}
                nebo volejte na{' '}
                <a
                  href="tel:+420601532676"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  +420 601 532 676
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
