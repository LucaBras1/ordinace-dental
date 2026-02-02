import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt | Dentální Hygiena',
  description:
    'Kontaktujte nás pro objednání nebo dotazy. Najdete nás v centru Prahy. Telefon, email, mapa a kontaktní formulář.',
  keywords: [
    'kontakt',
    'dentální hygiena Praha',
    'objednání',
    'telefon',
    'ordinace',
  ],
}

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
