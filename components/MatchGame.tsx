"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { MatchSet } from "@/lib/types";
import { logSession, recordResult, type Rating } from "@/lib/progress";
import { shuffle } from "@/lib/utils";
import { questionById } from "@/lib/data";

function finishSet(set: MatchSet, mistakes: number, total: number) {
  const rating: Rating = mistakes === 0 ? "good" : mistakes <= Math.max(1, Math.round(total / 4)) ? "hard" : "again";
  for (const id of set.questionIds) recordResult(id, rating, "match");
  logSession("sorter", 1, mistakes === 0 ? 1 : 0);
  return rating;
}

function Done({ set, mistakes, onAgain }: { set: MatchSet; mistakes: number; onAgain: () => void }) {
  return (
    <div className="stack mt pop" aria-live="polite">
      <div className={`feedback ${mistakes === 0 ? "ok" : "neutral"}`}>
        {mistakes === 0 ? "Alt riktig på første forsøk! 🎉" : `Ferdig! Du hadde ${mistakes} ${mistakes === 1 ? "feil" : "feil"} underveis.`}
        <div style={{ fontWeight: 400, marginTop: 6 }}>💡 {set.explanation}</div>
      </div>
      <div className="small muted">
        Øv videre med originalspørsmålene:{" "}
        {set.questionIds.map((id, i) => (
          <span key={id}>
            {i > 0 && ", "}
            <Link href={`/ov/forklar?q=${id}`}>{questionById(id)?.original.slice(0, 50)}…</Link>
          </span>
        ))}
      </div>
      <div className="row">
        <button className="btn" onClick={onAgain}>Prøv igjen</button>
        <Link className="btn btn-ghost" href="/ov/sorter">Flere oppgaver</Link>
      </div>
    </div>
  );
}

export function MatchGame({ set }: { set: MatchSet }) {
  const [round, setRound] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <p className="muted">Laster …</p>;
  return (
    <div className="card mt fade-in" key={round}>
      <p className="eyebrow">{set.kind === "match" ? "Koble sammen" : set.kind === "sort" ? "Sorter" : "Rekkefølge"}</p>
      <h1 style={{ fontSize: "1.5rem" }}>{set.title}</h1>
      <p className="muted">{set.instructions}</p>
      {set.kind === "match" && <Match set={set} onAgain={() => setRound((r) => r + 1)} />}
      {set.kind === "sort" && <Sort set={set} onAgain={() => setRound((r) => r + 1)} />}
      {set.kind === "order" && <Order set={set} onAgain={() => setRound((r) => r + 1)} />}
    </div>
  );
}

