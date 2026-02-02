import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDetailContent } from './ServiceDetailContent'

// Service data
const servicesData = {
  'dentalni-hygiena': {
    title: 'Dentální hygiena',
    subtitle: 'Základ zdravých zubů a dásní',
    description:
      'Profesionální dentální hygiena je základem prevence zubního kazu a onemocnění dásní. Doporučujeme ji provádět minimálně 2x ročně.',
    image: '/images/services/dental-hygiene.jpg',
    price: 'od 1 200 Kč',
    duration: '45-60 minut',
    metaDescription:
      'Profesionální dentální hygiena v Praze. Odstranění zubního kamene, leštění zubů, instruktáž správné péče. Objednejte se online.',
    steps: [
      {
        title: 'Vyšetření',
        description: 'Zkontrolujeme stav vašich zubů a dásní',
      },
      {
        title: 'Odstranění kamene',
        description: 'Ultrazvukem šetrně odstraníme zubní kámen',
      },
      {
        title: 'Čištění',
        description: 'Důkladně vyčistíme všechny povrchy zubů',
      },
      {
        title: 'Leštění',
        description: 'Vyleštíme zuby speciální pastou',
      },
      {
        title: 'Instruktáž',
        description: 'Naučíme vás správnou techniku čištění',
      },
    ],
    forWhom: [
      'Pro každého, kdo chce zdravé zuby',
      'Pro ty, kdo mají problém se zubním kamenem',
      'Pro pacienty s citlivými dásněmi',
      'Pro nositele rovnátek nebo implantátů',
      'Pro těhotné ženy (doporučeno)',
    ],
    benefits: [
      {
        title: 'Prevence kazu',
        description: 'Odstraněním plaku předcházíme vzniku zubního kazu',
      },
      {
        title: 'Zdravé dásně',
        description: 'Pravidelná hygiena chrání před zánětem dásní',
      },
      {
        title: 'Svěží dech',
        description: 'Čisté zuby znamenají příjemný dech',
      },
      {
        title: 'Zářivý úsměv',
        description: 'Vyleštěné zuby vypadají zdravěji a běleji',
      },
    ],
    faq: [
      {
        question: 'Jak často bych měl/a chodit na dentální hygienu?',
        answer:
          'Doporučujeme návštěvu dentální hygienistky 2x ročně. U pacientů s parodontózou nebo jinými problémy může být frekvence vyšší.',
      },
      {
        question: 'Je ošetření bolestivé?',
        answer:
          'Moderní techniky jsou velmi šetrné. U citlivých pacientů můžeme použít lokální znecitlivění.',
      },
      {
        question: 'Jak dlouho trvá ošetření?',
        answer:
          'Standardní ošetření trvá 45-60 minut v závislosti na množství zubního kamene.',
      },
      {
        question: 'Hradí ošetření pojišťovna?',
        answer:
          'Některé pojišťovny přispívají na dentální hygienu. Informujte se u své pojišťovny o podmínkách.',
      },
    ],
  },
  'beleni-zubu': {
    title: 'Bělení zubů',
    subtitle: 'Pro zářivý a sebevědomý úsměv',
    description:
      'Profesionální bělení zubů vám pomůže získat bělejší a zářivější úsměv. Používáme šetrné metody s dlouhotrvajícím efektem.',
    image: '/images/services/whitening.jpg',
    price: 'od 3 500 Kč',
    duration: '60-90 minut',
    metaDescription:
      'Profesionální bělení zubů v Praze. Šetrné metody, viditelný výsledek ihned. Domácí bělící sada v ceně. Objednejte se.',
    steps: [
      {
        title: 'Konzultace',
        description: 'Zhodnotíme vhodnost bělení pro váš případ',
      },
      {
        title: 'Čištění',
        description: 'Před bělením provedeme dentální hygienu',
      },
      {
        title: 'Ochrana dásní',
        description: 'Aplikujeme ochranný gel na dásně',
      },
      {
        title: 'Bělící gel',
        description: 'Naneseme profesionální bělící gel',
      },
      {
        title: 'Aktivace',
        description: 'Gel aktivujeme speciální lampou',
      },
      {
        title: 'Výsledek',
        description: 'Zuby jsou ihned viditelně bělejší',
      },
    ],
    forWhom: [
      'Pro ty, kdo chtějí bělejší úsměv',
      'Pro kuřáky s pigmentovanými zuby',
      'Pro milovníky kávy a čaje',
      'Před důležitými událostmi (svatba, focení)',
      'Pro zvýšení sebevědomí',
    ],
    benefits: [
      {
        title: 'Okamžitý efekt',
        description: 'Viditelný výsledek ihned po ošetření',
      },
      {
        title: 'Šetrné metody',
        description: 'Moderní gely nezatěžují zubní sklovinu',
      },
      {
        title: 'Dlouhotrvající',
        description: 'Efekt vydrží 1-2 roky při správné péči',
      },
      {
        title: 'Domácí sada',
        description: 'V ceně je sada pro domácí údržbu',
      },
    ],
    faq: [
      {
        question: 'Je bělení zubů bezpečné?',
        answer:
          'Ano, profesionální bělení je bezpečné. Používáme osvědčené přípravky, které nezatěžují zubní sklovinu.',
      },
      {
        question: 'Jak dlouho vydrží efekt bělení?',
        answer:
          'Efekt obvykle vydrží 1-2 roky. Záleží na stravovacích návycích a péči o zuby.',
      },
      {
        question: 'Mohou si zuby bělit i citliví pacienti?',
        answer:
          'Ano, existují šetrné metody vhodné i pro citlivé zuby. Vše probereme při konzultaci.',
      },
      {
        question: 'O kolik odstínů zuby zesvětlají?',
        answer:
          'Obvykle o 4-8 odstínů. Výsledek závisí na výchozí barvě a struktuře zubů.',
      },
    ],
  },
  'air-flow': {
    title: 'Air-Flow',
    subtitle: 'Dokonale čisté zuby bez pigmentací',
    description:
      'Air-Flow je moderní technologie pískování zubů, která efektivně odstraňuje pigmentace a plak. Ideální pro kuřáky a milovníky kávy.',
    image: '/images/services/air-flow.jpg',
    price: 'od 800 Kč',
    duration: '30 minut',
    metaDescription:
      'Air-Flow ošetření v Praze. Moderní pískování zubů pro odstranění pigmentací. Šetrné k dásním, okamžitý efekt.',
    steps: [
      {
        title: 'Příprava',
        description: 'Chráníme dásně a rty před ošetřením',
      },
      {
        title: 'Aplikace',
        description: 'Směs vody, vzduchu a jemného prášku',
      },
      {
        title: 'Čištění',
        description: 'Odstraňujeme pigmentace a plak',
      },
      {
        title: 'Opláchnutí',
        description: 'Důkladně vypláchneme zbytky',
      },
      {
        title: 'Leštění',
        description: 'Vyleštíme povrch zubů',
      },
    ],
    forWhom: [
      'Pro kuřáky s pigmentovanými zuby',
      'Pro milovníky kávy, čaje a červeného vína',
      'Pro pacienty s rovnátky',
      'Pro nositele implantátů',
      'Pro ty, kdo chtějí dokonale čisté zuby',
    ],
    benefits: [
      {
        title: 'Rychlé ošetření',
        description: 'Celé ošetření trvá pouze 30 minut',
      },
      {
        title: 'Bezbolestné',
        description: 'Šetrná metoda vhodná i pro citlivé zuby',
      },
      {
        title: 'Příjemná příchuť',
        description: 'Prášek má příjemnou mentolovou příchuť',
      },
      {
        title: 'Okamžitý efekt',
        description: 'Zuby jsou ihned viditelně čistší',
      },
    ],
    faq: [
      {
        question: 'Co je Air-Flow?',
        answer:
          'Air-Flow je technologie využívající směs vody, vzduchu a jemného prášku k šetrnému odstranění pigmentací a plaku.',
      },
      {
        question: 'Je Air-Flow vhodné pro citlivé zuby?',
        answer:
          'Ano, Air-Flow je velmi šetrné a vhodné i pro pacienty s citlivými zuby nebo dásněmi.',
      },
      {
        question: 'Jak často mohu Air-Flow podstoupit?',
        answer:
          'Air-Flow lze provádět při každé dentální hygieně, tedy přibližně 2x ročně.',
      },
      {
        question: 'Nahrazuje Air-Flow klasickou dentální hygienu?',
        answer:
          'Ne, Air-Flow je doplňkem dentální hygieny. Nejlépe funguje v kombinaci s ultrazvukovým čištěním.',
      },
    ],
  },
  parodontologie: {
    title: 'Parodontologie',
    subtitle: 'Specializovaná péče o dásně',
    description:
      'Parodontologické ošetření je zaměřeno na léčbu onemocnění dásní a parodontu. Pomáháme zastavit úbytek kosti a předejít ztrátě zubů.',
    image: '/images/services/periodontics.jpg',
    price: 'od 1 500 Kč',
    duration: '60-90 minut',
    metaDescription:
      'Parodontologické ošetření v Praze. Léčba zánětu dásní, hluboké čištění parodontálních kapes. Specializovaná péče.',
    steps: [
      {
        title: 'Diagnostika',
        description: 'Měření hloubky parodontálních kapes',
      },
      {
        title: 'RTG vyšetření',
        description: 'Zhodnocení stavu kosti',
      },
      {
        title: 'Plán léčby',
        description: 'Sestavíme individuální plán ošetření',
      },
      {
        title: 'Hluboké čištění',
        description: 'Odstranění kamene pod dásněmi',
      },
      {
        title: 'Ošetření kořenů',
        description: 'Vyhlazení povrchu kořenů zubů',
      },
      {
        title: 'Kontroly',
        description: 'Pravidelné kontroly a údržba',
      },
    ],
    forWhom: [
      'Pro pacienty s krvácením dásní',
      'Pro ty, kdo mají zánět dásní',
      'Pro pacienty s parodontózou',
      'Pro prevenci ztráty zubů',
      'Pro pacienty po parodontologické léčbě',
    ],
    benefits: [
      {
        title: 'Zastavení progrese',
        description: 'Zastavíme úbytek kosti a tkání',
      },
      {
        title: 'Zdravé dásně',
        description: 'Léčba zánětu a krvácení dásní',
      },
      {
        title: 'Zachování zubů',
        description: 'Předcházíme ztrátě zubů',
      },
      {
        title: 'Dlouhodobá péče',
        description: 'Pravidelné kontroly pro udržení výsledků',
      },
    ],
    faq: [
      {
        question: 'Co je parodontóza?',
        answer:
          'Parodontóza je chronické onemocnění dásní a kostní tkáně, které může vést ke ztrátě zubů, pokud není léčeno.',
      },
      {
        question: 'Jaké jsou příznaky onemocnění parodontu?',
        answer:
          'Krvácení dásní, zápach z úst, ustupující dásně, viklavost zubů, citlivost na horké a studené.',
      },
      {
        question: 'Je parodontologické ošetření bolestivé?',
        answer:
          'Ošetření provádíme v lokálním znecitlivění, takže je bezbolestné. Po ošetření může být mírná citlivost.',
      },
      {
        question: 'Jak často musím chodit na kontroly?',
        answer:
          'Po aktivní léčbě doporučujeme kontroly každé 3-4 měsíce pro udržení výsledků.',
      },
    ],
  },
}

type ServiceSlug = keyof typeof servicesData

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = servicesData[slug as ServiceSlug]

  if (!service) {
    return {
      title: 'Služba nenalezena | Dentální Hygiena',
    }
  }

  return {
    title: `${service.title} | Dentální Hygiena`,
    description: service.metaDescription,
    keywords: [
      service.title.toLowerCase(),
      'dentální hygiena',
      'Praha',
      'zubní péče',
    ],
  }
}

export function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({ slug }))
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const service = servicesData[slug as ServiceSlug]

  if (!service) {
    notFound()
  }

  return <ServiceDetailContent service={service} />
}
