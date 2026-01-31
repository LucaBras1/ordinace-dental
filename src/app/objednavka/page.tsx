import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { BookingForm } from './BookingForm'

export const metadata: Metadata = {
  title: 'Online objednání | Dentální Hygiena',
  description:
    'Objednejte se online na dentální hygienu. Rychle a jednoduše si vyberte termín, který vám vyhovuje.',
  keywords: ['objednání', 'rezervace', 'online', 'termín', 'dentální hygiena'],
}

const steps = [
  {
    number: '1',
    title: 'Vyplňte formulář',
    description: 'Vyberte službu a preferovaný termín',
  },
  {
    number: '2',
    title: 'Potvrzení',
    description: 'Ozveme se vám pro potvrzení termínu',
  },
  {
    number: '3',
    title: 'Návštěva',
    description: 'Přijďte na domluvený termín',
  },
]

export default function ObjednavkaPage() {
  return (
    <>
      <PageHeader
        title="Online objednání"
        subtitle="Vyberte si službu a preferovaný termín. Ozveme se vám do 24 hodin s potvrzením."
        breadcrumbs={[{ label: 'Úvod', href: '/' }, { label: 'Objednání' }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-6 shadow-card md:p-8">
                <h2 className="heading-3 mb-6">Rezervační formulář</h2>
                <BookingForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* How it works */}
              <div className="rounded-2xl bg-gray-50 p-6">
                <h3 className="heading-4 mb-4">Jak to funguje</h3>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div key={step.number} className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
                        {step.number}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{step.title}</p>
                        <p className="text-sm text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="rounded-2xl bg-primary-50 p-6">
                <h3 className="heading-4 mb-4">Raději telefonicky?</h3>
                <p className="body-base mb-4">
                  Volejte nás v ordinačních hodinách:
                </p>
                <a
                  href="tel:+420123456789"
                  className="flex items-center gap-3 text-lg font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  +420 123 456 789
                </a>
                <p className="mt-3 text-sm text-gray-500">
                  Po-Pá: 8:00 - 17:00
                </p>
              </div>

              {/* Info box */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="heading-4 mb-4">Důležité informace</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
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
                    Vstupní vyšetření je zdarma
                  </li>
                  <li className="flex items-start gap-2">
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
                    Přijímáme většinu pojišťoven
                  </li>
                  <li className="flex items-start gap-2">
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
                    Platba kartou i hotově
                  </li>
                  <li className="flex items-start gap-2">
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
                    Bezbariérový přístup
                  </li>
                </ul>
                <Link
                  href="/faq"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                >
                  Časté dotazy
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
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
