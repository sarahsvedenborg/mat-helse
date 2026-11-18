import type { Question } from "../types.ts";

// Tema 1: Næringsstoffer og kroppen (23 originalspørsmål)
// Rediger fasit, forklaringer og nøkkelpunkter direkte her.

export const TEMA1: Question[] = [
  {
    id: "n01",
    theme: "naering",
    number: 1,
    original:
      "De stoffene kroppen vår trenger, og som vi får gjennom mat og drikke, kaller vi for næringsstoffer. Hva heter de (7 stk)?",
    answer:
      "- Karbohydrater\n- Fett\n- Proteiner\n- Vitaminer\n- Mineralstoffer (mineraler)\n- Vann\n- Kostfiber",
    explanation:
      "Næringsstoffene er det kroppen bruker til energi, til å bygge seg opp og til å regulere alt som skjer i den. Et lurt huskeord: «Kari Fikk Pølse, Vi Måtte Vente Kort» – Karbohydrater, Fett, Protein, Vitaminer, Mineraler, Vann, Kostfiber.",
    precise:
      "Faglig sett er kostfiber en type karbohydrat, men i skolen regnes det ofte som et eget næringsstoff fordi det har helt andre oppgaver i kroppen enn sukker og stivelse.",
    keyPoints: ["Karbohydrater", "Fett", "Proteiner", "Vitaminer", "Mineralstoffer", "Vann", "Kostfiber"],
    hint: "Tre av dem gir energi. To av dem trenger vi bare i små mengder. Én av dem drikker du.",
    difficulty: 1,
    modes: ["huskekort", "quiz", "forklar", "prove", "sorter"],
    misconceptions: ["Alkohol gir energi, men regnes ikke som et næringsstoff kroppen trenger."],
    variants: [
      {
        kind: "mcq",
        id: "n01-v1",
        prompt: "Hvilket av disse er IKKE et av de syv næringsstoffene?",
        correct: "Koffein",
        wrong: ["Kostfiber", "Mineralstoffer", "Vann"],
        explanation: "Koffein finnes i kaffe, te og energidrikk, men er ikke et næringsstoff kroppen trenger.",
      },
      {
        kind: "recall",
        id: "n01-v2",
        prompt: "Hvilke to næringsstoffer trenger vi bare i svært små mengder (milligram og mikrogram)?",
        answer: "Vitaminer og mineralstoffer.",
      },
    ],
  },
  {
    id: "n02",
    theme: "naering",
    number: 2,
    original: "Hva er det kroppen vår trenger energi til?",
    answer:
      "- Grunnstoffskiftet: det kroppen gjør hele tiden, også når vi sover – hjertet slår, vi puster, organene og hjernen arbeider, og kroppstemperaturen holdes oppe.\n- Fysisk aktivitet: alt vi gjør av bevegelse, fra å gå til skolen til trening.\n- Vekst: barn og ungdom trenger ekstra energi for å vokse og utvikle seg.\n- Fordøyelse: det krever også litt energi å bryte ned maten.",
    explanation:
      "Selv om du ligger helt stille i senga bruker kroppen energi. Den største delen går faktisk til grunnstoffskiftet, ikke til trening.",
    keyPoints: ["Grunnstoffskiftet (hjerte, pust, organer, hjerne)", "Holde kroppstemperaturen", "Fysisk aktivitet", "Vekst"],
    hint: "Tenk på hva kroppen gjør når du sover, når du beveger deg og mens du er i puberteten.",
    difficulty: 1,
    modes: ["huskekort", "forklar", "prove", "quiz"],
    variants: [
      {
        kind: "mcq",
        id: "n02-v1",
        prompt: "Hva kalles energien kroppen bruker i hvile, for eksempel til hjerte, pust og kroppstemperatur?",
        correct: "Grunnstoffskiftet",
        wrong: ["Fordøyelsen", "Energibalansen", "Forbrenningstoppen"],
        explanation: "Grunnstoffskiftet er energien som trengs for å holde kroppen i gang når vi er i ro.",
      },
    ],
  },
  {
    id: "n03",
    theme: "naering",
    number: 3,
    original: "Hvilke hovedoppgaver har de ulike næringsstoffene i kroppen vår?",
    answer:
      "- Karbohydrater: gir energi. Hjernen bruker helst glukose (druesukker).\n- Fett: gir mye energi, er energilager, beskytter og isolerer kroppen, og trengs for å ta opp fettløselige vitaminer (A, D, E, K).\n- Proteiner: byggestoff – bygger og reparerer muskler, hud, hår, organer og celler. Brukes også til enzymer, hormoner og antistoffer. Kan gi energi.\n- Vitaminer: regulerende/vernende – hjelper prosessene i kroppen å fungere.\n- Mineralstoffer: både byggestoff (f.eks. kalsium i skjelett og tenner) og regulerende (f.eks. jern i blodet).\n- Vann: transporterer stoffer, regulerer kroppstemperaturen og er løsemiddel.\n- Kostfiber: holder fordøyelsen i gang og gir metthet.",
    explanation:
      "Skolemodellen deler oppgavene i tre: energigivende (karbohydrat, fett, protein), byggende (protein, mineraler, vann) og regulerende (vitaminer, mineraler, vann).",
    keyPoints: [
      "Energigivende: karbohydrat, fett, protein",
      "Byggende: protein (og mineraler)",
      "Regulerende: vitaminer og mineraler",
      "Vann: transport og temperatur",
      "Kostfiber: fordøyelse",
    ],
    hint: "Bruk de tre gruppene: energigivende, byggende og regulerende. Hvor passer hvert næringsstoff?",
    difficulty: 2,
    modes: ["huskekort", "forklar", "prove", "sorter", "quiz"],
    variants: [
      {
        kind: "mcq",
        id: "n03-v1",
        prompt: "Hvilket næringsstoff er det viktigste byggestoffet for muskler og celler?",
        correct: "Protein",
        wrong: ["Karbohydrat", "Kostfiber", "Vitamin C"],
        explanation: "Proteiner er bygd av aminosyrer, og kroppen bruker dem til å bygge og reparere vev.",
      },
      {
        kind: "mcq",
        id: "n03-v2",
        prompt: "Hvilken hovedoppgave har vitaminene?",
        correct: "De er regulerende og hjelper prosessene i kroppen",
        wrong: ["De er kroppens viktigste energikilde", "De er hovedbyggestoffet i musklene", "De lagres som energireserve under huden"],
        explanation: "Vitaminer gir ikke energi, men kroppen trenger dem for at mange prosesser skal virke.",
      },
    ],
  },
  {
    id: "n04",
    theme: "naering",
    number: 4,
    original: "Hva måles energi i?",
    answer: "Energi måles i kilojoule (kJ) eller kilokalorier (kcal). 1 kcal er omtrent 4,2 kJ.",
    explanation: "På matemballasjen står energien oppgitt både i kJ og kcal. Kilojoule er den offisielle enheten.",
    keyPoints: ["Kilojoule (kJ)", "Kilokalorier (kcal)"],
    hint: "To enheter – du ser dem på næringsdeklarasjonen på alle matvarer.",
    difficulty: 1,
    modes: ["huskekort", "quiz", "prove", "forklar"],
    accept: ["kilojoule", "kj", "kilojoule og kilokalorier", "kj og kcal", "kilokalorier", "kcal", "kilojoule (kj) og kilokalorier (kcal)", "kilojoule eller kilokalorier", "kalorier og joule"],
    variants: [
      {
        kind: "mcq",
        id: "n04-v1",
        prompt: "Omtrent hvor mange kilojoule er 1 kilokalori?",
        correct: "4,2 kJ",
        wrong: ["1 kJ", "10 kJ", "0,42 kJ"],
        explanation: "1 kcal ≈ 4,2 kJ. Derfor er tallet for kJ alltid større enn tallet for kcal på emballasjen.",
      },
    ],
  },
  {
    id: "n05",
    theme: "naering",
    number: 5,
    original: "Hvilke næringsstoffer er energigivende?",
    answer:
      "Karbohydrater, fett og proteiner.\n- Karbohydrat: ca. 17 kJ (4 kcal) per gram\n- Protein: ca. 17 kJ (4 kcal) per gram\n- Fett: ca. 37 kJ (9 kcal) per gram – over dobbelt så mye",
    explanation: "Fett er det mest energitette næringsstoffet. Vitaminer, mineraler og vann gir ingen energi.",
    precise:
      "Alkohol gir også energi (ca. 29 kJ per gram), men er ikke et næringsstoff. Kostfiber gir litt energi fordi tarmbakteriene bryter noe av det ned.",
    keyPoints: ["Karbohydrater", "Fett", "Proteiner", "Fett gir mest energi per gram"],
    hint: "Det er tre av dem. Ett av dem gir over dobbelt så mye energi per gram som de to andre.",
    difficulty: 1,
    modes: ["huskekort", "quiz", "sorter", "prove", "forklar"],
    misconceptions: ["Vitaminer gir ikke energi, selv om man kan føle seg piggere når man ikke mangler dem."],
    variants: [
      {
        kind: "mcq",
        id: "n05-v1",
        prompt: "Hvilket næringsstoff gir mest energi per gram?",
        correct: "Fett",
        wrong: ["Karbohydrat", "Protein", "Kostfiber"],
        explanation: "Fett gir ca. 37 kJ per gram, karbohydrat og protein ca. 17 kJ per gram.",
      },
      {
        kind: "mcq",
        id: "n05-v2",
        prompt: "Hvilken gruppe inneholder bare energigivende næringsstoffer?",
        correct: "Karbohydrat, fett og protein",
        wrong: ["Karbohydrat, vitaminer og vann", "Fett, protein og mineralstoffer", "Protein, kostfiber og vitaminer"],
        explanation: "Bare karbohydrat, fett og protein regnes som energigivende næringsstoffer.",
      },
    ],
  },
  {
    id: "n06",
    theme: "naering",
    number: 6,
    original:
      "Hvilke typer karbohydrater har vi? Gi eksempler på i hvilke matvarer du finner de ulike typer karbohydrater.",
    answer:
      "- Sukkerarter: f.eks. glukose (druesukker) og fruktose (fruktsukker) i frukt, bær og honning; sukrose (vanlig sukker) i godteri, brus og kaker; laktose (melkesukker) i melk.\n- Stivelse: i poteter, brød, pasta, ris, mel, havregryn og andre kornprodukter.\n- Kostfiber: i grovt brød, havregryn, grønnsaker, frukt, bær, belgvekster (bønner, linser, erter), nøtter og frø.",
    explanation:
      "Sukker er små molekyler som tas raskt opp. Stivelse er lange kjeder av glukose som må brytes ned først. Kostfiber kan vi nesten ikke fordøye i det hele tatt.",
    precise:
      "Sukkerarter deles i enkle sukkerarter (monosakkarider: glukose, fruktose) og doble sukkerarter (disakkarider: sukrose, laktose, maltose). Stivelse og kostfiber er polysakkarider.",
    keyPoints: ["Sukkerarter (f.eks. i frukt, honning, godteri, melk)", "Stivelse (f.eks. i poteter, brød, pasta, ris)", "Kostfiber (f.eks. i grovt brød, grønnsaker, belgvekster)"],
    hint: "Tre typer: én smaker søtt, én finner du i poteter og pasta, én finner du i grovt brød.",
    difficulty: 2,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove", "visuell"],
    variants: [
      {
        kind: "mcq",
        id: "n06-v1",
        prompt: "Hvilken type karbohydrat finnes det mest av i poteter og pasta?",
        correct: "Stivelse",
        wrong: ["Laktose", "Fruktose", "Kostfiber"],
        explanation: "Poteter, pasta, ris og brød er rike på stivelse.",
      },
      {
        kind: "mcq",
        id: "n06-v2",
        prompt: "Hva heter sukkerarten i melk?",
        correct: "Laktose (melkesukker)",
        wrong: ["Fruktose (fruktsukker)", "Sukrose (vanlig sukker)", "Maltose (maltsukker)"],
        explanation: "Melkesukker heter laktose. Noen tåler ikke laktose – det kalles laktoseintoleranse.",
      },
    ],
  },
  {
    id: "n07",
    theme: "naering",
    number: 7,
    original: "Hvilke oppgaver har kostfiber i kroppen vår?",
    answer:
      "- Holder fordøyelsen i gang og gir regelmessig avføring – kostfiber binder vann så avføringen blir mykere, og hindrer forstoppelse.\n- Gir god metthetsfølelse, så vi holder oss mette lenger.\n- Gjør at sukkeret i maten tas langsommere opp, så blodsukkeret blir jevnere.\n- Er mat for de gode bakteriene i tarmen.\n- Kan bidra til å senke kolesterolet (f.eks. fiber fra havre).\n- Reduserer risikoen for sykdommer som tarmkreft, type 2-diabetes og hjerte- og karsykdommer.",
    explanation:
      "Kostfiber blir ikke fordøyd i tynntarmen, men går videre til tykktarmen. Der binder det vann og fôrer tarmbakteriene.",
    keyPoints: ["God fordøyelse / hindrer forstoppelse", "Binder vann", "Metthet", "Jevnt blodsukker", "Mindre risiko for sykdom"],
    hint: "Tenk på hva som skjer i tarmen, hvor lenge du holder deg mett og hva som skjer med blodsukkeret.",
    difficulty: 2,
    modes: ["huskekort", "quiz", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "n07-v1",
        prompt: "Hvorfor hjelper kostfiber mot forstoppelse?",
        correct: "Fordi kostfiber binder vann og gjør avføringen mykere og større",
        wrong: [
          "Fordi kostfiber blir tatt opp i blodet og gir tarmen energi",
          "Fordi kostfiber løser opp fett i tarmen",
          "Fordi kostfiber dreper bakteriene i tarmen",
        ],
        explanation: "Kostfiber suger til seg vann som en svamp. Det gjør at maten beveger seg lettere gjennom tarmen.",
      },
    ],
  },
  {
    id: "n08",
    theme: "naering",
    number: 8,
    original: "Hvilke typer fett har vi? Gi eksempler på i hvilke matvarer du kan finne de ulike typer fett?",
    answer:
      "- Mettet fett: smør, fete meieriprodukter (fløte, fet ost), fett kjøtt, pølser, kokosfett og palmefett. Er ofte fast ved romtemperatur. Bør begrenses.\n- Enumettet fett: olivenolje, rapsolje, avokado, mandler og mange nøtter.\n- Flerumettet fett: omega-3 i fet fisk (laks, makrell, sild, ørret), tran, valnøtter, linfrø og rapsolje; omega-6 i solsikkeolje, soyaolje og mange frø og nøtter.\n- Transfett: kan finnes i industrielt herdet fett (f.eks. i noe kjeks, snacks og frityrmat). Er svært ugunstig, og bruken er strengt begrenset i Norge.",
    explanation:
      "Umettet fett (enumettet og flerumettet) er det sunneste fettet. Erstatt gjerne mettet fett med umettet – for eksempel olje i stedet for smør.",
    precise:
      "Omega-3 og omega-6 er essensielle fettsyrer – kroppen kan ikke lage dem selv. Alle matvarer inneholder en blanding av fettsyrer; vi sorterer dem etter hvilken type det er mest av.",
    keyPoints: ["Mettet fett + eksempel (smør, fett kjøtt)", "Enumettet fett + eksempel (olivenolje, avokado)", "Flerumettet fett / omega-3 + eksempel (fet fisk)", "Umettet fett er sunnest"],
    hint: "Tre hovedtyper har ord som slutter på «-mettet». Én type finner du særlig i laks og makrell.",
    difficulty: 3,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove"],
    misconceptions: ["Alt fett er ikke usunt – kroppen trenger fett, særlig umettet fett og omega-3."],
    variants: [
      {
        kind: "mcq",
        id: "n08-v1",
        prompt: "Hvilken matvare er en god kilde til omega-3?",
        correct: "Makrell",
        wrong: ["Smør", "Kokosfett", "Hvit loff"],
        explanation: "Fet fisk som makrell, laks og sild er de viktigste kildene til omega-3.",
      },
      {
        kind: "mcq",
        id: "n08-v2",
        prompt: "Hvilken type fett er det mest av i smør?",
        correct: "Mettet fett",
        wrong: ["Enumettet fett", "Omega-3-fett", "Omega-6-fett"],
        explanation: "Smør har mye mettet fett, og derfor er det fast i kjøleskapet.",
      },
      {
        kind: "recall",
        id: "n08-v3",
        prompt: "Hvilke to typer fett kalles samlet «umettet fett»?",
        answer: "Enumettet fett og flerumettet fett.",
      },
    ],
  },
  {
    id: "n09",
    theme: "naering",
    number: 9,
    original: "Hvilke to typer proteiner har vi? Og hvor finner vi disse?",
    answer:
      "- Animalske proteiner (fra dyr): kjøtt, fisk, egg, melk og meieriprodukter.\n- Vegetabilske proteiner (fra planter): belgvekster (bønner, linser, erter, kikerter), soya/tofu, korn og kornprodukter, nøtter og frø.\n\nI tillegg snakker vi om proteinkvalitet: Animalske proteiner er som regel fullverdige – de har alle de essensielle aminosyrene i passe mengder. Mange vegetabilske proteiner er ufullstendige alene, men blir fullverdige når vi kombinerer ulike plantekilder (f.eks. korn og belgvekster). Soya er et vegetabilsk protein med god kvalitet.",
    explanation:
      "«Animalsk/vegetabilsk» handler om hvor proteinet kommer fra. «Fullverdig/ufullstendig» handler om proteinkvaliteten. Det er to forskjellige inndelinger – ikke bland dem!",
    keyPoints: ["Animalske proteiner – fra dyr", "Eksempler: kjøtt, fisk, egg, melk", "Vegetabilske proteiner – fra planter", "Eksempler: belgvekster, korn, nøtter, soya"],
    hint: "Den ene typen kommer fra dyr, den andre fra planter.",
    difficulty: 2,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove"],
    misconceptions: [
      "«Vegetabilsk» betyr ikke det samme som «ufullstendig». Soya og quinoa er vegetabilske, men har god proteinkvalitet.",
      "Hvis læreren har spurt etter fullverdige og ufullstendige proteiner, er det proteinkvalitet som menes – se tillegget i fasiten.",
    ],
    variants: [
      {
        kind: "mcq",
        id: "n09-v1",
        prompt: "Hvilken matvare er en kilde til vegetabilsk protein?",
        correct: "Linser",
        wrong: ["Egg", "Kyllingfilet", "Cottage cheese"],
        explanation: "Linser er belgvekster og kommer fra planter. Egg, kylling og cottage cheese er animalske.",
      },
      {
        kind: "mcq",
        id: "n09-v2",
        prompt: "Hva menes med et fullverdig protein?",
        correct: "Et protein som inneholder alle de essensielle aminosyrene i passe mengder",
        wrong: ["Et protein som bare finnes i kjøtt", "Et protein som gir mer energi enn fett", "Et protein som kroppen kan lage selv"],
        explanation: "Fullverdig handler om kvalitet – at alle essensielle aminosyrer er med.",
      },
    ],
  },
  {
    id: "n10",
    theme: "naering",
    number: 10,
    original: "Hva menes med essensielle aminosyrer?",
    answer:
      "Proteiner er bygd opp av byggesteiner som heter aminosyrer. Essensielle aminosyrer er aminosyrer som kroppen ikke kan lage selv, og som vi derfor må få gjennom maten. Av de ca. 20 aminosyrene er 9 essensielle for voksne.",
    explanation: "«Essensiell» betyr «nødvendig». Vi må få dem fra maten fordi kroppen mangler oppskriften for å lage dem.",
    precise: "Eldre lærebøker sier ofte 8 essensielle aminosyrer. I dag regnes 9 som essensielle (histidin er tatt med).",
    keyPoints: ["Aminosyrer er byggesteinene i proteiner", "Kroppen kan ikke lage dem selv", "Må få dem gjennom maten"],
    hint: "Hva er proteiner bygd av? Og hva betyr ordet «essensiell»?",
    difficulty: 2,
    modes: ["huskekort", "quiz", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "n10-v1",
        prompt: "Hva er en essensiell aminosyre?",
        correct: "En aminosyre kroppen ikke kan lage selv, og som vi må få fra maten",
        wrong: ["En aminosyre som bare finnes i grønnsaker", "En aminosyre kroppen lager i leveren", "En aminosyre som gir ekstra mye energi"],
        explanation: "Essensiell = nødvendig å få gjennom maten.",
      },
    ],
  },
  {
    id: "n11",
    theme: "naering",
    number: 11,
    original: "Hva må en som er vegetarianer passe på i forhold eget kosthold?",
    answer:
      "- Protein: nok protein og god proteinkvalitet – kombinere belgvekster, soya, korn, nøtter og frø (og melk/egg hvis man spiser det).\n- Jern: jern fra planter tas dårligere opp. Spis belgvekster, grove kornprodukter, mørkegrønne grønnsaker, og få C-vitamin til måltidet.\n- Vitamin B12: finnes nesten bare i animalsk mat. Veganere må ta tilskudd eller bruke berikede produkter.\n- Kalsium og vitamin D: viktig hvis man dropper melk – velg berikede plantedrikker.\n- Jod: melk, meieriprodukter og fisk er viktige jodkilder i Norge.\n- Omega-3: fet fisk er hovedkilden – alternativer er valnøtter, linfrø, rapsolje og tilskudd.\n- Generelt: spise variert og nok.",
    explanation:
      "Jo flere animalske matvarer man kutter ut, desto mer må man planlegge. En lakto-ovo-vegetarianer (spiser melk og egg) får lettere det kroppen trenger enn en veganer.",
    keyPoints: ["Protein og proteinkvalitet (kombinere)", "Jern (+ C-vitamin)", "Vitamin B12", "Kalsium / vitamin D", "Jod / omega-3"],
    hint: "Tenk på hvilke næringsstoffer vi særlig får fra kjøtt, fisk, melk og egg.",
    difficulty: 3,
    modes: ["huskekort", "quiz", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "n11-v1",
        prompt: "Hvilket vitamin finnes nesten bare i animalsk mat, så veganere må ta tilskudd?",
        correct: "Vitamin B12",
        wrong: ["Vitamin C", "Vitamin K", "Folat"],
        explanation: "Vitamin B12 finnes i kjøtt, fisk, melk og egg. Veganere trenger tilskudd eller berikede produkter.",
      },
    ],
  },
  {
    id: "n12",
    theme: "naering",
    number: 12,
    original: "Hvilke vitaminer er fettløselige, og hvilke vitaminer er vannløselige?",
    answer:
      "- Fettløselige: A, D, E og K.\n- Vannløselige: B-vitaminene (f.eks. B1, B2, B6, B12, folat) og vitamin C.",
    explanation:
      "Fettløselige vitaminer løses i fett og kan lagres i kroppen (lever og fettvev). Vannløselige vitaminer lagres i liten grad – overskudd skilles ut med urinen, så vi trenger dem jevnlig.",
    keyPoints: ["Fettløselige: A, D, E, K", "Vannløselige: B-vitaminene og C", "Fettløselige kan lagres i kroppen"],
    hint: "Huskeregel for de fettløselige: «ADEK». Resten er vannløselige.",
    difficulty: 1,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove"],
    variants: [
      {
        kind: "recall",
        id: "n12-v1",
        prompt: "Hvilke fire vitaminer er fettløselige?",
        answer: "A, D, E og K (huskeord: ADEK).",
      },
      {
        kind: "mcq",
        id: "n12-v2",
        prompt: "Er vitamin C fettløselig eller vannløselig?",
        correct: "Vannløselig",
        wrong: ["Fettløselig", "Både fett- og vannløselig", "Verken fett- eller vannløselig"],
        explanation: "Vitamin C er vannløselig, sammen med alle B-vitaminene.",
      },
      {
        kind: "mcq",
        id: "n12-v3",
        prompt: "Hva er forskjellen på fettløselige og vannløselige vitaminer?",
        correct: "Fettløselige kan lagres i kroppen, vannløselige lagres lite og må tilføres jevnlig",
        wrong: [
          "Fettløselige finnes bare i fet mat, vannløselige bare i drikke",
          "Vannløselige kan lagres i kroppen, fettløselige skilles ut med urinen",
          "Fettløselige gir energi, vannløselige gir ikke energi",
        ],
        explanation: "Fettløselige lagres i lever og fettvev. Overskudd av vannløselige skilles ut med urinen.",
      },
    ],
  },
  {
    id: "n13",
    theme: "naering",
    number: 13,
    original: "Hva er gode kilder til vitamin D?",
    answer:
      "- Sollys på huden – kroppen lager vitamin D selv om sommeren. I Norge er sola for svak i vinterhalvåret.\n- Fet fisk: laks, ørret, makrell, sild.\n- Tran og trankapsler.\n- Egg.\n- Matvarer tilsatt vitamin D, f.eks. lettmelk, ekstra lett melk og margarin.",
    explanation:
      "Fordi vi får lite sol om vinteren i Norge, er det viktig å få vitamin D fra maten – særlig fra fet fisk, tran eller berikede melkeprodukter.",
    keyPoints: ["Sollys", "Fet fisk", "Tran", "Berikede produkter (melk, margarin)"],
    hint: "Én kilde er ikke mat i det hele tatt. De andre er fisk, noe du tar med skje og noe du drikker.",
    difficulty: 1,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "n13-v1",
        prompt: "Hvilken matvare er den beste kilden til vitamin D?",
        correct: "Laks",
        wrong: ["Appelsin", "Havregryn", "Spinat"],
        explanation: "Fet fisk som laks er blant de beste kildene til vitamin D.",
      },
    ],
  },
  {
    id: "n14",
    theme: "naering",
    number: 14,
    original: "Hvilke oppgaver har kalsium i kroppen vår?",
    answer:
      "- Bygger opp og vedlikeholder skjelettet og tennene (det meste av kalsiumet i kroppen er her).\n- Trengs for at musklene skal trekke seg sammen – også hjertet.\n- Trengs for at nervesignaler skal fungere.\n- Er med når blodet levrer seg (koagulerer) ved sår.",
    explanation:
      "I ungdomsårene bygger du opp mesteparten av skjelettet ditt. Derfor er det ekstra viktig å få nok kalsium nå. Melk, ost og yoghurt er de viktigste kildene.",
    keyPoints: ["Skjelett og tenner", "Muskler", "Nervesignaler", "Blodets levring"],
    hint: "Den viktigste oppgaven er knyttet til noe hardt i kroppen. Kalsium trengs også i musklene.",
    difficulty: 2,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "n14-v1",
        prompt: "Hva er kalsiums viktigste oppgave i kroppen?",
        correct: "Å bygge opp skjelett og tenner",
        wrong: ["Å frakte oksygen i blodet", "Å gi energi til hjernen", "Å holde fordøyelsen i gang"],
        explanation: "Det meste av kalsiumet i kroppen finnes i skjelettet og tennene.",
      },
      {
        kind: "recall",
        id: "n14-v2",
        prompt: "Nevn tre gode kilder til kalsium.",
        answer: "Melk, ost og yoghurt (også brunost, sardiner med bein og berikede plantedrikker).",
      },
    ],
  },
  {
    id: "n15",
    theme: "naering",
    number: 15,
    original: "Nevn noen gode kilder for mineralstoffet jern.",
    answer:
      "- Rødt kjøtt (storfe, lam)\n- Innmat som lever, leverpostei og blodpudding\n- Grove kornprodukter (grovt brød, havregryn)\n- Belgvekster (bønner, linser, kikerter)\n- Mørkegrønne grønnsaker (f.eks. brokkoli, spinat, grønnkål)\n- Eggeplomme, nøtter, frø og tørket frukt",
    explanation:
      "Jern fra kjøtt (hemjern) tas lettere opp enn jern fra planter. Spis gjerne noe med C-vitamin til, for eksempel paprika eller appelsin, så tas jernet bedre opp.",
    keyPoints: ["Rødt kjøtt", "Leverpostei / innmat", "Grove kornprodukter", "Belgvekster", "Mørkegrønne grønnsaker"],
    hint: "Tenk på det vanligste pålegget med lever i, og på hva som er i grovt brød.",
    difficulty: 1,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove", "visuell"],
    variants: [
      {
        kind: "mcq",
        id: "n15-v1",
        prompt: "Hvilket pålegg er en god kilde til jern?",
        correct: "Leverpostei",
        wrong: ["Syltetøy", "Hvitost", "Honning"],
        explanation: "Leverpostei er laget av lever, som er svært rik på jern.",
      },
    ],
  },
  {
    id: "n16",
    theme: "naering",
    number: 16,
    original: "Hva skjer hvis kroppen vår får for lite jern?",
    answer:
      "Jern trengs for å lage hemoglobin i de røde blodcellene. Hemoglobin frakter oksygen rundt i kroppen. Får vi for lite jern, kan vi få jernmangel og etter hvert jernmangelanemi (blodmangel). Da får kroppen for lite oksygen, og man kan bli:\n- trøtt og slapp\n- blek\n- svimmel og få hodepine\n- dårligere til å konsentrere seg\n- fortere andpusten\n- oftere syk (svekket immunforsvar)",
    explanation:
      "Jenter i puberteten er ekstra utsatt for jernmangel fordi de mister jern med menstruasjonen. Derfor er jernrik mat særlig viktig for dem.",
    keyPoints: ["Jern trengs til hemoglobin", "Hemoglobin frakter oksygen", "Jernmangelanemi / blodmangel", "Trøtthet, slapphet, blekhet"],
    hint: "Hva gjør jern i blodet? Hva skjer når kroppen får for lite av det som jern frakter?",
    difficulty: 2,
    modes: ["huskekort", "quiz", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "n16-v1",
        prompt: "Hva kalles tilstanden når man har så lite jern at blodet ikke frakter nok oksygen?",
        correct: "Jernmangelanemi (blodmangel)",
        wrong: ["Laktoseintoleranse", "Cøliaki", "Beinskjørhet"],
        explanation: "Anemi betyr blodmangel. Den vanligste årsaken er jernmangel.",
      },
    ],
  },
  {
    id: "n17",
    theme: "naering",
    number: 17,
    original: "Hvor mye vann bør man drikke i løpet av dag?",
    answer:
      "Det finnes ikke ett fast tall for alle – behovet varierer. En vanlig tommelfingerregel er at ungdom og voksne trenger omtrent 1–1,5 liter drikke om dagen (5–8 glass), i tillegg til vannet vi får fra maten. Behovet øker når det er varmt, når vi er fysisk aktive og svetter, og når vi har feber eller er syke. Kroppsstørrelse og alder spiller også inn. Tørste og mørk urin er tegn på at kroppen trenger mer væske. Vann er den beste tørstedrikken.",
    explanation:
      "Helsedirektoratets råd er rett og slett «Drikk vann!» – uten en fast mengde. Hør på kroppen: lys urin og lite tørste betyr som regel at du drikker nok.",
    precise:
      "Det totale væskebehovet for voksne er ofte oppgitt til ca. 2–3 liter per døgn, men en god del av dette kommer fra maten (grønnsaker, frukt, grøt, suppe) og fra forbrenningen i kroppen.",
    keyPoints: ["Behovet varierer", "Omtrent 1–1,5 liter drikke om dagen", "Mer ved varme, aktivitet og sykdom", "Vann fra maten teller også", "Vann er beste tørstedrikk"],
    hint: "Gi et omtrentlig tall – men forklar hvorfor ikke alle trenger like mye.",
    difficulty: 2,
    modes: ["huskekort", "forklar", "prove", "quiz"],
    misconceptions: ["Det finnes ingen magisk grense på «nøyaktig 2 liter vann» for alle."],
    variants: [
      {
        kind: "mcq",
        id: "n17-v1",
        prompt: "Hvilken situasjon gjør at du trenger mer vann enn vanlig?",
        correct: "Når du trener og svetter mye på en varm dag",
        wrong: ["Når du sitter stille og leser", "Når du spiser mye suppe og frukt", "Når det er kaldt og du er inne"],
        explanation: "Varme og fysisk aktivitet gir svette, og da mister kroppen mye vann.",
      },
    ],
  },
  {
    id: "n18",
    theme: "naering",
    number: 18,
    original: "Hvilke oppgaver har vann i kroppen vår?",
    answer:
      "- Transport: blodet (som er mest vann) frakter næringsstoffer og oksygen rundt i kroppen.\n- Fjerner avfallsstoffer gjennom urinen.\n- Regulerer kroppstemperaturen – vi svetter når vi blir varme, og svetten kjøler oss ned.\n- Løsemiddel: mange stoffer løses i vann, og kjemiske prosesser i kroppen skjer i vann.\n- Byggestoff: kroppen består av omtrent 60 % vann.\n- Smører leddene og beskytter organer (f.eks. hjernen), og er en del av spytt og fordøyelsessafter.",
    explanation: "Vi kan leve flere uker uten mat, men bare noen få dager uten vann.",
    keyPoints: ["Transport av næringsstoffer og oksygen", "Fjerner avfallsstoffer (urin)", "Regulerer kroppstemperaturen (svette)", "Løsemiddel", "Kroppen består av ca. 60 % vann"],
    hint: "Tenk på blod, svette og urin.",
    difficulty: 2,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "n18-v1",
        prompt: "Omtrent hvor stor del av kroppen består av vann?",
        correct: "Omtrent 60 %",
        wrong: ["Omtrent 10 %", "Omtrent 30 %", "Omtrent 95 %"],
        explanation: "En voksen kropp består av ca. 60 % vann. Hos nyfødte er andelen enda høyere.",
      },
      {
        kind: "mcq",
        id: "n18-v2",
        prompt: "Hvordan hjelper vann kroppen med å regulere temperaturen?",
        correct: "Vi svetter, og når svetten fordamper, kjøles kroppen ned",
        wrong: ["Vann lagres i musklene og varmer dem opp", "Kaldt vann i magen senker temperaturen permanent", "Vann gir energi som holder oss varme"],
        explanation: "Svette er vann. Når det fordamper fra huden, tar det med seg varme.",
      },
    ],
  },
  {
    id: "n19",
    theme: "naering",
    number: 19,
    original:
      "Helsedirektoratet er ansvarlig for å gi oss gode råd for å bevare en god helse. Skriv ned de 7 kostrådene som Helsedirektoratet har kommet med.",
    answer:
      "Helsedirektoratets kostråd (august 2024):\n- 1. Ha et variert kosthold, velg mest mat fra planteriket og spis med glede.\n- 2. Frukt, bær eller grønnsaker bør være en del av alle måltider.\n- 3. La grovt brød eller andre fullkornsprodukter være en del av flere måltider hver dag.\n- 4. Velg oftere fisk og sjømat, bønner og linser enn rødt kjøtt. Spis minst mulig bearbeidet kjøtt.\n- 5. Ha et daglig inntak av melk og meieriprodukter. Velg produkter med mindre fett.\n- 6. Godteri, snacks og søte bakevarer bør begrenses.\n- 7. Drikk vann!",
    explanation:
      "Kostrådene ble fornyet i 2024. De legger mer vekt på mat fra planteriket, både for helsen og for miljøet. Lærer du kortversjonen, kan du forklare resten: variert – frukt og grønt – fullkorn – fisk og belgvekster – melk – lite søtt – vann.",
    precise:
      "Mengder fra 2024-rådene: frukt, bær og grønnsaker 500–800 g om dagen; fullkorn minst 90 g om dagen; fisk 300–450 g i uka (minst 200 g fet fisk); rødt kjøtt inntil 350 g i uka; melk og meieriprodukter ca. 3 porsjoner (tilsvarer 5 dl) om dagen. Eldre undervisningsmateriell kan bruke tidligere kostråd (f.eks. «5 om dagen» og «fisk 2–3 ganger i uka»). Du kan bytte til lærerens versjon under Innstillinger.",
    keyPoints: [
      "Variert kosthold, mest fra planteriket",
      "Frukt, bær eller grønnsaker til alle måltider",
      "Grovt brød / fullkorn",
      "Fisk, bønner og linser oftere enn rødt kjøtt",
      "Melk og meieriprodukter daglig",
      "Begrens godteri, snacks og søte bakevarer",
      "Drikk vann",
    ],
    hint: "Huskeord: «Variert – Frukt – Fullkorn – Fisk – Melk – Mindre søtt – Vann».",
    difficulty: 3,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "n19-v1",
        prompt: "Hva sier kostrådene fra 2024 om drikke?",
        correct: "Drikk vann!",
        wrong: ["Drikk minst 1 liter melk om dagen", "Drikk juice til hvert måltid", "Drikk sportsdrikk når du er tørst"],
        explanation: "Det siste av de syv kostrådene er rett og slett «Drikk vann!».",
      },
      {
        kind: "mcq",
        id: "n19-v2",
        prompt: "Hva bør du ifølge kostrådene velge oftere enn rødt kjøtt?",
        correct: "Fisk og sjømat, bønner og linser",
        wrong: ["Kylling og pølser", "Ost og egg", "Bacon og skinke"],
        explanation: "Kostråd 4: Velg oftere fisk og sjømat, bønner og linser enn rødt kjøtt. Spis minst mulig bearbeidet kjøtt.",
      },
      {
        kind: "recall",
        id: "n19-v3",
        prompt: "Hva er det første av de syv kostrådene?",
        answer: "Ha et variert kosthold, velg mest mat fra planteriket og spis med glede.",
      },
    ],
  },
  {
    id: "n20",
    theme: "naering",
    number: 20,
    original: "Hva betyr uttrykket 5 (8) om dagen?",
    answer:
      "Det betyr at vi bør spise minst 5 porsjoner frukt, bær og grønnsaker hver dag – gjerne opp mot 8. En porsjon er omtrent 100 gram, for eksempel ett eple, en gulrot eller en neve bær. 5–8 porsjoner tilsvarer 500–800 gram om dagen, og omtrent halvparten bør være grønnsaker.",
    explanation:
      "«5 om dagen» er det gamle slagordet. Kostrådene fra 2024 anbefaler 500–800 gram, altså 5–8 porsjoner. Inntil 1 dl juice kan telle som én porsjon. Poteter regnes ikke med.",
    keyPoints: ["5–8 porsjoner frukt, bær og grønnsaker", "1 porsjon ≈ 100 g", "500–800 g om dagen", "Halvparten grønnsaker"],
    hint: "Hva er det vi skal spise 5 eller 8 av? Hvor mye er én porsjon?",
    difficulty: 1,
    modes: ["huskekort", "quiz", "forklar", "prove"],
    misconceptions: ["Poteter teller ikke som en av porsjonene.", "Juice kan bare telle som én porsjon, uansett hvor mye man drikker."],
    variants: [
      {
        kind: "mcq",
        id: "n20-v1",
        prompt: "Omtrent hvor mye er én porsjon i «5 om dagen»?",
        correct: "Ca. 100 gram, f.eks. ett eple",
        wrong: ["Ca. 10 gram, f.eks. en drue", "Ca. 500 gram, f.eks. en hel melon", "Ca. 1 liter juice"],
        explanation: "En porsjon er ca. 100 g – en mellomstor frukt, en gulrot eller en neve bær.",
      },
      {
        kind: "numeric",
        id: "n20-v2",
        prompt: "Hvis én porsjon frukt og grønt er 100 g, hvor mange gram er 8 porsjoner?",
        answer: 800,
        unit: "g",
        working: "8 porsjoner × 100 g = 800 g",
      },
    ],
  },
  {
    id: "n21",
    theme: "naering",
    number: 21,
    original: "Skriv ned noen viktige argument for hvorfor man bør begrense inntaket av sukker.",
    answer:
      "- Sukker gir energi, men nesten ingen vitaminer, mineraler eller kostfiber («tomme kalorier»).\n- Mat med mye sukker kan fortrenge sunnere mat.\n- Sukker gir hull i tennene (karies) fordi bakteriene i munnen lager syre av sukkeret.\n- Mye sukker gir raske svingninger i blodsukkeret – man kan bli fort sulten, slapp og ukonsentrert.\n- Søt drikke metter dårlig, så det er lett å få i seg mye energi.\n- Et høyt inntak over tid øker risikoen for overvekt og type 2-diabetes.",
    explanation: "Anbefalingen er at tilsatt sukker bør utgjøre mindre enn 10 % av energien vi får i oss.",
    keyPoints: ["Tomme kalorier / få næringsstoffer", "Hull i tennene (karies)", "Svingninger i blodsukkeret", "Overvekt og type 2-diabetes", "Fortrenger sunnere mat"],
    hint: "Tenk på tennene, blodsukkeret og hva sukkeret mangler av næringsstoffer.",
    difficulty: 2,
    modes: ["huskekort", "quiz", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "n21-v1",
        prompt: "Hvorfor kalles sukker ofte «tomme kalorier»?",
        correct: "Fordi det gir energi, men nesten ingen vitaminer, mineraler eller kostfiber",
        wrong: ["Fordi det ikke gir noen energi", "Fordi kroppen ikke klarer å ta det opp", "Fordi det bare finnes i drikke"],
        explanation: "Sukker gir energi, men lite annet kroppen trenger.",
      },
    ],
  },
  {
    id: "n22",
    theme: "naering",
    number: 22,
    original: "Hvilket vitamin fremmer opptaket av mineralstoffet jern?",
    answer: "Vitamin C. Det gjør at kroppen tar opp mer jern, særlig jern fra planter (f.eks. grovt brød og belgvekster).",
    explanation: "Tips: Spis paprika, appelsin, kiwi eller et glass appelsinjuice til et måltid med jernrik mat.",
    keyPoints: ["Vitamin C"],
    hint: "Vitaminet finnes i appelsin, kiwi og paprika.",
    difficulty: 1,
    modes: ["huskekort", "quiz", "prove", "forklar"],
    accept: ["vitamin c", "c-vitamin", "c vitamin", "c", "askorbinsyre", "c-vitaminer"],
    variants: [
      {
        kind: "mcq",
        id: "n22-v1",
        prompt: "Du spiser en grovbrødskive med leverpostei. Hva kan du drikke for at kroppen skal ta opp mest mulig jern?",
        correct: "Et glass appelsinjuice",
        wrong: ["Et glass melk", "En kopp te", "En kopp kaffe"],
        explanation: "Appelsinjuice har mye C-vitamin, som øker jernopptaket. Te og kaffe kan faktisk hemme opptaket.",
      },
    ],
  },
  {
    id: "n23",
    theme: "naering",
    number: 23,
    original: "Hvilket vitamin er helt nødvendig for opptak og utnyttelse av mineralstoffet kalsium?",
    answer: "Vitamin D. Det trengs for at kroppen skal ta opp kalsium fra tarmen og bruke det til å bygge skjelett og tenner.",
    explanation: "Får du mye kalsium, men for lite vitamin D, kan ikke kroppen utnytte kalsiumet godt.",
    keyPoints: ["Vitamin D"],
    hint: "Kroppen lager dette vitaminet selv når sola skinner på huden.",
    difficulty: 1,
    modes: ["huskekort", "quiz", "prove", "forklar"],
    accept: ["vitamin d", "d-vitamin", "d vitamin", "d"],
    variants: [
      {
        kind: "mcq",
        id: "n23-v1",
        prompt: "Hvilket par hører sammen?",
        correct: "Vitamin D hjelper kroppen å ta opp kalsium",
        wrong: ["Vitamin C hjelper kroppen å ta opp kalsium", "Vitamin D hjelper kroppen å ta opp jern", "Vitamin K hjelper kroppen å ta opp jern"],
        explanation: "D → kalsium. C → jern.",
      },
    ],
  },
];
