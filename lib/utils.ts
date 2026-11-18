import { QUESTIONS, TEACHER_KOSTRAD } from "./data/index.ts";
import type { Question, Variant } from "./types.ts";
import type { Settings, Store } from "./progress.ts";
import { priority } from "./progress.ts";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Tolker et tall skrevet av eleven. Godtar komma og punktum, og brøkene ½ ¼ ¾. */
export function parseNumber(input: string): number | null {
  let s = input.trim().toLowerCase().replace(/\s+/g, "").replace(",", ".");
  s = s.replace(/[a-zæøå]+$/i, ""); // fjern evt. enhet bak tallet
  if (!s) return null;
  const fr: Record<string, number> = { "½": 0.5, "¼": 0.25, "¾": 0.75 };
  if (fr[s] !== undefined) return fr[s];
  const m = s.match(/^(\d+)\/(\d+)$/);
  if (m) return Number(m[1]) / Number(m[2]);
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export const numbersEqual = (a: number, b: number) => Math.abs(a - b) < 1e-9;

export const formatNumber = (n: number) => String(n).replace(".", ",");

/** Normaliserer korte fakta-svar for automatisk retting. */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[.!?"«»]/g, "")
    .replace(/\s+/g, " ");

export function checkShort(q: Question, input: string): boolean {
  if (!q.accept) return false;
  const n = normalize(input);
  return q.accept.some((a) => normalize(a) === n);
}

/** Bruker lærerens versjon av kostrådene hvis det er valgt i innstillingene. */
export function answerFor(q: Question, settings?: Settings): { answer: string; keyPoints: string[] } {
  if (q.id === "n19" && settings?.kostrad === "laerer") {
    return { answer: TEACHER_KOSTRAD.answer, keyPoints: TEACHER_KOSTRAD.keyPoints.length ? TEACHER_KOSTRAD.keyPoints : q.keyPoints };
  }
  return { answer: q.answer, keyPoints: q.keyPoints };
}

// ---------- Øvingselementer ----------

export type Item =
  | { key: string; type: "card"; q: Question; prompt: string; answer: string; explanation?: string; isOriginal: boolean }
  | { key: string; type: "mcq"; q: Question; prompt: string; options: string[]; correct: string; explanation: string }
  | { key: string; type: "numeric"; q: Question; prompt: string; answer: number; unit: string; working: string };

export function itemFromVariant(q: Question, v: Variant): Item {
  if (v.kind === "mcq")
    return { key: v.id, type: "mcq", q, prompt: v.prompt, options: shuffle([v.correct, ...v.wrong]), correct: v.correct, explanation: v.explanation };
  if (v.kind === "numeric") return { key: v.id, type: "numeric", q, prompt: v.prompt, answer: v.answer, unit: v.unit, working: v.working };
  return { key: v.id, type: "card", q, prompt: v.prompt, answer: v.answer, isOriginal: false };
}

export function originalCard(q: Question, settings?: Settings): Item {
  if (q.numeric) return { key: q.id, type: "numeric", q, prompt: q.original.replace("Gjør om: ", ""), ...q.numeric };
  return { key: q.id, type: "card", q, prompt: q.original, answer: answerFor(q, settings).answer, explanation: q.explanation, isOriginal: true };
}

/** Sorterer spørsmål etter hvor viktig det er å øve på dem nå. */
export function byPriority(qs: Question[], store: Store) {
  const now = Date.now();
  return [...qs].sort((a, b) => priority(store.records[b.id], now) - priority(store.records[a.id], now) + (Math.random() - 0.5) * 4);
}

export function filterTheme(theme: string | null) {
  return theme ? QUESTIONS.filter((q) => q.theme === theme) : QUESTIONS;
}

/** Huskekort: originalspørsmål + noen recall-varianter, prioritert. */
export function buildFlashcards(theme: string | null, store: Store, count = 12, weakOnly = false): Item[] {
  let qs = filterTheme(theme);
  if (weakOnly) qs = qs.filter((q) => store.records[q.id] && priority(store.records[q.id]) >= 60);
  const picked = byPriority(qs, store).slice(0, count);
  return picked.map((q) => {
    const recalls = (q.variants ?? []).filter((v) => v.kind === "recall");
    const r = store.records[q.id];
    // Varier vinkelen når spørsmålet er øvd før
    if (r && r.seen > 0 && recalls.length && Math.random() < 0.35) return itemFromVariant(q, recalls[Math.floor(Math.random() * recalls.length)]);
    return originalCard(q, store.settings);
  });
}

/** Quiz: flervalg og regneoppgaver. */
export function buildQuiz(theme: string | null, store: Store, count = 10): Item[] {
  const qs = byPriority(filterTheme(theme), store);
  const items: Item[] = [];
  const used = new Set<string>();
  // Ett element per spørsmål først, så flere varianter hvis det trengs
  for (let round = 0; round < 3 && items.length < count; round++) {
    for (const q of qs) {
      if (items.length >= count) break;
      const pool: Item[] = [];
      for (const v of q.variants ?? []) if (v.kind !== "recall" && !used.has(v.id)) pool.push(itemFromVariant(q, v));
      if (q.numeric && !used.has(q.id)) pool.push(originalCard(q));
      if (!pool.length) continue;
      const it = pool[Math.floor(Math.random() * pool.length)];
      used.add(it.key);
      items.push(it);
    }
  }
  return shuffle(items);
}

/** «Øv på det jeg ikke kan»: svake spørsmål, med variert oppgavetype. */
export function buildReview(store: Store, count = 12): Item[] {
  const now = Date.now();
  const weak = QUESTIONS.filter((q) => {
    const r = store.records[q.id];
    return r && (r.lastRating !== "good" || r.due <= now);
  });
  const picked = byPriority(weak, store).slice(0, count);
  return picked.map((q) => {
    if (q.numeric) return originalCard(q);
    const r = store.records[q.id]!;
    const mcqs = (q.variants ?? []).filter((v) => v.kind === "mcq");
    // Etter «kunne ikke» øver vi aktiv gjenkalling av originalen; ellers av og til flervalg for variasjon
    if (r.lastRating !== "again" && mcqs.length && Math.random() < 0.3) return itemFromVariant(q, mcqs[Math.floor(Math.random() * mcqs.length)]);
    return originalCard(q, store.settings);
  });
}

/** Velger prøvespørsmål jevnt fordelt på temaene, uten duplikater. */
export function buildExam(count: number | "full"): string[] {
  if (count === "full") return QUESTIONS.map((q) => q.id);
  // Sørg for en blanding: ca. 20 % omregningsoppgaver, resten jevnt fordelt på temaene
  const conversions = shuffle(QUESTIONS.filter((q) => q.numeric)).slice(0, Math.max(2, Math.round(count * 0.2)));
  const out: string[] = conversions.map((q) => q.id);
  const byTheme = new Map<string, Question[]>();
  for (const q of shuffle(QUESTIONS.filter((x) => !x.numeric))) byTheme.set(q.theme, [...(byTheme.get(q.theme) ?? []), q]);
  const themes = shuffle([...byTheme.keys()]);
  while (out.length < count) {
    let added = false;
    for (const t of themes) {
      const list = byTheme.get(t)!;
      const next = list.shift();
      if (next && out.length < count) {
        out.push(next.id);
        added = true;
      }
    }
    if (!added) break;
  }
  // Sorter i temarekkefølge, som på en vanlig prøve
  const order = QUESTIONS.map((q) => q.id);
  return out.sort((a, b) => order.indexOf(a) - order.indexOf(b));
}
