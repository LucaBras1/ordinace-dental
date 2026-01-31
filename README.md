# Dentální Hygiena - Webové stránky ordinace

Moderní webové stránky pro ordinaci dentální hygieny vytvořené v Next.js 14 s TypeScriptem a Tailwind CSS.

## Funkce

- **15 plně responzivních stránek** - od homepage po právní dokumenty
- **Moderní design** - healthcare design s důrazem na důvěru a profesionalitu
- **SEO optimalizace** - meta tagy, strukturovaná data (Schema.org)
- **Přístupnost** - WCAG 2.1 AA kompatibilita
- **Rychlý výkon** - staticky generované stránky, optimalizované obrázky

## Struktura stránek

### Hlavní stránky
| Stránka | Popis |
|---------|-------|
| `/` | Homepage s hero sekcí, službami, technologiemi a recenzemi |
| `/o-nas` | Představení dentální hygienistky, příběh, hodnoty |
| `/sluzby` | Přehled všech nabízených služeb |
| `/cenik` | Ceník služeb s informacemi o pojišťovnách |
| `/kontakt` | Kontaktní údaje, mapa, kontaktní formulář |
| `/objednavka` | Online rezervační formulář |

### Detaily služeb
| Stránka | Popis |
|---------|-------|
| `/sluzby/dentalni-hygiena` | Profesionální čištění zubů |
| `/sluzby/beleni-zubu` | Bělení zubů |
| `/sluzby/air-flow` | Pískování technologií Air-Flow |
| `/sluzby/parodontologie` | Léčba onemocnění dásní |

### Informační stránky
| Stránka | Popis |
|---------|-------|
| `/technologie` | Vybavení ordinace |
| `/faq` | Často kladené otázky |
| `/recenze` | Recenze pacientů |
| `/pojistovny` | Informace o pojišťovnách a příspěvcích |

### Právní stránky
| Stránka | Popis |
|---------|-------|
| `/ochrana-osobnich-udaju` | GDPR informace |
| `/pristupnost` | Prohlášení o přístupnosti |

## Technologie

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Jazyk:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI komponenty:** Vlastní komponenty s [Radix UI](https://www.radix-ui.com/)
- **Fonty:** Inter (body), Playfair Display (headings)

## UI Komponenty

Projekt obsahuje vlastní knihovnu UI komponent:

| Komponenta | Popis |
|------------|-------|
| `Button` | Tlačítko s variantami (primary, secondary, outline, ghost) |
| `PageHeader` | Hlavička podstránek s breadcrumbs |
| `Breadcrumbs` | Drobečková navigace se Schema.org |
| `Card` | Univerzální karta |
| `Input` | Formulářový input s validací |
| `Textarea` | Víceřádkové textové pole |
| `Select` | Dropdown výběr |
| `Accordion` | Akordeon pro FAQ sekce |
| `PriceTable` | Tabulka s cenami |
| `ContactInfo` | Kontaktní údaje s hodinami |
| `Map` | Embed mapa |

## Instalace

```bash
# Klonování repozitáře
git clone https://github.com/LucaBras1/ordinace-dental.git
cd ordinace-dental

# Instalace závislostí
npm install

# Spuštění development serveru
npm run dev

# Build pro produkci
npm run build

# Spuštění produkčního serveru
npm start
```

## Struktura projektu

```
src/
├── app/                    # Next.js App Router stránky
│   ├── page.tsx           # Homepage
│   ├── kontakt/           # Kontaktní stránka
│   ├── sluzby/            # Služby + detaily
│   ├── cenik/             # Ceník
│   ├── o-nas/             # O nás
│   ├── objednavka/        # Online rezervace
│   ├── technologie/       # Vybavení ordinace
│   ├── faq/               # FAQ
│   ├── recenze/           # Recenze
│   ├── pojistovny/        # Pojišťovny
│   ├── ochrana-osobnich-udaju/  # GDPR
│   └── pristupnost/       # Přístupnost
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Hero, Services, About, etc.
│   └── ui/                # Reusable UI komponenty
├── lib/
│   └── utils.ts           # Utility funkce (cn)
└── public/
    ├── images/            # Obrázky
    └── logo.svg           # Logo
```

## Barevná paleta

| Barva | Hodnota | Použití |
|-------|---------|---------|
| Primary | `#2E9BB8` | Hlavní akcentová barva (lékařská modrá) |
| Accent | `#1AB69A` | Sekundární akcent (čistá máta) |
| Gray | Tailwind grays | Texty, pozadí |

## Scripts

```bash
npm run dev      # Spuštění dev serveru
npm run build    # Produkční build
npm run start    # Spuštění produkce
npm run lint     # ESLint kontrola
```

## Deployment

Projekt je připraven pro deployment na:
- Vercel (doporučeno)
- Netlify
- VPS s Node.js

## Licence

Tento projekt je soukromý a není určen k veřejné distribuci.

---

Vytvořeno s pomocí [Claude Code](https://claude.ai/claude-code)
