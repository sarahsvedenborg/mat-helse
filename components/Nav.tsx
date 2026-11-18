"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Hjem", ico: "🏠" },
  { href: "/ov", label: "Øv", ico: "🎯" },
  { href: "/prove", label: "Prøve", ico: "📝" },
  { href: "/pensum", label: "Pensum", ico: "📚" },
  { href: "/statistikk", label: "Fremgang", ico: "📈" },
];

export default function Nav() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand">
          <span className="brand-badge" aria-hidden>
            🥕
          </span>
          Mat og helse
        </Link>
        <nav className="nav" aria-label="Hovedmeny">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}>
              <span className="nav-ico" aria-hidden>
                {l.ico}
              </span>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
