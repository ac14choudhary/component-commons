"use client";

import { useState, type ReactNode } from "react";
import CodeBlock from "./CodeBlock";

export type CanvasTone = "ink" | "black" | "light" | "white";

const CANVAS: Record<CanvasTone, string> = {
  ink: "bg-ink text-zinc-200",
  black: "bg-black text-zinc-200",
  light: "bg-[#fafafa] text-ink",
  white: "bg-white text-ink",
};

export type ExampleLayout = {
  tone?: CanvasTone;
  /** center: small component in the middle; stretch: full width, no padding; padded: full width with padding */
  align?: "center" | "stretch" | "padded";
  minHeight?: number;
  /** Contain fixed-position children (navigation, floating UI) inside the canvas. */
  contain?: boolean;
};

export default function ComponentExample({
  code,
  children,
  tone = "ink",
  align = "center",
  minHeight = 280,
  contain = false,
}: ExampleLayout & { code: string; children: ReactNode }) {
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div>
      <div role="tablist" aria-label="Example view" className="mb-3 flex gap-5 border-b border-card-border">
        {(["preview", "code"] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={view === item}
            onClick={() => setView(item)}
            className={`-mb-px border-b-2 pb-2.5 text-sm font-medium capitalize transition-colors ${
              view === item ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {/* Both views stay mounted so a running example keeps its state while the code is read. */}
      <div hidden={view !== "preview"}>
        <div
          className={`relative overflow-hidden rounded-card border border-card-border ${CANVAS[tone]} ${
            align === "center"
              ? "flex items-center justify-center p-8 sm:p-10"
              : align === "padded"
                ? "p-6 sm:p-8"
                : ""
          }`}
          style={{ minHeight, transform: contain ? "translateZ(0)" : undefined }}
        >
          {align === "center" ? <div className="w-full max-w-full">{children}</div> : children}
        </div>
      </div>
      <div hidden={view !== "code"}>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
