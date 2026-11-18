"use client";
import Link from "next/link";
import { MATCH_SETS, questionsByTheme, themeById } from "@/lib/data";
import { statusOf, themeProgress, useStore } from "@/lib/progress";
import { Legend, StackedBar, StatusChip } from "@/components/ui";

export default function Client({ id }: { id: string }) {
  const t = themeById(id);
  const store = useStore();
  const p = themeProgress(store, id);
  const qs = questionsByTheme(id);
  const sets = MATCH_SETS.filter((m) => m.theme === id);
  const modes = [
    { href: `/ov/huskekort?tema=${id}`, label: "🃏 Huskekort" },
    { href: `/ov/quiz?tema=${id}`, label: id === "maal" ? "🧮 Regneoppgaver og flervalg" : "✅ Flervalg" },
    { href: `/ov/forklar?tema=${id}`, label: "✍️ Forklar med egne ord" },
    ...(sets.length ? [{ href: `/ov/sorter?tema=${id}`, label: "🧩 Koble og sorter" }] : []),
    ...(["korn", "maaltider", "maal", "naering"].includes(id) ? [{ href: "/ov/visuell", label: "🔬 Visuell læring" }] : []),
  ];
  return (
    <div className="stack">
      <Link href="/" className="small">← Til forsiden</Link>
      <div className="card" style={{ borderTop: `6px solid ${t.color}` }}>
        <div className="row">
          <span className="tile-ico" style={{ background: t.color + "1c" }} aria-hidden>{t.icon}</span>
          <div>
            <p className="eyebrow">Tema {t.number}</p>
            <h1 style={{ margin: 0 }}>{t.title}</h1>
          </div>
        </div>
        <div className="mt">
          <StackedBar counts={p.counts} total={p.total} large />
          <div className="spread mt"><Legend /><b>{p.percent} %</b></div>
        </div>
        <div className="row mt">
          {modes.map((m) => <Link key={m.href} className="btn btn-ghost btn-small" href={m.href}>{m.label}</Link>)}
        </div>
      </div>
      <div className="card">
        <h2>Spørsmålene i temaet ({qs.length})</h2>
        <ol style={{ paddingLeft: "1.3em" }}>
          {qs.map((q) => (
            <li key={q.id} style={{ marginBottom: 10 }}>
              <div className="spread" style={{ alignItems: "flex-start" }}>
                <Link href={`/ov/forklar?q=${q.id}`} style={{ flex: "1 1 300px" }}>{q.original}</Link>
                <StatusChip status={statusOf(store.records[q.id])} />
              </div>
            </li>
          ))}
        </ol>
        <p className="small muted">Klikk på et spørsmål for å øve på det som åpent spørsmål. Se fasit for alle under <Link href={`/pensum?tema=${id}`}>Pensum</Link>.</p>
      </div>
    </div>
  );
}
