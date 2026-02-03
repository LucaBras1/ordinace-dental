import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { SkipLink } from '@/components/ui/SkipLink'
import { ScrollProgress } from '@/components/ui/ScrollProgress'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Dentální Hygiena | Profesionální péče o vaše zuby',
    template: '%s | Dentální Hygiena',
  },
  description:
    'Profesionální dentální hygiena s moderním vybavením. Preventivní péče, bělení zubů, ošetření dásní. Objednejte se online.',
  keywords: [
    'dentální hygiena',
    'zubní hygiena',
    'čištění zubů',
    'bělení zubů',
    'preventivní péče',
    'ošetření dásní',
  ],
  authors: [{ name: 'Dentální Hygiena' }],
  creator: 'Dentální Hygiena',
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'Dentální Hygiena',
    title: 'Dentální Hygiena | Profesionální péče o vaše zuby',
    description:
      'Profesionální dentální hygiena s moderním vybavením. Preventivní péče, bělení zubů, ošetření dásní.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-body">
        <ToastProvider>
          <SkipLink />
          <ScrollProgress />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
