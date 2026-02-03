import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Prohlášení o přístupnosti | Dentální Hygiena',
  description:
    'Informace o přístupnosti webových stránek. Snažíme se, aby náš web byl přístupný všem uživatelům.',
  keywords: ['přístupnost', 'accessibility', 'WCAG', 'bezbariérový web'],
}

export default function PristupnostPage() {
  return (
    <>
      <PageHeader
        title="Prohlášení o přístupnosti"
        subtitle="Naším cílem je, aby tyto webové stránky byly přístupné všem uživatelům"
        breadcrumbs={[{ label: 'Úvod', href: '/' }, { label: 'Přístupnost' }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="prose prose-lg mx-auto max-w-3xl">
            <h2>Náš závazek</h2>
            <p>
              Usilujeme o to, aby naše webové stránky byly přístupné co
              nejširšímu okruhu uživatelů, včetně osob se zdravotním postižením.
              Snažíme se dodržovat doporučení Web Content Accessibility
              Guidelines (WCAG) 2.1 na úrovni AA.
            </p>

            <h2>Opatření pro přístupnost</h2>
            <p>Na našich stránkách jsme implementovali následující opatření:</p>
            <ul>
              <li>
                <strong>Sémantická struktura</strong> - používáme správné HTML
                značky pro nadpisy, seznamy a další prvky
              </li>
              <li>
                <strong>Klávesová navigace</strong> - web je plně ovladatelný
                pomocí klávesnice
              </li>
              <li>
                <strong>Alternativní texty</strong> - obrázky obsahují popisné
                alternativní texty
              </li>
              <li>
                <strong>Kontrastní barvy</strong> - texty mají dostatečný
                kontrast vůči pozadí
              </li>
              <li>
                <strong>Responzivní design</strong> - stránky se přizpůsobují
                různým velikostem obrazovky
              </li>
              <li>
                <strong>Čitelné písmo</strong> - používáme dobře čitelné písmo v
                dostatečné velikosti
              </li>
              <li>
                <strong>Jasná navigace</strong> - struktura webu je logická a
                přehledná
              </li>
              <li>
                <strong>Formuláře</strong> - vstupní pole mají popisky a
                chybové hlášky jsou srozumitelné
              </li>
            </ul>

            <h2>Kompatibilita</h2>
            <p>
              Naše stránky jsou navrženy tak, aby fungovaly s běžně používanými
              webovými prohlížeči a asistenčními technologiemi:
            </p>
            <ul>
              <li>Google Chrome, Mozilla Firefox, Safari, Microsoft Edge</li>
              <li>Čtečky obrazovky (NVDA, JAWS, VoiceOver)</li>
              <li>Zvětšovací software</li>
              <li>Hlasové ovládání</li>
            </ul>

            <h2>Známá omezení</h2>
            <p>
              I přes naši snahu mohou některé části webu obsahovat nedostatky v
              přístupnosti:
            </p>
            <ul>
              <li>
                Některé starší dokumenty PDF nemusí být plně přístupné
              </li>
              <li>
                Vložené mapy třetích stran mohou mít omezenou přístupnost
              </li>
            </ul>
            <p>
              Pracujeme na postupném odstraňování těchto nedostatků.
            </p>

            <h2>Bezbariérová ordinace</h2>
            <p>
              Kromě webových stránek dbáme také na fyzickou přístupnost naší
              ordinace:
            </p>
            <ul>
              <li>Bezbariérový vstup do budovy</li>
              <li>Výtah do všech pater</li>
              <li>Přístupné toalety</li>
              <li>Dostatek prostoru pro pohyb s vozíkem</li>
            </ul>

            <h2>Zpětná vazba</h2>
            <p>
              Pokud narazíte na problém s přístupností našich stránek nebo máte
              návrhy na zlepšení, budeme rádi za vaši zpětnou vazbu.
              Kontaktujte nás prosím:
            </p>
            <ul>
              <li>
                <strong>E-mail:</strong>{' '}
                <a href="mailto:pristupnost@dentalni-hygiena.cz">
                  pristupnost@dentalni-hygiena.cz
                </a>
              </li>
              <li>
                <strong>Telefon:</strong>{' '}
                <a href="tel:+420601532676">+420 601 532 676</a>
              </li>
              <li>
                <strong>Kontaktní formulář:</strong>{' '}
                <Link href="/kontakt">Kontaktovat nás</Link>
              </li>
            </ul>

            <h2>Průběžné zlepšování</h2>
            <p>
              Přístupnost našeho webu pravidelně kontrolujeme a vyhodnocujeme.
              Používáme automatizované testovací nástroje i manuální testování.
              Naším cílem je neustálé zlepšování přístupnosti pro všechny
              uživatele.
            </p>

            <h2>Datum aktualizace</h2>
            <p>Toto prohlášení bylo naposledy aktualizováno: 1. 1. 2024</p>
          </div>
        </div>
      </section>
    </>
  )
}
