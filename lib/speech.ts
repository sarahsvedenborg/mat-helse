"use client";
// Opplesning (Web Speech API) og tale-til-tekst der nettleseren støtter det.

export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

function norwegianVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /^(nb|no|nn)(-|_|$)/i.test(v.lang)) ??
    voices.find((v) => /norsk|norwegian/i.test(v.name))
  );
}

export function speak(text: string, rate = 0.95, onEnd?: () => void) {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/^- /gm, "").replace(/→/g, ", så ").replace(/¾/g, "tre fjerdedels").replace(/½/g, "en halv").replace(/¼/g, "en kvart");
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = "nb-NO";
  const v = norwegianVoice();
  if (v) u.voice = v;
  u.rate = rate;
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any;

export function getRecognition(): AnyRecognition | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.lang = "nb-NO";
  r.interimResults = false;
  r.continuous = true;
  return r;
}
