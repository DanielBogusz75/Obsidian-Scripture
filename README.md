# Obsidian Scripture

Een Obsidian-plugin om Bijbelteksten in te voegen, ernaar te verwijzen en ze te laten uitspreken. Alles werkt lokaal met de DAISY-bestanden (tekst + mp3) van de Nieuwe-Wereldvertaling in drie talen: **Nederlands, Engels en Pools** (de plugin zelf is Nederlandstalig). Er is geen Python of externe dienst nodig.

## DAISY-bestanden

De plugin bevat geen Bijbeltekst of audio. Zet de DAISY-bestanden van jw.org per taal in een eigen map, bijvoorbeeld:

| Taal | Map | Bestanden |
| --- | --- | --- |
| Nederlands | `Bijbel/` | `nwt_43_Joh_O.daisy.zip` |
| Engels | `Bible/` | `nwt_43_Joh_E.daisy.zip` |
| Pools | `Biblia/` | `nwt_43_Joh_P.daisy.zip` |

De laatste letter in de bestandsnaam (`O`, `E`, `P`) bepaalt de taal. Per boek mag ook een uitgepakte map (`nwt_01_Ge_O.daisy/`) staan; die heeft voorrang. De mappen `Bijbel/`, `Biblia/` en `Bible/` staan in `.gitignore` omdat de publicaties auteursrechtelijk beschermd zijn.

### Opbouw van een DAISY-boek

Elk hoofdstuk heeft drie bestanden met hetzelfde nummer (`0001` = hoofdstuk 1, ook bij Psalmen):

- `NNNN.xml` — de tekst. Elke `<span id="pN">` bevat een vers dat begint met `hoofdstuk:vers` (soms staan er twee verzen in één span). Psalmen herhalen het hoofdstuknummer aan het begin van vers 1 en hebben Hebreeuwse acrostichon-letters tussen de regels; de plugin haalt beide uit de tekst.
- `NNNN.smil` — koppelt elke span-id aan een fragment (`clipBegin`/`clipEnd`) in het mp3-bestand.
- `NNNN.mp3` — de audio van het hele hoofdstuk.

Daarnaast staan `navigation.ncx`, `package.opf`, `text.res` en een stylesheet in elk boek; die zijn voor de plugin niet nodig.

Omdat de audio per span geknipt is, speelt een vers dat in een gedeelde span staat (bijvoorbeeld Daniël 1:14-15) samen met het buurvers af.

## Installatie

### Optie A — de kant-en-klare release

Kopieer de inhoud van `release/obsidian-scripture/` naar:

```text
<kluis>/.obsidian/plugins/obsidian-scripture/
  main.js
  manifest.json
  styles.css
```

### Optie B — zelf bouwen

```bash
npm install
npm run build
```

Kopieer daarna `main.js`, `manifest.json` en `styles.css` naar de pluginmap. Schakel **Obsidian Scripture** in onder **Instellingen > Community-plugins** en herlaad Obsidian na elke update.

## Instellingen

Onder **Instellingen > Obsidian Scripture**:

- **Paden automatisch herkennen** — de knop *Herkennen* zoekt (tot 4 mappen diep) in de kluis, in de *Zoekmap* en in de map naast een al ingesteld absoluut pad naar DAISY-bestanden. Per taal wordt de map met de meeste boeken als Bijbelmap ingesteld.
- **Zoekmap (optioneel)** — extra map om in te zoeken, relatief aan de kluis of absoluut. Staan je mappen buiten de kluis, vul dan hier bijvoorbeeld `/home/daniel/Programming/Obsidian-Scripture` in en klik op *Herkennen*.
- Per taal (Nederlands, Engels, Pools): een eigen **Bijbelmap (DAISY)** en een eigen **Notitiemap**. Een absoluut pad buiten de kluis werkt ook (alleen desktop). Standaard: `Bijbel`/`Bible`/`Biblia` en `Bijbelnotities/Nederlands`, `Bijbelnotities/Engels`, `Bijbelnotities/Pools`.

## Gebruik

Voer het commando **Bijbeltekst opzoeken** uit (of gebruik de knop in de instellingen). Kies bovenin de **weergavetaal** (de taal van de tekst, boeknamen, notities, links en audio) en eventueel een aparte **zoektaal** (de taal van de boeknaam die je typt). Beide keuzes worden onthouden. Standaard staat de zoektaal op *Zelfde als weergavetaal*. Typ daarna een of meer verwijzingen, één per regel of gescheiden door `;`, met boeknamen en afkortingen in de zoektaal:

