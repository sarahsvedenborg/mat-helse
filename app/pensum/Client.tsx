"use client";
import Link from "next/link";
import { MATCH_SETS, QUESTIONS, THEMES } from "@/lib/data";
import { statusOf, useStore } from "@/lib/progress";
import { answerFor, formatNumber } from "@/lib/utils";
import ThemePicker from "@/components/ThemePicker";
import { RichText, StatusChip } from "@/components/ui";
import type { Mode } from "@/lib/types";

const MODE_LABEL: Record<Mode, string> = {
  huskekort: "Huskekort",
  quiz: "Flervalg/regning",
  sorter: "Koble og sorter",
  visuell: "Visuell",
  forklar: "Forklar",
  prove: "Prøve",
};

export default function Client({ tema }: { tema: string | null }) {
  const store = useStore();
  const themes = THEMES.filter((t) => !tema || t.id === tema);
  return (
    <>
      <h1>📚 Pensum og fasit</h1>
      <p className="muted">
        Oversikt over alle {QUESTIONS.length} originalspørsmålene fra læreren, med fasit, forklaring, øvingsoppgaver og hvilke moduser de kan øves i.
        Tips: Prøv å svare selv før du åpner fasiten!
      </p>
      <ThemePicker base="/pensum" current={tema} />
      {themes.map((t) => (
        <section key={t.id} className="mt-lg" aria-labelledby={`h-${t.id}`}>
          <h2 id={`h-${t.id}`}>{t.icon} Tema {t.number}: {t.title}</h2>
          <div className="stack">
            {QUESTIONS.filter((q) => q.theme === t.id).map((q) => {
              const { answer } = answerFor(q, store.settings);
              const sets = MATCH_SETS.filter((m) => m.questionIds.includes(q.id));
              return (
                <details key={q.id} className="card">
                  <summary>
                    <span className="row" style={{ display: "inline-flex", width: "calc(100% - 24px)", justifyContent: "space-between" }}>
                      <span>{q.number}. {q.original}</span>
                      <StatusChip status={statusOf(store.records[q.id])} />
                    </span>
                  </summary>
                  <div className="stack mt">
                    <div className="answer-box">
                      <p className="eyebrow">Fasit</p>
                      {q.numeric ? <p>{formatNumber(q.numeric.answer)} {q.numeric.unit}. {q.numeric.working}</p> : <RichText text={answer} />}
                    </div>
                    <div className="explain"><b>💡 </b>{q.explanation}</div>
                    {q.precise && <div className="precise small"><b>Mer presist: </b>{q.precise}</div>}
                    {q.variants?.length ? (
                      <div>
                        <b className="small">Øvingsoppgaver knyttet til spørsmålet ({q.variants.length}):</b>
                        <ul className="small">
                          {q.variants.map((v) => (
                            <li key={v.id}>
                              {v.prompt}{" "}
                              <span className="muted">
                                ({v.kind === "mcq" ? `flervalg – svar: ${v.correct}` : v.kind === "numeric" ? `regning – svar: ${formatNumber(v.answer)} ${v.unit}` : `huskekort – ${v.answer}`})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {sets.length > 0 && (
                      <p className="small">
                        <b>Koble/sorter: </b>
                        {sets.map((s, i) => <span key={s.id}>{i > 0 && ", "}<Link href={`/ov/sorter?sett=${s.id}`}>{s.title}</Link></span>)}
                      </p>
                    )}
                    <p className="small"><b>Øvingsmoduser: </b>{q.modes.map((m) => MODE_LABEL[m]).join(" · ")} · <b>Vanskelighet:</b> {"●".repeat(q.difficulty)}{"○".repeat(3 - q.difficulty)}</p>
                    <div><Link className="btn btn-small" href={`/ov/forklar?q=${q.id}`}>Øv som åpent spørsmål</Link></div>
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
