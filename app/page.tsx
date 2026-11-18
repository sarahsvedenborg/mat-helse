"use client";
import Link from "next/link";
import { THEMES, QUESTIONS } from "@/lib/data";
import { needsReview, themeProgress, useStore } from "@/lib/progress";
import { Legend, StackedBar } from "@/components/ui";
import { MODES } from "@/components/modes";

function greeting(name: string) {
  const h = new Date().getHours();
  const g = h < 10 ? "God morgen" : h < 17 ? "Hei" : "God kveld";
  return name ? `${g}, ${name}!` : `${g}!`;
}

export default function Home() {
  const store = useStore();
  const total = themeProgress(store);
  const review = store.ready ? needsReview(store) : [];
  const started = Object.keys(store.records).length > 0;

  let rec: { title: string; text: string; href: string; cta: string };
  if (!started) {
    rec = {
      title: "Kom i gang",
      text: "Start med huskekort fra «Næringsstoffer og kroppen» – det største temaet på prøven.",
      href: "/ov/huskekort?tema=naering",
      cta: "Start første økt",
    };
  } else if (review.length > 0) {
    rec = {
      title: "Øv på det du ikke kan",
      text: `${review.length} spørsmål venter på repetisjon. Når du øver på dem nå, husker du dem bedre på prøven.`,
      href: "/ov/repeter",
      cta: "Start repetisjon",
    };
  } else {
    const weakest = [...THEMES].sort((a, b) => themeProgress(store, a.id).percent - themeProgress(store, b.id).percent)[0];
    const p = themeProgress(store, weakest.id);
    const href = p.counts["ikke-ovd"] > 0 ? `/ov/huskekort?tema=${weakest.id}` : `/ov/forklar?tema=${weakest.id}`;
    rec = {
      title: `${weakest.icon} ${weakest.title}`,
      text: p.counts["ikke-ovd"] > 0 ? `Du har ${p.counts["ikke-ovd"]} spørsmål her som du ikke har øvd på ennå.` : "Øv på å forklare med egne ord – det er det som gir best uttelling på prøven.",
      href,
      cta: "Øv på dette temaet",
    };
  }

  return (
    <div className="stack">
      <section className="hero fade-in" aria-labelledby="velkommen">
        <span className="hero-deco" aria-hidden>
          🥗
        </span>
        <p className="eyebrow" style={{ color: "#cfe8da" }}>
          Teoriprøve i mat og helse
        </p>
        <h1 id="velkommen">{greeting(store.settings.name)}</h1>
        <p style={{ maxWidth: 520, opacity: 0.92 }}>
          {started ? "Fint at du er tilbake. Litt øving hver dag gir best resultat." : "Her øver du på alle spørsmålene læreren har gitt dere – på mange forskjellige måter."}
        </p>
        <div className="spread mt" style={{ alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 260px" }}>
            <div className="spread small" style={{ marginBottom: 6 }}>
              <span>Fremgang i hele pensum</span>
              <b>{total.percent} %</b>
            </div>
            <div className="bar bar-lg" role="progressbar" aria-valuenow={total.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Total fremgang">
              <span style={{ width: `${total.percent}%`, background: "#fff" }} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        <div className="stat">
          <b>{total.counts.mestret}</b>
          <span className="muted">av {QUESTIONS.length} spørsmål mestret</span>
        </div>
        <div className="stat">
          <b style={{ color: "var(--coral)" }}>{review.length}</b>
          <span className="muted">trenger repetisjon</span>
        </div>
        <div className="stat">
          <b style={{ color: "var(--ink-soft)" }}>{total.counts["ikke-ovd"]}</b>
          <span className="muted">ikke øvd ennå</span>
        </div>
      </div>

      <section className="card" aria-labelledby="anbefalt" style={{ borderLeft: "6px solid var(--sun)" }}>
        <p className="eyebrow">Anbefalt neste økt</p>
        <h2 id="anbefalt">{rec.title}</h2>
        <p className="muted">{rec.text}</p>
        <Link className="btn" href={rec.href}>
          {rec.cta} →
        </Link>
      </section>

      <section aria-labelledby="temaer" className="mt-lg">
        <div className="spread">
          <h2 id="temaer">Temaer</h2>
          <Legend />
        </div>
        <div className="grid grid-3 mt">
          {THEMES.map((t) => {
            const p = themeProgress(store, t.id);
            return (
              <Link key={t.id} href={`/tema/${t.id}`} className="tile">
                <div className="spread">
                  <span className="tile-ico" style={{ background: t.color + "1c" }} aria-hidden>
                    {t.icon}
                  </span>
                  <span className="small muted">{p.total} spørsmål</span>
                </div>
                <b>
                  {t.number}. {t.title}
                </b>
                <StackedBar counts={p.counts} total={p.total} />
                <span className="small muted">
                  {p.counts.mestret} mestret · {p.percent} %
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="moduser" className="mt-lg">
        <h2 id="moduser">Øvingsmoduser</h2>
        <div className="grid grid-3 mt">
          {MODES.map((m) => (
            <Link key={m.href} href={m.href} className="tile">
              <span className="tile-ico" style={{ background: m.bg }} aria-hidden>
                {m.icon}
              </span>
              <b>{m.title}</b>
              <span className="small muted">{m.text}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
