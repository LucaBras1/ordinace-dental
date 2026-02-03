'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'

function ChybaContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')
  const errorMessage = searchParams.get('error')

  const getErrorInfo = () => {
    switch (reason) {
      case 'expired':
        return {
          title: 'Rezervace vypršela',
          description: 'Vaše rezervace vypršela. Platba musí být dokončena do 30 minut od vytvoření rezervace.',
          icon: 'clock',
        }
      case 'payment_failed':
        return {
          title: 'Chyba při platbě',
          description: errorMessage || 'Při vytváření platby došlo k chybě. Zkuste to prosím znovu.',
          icon: 'error',
        }
      case 'not_found':
        return {
          title: 'Rezervace nenalezena',
          description: 'Rezervace nebyla nalezena. Možná již byla zpracována nebo zrušena.',
          icon: 'search',
        }
      default:
        return {
          title: 'Něco se pokazilo',
          description: 'Při zpracování vaší rezervace došlo k neočekávané chybě.',
          icon: 'error',
        }
    }
  }

  const errorInfo = getErrorInfo()

  const renderIcon = () => {
    switch (errorInfo.icon) {
      case 'clock':
        return (
          <svg
            className="h-10 w-10 text-orange-600"
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
        )
      case 'search':
        return (
          <svg
            className="h-10 w-10 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )
      default:
        return (
          <svg
            className="h-10 w-10 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
    }
  }

  return (
    <>
      <PageHeader
        title="Chyba rezervace"
        subtitle={errorInfo.title}
        breadcrumbs={[
          { label: 'Úvod', href: '/' },
          { label: 'Objednání', href: '/objednavka' },
          { label: 'Chyba' },
        ]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl bg-white p-8 shadow-card text-center">
              {/* Error Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                {renderIcon()}
              </div>

              <h2 className="heading-2 mb-4 text-red-600">
                {errorInfo.title}
              </h2>

              <p className="body-large mb-6 text-gray-600">
                {errorInfo.description}
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
                      <strong>Vytvořit novou rezervaci</strong> – vraťte se k objednávce
                      a vyberte nový termín
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-sm font-semibold">
                      2
                    </span>
                    <span>
                      <strong>Kontaktovat nás</strong> – pokud problém přetrvává,
                      rádi vám pomůžeme
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-sm font-semibold">
                      3
                    </span>
                    <span>
                      <strong>Rezervovat telefonicky</strong> – můžete si termín
                      rezervovat přímo v ordinaci
                    </span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/objednavka"
                  className="btn btn-primary"
                >
                  Nová rezervace
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

export default function ChybaPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    }>
      <ChybaContent />
    </Suspense>
  )
}
