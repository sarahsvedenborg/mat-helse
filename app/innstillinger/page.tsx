"use client";
import { useState } from "react";
import { resetProgress, updateSettings, useStore } from "@/lib/progress";
import { canSpeak, speak } from "@/lib/speech";
import { validateData, dataSummary } from "@/lib/validate";

export default function Page() {
  const store = useStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const [done, setDone] = useState(false);
  const [check, setCheck] = useState<string[] | null>(null);
  if (!store.ready) return <p className="muted">Laster …</p>;
  const s = store.settings;
  return (
    <div className="narrow stack">
      <h1>⚙️ Innstillinger</h1>
      <div className="card stack">
        <label htmlFor="name"><b>Hva vil du kalles?</b> <span className="small muted">(valgfritt, lagres bare på denne enheten)</span></label>
        <input id="name" className="input" value={s.name} maxLength={30} onChange={(e) => updateSettings({ name: e.target.value })} />
      </div>
      <div className="card stack">
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend><b>Hvilken versjon av kostrådene bruker læreren?</b></legend>
          <p className="small muted">Helsedirektoratet fornyet kostrådene i 2024. Hvis læreren bruker eldre materiell, kan du bytte til lærerens versjon (den kan redigeres i filen lib/data/index.ts).</p>
          <label className="check-item"><input type="radio" name="kostrad" checked={s.kostrad === "2024"} onChange={() => updateSettings({ kostrad: "2024" })} /> Helsedirektoratets kostråd (2024)</label>
          <label className="check-item mt"><input type="radio" name="kostrad" checked={s.kostrad === "laerer"} onChange={() => updateSettings({ kostrad: "laerer" })} /> Lærerens versjon</label>
        </fieldset>
      </div>
      {canSpeak() && (
        <div className="card stack">
          <label htmlFor="rate"><b>Hastighet på opplesning:</b> {s.speechRate.toFixed(2).replace(".", ",")}</label>
          <input id="rate" type="range" min={0.6} max={1.3} step={0.05} value={s.speechRate} onChange={(e) => updateSettings({ speechRate: Number(e.target.value) })} />
          <div><button className="btn btn-ghost btn-small" onClick={() => speak("Hei! Slik høres opplesningen ut.", s.speechRate)}>🔊 Test opplesning</button></div>
        </div>
      )}
      <div className="card stack">
        <h2>Kontroll av pensumdata</h2>
        <p className="small muted">Sjekker at alle originalspørsmål finnes, har fasit, og at regneoppgavene er riktige.</p>
        <div><button className="btn btn-ghost btn-small" onClick={() => setCheck(validateData())}>Kjør kontroll</button></div>
        {check && (check.length === 0
          ? <p className="feedback ok">✓ Alt i orden. {(() => { const d = dataSummary(); return `${d.originals} originalspørsmål, ${d.variants} øvingsvarianter, ${d.matchSets} koble/sorter-oppgaver.`; })()}</p>
          : <div className="feedback bad"><ul>{check.map((e) => <li key={e}>{e}</li>)}</ul></div>)}
      </div>
      <div className="card stack" style={{ borderColor: "#e7a597" }}>
        <h2>Nullstill fremgang</h2>
        <p className="small muted">Sletter all fremgang og statistikk på denne enheten. Dette kan ikke angres.</p>
        {done && <p className="feedback ok" aria-live="polite">Fremgangen er nullstilt.</p>}
        {!confirmReset ? (
          <div><button className="btn btn-danger" onClick={() => { setConfirmReset(true); setDone(false); }}>Nullstill fremgang …</button></div>
        ) : (
          <div className="warn stack" role="alertdialog" aria-labelledby="reset-q">
            <p id="reset-q"><b>Er du helt sikker?</b> All fremgang blir slettet.</p>
            <div className="row">
              <button className="btn btn-danger" onClick={() => { resetProgress(); setConfirmReset(false); setDone(true); }}>Ja, slett alt</button>
              <button className="btn btn-ghost" autoFocus onClick={() => setConfirmReset(false)}>Avbryt</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
