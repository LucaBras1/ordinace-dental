import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recenze | Dentální Hygiena',
  description:
    'Přečtěte si, co o nás říkají naši pacienti. Hodnocení 4.9/5 na Google s více než 120 recenzemi.',
  keywords: ['recenze', 'hodnocení', 'zkušenosti', 'pacienti', 'reference'],
}

export default function RecenzeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
