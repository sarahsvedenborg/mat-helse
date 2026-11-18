"use client";
import { useEffect, useMemo, useState } from "react";
import { logSession, recordResult } from "@/lib/progress";
import { formatNumber, shuffle } from "@/lib/utils";

// ======================= KORNET =======================

type GrainPart = "skall" | "kime" | "melkjerne";
const GRAIN_INFO: Record<GrainPart, { name: string; share: string; what: string; nutrients: string; color: string }> = {
  skall: {
    name: "Skallet (kli)",
    share: "ca. 15 % av kornet",
    what: "De ytre lagene som beskytter kornet. Siktes bort når man lager fint mel.",
    nutrients: "Kostfiber, B-vitaminer og mineralstoffer (jern, magnesium, sink).",
    color: "#a0662b",
  },
  kime: {
    name: "Kimen",
    share: "ca. 3 % av kornet",
    what: "Spiren – den delen som kan vokse til en ny plante.",
    nutrients: "Fett (umettet), protein, vitamin E, B-vitaminer og mineralstoffer.",
    color: "#e0b43c",
  },
  melkjerne: {
    name: "Melkjernen",
    share: "ca. 80 % av kornet",
    what: "Den største delen. Matlageret til spiren.",
    nutrients: "Mest stivelse (karbohydrat), og en del protein (bl.a. glutenproteinene).",
    color: "#f6e9c8",
  },
};

