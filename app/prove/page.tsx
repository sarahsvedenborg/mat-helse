"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { QUESTIONS, THEMES, questionById } from "@/lib/data";
import { logSession, recordResult, useStore, type Rating } from "@/lib/progress";
import { answerFor, buildExam, checkShort, formatNumber, numbersEqual, parseNumber } from "@/lib/utils";
import type { Question } from "@/lib/types";
import { RichText, SpeakButton, ThemeChip } from "@/components/ui";

const KEY = "mat-helse-prove-v1";
type Grade = "riktig" | "delvis" | "feil";
interface Exam {
  ids: string[];
  answers: Record<string, string>;
  submitted: boolean;
  grades: Record<string, Grade>;
  startedAt: number;
  current: number;
}

const kindOf = (q: Question) => (q.numeric ? "numeric" : q.accept ? "short" : "open");
const GRADE_RATING: Record<Grade, Rating> = { riktig: "good", delvis: "hard", feil: "again" };
const GRADE_POINTS: Record<Grade, number> = { riktig: 1, delvis: 0.5, feil: 0 };

function autoGrade(q: Question, ans: string): Grade | null {
  const k = kindOf(q);
  if (k === "numeric") {
    const n = parseNumber(ans ?? "");
    return n !== null && numbersEqual(n, q.numeric!.answer) ? "riktig" : "feil";
  }
  if (k === "short") return checkShort(q, ans ?? "") ? "riktig" : null; // ikke funnet → eleven vurderer selv
  return null;
}

function loadExam(): Exam | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Exam) : null;
  } catch {
    return null;
  }
}
function saveExam(e: Exam | null) {
  try {
    if (e) localStorage.setItem(KEY, JSON.stringify(e));
    else localStorage.removeItem(KEY);
  } catch {
    /* ignorer */
  }
}

export default function ProvePage() {
  const [exam, setExamState] = useState<Exam | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setExamState(loadExam());
    setLoaded(true);
  }, []);
  const setExam = (e: Exam | null) => {
    setExamState(e);
    saveExam(e);
  };

  if (!loaded) return <p className="muted">Laster …</p>;
  if (!exam) return <Setup onStart={(ids) => setExam({ ids, answers: {}, submitted: false, grades: {}, startedAt: Date.now(), current: 0 })} />;
  if (!exam.submitted) return <Taking exam={exam} setExam={setExam} />;
  return <Results exam={exam} setExam={setExam} />;
}

