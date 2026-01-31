'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection'

const technologies = [
  {
    name: 'Ultrazvukové čištění',
    description:
      'Šetrné odstranění zubního kamene bez poškození skloviny.',
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
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    name: 'Air-Flow systém',
    description:
      'Nejmodernější technologie pro odstranění pigmentací a biofilmu.',
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
          strokeWidth={1.5}
          d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
        />
      </svg>
    ),
  },
  {
    name: 'Digitální RTG',
    description:
      'Přesná diagnostika s minimální radiací pro bezpečné vyšetření.',
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
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    name: 'Sterilizace',
    description:
      'Přísné hygienické standardy a sterilizace všech nástrojů.',
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
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
]

export function Technology() {
  return (
    <section className="section-padding bg-white" id="technologie">
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <AnimatedSection animation="fade-in-up">
            <span className="text-caption uppercase tracking-widest text-primary-600">
              Technologie
            </span>
            <h2 className="heading-2 mt-4 text-balance">
              Moderní vybavení pro vaše pohodlí
            </h2>
            <p className="body-large mt-6">
              Investujeme do nejmodernějších technologií, abychom vám mohli
              poskytovat tu nejkvalitnější péči. Šetrné postupy znamenají
              minimální diskomfort a maximální účinnost.
            </p>

            {/* Technology list */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {technologies.map((tech, index) => (
                <AnimatedItem key={tech.name} index={index} baseDelay={150}>
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600 transition-all duration-300 hover:scale-110 hover:bg-accent-100" aria-hidden="true">
                      {tech.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                </AnimatedItem>
              ))}
            </div>

            <Link
              href="/technologie"
              className="group mt-8 inline-flex items-center font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              Prohlédnout virtuální prohlídku
              <svg
                className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </AnimatedSection>

          {/* Image */}
          <AnimatedSection animation="fade-in-up" delay={200} className="relative">
            <div className="aspect-square overflow-hidden rounded-3xl">
              <Image
                src="/images/office.jpg"
                alt="Moderní dentální ordinace"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Badge */}
            <div className="absolute -left-4 top-8 rounded-2xl bg-white p-4 shadow-card-hover transition-transform duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100">
                  <svg
                    className="h-5 w-5 text-accent-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Certifikované vybavení
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
