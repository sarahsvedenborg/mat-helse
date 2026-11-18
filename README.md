# Mat og helse – øvingsapp

Interaktiv app for å øve til teoriprøven i mat og helse (ungdomsskolen).

## Kom i gang

```bash
npm install
npm run dev
```

Åpne http://localhost:3000.

## Redigere fasit

Alt faglig innhold ligger i `lib/data/`:

- `tema1-naering.ts` – Næringsstoffer og kroppen (23 spørsmål)
- `tema2-4.ts` – Korn, Mat og måltider, Kjøkken og hygiene
- `tema5-7.ts` – Måleenheter, Bærekraftig mat, Smakssansene
- `matchSets.ts` – koble/sorter-oppgaver
- `index.ts` – `TEACHER_KOSTRAD`: lim inn lærerens versjon av kostrådene og velg den under Innstillinger

Endre aldri `id`-feltene – fremgangen lagres på dem.

## Kontroll

```bash
npm run validate   # sjekker at alle 67 originalspørsmål finnes, har fasit, og at regneoppgavene stemmer
npm run typecheck
```

Fremgang lagres i nettleserens localStorage (ingen innlogging, ingen server).
