import { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { ContactInfo } from '@/components/ui/ContactInfo'
import { Map } from '@/components/ui/Map'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Kontakt | Dentální Hygiena',
  description:
    'Kontaktujte nás pro objednání nebo dotazy. Najdete nás v centru Prahy. Telefon, email, mapa a kontaktní formulář.',
  keywords: [
    'kontakt',
    'dentální hygiena Praha',
    'objednání',
    'telefon',
    'ordinace',
  ],
}

export default function KontaktPage() {
  return (
    <>
      <PageHeader
        title="Kontaktujte nás"
        subtitle="Rádi vám odpovíme na vaše dotazy nebo vás objednáme na vyšetření"
        breadcrumbs={[
          { label: 'Úvod', href: '/' },
          { label: 'Kontakt' },
        ]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact info */}
            <div>
              <h2 className="heading-3 mb-6">Kontaktní údaje</h2>
              <ContactInfo className="mb-8" />

              {/* Map */}
              <div className="mt-8">
                <h3 className="heading-4 mb-4">Kde nás najdete</h3>
                <Map className="h-[300px]" />
              </div>
            </div>

            {/* Contact form */}
            <div>
              <div className="rounded-2xl bg-gray-50 p-6 md:p-8">
                <h2 className="heading-3 mb-2">Napište nám</h2>
                <p className="body-base mb-6">
                  Vyplňte formulář a my se vám co nejdříve ozveme.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to get there */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <h2 className="heading-2 mb-8 text-center">Jak se k nám dostanete</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Metro */}
            <div className="rounded-2xl bg-white p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Metrem</h3>
              <p className="body-base">
                Stanice Můstek (linka A, B) - 5 minut chůze směrem k Václavskému
                náměstí.
              </p>
            </div>

            {/* Tram */}
            <div className="rounded-2xl bg-white p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
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
                    d="M8 7h8m-8 4h8m-8 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                  />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Tramvají</h3>
              <p className="body-base">
                Zastávka Václavské náměstí - tramvaje č. 3, 9, 14, 24.
              </p>
            </div>

            {/* Car */}
            <div className="rounded-2xl bg-white p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
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
                    d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2M5 17l-1 4m16-4l1 4M7 13h.01M17 13h.01"
                  />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Autem</h3>
              <p className="body-base">
                Parkování v blízkém parkovacím domě. Modrá zóna - první hodina
                zdarma pro pacienty.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
