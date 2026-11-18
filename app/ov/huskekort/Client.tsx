"use client";
import { useCallback } from "react";
import Session from "@/components/Session";
import ThemePicker from "@/components/ThemePicker";
import { getStore } from "@/lib/progress";
import { buildFlashcards } from "@/lib/utils";

export default function Client({ tema }: { tema: string | null }) {
  const build = useCallback(() => buildFlashcards(tema, getStore(), 12), [tema]);
  return (
    <>
      <h1>🃏 Huskekort</h1>
      <p className="muted">Les spørsmålet, tenk ut svaret selv, snu kortet og vær ærlig med deg selv. Det du ikke kan, kommer tilbake oftere.</p>
      <ThemePicker base="/ov/huskekort" current={tema} />
      <Session key={tema ?? "alle"} build={build} mode="huskekort" title="Huskekort" />
    </>
  );
}
