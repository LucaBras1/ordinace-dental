'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { AnimatedGradient } from '@/components/ui/AnimatedGradient'
import { TextReveal } from '@/components/ui/TextReveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useParallax } from '@/hooks/useParallax'
import {
  fadeInUp,
  staggerContainer,
  spring,
  viewport,
  pulseGlow,
  scrollIndicator,
} from '@/lib/animations'

export function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const parallax = useParallax({ intensity: 0.02 })

  // Scroll-based parallax for hero image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-10%'])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-hero-premium"
    >
      {/* Animated gradient background */}
      <AnimatedGradient variant="hero" />

      <div className="container-custom flex min-h-screen items-center pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Content */}
          <motion.div
            className="flex flex-col justify-center"
            style={
              prefersReducedMotion
                ? {}
                : {
                    opacity: contentOpacity,
                    y: contentY,
                  }
            }
          >
            {/* Badge with pulse glow */}
            <motion.div
              className="inline-flex w-fit items-center gap-2 rounded-full glass-card px-4 py-2 text-sm font-medium text-primary-700"
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spring.bouncy}
              variants={pulseGlow}
              whileHover="animate"
            >
              <span className="relative flex h-2 w-2">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-accent-400"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: [1, 1.5, 1],
                          opacity: [0.75, 0, 0.75],
                        }
                  }
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
              </span>
              Přijímáme nové pacienty
            </motion.div>

            {/* Hero Title with Text Reveal */}
            <div className="mt-6">
              <TextReveal
                as="h1"
                className="font-heading text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-display-lg"
                delay={0.2}
                highlightWords={['úsměv']}
                highlightClassName="text-gradient-primary"
              >
                Profesionální péče o váš úsměv
              </TextReveal>
            </div>

            {/* Subtitle with fade-in */}
            <motion.p
              className="mt-6 text-lg text-gray-600 lg:text-xl"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.smooth, delay: 0.6 }}
            >
              Moderní dentální hygiena s laskavým přístupem. Pomáháme vám udržet
              zdravé zuby a krásný úsměv po celý život.
            </motion.p>

            {/* CTA Buttons with stagger */}
            <motion.div
              className="mt-8 flex flex-col gap-4 sm:flex-row"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp}>
                <Button size="lg" variant="gradient" className="btn-shine" asChild>
                  <Link href="/objednavka">
                    Objednat se online
                    <motion.svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={spring.snappy}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </motion.svg>
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/sluzby">Prohlédnout služby</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="mt-12 flex flex-wrap items-center gap-6 sm:gap-8"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.smooth, delay: 0.8 }}
            >
              <div className="flex items-center gap-3">
                {/* Gradient avatars */}
                <div className="flex -space-x-2">
                  {[
                    'from-primary-400 to-primary-600',
                    'from-accent-400 to-accent-600',
                    'from-primary-300 to-accent-500',
                    'from-accent-300 to-primary-500',
                  ].map((gradient, i) => (
                    <motion.div
                      key={i}
                      className={`h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br ${gradient} shadow-sm flex items-center justify-center`}
                      initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        ...spring.bouncy,
                        delay: 0.9 + i * 0.1,
                      }}
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
                    </motion.div>
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
                    <motion.svg
                      key={i}
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        ...spring.bouncy,
                        delay: 1.1 + i * 0.05,
                      }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">4.9/5</span> na
                  Google
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image with Parallax */}
          <div className="relative hidden lg:block">
            <motion.div
              className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl"
              style={
                prefersReducedMotion
                  ? {}
                  : {
                      y: imageY,
                      scale: imageScale,
                    }
              }
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring.slow, delay: 0.3 }}
            >
              <Image
                src="/images/hero.jpg"
                alt="Krásný zdravý úsměv"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>

            {/* Floating card - Left */}
            <motion.div
              className="absolute -left-8 bottom-24"
              initial={prefersReducedMotion ? {} : { opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ ...spring.smooth, delay: 0.6 }}
              style={
                prefersReducedMotion
                  ? {}
                  : {
                      x: parallax.x * 0.5,
                      y: parallax.y * 0.5,
                    }
              }
            >
              <GlassCard variant="strong" hover={false} className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg"
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            y: [-5, 5, -5],
                          }
                    }
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
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
                  </motion.div>
                  <div>
                    <p className="font-semibold text-gray-900">Volné termíny</p>
                    <p className="text-sm text-gray-500">Již tento týden</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Floating card - Right */}
            <motion.div
              className="absolute -right-4 top-20"
              initial={prefersReducedMotion ? {} : { opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ ...spring.smooth, delay: 0.8 }}
              style={
                prefersReducedMotion
                  ? {}
                  : {
                      x: parallax.x * -0.3,
                      y: parallax.y * -0.3,
                    }
              }
            >
              <GlassCard variant="default" hover={false} className="p-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600"
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            rotate: [0, 5, -5, 0],
                          }
                    }
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
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
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      <AnimatedCounter end={15} /> let
                    </p>
                    <p className="text-xs text-gray-500">zkušeností</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with SVG line animation */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        variants={scrollIndicator}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, 8, 0],
                }
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-xs uppercase tracking-wider text-gray-400">
            Scrollujte
          </span>
          <svg
            className="h-10 w-6 text-gray-400"
            viewBox="0 0 24 40"
            fill="none"
            stroke="currentColor"
          >
            {/* Mouse outline */}
            <rect
              x="4"
              y="2"
              width="16"
              height="26"
              rx="8"
              strokeWidth="2"
              className="stroke-gray-300"
            />
            {/* Scroll dot */}
            <motion.circle
              cx="12"
              cy="10"
              r="2"
              fill="currentColor"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      cy: [10, 18, 10],
                    }
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Arrow */}
            <motion.path
              d="M8 34 L12 38 L16 34"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
