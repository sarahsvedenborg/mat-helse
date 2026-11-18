"use client";
import { useEffect, useRef, useState } from "react";
import { getRecognition } from "@/lib/speech";

/** Tale-til-tekst-knapp. Vises bare hvis nettleseren støtter det. */
export default function Dictation({ onText }: { onText: (t: string) => void }) {
  const [supported, setSupported] = useState(false);
  const [on, setOn] = useState(false);
  const rec = useRef<ReturnType<typeof getRecognition>>(null);
  const cb = useRef(onText);
  cb.current = onText;
  useEffect(() => {
    setSupported(!!getRecognition());
    return () => rec.current?.stop?.();
  }, []);
  if (!supported) return null;
  const toggle = () => {
    if (on) {
      rec.current?.stop();
      setOn(false);
      return;
    }
    const r = getRecognition();
    if (!r) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) text += e.results[i][0].transcript;
      if (text) cb.current(text.trim());
    };
    r.onend = () => setOn(false);
    r.onerror = () => setOn(false);
    rec.current = r;
    r.start();
    setOn(true);
  };
  return (
    <button type="button" className="icon-btn" aria-pressed={on} onClick={toggle}>
      <span aria-hidden>{on ? "⏺" : "🎤"}</span> {on ? "Stopp diktering" : "Snakk inn svaret"}
    </button>
  );
}
