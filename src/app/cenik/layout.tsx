import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ceník | Dentální Hygiena',
  description:
    'Přehledný ceník služeb dentální hygieny. Transparentní ceny, možnost platby kartou i hotově. Smluvní pojišťovny.',
  keywords: ['ceník', 'ceny dentální hygieny', 'kolik stojí', 'pojišťovny'],
}

export default function CenikLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
