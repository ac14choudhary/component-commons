import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import CodeBlock from "@/components/design-system/docs/CodeBlock";
import ComponentExample from "@/components/design-system/docs/ComponentExample";
import type { ApiDoc, DocBody } from "@/lib/designSystem/types";

// Layout helpers for component documentation.
// Collected components have their own, simpler page: CollectedDocView.tsx.

export type DocLink = { slug: string; name: string };
export type DocSection = { id: string; title: string; content: ReactNode };

export function DocHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-14 scroll-mt-24 border-b border-card-border pb-2 text-2xl font-medium tracking-[-0.01em] text-white">
      {children}
    </h2>
  );
}

export function ApiReference({ api }: { api: ApiDoc[] }) {
  return (
    <>
    {api.map((item) => (
      <section key={item.name} className="mt-8">
        <h3 className="font-mono text-base text-white">{item.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
        {item.props.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-card border border-card-border">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-card text-xs text-zinc-500">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Prop</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Type</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Default</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {item.props.map(([name, type, defaultValue, description]) => (
                  <tr key={name} className="align-top">
                    <td className="px-4 py-3 font-mono text-[13px] text-white">{name}</td>
                    <td className="max-w-[16rem] px-4 py-3 font-mono text-[13px] text-violet-300">{type}</td>
                    <td className="px-4 py-3 font-mono text-[13px] text-zinc-400">{defaultValue}</td>
                    <td className="px-4 py-3 leading-relaxed text-muted">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-500">No props.</p>
        )}
      </section>
    ))}
    </>
  );
}

export default function ComponentDocView({
  doc,
  basePath,
  crumb,
  previous,
  next,
  meta,
  sections = [],
}: {
  doc: DocBody;
  /** Route prefix for previous/next links, e.g. "/design-system/components". */
  basePath: string;
  crumb: { href: string; label: string; trail?: string };
  previous?: DocLink;
  next?: DocLink;
  /** Shown under the description (the Collected space uses it for attribution). */
  meta?: ReactNode;
  /** Closing sections after Guidelines (Used in, Source, Differences…). */
  sections?: DocSection[];
}) {
  const [primary, ...examples] = doc.examples;

  const toc = [
    ["installation", "Installation"],
    ["usage", "Usage"],
    ...(doc.composition ? [["composition", "Composition"]] : []),
    ...(examples.length ? [["examples", "Examples"], ...examples.map((example) => [`example-${example.id}`, example.title])] : []),
    ["api-reference", "API Reference"],
    ...(doc.guidelines?.length ? [["guidelines", "Guidelines"]] : []),
    ...sections.map((section) => [section.id, section.title]),
  ];

  const pager = (
    <div className="flex items-center gap-2">
      {previous && (
        <Link href={`${basePath}/${previous.slug}`} aria-label={`Previous: ${previous.name}`} className="inline-flex h-8 items-center gap-1 rounded-lg border border-card-border px-2.5 text-sm text-zinc-300 hover:text-white">
          <ChevronLeft size={14} aria-hidden="true" />
        </Link>
      )}
      {next && (
        <Link href={`${basePath}/${next.slug}`} aria-label={`Next: ${next.name}`} className="inline-flex h-8 items-center gap-1 rounded-lg border border-card-border px-2.5 text-sm text-zinc-300 hover:text-white">
          <ChevronRight size={14} aria-hidden="true" />
        </Link>
      )}
    </div>
  );

  return (
    <div className="flex gap-10">
      <main className="min-w-0 flex-1 py-10 pb-24">
        <p className="text-sm text-zinc-500">
          <Link href={crumb.href} className="hover:text-white">{crumb.label}</Link>
          {crumb.trail && (
            <>
              <span aria-hidden="true"> / </span>
              {crumb.trail}
            </>
          )}
        </p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="text-4xl font-light tracking-[-0.03em] text-white">{doc.name}</h1>
          {pager}
        </div>
        <p className="mt-2 max-w-2xl text-[15px] leading-snug text-zinc-400">{doc.description}</p>
        {meta && <div className="mt-4">{meta}</div>}

        {primary && (
          <div className="mt-8">
            <ComponentExample code={primary.code} {...primary.layout}>
              {primary.preview}
            </ComponentExample>
            {primary.description && <p className="mt-3 text-sm text-muted">{primary.description}</p>}
          </div>
        )}

        <DocHeading id="installation">Installation</DocHeading>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Available in the catalog source. Import it from its source file.
        </p>
        <div className="mt-4">
          <CodeBlock code={doc.importCode} />
        </div>

        <DocHeading id="usage">Usage</DocHeading>
        <div className="mt-4">
          <CodeBlock code={doc.usage} />
        </div>

        {doc.composition && (
          <>
            <DocHeading id="composition">Composition</DocHeading>
            <p className="mt-4 text-sm leading-relaxed text-muted">How the parts nest.</p>
            <div className="mt-4">
              <CodeBlock code={doc.composition} />
            </div>
          </>
        )}

        {examples.length > 0 && (
          <>
            <DocHeading id="examples">Examples</DocHeading>
            {examples.map((example) => (
              <section key={example.id} className="mt-10">
                <h3 id={`example-${example.id}`} className="scroll-mt-24 text-lg font-medium text-white">{example.title}</h3>
                {example.description && <p className="mt-1.5 text-sm leading-relaxed text-muted">{example.description}</p>}
                <div className="mt-4">
                  <ComponentExample code={example.code} {...example.layout}>
                    {example.preview}
                  </ComponentExample>
                </div>
              </section>
            ))}
          </>
        )}

        <DocHeading id="api-reference">API Reference</DocHeading>
        <ApiReference api={doc.api} />

        {doc.guidelines && doc.guidelines.length > 0 && (
          <>
            <DocHeading id="guidelines">Guidelines</DocHeading>
            <dl className="mt-4 space-y-4">
              {doc.guidelines.map(([title, body]) => (
                <div key={title}>
                  <dt className="text-sm font-medium text-white">{title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{body}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        {sections.map((section) => (
          <section key={section.id}>
            <DocHeading id={section.id}>{section.title}</DocHeading>
            {section.content}
          </section>
        ))}

        <nav aria-label="Pagination" className="mt-16 flex justify-between gap-4 border-t border-card-border pt-6">
          {previous ? (
            <Link href={`${basePath}/${previous.slug}`} className="group text-sm">
              <span className="block text-zinc-500">Previous</span>
              <span className="mt-1 inline-flex items-center gap-1 font-medium text-white"><ChevronLeft size={14} aria-hidden="true" />{previous.name}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={`${basePath}/${next.slug}`} className="text-right text-sm">
              <span className="block text-zinc-500">Next</span>
              <span className="mt-1 inline-flex items-center gap-1 font-medium text-white">{next.name}<ChevronRight size={14} aria-hidden="true" /></span>
            </Link>
          )}
        </nav>
      </main>

      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-48 shrink-0 overflow-y-auto scrollbar-none py-10 xl:block">
        <p className="text-xs font-medium text-zinc-500">On this page</p>
        <ul className="mt-3 space-y-2 text-sm">
          {toc.map(([id, label]) => (
            <li key={id} className={id.startsWith("example-") ? "pl-3" : ""}>
              <a href={`#${id}`} className="text-zinc-400 hover:text-white">{label}</a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
