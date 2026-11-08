# time2go

Vyhľadávač spojení vlakom, autobusom a MHD pre **Slovensko, Česko, Maďarsko, Poľsko a Rakúsko**.

- Vyhľadanie spojenia s prestupmi, aj cez hranice (vlak + autobus + MHD + pešie presuny)
- Odchody zo zastávky / stanice, vrátane meškaní tam, kde sú dostupné v reálnom čase
- Mapa trasy (MapLibre + OpenFreeMap)
- Jazyky: SK, CZ, HU, PL, DE, EN
- Zdieľateľné odkazy (vyhľadávanie sa uloží do URL)

## Ako to funguje

```
prehliadač ──▶ Next.js na Verceli (/api/*) ──▶ MOTIS API (Transitous)
```

Cestovné poriadky a vyhľadávanie trás zabezpečuje [Transitous](https://transitous.org).
Je to bezplatná komunitná služba postavená na [MOTIS](https://github.com/motis-project/motis),
ktorá zbiera otvorené dáta dopravcov z celej Európy. Web volá Transitous cez vlastné
serverové API routy (`app/api/*`). Tie pridávajú identifikáciu aplikácie a cachujú odpovede.

Neskôr môžeš spustiť **vlastný MOTIS server** s vlastnými dátami. Stačí nastaviť
premennú `MOTIS_API_URL`, na webe nemusíš nič meniť.

## Lokálne spustenie

Potrebuješ Node.js 20 alebo novší.

```bash
npm install
npm run dev
```

Potom otvor http://localhost:3000

## Nasadenie na Vercel

1. Prihlás sa na https://vercel.com cez GitHub.
2. **Add New → Project**, vyber repozitár `time-2-go` a klikni **Import**.
3. Nič nemeň (Vercel rozpozná Next.js sám) a klikni **Deploy**.

Každý `git push` do vetvy `main` sa potom automaticky nasadí. Ostatné vetvy dostanú vlastnú testovaciu URL.

### Voliteľné premenné prostredia

| Premenná | Popis | Predvolená hodnota |
|---|---|---|
| `MOTIS_API_URL` | Adresa MOTIS servera | `https://api.transitous.org` |
| `MOTIS_USER_AGENT` | Identifikácia aplikácie pre API | `time-2-go/0.1 (+github odkaz)` |

## Štruktúra

```
app/
  page.tsx              hlavná stránka
  api/geocode           vyhľadávanie zastávok a adries
  api/plan              vyhľadávanie spojení
  api/stoptimes         odchody zo zastávky
components/
  App.tsx               formulár, výsledky, stav v URL
  PlaceInput.tsx        našepkávač zastávok
  ItineraryCard.tsx     karta spojenia s detailom
  Departures.tsx        tabuľa odchodov
  RouteMap.tsx          mapa
lib/
  motis.ts              typy a pomocné funkcie pre MOTIS API
  i18n.ts               preklady
  upstream.ts           proxy na MOTIS API
```

## Dáta a podmienky

- Pri väčšej návštevnosti kontaktuj prevádzkovateľov Transitous (pozri ich
  [podmienky používania API](https://transitous.org/api/)), prípadne prejdi na vlastný MOTIS server.
- Údaje sú informatívne. Pokrytie a kvalita sa líšia podľa dopravcu a krajiny.
