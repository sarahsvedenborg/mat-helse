import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Mat og helse – øv til prøven",
  description: "Interaktiv øvingsapp for teoriprøven i mat og helse på ungdomsskolen.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1f5c42",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>
        <a className="skip" href="#innhold">
          Hopp til innhold
        </a>
        <Nav />
        <main id="innhold">{children}</main>
      </body>
    </html>
  );
}
