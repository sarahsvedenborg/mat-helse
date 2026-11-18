import Client from "./Client";
export const metadata = { title: "Flervalg og regning – Mat og helse" };
export default async function Page({ searchParams }: { searchParams: Promise<{ tema?: string }> }) {
  const sp = await searchParams;
  return <Client tema={sp.tema ?? null} />;
}
