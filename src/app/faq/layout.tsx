import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Časté dotazy (FAQ) | Dentální Hygiena',
  description:
    'Odpovědi na nejčastější otázky o dentální hygieně. Jak se připravit, co očekávat, jak často chodit na hygienu.',
  keywords: [
    'časté dotazy',
    'FAQ',
    'dentální hygiena',
    'otázky',
    'odpovědi',
  ],
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
