# CLUBvanONS — Design System

## Merk
- **Naam**: CLUBvanONS
- **Stad**: Breda
- **Karakter**: Urban, community-gericht, bondig, krachtig, direct, inclusief

---

## Kleuren

| Naam        | Hex       | Gebruik                                      |
|-------------|-----------|----------------------------------------------|
| Oranje      | `#F15B2B` | Hoofdkleur, CTA, accenten, actieve elementen |
| Zwart       | `#1A1A1A` | Tekst, kaders, donkere vlakken               |
| Cream       | `#FEFDED` | Lichte achtergrond, subtiele secties         |
| Mint / Blauw | `#ACDCCE` | Frisse accenten, secundaire highlights. Intern ook wel "blauw" genoemd. |

> ✏️ Pas de hex-waarden hierboven aan als het merk evolueert.

---

## Typografie

| Rol        | Font          | Stijl                              |
|------------|---------------|------------------------------------|
| Headlines  | Archivo Black | Vet, uppercase, tracking-tight     |
| Body       | Archivo       | Regulier of semibold, leesbaar     |

---

## Blokstijlen (Custom Builder)

| Stijl         | Achtergrond | Tekstkleur | Gebruik                        |
|---------------|-------------|------------|-------------------------------|
| `"black"`     | `#1A1A1A`   | Wit        | Impact, kop secties           |
| `"orange"`    | `#F15B2B`   | Wit        | CTA, highlights               |
| `"mint"`      | `#ACDCCE`   | Zwart      | Frisse accenten               |
| `"cream"`     | `#FEFDED`   | Zwart      | Lichte inhoud                 |
| `"transparent"` | Geen      | Zwart      | Tekst op pagina achtergrond   |

---

## Contentblok types

| Type          | Beschrijving                                         |
|---------------|------------------------------------------------------|
| `text`        | Puur tekstblok (headline + body)                     |
| `poster`      | Grote achtergrondafbeelding + tekst eroverheen       |
| `image`       | Alleen afbeelding                                    |
| `split`       | Afbeelding links/rechts + tekst naast                |
| `quote`       | Grote gecursiveerde quote                            |
| `divider`     | Decoratieve scheiding                                |
| `events`      | Agenda-blok (trekt events uit magazine data)         |
| `pakdemic`    | Pak de Mic blok (trekt pakDeMicText)                 |
| `crew`        | Crew-overzicht met foto/initialen + naam + rol       |
| `buurtpost`   | Buurtpost sectie                                     |
| `terugblik`   | Terugblik/flashback sectie                           |
| `joinus`      | Join us / meedoen CTA                                |

---

## Toon & Stem

- **Taal**: Nederlands
- **Toon**: Direct, urban, warm, community-gericht
- **Headlines**: Altijd kort en krachtig (max 6 woorden)
- **Body**: Bondig, concreet, geen wollig taalgebruik
- **Voorbeelden**:
  - ✅ "De Wijk Spreekt — En Wij Luisteren"
  - ✅ "We Waren Erbij"
  - ❌ "Wij zijn verheugd te melden dat..."

---

## Lay-out Principes

- Magazine formaat: A4 staand (820px breed in editor)
- Grid: 12 kolommen per rij
- Rij hoogte: 80–600px vrij instelbaar
- Max 4 blokken per rij
- Altijd oranje als primaire accentkleur in elke pagina
