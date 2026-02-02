import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Rezervace potvrzena | Dentální Hygiena',
  description: 'Vaše rezervace byla úspěšně potvrzena a zaplacena.',
}

export default function UspechPage() {
  return (
    <>
      <PageHeader
        title="Rezervace potvrzena"
        subtitle="Děkujeme za vaši platbu"
        breadcrumbs={[
          { label: 'Úvod', href: '/' },
          { label: 'Objednání', href: '/objednavka' },
          { label: 'Potvrzeno' },
        ]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl bg-white p-8 shadow-card text-center">
              {/* Success Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-10 w-10 text-green-600"
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
              </div>

              <h2 className="heading-2 mb-4 text-green-600">
                Platba proběhla úspěšně!
              </h2>

              <p className="body-large mb-6 text-gray-600">
                Vaše rezervace byla potvrzena. Na váš email jsme odeslali
                potvrzení s detaily návštěvy.
              </p>

              {/* Info Box */}
              <div className="mb-8 rounded-xl bg-blue-50 p-6 text-left">
                <h3 className="mb-3 font-semibold text-blue-900">
                  Co bude následovat:
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start gap-2">
                    <svg
                      className="mt-1 h-5 w-5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      Obdržíte email s potvrzením rezervace a detaily platby
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="mt-1 h-5 w-5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      24 hodin před termínem vám zašleme připomínku
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="mt-1 h-5 w-5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Dostavte se prosím 5 minut před termínem</span>
                  </li>
                </ul>
              </div>

              {/* What to bring */}
              <div className="mb-8 rounded-xl bg-gray-50 p-6 text-left">
                <h3 className="mb-3 font-semibold text-gray-900">
                  Co si přinést:
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">•</span>
                    Průkaz totožnosti (občanský průkaz)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">•</span>
                    Kartu pojišťovny (pokud máte)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">•</span>
                    Seznam léků, které užíváte
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/"
                  className="btn btn-primary"
                >
                  Zpět na úvodní stránku
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
                Máte otázky?{' '}
                <Link
                  href="/kontakt"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  Kontaktujte nás
                </Link>{' '}
                nebo volejte na{' '}
                <a
                  href="tel:+420123456789"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  +420 123 456 789
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
