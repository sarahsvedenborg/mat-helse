import type { Question, Mode } from "../types.ts";

// Tema 5: Måleenheter (18), Tema 6: Bærekraftig mat (9), Tema 7: Smakssansene (2)

const abbrModes: Mode[] = ["huskekort", "quiz", "sorter", "prove", "forklar"];
const convModes: Mode[] = ["huskekort", "visuell", "prove", "forklar"];

function abbr(
  num: number,
  short: string,
  full: string,
  extra: string,
  accept: string[],
  wrong: [string, string, string],
): Question {
  return {
    id: `e0${num}`,
    theme: "maal",
    number: num,
    original: `Hva står forkortelsen «${short}» for?`,
    answer: `${short} = ${full}. ${extra}`,
    explanation: extra,
    keyPoints: [full],
    hint: `Forkortelsen «${short}» – tenk på oppskrifter du har brukt.`,
    difficulty: 1,
    modes: abbrModes,
    accept,
    variants: [
      {
        kind: "mcq",
        id: `e0${num}-v1`,
        prompt: `Hva betyr «${short}» i en oppskrift?`,
        correct: full.charAt(0).toUpperCase() + full.slice(1),
        wrong,
        explanation: `${short} = ${full}. ${extra}`,
      },
    ],
  };
}

function conv(num: number, task: string, answer: number, unit: string, working: string, difficulty: 1 | 2 | 3 = 1): Question {
  const shown = String(answer).replace(".", ",");
  return {
    id: `e${String(num).padStart(2, "0")}`,
    theme: "maal",
    number: num,
    original: `Gjør om: ${task} = ___ ${unit}`,
    answer: `${task} = ${shown} ${unit}. Utregning: ${working}`,
    explanation: working,
    keyPoints: [`${shown} ${unit}`],
    hint: "Husk: 1 l = 10 dl = 100 cl = 1000 ml, og 1 kg = 10 hg = 1000 g.",
    difficulty,
    modes: convModes,
    numeric: { answer, unit, working },
  };
}

export const TEMA5: Question[] = [
  abbr(1, "ss", "spiseskje", "1 ss = 15 ml.", ["spiseskje", "spiseskjei", "en spiseskje", "spise skje"], ["Stor skål", "Smørskje", "Saltskje"]),
  abbr(2, "ts", "teskje", "1 ts = 5 ml.", ["teskje", "en teskje", "te skje"], ["Tesil", "Toppskje", "Tørrskje"]),
  abbr(3, "krm", "kryddermål", "1 krm = 1 ml. Brukes til små mengder krydder og salt.", ["kryddermål", "kryddermal", "krydder mål", "et kryddermål"], ["Kremmål", "Kornmål", "Kraftmål"]),
  abbr(4, "dl", "desiliter", "1 dl = 100 ml = 0,1 liter.", ["desiliter", "decilitre", "desilitre", "decliter", "desi liter"], ["Delliter", "Dekaliter", "Doble liter"]),
  abbr(5, "cl", "centiliter", "1 cl = 10 ml. 10 cl = 1 dl.", ["centiliter", "sentiliter", "centilitre", "senti liter"], ["Kiloliter", "Deciliter", "Cupliter"]),
  abbr(6, "ml", "milliliter", "1 ml = en tusendels liter. 1000 ml = 1 liter.", ["milliliter", "mililiter", "millilitre", "milli liter"], ["Millioner liter", "Meterliter", "Mikroliter"]),
  abbr(7, "kg", "kilogram", "1 kg = 1000 g = 10 hg.", ["kilogram", "kilo", "kilo gram"], ["Kornglass", "Kubikkgram", "Kilometer"]),
  abbr(8, "hg", "hektogram", "1 hg = 100 g. 10 hg = 1 kg.", ["hektogram", "hekto", "hektogramm", "hecto", "hectogram"], ["Halvgram", "Høygram", "Hovedgram"]),
  abbr(9, "gr/g", "gram", "1000 g = 1 kg. Den riktige forkortelsen er «g», men «gr» brukes ofte i oppskrifter.", ["gram", "gr", "g"], ["Grader", "Gryte", "Grunnmål"]),
  conv(10, "¾ l", 7.5, "dl", "1 l = 10 dl. ¾ av 10 dl = 10 : 4 × 3 = 7,5 dl.", 2),
  conv(11, "½ l", 5, "dl", "1 l = 10 dl. Halvparten av 10 dl = 5 dl."),
  conv(12, "¼ kg", 250, "gram", "1 kg = 1000 g. ¼ av 1000 g = 1000 : 4 = 250 g."),
  conv(13, "600 ml", 0.6, "liter", "1000 ml = 1 l. 600 ml = 600 : 1000 = 0,6 l.", 2),
  conv(14, "0,5 dl", 50, "ml", "1 dl = 100 ml. 0,5 × 100 ml = 50 ml.", 2),
  conv(15, "¾ kg", 750, "gram", "1 kg = 1000 g. ¾ av 1000 g = 1000 : 4 × 3 = 750 g."),
  conv(16, "330 g", 0.33, "kg", "1000 g = 1 kg. 330 g = 330 : 1000 = 0,33 kg.", 3),
  conv(17, "1 dl", 10, "cl", "1 dl = 10 cl (og 1 cl = 10 ml)."),
  conv(18, "1 kg", 10, "hg", "1 kg = 1000 g, og 1 hg = 100 g. 1000 : 100 = 10 hg."),
];

