"use client";

import { useState } from "react";
import { Check, Copy } from "react-feather";

export function CopyButton({ value, className = "" }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        });
      }}
      aria-label={copied ? "Copied" : "Copy code"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70 ${className}`}
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
    </button>
  );
}

export default function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="overflow-hidden rounded-card border border-card-border bg-[#0b0b0c]">
      {label && (
        <div className="flex items-center justify-between border-b border-card-border px-4 py-1.5">
          <span className="font-mono text-xs text-zinc-500">{label}</span>
          <CopyButton value={code} />
        </div>
      )}
      <div className="relative">
        {!label && <CopyButton value={code} className="absolute right-2 top-2" />}
        <pre className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-relaxed text-zinc-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
