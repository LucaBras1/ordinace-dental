'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection'

const stats = [
  { value: '10+', label: 'let zkušeností' },
  { value: '5000+', label: 'ošetřených pacientů' },
  { value: '99%', label: 'spokojenost' },
]

const certifications = [
  'Certifikovaná dentální hygienistka',
  'Specializace na parodontologii',
  'Kurzy estetické stomatologie',
  'Pravidelná školení nových metod',
]

export function About() {
  return (
    <section className="section-padding bg-gray-50" id="o-nas">
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <AnimatedSection className="relative" animation="fade-in-up">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src="/images/doctor.jpg"
                alt="Dentální hygienistka"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Stats card */}
            <div className="absolute -bottom-6 -right-6 rounded-2xl bg-white p-6 shadow-card-hover transition-transform duration-300 hover:scale-105 lg:-right-12">
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-heading text-2xl font-bold text-primary-600">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection animation="fade-in-up" delay={200}>
            <span className="text-caption uppercase tracking-widest text-primary-600">
              O mně
            </span>
            <h2 className="heading-2 mt-4 text-balance">
              Vaše zuby v péči odborníka
            </h2>
            <p className="body-large mt-6">
              Jsem certifikovaná dentální hygienistka s více než 10letou praxí.
              Mým cílem je poskytovat profesionální péči v příjemném prostředí,
              kde se budete cítit jako doma.
            </p>
            <p className="body-base mt-4">
              Věřím, že prevence je základem zdravých zubů. Proto kladu důraz na
              edukaci pacientů a individuální přístup ke každému z vás.
            </p>

            {/* Certifications */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900">Kvalifikace</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {certifications.map((cert, index) => (
                  <AnimatedItem key={cert} index={index} baseDelay={100}>
                    <li className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-500"
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
                      <span className="text-sm text-gray-600">{cert}</span>
                    </li>
                  </AnimatedItem>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <Button asChild>
                <Link href="/o-nas">Více o mně</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
