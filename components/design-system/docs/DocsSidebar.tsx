"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

export type SidebarGroup = {
  /** Optional label for grouping related components. */
  section?: string;
  /** Left out for a section's lead links, such as its overview. */
  title?: string;
  items: { href: string; label: string; keywords?: string }[];
};

export default function DocsSidebar({ groups, idPrefix }: { groups: SidebarGroup[]; idPrefix: string }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const nav = useRef<HTMLElement>(null);
  const normalized = query.trim().toLowerCase();
  const visible = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => `${item.label} ${item.keywords ?? ""}`.toLowerCase().includes(normalized)),
    }))
    .filter((group) => group.items.length > 0);

  // Three libraries make a long list, so bring the current page's link into view.
  // Only the sticky desktop column scrolls; the page itself stays put.
  useEffect(() => {
    const column = nav.current?.parentElement;
    const link = nav.current?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!column || !link || column.scrollHeight <= column.clientHeight) return;
    const top = link.getBoundingClientRect().top - column.getBoundingClientRect().top;
    if (top < 0 || top > column.clientHeight - link.offsetHeight) column.scrollTop += top - column.clientHeight / 3;
  }, [pathname]);

  return (
    <nav ref={nav} aria-label="Design system" className="text-sm">
      <label htmlFor={`${idPrefix}-search`} className="sr-only">Search components</label>
      <input
        id={`${idPrefix}-search`}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search components"
        className="mb-5 w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-white/30"
      />
      {visible.map((group, index) => (
        <Fragment key={`${group.section}-${group.title}`}>
          {group.section && group.section !== visible[index - 1]?.section && (
            <p className="mb-3 mt-8 border-t border-card-border px-2 pt-5 text-[13px] font-medium text-white first:mt-0">
              {group.section}
            </p>
          )}
          <div className="mb-5">
            {group.title && <p className="mb-1.5 px-2 text-xs font-medium text-zinc-500">{group.title}</p>}
            <ul>
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-md px-2 py-1.5 transition-colors ${
                        active ? "bg-white/[0.07] font-medium text-white" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Fragment>
      ))}
      {visible.length === 0 && <p className="px-2 text-zinc-500">No components match.</p>}
    </nav>
  );
}
