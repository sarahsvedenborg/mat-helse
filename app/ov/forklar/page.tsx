import Client from "./Client";
export const metadata = { title: "Forklar med egne ord – Mat og helse" };
export default async function Page({ searchParams }: { searchParams: Promise<{ tema?: string; q?: string }> }) {
  const sp = await searchParams;
  return <Client tema={sp.tema ?? null} qid={sp.q ?? null} />;
}