export function Grain() {
  const [mode, setMode] = useState<"utforsk" | "test">("utforsk");
  const [sel, setSel] = useState<GrainPart | null>(null);
  const [order, setOrder] = useState<GrainPart[]>([]);
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState(0);

  const startTest = () => {
    setMode("test");
    setOrder(shuffle<GrainPart>(["skall", "kime", "melkjerne"]));
    setStep(0);
    setErrors(0);
    setFeedback(null);
    setSel(null);
  };

  const click = (p: GrainPart) => {
    if (mode === "utforsk") {
      setSel(p);
      return;
    }
    if (step >= order.length) return;
    const target = order[step];
    if (p === target) {
      setFeedback({ ok: true, text: `Riktig! Det er ${GRAIN_INFO[p].name.toLowerCase()}.` });
      const next = step + 1;
      setStep(next);
      if (next === order.length) {
        const r = errors === 0 ? "good" : errors <= 1 ? "hard" : "again";
        recordResult("k02", r, "match");
        logSession("visuell", 1, errors === 0 ? 1 : 0);
      }
    } else {
      setErrors((e) => e + 1);
      setFeedback({ ok: false, text: `Nei, det er ${GRAIN_INFO[p].name.toLowerCase()}. Prøv igjen!` });
    }
  };

  const testing = mode === "test";
  const done = testing && step >= order.length;
  const reveal = !testing || done;
  const partProps = (p: GrainPart) => ({
    className: "svg-hit",
    role: "button",
    tabIndex: 0,
    "aria-label": reveal ? GRAIN_INFO[p].name : `Del av kornet`,
    onClick: () => click(p),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        click(p);
      }
    },
  });

  return (
    <div className="grid grid-2">
      <div className="card svg-wrap">
        <svg viewBox="0 0 420 300" role="group" aria-label="Tverrsnitt av et korn">
          {/* Skallet: ytterste lag */}
          <ellipse cx="210" cy="150" rx="160" ry="100" fill={GRAIN_INFO.skall.color} stroke={sel === "skall" ? "#2b6f9e" : "#6e4318"} strokeWidth={sel === "skall" ? 6 : 2} {...partProps("skall")} />
          {/* Melkjernen */}
          <ellipse cx="216" cy="150" rx="140" ry="84" fill={GRAIN_INFO.melkjerne.color} stroke={sel === "melkjerne" ? "#2b6f9e" : "#c9b27a"} strokeWidth={sel === "melkjerne" ? 6 : 1.5} {...partProps("melkjerne")} />
          {/* Stivelseskorn-prikker i melkjernen (dekor, ikke klikkbar) */}
          {[...Array(18)].map((_, i) => (
            <circle key={i} cx={150 + (i % 6) * 32} cy={110 + Math.floor(i / 6) * 38} r="4" fill="#e8d6a6" pointerEvents="none" />
          ))}
          {/* Kimen: nederst i den ene enden */}
          <path d="M 62 168 C 70 205, 110 222, 128 200 C 140 182, 120 150, 96 148 C 78 146, 58 152, 62 168 Z" fill={GRAIN_INFO.kime.color} stroke={sel === "kime" ? "#2b6f9e" : "#9d7a17"} strokeWidth={sel === "kime" ? 6 : 2} {...partProps("kime")} />
          {reveal && (
            <g fontSize="15" fontWeight="700" fill="#1d2a24" pointerEvents="none">
              <line x1="252" y1="59" x2="300" y2="24" stroke="#1d2a24" />
              <circle cx="252" cy="59" r="3" fill="#1d2a24" />
              <text x="304" y="22">Skall (kli)</text>
              <line x1="250" y1="150" x2="300" y2="280" stroke="#1d2a24" />
              <text x="270" y="296">Melkjerne</text>
              <line x1="80" y1="195" x2="40" y2="270" stroke="#1d2a24" />
              <text x="10" y="290">Kime</text>
            </g>
          )}
        </svg>
        <p className="small muted center">Forenklet tverrsnitt. Delene er ikke tegnet i nøyaktig størrelsesforhold.</p>
      </div>
      <div className="stack">
        <div className="row">
          <button className={`btn btn-small ${mode === "utforsk" ? "" : "btn-ghost"}`} onClick={() => { setMode("utforsk"); setFeedback(null); }}>Utforsk</button>
          <button className={`btn btn-small ${mode === "test" ? "" : "btn-ghost"}`} onClick={startTest}>Test deg selv</button>
        </div>
        {mode === "utforsk" && (
          <div className="card" aria-live="polite">
            {sel ? (
              <>
                <h2>{GRAIN_INFO[sel].name}</h2>
                <p className="small muted">{GRAIN_INFO[sel].share}</p>
                <p>{GRAIN_INFO[sel].what}</p>
                <div className="answer-box"><b>Næringsstoffer: </b>{GRAIN_INFO[sel].nutrients}</div>
              </>
            ) : (
              <p className="muted">Klikk på en del av kornet (eller bruk Tab og Enter) for å se hva den heter og hvilke næringsstoffer den har.</p>
            )}
          </div>
        )}
        {testing && (
          <div className="card" aria-live="polite">
            {!done ? (
              <p className="question-text">Klikk på: {GRAIN_INFO[order[step]].name.toLowerCase()}</p>
            ) : (
              <>
                <h2>Ferdig! {errors === 0 ? "🎉 Alt riktig." : `${errors} feil underveis.`}</h2>
                <p className="small">Husk: grovt mel har med skall og kime – der er det meste av fiberet, vitaminene og mineralene.</p>
                <button className="btn btn-small" onClick={startTest}>Én gang til</button>
              </>
            )}
            {feedback && <p className={`feedback ${feedback.ok ? "ok" : "bad"} mt`}>{feedback.text}</p>}
          </div>
        )}
        <div className="card">
          <h3>Oversikt</h3>
          <table className="simple small">
            <thead><tr><th>Del</th><th>Næringsstoffer</th></tr></thead>
            <tbody>
              {(Object.keys(GRAIN_INFO) as GrainPart[]).map((p) => (
                <tr key={p}><td><b>{GRAIN_INFO[p].name}</b></td><td>{reveal ? GRAIN_INFO[p].nutrients : "Skjult under testen"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ======================= TALLERKENMODELLEN =======================

type Sector = "gronn" | "karbo" | "protein";
const SECTOR: Record<Sector, { label: string; size: string; color: string; letter: string }> = {
  gronn: { label: "Grønnsaker, frukt og bær", size: "½ tallerken", color: "#7cc08f", letter: "A" },
  karbo: { label: "Karbohydratrik mat (helst fullkorn)", size: "¼ tallerken", color: "#f1cf7a", letter: "B" },
  protein: { label: "Proteinrik mat", size: "¼ tallerken", color: "#ef9c80", letter: "C" },
};
const PLATE_FOODS: { name: string; s: Sector }[] = [
  { name: "Brokkoli", s: "gronn" },
  { name: "Gulrot", s: "gronn" },
  { name: "Salat og tomat", s: "gronn" },
  { name: "Poteter", s: "karbo" },
  { name: "Fullkornspasta", s: "karbo" },
  { name: "Brun ris", s: "karbo" },
  { name: "Laks", s: "protein" },
  { name: "Kyllingfilet", s: "protein" },
  { name: "Bønner og linser", s: "protein" },
];

export function Plate() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const foods = useMemo(() => (mounted ? shuffle(PLATE_FOODS) : PLATE_FOODS), [mounted]);
  const [placed, setPlaced] = useState<Record<string, Sector>>({});
  const [sel, setSel] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState(0);
  const allDone = Object.keys(placed).length === PLATE_FOODS.length;

  const put = (s: Sector) => {
    if (!sel) {
      setMsg({ ok: false, text: "Velg først en matvare." });
      return;
    }
    const f = PLATE_FOODS.find((x) => x.name === sel)!;
    if (f.s === s) {
      const next = { ...placed, [sel]: s };
      setPlaced(next);
      setMsg({ ok: true, text: `Riktig! ${sel} hører til «${SECTOR[s].label.toLowerCase()}».` });
      setSel(null);
      if (Object.keys(next).length === PLATE_FOODS.length) {
        recordResult("m04", errors === 0 ? "good" : errors <= 2 ? "hard" : "again", "match");
        logSession("visuell", 1, errors === 0 ? 1 : 0);
      }
    } else {
      setErrors((e) => e + 1);
      setMsg({ ok: false, text: `${sel} passer ikke i del ${SECTOR[s].letter}. Prøv en annen del.` });
    }
  };
  const showLabels = allDone;
  const reset = () => { setPlaced({}); setSel(null); setMsg(null); setErrors(0); };

  const sectorProps = (s: Sector) => ({
    className: "svg-hit",
    role: "button",
    tabIndex: 0,
    "aria-label": `Del ${SECTOR[s].letter}, ${SECTOR[s].size}${showLabels ? ": " + SECTOR[s].label : ""}`,
    onClick: () => put(s),
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); put(s); } },
  });

  return (
    <div className="grid grid-2">
      <div className="card svg-wrap">
        <svg viewBox="0 0 360 360" role="group" aria-label="Tallerkenmodellen">
          <circle cx="180" cy="180" r="170" fill="#fff" stroke="#e6dccb" strokeWidth="6" />
          {/* Venstre halvdel */}
          <path d="M180 30 A150 150 0 0 0 180 330 Z" fill={SECTOR.gronn.color} stroke="#fff" strokeWidth="4" {...sectorProps("gronn")} />
          {/* Øvre høyre kvart */}
          <path d="M180 180 L180 30 A150 150 0 0 1 330 180 Z" fill={SECTOR.karbo.color} stroke="#fff" strokeWidth="4" {...sectorProps("karbo")} />
          {/* Nedre høyre kvart */}
          <path d="M180 180 L330 180 A150 150 0 0 1 180 330 Z" fill={SECTOR.protein.color} stroke="#fff" strokeWidth="4" {...sectorProps("protein")} />
          <g pointerEvents="none" fontWeight="800" fill="#1d2a24" textAnchor="middle">
            <text x="105" y="175" fontSize="34">A</text>
            <text x="105" y="200" fontSize="13">½</text>
            <text x="245" y="120" fontSize="30">B</text>
            <text x="245" y="140" fontSize="13">¼</text>
            <text x="245" y="250" fontSize="30">C</text>
            <text x="245" y="270" fontSize="13">¼</text>
          </g>
        </svg>
        <p className="small muted center">Tallerkenmodellen viser hvordan en middagstallerken kan fordeles.</p>
      </div>
      <div className="stack">
        <div className="card">
          <h3>Legg maten på riktig del av tallerkenen</h3>
          <p className="small muted">Velg en matvare, og klikk så på del A, B eller C (eller bruk knappene).</p>
          <div className="row" role="group" aria-label="Matvarer">
            {foods.filter((f) => !placed[f.name]).map((f) => (
              <button key={f.name} className={`token ${sel === f.name ? "selected" : ""}`} aria-pressed={sel === f.name} onClick={() => setSel(sel === f.name ? null : f.name)}>
                {f.name}
              </button>
            ))}
            {allDone && <span className="muted small">Alle matvarer er plassert!</span>}
          </div>
          <div className="row mt">
            {(Object.keys(SECTOR) as Sector[]).map((s) => (
              <button key={s} className="btn btn-ghost btn-small" disabled={!sel} onClick={() => put(s)}>Del {SECTOR[s].letter} ({SECTOR[s].size})</button>
            ))}
          </div>
          {msg && <p className={`feedback ${msg.ok ? "ok" : "bad"} mt`} aria-live="polite">{msg.text}</p>}
        </div>
        <div className="card">
          <h3>Plassert</h3>
          {(Object.keys(SECTOR) as Sector[]).map((s) => (
            <p key={s} className="small">
              <b>{SECTOR[s].letter}{showLabels ? ` – ${SECTOR[s].label}` : ""}:</b>{" "}
              {Object.entries(placed).filter(([, v]) => v === s).map(([k]) => k).join(", ") || <span className="muted">–</span>}
            </p>
          ))}
          {allDone && (
            <div className="answer-box mt pop">
              <b>Tallerkenmodellen:</b> ½ grønnsaker (og frukt/bær), ¼ karbohydratrik mat som poteter, fullkornspasta eller ris, og ¼ proteinrik mat som fisk, kylling, egg eller belgvekster. {errors === 0 ? "Alt riktig! 🎉" : `Du hadde ${errors} feil underveis.`}
              <div className="mt"><button className="btn btn-small" onClick={reset}>Start på nytt</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================= NÆRINGSSTOFFER I MAT =======================

type Nut = "Protein" | "Jern" | "Kalsium" | "Vitamin D" | "Vitamin C" | "Kostfiber";
const NUTS: Nut[] = ["Protein", "Jern", "Kalsium", "Vitamin D", "Vitamin C", "Kostfiber"];
const NUT_Q: Record<Nut, string> = { Protein: "n09", Jern: "n15", Kalsium: "n14", "Vitamin D": "n13", "Vitamin C": "n22", Kostfiber: "n07" };
/** main = viktig kilde (må velges), also = bidrar også (godtas, men kreves ikke). */
const FOODS: { name: string; ico: string; main: Nut[]; also: Nut[] }[] = [
  { name: "Laks", ico: "🐟", main: ["Protein", "Vitamin D"], also: [] },
  { name: "Leverpostei", ico: "🥪", main: ["Jern"], also: ["Protein"] },
  { name: "Grovbrød", ico: "🍞", main: ["Kostfiber"], also: ["Jern", "Protein"] },
  { name: "Appelsin", ico: "🍊", main: ["Vitamin C"], also: ["Kostfiber"] },
  { name: "Ost", ico: "🧀", main: ["Kalsium", "Protein"], also: [] },
  { name: "Melk", ico: "🥛", main: ["Kalsium", "Protein"], also: ["Vitamin D"] },
  { name: "Linser", ico: "🫘", main: ["Protein", "Kostfiber", "Jern"], also: [] },
  { name: "Havregryn", ico: "🥣", main: ["Kostfiber"], also: ["Jern", "Protein"] },
  { name: "Egg", ico: "🥚", main: ["Protein"], also: ["Vitamin D", "Jern"] },
  { name: "Kjøttdeig av storfe", ico: "🥩", main: ["Protein", "Jern"], also: [] },
  { name: "Paprika", ico: "🫑", main: ["Vitamin C"], also: ["Kostfiber"] },
  { name: "Makrell", ico: "🐠", main: ["Protein", "Vitamin D"], also: [] },
  { name: "Brokkoli", ico: "🥦", main: ["Vitamin C", "Kostfiber"], also: ["Kalsium", "Jern"] },
  { name: "Yoghurt", ico: "🍶", main: ["Kalsium", "Protein"], also: [] },
];

export function Nutrients() {
  const [nut, setNut] = useState<Nut>("Jern");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const toggle = (n: string) => {
    if (checked) return;
    const s = new Set(picked);
    if (s.has(n)) s.delete(n);
    else s.add(n);
    setPicked(s);
  };
  const required = FOODS.filter((f) => f.main.includes(nut));
  const accepted = (f: (typeof FOODS)[number]) => f.main.includes(nut) || f.also.includes(nut);
  const wrong = FOODS.filter((f) => picked.has(f.name) && !accepted(f));
  const missed = required.filter((f) => !picked.has(f.name));
  const check = () => {
    setChecked(true);
    const r = wrong.length === 0 && missed.length === 0 ? "good" : wrong.length + missed.length <= 1 ? "hard" : "again";
    recordResult(NUT_Q[nut], r, "match");
    logSession("visuell", 1, r === "good" ? 1 : 0);
  };
  const choose = (n: Nut) => { setNut(n); setPicked(new Set()); setChecked(false); };

  return (
    <div className="card">
      <h2>Hvilke matvarer er gode kilder til …</h2>
      <div className="tabs" role="radiogroup" aria-label="Velg næringsstoff">
        {NUTS.map((n) => (
          <button key={n} role="radio" aria-checked={nut === n} aria-selected={nut === n} onClick={() => choose(n)}>{n}</button>
        ))}
      </div>
      <p className="question-text mt">Velg alle gode kilder til {nut.toLowerCase().startsWith("vitamin") ? nut : nut.toLowerCase()}.</p>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
        {FOODS.map((f) => {
          let cls = picked.has(f.name) ? "selected" : "";
          let note = "";
          if (checked) {
            if (f.main.includes(nut)) { cls = picked.has(f.name) ? "done" : "shake"; note = picked.has(f.name) ? "✓ God kilde" : "Glemt – god kilde"; }
            else if (f.also.includes(nut)) { cls = picked.has(f.name) ? "done" : ""; note = "Bidrar litt"; }
            else if (picked.has(f.name)) { cls = "shake"; note = "✗ Ikke en god kilde"; }
          }
          return (
            <button key={f.name} className={`pick ${cls}`} aria-pressed={picked.has(f.name)} onClick={() => toggle(f.name)} style={{ textAlign: "center" }}>
              <span style={{ fontSize: "1.8rem", display: "block" }} aria-hidden>{f.ico}</span>
              {f.name}
              {note && <span className="small" style={{ display: "block", fontWeight: 500 }}>{note}</span>}
            </button>
          );
        })}
      </div>
      <div className="row mt">
        {!checked ? (
          <button className="btn" onClick={check} disabled={picked.size === 0}>Sjekk</button>
        ) : (
          <>
            <p className={`feedback ${wrong.length === 0 && missed.length === 0 ? "ok" : "neutral"}`} aria-live="polite" style={{ flex: 1 }}>
              {wrong.length === 0 && missed.length === 0 ? "Helt riktig! 🎉 " : `${missed.length} glemt, ${wrong.length} feil. `}
              Gode kilder til {nut.toLowerCase()}: {required.map((f) => f.name).join(", ")}.
            </p>
            <button className="btn btn-ghost" onClick={() => choose(NUTS[(NUTS.indexOf(nut) + 1) % NUTS.length])}>Neste næringsstoff →</button>
          </>
        )}
      </div>
      <p className="small muted mt">«Bidrar litt» betyr at matvaren inneholder noe av næringsstoffet, men ikke er blant de viktigste kildene.</p>
    </div>
  );
}

// ======================= MÅLEENHETER =======================

const TARGETS = [
  { label: "¾ l", dl: 7.5, q: "e10" },
  { label: "½ l", dl: 5, q: "e11" },
  { label: "600 ml", dl: 6, q: "e13" },
  { label: "0,5 dl", dl: 0.5, q: "e14" },
  { label: "250 ml", dl: 2.5, q: null },
  { label: "1 l", dl: 10, q: null },
  { label: "30 cl", dl: 3, q: null },
  { label: "150 ml", dl: 1.5, q: null },
];

export function Measures() {
  const [dl, setDl] = useState(2);
  const [t, setT] = useState(0);
  const [result, setResult] = useState<null | boolean>(null);
  const [tries, setTries] = useState(0);
  const target = TARGETS[t];
  const ml = Math.round(dl * 100);
  const check = () => {
    const ok = Math.abs(dl - target.dl) < 1e-9;
    setResult(ok);
    setTries((x) => x + 1);
    if (ok && target.q) recordResult(target.q, tries === 0 ? "good" : "hard", "numeric");
    if (ok) logSession("visuell", 1, tries === 0 ? 1 : 0);
  };
  const next = () => { setT((x) => (x + 1) % TARGETS.length); setResult(null); setTries(0); };
  const fillH = (dl / 10) * 220;

  return (
    <div className="grid grid-2">
      <div className="card">
        <div className="svg-wrap">
          <svg viewBox="0 0 260 300" role="img" aria-label={`Målebeger fylt med ${formatNumber(dl)} desiliter`}>
            <rect x="60" y={270 - fillH} width="130" height={fillH} fill="#9fd0ec" />
            <path d="M60 30 L60 270 L190 270 L190 30" fill="none" stroke="#2b6f9e" strokeWidth="5" strokeLinejoin="round" />
            <path d="M190 80 Q225 90 225 150 Q225 210 190 220" fill="none" stroke="#2b6f9e" strokeWidth="6" />
            {[...Array(11)].map((_, i) => (
              <g key={i}>
                <line x1="60" x2={i % 5 === 0 ? 95 : 82} y1={270 - i * 22} y2={270 - i * 22} stroke="#1d2a24" strokeWidth="2" />
                <text x="20" y={274 - i * 22} fontSize="12" fill="#1d2a24">{i} dl</text>
              </g>
            ))}
            {[...Array(10)].map((_, i) => (
              <line key={i} x1="60" x2="72" y1={270 - i * 22 - 11} y2={270 - i * 22 - 11} stroke="#1d2a24" strokeWidth="1" />
            ))}
          </svg>
        </div>
        <label htmlFor="slider" className="small">Fyll målebegeret (0–10 dl, steg på 0,5 dl)</label>
        <input id="slider" type="range" min={0} max={10} step={0.5} value={dl} onChange={(e) => { setDl(Number(e.target.value)); setResult(null); }} style={{ width: "100%", minHeight: 44 }} aria-valuetext={`${formatNumber(dl)} desiliter`} />
        <div className="grid mt" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }} aria-live="polite">
          {[
            [formatNumber(dl / 10), "l"],
            [formatNumber(dl), "dl"],
            [formatNumber(dl * 10), "cl"],
            [String(ml), "ml"],
          ].map(([v, u]) => (
            <div key={u} className="stat center" style={{ padding: 8 }}>
              <b style={{ fontSize: "1.3rem" }}>{v}</b>
              <span className="small muted">{u}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="stack">
        <div className="card">
          <p className="eyebrow">Oppgave {t + 1} av {TARGETS.length}</p>
          <p className="question-text">Fyll målebegeret med {target.label}.</p>
          <div className="row">
            <button className="btn" onClick={check}>Sjekk</button>
            <button className="btn btn-ghost" onClick={next}>Neste oppgave</button>
          </div>
          {result !== null && (
            <div className={`feedback ${result ? "ok" : "bad"} mt pop`} aria-live="polite">
              {result ? `Riktig! ${target.label} = ${formatNumber(target.dl)} dl = ${Math.round(target.dl * 100)} ml.` : `Ikke helt – nå har du ${formatNumber(dl)} dl. Prøv igjen!`}
            </div>
          )}
        </div>
        <div className="card">
          <h3>Måletrappen</h3>
          <p className="small muted">Ett steg ned = gang med 10. Ett steg opp = del på 10.</p>
          <div className="row" style={{ alignItems: "flex-end", gap: 4 }} aria-label="l, dl, cl, ml – hvert steg er ganger 10">
            {["l", "dl", "cl", "ml"].map((u, i) => (
              <div key={u} style={{ textAlign: "center" }}>
                <div className="stat" style={{ padding: "8px 14px", marginTop: i * 14 }}><b style={{ fontSize: "1.2rem" }}>{u}</b></div>
                {i < 3 && <span className="small muted">×10 ↘</span>}
              </div>
            ))}
          </div>
          <table className="simple small mt">
            <tbody>
              <tr><td>1 l</td><td>= 10 dl = 100 cl = 1000 ml</td></tr>
              <tr><td>1 kg</td><td>= 10 hg = 1000 g</td></tr>
              <tr><td>1 hg</td><td>= 100 g</td></tr>
              <tr><td>1 ss / 1 ts / 1 krm</td><td>= 15 ml / 5 ml / 1 ml</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
