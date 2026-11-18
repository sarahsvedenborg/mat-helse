"use client";
import { useState } from "react";
import { Grain, Plate, Nutrients, Measures } from "@/components/visuals";

const TABS = [
  { id: "korn", label: "🌾 Kornet" },
  { id: "tallerken", label: "🍽️ Tallerkenmodellen" },
  { id: "naering", label: "🥦 Næringsstoffer i mat" },
  { id: "maal", label: "🥛 Måleenheter" },
];

export default function Page() {
  const [tab, setTab] = useState("korn");
  return (
    <>
      <h1>🔬 Visuell læring</h1>
      <p className="muted">Lær med bilder og illustrasjoner. Alt kan styres med mus, berøring eller tastatur.</p>
      <div className="tabs" role="tablist" aria-label="Velg illustrasjon">
        {TABS.map((t) => (
          <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`panel-${t.id}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "korn" && <Grain />}
        {tab === "tallerken" && <Plate />}
        {tab === "naering" && <Nutrients />}
        {tab === "maal" && <Measures />}
      </div>
    </>
  );
}
