import { validateData, dataSummary } from "../lib/validate.ts";

const errors = validateData();
console.log("Pensum:", dataSummary());
if (errors.length) {
  console.error(`❌ ${errors.length} feil:\n` + errors.map((e) => " - " + e).join("\n"));
  process.exit(1);
}
console.log("✅ Alle pensumdata er gyldige.");
