# Collected entry skeleton

Paste into `collectedDocs` in `lib/designSystem/collected.tsx` and import the component at the
top of that file. The type is `CollectedDoc` (same file); `DocBody` and `ExampleLayout` come from
`lib/designSystem/types.ts` and `components/design-system/docs/ComponentExample.tsx`.

```tsx
{
  slug: "card-swap",                                   // → /design-system/collected/card-swap and /collected-frame/card-swap
  contributor: "your-github-handle",
  icon: <MyShapeIcon />, // Add it to components/design-system/docs/CollectedIcons.tsx
  name: "Card Swap",
  description: "Stacked 3D cards; the front card drops away and returns to the back on a timer.",
  source: ["components/collected/CardSwap.tsx", "components/collected/CardSwap.module.css"],
  importCode: `import CardSwap from "@/components/collected/CardSwap";`,
  usage: `<CardSwap delay={5000} />`,
  composition: `CardSwap                     // optional
└── Card × n`,
  api: [
    {
      name: "CardSwap",
      description: "Client component. Pauses for prefers-reduced-motion.",
      props: [
        ["delay", "number", "5000", "Milliseconds between swaps, as on the original."],
        ["cards", "{ title: string; body?: string }[]", "3 demo cards", "Card content."],
      ],
    },
  ],
  examples: [
    // First example = hero preview, on the original page background.
    {
      id: "default",
      title: "Default",
      code: `<CardSwap />`,
      layout: { align: "stretch", minHeight: 520 },
      preview: (
        <div style={{ background: "#0a0a0a", padding: "64px 24px", display: "grid", placeItems: "center" }}>
          <CardSwap />
        </div>
      ),
    },
  ],
  // The component inside a recreation of its original container (styles.json › context and
  // pageBackground). Rendered alone at /collected-frame/<slug> for compare.mjs.
  frame: (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "grid", placeItems: "center", padding: "0 24px" }}>
      <CardSwap />
    </div>
  ),
  origin: {
    site: "Bencho",
    url: "https://bencho.dev/blocks/card-swap?c=card-swap&theme=dark",
    capturedOn: "2026-11-01",
    selector: "main > div:nth-of-type(2) > div",      // from locate.mjs
  },
  substitutions: [
    // [original, what the rebuild uses, why]
    ["GSAP timeline", "Web Animations API", "No new dependency; timings and easing taken from motion-trace.json."],
    ["Keeps animating with reduced motion", "Pauses with prefers-reduced-motion", "Supports visitors who prefer reduced motion."],
  ],
  fidelity: [
    ["1440px · rest", "0.4% of pixels differ"],
    ["390px · rest", "1.1% of pixels differ"],
  ],
},
```

The values above are illustrative only; fill every field from the extraction.

## Component file conventions

```tsx
"use client"; // only if it needs state, effects, or handlers

import styles from "./CardSwap.module.css";

export default function CardSwap({ delay = 5000, cards = DEMO_CARDS }: Props) {
  return (
    <div className={styles.root} data-collected="card-swap">
      …
    </div>
  );
}
```

- One component per file, default export; sub-parts as named exports.
- `data-collected="<slug>"` on the root: compare.mjs selects it with
  `--rebuild-selector '[data-collected="<slug>"]'`.
- CSS Module sets everything explicitly (line-height, box-sizing, margins, font, svg/img display)
  because the docs site's Tailwind reset differs from the browser defaults the original relied on.
- Fonts: free Google fonts via `next/font/google` at module scope in the component file, applied
  with the returned `className`; anything paid becomes a substitution.
