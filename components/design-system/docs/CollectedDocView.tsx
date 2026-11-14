import type { ReactNode } from "react";
import { repository } from "@/lib/links";
import { Plus } from "react-feather";
import CodeBlock from "@/components/design-system/docs/CodeBlock";
import CollectedVersions from "@/components/design-system/docs/CollectedVersions";
import { ApiReference } from "@/components/design-system/docs/ComponentDocView";
import type { CollectedDoc } from "@/lib/designSystem/collected";
import styles from "./CollectedDetails.module.css";

const captured = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const pill = "inline-flex h-7 items-center rounded-full border border-card-border px-3 text-xs text-zinc-300";

function Detail({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className={styles.item}>
      <summary className={styles.summary}>
        {title}
        <Plus className={styles.icon} size={16} aria-hidden="true" />
      </summary>
      <div className={styles.body}>{children}</div>
    </details>
  );
}

// Collected pages lead with the component: what it is, where it came from, and its versions.
// Everything else waits in the accordion.
export default function CollectedDocView({ doc }: { doc: CollectedDoc }) {
  const { origin } = doc;

  return (
    <main className="min-w-0 max-w-5xl py-10 pb-24">
      <h1 className="text-4xl font-light tracking-[-0.03em] text-white">{doc.name}</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-snug text-zinc-400">{doc.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={origin.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Original on ${origin.site}`}
          className={`${pill} transition-colors hover:border-zinc-500 hover:text-white`}
        >
          {origin.site} ↗
        </a>
        <span className={pill}>{captured(origin.capturedOn)}</span>
      </div>

      <CollectedVersions examples={doc.examples} importCode={doc.importCode} />

      <div className={styles.list}>
        <Detail title="Installation">
          <p className="mb-4 text-sm leading-relaxed text-muted">
            Import the component from the catalog or open its source files below.
          </p>
          <CodeBlock code={doc.importCode} />
        </Detail>
        <Detail title="Usage">
          <CodeBlock code={doc.usage} />
        </Detail>
        {doc.composition && (
          <Detail title="Composition">
            <CodeBlock code={doc.composition} />
          </Detail>
        )}
        <Detail title="API reference">
          <ApiReference api={doc.api} />
        </Detail>
        <Detail title="Differences from the original">
          {doc.substitutions.length > 0 ? (
            <div className="overflow-x-auto rounded-card border border-card-border">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-card text-xs text-zinc-500">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium">Original</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Rebuild uses</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Why</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {doc.substitutions.map(([original, replacement, reason]) => (
                    <tr key={original} className="align-top">
                      <td className="px-4 py-3 text-zinc-200">{original}</td>
                      <td className="px-4 py-3 text-zinc-200">{replacement}</td>
                      <td className="px-4 py-3 leading-relaxed text-muted">{reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">None recorded: the rebuild matches the original.</p>
          )}
        </Detail>
        <Detail title="Source">
          <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[10rem_1fr]">
            <dt className="text-zinc-500">Page</dt>
            <dd className="min-w-0 break-all">
              <a href={origin.url} target="_blank" rel="noreferrer" className="text-zinc-200 hover:text-white">{origin.url} ↗</a>
            </dd>
            <dt className="text-zinc-500">Isolated frame</dt>
            <dd>
              <a href={`/collected-frame/${doc.slug}`} target="_blank" rel="noreferrer" className="text-zinc-200 hover:text-white">
                /collected-frame/{doc.slug} ↗
              </a>
              <span className="mt-1 block text-zinc-500">The component alone in its original container, for resizing and pixel comparison.</span>
            </dd>
            {doc.contributor && (
              <>
                <dt className="text-zinc-500">Contributor</dt>
                <dd><a href={`https://github.com/${doc.contributor}`} className="text-zinc-200 hover:text-white">@{doc.contributor} ↗</a></dd>
              </>
            )}
            <dt className="text-zinc-500">Rebuild files</dt>
            <dd>
              <ul className="space-y-1">
                {doc.source.map((file) => (
                  <li key={file}>
                    <a href={`${repository}/blob/main/${file}`} className="break-all text-zinc-200 hover:text-white">
                      {file.split("/").at(-1)} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
            {origin.selector && (
              <>
                <dt className="text-zinc-500">Original element</dt>
                <dd className="min-w-0 break-all font-mono text-[13px] text-zinc-300">{origin.selector}</dd>
              </>
            )}
            {doc.fidelity?.map(([check, result]) => (
              <div key={check} className="contents">
                <dt className="text-zinc-500">{check}</dt>
                <dd className="text-zinc-200">{result}</dd>
              </div>
            ))}
          </dl>
        </Detail>
      </div>
    </main>
  );
}
