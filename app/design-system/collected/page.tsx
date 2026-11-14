import Link from "next/link";
import { collectedDocs } from "@/lib/designSystem/collected";

export default function CollectedPage() {
  return (
    <main className="max-w-5xl py-10 pb-24">
      <h1 className="text-4xl font-light tracking-[-0.035em] text-white sm:text-5xl">Collected components</h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-400">
        Explore and contribute UI recreations. Each entry includes a working preview, usage examples, and a credit to the original.
      </p>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link href="/design-system/contribute" className="text-zinc-200 underline underline-offset-4 hover:text-violet-300">Contribute a component</Link>
      </div>
      <ul className="mt-9 grid gap-3 sm:grid-cols-2">
        {collectedDocs.map((doc) => (
          <li key={doc.slug}>
            <Link
              href={`/design-system/collected/${doc.slug}`}
              className="block h-full rounded-card border border-card-border bg-card p-4 transition-colors hover:border-zinc-500"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-chip text-white">{doc.icon}</span>
                <span className="text-xs text-zinc-400">{doc.origin.site}</span>
              </span>
              <span className="mt-4 block font-medium text-white">{doc.name}</span>
              <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted">{doc.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
