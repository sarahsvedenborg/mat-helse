"use client";
import { useCallback } from "react";
import Session from "@/components/Session";
import ThemePicker from "@/components/ThemePicker";
import { getStore } from "@/lib/progress";
import { buildQuiz } from "@/lib/utils";

export default function Client({ tema }: { tema: string | null }) {
  const build = useCallback(() => buildQuiz(tema, getStore(), 10), [tema]);
  return (
    <>
      <h1>✅ Flervalg og regning</h1>
      <p className="muted">
        Velg riktig svar, eller regn ut målet. Du får svar med en gang. Tips: Bruk tastene <kbd>1</kbd>–<kbd>4</kbd>.
        Ett riktig flervalgssvar er ikke nok til å «mestre» et spørsmål – øv også på å forklare.
      </p>
      <ThemePicker base="/ov/quiz" current={tema} />
      <Session key={tema ?? "alle"} build={build} mode="quiz" title="Quiz" />
    </>
  );
}