function Setup({ onStart }: { onStart: (ids: string[]) => void }) {
  const options = [
    { n: 10 as const, title: "Kort prøve", text: "10 spørsmål · ca. 15–20 min" },
    { n: 20 as const, title: "Mellomlang prøve", text: "20 spørsmål · ca. 30–40 min" },
    { n: "full" as const, title: "Full prøve", text: `Hele pensum · ${QUESTIONS.length} spørsmål` },
  ];
  return (
    <div className="narrow">
      <h1>📝 Prøvesimulator</h1>
      <p className="muted">
        Prøven blander korte faktaspørsmål, omregningsoppgaver og åpne forklaringsspørsmål fra alle temaene. Du får <b>ingen hint eller fasit</b> underveis. Etter innlevering
        rettes regneoppgavene automatisk, og du vurderer de åpne svarene selv mot fasiten.
      </p>
      <div className="stack mt">
        {options.map((o) => (
          <button key={String(o.n)} className="option" onClick={() => onStart(buildExam(o.n))}>
            <span className="key" aria-hidden>📝</span>
            <span>
              <b>{o.title}</b>
              <br />
              <span className="small muted">{o.text}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="small muted mt">Prøven lagres underveis, så du kan ta en pause og fortsette senere.</p>
    </div>
  );
}

function Taking({ exam, setExam }: { exam: Exam; setExam: (e: Exam | null) => void }) {
  const q = questionById(exam.ids[exam.current])!;
  const k = kindOf(q);
  const answered = exam.ids.filter((id) => (exam.answers[id] ?? "").trim()).length;
  const go = (i: number) => setExam({ ...exam, current: Math.max(0, Math.min(exam.ids.length - 1, i)) });
  const setAns = (v: string) => setExam({ ...exam, answers: { ...exam.answers, [q.id]: v } });
  const submit = () => {
    const missing = exam.ids.length - answered;
    if (!confirm(missing > 0 ? `Du har ${missing} ubesvarte spørsmål. Vil du levere likevel?` : "Er du sikker på at du vil levere prøven?")) return;
    const grades: Record<string, Grade> = {};
    for (const id of exam.ids) {
      const qq = questionById(id)!;
      const g = autoGrade(qq, exam.answers[id] ?? "");
      if (g) {
        grades[id] = g;
        recordResult(id, GRADE_RATING[g], kindOf(qq) === "numeric" ? "numeric" : "prove");
      }
    }
    logSession("prove", exam.ids.length);
    setExam({ ...exam, submitted: true, grades });
    window.scrollTo(0, 0);
  };

  return (
    <div className="narrow">
      <div className="spread">
        <h1 style={{ fontSize: "1.5rem" }}>📝 Prøve</h1>
        <span className="small muted">
          {answered} av {exam.ids.length} besvart
        </span>
      </div>
      <nav className="exam-nav" aria-label="Gå til spørsmål">
        {exam.ids.map((id, i) => (
          <button
            key={id}
            className={`${(exam.answers[id] ?? "").trim() ? "answered" : ""} ${i === exam.current ? "current" : ""}`}
            aria-current={i === exam.current ? "step" : undefined}
            aria-label={`Spørsmål ${i + 1}${(exam.answers[id] ?? "").trim() ? ", besvart" : ""}`}
            onClick={() => go(i)}
          >
            {i + 1}
          </button>
        ))}
      </nav>
      <div className="card mt fade-in" key={q.id}>
        <div className="spread" style={{ marginBottom: 10 }}>
          <span className="eyebrow">
            Spørsmål {exam.current + 1} av {exam.ids.length}
          </span>
          <SpeakButton text={q.original} />
        </div>
        <label htmlFor="exam-answer" className="question-text" style={{ display: "block", marginBottom: 12 }}>
          {q.original}
        </label>
        {k === "numeric" ? (
          <div className="row">
            <input id="exam-answer" className="input" inputMode="decimal" style={{ maxWidth: 200 }} autoComplete="off" value={exam.answers[q.id] ?? ""} onChange={(e) => setAns(e.target.value)} />
            <b>{q.numeric!.unit}</b>
          </div>
        ) : k === "short" ? (
          <input id="exam-answer" className="input" autoComplete="off" value={exam.answers[q.id] ?? ""} onChange={(e) => setAns(e.target.value)} />
        ) : (
          <textarea id="exam-answer" className="input" value={exam.answers[q.id] ?? ""} onChange={(e) => setAns(e.target.value)} />
        )}
        <div className="spread mt">
          <button className="btn btn-ghost" onClick={() => go(exam.current - 1)} disabled={exam.current === 0}>
            ← Forrige
          </button>
          {exam.current < exam.ids.length - 1 ? (
            <button className="btn" onClick={() => go(exam.current + 1)}>
              Neste →
            </button>
          ) : (
            <button className="btn" onClick={submit}>
              Lever prøven
            </button>
          )}
        </div>
      </div>
      <div className="spread mt">
        <button
          className="btn btn-ghost btn-small"
          onClick={() => {
            if (confirm("Vil du avbryte prøven? Svarene dine blir slettet.")) setExam(null);
          }}
        >
          Avbryt prøven
        </button>
        <button className="btn btn-small" onClick={submit}>
          Lever prøven
        </button>
      </div>
    </div>
  );
}

function Results({ exam, setExam }: { exam: Exam; setExam: (e: Exam | null) => void }) {
  const store = useStore();
  const qs = exam.ids.map((id) => questionById(id)!);
  const auto = qs.filter((q) => kindOf(q) === "numeric" || (kindOf(q) === "short" && exam.grades[q.id] && checkShort(q, exam.answers[q.id] ?? "")));
  const autoIds = new Set(auto.map((q) => q.id));
  const selfQs = qs.filter((q) => !autoIds.has(q.id));
  const assessed = selfQs.filter((q) => exam.grades[q.id]).length;
  const allDone = assessed === selfQs.length;
  const autoPoints = auto.reduce((s, q) => s + GRADE_POINTS[exam.grades[q.id] ?? "feil"], 0);
  const totalPoints = qs.reduce((s, q) => s + (exam.grades[q.id] ? GRADE_POINTS[exam.grades[q.id]] : 0), 0);

  const grade = (q: Question, g: Grade) => {
    recordResult(q.id, GRADE_RATING[g], "prove");
    setExam({ ...exam, grades: { ...exam.grades, [q.id]: g } });
  };

  const perTheme = useMemo(
    () =>
      THEMES.map((t) => {
        const list = qs.filter((q) => q.theme === t.id);
        const graded = list.filter((q) => exam.grades[q.id]);
        return { t, n: list.length, graded: graded.length, pts: graded.reduce((s, q) => s + GRADE_POINTS[exam.grades[q.id]], 0) };
      }).filter((x) => x.n > 0),
    [qs, exam.grades],
  );
  const toRepeat = qs.filter((q) => exam.grades[q.id] && exam.grades[q.id] !== "riktig");

  return (
    <div className="narrow stack">
      <h1>Resultat</h1>
      <div className="card">
        <div className="grid grid-3">
          <div className="stat">
            <b>
              {formatNumber(autoPoints)} / {auto.length}
            </b>
            <span className="small muted">automatisk rettet (regning og korte fakta)</span>
          </div>
          <div className="stat">
            <b>
              {assessed} / {selfQs.length}
            </b>
            <span className="small muted">åpne svar vurdert av deg</span>
          </div>
          <div className="stat">
            {allDone ? (
              <>
                <b>{Math.round((totalPoints / qs.length) * 100)} %</b>
                <span className="small muted">samlet ({formatNumber(totalPoints)} av {qs.length} poeng)</span>
              </>
            ) : (
              <>
                <b style={{ color: "var(--muted)" }}>–</b>
                <span className="small muted">Samlet resultat vises når alle åpne svar er vurdert.</span>
              </>
            )}
          </div>
        </div>
        {!allDone && <p className="feedback neutral mt">Gå gjennom svarene under og vurder hvert åpent svar mot fasiten: Riktig, Delvis eller Feil.</p>}
      </div>

      <div className="card">
        <h2>Resultat per tema</h2>
        <table className="simple">
          <thead>
            <tr>
              <th>Tema</th>
              <th>Spørsmål</th>
              <th>Poeng (vurdert)</th>
            </tr>
          </thead>
          <tbody>
            {perTheme.map((x) => (
              <tr key={x.t.id}>
                <td>
                  {x.t.icon} {x.t.title}
                </td>
                <td>{x.n}</td>
                <td>
                  {formatNumber(x.pts)} / {x.graded}
                  {x.graded < x.n && <span className="small muted"> ({x.n - x.graded} ikke vurdert)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {qs.map((q, i) => {
        const g = exam.grades[q.id];
        const isAuto = autoIds.has(q.id);
        const { answer, keyPoints } = answerFor(q, store.settings);
        const ans = (exam.answers[q.id] ?? "").trim();
        return (
          <div key={q.id} className="card" style={{ borderLeft: `6px solid ${g === "riktig" ? "var(--ok)" : g === "delvis" ? "var(--sun)" : g === "feil" ? "var(--bad)" : "var(--line)"}` }}>
            <div className="spread">
              <span className="eyebrow">Spørsmål {i + 1}</span>
              <ThemeChip theme={q.theme} />
            </div>
            <p className="question-text" style={{ fontSize: "1.15rem" }}>
              {q.original}
            </p>
            <p className="eyebrow">Ditt svar</p>
            <p style={{ whiteSpace: "pre-wrap" }}>
              {ans ? (
                q.numeric ? `${ans} ${q.numeric.unit}` : ans
              ) : (
                <span className="muted">(ikke besvart)</span>
              )}
            </p>
            <div className="answer-box">
              <p className="eyebrow">Fasit</p>
              {q.numeric ? <p>{`${formatNumber(q.numeric.answer)} ${q.numeric.unit}. ${q.numeric.working}`}</p> : <RichText text={answer} />}
            </div>
            {isAuto ? (
              <p className={`feedback ${g === "riktig" ? "ok" : "bad"} mt`}>{g === "riktig" ? "✓ Riktig (rettet automatisk)" : "✗ Feil (rettet automatisk)"}</p>
            ) : (
              <div className="mt">
                {kindOf(q) === "short" && !g && <p className="small muted">Svaret kunne ikke rettes automatisk – sammenlign med fasiten og vurder selv.</p>}
                {kindOf(q) === "open" && (
                  <details>
                    <summary className="small">Nøkkelpunkter et godt svar bør ha</summary>
                    <ul className="small">
                      {keyPoints.map((k) => (
                        <li key={k}>{k}</li>
                      ))}
                    </ul>
                  </details>
                )}
                <div className="row mt" role="group" aria-label={`Vurder svaret på spørsmål ${i + 1}`}>
                  {(["riktig", "delvis", "feil"] as Grade[]).map((x) => (
                    <button key={x} className={`btn btn-small ${g === x ? "" : "btn-ghost"}`} aria-pressed={g === x} onClick={() => grade(q, x)}>
                      {x === "riktig" ? "✓ Riktig" : x === "delvis" ? "◐ Delvis" : "✗ Feil"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {toRepeat.length > 0 && (
        <div className="card">
          <h2>Bør repeteres</h2>
          <p className="small muted">Disse er lagt inn i «Øv på det jeg ikke kan».</p>
          <ul>
            {toRepeat.map((q) => (
              <li key={q.id}>
                <Link href={`/ov/forklar?q=${q.id}`}>{q.original}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="row">
        <button
          className="btn"
          onClick={() => {
            if (allDone || confirm("Du har ikke vurdert alle svarene. Vil du starte en ny prøve likevel?")) setExam(null);
          }}
        >
          Ny prøve
        </button>
        <Link href="/ov/repeter" className="btn btn-ghost">
          Øv på det jeg ikke kan
        </Link>
      </div>
    </div>
  );
}
