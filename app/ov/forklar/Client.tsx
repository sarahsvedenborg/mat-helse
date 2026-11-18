"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { QUESTIONS, questionById } from "@/lib/data";
import { recordResult, logSession, statusOf, useStore, type Rating } from "@/lib/progress";
import { answerFor, byPriority } from "@/lib/utils";
import type { Question } from "@/lib/types";
import ThemePicker from "@/components/ThemePicker";
import Dictation from "@/components/Dictation";
import { ProgressTop, RatingButtons, RichText, SpeakButton, StatusChip, ThemeChip } from "@/components/ui";

const SESSION = 6;

export default function Client({ tema, qid }: { tema: string | null; qid: string | null }) {
  const store = useStore();
  const [list, setList] = useState<Question[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (!store.ready || list) return;
    if (qid && questionById(qid)) {
      setList([questionById(qid)!]);
      return;
    }
    // Prioriter «forklar/gjør greie for»-spørsmål (ikke de rene omregningsoppgavene)
    const pool = QUESTIONS.filter((q) => (!tema || q.theme === tema) && !q.numeric && !(q.accept && q.theme === "maal"));
    setList(byPriority(pool, store).slice(0, SESSION));
  }, [store, list, tema, qid]);

  if (!store.ready || !list) return <p className="muted">Laster …</p>;

  const finished = idx >= list.length;
  return (
    <>
      <h1>✍️ Forklar med egne ord</h1>
      <p className="muted">Skriv svaret slik du ville gjort på prøven. Sammenlign så med fasiten og kryss av for punktene du fikk med. Appen retter ikke fritekst automatisk – det er du som vurderer.</p>
      {!qid && <ThemePicker base="/ov/forklar" current={tema} />}
      {finished ? (
        <div className="card center narrow fade-in">
          <p style={{ fontSize: "3rem", margin: 0 }} aria-hidden>✍️</p>
          <h2>Bra jobba! Du har forklart {done} spørsmål.</h2>
          <p className="muted">Å formulere svar selv er den beste måten å forberede seg til en skriftlig prøve.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <button className="btn" onClick={() => { setList(null); setIdx(0); setDone(0); }}>Flere spørsmål</button>
            <Link className="btn btn-ghost" href="/">Til forsiden</Link>
          </div>
        </div>
      ) : (
        <div className="narrow">
          {list.length > 1 && <ProgressTop index={idx} total={list.length} />}
          <Explain
            key={list[idx].id}
            q={list[idx]}
            onNext={(rated) => {
              if (rated) setDone((d) => d + 1);
              if (idx + 1 >= list.length) logSession("forklar", done + (rated ? 1 : 0));
              setIdx((i) => i + 1);
            }}
          />
        </div>
      )}
    </>
  );
}

function Explain({ q, onNext }: { q: Question; onNext: (rated: boolean) => void }) {
  const store = useStore();
  const { answer, keyPoints } = answerFor(q, store.settings);
  const [text, setText] = useState("");
  const [hint, setHint] = useState(false);
  const [checked, setChecked] = useState(false);
  const [ticks, setTicks] = useState<boolean[]>(() => keyPoints.map(() => false));
  const count = ticks.filter(Boolean).length;
  const suggestion: Rating = useMemo(() => {
    const r = count / Math.max(keyPoints.length, 1);
    return r >= 0.8 ? "good" : r >= 0.4 ? "hard" : "again";
  }, [count, keyPoints.length]);

  const rate = (r: Rating) => {
    recordResult(q.id, r, "selv");
    onNext(true);
  };

  return (
    <div className="card fade-in">
      <div className="spread" style={{ marginBottom: 10 }}>
        <div className="row">
          <ThemeChip theme={q.theme} />
          <StatusChip status={statusOf(store.records[q.id])} />
        </div>
        <SpeakButton text={q.original} label="Les spørsmålet" />
      </div>
      <p className="question-text" id={`fq-${q.id}`}>{q.original}</p>

      {!checked ? (
        <div className="stack">
          <label htmlFor={`fa-${q.id}`} className="small muted">Ditt svar</label>
          <textarea
            id={`fa-${q.id}`}
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Skriv svaret ditt her …"
            aria-describedby={`fq-${q.id}`}
          />
          <div className="row">
            <Dictation onText={(t) => setText((s) => (s ? s.trimEnd() + " " : "") + t)} />
            <button type="button" className="icon-btn" aria-expanded={hint} onClick={() => setHint((h) => !h)}>
              <span aria-hidden>💡</span> {hint ? "Skjul hint" : "Vis hint"}
            </button>
          </div>
          {hint && <div className="explain pop" aria-live="polite">{q.hint}</div>}
          <div className="row">
            <button className="btn" onClick={() => setChecked(true)}>Sjekk svaret mitt</button>
            <button className="btn btn-ghost" onClick={() => onNext(false)}>Hopp over</button>
          </div>
          {!text.trim() && <p className="small muted">Du kan også bare tenke ut svaret og sjekke etterpå – men å skrive det ned gir best øving.</p>}
        </div>
      ) : (
        <div className="stack pop">
          <div className="grid grid-2">
            <div>
              <p className="eyebrow">Ditt svar</p>
              <div className="card" style={{ boxShadow: "none", background: "#fffdf8", whiteSpace: "pre-wrap", minHeight: 80 }}>
                {text.trim() || <span className="muted">(Du skrev ikke noe svar.)</span>}
              </div>
            </div>
            <div>
              <p className="eyebrow">Modellsvar</p>
              <div className="answer-box"><RichText text={answer} /></div>
            </div>
          </div>
          <div>
            <h3 style={{ marginTop: 8 }}>Hvilke nøkkelpunkter fikk du med?</h3>
            <p className="small muted">Kryss av ærlig – det er ikke nøyaktig ordlyd som teller, men at du har forklart poenget.</p>
            <div className="stack" role="group" aria-label="Sjekkliste med nøkkelpunkter">
              {keyPoints.map((k, i) => (
                <label key={k} className={`check-item ${ticks[i] ? "on" : ""}`}>
                  <input type="checkbox" checked={ticks[i]} onChange={() => setTicks((t) => t.map((v, j) => (j === i ? !v : v)))} />
                  <span>{k}</span>
                </label>
              ))}
            </div>
            <p className="mt" aria-live="polite"><b>{count} av {keyPoints.length}</b> nøkkelpunkter krysset av.</p>
          </div>
          <div className="explain"><b>💡 Forklaring: </b>{q.explanation}</div>
          {q.precise && (
            <details className="precise">
              <summary>Mer presis faglig forklaring</summary>
              <p style={{ marginTop: 8 }}>{q.precise}</p>
            </details>
          )}
          {q.misconceptions?.length ? (
            <details className="warn">
              <summary>Vanlige misforståelser</summary>
              <ul>{q.misconceptions.map((m) => <li key={m}>{m}</li>)}</ul>
            </details>
          ) : null}
          <p className="small muted">
            Forslag ut fra sjekklisten: <b>{suggestion === "good" ? "Kunne godt" : suggestion === "hard" ? "Litt usikker" : "Kunne ikke"}</b> – men du bestemmer selv.
          </p>
          <RatingButtons onRate={rate} />
        </div>
      )}
    </div>
  );
}
