import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pojišťovny | Dentální Hygiena',
  description:
    'Informace o smluvních pojišťovnách a úhradách za dentální hygienu. VZP, VOZP, ČPZP, OZP a další.',
  keywords: [
    'pojišťovny',
    'VZP',
    'zdravotní pojištění',
    'úhrada',
    'příspěvky',
  ],
}

export default function PojistovnyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
