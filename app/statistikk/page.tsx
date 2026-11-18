"use client";
import Link from "next/link";
import { QUESTIONS, THEMES, themeById } from "@/lib/data";
import { dayKey, needsReview, statusOf, themeProgress, useStore, STATUS_LABEL } from "@/lib/progress";
import { Legend, StackedBar, StatusChip } from "@/components/ui";

const MODE_NAMES: Record<string, string> = {
  huskekort: "Huskekort", quiz: "Flervalg og regning", repeter: "Repetisjon", sorter: "Koble og sorter", visuell: "Visuell læring", forklar: "Forklar med egne ord", prove: "Prøve",
};

export default function Page() {
  const store = useStore();
  if (!store.ready) return <p className="muted">Laster …</p>;
  const total = themeProgress(store);
  const reviewed = QUESTIONS.filter((q) => store.records[q.id]).length;
  const review = needsReview(store);
  const days = [...Array(14)].map((_, i) => dayKey(Date.now() - (13 - i) * 86400000));
  // Mestret-kurve: bruk siste kjente verdi bakover i tid
  let last = 0;
  const series = days.map((d) => {
    const v = store.daily[d];
    if (v) last = v.mastered;
    return { d, reviewed: v?.reviewed ?? 0, mastered: v ? v.mastered : last };
  });
  const maxRev = Math.max(5, ...series.map((s) => s.reviewed));
  const W = 560, H = 180, bw = W / 14;
  const byMode = Object.entries(
    store.sessions.reduce<Record<string, number>>((a, s) => ({ ...a, [s.mode]: (a[s.mode] ?? 0) + 1 }), {}),
  );

  return (
    <div className="stack">
      <h1>📈 Din fremgang</h1>
      <div className="grid grid-3">
        <div className="stat"><b>{reviewed}</b><span className="muted">av {QUESTIONS.length} spørsmål gjennomgått</span></div>
        <div className="stat"><b style={{ color: "var(--ok)" }}>{total.counts.mestret}</b><span className="muted">mestret</span></div>
        <div className="stat"><b style={{ color: "var(--coral)" }}>{review.length}</b><span className="muted">trenger repetisjon</span></div>
        <div className="stat"><b>{store.sessions.length}</b><span className="muted">øvingsøkter fullført</span></div>
      </div>

      <div className="card">
        <h2>Utvikling siste 14 dager</h2>
        <svg viewBox={`0 0 ${W} ${H + 30}`} style={{ width: "100%", height: "auto" }} role="img" aria-label={`Søyler viser antall svar per dag, linjen viser antall mestrede spørsmål. I dag: ${series[13].reviewed} svar, ${series[13].mastered} mestret.`}>
          {series.map((s, i) => {
            const h = (s.reviewed / maxRev) * (H - 20);
            return (
              <g key={s.d}>
                <rect x={i * bw + 6} y={H - h} width={bw - 12} height={h} rx="4" fill="#b9dfc9" />
                <text x={i * bw + bw / 2} y={H + 18} fontSize="11" textAnchor="middle" fill="#6b766f">{s.d.slice(8)}.</text>
              </g>
            );
          })}
          <polyline fill="none" stroke="#1f5c42" strokeWidth="3" points={series.map((s, i) => `${i * bw + bw / 2},${H - (s.mastered / QUESTIONS.length) * (H - 20)}`).join(" ")} />
          {series.map((s, i) => <circle key={s.d} cx={i * bw + bw / 2} cy={H - (s.mastered / QUESTIONS.length) * (H - 20)} r="3.5" fill="#1f5c42" />)}
        </svg>
        <p className="small muted">Lysegrønne søyler: antall svar per dag. Mørk linje: antall mestrede spørsmål.</p>
      </div>

      <div className="card">
        <div className="spread"><h2>Mestring per tema</h2><Legend /></div>
        <div className="stack mt">
          {THEMES.map((t) => {
            const p = themeProgress(store, t.id);
            return (
              <div key={t.id}>
                <div className="spread small"><Link href={`/tema/${t.id}`}>{t.icon} {t.title}</Link><span>{p.counts.mestret} / {p.total} mestret</span></div>
                <StackedBar counts={p.counts} total={p.total} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h2>Spørsmål som trenger repetisjon</h2>
        {review.length === 0 ? <p className="muted">Ingen akkurat nå. 🎉</p> : (
          <>
            <ul>
              {review.slice(0, 25).map((q) => (
                <li key={q.id} style={{ marginBottom: 6 }}>
                  <span className="small muted">{themeById(q.theme).icon} </span>
                  <Link href={`/ov/forklar?q=${q.id}`}>{q.original}</Link> <StatusChip status={statusOf(store.records[q.id])} />
                </li>
              ))}
            </ul>
            <Link className="btn" href="/ov/repeter">Øv på disse nå</Link>
          </>
        )}
      </div>

      {byMode.length > 0 && (
        <div className="card">
          <h2>Økter per modus</h2>
          <table className="simple"><tbody>{byMode.map(([m, n]) => <tr key={m}><td>{MODE_NAMES[m] ?? m}</td><td>{n}</td></tr>)}</tbody></table>
        </div>
      )}

      <div className="card">
        <h2>Slik fungerer mestring</h2>
        <ul className="small">
          <li><b>{STATUS_LABEL["ikke-ovd"]}:</b> Du har ikke øvd på spørsmålet ennå.</li>
          <li><b>{STATUS_LABEL.trenger}:</b> Du svarte feil eller «Kunne ikke» sist. Det kommer tilbake snart.</li>
          <li><b>{STATUS_LABEL["paa-vei"]}:</b> Du er på god vei. «Litt usikker» kommer tilbake neste dag.</li>
          <li><b>{STATUS_LABEL.mestret}:</b> Du har kunnet det godt flere ganger, med minst noen timers mellomrom. Det repeteres med stadig lengre intervaller.</li>
        </ul>
        <p className="small muted">Ett riktig flervalgssvar alene gjør ikke et spørsmål mestret.</p>
      </div>
      <Link href="/innstillinger" className="btn btn-ghost">⚙️ Innstillinger og nullstilling</Link>
    </div>
  );
}
