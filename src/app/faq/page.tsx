import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'

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

const faqCategories = [
  {
    title: 'Obecné dotazy',
    questions: [
      {
        question: 'Jak často bych měl/a chodit na dentální hygienu?',
        answer:
          'Doporučujeme návštěvu dentální hygienistky minimálně 2x ročně. U pacientů s parodontózou, kuřáků nebo nositelů rovnátek může být frekvence vyšší - každé 3-4 měsíce.',
      },
      {
        question: 'Jak se na ošetření připravit?',
        answer:
          'Speciální příprava není nutná. Doporučujeme si před ošetřením vyčistit zuby. Pokud užíváte léky na ředění krve nebo máte zdravotní omezení, informujte nás předem.',
      },
      {
        question: 'Jak dlouho trvá dentální hygiena?',
        answer:
          'Standardní ošetření trvá 45-60 minut. U pacientů s větším množstvím zubního kamene nebo po delší době bez hygieny může být ošetření delší.',
      },
      {
        question: 'Je ošetření bolestivé?',
        answer:
          'Moderní techniky a přístroje umožňují velmi šetrné ošetření. U citlivých pacientů můžeme použít lokální znecitlivění pro maximální komfort.',
      },
    ],
  },
  {
    title: 'Ceny a pojištění',
    questions: [
      {
        question: 'Kolik stojí dentální hygiena?',
        answer:
          'Cena základní dentální hygieny je od 1 200 Kč. Přesná cena závisí na rozsahu ošetření a aktuálním stavu ústní hygieny. Vstupní vyšetření je zdarma.',
      },
      {
        question: 'Hradí ošetření zdravotní pojišťovna?',
        answer:
          'Dentální hygiena není plně hrazena z veřejného zdravotního pojištění. Některé pojišťovny však přispívají na preventivní péči - informujte se o podmínkách u své pojišťovny.',
      },
      {
        question: 'Jaké platební metody přijímáte?',
        answer:
          'Přijímáme platbu v hotovosti (CZK, EUR), platební kartou (Visa, Mastercard, Maestro) a mobilními platbami (Apple Pay, Google Pay).',
      },
      {
        question: 'Musím platit předem?',
        answer:
          'Ne, platba probíhá až po ukončení ošetření. U rozsáhlejších ošetření můžeme domluvit splátkový kalendář.',
      },
    ],
  },
  {
    title: 'Objednání a návštěva',
    questions: [
      {
        question: 'Jak se mohu objednat?',
        answer:
          'Objednat se můžete online přes náš rezervační systém, telefonicky na čísle +420 123 456 789, nebo e-mailem na info@dentalni-hygiena.cz.',
      },
      {
        question: 'Mohu přijít bez objednání?',
        answer:
          'Doporučujeme se předem objednat, abychom vám mohli věnovat dostatek času. V případě akutních problémů se snažíme vyjít vstříc i bez objednání.',
      },
      {
        question: 'Co když nestihnu domluvený termín?',
        answer:
          'Pokud nemůžete přijít na domluvený termín, dejte nám prosím vědět alespoň 24 hodin předem, abychom mohli termín nabídnout jinému pacientovi.',
      },
      {
        question: 'Je ordinace bezbariérová?',
        answer:
          'Ano, naše ordinace je plně bezbariérová a přístupná pro pacienty na vozíku.',
      },
    ],
  },
  {
    title: 'Ošetření a služby',
    questions: [
      {
        question: 'Jaký je rozdíl mezi dentální hygienou a Air-Flow?',
        answer:
          'Dentální hygiena zahrnuje odstranění zubního kamene ultrazvukem a leštění. Air-Flow je doplňková metoda pískování, která efektivně odstraňuje pigmentace a plak. Nejlepších výsledků dosáhnete kombinací obou metod.',
      },
      {
        question: 'Je bělení zubů bezpečné?',
        answer:
          'Ano, profesionální bělení pod dohledem odborníka je bezpečné. Používáme osvědčené přípravky, které nezatěžují zubní sklovinu.',
      },
      {
        question: 'Mohu na hygienu s rovnátky nebo implantáty?',
        answer:
          'Rozhodně ano! Pacienti s rovnátky nebo implantáty by měli na hygienu chodit dokonce častěji. Používáme speciální nástavce pro šetrné čištění.',
      },
      {
        question: 'Je hygiena vhodná pro těhotné?',
        answer:
          'Ano, dentální hygiena je v těhotenství dokonce doporučena. Hormonální změny mohou způsobit problémy s dásněmi, kterým pravidelná hygiena předchází.',
      },
    ],
  },
  {
    title: 'Péče po ošetření',
    questions: [
      {
        question: 'Na co si dát pozor po ošetření?',
        answer:
          'Po ošetření doporučujeme 2 hodiny nejíst a nepít barevné nápoje. Zuby mohou být dočasně citlivější na horké a studené.',
      },
      {
        question: 'Jak dlouho vydrží efekt bělení?',
        answer:
          'Efekt bělení vydrží obvykle 1-2 roky v závislosti na stravovacích návycích. Doporučujeme omezit kávu, čaj, červené víno a přestat kouřit.',
      },
      {
        question: 'Jak správně pečovat o zuby doma?',
        answer:
          'Doporučujeme čistit zuby 2x denně minimálně 2 minuty, používat mezizubní kartáčky nebo nit a ústní vodu. Při návštěvě vám ukážeme správnou techniku.',
      },
      {
        question: 'Jaký kartáček a pastu používat?',
        answer:
          'Doporučujeme měkký kartáček a pastu s fluoridem. Elektrický kartáček může být efektivnější. Konkrétní doporučení vám dáme při návštěvě.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      <PageHeader
        title="Časté dotazy"
        subtitle="Odpovědi na nejčastější otázky o dentální hygieně a našich službách"
        breadcrumbs={[{ label: 'Úvod', href: '/' }, { label: 'FAQ' }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl space-y-12">
            {faqCategories.map((category, index) => (
              <div key={index}>
                <h2 className="heading-3 mb-6">{category.title}</h2>
                <Accordion>
                  {category.questions.map((item, idx) => (
                    <AccordionItem key={idx} title={item.question}>
                      {item.answer}
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-4">Nenašli jste odpověď?</h2>
          <p className="body-large mx-auto mb-8 max-w-2xl">
            Neváhejte nás kontaktovat. Rádi vám odpovíme na všechny vaše dotazy.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/kontakt">Kontaktovat nás</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="tel:+420123456789">Zavolat</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
