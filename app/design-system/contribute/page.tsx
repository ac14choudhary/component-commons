import type { Metadata } from "next";
import { repository } from "@/lib/links";

export const metadata: Metadata = { title: "Contribute | Component Commons" };

export default function ContributePage() {
  return (
    <main className="max-w-3xl py-10 pb-24">
      <h1 className="text-4xl font-light tracking-[-0.035em] text-white">Contribute a component</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-zinc-400">
        Fork the catalog on GitHub and submit your component for review. Accepted changes publish to this Vercel site.
      </p>
      <ol className="mt-8 grid gap-4 text-sm leading-relaxed text-zinc-300">
        <li><strong>1. Capture the reference.</strong> Measure the layout, states, and motion, and record the original URL.</li>
        <li><strong>2. Add and verify the entry.</strong> Include a live preview, usage, API, source credit, and comparison results. Test both themes and reduced motion.</li>
        <li><strong>3. Open a pull request.</strong> Share what you tested and any differences from the original.</li>
      </ol>
      <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm">
        <a href={`${repository}/fork`} className="rounded-lg border border-zinc-600 px-3 py-2 text-white hover:border-violet-300">Fork on GitHub ↗</a>
        <a href={`${repository}/blob/main/CONTRIBUTING.md`} className="py-2 text-zinc-200 underline underline-offset-4">Contribution guide ↗</a>
      </div>
    </main>
  );
}
