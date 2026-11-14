import type { Metadata } from "next";
import Link from "next/link";
import { sampleStories } from "@/lib/collected/customerStories";

export const metadata: Metadata = {
  title: "Sample customer stories | Component Commons",
  robots: { index: false, follow: true },
};

export default function SampleCustomerStories() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14 text-white">
      <Link href="/design-system/collected/customer-stories" className="text-sm text-zinc-300 underline underline-offset-4">
        Back to Customer Stories
      </Link>
      <h1 className="mt-6 text-4xl font-light">Sample customer stories</h1>
      <p className="mt-3 text-zinc-400">Fictional examples for the Customer Stories carousel.</p>
      <div className="mt-8 grid gap-4">
        {sampleStories.map((story) => (
          <article key={story.company} id={story.href?.split("#").at(-1)} className="scroll-mt-6 rounded-card border border-card-border bg-card p-5">
            <p className="text-sm text-zinc-400">{story.company}</p>
            <h2 className="mt-1 text-xl font-medium">{story.title}</h2>
            <p className="mt-3 text-zinc-200">{story.summary}</p>
            <p className="mt-2 text-zinc-400">{story.highlight}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
