import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O mně | Dentální Hygiena',
  description:
    'Jsem diplomovaná dentální hygienistka s více než 10 lety zkušeností. Specializuji se na preventivní péči a moderní metody ošetření.',
  keywords: [
    'dentální hygienistka',
    'o nás',
    'zkušenosti',
    'kvalifikace',
    'přístup k pacientům',
  ],
}

export default function ONasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
