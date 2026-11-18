"use client";
import Link from "next/link";
import { MATCH_SETS, themeById } from "@/lib/data";
import ThemePicker from "@/components/ThemePicker";
import { MatchGame } from "@/components/MatchGame";

export default function Client({ tema, sett }: { tema: string | null; sett: string | null }) {
  const set = sett ? MATCH_SETS.find((m) => m.id === sett) : null;
  if (set)
    return (
      <div className="narrow">
        <Link href="/ov/sorter" className="small">← Alle koble- og sorteringsoppgaver</Link>
        <MatchGame key={set.id} set={set} />
      </div>
    );
  const sets = MATCH_SETS.filter((m) => !tema || m.theme === tema);
  return (
    <>
      <h1>🧩 Koble og sorter</h1>
      <p className="muted">Klikk på et element, og så på stedet det hører hjemme. Alt kan gjøres med tastaturet (Tab og Enter).</p>
      <ThemePicker base="/ov/sorter" current={tema} />
      <div className="grid grid-3">
        {sets.map((m) => {
          const t = themeById(m.theme);
          return (
            <Link key={m.id} href={`/ov/sorter?sett=${m.id}`} className="tile">
              <span className="tile-ico" style={{ background: t.color + "1c" }} aria-hidden>{t.icon}</span>
              <b>{m.title}</b>
              <span className="small muted">{m.kind === "match" ? "Koble sammen" : m.kind === "sort" ? "Sorter i grupper" : "Sett i rekkefølge"} · {t.short}</span>
            </Link>
          );
        })}
      </div>
      {sets.length === 0 && <p className="muted">Ingen sorteringsoppgaver i dette temaet. Prøv «Visuell læring» – der finner du tallerkenmodellen.</p>}
    </>
  );
}