function Match({ set, onAgain }: { set: Extract<MatchSet, { kind: "match" }>; onAgain: () => void }) {
  const lefts = useMemo(() => shuffle(set.pairs.map((p) => p.left)), [set]);
  const rights = useMemo(() => shuffle(set.pairs.map((p) => p.right)), [set]);
  const [sel, setSel] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [shake, setShake] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [msg, setMsg] = useState("");
  const [finished, setFinished] = useState(false);

  const pickRight = (r: string) => {
    if (!sel) {
      setMsg("Velg først et element i venstre kolonne.");
      return;
    }
    const pair = set.pairs.find((p) => p.left === sel)!;
    if (pair.right === r) {
      const m = new Set(matched).add(sel);
      setMatched(m);
      setMsg(`Riktig: ${sel} – ${r}`);
      setSel(null);
      if (m.size === set.pairs.length) {
        finishSet(set, mistakes, set.pairs.length);
        setFinished(true);
      }
    } else {
      setMistakes((x) => x + 1);
      setShake(r);
      setMsg(`Ikke riktig. Prøv igjen.`);
      setTimeout(() => setShake(null), 400);
    }
  };
  const doneRights = new Set(set.pairs.filter((p) => matched.has(p.left)).map((p) => p.right));

  return (
    <>
      <p className="sr-only" aria-live="polite">{msg}</p>
      <div className="match-grid">
        <div className="stack" role="group" aria-label="Venstre kolonne">
          {lefts.map((l) => (
            <button key={l} className={`pick ${matched.has(l) ? "done" : sel === l ? "selected" : ""}`} disabled={matched.has(l)} aria-pressed={sel === l} onClick={() => setSel(sel === l ? null : l)}>
              {matched.has(l) ? "✓ " : ""}{l}
            </button>
          ))}
        </div>
        <div className="stack" role="group" aria-label="Høyre kolonne">
          {rights.map((r) => (
            <button key={r} className={`pick ${doneRights.has(r) ? "done" : shake === r ? "shake" : ""}`} disabled={doneRights.has(r)} onClick={() => pickRight(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>
      {!finished && <p className="small muted mt">{sel ? `Valgt: «${sel}». Klikk på det som passer i høyre kolonne.` : "Klikk på et element i venstre kolonne."}</p>}
      {finished && <Done set={set} mistakes={mistakes} onAgain={onAgain} />}
    </>
  );
}

function Sort({ set, onAgain }: { set: Extract<MatchSet, { kind: "sort" }>; onAgain: () => void }) {
  const items = useMemo(() => shuffle(set.items), [set]);
  const [place, setPlace] = useState<Record<string, string>>({});
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);

  const unplaced = items.filter((i) => !place[i.text]);
  const put = (cat: string) => {
    if (!sel) return;
    setPlace((p) => ({ ...p, [sel]: cat }));
    setSel(null);
    setChecked(false);
  };
  const check = () => {
    const wrong = items.filter((i) => place[i.text] !== i.category);
    setChecked(true);
    if (wrong.length === 0) {
      finishSet(set, mistakes, items.length);
      setFinished(true);
    } else {
      setMistakes((m) => m + wrong.length);
    }
  };
  const wrongCount = items.filter((i) => place[i.text] && place[i.text] !== i.category).length;

  return (
    <>
      <div className="bucket" style={{ marginBottom: 12 }} aria-label="Elementer som skal sorteres" role="group">
        {unplaced.length === 0 ? <span className="small muted">Alle elementer er plassert.</span> : unplaced.map((i) => (
          <button key={i.text} className={`token ${sel === i.text ? "selected" : ""}`} aria-pressed={sel === i.text} onClick={() => setSel(sel === i.text ? null : i.text)}>
            {i.text}
          </button>
        ))}
      </div>
      <p className="small muted" aria-live="polite">{sel ? `Valgt: «${sel}». Velg gruppe under.` : "Velg et element, og så gruppen det hører til. Klikk på et plassert element for å flytte det."}</p>
      <div className="grid" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${set.categories.length > 3 ? 150 : 200}px, 1fr))` }}>
        {set.categories.map((c) => (
          <div key={c} className="bucket">
            <button className={`bucket-head ${sel ? "armed" : ""}`} onClick={() => put(c)} disabled={!sel || finished} aria-label={`Legg i gruppen ${c}`}>
              {c}
            </button>
            {items.filter((i) => place[i.text] === c).map((i) => {
              const state = checked ? (i.category === c ? "ok" : "bad") : "";
              return (
                <button key={i.text} className={`token ${state} ${sel === i.text ? "selected" : ""}`} disabled={finished} onClick={() => setSel(i.text)} aria-label={`${i.text}${state === "bad" ? " (feil plassert)" : state === "ok" ? " (riktig)" : ""}`}>
                  {state === "ok" ? "✓ " : state === "bad" ? "✗ " : ""}{i.text}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {!finished && (
        <div className="row mt">
          <button className="btn" onClick={check} disabled={unplaced.length > 0}>Sjekk</button>
          {checked && wrongCount > 0 && <span className="feedback bad" aria-live="polite">{wrongCount} er feil plassert (✗). Flytt dem og sjekk igjen.</span>}
        </div>
      )}
      {finished && <Done set={set} mistakes={mistakes} onAgain={onAgain} />}
    </>
  );
}

function Order({ set, onAgain }: { set: Extract<MatchSet, { kind: "order" }>; onAgain: () => void }) {
  const [list, setList] = useState(() => shuffle(set.steps));
  const [checked, setChecked] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);
  const [msg, setMsg] = useState("");
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const c = [...list];
    [c[i], c[j]] = [c[j], c[i]];
    setList(c);
    setChecked(false);
    setMsg(`«${c[j]}» flyttet til plass ${j + 1}.`);
  };
  const check = () => {
    const wrong = list.filter((s, i) => set.steps[i] !== s).length;
    setChecked(true);
    if (wrong === 0) {
      finishSet(set, mistakes, list.length);
      setFinished(true);
    } else setMistakes((m) => m + 1);
  };
  return (
    <>
      <p className="sr-only" aria-live="polite">{msg}</p>
      <ol className="stack" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {list.map((s, i) => {
          const state = checked ? (set.steps[i] === s ? "done" : "shake") : "";
          return (
            <li key={s} className={`pick ${state}`} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "default" }}>
              <b style={{ width: 24 }}>{i + 1}.</b>
              <span style={{ flex: 1 }}>{s}</span>
              {!finished && (
                <span className="row" style={{ gap: 4 }}>
                  <button className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Flytt «${s}» opp`}>↑</button>
                  <button className="icon-btn" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label={`Flytt «${s}» ned`}>↓</button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!finished && (
        <div className="row mt">
          <button className="btn" onClick={check}>Sjekk rekkefølgen</button>
          {checked && <span className="feedback bad" aria-live="polite">Noen steg står feil (rød). Grønne står riktig.</span>}
        </div>
      )}
      {finished && <Done set={set} mistakes={mistakes} onAgain={onAgain} />}
    </>
  );
}