// Ekstra øvingsoppgaver til regnemodusen (knyttet til originalspørsmålene over)
TEMA5.find((q) => q.id === "e10")!.variants = [
  { kind: "numeric", id: "e10-v1", prompt: "¼ l = ___ dl", answer: 2.5, unit: "dl", working: "10 dl : 4 = 2,5 dl" },
  { kind: "numeric", id: "e10-v2", prompt: "1 ½ l = ___ dl", answer: 15, unit: "dl", working: "1 l = 10 dl, ½ l = 5 dl. 10 + 5 = 15 dl" },
];
TEMA5.find((q) => q.id === "e13")!.variants = [
  { kind: "numeric", id: "e13-v1", prompt: "250 ml = ___ liter", answer: 0.25, unit: "liter", working: "250 : 1000 = 0,25 l" },
  { kind: "numeric", id: "e13-v2", prompt: "2,5 dl = ___ ml", answer: 250, unit: "ml", working: "2,5 × 100 ml = 250 ml" },
];
TEMA5.find((q) => q.id === "e01")!.variants!.push({
  kind: "numeric",
  id: "e01-v2",
  prompt: "2 ss = ___ ml",
  answer: 30,
  unit: "ml",
  working: "1 ss = 15 ml. 2 × 15 ml = 30 ml",
});
TEMA5.find((q) => q.id === "e02")!.variants!.push({
  kind: "numeric",
  id: "e02-v2",
  prompt: "3 ts = ___ ml (og det er det samme som 1 ss!)",
  answer: 15,
  unit: "ml",
  working: "1 ts = 5 ml. 3 × 5 ml = 15 ml = 1 ss",
});
TEMA5.find((q) => q.id === "e16")!.variants = [
  { kind: "numeric", id: "e16-v1", prompt: "1,5 kg = ___ g", answer: 1500, unit: "g", working: "1,5 × 1000 g = 1500 g" },
  { kind: "numeric", id: "e16-v2", prompt: "400 g = ___ hg", answer: 4, unit: "hg", working: "400 : 100 = 4 hg" },
];

