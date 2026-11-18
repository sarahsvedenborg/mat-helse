import { QUESTIONS, MATCH_SETS, THEMES } from "./data/index.ts";

/** Forventet antall originalspørsmål per tema (fra lærerens liste). */
export const EXPECTED: Record<string, number> = {
  naering: 23,
  korn: 9,
  maaltider: 4,
  hygiene: 2,
  maal: 18,
  baerekraft: 9,
  smak: 2,
};

const parseNum = (s: string) => Number(s.replace(",", "."));

/** Kontrollerer pensumdataene. Returnerer en liste med feil (tom = alt OK). */
export function validateData(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const t of THEMES) {
    const qs = QUESTIONS.filter((q) => q.theme === t.id);
    if (qs.length !== EXPECTED[t.id]) errors.push(`Tema ${t.title}: ${qs.length} spørsmål, forventet ${EXPECTED[t.id]}`);
    const nums = qs.map((q) => q.number).sort((a, b) => a - b);
    nums.forEach((n, i) => {
      if (n !== i + 1) errors.push(`Tema ${t.title}: nummerering hopper over ${i + 1}`);
    });
  }

  for (const q of QUESTIONS) {
    const check = (id: string) => {
      if (ids.has(id)) errors.push(`Duplikat-ID: ${id}`);
      ids.add(id);
    };
    check(q.id);
    if (!q.original.trim()) errors.push(`${q.id}: mangler originaltekst`);
    if (!q.answer.trim()) errors.push(`${q.id}: mangler fasitsvar`);
    if (!q.explanation.trim()) errors.push(`${q.id}: mangler forklaring`);
    if (!q.hint.trim()) errors.push(`${q.id}: mangler hint`);
    if (q.keyPoints.length === 0) errors.push(`${q.id}: mangler nøkkelpunkter`);
    if (!q.modes.includes("prove") || !q.modes.includes("forklar"))
      errors.push(`${q.id}: alle originalspørsmål skal kunne øves som åpne spørsmål og i prøven`);
    if (q.numeric) {
      if (!Number.isFinite(q.numeric.answer)) errors.push(`${q.id}: ugyldig tallsvar`);
    }
    for (const v of q.variants ?? []) {
      check(v.id);
      if (v.kind === "mcq") {
        if (!v.correct.trim()) errors.push(`${v.id}: mangler riktig svar`);
        if (v.wrong.length !== 3) errors.push(`${v.id}: må ha tre feil svar`);
        if (v.wrong.includes(v.correct)) errors.push(`${v.id}: riktig svar står også blant feil svar`);
        if (new Set(v.wrong).size !== 3) errors.push(`${v.id}: like feilalternativer`);
      }
      if (v.kind === "numeric" && !Number.isFinite(v.answer)) errors.push(`${v.id}: ugyldig tallsvar`);
    }
  }

  // Regnekontroll av omregningsoppgavene (uavhengig utregning)
  const expectedConv: Record<string, number> = {
    e10: 0.75 * 10,
    e11: 0.5 * 10,
    e12: 0.25 * 1000,
    e13: 600 / 1000,
    e14: 0.5 * 100,
    e15: 0.75 * 1000,
    e16: 330 / 1000,
    e17: 10,
    e18: 1000 / 100,
  };
  for (const [id, val] of Object.entries(expectedConv)) {
    const q = QUESTIONS.find((x) => x.id === id);
    if (!q?.numeric) errors.push(`${id}: mangler regneoppgave`);
    else if (Math.abs(q.numeric.answer - val) > 1e-9) errors.push(`${id}: feil fasit ${q.numeric.answer}, forventet ${val}`);
    else if (!q.answer.includes(String(val).replace(".", ","))) errors.push(`${id}: fasitteksten stemmer ikke med tallet`);
  }
  void parseNum;

  for (const m of MATCH_SETS) {
    for (const qid of m.questionIds) if (!ids.has(qid)) errors.push(`${m.id}: ukjent spørsmål ${qid}`);
    if (m.kind === "sort") for (const it of m.items) if (!m.categories.includes(it.category)) errors.push(`${m.id}: ukjent kategori ${it.category}`);
    if (m.kind === "match" && new Set(m.pairs.map((p) => p.right)).size !== m.pairs.length) errors.push(`${m.id}: like svar`);
  }

  // Alle temaer må ha minst én koble/sorter-oppgave
  for (const t of THEMES) {
    if (t.id === "maaltider") continue; // dekkes av visuell tallerkenmodell
    if (!MATCH_SETS.some((m) => m.theme === t.id)) errors.push(`Tema ${t.title}: ingen sorteringsoppgave`);
  }
  return errors;
}

export function dataSummary() {
  return {
    originals: QUESTIONS.length,
    variants: QUESTIONS.reduce((n, q) => n + (q.variants?.length ?? 0), 0),
    mcq: QUESTIONS.reduce((n, q) => n + (q.variants?.filter((v) => v.kind === "mcq").length ?? 0), 0),
    matchSets: MATCH_SETS.length,
  };
}
