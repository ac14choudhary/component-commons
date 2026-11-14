import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collectedBySlug, collectedDocs } from "@/lib/designSystem/collected";

// One collected component alone, in a recreation of its original container, with no
// design-system chrome. compare.mjs screenshots this page to pixel-compare a rebuild with
// the original site at any viewport width.

export const dynamicParams = false;

export const metadata: Metadata = { robots: { index: false, follow: false } };

export function generateStaticParams() {
  return collectedDocs.map((doc) => ({ slug: doc.slug }));
}

export default async function CollectedFramePage({ params }: { params: Promise<{ slug: string }> }) {
  const doc = collectedBySlug.get((await params).slug);
  if (!doc) notFound();
  return (
    <main className="flex-1">
      {/* Let the isolated component use the full viewport width. */}
      <style>{"html{scrollbar-gutter:auto}"}</style>
      {doc.frame}
    </main>
  );
}