export const TEMA6: Question[] = [
  {
    id: "b01",
    theme: "baerekraft",
    number: 1,
    original: "Hva kjennetegner økologisk mat?",
    answer:
      "- Produsert uten kunstgjødsel og uten kjemisk-syntetiske sprøytemidler (plantevernmidler). Man bruker i stedet husdyrgjødsel, kompost og vekselbruk (bytter på hva som dyrkes).\n- Ikke genmodifisert (GMO).\n- Strengere krav til dyrevelferd: dyrene skal ha mer plass, komme ut og på beite, og få økologisk fôr. Medisiner brukes mer restriktivt.\n- Færre tilsetningsstoffer er tillatt i bearbeidet mat.\n- Merket med Ø-merket (Debio) og/eller EU-økologisk-merket (et blad av stjerner). Debio kontrollerer økologisk produksjon i Norge.",
    explanation: "Økologisk landbruk prøver å jobbe med naturen – ta vare på jorda, det biologiske mangfoldet og dyrene.",
    keyPoints: ["Uten kunstgjødsel", "Uten kjemiske sprøytemidler", "Ikke GMO", "God dyrevelferd", "Ø-merket / Debio"],
    hint: "Tenk på gjødsel, sprøytemidler, dyrene og merket du ser i butikken.",
    difficulty: 2,
    modes: ["huskekort", "quiz", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "b01-v1",
        prompt: "Hva er IKKE tillatt i økologisk landbruk?",
        correct: "Kunstgjødsel og kjemisk-syntetiske sprøytemidler",
        wrong: ["Husdyrgjødsel", "Kompost", "At dyrene går ute på beite"],
        explanation: "Økologisk landbruk bruker husdyrgjødsel og kompost i stedet for kunstgjødsel.",
      },
      {
        kind: "mcq",
        id: "b01-v2",
        prompt: "Hvilken organisasjon kontrollerer økologisk mat i Norge og står bak Ø-merket?",
        correct: "Debio",
        wrong: ["Fairtrade", "Nøkkelhullet", "Mattilsynet alene"],
        explanation: "Debio kontrollerer og godkjenner økologisk produksjon i Norge.",
      },
    ],
  },
  {
    id: "b02",
    theme: "baerekraft",
    number: 2,
    original: "Hva er det største dilemmaet når det gjelder økologisk matproduksjon?",
    answer:
      "Økologisk produksjon gir ofte lavere avling per areal enn vanlig (konvensjonell) produksjon. Det betyr at man trenger mer jord for å produsere like mye mat. Samtidig har økologisk landbruk miljøfordeler, som mindre bruk av sprøytemidler, bedre jordhelse og mer biologisk mangfold.\n\nDilemmaet er altså: Det er bedre for miljøet og dyrene på mange måter, men det gir mindre mat per areal, blir dyrere, og det kan være vanskelig å produsere nok mat til hele verdens befolkning bare med økologiske metoder. Klimaavtrykket per kilo mat er heller ikke nødvendigvis lavere.",
    explanation: "Et dilemma betyr at det finnes gode argumenter på begge sider. Vis at du ser både fordelene og ulempene.",
    keyPoints: ["Lavere avling / mindre mat per areal", "Krever mer areal", "Dyrere", "Men: miljøfordeler (mindre sprøytemidler, mangfold)", "Brødfø verdens befolkning"],
    hint: "Hva er bra med økologisk? Hva er problemet når vi skal produsere mat til mange mennesker?",
    difficulty: 3,
    modes: ["huskekort", "quiz", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "b02-v1",
        prompt: "Hvilket utsagn beskriver dilemmaet med økologisk matproduksjon best?",
        correct: "Det har miljøfordeler, men gir ofte lavere avling, så det trengs mer areal for samme mengde mat",
        wrong: [
          "Økologisk mat er alltid giftig fordi den ikke sprøytes",
          "Økologisk mat gir alltid større avlinger, men smaker dårligere",
          "Økologisk mat har ingen fordeler for miljøet",
        ],
        explanation: "Lavere avling per areal er hovedutfordringen.",
      },
    ],
  },
  {
    id: "b03",
    theme: "baerekraft",
    number: 3,
    original: "Gjør greie for fordeler og ulemper ved å kjøpe etiske produkter.",
    answer:
      "Etiske produkter er varer produsert med tanke på rettferdige forhold for mennesker, dyr og miljø – for eksempel Fairtrade-merkede varer (kaffe, kakao, bananer, te).\n\nFordeler:\n- Bøndene og arbeiderne får en rettferdig og mer stabil betaling (minstepris og en ekstra premie til lokalsamfunnet).\n- Bedre arbeidsforhold og forbud mot barnearbeid og tvangsarbeid.\n- Krav til miljøhensyn i produksjonen.\n- Som forbruker kan du bruke pengene dine til å støtte bedre forhold.\n\nUlemper:\n- Varene er ofte dyrere.\n- Det finnes mange merker, og det kan være vanskelig å vite hva de betyr.\n- Det er ikke sikkert at alle ledd i produksjonen kontrolleres like godt, og det har vært kritikk av hvor mye av pengene som faktisk når fram til bøndene.\n- Mange etiske varer er importert langt unna, og utvalget kan være mindre.",
    explanation: "«Gjør greie for» betyr at du skal forklare grundig og ta med begge sider.",
    keyPoints: ["Hva etiske produkter er (f.eks. Fairtrade)", "Fordel: rettferdig betaling", "Fordel: bedre arbeidsforhold / ikke barnearbeid", "Ulempe: dyrere", "Ulempe: mange merker / usikker kontroll"],
    hint: "Hvem tjener på at du kjøper Fairtrade-sjokolade? Hva kan være negativt for deg som kjøper?",
    difficulty: 3,
    modes: ["huskekort", "quiz", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "b03-v1",
        prompt: "Hva er hovedmålet med Fairtrade-merket?",
        correct: "At bønder og arbeidere i fattige land får rettferdig betaling og bedre arbeidsforhold",
        wrong: ["At maten er produsert i Norge", "At maten er glutenfri", "At maten har lite sukker"],
        explanation: "Fairtrade handler om rettferdig handel.",
      },
    ],
  },
  {
    id: "b04",
    theme: "baerekraft",
    number: 4,
    original: "Hvordan kan du ta miljøhensyn når du handler mat og lager mat i hverdagen?",
    answer:
      "Når du handler:\n- Planlegg måltidene og lag handleliste, så du bare kjøper det du trenger (mindre matsvinn).\n- Spis mer fra planteriket og mindre rødt kjøtt.\n- Velg sesongens råvarer.\n- Velg varer med lite emballasje, og ta med egen handlepose.\n- Se etter miljømerker (f.eks. Ø-merket, MSC for bærekraftig fisk).\n- Gå, sykle eller kjør kollektivt til butikken.\n\nNår du lager mat:\n- Bruk rester og utnytt hele råvaren.\n- Oppbevar maten riktig så den holder seg lenger.\n- Husk at «best før» ikke betyr «dårlig etter» – se, lukt og smak.\n- Spar energi: lokk på kjelen, tilpass kjele til plate, bruk restvarme.\n- Kildesorter matavfall og emballasje.\n- Drikk vann fra springen.",
    explanation: "Matsvinn er et stort miljøproblem. Det beste du kan gjøre er å spise opp maten du kjøper, og spise mer plantebasert.",
    keyPoints: ["Planlegge / handleliste – mindre matsvinn", "Mer plantebasert, mindre rødt kjøtt", "Sesongvarer", "Lite emballasje / kildesortering", "Bruke rester", "Spare energi ved matlaging"],
    hint: "Del svaret i to: i butikken og på kjøkkenet. Tenk på matsvinn, kjøtt, emballasje og strøm.",
    difficulty: 2,
    modes: ["huskekort", "quiz", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "b04-v1",
        prompt: "Hva betyr «Best før» på en matvare?",
        correct: "At maten ofte er god også etter datoen – se, lukt og smak",
        wrong: ["At maten må kastes dagen etter", "At maten er giftig etter datoen", "At maten bare kan spises før kl. 12"],
        explanation: "«Siste forbruksdag» skal følges. «Best før» er en kvalitetsdato.",
      },
    ],
  },
  {
    id: "b05",
    theme: "baerekraft",
    number: 5,
    original: "Hvordan må vegetarianere sikre at de får nok protein og protein av god kvalitet?",
    answer:
      "- Nok protein: spise proteinrike plantematvarer hver dag – belgvekster (bønner, linser, kikerter, erter), soyaprodukter (tofu, tempeh), nøtter, frø og fullkorn. Lakto-ovo-vegetarianere får også protein fra melk, ost, yoghurt og egg.\n- God kvalitet: kombinere ulike proteinkilder fra planteriket, for eksempel korn og belgvekster (brød med hummus, ris og bønner, linsesuppe med grovbrød). Da utfyller de hverandre, og man får i seg alle de essensielle aminosyrene. Det trenger ikke være i samme måltid – det holder å variere i løpet av dagen.",
    explanation: "Hver planteproteinkilde mangler gjerne litt av én essensiell aminosyre. Når man kombinerer, fyller de «hullene» hos hverandre.",
    keyPoints: ["Spise proteinrik plantemat hver dag", "Belgvekster, soya, nøtter, fullkorn", "Kombinere korn og belgvekster", "Får alle essensielle aminosyrer", "Variert gjennom dagen"],
    hint: "To deler: hvor de får nok protein, og hvordan de kan kombinere for å få god kvalitet.",
    difficulty: 3,
    modes: ["huskekort", "quiz", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "b05-v1",
        prompt: "Hvilken kombinasjon gir god proteinkvalitet for en veganer?",
        correct: "Grovt brød og hummus (kikerter)",
        wrong: ["Agurk og tomat", "Eple og banan", "Ris og sukker"],
        explanation: "Korn + belgvekster utfyller hverandre med essensielle aminosyrer.",
      },
    ],
  },
  {
    id: "b06",
    theme: "baerekraft",
    number: 6,
    original: "Hvorfor bør vi kjøpe kortreist mat?",
    answer:
      "Kortreist mat er mat som er produsert nær der den blir spist.\n- Støtter lokale bønder og produsenter, og gir arbeidsplasser i nærmiljøet.\n- Bidrar til norsk matproduksjon og matberedskap (at vi kan produsere mat selv).\n- Maten kan være ferskere fordi det er kort tid fra høsting til butikk.\n- Det er lettere å vite hvor maten kommer fra og hvordan den er produsert.\n- Mindre transport kan gi noe lavere utslipp.\n\nNyanse: Transporten utgjør ofte en liten del av matens totale klimaavtrykk. Hvordan maten er produsert (f.eks. kjøtt eller planter, oppvarmet drivhus eller friland) betyr som regel mer enn hvor langt den er fraktet. Unntaket er mat som fraktes med fly.",
    explanation: "Kortreist er bra av mange grunner, men det er ikke automatisk det mest klimavennlige. Et godt svar viser begge deler.",
    keyPoints: ["Hva kortreist betyr", "Støtter lokale bønder", "Ferskere mat", "Vet hvor maten kommer fra", "Mindre transport", "Nyanse: produksjonsmåten betyr ofte mer enn transporten"],
    hint: "Tenk på bonden, ferskhet og transport – og spør deg selv: er transporten det viktigste for klimaet?",
    difficulty: 3,
    modes: ["huskekort", "quiz", "forklar", "prove"],
    misconceptions: ["Kortreist er ikke alltid mest klimavennlig – en tomat fra et oppvarmet drivhus i nærheten kan ha høyere utslipp enn en tomat fraktet med båt fra Spania."],
    variants: [
      {
        kind: "mcq",
        id: "b06-v1",
        prompt: "Hvilket utsagn om kortreist mat er mest riktig?",
        correct: "Kortreist mat støtter lokale bønder, men transport er ofte en liten del av matens klimaavtrykk",
        wrong: [
          "Kortreist mat har alltid lavest klimaavtrykk",
          "Kortreist mat er alltid økologisk",
          "Kortreist mat betyr at maten er rask å lage",
        ],
        explanation: "Hvordan maten produseres betyr ofte mer for klimaet enn hvor langt den er fraktet.",
      },
    ],
  },
  {
    id: "b07",
    theme: "baerekraft",
    number: 7,
    original: "Hva betyr klimaavtrykk?",
    answer:
      "Klimaavtrykk er et mål på hvor mye klimagasser (oppgitt som CO₂-ekvivalenter) som slippes ut i løpet av hele livsløpet til en vare – fra produksjon på gården, foredling, emballasje og transport, til lagring, matlaging og avfall. For mat oppgis det ofte i kg CO₂-ekvivalenter per kg mat.",
    explanation: "Jo høyere klimaavtrykk, jo mer bidrar varen til global oppvarming. Metan fra kyr og sauer gjør at storfe- og lammekjøtt har høyt klimaavtrykk.",
    keyPoints: ["Utslipp av klimagasser", "CO₂-ekvivalenter", "Hele livsløpet (produksjon, transport, emballasje, avfall)"],
    hint: "Tenk på et fotavtrykk: sporet maten setter på klimaet fra gården til søpla.",
    difficulty: 2,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "b07-v1",
        prompt: "Hva måler klimaavtrykket til en matvare?",
        correct: "Hvor mye klimagasser som slippes ut gjennom hele livsløpet til varen",
        wrong: ["Hvor mye energi (kJ) matvaren gir", "Hvor langt matvaren er fraktet", "Hvor mye plast det er i emballasjen"],
        explanation: "Klimaavtrykk tar med alt – fra produksjon til avfall – ikke bare transport.",
      },
    ],
  },
  {
    id: "b08",
    theme: "baerekraft",
    number: 8,
    original: "Kan du nevne 2 matvarer med lavt klimaavtrykk?",
    answer:
      "Eksempler: belgvekster (bønner, linser, erter), poteter, havregryn og andre kornprodukter, rotgrønnsaker som gulrot, kål og epler. Generelt har mat fra planteriket lavt klimaavtrykk.",
    explanation: "Planter kan vi spise direkte. Når dyr spiser plantene først, går mye av energien tapt, og drøvtyggere slipper i tillegg ut metan.",
    keyPoints: ["To plantebaserte matvarer, f.eks. poteter, bønner, linser, havre, gulrot, kål"],
    hint: "Tenk på mat fra planteriket som vokser godt i Norge.",
    difficulty: 1,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "b08-v1",
        prompt: "Hvilken matvare har lavest klimaavtrykk?",
        correct: "Linser",
        wrong: ["Storfekjøtt", "Lammekjøtt", "Ost"],
        explanation: "Belgvekster som linser har svært lavt klimaavtrykk og mye protein.",
      },
    ],
  },
  {
    id: "b09",
    theme: "baerekraft",
    number: 9,
    original: "Kan du nevne 2 matvarer med høyt klimaavtrykk?",
    answer:
      "Eksempler: storfekjøtt (biff, kjøttdeig), lammekjøtt, ost og smør. Også mat som er fraktet med fly (f.eks. noen typer frukt og grønnsaker utenom sesong) har høyt klimaavtrykk.",
    explanation: "Kyr og sauer er drøvtyggere som lager klimagassen metan i magen. I tillegg krever de mye fôr og areal.",
    keyPoints: ["To matvarer, f.eks. storfekjøtt, lam, ost, smør, flyfraktet mat", "Begrunnelse: metan fra drøvtyggere"],
    hint: "Tenk på dyr som tygger drøv.",
    difficulty: 1,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "b09-v1",
        prompt: "Hvorfor har storfekjøtt så høyt klimaavtrykk?",
        correct: "Kyr er drøvtyggere som slipper ut metan, og de trenger mye fôr og areal",
        wrong: ["Fordi kjøttet alltid fraktes med fly", "Fordi kjøttet inneholder mye CO₂", "Fordi kyr spiser plast"],
        explanation: "Metan er en kraftig klimagass. Den dannes i magen til drøvtyggere.",
      },
    ],
  },
];

