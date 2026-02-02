'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spring } from '@/lib/animations'

const navigation = [
  { name: 'O nás', href: '/o-nas' },
  { name: 'Služby', href: '/sluzby' },
  { name: 'Technologie', href: '/technologie' },
  { name: 'Ceník', href: '/cenik' },
  { name: 'Rezervace', href: '/objednavka' },
  { name: 'Kontakt', href: '/kontakt' },
]

const PHONE_NUMBER = '+420 123 456 789'
const PHONE_HREF = 'tel:+420123456789'

export function Header() {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showFAB, setShowFAB] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 10)
      setShowFAB(currentScrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen, closeMobileMenu])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Calculate dynamic blur based on scroll
  const blurAmount = Math.min(scrollY * 0.5, 20)
  const bgOpacity = Math.min(0.7 + scrollY * 0.002, 0.95)

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={spring.smooth}
        style={
          prefersReducedMotion
            ? {}
            : {
                backdropFilter: isScrolled ? `blur(${blurAmount}px) saturate(180%)` : 'none',
                backgroundColor: isScrolled
                  ? `rgba(255, 255, 255, ${bgOpacity})`
                  : 'transparent',
                boxShadow: isScrolled
                  ? '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)'
                  : 'none',
                transition: 'background-color 0.3s, box-shadow 0.3s, backdrop-filter 0.3s',
              }
        }
      >
        <nav className="container-custom">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                transition={spring.snappy}
              >
                <Image
                  src="/logo.svg"
                  alt="Dentální Hygiena"
                  width={200}
                  height={43}
                  className="h-10 w-auto"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation with animated indicator */}
            <div className="hidden items-center gap-1 lg:flex relative">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const isHovered = hoveredLink === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                      isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                    )}
                    onMouseEnter={() => setHoveredLink(item.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {/* Hover/Active background indicator */}
                    {(isActive || isHovered) && (
                      <motion.div
                        layoutId="nav-indicator"
                        className={cn(
                          'absolute inset-0 rounded-lg -z-10',
                          isActive ? 'bg-primary-50' : 'bg-gray-100'
                        )}
                        initial={false}
                        transition={spring.snappy}
                      />
                    )}

                    {/* Active underline */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full"
                        initial={false}
                        transition={spring.snappy}
                      />
                    )}

                    <span className="relative z-10">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden lg:block">
              <Button variant="gradient" asChild>
                <Link href="/objednavka">Objednat se</Link>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Mobile Call Button */}
              <motion.a
                href={PHONE_HREF}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white shadow-sm touch-target"
                aria-label={`Zavolat na ${PHONE_NUMBER}`}
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </motion.a>

              {/* Mobile Menu Button */}
              <motion.button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors touch-target"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              >
                <svg
                  className="h-6 w-6 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.g
                        key="close"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </motion.g>
                    ) : (
                      <motion.g
                        key="menu"
                        initial={{ opacity: 0, rotate: 90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </motion.g>
                    )}
                  </AnimatePresence>
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Backdrop */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="fixed inset-0 top-20 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMobileMenu}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                className="relative z-50 border-t border-gray-100 bg-white py-4 lg:hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={spring.smooth}
              >
                <div className="flex flex-col gap-2">
                  {navigation.map((item, index) => {
                    const isActive = pathname === item.href

                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          ...spring.smooth,
                          delay: index * 0.05,
                        }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            'px-4 py-3 text-base font-medium transition-colors rounded-lg touch-target block',
                            isActive
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                          )}
                          onClick={closeMobileMenu}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    )
                  })}

                  {/* Quick contact info in mobile menu */}
                  <motion.div
                    className="mt-2 px-4 py-3 border-t border-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <a
                      href={PHONE_HREF}
                      className="flex items-center gap-3 text-primary-600 font-medium"
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
                      {PHONE_NUMBER}
                    </a>
                  </motion.div>

                  <motion.div
                    className="px-4 pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Button variant="gradient" className="w-full" asChild>
                      <Link href="/objednavka" onClick={closeMobileMenu}>
                        Objednat se online
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      {/* Floating Action Button for booking - mobile only */}
      <AnimatePresence>
        {showFAB && (
          <motion.div
            className="fixed bottom-4 right-4 z-40 lg:hidden"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={spring.bouncy}
          >
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              <Link
                href="/objednavka"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                aria-label="Objednat se"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
