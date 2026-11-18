import type { Theme } from "../types.ts";

export const THEMES: Theme[] = [
  { id: "naering", number: 1, title: "Næringsstoffer og kroppen", short: "Næringsstoffer", icon: "🥦", color: "#2f7d5b" },
  { id: "korn", number: 2, title: "Korn og baking", short: "Korn", icon: "🌾", color: "#b7791f" },
  { id: "maaltider", number: 3, title: "Mat og måltider", short: "Måltider", icon: "🍽️", color: "#c0563b" },
  { id: "hygiene", number: 4, title: "Kjøkken og hygiene", short: "Hygiene", icon: "🧼", color: "#2b6f9e" },
  { id: "maal", number: 5, title: "Måleenheter", short: "Måleenheter", icon: "⚖️", color: "#7b5ea7" },
  { id: "baerekraft", number: 6, title: "Bærekraftig mat", short: "Bærekraft", icon: "🌍", color: "#3f8f3a" },
  { id: "smak", number: 7, title: "Smakssansene", short: "Smak", icon: "👅", color: "#c2417a" },
];

export const themeById = (id: string) => THEMES.find((t) => t.id === id)!;
