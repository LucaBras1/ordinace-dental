import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const services = [
  {
    title: 'Dentální hygiena',
    description:
      'Profesionální čištění zubů ultrazvukem a Air-Flow technologií pro dokonale čisté zuby.',
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    href: '/sluzby/dentalni-hygiena',
    price: 'od 1 200 Kč',
  },
  {
    title: 'Bělení zubů',
    description:
      'Šetrné a účinné bělení pro zářivě bílý úsměv. Viditelné výsledky již po první návštěvě.',
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
    href: '/sluzby/beleni-zubu',
    price: 'od 3 500 Kč',
  },
  {
    title: 'Air-Flow',
    description:
      'Revoluční metoda odstraňování pigmentací a plaku pomocí jemného proudu vody a prášku.',
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
        />
      </svg>
    ),
    href: '/sluzby/air-flow',
    price: 'od 800 Kč',
  },
  {
    title: 'Parodontologie',
    description:
      'Léčba onemocnění dásní a prevence jejich zánětů. Zdravé dásně jsou základem zdravých zubů.',
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    href: '/sluzby/parodontologie',
    price: 'od 1 500 Kč',
  },
]

export function Services() {
  return (
    <section className="section-padding bg-white" id="sluzby">
      <div className="container-custom">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-caption uppercase tracking-widest text-primary-600">
            Naše služby
          </span>
          <h2 className="heading-2 mt-4 text-balance">
            Komplexní péče o vaše zuby
          </h2>
          <p className="body-large mt-4">
            Nabízíme širokou škálu služeb dentální hygieny s využitím moderních
            technologií a šetrných postupů.
          </p>
        </div>

        {/* Services grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group card flex flex-col"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                {service.icon}
              </div>

              <h3 className="heading-4 mt-6">{service.title}</h3>

              <p className="body-small mt-3 flex-grow">{service.description}</p>

              <div className="mt-6 flex items-center justify-between">
                <span className="font-semibold text-primary-600">
                  {service.price}
                </span>
                <span className="flex items-center text-sm font-medium text-gray-600 transition-colors group-hover:text-primary-600">
                  Více info
                  <svg
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
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
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/sluzby">Zobrazit všechny služby</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
