import Link from "next/link";
import DocsSidebar from "@/components/design-system/docs/DocsSidebar";
import { collectedDocs } from "@/lib/designSystem/collected";
import { repository } from "@/lib/links";

const groups = [{
  title: "Components",
  items: collectedDocs.map((doc) => ({
    href: `/design-system/collected/${doc.slug}`,
    label: doc.name,
    keywords: doc.origin.site,
  })),
}];

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-card-border bg-ink/95">
        <div className="mx-auto flex min-h-15 max-w-[1440px] flex-wrap items-center justify-between gap-x-5 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/design-system/collected" className="font-semibold text-white">Component Commons</Link>
          <nav aria-label="Catalog" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link href="/design-system/contribute" className="font-medium text-zinc-100 hover:text-violet-300">Contribute</Link>
            <a href={repository} className="text-zinc-400 hover:text-white">GitHub ↗</a>
          </nav>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1440px] gap-8 px-4 sm:px-6">
        <aside className="scrollbar-none sticky top-15 hidden h-[calc(100dvh-3.75rem)] w-56 shrink-0 overflow-y-auto py-8 pr-2 lg:block">
          <DocsSidebar groups={groups} idPrefix="commons-sidebar" />
        </aside>
        <div className="min-w-0 flex-1">
          <details className="border-b border-card-border py-3 lg:hidden">
            <summary className="cursor-pointer text-sm text-zinc-300">Browse components</summary>
            <div className="mt-3 pb-3"><DocsSidebar groups={groups} idPrefix="commons-mobile" /></div>
          </details>
          {children}
        </div>
      </div>
    </>
  );
}
