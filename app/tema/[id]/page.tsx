import { notFound } from "next/navigation";
import { THEMES } from "@/lib/data";
import Client from "./Client";

export function generateStaticParams() {
  return THEMES.map((t) => ({ id: t.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!THEMES.some((t) => t.id === id)) notFound();
  return <Client id={id} />;
}
