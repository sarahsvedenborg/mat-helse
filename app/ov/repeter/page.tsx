"use client";
import { useCallback } from "react";
import Session from "@/components/Session";
import { getStore } from "@/lib/progress";
import { buildReview } from "@/lib/utils";

export default function Page() {
  const build = useCallback(() => buildReview(getStore(), 12), []);
  return (
    <>
      <h1>🔁 Øv på det jeg ikke kan</h1>
      <p className="muted">Her kommer spørsmålene du har svart feil på, var usikker på, eller som er klare for repetisjon. De vanskeligste kommer først.</p>
      <Session build={build} mode="repeter" title="Repetisjon" emptyText="Ingenting å repetere akkurat nå! Øv på nye spørsmål, eller kom tilbake senere." />
    </>
  );
}
