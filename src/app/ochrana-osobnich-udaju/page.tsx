import { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Ochrana osobních údajů | Dentální Hygiena',
  description:
    'Informace o zpracování osobních údajů v souladu s GDPR. Jak chráníme vaše osobní údaje a jaká máte práva.',
  keywords: ['GDPR', 'ochrana osobních údajů', 'soukromí', 'práva subjektu'],
}

export default function OchranaOsobnichUdajuPage() {
  return (
    <>
      <PageHeader
        title="Ochrana osobních údajů"
        subtitle="Informace o zpracování osobních údajů v souladu s nařízením GDPR"
        breadcrumbs={[
          { label: 'Úvod', href: '/' },
          { label: 'Ochrana osobních údajů' },
        ]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="prose prose-lg mx-auto max-w-3xl">
            <h2>1. Správce osobních údajů</h2>
            <p>
              Správcem osobních údajů je provozovatel ordinace dentální hygieny:
            </p>
            <ul>
              <li>
                <strong>Jméno:</strong> Jana Nováková
              </li>
              <li>
                <strong>IČO:</strong> 12345678
              </li>
              <li>
                <strong>Adresa:</strong> Korunní 727/7, 120 00 Vinohrady
              </li>
              <li>
                <strong>E-mail:</strong> info@dentalni-hygiena.cz
              </li>
              <li>
                <strong>Telefon:</strong> +420 601 532 676
              </li>
            </ul>

            <h2>2. Účely zpracování osobních údajů</h2>
            <p>Vaše osobní údaje zpracováváme pro následující účely:</p>
            <ul>
              <li>
                <strong>Poskytování zdravotních služeb</strong> - vedení
                zdravotnické dokumentace (právní povinnost)
              </li>
              <li>
                <strong>Objednávkový systém</strong> - správa termínů a
                komunikace s pacienty
              </li>
              <li>
                <strong>Fakturace</strong> - vystavování daňových dokladů
              </li>
              <li>
                <strong>Komunikace</strong> - odpovídání na dotazy z
                kontaktního formuláře
              </li>
            </ul>

            <h2>3. Právní základ zpracování</h2>
            <p>Osobní údaje zpracováváme na základě:</p>
            <ul>
              <li>
                Plnění právní povinnosti (vedení zdravotnické dokumentace dle
                zákona č. 372/2011 Sb.)
              </li>
              <li>Plnění smlouvy (poskytování zdravotních služeb)</li>
              <li>
                Souhlasu subjektu údajů (kontaktní formulář, zasílání
                informací)
              </li>
            </ul>

            <h2>4. Kategorie zpracovávaných údajů</h2>
            <p>Zpracováváme následující kategorie osobních údajů:</p>
            <ul>
              <li>
                <strong>Identifikační údaje:</strong> jméno, příjmení, datum
                narození, rodné číslo
              </li>
              <li>
                <strong>Kontaktní údaje:</strong> adresa, telefon, e-mail
              </li>
              <li>
                <strong>Zdravotní údaje:</strong> zdravotní stav, anamnéza,
                záznamy o ošetření
              </li>
              <li>
                <strong>Údaje o pojištění:</strong> číslo pojišťovny, číslo
                pojištěnce
              </li>
            </ul>

            <h2>5. Doba uchování údajů</h2>
            <ul>
              <li>
                <strong>Zdravotnická dokumentace:</strong> 10 let od posledního
                ošetření (dle vyhlášky č. 98/2012 Sb.)
              </li>
              <li>
                <strong>Účetní doklady:</strong> 10 let dle daňových předpisů
              </li>
              <li>
                <strong>Údaje z kontaktního formuláře:</strong> po dobu
                vyřízení dotazu, max. 1 rok
              </li>
            </ul>

            <h2>6. Příjemci osobních údajů</h2>
            <p>Vaše osobní údaje můžeme sdílet s:</p>
            <ul>
              <li>Zdravotními pojišťovnami (vyúčtování péče)</li>
              <li>Poskytovatelem účetních služeb</li>
              <li>
                Poskytovatelem IT služeb (pouze v nezbytném rozsahu pro
                technickou podporu)
              </li>
            </ul>

            <h2>7. Vaše práva</h2>
            <p>V souvislosti se zpracováním osobních údajů máte právo na:</p>
            <ul>
              <li>
                <strong>Přístup k údajům</strong> - získat informace o tom, jaké
                údaje o vás zpracováváme
              </li>
              <li>
                <strong>Opravu údajů</strong> - požádat o opravu nepřesných nebo
                neúplných údajů
              </li>
              <li>
                <strong>Výmaz údajů</strong> - požádat o výmaz údajů (pokud
                nebrání právní povinnost)
              </li>
              <li>
                <strong>Omezení zpracování</strong> - požádat o omezení
                zpracování v určitých případech
              </li>
              <li>
                <strong>Přenositelnost údajů</strong> - získat své údaje ve
                strukturovaném formátu
              </li>
              <li>
                <strong>Odvolání souhlasu</strong> - kdykoliv odvolat udělený
                souhlas
              </li>
              <li>
                <strong>Podání stížnosti</strong> - podat stížnost u Úřadu pro
                ochranu osobních údajů
              </li>
            </ul>

            <h2>8. Zabezpečení údajů</h2>
            <p>
              Vaše osobní údaje chráníme pomocí technických a organizačních
              opatření:
            </p>
            <ul>
              <li>Šifrovaná komunikace (SSL/TLS)</li>
              <li>Zabezpečený přístup k datům (hesla, dvoufaktorové ověření)</li>
              <li>Pravidelné zálohování dat</li>
              <li>Školení personálu v oblasti ochrany osobních údajů</li>
              <li>Fyzické zabezpečení prostor s dokumentací</li>
            </ul>

            <h2>9. Cookies</h2>
            <p>
              Naše webové stránky používají pouze technicky nezbytné cookies pro
              správné fungování webu. Nepoužíváme analytické ani marketingové
              cookies.
            </p>

            <h2>10. Kontakt pro dotazy</h2>
            <p>
              V případě dotazů ohledně zpracování osobních údajů nás kontaktujte
              na:
            </p>
            <ul>
              <li>
                <strong>E-mail:</strong> gdpr@dentalni-hygiena.cz
              </li>
              <li>
                <strong>Telefon:</strong> +420 601 532 676
              </li>
              <li>
                <strong>Písemně:</strong> Korunní 727/7, 120 00 Vinohrady
              </li>
            </ul>

            <h2>11. Změny tohoto dokumentu</h2>
            <p>
              Tento dokument může být průběžně aktualizován. Datum poslední
              aktualizace: 1. 1. 2024
            </p>

            <h2>Úřad pro ochranu osobních údajů</h2>
            <p>
              Pokud se domníváte, že vaše práva jsou porušena, můžete podat
              stížnost u dozorového úřadu:
            </p>
            <p>
              <strong>Úřad pro ochranu osobních údajů</strong>
              <br />
              Pplk. Sochora 27
              <br />
              170 00 Praha 7
              <br />
              <a
                href="https://www.uoou.cz"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.uoou.cz
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
