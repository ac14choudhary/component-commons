import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectedDocView from "@/components/design-system/docs/CollectedDocView";
import { collectedBySlug, collectedDocs } from "@/lib/designSystem/collected";

export const dynamicParams = false;

export function generateStaticParams() {
  return collectedDocs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const doc = collectedBySlug.get((await params).slug);
  return doc ? { title: `${doc.name} (${doc.origin.site}) | Component Commons` } : {};
}

export default async function CollectedDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const doc = collectedBySlug.get((await params).slug);
  if (!doc) notFound();

  return <CollectedDocView key={doc.slug} doc={doc} />;
}
