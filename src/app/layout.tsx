import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-body">{children}</body>
    </html>
  )
}
