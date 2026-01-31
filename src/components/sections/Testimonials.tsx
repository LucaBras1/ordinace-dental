'use client'

import { useState } from 'react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const testimonials = [
  {
    id: 1,
    content:
      'Konečně jsem našla hygienistku, ke které chodím s radostí. Profesionální přístup, moderní vybavení a příjemné prostředí. Moje zuby nikdy nevypadaly lépe!',
    author: 'Marie K.',
    role: 'Pacientka od roku 2022',
    rating: 5,
  },
  {
    id: 2,
    content:
      'Bál jsem se zubaře celý život, ale tady jsem se cítil v bezpečí. Vše mi bylo vysvětleno a ošetření bylo zcela bezbolestné. Doporučuji všem!',
    author: 'Jan P.',
    role: 'Pacient od roku 2023',
    rating: 5,
  },
  {
    id: 3,
    content:
      'Air-Flow čištění je úžasné! Zuby jsou po něm krásně čisté a bílé. Online objednání je super pohodlné a termíny jsou vždy dodrženy.',
    author: 'Petra S.',
    role: 'Pacientka od roku 2021',
    rating: 5,
  },
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="section-padding bg-gray-50" id="recenze">
      <div className="container-custom">
        {/* Header */}
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <span className="text-caption uppercase tracking-widest text-primary-600">
            Recenze
          </span>
          <h2 className="heading-2 mt-4 text-balance">
            Co říkají naši pacienti
          </h2>
        </AnimatedSection>

        {/* Testimonials carousel */}
        <AnimatedSection className="mt-12" delay={200}>
          <div className="mx-auto max-w-3xl">
            {/* Active testimonial */}
            <div
              className="relative rounded-3xl bg-white p-8 shadow-card transition-shadow duration-300 hover:shadow-card-hover md:p-12"
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Quote icon */}
              <svg
                className="absolute left-8 top-8 h-12 w-12 text-primary-100"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>

              {/* Rating */}
              <div className="mb-6 flex justify-center gap-1" aria-label={`Hodnocení: ${testimonials[activeIndex].rating} z 5 hvězdiček`}>
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-center text-lg text-gray-700 md:text-xl">
                &ldquo;{testimonials[activeIndex].content}&rdquo;
              </blockquote>

              {/* Author */}
              <footer className="mt-8 text-center">
                <div className="font-semibold text-gray-900">
                  {testimonials[activeIndex].author}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonials[activeIndex].role}
                </div>
              </footer>
            </div>

            {/* Navigation dots */}
            <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Recenze">
              {testimonials.map((testimonial, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8 bg-primary-500'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Recenze od ${testimonial.author}`}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Google rating */}
        <AnimatedSection className="mt-12 flex items-center justify-center gap-4" delay={300}>
          <div className="flex items-center gap-2">
            <svg className="h-8 w-8" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <div className="text-sm">
              <span className="font-semibold text-gray-900">4.9/5</span>
              <span className="text-gray-500"> (127 recenzí)</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
