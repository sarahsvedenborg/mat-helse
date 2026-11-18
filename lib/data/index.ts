import type { Question, Variant } from "../types.ts";
import { TEMA1 } from "./tema1-naering.ts";
import { TEMA2, TEMA3, TEMA4 } from "./tema2-4.ts";
import { TEMA5, TEMA6, TEMA7 } from "./tema5-7.ts";

export { THEMES, themeById } from "./themes.ts";
export { MATCH_SETS } from "./matchSets.ts";

export const QUESTIONS: Question[] = [...TEMA1, ...TEMA2, ...TEMA3, ...TEMA4, ...TEMA5, ...TEMA6, ...TEMA7];

export const questionById = (id: string) => QUESTIONS.find((q) => q.id === id);
export const questionsByTheme = (theme: string) => QUESTIONS.filter((q) => q.theme === theme);

/** Alle varianter med peker til originalspørsmålet. */
export const ALL_VARIANTS: { q: Question; v: Variant }[] = QUESTIONS.flatMap((q) => (q.variants ?? []).map((v) => ({ q, v })));

/**
 * LÆRERENS VERSJON AV KOSTRÅDENE
 * Hvis læreren bruker eldre undervisningsmateriell, kan du lime inn lærerens versjon her.
 * Velg deretter «Lærerens versjon» under Innstillinger i appen.
 */
export const TEACHER_KOSTRAD = {
  label: "Lærerens versjon",
  answer:
    "Lim inn lærerens versjon av kostrådene i filen lib/data/index.ts (TEACHER_KOSTRAD).\n\nEldre materiell bruker ofte råd som:\n- Spis minst 5 porsjoner grønnsaker, frukt og bær hver dag («5 om dagen»).\n- Spis grove kornprodukter hver dag.\n- Spis fisk til middag 2–3 ganger i uka.\n- Velg magre meieriprodukter.\n- Begrens bruken av salt og sukker.\n- Velg vann som tørstedrikk.\n- Vær fysisk aktiv hver dag.",
  keyPoints: [] as string[],
};
