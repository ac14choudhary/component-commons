"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import CodeBlock from "@/components/design-system/docs/CodeBlock";
import type { Example } from "@/lib/designSystem/types";

// One tab per version of a collected component, with Code set apart at the right. Every pane
// stays mounted in the same grid cell, so switching keeps each version's state and size.
export default function CollectedVersions({ examples, importCode }: { examples: Example[]; importCode: string }) {
  const id = useId();
  const [version, setVersion] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = showCode ? examples.length : version;

  const select = (index: number) => {
    setShowCode(index === examples.length);
    if (index < examples.length) setVersion(index);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const count = examples.length + 1;
    const target =
      event.key === "ArrowRight" ? (current + 1) % count
      : event.key === "ArrowLeft" ? (current - 1 + count) % count
      : event.key === "Home" ? 0
      : event.key === "End" ? count - 1
      : -1;
    if (target < 0) return;
    event.preventDefault();
    select(target);
    tabs.current[target]?.focus();
  };

  const tab = (label: string, index: number, className = "") => (
    <button
      key={label}
      ref={(node) => {
        tabs.current[index] = node;
      }}
      type="button"
      role="tab"
      id={`${id}-tab-${index}`}
      aria-selected={current === index}
      aria-controls={`${id}-pane-${index}`}
      tabIndex={current === index ? 0 : -1}
      onClick={() => select(index)}
      className={`-mb-px whitespace-nowrap border-b-2 pb-2.5 text-sm font-medium transition-colors ${className} ${
        current === index ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="mt-8">
      <div role="tablist" aria-label="Versions" onKeyDown={onKeyDown} className="flex gap-5 overflow-x-auto border-b border-card-border">
        {examples.map((example, index) => tab(example.title, index))}
        {tab("Code", examples.length, "ml-auto")}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)]">
        {examples.map((example, index) => (
          <div
            key={example.id}
            role="tabpanel"
            id={`${id}-pane-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            className={`[grid-area:1/1] ${current === index ? "" : "invisible"} ${showCode ? "h-0 overflow-hidden" : ""}`}
          >
            <div
              className="grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-card border border-card-border"
              style={{ minHeight: example.layout?.minHeight }}
            >
              {example.preview}
            </div>
            {example.description && <p className="mt-3 text-sm text-zinc-400">{example.description}</p>}
          </div>
        ))}
        <div
          role="tabpanel"
          id={`${id}-pane-${examples.length}`}
          aria-labelledby={`${id}-tab-${examples.length}`}
          className={`[grid-area:1/1] ${showCode ? "" : "invisible h-0 overflow-hidden"}`}
        >
          <CodeBlock code={`${importCode}\n\n${examples[version].code}`} />
        </div>
      </div>
    </div>
  );
}