```text
Joh 3:16          (Nederlands)
1 Cor 13:1-8      (Engels; ook "John 3:16", "Song of Solomon 2:1")
Rdz 1:1-3,8       (Pools; ook "J 3:16", "Pieśń nad Pieśniami 2:1")
Ps 23
```

Met zoektaal *Engels* en weergavetaal *Nederlands* levert `John 3:16` bijvoorbeeld de Nederlandse tekst van Johannes 3:16 op, met `Johannes` in de kop, de notitie en de links. Zonder vers wordt het hele hoofdstuk gebruikt. Met **Voorbeeld** (of Ctrl+Enter) zie je de tekst vooraf. Boeknamen mogen voluit of afgekort zijn; het unieke begin van een naam werkt ook, en bij meerdere mogelijkheden krijg je een melding.

| Knop | Resultaat |
| --- | --- |
| **Invoegen** | Schrijft de tekst uit bij de cursor: `### Johannes 3` gevolgd door `(16) tekst`. Overgeslagen verzen worden met `…` aangegeven. |
| **Verwijzen** | Plaatst `[[Bijbelnotities/Nederlands/Johannes 3.16\|Johannes 3:16]]` bij de cursor. Met het vinkje **Tekst uitschrijven** krijg je de tekst, een streep en daarna de verwijzing. |
| **Audio invoer** | Plaatst een knop 🔊 in het document waarmee je het gedeelte altijd kunt laten uitspreken (nogmaals klikken stopt het). Met het vinkje **Tekst uitschrijven** komt eerst de uitgeschreven tekst en daarna de knop. |
| **Notitie** | Maakt de notities aan zonder iets in het document te plaatsen. |

Bij **elke** knop worden ontbrekende notities (één per vers) aangemaakt in de notitiemap van de gekozen taal; bestaande notities blijven ongewijzigd. Links verwijzen naar het volledige pad, omdat dezelfde boeknaam in meerdere talen voorkomt (bijv. Job). Invoegen, Verwijzen en Audio invoer zijn alleen beschikbaar als er een document met een editor open staat.

### De audioknop

De knop is een codeblok dat door de plugin als knop wordt weergegeven (in Live Preview en leesweergave):

````text
```bijbelaudio
Johannes 3:16
```
````

De taal volgt uit de naam van het blok: `bijbelaudio` (Nederlands), `bijbelaudio-en` (Engels) en `bijbelaudio-pl` (Pools). Je kunt meerdere regels in één blok zetten; elke regel wordt een eigen knop. De audio wordt uit het mp3-bestand van het hoofdstuk geknipt aan de hand van de tijden in het `.smil`-bestand.

### Notities

Notities staan als `<notitiemap van de taal>/<Boek> <Hoofdstuk>.<Vers>.md`, bijvoorbeeld `Bijbelnotities/Nederlands/Johannes 3.16.md`:

```yaml
---
Type: Bijbel
Bijbelboek: Johannes
Hoofdstuk: 3
Vers: 16
Aliases: Johannes 3:16
Taal: Nederlands (of Engels / Pools)
---
```

gevolgd door de teksten van het vers.

## Projectstructuur

```text
main.ts                 Plugin, commando, venster, audiospeler, instellingen
src/bible/boeken.ts     Talen, boeknamen, afkortingen en verwijzingen verwerken
src/bible/daisy.ts      DAISY (zip of map) lezen en herkennen: tekst, verzen en audiofragmenten
Bijbel/ Bible/ Biblia/   Lokale, genegeerde mappen met de DAISY-bestanden (nl/en/pl)
release/                Kant-en-klare pluginbestanden
```

## Problemen oplossen

- **"De Bijbelmap ... is niet gevonden"** — controleer de instelling *Bijbelmap*; het pad is relatief aan de kluis.
- **"Geen DAISY-bestand gevonden voor boek N"** — het bestand `nwt_NN_..._O/E/P.daisy(.zip)` ontbreekt in de Bijbelmap van die taal. Controleer ook of de juiste taal in het venster staat.
- **Grote zip-bestanden** — het eerste afspelen of opzoeken in een boek leest de zip in het geheugen en kan even duren. Een uitgepakte map is sneller.
- **Oude gedrag zichtbaar** — kopieer de nieuwe `main.js`, `manifest.json` en `styles.css` en herlaad Obsidian.
