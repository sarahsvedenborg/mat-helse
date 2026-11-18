"use client";
import { useEffect, useState } from "react";
import { canSpeak, speak, stopSpeaking } from "@/lib/speech";
import { getStore, RATING_LABEL, STATUS_LABEL, type Rating, type Status } from "@/lib/progress";
import { themeById } from "@/lib/data";

/** Viser tekst der linjer som starter med "- " blir punktliste. */
export function RichText({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (k: number) => {
    if (list.length) {
      blocks.push(
        <ul key={`l${k}`}>
          {list.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  text.split("\n").forEach((line, i) => {
    if (line.startsWith("- ")) list.push(line.slice(2));
    else {
      flush(i);
      if (line.trim()) blocks.push(<p key={i}>{line}</p>);
    }
  });
  flush(9999);
  return <>{blocks}</>;
}

export function SpeakButton({ text, label = "Les høyt" }: { text: string; label?: string }) {
  const [on, setOn] = useState(false);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported(canSpeak());
    return () => stopSpeaking();
  }, []);
  useEffect(() => {
    stopSpeaking();
    setOn(false);
  }, [text]);
  if (!supported) return null;
  return (
    <button
      type="button"
      className="icon-btn"
      aria-pressed={on}
      onClick={() => {
        if (on) {
          stopSpeaking();
          setOn(false);
        } else {
          setOn(true);
          speak(text, getStore().settings.speechRate, () => setOn(false));
        }
      }}
    >
      <span aria-hidden>{on ? "⏹" : "🔊"}</span> {on ? "Stopp" : label}
    </button>
  );
}

const RATING_SUB: Record<Rating, string> = {
  again: "Øves igjen snart",
  hard: "Øves i morgen",
  good: "Øves om noen dager",
};

export function RatingButtons({ onRate, disabled }: { onRate: (r: Rating) => void; disabled?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (disabled) return;
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "TEXTAREA" || t.tagName === "INPUT")) return;
      if (e.key === "1") onRate("again");
      if (e.key === "2") onRate("hard");
      if (e.key === "3") onRate("good");
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onRate, disabled]);
  return (
    <div>
      <p className="small muted" id="rate-label">
        Hvor godt kunne du dette? <span className="sr-only">Tast 1, 2 eller 3.</span>
      </p>
      <div className="rate" role="group" aria-labelledby="rate-label">
        {(["again", "hard", "good"] as Rating[]).map((r, i) => (
          <button key={r} type="button" className={`r-${r}`} onClick={() => onRate(r)} disabled={disabled}>
            <span>
              {r === "again" ? "😕" : r === "hard" ? "🤔" : "😄"} {RATING_LABEL[r]}
            </span>
            <small>
              {RATING_SUB[r]} · <kbd>{i + 1}</kbd>
            </small>
          </button>
        ))}
      </div>
    </div>
  );
}

export function StatusChip({ status }: { status: Status }) {
  return <span className={`chip st-${status}`}>{STATUS_LABEL[status]}</span>;
}

export function ThemeChip({ theme }: { theme: string }) {
  const t = themeById(theme);
  return (
    <span className="chip" style={{ background: t.color + "1f", color: t.color }}>
      <span aria-hidden>{t.icon}</span> {t.short}
    </span>
  );
}

export function StackedBar({ counts, total, large }: { counts: Record<Status, number>; total: number; large?: boolean }) {
  const seg = (n: number, c: string) => <span style={{ width: `${(n / Math.max(total, 1)) * 100}%`, background: c }} />;
  return (
    <div
      className={`bar ${large ? "bar-lg" : ""}`}
      role="img"
      aria-label={`${counts.mestret} mestret, ${counts["paa-vei"]} på vei, ${counts.trenger} trenger øving, ${counts["ikke-ovd"]} ikke øvd, av ${total}`}
    >
      {seg(counts.mestret, "#2e8b57")}
      {seg(counts["paa-vei"], "#e9b44c")}
      {seg(counts.trenger, "#d9654b")}
    </div>
  );
}

export function Legend() {
  const dot = (c: string) => <span aria-hidden style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: c, marginRight: 5 }} />;
  return (
    <div className="row small muted" style={{ gap: 14 }}>
      <span>{dot("#2e8b57")}Mestret</span>
      <span>{dot("#e9b44c")}På vei</span>
      <span>{dot("#d9654b")}Trenger øving</span>
      <span>{dot("#ece4d4")}Ikke øvd</span>
    </div>
  );
}

export function ProgressTop({ index, total, label }: { index: number; total: number; label?: string }) {
  return (
    <div className="progress-top">
      <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index} aria-label="Fremdrift i økta">
        <span style={{ width: `${(index / total) * 100}%`, background: "var(--green)" }} />
      </div>
      <span className="small muted" style={{ whiteSpace: "nowrap" }}>
        {label ?? `${Math.min(index + 1, total)} av ${total}`}
      </span>
    </div>
  );
}

export function Loading() {
  return <p className="muted">Laster …</p>;
}
