import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Online objednání | Dentální Hygiena',
  description:
    'Objednejte se online na dentální hygienu. Rychle a jednoduše si vyberte termín, který vám vyhovuje.',
  keywords: ['objednání', 'rezervace', 'online', 'termín', 'dentální hygiena'],
}

export default function ObjednavkaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
