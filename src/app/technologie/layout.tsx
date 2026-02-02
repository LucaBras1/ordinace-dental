import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technologie | Dentální Hygiena',
  description:
    'Moderní vybavení naší ordinace. Ultrazvukové čištění, Air-Flow systém, digitální RTG a sterilizační technologie.',
  keywords: [
    'technologie',
    'vybavení ordinace',
    'ultrazvuk',
    'Air-Flow',
    'digitální RTG',
  ],
}

export default function TechnologieLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
