'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-hero-premium">
      {/* Premium gradient mesh background */}
      <div className="absolute inset-0 -z-10 bg-gradient-mesh opacity-80" />
      <div className="absolute inset-0 -z-10 bg-gradient-mesh-hero" />

      {/* Subtle animated gradient orbs */}
      <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary-200/20 blur-[100px] animate-pulse-subtle" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent-200/20 blur-[100px] animate-pulse-subtle animation-delay-500" />

      <div className="container-custom flex min-h-screen items-center pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Content */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full glass-card px-4 py-2 text-sm font-medium text-primary-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
              </span>
              Přijímáme nové pacienty
            </div>

            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Profesionální péče
              <span className="text-gradient-primary"> o váš úsměv</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 lg:text-xl">
              Moderní dentální hygiena s laskavým přístupem. Pomáháme vám
              udržet zdravé zuby a krásný úsměv po celý život.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" variant="gradient" asChild>
                <Link href="/objednavka">
                  Objednat se online
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/sluzby">Prohlédnout služby</Link>
              </Button>
            </div>

            {/* Trust indicators - visible on all screens */}
            <div className="mt-12 flex flex-wrap items-center gap-6 sm:gap-8">
              <div className="flex items-center gap-3">
                {/* Gradient avatars */}
                <div className="flex -space-x-2">
                  {[
                    'from-primary-400 to-primary-600',
                    'from-accent-400 to-accent-600',
                    'from-primary-300 to-accent-500',
                    'from-accent-300 to-primary-500',
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br ${gradient} shadow-sm flex items-center justify-center`}
                    >
                      <svg
                        className="h-5 w-5 text-white/80"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">
                    <AnimatedCounter end={500} suffix="+" />
                  </span>
                  <span className="text-gray-600"> spokojených pacientů</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">4.9/5</span> na
                  Google
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/hero.jpg"
                alt="Krásný zdravý úsměv"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Glassmorphism floating card */}
            <GlassCard
              variant="strong"
              hover={false}
              className="absolute -left-8 bottom-12 p-4 animate-float"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Volné termíny</p>
                  <p className="text-sm text-gray-500">Již tento týden</p>
                </div>
              </div>
            </GlassCard>

            {/* Additional floating element */}
            <GlassCard
              variant="default"
              hover={false}
              className="absolute -right-4 top-20 p-3 animate-float animation-delay-300"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600">
                  <svg
                    className="h-5 w-5 text-white"
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
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    <AnimatedCounter end={15} /> let
                  </p>
                  <p className="text-xs text-gray-500">zkušeností</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Scrollujte</span>
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
