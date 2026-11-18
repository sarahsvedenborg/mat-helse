"use client";
// Lagring av fremgang i localStorage + enkelt spaced-repetition-system.

import { useSyncExternalStore } from "react";
import { QUESTIONS } from "./data/index.ts";

export type Rating = "again" | "hard" | "good";
/** Hvor resultatet kommer fra. Flervalg og sortering teller mindre enn egne svar. */
export type Source = "selv" | "mcq" | "numeric" | "match" | "prove";
export type Status = "ikke-ovd" | "trenger" | "paa-vei" | "mestret";

export interface QRecord {
  seen: number;
  strength: number; // 0–4. Mestret fra 2.
  lastRating: Rating;
  lastAt: number;
  lastGainAt: number;
  due: number;
  history: { t: number; r: Rating; s: Source }[];
}

export interface SessionLog {
  t: number;
  mode: string;
  count: number;
  correct?: number;
}

export interface Settings {
  kostrad: "2024" | "laerer";
  speechRate: number;
  name: string;
}

export interface Store {
  version: 1;
  records: Record<string, QRecord>;
  sessions: SessionLog[];
  daily: Record<string, { mastered: number; reviewed: number }>;
  settings: Settings;
}

const KEY = "mat-helse-fremgang-v1";
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const STATUS_LABEL: Record<Status, string> = {
  "ikke-ovd": "Ikke øvd",
  trenger: "Trenger øving",
  "paa-vei": "På vei",
  mestret: "Mestret",
};

export const RATING_LABEL: Record<Rating, string> = {
  again: "Kunne ikke",
  hard: "Litt usikker",
  good: "Kunne godt",
};

const empty = (): Store => ({
  version: 1,
  records: {},
  sessions: [],
  daily: {},
  settings: { kostrad: "2024", speechRate: 0.95, name: "" },
});

let state: Store = empty();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Store;
      state = { ...empty(), ...parsed, settings: { ...empty().settings, ...parsed.settings } };
    }
  } catch {
    state = empty();
  }
}

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* lagring kan være blokkert – appen fungerer likevel denne økten */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const serverSnapshot = empty();
let hydrated = false;

/** React-hook som gir oppdatert fremgang. Returnerer tom fremgang under serverrendering. */
export function useStore(): Store & { ready: boolean } {
  const s = useSyncExternalStore(
    subscribe,
    () => {
      load();
      hydrated = true;
      return state;
    },
    () => serverSnapshot,
  );
  return Object.assign({}, s, { ready: hydrated && s !== serverSnapshot });
}

export function getStore() {
  load();
  return state;
}

const dayKey = (t = Date.now()) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function statusOf(rec?: QRecord): Status {
  if (!rec || rec.seen === 0) return "ikke-ovd";
  if (rec.lastRating === "again") return "trenger";
  if (rec.strength >= 2) return "mestret";
  return "paa-vei";
}

/**
 * Registrer et resultat for et originalspørsmål.
 * - Kunne ikke: styrken nullstilles, spørsmålet kommer tilbake om ca. 10 minutter.
 * - Litt usikker: styrken holdes lav, tilbake neste dag.
 * - Kunne godt: styrken øker, intervallet blir lengre (2, 4, 8, 16 dager).
 * Flervalg og sortering gir bare halv økning, og styrken kan ikke nå «mestret»
 * uten at det har gått minst 4 timer siden forrige økning (så ett riktig svar aldri er nok).
 */
export function recordResult(qid: string, rating: Rating, source: Source = "selv") {
  load();
  const now = Date.now();
  const prev = state.records[qid];
  const rec: QRecord = prev
    ? { ...prev, history: [...prev.history] }
    : { seen: 0, strength: 0, lastRating: rating, lastAt: now, lastGainAt: 0, due: now, history: [] };
  const wasMastered = statusOf(prev) === "mestret";

  rec.seen += 1;
  rec.lastRating = rating;
  rec.lastAt = now;
  rec.history.push({ t: now, r: rating, s: source });
  if (rec.history.length > 30) rec.history.shift();

  if (rating === "again") {
    rec.strength = 0;
    rec.due = now + 10 * MIN;
  } else if (rating === "hard") {
    rec.strength = Math.min(rec.strength, 1);
    rec.due = now + DAY;
  } else {
    const gain = source === "mcq" || source === "match" ? 0.5 : 1;
    const spaced = now - rec.lastGainAt >= 4 * HOUR;
    let next = rec.strength + gain;
    if (!spaced) next = Math.max(rec.strength, Math.min(next, 1.5));
    if (next > rec.strength) rec.lastGainAt = now;
    rec.strength = Math.min(next, 4);
    const intervals = [1, 2, 4, 8, 16];
    rec.due = now + intervals[Math.floor(rec.strength)] * DAY;
  }

  state = { ...state, records: { ...state.records, [qid]: rec } };
  const dk = dayKey(now);
  const mastered = QUESTIONS.filter((q) => statusOf(state.records[q.id]) === "mestret").length;
  const d = state.daily[dk] ?? { mastered, reviewed: 0 };
  state.daily = { ...state.daily, [dk]: { mastered, reviewed: d.reviewed + 1 } };
  save();
  return { before: wasMastered, after: statusOf(rec) };
}

export function logSession(mode: string, count: number, correct?: number) {
  load();
  if (count <= 0) return;
  state = { ...state, sessions: [...state.sessions, { t: Date.now(), mode, count, correct }].slice(-500) };
  save();
}

export function updateSettings(patch: Partial<Settings>) {
  load();
  state = { ...state, settings: { ...state.settings, ...patch } };
  save();
}

export function resetProgress() {
  const settings = state.settings;
  state = { ...empty(), settings };
  save();
}

// ---------- Utvalg og statistikk ----------

/** Prioritet for repetisjon: høyere tall = viktigere å øve på. */
export function priority(rec: QRecord | undefined, now = Date.now()): number {
  if (!rec) return 50;
  if (rec.lastRating === "again") return 100 + (now - rec.lastAt) / HOUR;
  const overdue = (now - rec.due) / DAY;
  if (rec.lastRating === "hard") return 80 + Math.max(overdue, 0);
  if (overdue >= 0) return 60 + overdue - rec.strength * 5;
  return 10 - rec.strength * 2 + overdue; // ikke forfalt ennå
}

/** Spørsmål som trenger repetisjon (svart feil, usikre eller forfalt). */
export function needsReview(store: Store, now = Date.now()) {
  return QUESTIONS.filter((q) => {
    const r = store.records[q.id];
    if (!r) return false;
    return r.lastRating !== "good" || r.due <= now;
  });
}

export function themeProgress(store: Store, theme?: string) {
  const qs = theme ? QUESTIONS.filter((q) => q.theme === theme) : QUESTIONS;
  const counts: Record<Status, number> = { "ikke-ovd": 0, trenger: 0, "paa-vei": 0, mestret: 0 };
  let score = 0;
  for (const q of qs) {
    const r = store.records[q.id];
    counts[statusOf(r)]++;
    if (r) score += Math.min(r.strength / 2, 1) * (r.lastRating === "again" ? 0.3 : 1);
  }
  return { total: qs.length, counts, percent: qs.length ? Math.round((score / qs.length) * 100) : 0 };
}

export { dayKey };
