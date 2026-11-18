import Client from "./Client";
export const metadata = { title: "Koble og sorter – Mat og helse" };
export default async function Page({ searchParams }: { searchParams: Promise<{ tema?: string; sett?: string }> }) {
  const sp = await searchParams;
  return <Client tema={sp.tema ?? null} sett={sp.sett ?? null} />;
}
