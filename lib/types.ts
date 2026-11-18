// Datamodell for pensum. Alt faglig innhold ligger i lib/data/*.ts og kan redigeres direkte der.

export type ThemeId =
  | "naering"
  | "korn"
  | "maaltider"
  | "hygiene"
  | "maal"
  | "baerekraft"
  | "smak";

/** Øvingsmoduser et spørsmål passer til. */
export type Mode = "huskekort" | "quiz" | "sorter" | "visuell" | "forklar" | "prove";

/** 1 = lett, 2 = middels, 3 = krevende */
export type Difficulty = 1 | 2 | 3;

export interface Theme {
  id: ThemeId;
  number: number;
  title: string;
  short: string;
  icon: string;
  color: string;
}

/** Flervalgsvariant: ett riktig svar og tre plausible feil. */
export interface McqVariant {
  kind: "mcq";
  id: string;
  prompt: string;
  correct: string;
  wrong: [string, string, string];
  explanation: string;
}

/** Regneoppgave der eleven skriver inn et tall. */
export interface NumericVariant {
  kind: "numeric";
  id: string;
  prompt: string;
  answer: number;
  unit: string;
  working: string;
}

/** Kort huskekort-variant (spørsmål + kort svar), for å øve fra en ny vinkel. */
export interface RecallVariant {
  kind: "recall";
  id: string;
  prompt: string;
  answer: string;
}

export type Variant = McqVariant | NumericVariant | RecallVariant;

export interface Question {
  /** Unik ID, f.eks. "n12". Endre aldri ID-er – fremgangen lagres på ID. */
  id: string;
  theme: ThemeId;
  /** Nummeret spørsmålet har i lærerens liste innenfor temaet. */
  number: number;
  /** Lærerens originale spørsmålstekst. */
  original: string;
  /**
   * Fasitsvar. Linjer som starter med "- " vises som punktliste.
   * Skriv i et språk som passer ungdomsskolen.
   */
  answer: string;
  /** Kort, lettfattelig forklaring («hvorfor er det slik?»). */
  explanation: string;
  /** Mer presis faglig forklaring – utover det skolesvaret krever. */
  precise?: string;
  /** Nøkkelbegreper/punkter som bør være med i et godt svar (brukes i sjekklisten). */
  keyPoints: string[];
  /** Hint som gis i «Forklar med egne ord». */
  hint: string;
  difficulty: Difficulty;
  modes: Mode[];
  misconceptions?: string[];
  /** Kort fakta-svar som kan rettes automatisk (små bokstaver, uten punktum). */
  accept?: string[];
  /** Omregningsoppgave som rettes automatisk. */
  numeric?: { answer: number; unit: string; working: string };
  /** Mindre øvingsoppgaver knyttet til dette originalspørsmålet. */
  variants?: Variant[];
}

/** Koble sammen / sortere / rekkefølge. Knyttes til originalspørsmål via questionIds. */
export type MatchSet =
  | {
      kind: "match";
      id: string;
      title: string;
      instructions: string;
      theme: ThemeId;
      questionIds: string[];
      pairs: { left: string; right: string }[];
      explanation: string;
    }
  | {
      kind: "sort";
      id: string;
      title: string;
      instructions: string;
      theme: ThemeId;
      questionIds: string[];
      categories: string[];
      items: { text: string; category: string }[];
      explanation: string;
    }
  | {
      kind: "order";
      id: string;
      title: string;
      instructions: string;
      theme: ThemeId;
      questionIds: string[];
      steps: string[];
      explanation: string;
    };
