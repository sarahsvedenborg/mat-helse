"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { logSession, recordResult, useStore, type Rating } from "@/lib/progress";
import { formatNumber, numbersEqual, parseNumber, type Item } from "@/lib/utils";
import { ProgressTop, RatingButtons, RichText, SpeakButton, ThemeChip } from "./ui";

type Result = { item: Item; rating: Rating; correct?: boolean };

/**
 * Felles øvingsøkt for huskekort, flervalg, regneoppgaver og repetisjon.
 * Kort som vurderes «Kunne ikke» legges inn igjen senere i samme økt (én gang).
 */
export default function Session({ build, mode, title, emptyText }: { build: () => Item[]; mode: string; title: string; emptyText?: string }) {
  const store = useStore();
  const [queue, setQueue] = useState<Item[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const requeued = useRef(new Set<string>());
  const logged = useRef(false);

  useEffect(() => {
    if (store.ready && queue === null) setQueue(build());
  }, [store.ready, queue, build]);

  const finish = queue !== null && idx >= queue.length;
  useEffect(() => {
    if (finish && !logged.current && results.length) {
      logged.current = true;
      const objective = results.filter((r) => r.correct !== undefined);
      logSession(mode, results.length, objective.length ? objective.filter((r) => r.correct).length : undefined);
    }
  }, [finish, results, mode]);

  const next = useCallback(
    (item: Item, rating: Rating, correct?: boolean) => {
      const source = item.type === "mcq" ? "mcq" : item.type === "numeric" ? "numeric" : "selv";
      recordResult(item.q.id, rating, source);
      setResults((r) => [...r, { item, rating, correct }]);
      if (rating === "again" && !requeued.current.has(item.key) && queue) {
        requeued.current.add(item.key);
        const copy = [...queue];
        copy.splice(Math.min(idx + 4, copy.length), 0, { ...item, key: item.key + "-igjen" } as Item);
        setQueue(copy);
      }
      setIdx((i) => i + 1);
    },
    [queue, idx],
  );

  if (!store.ready || queue === null) return <p className="muted">Laster …</p>;

  if (queue.length === 0)
    return (
      <div className="card center narrow">
        <p style={{ fontSize: "3rem", margin: 0 }} aria-hidden>
          🌟
        </p>
        <h2>{emptyText ?? "Ingen spørsmål å øve på her."}</h2>
        <Link className="btn mt" href="/ov">
          Velg en annen øving
        </Link>
      </div>
    );

  if (finish) return <Summary results={results} title={title} onAgain={() => { setQueue(build()); setIdx(0); setResults([]); requeued.current.clear(); logged.current = false; }} />;

  const item = queue[idx];
  return (
    <div className="narrow">
      <ProgressTop index={idx} total={queue.length} />
      <div key={item.key} className="card fade-in">
        {item.type === "card" && <CardView item={item} onRate={(r) => next(item, r)} />}
        {item.type === "mcq" && <McqView item={item} onDone={(ok) => next(item, ok ? "good" : "again", ok)} />}
        {item.type === "numeric" && <NumericView item={item} onDone={(ok) => next(item, ok ? "good" : "again", ok)} />}
      </div>
    </div>
  );
}

function Header({ item, label }: { item: Item; label: string }) {
  return (
    <div className="spread" style={{ marginBottom: 12 }}>
      <div className="row">
        <ThemeChip theme={item.q.theme} />
        <span className="chip">{label}</span>
      </div>
      <SpeakButton text={item.prompt} />
    </div>
  );
}

function CardView({ item, onRate }: { item: Extract<Item, { type: "card" }>; onRate: (r: Rating) => void }) {
  const [shown, setShown] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => btn.current?.focus(), []);
  return (
    <div>
      <Header item={item} label={item.isOriginal ? `Spørsmål ${item.q.number}` : "Variant"} />
      <p className="question-text">{item.prompt}</p>
      {!item.isOriginal && <p className="small muted">Fra originalspørsmålet: «{item.q.original}»</p>}
      {!shown ? (
        <>
          <p className="flip-hint">Tenk gjennom svaret – eller si det høyt – før du snur kortet.</p>
          <button ref={btn} className="btn btn-block" onClick={() => setShown(true)}>
            Vis svar
          </button>
        </>
      ) : (
        <div className="stack pop">
          <div className="answer-box" aria-live="polite">
            <p className="eyebrow">Fasit</p>
            <RichText text={item.answer} />
          </div>
          {item.isOriginal && item.explanation && (
            <div className="explain">
              <b>💡 Forklaring: </b>
              {item.explanation}
            </div>
          )}
          {item.q.misconceptions?.length ? (
            <details className="warn">
              <summary>Vanlige misforståelser</summary>
              <ul>
                {item.q.misconceptions.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </details>
          ) : null}
          <RatingButtons onRate={onRate} />
        </div>
      )}
    </div>
  );
}

function McqView({ item, onDone }: { item: Extract<Item, { type: "mcq" }>; onDone: (ok: boolean) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const ok = picked === item.correct;
  const nextBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (picked) nextBtn.current?.focus();
  }, [picked]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (picked) return;
      const n = Number(e.key);
      if (n >= 1 && n <= item.options.length) setPicked(item.options[n - 1]);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [picked, item.options]);
  return (
    <div>
      <Header item={item} label="Flervalg" />
      <p className="question-text" id={`q-${item.key}`}>
        {item.prompt}
      </p>
      <div className="stack" role="group" aria-labelledby={`q-${item.key}`}>
        {item.options.map((o, i) => {
          const cls = picked ? (o === item.correct ? "correct" : o === picked ? "wrong" : "") : "";
          return (
            <button key={o} className={`option ${cls}`} disabled={!!picked} onClick={() => setPicked(o)}>
              <span className="key" aria-hidden>
                {picked && o === item.correct ? "✓" : picked && o === picked ? "✗" : String.fromCharCode(65 + i)}
              </span>
              {o}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="stack mt pop" aria-live="polite">
          <div className={`feedback ${ok ? "ok" : "bad"}`}>
            {ok ? "Riktig! 🎉" : `Ikke helt. Riktig svar er: ${item.correct}`}
            <div style={{ fontWeight: 400, marginTop: 6 }}>{item.explanation}</div>
          </div>
          <button ref={nextBtn} className="btn btn-block" onClick={() => onDone(ok)}>
            Neste →
          </button>
        </div>
      )}
    </div>
  );
}

export function NumericView({ item, onDone }: { item: Extract<Item, { type: "numeric" }>; onDone: (ok: boolean) => void }) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const [invalid, setInvalid] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => input.current?.focus(), []);
  useEffect(() => {
    if (checked !== null) nextBtn.current?.focus();
  }, [checked]);
  const check = () => {
    const n = parseNumber(value);
    if (n === null) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setChecked(numbersEqual(n, item.answer));
  };
  return (
    <div>
      <Header item={item} label="Regneoppgave" />
      <p className="eyebrow">Gjør om målet</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (checked === null) check();
        }}
      >
        <label className="question-text" htmlFor={`n-${item.key}`} style={{ display: "block", marginBottom: 12 }}>
          {item.prompt.replace(/= ?_+.*$/, "=")} <span style={{ color: "var(--muted)" }}>? {item.unit}</span>
        </label>
        <div className="row">
          <input
            ref={input}
            id={`n-${item.key}`}
            className="input"
            inputMode="decimal"
            autoComplete="off"
            style={{ maxWidth: 200 }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={checked !== null}
            aria-describedby={`n-help-${item.key}`}
          />
          <b>{item.unit}</b>
          {checked === null && (
            <button className="btn" type="submit" disabled={!value.trim()}>
              Sjekk
            </button>
          )}
        </div>
        <p id={`n-help-${item.key}`} className="small muted mt">
          Du kan bruke både komma og punktum, f.eks. 0,5 eller 0.5.
        </p>
        {invalid && <p className="feedback bad">Skriv inn et tall.</p>}
      </form>
      {checked !== null && (
        <div className="stack mt pop" aria-live="polite">
          <div className={`feedback ${checked ? "ok" : "bad"}`}>
            {checked ? "Riktig! 🎉" : `Ikke riktig. Svaret er ${formatNumber(item.answer)} ${item.unit}.`}
            <div style={{ fontWeight: 400, marginTop: 6 }}>
              <b>Utregning:</b> {item.working}
            </div>
          </div>
          <button ref={nextBtn} className="btn btn-block" onClick={() => onDone(checked)}>
            Neste →
          </button>
        </div>
      )}
    </div>
  );
}

