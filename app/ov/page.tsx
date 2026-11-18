import Link from "next/link";
import { MODES } from "@/components/modes";
export const metadata = { title: "Øv – Mat og helse" };
export default function Page() {
  return (
    <>
      <h1>Hvordan vil du øve?</h1>
      <p className="muted">Bytt gjerne mellom modusene. Variasjon gjør at du husker bedre – og å forklare med egne ord er den beste forberedelsen til prøven.</p>
      <div className="grid grid-3 mt">
        {MODES.map((m) => (
          <Link key={m.href} href={m.href} className="tile">
            <span className="tile-ico" style={{ background: m.bg }} aria-hidden>{m.icon}</span>
            <b>{m.title}</b>
            <span className="small muted">{m.text}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