export const TEMA7: Question[] = [
  {
    id: "s01",
    theme: "smak",
    number: 1,
    original: "Hvilke fem grunnsmaker har vi?",
    answer: "Søtt, surt, salt, bittert og umami.",
    explanation: "Umami er japansk og betyr omtrent «velsmakende». Det er den fyldige, kjøttaktige smaken i f.eks. buljong og parmesan.",
    keyPoints: ["Søtt", "Surt", "Salt", "Bittert", "Umami"],
    hint: "Fire av dem kjenner du godt. Den femte har et japansk navn.",
    difficulty: 1,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove"],
    misconceptions: ["Det finnes ikke egne «soner» på tunga for hver smak – alle deler av tunga kan kjenne alle grunnsmakene."],
    variants: [
      {
        kind: "mcq",
        id: "s01-v1",
        prompt: "Hvilken av disse er en grunnsmak?",
        correct: "Umami",
        wrong: ["Sterkt", "Krydret", "Fett"],
        explanation: "Sterkt (chili) er en smerte-/varmefølelse, ikke en grunnsmak.",
      },
      {
        kind: "mcq",
        id: "s01-v2",
        prompt: "Stemmer det at tunga har egne områder for hver smak?",
        correct: "Nei, alle deler av tunga kan kjenne alle grunnsmakene",
        wrong: ["Ja, søtt kjennes bare på tuppen", "Ja, bittert kjennes bare foran", "Ja, salt kjennes bare midt på"],
        explanation: "«Tungekartet» er en gammel misforståelse.",
      },
    ],
  },
  {
    id: "s02",
    theme: "smak",
    number: 2,
    original: "Gi eksempler på mat som har de fem ulike grunnsmakene.",
    answer:
      "- Søtt: sukker, honning, moden frukt, sjokolade, syltetøy\n- Surt: sitron, lime, eddik, naturell yoghurt, rabarbra, surkål\n- Salt: bordsalt, chips, saltkjeks, spekeskinke, salt sild, soyasaus\n- Bittert: kaffe, mørk sjokolade, grapefrukt, ruccola, rosenkål, te\n- Umami: parmesan, soyasaus, buljong, moden tomat, sopp, fiskesaus",
    explanation: "Mange matvarer har flere grunnsmaker samtidig – soyasaus er både salt og umami, og ketchup er søt, sur og umami.",
    keyPoints: ["Søtt + eksempel", "Surt + eksempel", "Salt + eksempel", "Bittert + eksempel", "Umami + eksempel"],
    hint: "Gå gjennom grunnsmakene én etter én og tenk på hva du har i kjøleskapet.",
    difficulty: 1,
    modes: ["huskekort", "quiz", "sorter", "forklar", "prove"],
    variants: [
      {
        kind: "mcq",
        id: "s02-v1",
        prompt: "Hvilken matvare er et godt eksempel på umami?",
        correct: "Parmesan",
        wrong: ["Sitron", "Honning", "Grapefrukt"],
        explanation: "Lagret ost som parmesan har mye umami.",
      },
      {
        kind: "mcq",
        id: "s02-v2",
        prompt: "Hvilken grunnsmak har kaffe og mørk sjokolade?",
        correct: "Bittert",
        wrong: ["Surt", "Salt", "Umami"],
        explanation: "Kaffe og mørk sjokolade er klassiske eksempler på bitter smak.",
      },
    ],
  },
];
