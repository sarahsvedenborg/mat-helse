import Link from "next/link";
import { THEMES } from "@/lib/data";

/** Lenker for å filtrere en øvingsmodus på tema. */
export default function ThemePicker({ base, current, extra = "" }: { base: string; current: string | null; extra?: string }) {
  return (
    <nav aria-label="Velg tema" className="row" style={{ marginBottom: 16 }}>
      <Link className={`chip ${!current ? "st-mestret" : ""}`} style={{ padding: "8px 12px", textDecoration: "none" }} href={`${base}${extra ? "?" + extra : ""}`} aria-current={!current ? "true" : undefined}>
        Alle temaer
      </Link>
      {THEMES.map((t) => (
        <Link
          key={t.id}
          href={`${base}?tema=${t.id}${extra ? "&" + extra : ""}`}
          className="chip"
          aria-current={current === t.id ? "true" : undefined}
          style={{
            padding: "8px 12px",
            textDecoration: "none",
            background: current === t.id ? t.color : t.color + "1a",
            color: current === t.id ? "#fff" : t.color,
          }}
        >
          <span aria-hidden>{t.icon}</span> {t.short}
        </Link>
      ))}
    </nav>
  );
}