function Summary({ results, title, onAgain }: { results: Result[]; title: string; onAgain: () => void }) {
  const good = results.filter((r) => r.rating === "good").length;
  const hard = results.filter((r) => r.rating === "hard").length;
  const again = results.filter((r) => r.rating === "again").length;
  const weak = Array.from(new Map(results.filter((r) => r.rating !== "good").map((r) => [r.item.q.id, r.item.q])).values());
  const msg = good / Math.max(results.length, 1) > 0.75 ? "Strålende jobba! 🌟" : good > again ? "Godt jobba! 💪" : "Bra at du øver – det er slik man lærer! 🌱";
  return (
    <div className="narrow stack fade-in">
      <div className="card center">
        <p className="eyebrow">{title} – ferdig</p>
        <h2>{msg}</h2>
        <div className="grid grid-3 mt" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="stat">
            <b style={{ color: "var(--ok)" }}>{good}</b>
            <span className="small muted">kunne godt / riktig</span>
          </div>
          <div className="stat">
            <b style={{ color: "#b98410" }}>{hard}</b>
            <span className="small muted">litt usikker</span>
          </div>
          <div className="stat">
            <b style={{ color: "var(--bad)" }}>{again}</b>
            <span className="small muted">kunne ikke / feil</span>
          </div>
        </div>
      </div>
      {weak.length > 0 && (
        <div className="card">
          <h3>Disse bør du øve mer på</h3>
          <p className="small muted">De kommer automatisk tilbake i «Øv på det jeg ikke kan».</p>
          <ul>
            {weak.map((q) => (
              <li key={q.id}>
                <Link href={`/ov/forklar?q=${q.id}`}>{q.original}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="row">
        <button className="btn" onClick={onAgain}>
          Ny runde
        </button>
        <Link className="btn btn-ghost" href="/">
          Til forsiden
        </Link>
      </div>
    </div>
  );
}
