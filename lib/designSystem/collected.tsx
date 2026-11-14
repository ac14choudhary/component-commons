import type { ReactNode } from "react";
import type { DocBody } from "@/lib/designSystem/types";
import StripeFeatureGrid from "@/components/collected/StripeFeatureGrid";
import stripeFeatureGridStyles from "@/components/collected/StripeFeatureGrid.module.css";
import SafetyCards from "@/components/collected/SafetyCards";
import safetyCardsStyles from "@/components/collected/SafetyCards.module.css";
import AuthFeatureCards from "@/components/collected/AuthFeatureCards";
import authFeatureCardsStyles from "@/components/collected/AuthFeatureCards.module.css";
import WeaveTools from "@/components/collected/WeaveTools";
import weaveToolsStyles from "@/components/collected/WeaveTools.module.css";
import CardSwap from "@/components/collected/CardSwap";
import cardSwapStyles from "@/components/collected/CardSwap.module.css";
import FeatureAccordion from "@/components/collected/FeatureAccordion";
import featureAccordionStyles from "@/components/collected/FeatureAccordion.module.css";
import SqueezyCarousel from "@/components/collected/SqueezyCarousel";
import squeezyCarouselStyles from "@/components/collected/SqueezyCarousel.module.css";
import SystemsDiagram from "@/components/collected/SystemsDiagram";
import systemsDiagramStyles from "@/components/collected/SystemsDiagram.module.css";
import CustomerStories from "@/components/collected/CustomerStories";
import customerStoriesStyles from "@/components/collected/CustomerStories.module.css";
import LovableFeatureCards from "@/components/collected/LovableFeatureCards";
import lovableFeatureCardsStyles from "@/components/collected/LovableFeatureCards.module.css";
import MediaMask from "@/components/collected/MediaMask";
import mediaMaskStyles from "@/components/collected/MediaMask.module.css";
import RecurringWorkLoop from "@/components/collected/RecurringWorkLoop";
import recurringWorkLoopStyles from "@/components/collected/RecurringWorkLoop.module.css";
import CopilotSurfaces from "@/components/collected/CopilotSurfaces";
import copilotSurfacesStyles from "@/components/collected/CopilotSurfaces.module.css";
import PagePeel from "@/components/collected/PagePeel";
import pagePeelStyles from "@/components/collected/PagePeel.module.css";
import ModelSwitcher from "@/components/collected/ModelSwitcher";
import modelSwitcherStyles from "@/components/collected/ModelSwitcher.module.css";
import { StripeGridIcon, SafetyCardsIcon, AuthCardsIcon, WeaveToolsIcon, CardStackIcon, PanelsIcon, NarrowingBarsIcon, HubIcon, StoriesIcon, FeatureCardsIcon, MediaMaskIcon, RecurringLoopIcon, SurfacesIcon, PeelIcon, CodeCardIcon } from "@/components/design-system/docs/CollectedIcons";

export type CollectedDoc = DocBody & {
  /** A small drawing of the component's shape, for its overview card. */
  icon: ReactNode;
  contributor?: string;
  /**
   * The component inside a recreation of its original container (same background, padding,
   * and max width as on the source page). Rendered alone at /collected-frame/<slug>, so it
   * can be compared with the original at any viewport width.
   */
  frame: ReactNode;
  origin: {
    /** Product or site name, e.g. "Linear". */
    site: string;
    /** The exact page the component was captured from. */
    url: string;
    /** ISO date of the capture, e.g. "2026-11-01". */
    capturedOn: string;
    /** CSS selector of the original element on that page at capture time. */
    selector?: string;
  };
  /** Every way the rebuild knowingly differs from the original, and why. */
  substitutions: [original: string, replacement: string, reason: string][];
  /** Result of the last pixel comparison per viewport, e.g. ["1440px · rest", "1.8% of pixels differ"]. */
  fidelity?: [check: string, result: string][];
};

export const collectedDocs: CollectedDoc[] = [
  {
    slug: "stripe-feature-grid",
    icon: <StripeGridIcon />,
    name: "Stripe Feature Grid",
    description: "Six product cards with checkout, billing, commerce, issuing, crypto, and platform illustrations. Each card opens a detail dialog.",
    source: ["components/collected/StripeFeatureGrid.tsx", "components/collected/StripeFeatureGrid.module.css"],
    importCode: `import StripeFeatureGrid from "@/components/collected/StripeFeatureGrid";`,
    usage: `<StripeFeatureGrid theme="light" />`,
    composition: `StripeFeatureGrid
├── Responsive product grid
│   └── Illustration and dialog trigger × 6
└── Product detail dialog`,
    api: [
      {
        name: "StripeFeatureGrid",
        description: "Hover and keyboard focus expand the card over 760ms and animate its artwork. The border glow follows mouse or pen position. Moving away eases the card back and pauses the artwork at its current frame. Click, tap, Enter, or Space opens the animated dialog. Escape, the close button, or the backdrop dismisses it and restores focus. Reduced motion keeps the artwork still.",
        props: [["theme", '"light" | "dark"', '"light"', "Palette for the cards, illustrations, and dialog."]],
      },
    ],
    examples: [
      {
        id: "light",
        title: "Light",
        code: `<StripeFeatureGrid />`,
        layout: { align: "stretch" },
        preview: <div className={stripeFeatureGridStyles.frame}><StripeFeatureGrid /></div>,
      },
      {
        id: "dark",
        title: "Dark",
        code: `<StripeFeatureGrid theme="dark" />`,
        layout: { align: "stretch" },
        preview: <div className={stripeFeatureGridStyles.frame} data-surface="dark"><StripeFeatureGrid theme="dark" /></div>,
      },
    ],
    frame: <div className={stripeFeatureGridStyles.frame}><StripeFeatureGrid /></div>,
    origin: { site: "Stripe", url: "https://stripe.com/", capturedOn: "2026-11-10", selector: ".modular-solutions-bento__layout" },
    substitutions: [
      ["Product graphics and logos", "CSS mock interfaces, generic marks, and original canvas particles", "Recreates the compositions with local code."],
      ["Multi-market checkout", "Japanese, US, and German mock checkouts that crossfade every four seconds while active", "Starts with the Japanese market shown in the supplied screenshot."],
      ["Long product pages within the dialogs", "Summary, four highlights, two source links, and one illustration per dialog", "Keeps the dialog opening and first section of each product story."],
      ["Pointer-driven graphics and moving demos", "Pointer-follow gradient border, CSS gradient sweeps, animated billing bars, and an orbit marker", "Approximates the source motion with local artwork and supports reduced motion."],
      ["Light palette", "Light and dark palettes", "Offers both Collected themes."],
      ["Stripe type and expanded copy", "Inter with paraphrased product summaries", "Uses the design system’s available typeface and body sizes."],
    ],
    fidelity: [
      ["1440px · rest", "12.07% of pixels differ."],
      ["1440px · Payments hover", "12.08% of pixels differ."],
      ["1074px · rest", "13.11% of pixels differ."],
      ["768px · rest", "19.32% of pixels differ."],
      ["390px · rest", "18.90% of pixels differ."],
      ["1440px · text and artwork hidden", "0.05% of pixels differ."],
      ["1074px · text and artwork hidden", "0.07% of pixels differ."],
      ["768px · text and artwork hidden", "0.06% of pixels differ."],
      ["390px · text and artwork hidden", "0.03% of pixels differ."],
    ],
  },
  {
    slug: "safety-cards",
    icon: <SafetyCardsIcon />,
    name: "Safety Cards",
    description: "Three cards with line drawings for moderation, accountability, and provenance that animate on hover.",
    source: ["components/collected/SafetyCards.tsx", "components/collected/SafetyCards.module.css"],
    importCode: `import SafetyCards from "@/components/collected/SafetyCards";`,
    usage: `<SafetyCards />`,
    composition: `SafetyCards
├── Heading and Learn more link
└── Card rail
    └── Hover-animated diagram and caption × 3`,
    api: [
      {
        name: "SafetyCards",
        description: "Each diagram eases into a 6.4 to 7.8-second loop while its card is hovered and returns to its starting pose immediately on pointer exit. Touch and reduced-motion previews show still drawings.",
        props: [
          ["theme", '"light" | "dark"', '"light"', "Card, text, and illustration palette."],
          ["heading", "string", '"Safety, built in"', "Section heading."],
          ["cards", "readonly [Copy, Copy, Copy]", "Moderation, Accountability, Provenance", "Title and description for each diagram."],
          ["learnMoreHref", "string", '"https://elevenlabs.io/safety"', "Destination for the Learn more link."],
          ["animated", "boolean", "true", "Enables hover animation."],
        ],
      },
    ],
    examples: [
      {
        id: "light",
        title: "Light",
        code: `<SafetyCards />`,
        layout: { align: "stretch" },
        preview: <div className={safetyCardsStyles.frame}><SafetyCards /></div>,
      },
      {
        id: "dark",
        title: "Dark",
        code: `<SafetyCards theme="dark" />`,
        layout: { align: "stretch" },
        preview: <div className={safetyCardsStyles.frame} data-surface="dark"><SafetyCards theme="dark" /></div>,
      },
    ],
    frame: <div className={safetyCardsStyles.frame}><SafetyCards /></div>,
    origin: {
      site: "ElevenLabs",
      url: "https://elevenlabs.io/",
      capturedOn: "2026-11-10",
      selector: ".contextual-nav-root > .tw-relative > .blocks > .block-section:is(:nth-child(22), :nth-child(23))",
    },
    substitutions: [
      ["Static illustration files", "Drawings generated from geometric primitives", "Keeps the composition and allows the diagrams to move independently."],
      ["Still diagrams", "Hover-only loops", "Keeps the illustrations still until a pointer hovers over a card."],
      ["Regular-weight titles and 15px body copy", "Medium-weight titles and paraphrased 16px captions", "Follows the Collected type and contrast requirements."],
      ["Light palette", "Light and dark palettes", "Offers both Collected themes."],
      ["Viewport-based layout", "Container-based layout with three columns from 1000px", "Shows all three cards together in the desktop Collected preview."],
    ],
    fidelity: [
      ["1440px · reduced motion and Learn more hover", "2.84% of pixels differ in each state."],
      ["768px · reduced motion", "2.55% of pixels differ."],
      ["390px · reduced motion", "3.41% of pixels differ."],
      ["1440px · text and drawings hidden", "0.19% of pixels differ."],
      ["768px · text and drawings hidden", "0.07% of pixels differ."],
      ["390px · text and drawings hidden", "0.26% of pixels differ."],
    ],
  },
  {
    slug: "auth-feature-cards",
    icon: <AuthCardsIcon />,
    name: "Auth Feature Cards",
    description: "Three authentication cards with a sliding provider grid, a form collage, and a shield that fills with pixels on hover or tap.",
    source: ["components/collected/AuthFeatureCards.tsx", "components/collected/AuthFeatureCards.module.css"],
    importCode: `import AuthFeatureCards from "@/components/collected/AuthFeatureCards";`,
    usage: `<AuthFeatureCards theme="dark" />`,
    composition: `AuthFeatureCards
├── Heading and description
├── Provider grid with moving highlight
├── Authentication form collage
└── Shield with hover fill`,
    api: [
      {
        name: "AuthFeatureCards",
        description: "The provider grid moves every five seconds with a one-second ease-in-out slide. The shield fill fades in over 500ms on hover or tap and fades out on pointer exit or a tap elsewhere. Reduced motion freezes the grid and shows a still fill.",
        props: [
          ["theme", '"dark" | "light"', '"dark"', "Palette for both the illustrations and card surfaces."],
          ["heading / headingAccent", "string", "Two-line demo heading", "Muted first line and brighter second line."],
          ["description", "string", "Demo introduction", "Lead copy next to or below the heading."],
          ["cards", "readonly [Copy, Copy, Copy]", "Three demo captions", "Title and description for the provider, forms, and shield cards."],
          ["intervalMs", "number", "5000", "Milliseconds between grid moves. Set to 0 for a still grid."],
        ],
      },
    ],
    examples: [
      {
        id: "dark",
        title: "Dark",
        code: `<AuthFeatureCards />`,
        layout: { align: "stretch" },
        preview: <div className={authFeatureCardsStyles.frame} data-surface="dark"><AuthFeatureCards /></div>,
      },
      {
        id: "light",
        title: "Light",
        code: `<AuthFeatureCards theme="light" />`,
        layout: { align: "stretch" },
        preview: <div className={authFeatureCardsStyles.frame}><AuthFeatureCards theme="light" /></div>,
      },
    ],
    frame: <div className={authFeatureCardsStyles.frame} data-surface="dark"><AuthFeatureCards /></div>,
    origin: { site: "Supabase", url: "https://supabase.com/auth", capturedOn: "2026-11-10", selector: "#features" },
    substitutions: [
      ["Social provider logos and Supabase mark", "Original sign-in glyphs and a checkmark", "The illustration uses neutral symbols."],
      ["Manrope and 14–15px copy", "Inter with 16px body text and Collected heading weights", "Matches the Collected type scale and contrast requirements."],
      ["Supabase-specific description and mock account details", "Generic sign-in and access-control copy", "The cards can be reused for different products."],
      ["Random provider selection", "Repeatable sequence of measured grid offsets", "Keeps the five-second cadence and makes the preview repeatable."],
      ["Canvas-generated shield texture", "Clipped SVG pixels with phased opacity changes", "Recreates the hover fill without a canvas or added dependencies."],
      ["Continuous motion", "Offscreen pause and reduced-motion mode", "Stops the autoplay grid offscreen and keeps the shield fill still when reduced motion is enabled."],
    ],
    fidelity: [
      ["1440px · rest", "3.86% of pixels differ."],
      ["1440px · shield hover", "4.63% of pixels differ."],
      ["768px · rest", "7.80% of pixels differ."],
      ["390px · rest", "6.93% of pixels differ."],
      ["390px · shield tapped", "8.32% of pixels differ."],
      ["1440px · copy and illustrations hidden", "1.02% of pixels differ."],
      ["768px · copy and illustrations hidden", "2.01% of pixels differ."],
      ["390px · copy and illustrations hidden", "1.66% of pixels differ."],
    ],
  },
  {
    slug: "weave-tools",
    icon: <WeaveToolsIcon />,
    name: "Weave Tool Previews",
    description: "Tool chips surround a ceramic illustration on desktop. On phones, a swipeable rail switches between the previews.",
    source: ["components/collected/WeaveTools.tsx", "components/collected/WeaveTools.module.css"],
    importCode: `import WeaveTools from "@/components/collected/WeaveTools";`,
    usage: `<WeaveTools theme="light" />`,
    composition: `WeaveTools
├── Heading and supporting copy
├── Desktop image stage and tool chips
└── Mobile image stage and swipe rail`,
    api: [
      {
        name: "WeaveTools",
        description: "Hover or focus starts a 150ms reveal as the previous preview fades out in 50ms. Pointer exit or Escape restores the default image. On phones, tap or swipe to center a chip. Reduced motion switches previews instantly.",
        props: [
          ["theme", '"light" | "dark"', '"light"', "Palette for the grid, copy, and tool chips."],
          ["heading / subheading", "string", "Reference copy", "Text above the image stage."],
          ["image", "string", "Ceramic illustration", "Source image for the preview effects."],
          ["description", "string", "Colonnade description", "Accessible image description and Image Describer copy."],
        ],
      },
    ],
    examples: [
      {
        id: "light",
        title: "Light",
        code: `<WeaveTools />`,
        layout: { align: "stretch" },
        preview: <div className={weaveToolsStyles.frame}><WeaveTools /></div>,
      },
      {
        id: "dark",
        title: "Dark",
        code: `<WeaveTools theme="dark" />`,
        layout: { align: "stretch" },
        preview: <div className={weaveToolsStyles.frame}><WeaveTools theme="dark" /></div>,
      },
    ],
    frame: <div className={weaveToolsStyles.frame}><WeaveTools /></div>,
    origin: {
      site: "Figma Weave",
      url: "https://weave.figma.com/",
      capturedOn: "2026-11-10",
      selector: ".section_prof-tools, .section_prof-tools-mobile",
    },
    substitutions: [
      ["Ceramic photograph and rendered tool results", "A ceramic illustration with CSS effects and descriptive copy", "The local illustration demonstrates each effect."],
      ["Background image", "CSS grid and fade", "Recreates the background from its measured spacing and colors."],
      ["Figma Sans and oversized heading", "Arial with a 36px maximum heading", "Uses a system typeface and meets the Collected type scale."],
      ["Pointer-only chips", "Buttons with focus states and reduced motion support", "Works with keyboard and touch."],
      ["Looping phone carousel", "Native scroll snapping with a start and end", "Supports touch dragging and taps without adding a library."],
      ["Light surface", "Light and dark previews", "Both palettes share the same layout."],
    ],
    fidelity: [
      ["1440px · rest", "13.60% of pixels differ with the replacement photo and type."],
      ["1440px · Crop hover", "8.94% of pixels differ."],
      ["390px · rest", "47.14% of pixels differ with the replacement photo and type."],
      ["390px · Describer selected", "16.67% of pixels differ."],
      ["1440px · layout, photo and copy hidden", "0.29% of pixels differ."],
      ["390px · layout, photo, copy, and baked grid hidden", "0.28% of pixels differ."],
    ],
  },
  {
    slug: "card-swap",
    icon: <CardStackIcon />,
    name: "Card Swap",
    description:
      "A stack of photo cards in depth. Press the front card or fling it and it goes straight to the back while the rest step forward, or turn on auto to have it swap by itself.",
    source: ["components/collected/CardSwap.tsx", "components/collected/CardSwap.module.css"],
    importCode: `import CardSwap from "@/components/collected/CardSwap";`,
    usage: `<CardSwap theme="dark" />`,
    composition: `CardSwap
└── Card × n
    ├── Photo
    └── Tag`,
    api: [
      {
        name: "CardSwap",
        description: "Client component. Auto-swapping stops for prefers-reduced-motion and while hovered.",
        props: [
          ["cards", "{ src: string; label: string }[]", "4 sample illustrations", "Cards from front to back. Each src must be unique."],
          ["theme", `"dark" | "light"`, `"dark"`, "Colour of the card edge and tag. Pair it with a matching surface."],
          ["auto", "boolean", "false", "Swap by itself."],
          ["delay", "number", "4000", "Milliseconds between auto swaps. The original offers 2000–8000."],
          ["scale", "number", "--csw-scale or 1", "Render scale. The original scales to fit its preview pane."],
          ["labels", "boolean", "true", "Show each card's label. Not in the original; off where the deck is too small to read them."],
          ["onFrontChange", "(index: number) => void", "—", "Called with the front card's index when it changes. Not in the original; lets a caption follow the deck."],
          ["face", "(card, index) => ReactNode", "—", "Draws a card's face in place of its image, such as a video. Not in the original; lets the faces move."],
          ["cardSize", "{ width: number; height: number }", "196 × 246", "The card's size at scale 1; the deck keeps its spacing around it. Not in the original; lets the cards lie landscape."],
        ],
      },
      {
        name: "deckBounds",
        description:
          "Function, exported beside CardSwap. Returns { x, y, width, height }: the part of CardSwap's box, at scale 1, that the whole deck covers, so a parent can fit and centre the deck itself. Not in the original.",
        props: [
          ["count", "number", "—", "How many cards are in the deck."],
          ["cardSize", "{ width: number; height: number }", "196 × 246", "The same size passed to CardSwap."],
        ],
      },
      {
        name: "deckCorners",
        description:
          "Function, exported beside CardSwap. Returns each card's outline in CardSwap's box at scale 1: one per place in the deck, front first, each four { x, y } corners clockwise from the top left. Lets a parent keep a label or link clear of the deck itself. Not in the original.",
        props: [
          ["count", "number", "—", "How many cards are in the deck."],
          ["cardSize", "{ width: number; height: number }", "196 × 246", "The same size passed to CardSwap."],
        ],
      },
    ],
    examples: [
      {
        id: "default",
        title: "Dark",
        description: "Press the front card, or drag it more than 70px and let go. A shorter drag springs back.",
        code: `<CardSwap />`,
        layout: { align: "stretch", minHeight: 460 },
        preview: (
          <div style={{ background: "#171717", padding: "48px 24px", display: "grid", placeItems: "center" }}>
            <CardSwap />
          </div>
        ),
      },
      {
        id: "light",
        title: "Light",
        code: `<CardSwap theme="light" />`,
        layout: { align: "stretch", minHeight: 460 },
        preview: (
          <div style={{ background: "#f4f4f5", padding: "48px 24px", minHeight: 460, display: "grid", placeItems: "center" }}>
            <CardSwap theme="light" />
          </div>
        ),
      },
      {
        id: "auto",
        title: "Auto",
        description: "Swaps every four seconds and pauses while the pointer is over it.",
        code: `<CardSwap auto delay={4000} />`,
        layout: { align: "stretch", minHeight: 460 },
        preview: (
          <div style={{ background: "#171717", padding: "48px 24px", display: "grid", placeItems: "center" }}>
            <CardSwap auto delay={4000} />
          </div>
        ),
      },
    ],
    frame: (
      <div className={cardSwapStyles.frame}>
        <CardSwap />
      </div>
    ),
    origin: {
      site: "Bencho",
      url: "https://bencho.dev/blocks/card-swap?c=card-swap&theme=dark",
      capturedOn: "2026-11-01",
      selector: "body > div:nth-of-type(2) > div > div > div:nth-of-type(1) > div",
    },
    substitutions: [
      ["Bencho's four illustrated photos", "Four abstract illustrations", "Third-party artwork isn't copied."],
      ["Labels Mountain, Bloom, Peak, Wings", "Labels Orbit, Steps, Ribbon, Horizon", "The labels describe the sample artwork."],
      ["Pointer only", "Front card is a focusable button; Enter and Space swap it", "Supports visitors who prefer reduced motion."],
      ["Auto keeps running with reduced motion", "Auto and the card transition stop with prefers-reduced-motion", "Supports visitors who prefer reduced motion."],
      ["Fit-to-pane scale calculated by the page", "--csw-scale at the three measured widths: 1.25, 0.95, 0.8556", "The page's formula isn't part of the component, so widths in between can differ."],
      ["Fling threshold unknown", "70px", "Measured only as between 60px and 80px; exact value isn't visible from outside."],
      ["Control panel, code view, and site sound setting", "Left out", "They belong to Bencho's page; the panel's Fill, Auto, and Every controls are props here."],
      ["White fill shown on the dark pane", "theme=\"light\" shown on a light surface", "Every collected component has matching light and dark modes."],
    ],
    fidelity: [
      ["1440px · rest, photos and labels hidden", "0.12% of pixels differ"],
      ["768px · rest, photos and labels hidden", "0.10% of pixels differ"],
      ["390px · rest, photos and labels hidden", "0.06% of pixels differ"],
    ],
  },
  {
    slug: "feature-accordion",
    icon: <PanelsIcon />,
    name: "Feature Accordion",
    description:
      "Five full-height panels. Hover, focus, or click one and it widens to reveal its title, a soft colour glow, and an animated product preview. On phones it becomes a snapping horizontal scroller.",
    source: ["components/collected/FeatureAccordion.tsx", "components/collected/FeatureAccordion.module.css"],
    importCode: `import FeatureAccordion from "@/components/collected/FeatureAccordion";`,
    usage: `<FeatureAccordion defaultActive={1} />`,
    composition: `FeatureAccordion
└── Panel × 5
    ├── Rail (number, vertical label, plus)
    ├── Glow
    ├── Body (number, title, description)
    └── Preview (research, data, deck, workflows, or apps)`,
    api: [
      {
        name: "FeatureAccordion",
        description: "Client component. The panels' content is demo data inside the component file.",
        props: [
          ["defaultActive", "number", "0", "Index of the panel that starts open, 0–4."],
          ["theme", `"light" | "dark"`, `"light"`, "Dark inverts the greys and uses deeper glows in the same hues. It isn't on the original."],
        ],
      },
    ],
    examples: [
      {
        id: "default",
        title: "Light",
        description: "Move the pointer across the panels. Each one stays open until another takes over.",
        code: `<FeatureAccordion />`,
        layout: { align: "stretch", minHeight: 540 },
        preview: (
          <div style={{ background: "#fcfcfc", padding: "24px", minWidth: 0 }}>
            <FeatureAccordion />
          </div>
        ),
      },
      {
        id: "dark",
        title: "Dark",
        description: "Labels read towards the open panel: bottom-up on its left, top-down on its right.",
        code: `<FeatureAccordion theme="dark" />`,
        layout: { align: "stretch", minHeight: 540 },
        preview: (
          <div style={{ background: "#0a0a0a", padding: "24px", minWidth: 0 }}>
            <FeatureAccordion theme="dark" />
          </div>
        ),
      },
      {
        id: "data-analysis",
        title: "Data analysis open",
        code: `<FeatureAccordion defaultActive={1} />`,
        layout: { align: "stretch", minHeight: 540 },
        preview: (
          <div style={{ background: "#fcfcfc", padding: "24px", minWidth: 0 }}>
            <FeatureAccordion defaultActive={1} />
          </div>
        ),
      },
    ],
    frame: (
      <div className={featureAccordionStyles.pageFrame}>
        <FeatureAccordion />
      </div>
    ),
    origin: {
      site: "Sarvam",
      url: "https://www.sarvam.ai/",
      capturedOn: "2026-11-01",
      selector: "#indus-cowork .cw-row",
    },
    substitutions: [
      ["Matter (paid font)", "Figtree at the same sizes and weights", "Paid fonts aren't copied. Figtree is the closest free match, but text widths still differ slightly."],
      ["Sarvam's five presentation slides", "Five abstract illustrations", "Third-party artwork isn't copied."],
      ["Real app logos in Integrations", "Neutral tiles with each app's first letter", "Third-party brand marks aren't copied."],
      ["Word and HTML file icons", "One neutral file icon", "Third-party brand marks aren't copied."],
      ["Sarvam's interface icons and agent badge", "Simple redrawn line icons", "Their asset files aren't copied, so small icon shapes differ."],
      ["Composer's decorative tray image", "Its flat indigo background colour", "Their asset file isn't copied."],
      ["Mock product text", "Kept as demo text", "It describes the preview, not Sarvam's brand."],
      ["Every rail label reads bottom-up", "Labels right of the open panel read top-down", "Each label reads toward the open panel."],
      ["Light only", "Adds theme=\"dark\"", "Adds a dark preview to the catalog."],
      ["Title weight 425, description line height 1.35", "Weight 500, line height 1.4", "Collected type rules."],
    ],
    fidelity: [
      ["1440px · Research, layout only", "0.45% of pixels differ"],
      ["1440px · Data analysis, layout only", "0.47% of pixels differ"],
      ["1440px · Presentations, layout only", "0.10% of pixels differ"],
      ["1440px · Workflow automations, layout only", "0.23% of pixels differ"],
      ["1440px · Integrations, layout only", "1.13% of pixels differ"],
      ["768px · Research, layout only", "0.74% of pixels differ"],
      ["390px · Research, layout only", "1.01% of pixels differ"],
      ["1440px · as shipped, per panel", "3.15–18.14% of pixels differ (font, flipped labels, icons, logos, and slides)"],
    ],
  },
  {
    slug: "squeezy-carousel",
    icon: <NarrowingBarsIcon />,
    name: "Squeezy Carousel",
    description:
      "A row of image panels that narrow towards the right. Hover one and its neighbours squeeze to make room; click it, or use the arrows, and it slides into the large first position.",
    source: ["components/collected/SqueezyCarousel.tsx", "components/collected/SqueezyCarousel.module.css"],
    importCode: `import SqueezyCarousel from "@/components/collected/SqueezyCarousel";`,
    usage: `<SqueezyCarousel title="What’s happening" subtitle="See the latest." items={items} />`,
    composition: `SqueezyCarousel
├── Header (title, subtitle, previous and next)
├── Canvas (four panels and up to three slivers)
├── Details (one per item, cross-fading)
└── Scroller (replaces the canvas and arrows on phones)`,
    api: [
      {
        name: "SqueezyCarousel",
        description: "Client component. Keeps looping past either end. With reduced motion, panels skip the hover squeeze and slide in 200ms.",
        props: [
          ["title", "string", `"What’s happening"`, "First line of the heading."],
          ["subtitle", "string", `"See the latest from Stripe."`, "Second line of the heading, in grey."],
          ["items", "SqueezyCarouselItem[]", "8 demo items", "At least five, each with src, title, description, cta, href, and an optional collapsedOffsetX."],
          ["theme", `"light" | "dark"`, `"light"`, "Dark uses light text and softened indigo controls. It isn't on the original."],
        ],
      },
    ],
    examples: [
      {
        id: "default",
        title: "Light",
        description: "Move across the panels to squeeze them, click one to open it, or focus a link and use the arrow keys.",
        code: `<SqueezyCarousel />`,
        layout: { align: "stretch", minHeight: 560 },
        preview: (
          <div className={squeezyCarouselStyles.preview}>
            <SqueezyCarousel />
          </div>
        ),
      },
      {
        id: "dark",
        title: "Dark",
        code: `<SqueezyCarousel theme="dark" />`,
        layout: { align: "stretch", minHeight: 560 },
        preview: (
          <div className={squeezyCarouselStyles.preview} data-theme="dark">
            <SqueezyCarousel theme="dark" />
          </div>
        ),
      },
    ],
    frame: (
      <div className={squeezyCarouselStyles.frame}>
        <SqueezyCarousel />
      </div>
    ),
    origin: {
      site: "Stripe",
      url: "https://stripe.com/",
      capturedOn: "2026-11-01",
      selector: "section:has(> header.events-carousel__header)",
    },
    substitutions: [
      ["Söhne (paid font)", "Hanken Grotesk", "Paid fonts aren't copied. It was the closest free match of 13 measured."],
      ["Light type: weight 300, 32px heading, 22px copy on a 25px line", "Weights 400 and 500, 36px heading, 20px copy on a 28px line (smaller at narrower widths)", "Improves legibility in the catalog preview."],
      ["Light only", "Adds theme=\"dark\"", "Adds a dark preview to the catalog."],
      ["Stripe's eight images and videos, some with titles in the artwork", "Eight abstract illustrations", "Third-party artwork isn't copied."],
      ["Stripe's arrow icons", "Redrawn line arrows and chevrons", "Their icons aren't copied, so small shapes differ."],
      ["Link arrow grows a shaft on hover", "Chevron nudges 3px on hover", "A simpler stand-in for their icon animation."],
      ["Demo copy and links", "Kept as demo content", "It describes the preview, not the component."],
    ],
    fidelity: [
      ["1440px · rest, layout only", "0.32% of pixels differ; 22px taller from the larger type"],
      ["768px · rest, layout only", "0.56% of pixels differ; 23px taller from the larger type"],
      ["390px · rest, layout only", "2.23% of pixels differ; the larger type moves the heading and link"],
      ["All widths · as shipped", "57–66% of pixels differ (the replaced images and type)"],
    ],
  },
  {
    slug: "systems-diagram",
    icon: <HubIcon />,
    name: "Systems Diagram",
    description:
      "A central hub wired to the systems around it. Every four seconds the scene changes: systems fade in and out, app tiles flip in turn, and connector lines draw down to the blocks below.",
    source: ["components/collected/SystemsDiagram.tsx", "components/collected/SystemsDiagram.module.css"],
    importCode: `import SystemsDiagram from "@/components/collected/SystemsDiagram";`,
    usage: `<SystemsDiagram title="Connect to existing systems." description="…" />`,
    composition: `SystemsDiagram
├── Intro (lead sentence, description)
└── Diagram
    ├── Dot grid
    ├── App tiles × 6 and pipeline tile
    ├── Systems × 5
    ├── Hub and blocks
    └── Connector lines and PSP blocks × 4`,
    api: [
      {
        name: "SystemsDiagram",
        description: "Client component. It runs only while on screen. With reduced motion, it holds the first scene. The diagram's labels and scenes are demo data inside the component file.",
        props: [
          ["title", "string", `"Connect to existing systems."`, "Lead sentence of the intro."],
          ["description", "string", "Demo copy", "The rest of the intro, in a quieter colour."],
          ["theme", `"dark" | "light"`, `"dark"`, "Light uses pale trays and softer lines. It isn't on the original."],
        ],
      },
    ],
    examples: [
      {
        id: "dark",
        title: "Dark",
        description: "Scenes change every four seconds and pause when the diagram is off screen.",
        code: `<SystemsDiagram />`,
        layout: { align: "stretch", minHeight: 620 },
        preview: (
          <div className={systemsDiagramStyles.preview}>
            <SystemsDiagram />
          </div>
        ),
      },
      {
        id: "light",
        title: "Light",
        code: `<SystemsDiagram theme="light" />`,
        layout: { align: "stretch", minHeight: 620 },
        preview: (
          <div className={systemsDiagramStyles.preview} data-theme="light">
            <SystemsDiagram theme="light" />
          </div>
        ),
      },
    ],
    frame: (
      <div className={systemsDiagramStyles.frame}>
        <SystemsDiagram />
      </div>
    ),
    origin: {
      site: "Stripe",
      url: "https://stripe.com/",
      capturedOn: "2026-11-01",
      selector: ".developer-systems-animation",
    },
    substitutions: [
      ["Söhne (paid font)", "Hanken Grotesk", "Paid fonts aren't copied."],
      ["Light type: weight 300 intro, weight 400 labels", "Weight 500 lead and labels, weight 400 description, on a looser line", "Collected type rules."],
      ["Stripe wordmark in the hub", "Neutral \"core\" wordmark", "Third-party brand marks aren't copied."],
      ["Twenty-two real app logos", "Twelve abstract coloured tiles", "Third-party brand marks aren't copied. They flip on the same schedule."],
      ["Stripe's link icon", "Redrawn line icon", "Their icons aren't copied, so its shape differs slightly."],
      ["Japanese, Portuguese, and Thai PSP labels", "Left out", "This rebuild has no language switching."],
      ["Dark only", "Adds theme=\"light\"", "Every collected component has both modes; the light colours are not from the original."],
    ],
    fidelity: [
      ["1440px · positions of 8 key parts", "Within 3.2px; narrower labels pull the side parts inward"],
      ["768px · positions of 8 key parts", "Within 3.2px"],
      ["390px · positions of 8 key parts", "Within 0.5px"],
      ["Scene timing", "Same schedule as the original: 4s scenes, 1s first delay, 300ms tile stagger"],
    ],
  },
  {
    slug: "customer-stories",
    icon: <StoriesIcon />,
    name: "Customer Stories",
    description:
      "An expanding carousel with fictional customer stories. Select a neighboring mark to switch stories, or follow the active card’s link to read more.",
    source: ["components/collected/CustomerStories.tsx", "components/collected/CustomerStories.module.css", "lib/collected/customerStories.ts"],
    importCode: `import CustomerStories from "@/components/collected/CustomerStories";`,
    usage: `<CustomerStories />`,
    composition: `CustomerStories
└── Story × n
    ├── Project mark and title
    ├── Summary and highlight
    ├── Study figures
    └── Attribution and case study link
└── Previous, next, and compact project picker`,
    api: [
      {
        name: "CustomerStories",
        description: "Client component. The layout responds to the space it has, and motion stops for prefers-reduced-motion.",
        props: [
          ["stories", "CustomerStory[]", "4 fictional customer stories", "Company, mark, summary, stats, person, and optional title, logo, quote, highlight, and link."],
          ["theme", `"light" | "dark"`, `"light"`, "Dark is a warm counterpart of the light palette. It isn't on the original."],
          ["initialIndex", "number", "1 wide, 0 compact", "Overrides the story that opens first."],
        ],
      },
    ],
    examples: [
      {
        id: "light",
        title: "Light",
        description: "Choose a neighboring card, use the arrows, or swipe. Use the link on the active card to open its sample story.",
        code: `<CustomerStories />`,
        layout: { align: "stretch" },
        preview: (
          <div className={customerStoriesStyles.preview}>
            <CustomerStories />
          </div>
        ),
      },
      {
        id: "dark",
        title: "Dark",
        code: `<CustomerStories theme="dark" />`,
        layout: { align: "stretch" },
        preview: (
          <div className={customerStoriesStyles.preview} data-surface="dark">
            <CustomerStories theme="dark" />
          </div>
        ),
      },
    ],
    frame: (
      <div className={customerStoriesStyles.frame}>
        <CustomerStories />
      </div>
    ),
    origin: {
      site: "Lovable",
      url: "https://lovable.dev/",
      capturedOn: "2026-11-08",
      selector: "#main-content > div > div > section:nth-of-type(5) > div:nth-of-type(3)",
    },
    substitutions: [
      ["Camera Plain Variable (paid)", "Source Sans 3", "Paid fonts aren't copied."],
      ["Customer logos and portrait photos", "Four monochrome marks and fictional team initials", "Collapsed cards show only the project mark."],
      ["Customer quotes, figures, and staff names", "Fictional project summaries, figures, and team labels", "Provides sample data for all story fields."],
      ["Original typography and spacing", "Readable titles and body copy, with dividers between figures and attribution", "Keeps the content legible when the preview narrows."],
      ["Light only", "theme=\"dark\" on warm dark surfaces, gradient hues kept and softened", "Every collected component has both modes."],
      ["Gradient drift keeps running with reduced motion", "The drift and card transitions stop", "Supports visitors who prefer reduced motion."],
      ["Pointer-only collapsed cards", "Adjacent cards are buttons, and the focused carousel accepts Left and Right", "Keyboard access."],
      ["Separate phone layout", "Compact cards with the same content and a project icon picker", "Gives each case study a full-size touch target."],
      ["Read story on each card", "The active card links to a local sample story", "Makes the destination available from the full card."],
    ],
    fidelity: [
      ["Reworked layout", "Keeps the centered expanding card, 440ms easing, and moving quote rule. The revised layout has no pixel comparison."],
    ],
  },
  {
    slug: "lovable-feature-cards",
    icon: <FeatureCardsIcon />,
    name: "Lovable Feature Cards",
    description: "Three cards illustrate how a prompt becomes an app, how its design is refined, and what runs behind it.",
    source: ["components/collected/LovableFeatureCards.tsx", "components/collected/LovableFeatureCards.module.css"],
    importCode: `import LovableFeatureCards from "@/components/collected/LovableFeatureCards";`,
    usage: `<LovableFeatureCards />`,
    composition: `LovableFeatureCards
├── Prompt illustration and caption
├── Editor illustration and caption
└── Cloud illustration and caption`,
    api: [
      {
        name: "LovableFeatureCards",
        description: "The illustrations animate once when the cards enter view. Their glows drift a few pixels and settle over 4.8 seconds. The cards stack in a narrow container.",
        props: [
          ["features", "readonly [Feature, Feature, Feature]", "Three reference captions", "Each feature has a title and a description, in illustration order."],
          ["theme", '"light" | "dark"', '"light"', "Palette for the cards and their illustrations."],
          ["animated", "boolean", "true", "Controls the entrance and glow drift. Reduced motion always shows the settled state."],
        ],
      },
    ],
    examples: [
      {
        id: "light",
        title: "Light",
        code: `<LovableFeatureCards />`,
        layout: { align: "stretch" },
        preview: <div className={lovableFeatureCardsStyles.preview}><LovableFeatureCards /></div>,
      },
      {
        id: "dark",
        title: "Dark",
        code: `<LovableFeatureCards theme="dark" />`,
        layout: { align: "stretch" },
        preview: <div className={lovableFeatureCardsStyles.preview} data-surface="dark"><LovableFeatureCards theme="dark" /></div>,
      },
    ],
    frame: <div className={lovableFeatureCardsStyles.frame}><LovableFeatureCards /></div>,
    origin: {
      site: "Lovable",
      url: "https://lovable.dev/",
      capturedOn: "2026-11-08",
      selector: "#main-content > div > div > section:nth-of-type(2) > div:nth-of-type(2)",
    },
    substitutions: [
      ["Camera Plain Variable", "Reddit Sans", "Uses a free typeface with similar proportions."],
      ["14px caption copy", "16px caption copy", "Meets the Collected type floor. Line breaks can differ."],
      ["Product glyphs and overlays", "Redrawn SVG glyphs and CSS illustrations", "The visuals are self-contained and keep their measured placement."],
      ["Repeating illustration motion", "One entrance sequence that settles on the screenshot state", "Keeps the captions still and respects reduced motion."],
      ["Illustration glows", "A 4.8-second drift with a 7px horizontal and 3px vertical offset", "Adds subtle movement to the existing colours. The glows return to their starting positions."],
      ["Viewport breakpoints", "Container breakpoints", "The cards also adapt to the width of the Collected preview."],
      ["Light only", "Light and Dark previews", "Both themes use the same layout and motion."],
    ],
    fidelity: [
      ["1536px · settled", "4.93% of pixels differ against the supplied screenshot. The 1344 × 425px row matches. Most differences are in text and the redrawn illustrations."],
      ["390px · layout", "The cards stack in the same order as the source. Both themes fit the phone preview without horizontal scrolling."],
    ],
  },
  {
    slug: "media-mask",
    icon: <MediaMaskIcon />,
    name: "Media Mask",
    description: "A geometric cutout reveals moving copper and silver textures or a video.",
    source: ["components/collected/MediaMask.tsx", "components/collected/MediaMask.module.css"],
    importCode: `import MediaMask from "@/components/collected/MediaMask";`,
    usage: `<MediaMask />`,
    composition: `MediaMask\n├── Geometric or typographic cutout\n│   └── Animated surface and optional video\n└── Playback control`,
    api: [
      {
        name: "MediaMask",
        description: "The cutout keeps its proportions as the container changes. Reduced motion keeps the texture and video still.",
        props: [
          ["letters", "string", "—", "Shows up to two initials in place of the geometric cutout."],
          ["theme", '"light" | "dark"', '"dark"', "Sets the metal and control colors for the surrounding surface."],
          ["paused", "boolean", "false", "Shows a still without a playback control."],
          ["label", "string", "Geometric media mask", "Accessible description for the figure."],
          ["videoSrc", "string", "—", "Optional muted video that loops inside the cutout."],
          ["poster", "string", "—", "Still shown before the video plays."],
        ],
      },
    ],
    examples: [
      {
        id: "dark",
        title: "Dark",
        code: `<MediaMask />`,
        layout: { align: "stretch" },
        preview: <div className={mediaMaskStyles.preview}><MediaMask /></div>,
      },
      {
        id: "light",
        title: "Light",
        code: `<MediaMask theme="light" />`,
        layout: { align: "stretch" },
        preview: <div className={mediaMaskStyles.preview} data-surface="light"><MediaMask theme="light" /></div>,
      },
      {
        id: "video",
        title: "Video",
        code: `<MediaMask videoSrc="/demo/art/motion.webm" poster="/demo/art/motion-poster.webp" />`,
        layout: { align: "stretch" },
        preview: (
          <div className={mediaMaskStyles.preview}>
            <MediaMask videoSrc="/demo/art/motion.webm" poster="/demo/art/motion-poster.webp" />
          </div>
        ),
      },
    ],
    frame: <div className={mediaMaskStyles.frame}><MediaMask /></div>,
    origin: { site: "Webflow", url: "https://webflow.com/feature/devlink", capturedOn: "2026-11-07" },
    substitutions: [
      ["Webflow logo cutout", "Three geometric facets", "Shows how a custom shape can mask the same media."],
      ["Duracell page and footage", "An animated metal texture and an optional abstract motion loop", "Keeps the demo assets local."],
      ["Dark reference", "Dark and light previews", "Both use the same cutout and motion."],
      ["Playback control in the footage", "Keyboard-accessible Pause motion button below the mark", "Keeps the control visible outside the cutout."],
    ],
    fidelity: [["Reference", "The screenshot confirms the media cutout treatment. The original motion is absent from the linked live page."]],
  },
  {
    slug: "recurring-work-loop",
    icon: <RecurringLoopIcon />,
    name: "Recurring Work Loop",
    description: "Three recurring triggers send a pulse to their agent tiles. The tiles light up and a signal follows the dashed path back to the trigger list.",
    source: ["components/collected/RecurringWorkLoop.tsx", "components/collected/RecurringWorkLoop.module.css"],
    importCode: `import RecurringWorkLoop from "@/components/collected/RecurringWorkLoop";`,
    usage: `<RecurringWorkLoop />`,
    composition: `RecurringWorkLoop
├── Trigger panel
├── Outgoing and return wires
├── Agent tiles
└── Caption and playback control`,
    api: [
      {
        name: "RecurringWorkLoop",
        description: "The SVG rearranges in narrow containers. Playback pauses outside the viewport and follows reduced motion.",
        props: [
          ["title", "string", "Put recurring work on a loop.", "Caption lead."],
          ["description", "string", "Default caption", "Text below the lead."],
          ["triggers", "readonly [Trigger, Trigger, Trigger]", "Triage, review, summary", "Three labels, each with a cadence and task."],
          ["theme", '"light" | "dark"', '"dark"', "Palette for the surrounding surface."],
          ["animated", "boolean", "true", "Set to false for a still diagram."],
        ],
      },
    ],
    examples: [
      {
        id: "dark",
        title: "Dark",
        code: `<RecurringWorkLoop />`,
        layout: { align: "stretch" },
        preview: <div className={recurringWorkLoopStyles.preview}><RecurringWorkLoop /></div>,
      },
      {
        id: "light",
        title: "Light",
        code: `<RecurringWorkLoop theme="light" />`,
        layout: { align: "stretch" },
        preview: (
          <div className={recurringWorkLoopStyles.preview} data-surface="light">
            <RecurringWorkLoop theme="light" />
          </div>
        ),
      },
    ],
    frame: <div className={recurringWorkLoopStyles.frame}><RecurringWorkLoop /></div>,
    origin: {
      site: "Linear",
      url: "https://linear.app/ai",
      capturedOn: "2026-11-08",
      selector: ".kmKW8a_heroWrapper:has(> .kmKW8a_heroNoBackground)",
    },
    substitutions: [
      ["Berkeley Mono and Linear’s trigger icon", "IBM Plex Mono and two redrawn loops", "Uses a free font and a neutral glyph."],
      ["15px caption", "16px Inter at the same 24px line height", "Meets the Collected type floor. Line breaks can differ."],
      ["Variable trigger schedule", "A repeating eight-second cycle", "The three tile sequences use the measured 120ms frames, with repeatable trigger timing."],
      ["Viewport-based layout", "Compact diagram at a container width of 800px or less", "The diagram also adapts inside the library’s preview pane."],
      ["Dark only", "Light and Dark examples", "Both themes keep the same geometry and motion."],
      ["Automatic playback", "Adds a pause button and a still image under reduced motion", "Lets the viewer stop the animation."],
    ],
    fidelity: [
      ["1440px · still", "0.88% of pixels differ (0.05% with text and glyphs hidden). The card and diagram boxes match."],
      ["768px · still", "1.07% of pixels differ (0.05% with text and glyphs hidden). The card and diagram boxes match."],
      ["390px · still", "3.80% of overlapping pixels differ (0.37% with text and glyphs hidden). The diagram box matches. The larger caption adds one 24px line."],
      ["Motion", "The three tiles reproduce the row fill, moving cross, Pong rally, and shared clearing burst. The trigger schedule repeats every eight seconds."],
    ],
  },
  {
    slug: "copilot-surfaces",
    icon: <SurfacesIcon />,
    name: "Copilot Surfaces",
    description:
      "Three ways to use Copilot. A product preview sits on a dot grid, and the column underneath — desktop app, CLI, or editor — is the one that is open. It advances on its own, and the accent along the top of the open column fills while that preview plays.",
    source: ["components/collected/CopilotSurfaces.tsx", "components/collected/CopilotSurfaces.module.css"],
    importCode: `import CopilotSurfaces from "@/components/collected/CopilotSurfaces";`,
    usage: `<CopilotSurfaces theme="dark" />`,
    composition: `CopilotSurfaces
├── Preview (desktop, CLI, or editor)
├── Pause
└── Surface × 3
    ├── Tab
    └── Split button + menu`,
    api: [
      {
        name: "CopilotSurfaces",
        description:
          "Client component. Auto-advance and the preview transition stop for prefers-reduced-motion. The download label follows the visitor's platform unless platform is set.",
        props: [
          ["theme", `"dark" | "light"`, `"dark"`, "Dark matches the Copilot page. Light uses Primer's light palette."],
          ["auto", "boolean", "true", "Advance when the open surface's duration elapses. The captured page switches only on click; this turns that duration into the advance."],
          ["durations", "number[]", "15867, 18567, 18700", "Milliseconds each surface stays up, measured from the three product videos."],
          ["platform", `"mac-arm" | "mac-intel" | "win-arm" | "win-x64" | "linux"`, "detected", "Which download label is the primary action."],
          ["defaultIndex", "number", "0", "Surface that starts open."],
        ],
      },
    ],
    examples: [
      {
        id: "dark",
        title: "Dark",
        description: "The open column's accent fills, then the next surface takes over. Pause holds it.",
        code: `<CopilotSurfaces platform="mac-arm" />`,
        layout: { align: "stretch", minHeight: 980 },
        preview: (
          <div className={copilotSurfacesStyles.preview}>
            <CopilotSurfaces platform="mac-arm" />
          </div>
        ),
      },
      {
        id: "light",
        title: "Light",
        code: `<CopilotSurfaces theme="light" platform="mac-arm" />`,
        layout: { align: "stretch", minHeight: 980 },
        preview: (
          <div className={copilotSurfacesStyles.preview} data-theme="light">
            <CopilotSurfaces theme="light" platform="mac-arm" />
          </div>
        ),
      },
    ],
    frame: (
      <div className={copilotSurfacesStyles.frame}>
        <CopilotSurfaces auto={false} />
      </div>
    ),
    origin: {
      site: "GitHub",
      url: "https://github.com/features/copilot",
      capturedOn: "2026-11-07",
      selector: ".RiverBreakoutTabs__N_iDAG",
    },
    substitutions: [
      ["Product videos of the desktop app, CLI, and editor", "DOM illustrations of one frame from each video", "Third-party video isn't copied. The editor frame is the search.test.js moment."],
      ["GitHub mark, Copilot mark, and IDE logos", "Neutral app, prompt, and code glyphs; menu items are names only", "Brand marks aren't copied."],
      ["Mona Sans", "Inter, with IBM Plex Mono for code and commands", "Mona Sans isn't on Google Fonts."],
      ["Tabs change only when clicked; each video loops", "auto advances after 15.867s, 18.567s, and 18.7s, and the accent fills across that time", "Those are the measured video lengths. The captured page did not advance on its own."],
      ["Selected label weight 400", "Selected label weight 500", "Collected type rule: hierarchy uses weight. Size stays 20px so the longest label still fits the column."],
      ["Menu item weight 400", "Weight 500", "Collected type rule for links."],
      ["Dark marketing page only", "theme=\"light\" using Primer's light tokens", "Every collected component has both modes."],
      ["Keeps moving with reduced motion", "Auto-advance, the fill, and the preview rise stop", "Supports visitors who prefer reduced motion."],
      ["Pointer only on the tabs", "Arrow keys, Home, and End move the tab, and Escape closes a menu", "Supports visitors who prefer reduced motion."],
    ],
    fidelity: [
      ["1440px · rest, dark", "3.76% of pixels differ · 1280×900, sizes match"],
      ["1440px · rest, preview hidden", "1.12% of pixels differ"],
      ["1440px · hover, dark", "4.79% of pixels differ · 1280×900, sizes match"],
      ["768px · rest, dark", "1.87% of pixels differ · 688×900, sizes match"],
      ["390px · rest, dark", "5.41% of pixels differ · 390×844, sizes match"],
      ["390px · hover, dark", "7.48% of pixels differ · 390×844, sizes match"],
    ],
  },
  {
    slug: "page-peel",
    icon: <PeelIcon />,
    name: "Page Peel",
    description:
      "An app window on a sheet of paper with its corner turned up. Hover lifts the corner; click, press Enter or drag it to turn the page over and show the app's blueprint underneath, where its backend parts float.",
    source: ["components/collected/PagePeel.tsx", "components/collected/PagePeel.module.css"],
    importCode: `import PagePeel from "@/components/collected/PagePeel";`,
    usage: `<div style={{ containerType: "inline-size" }}>
  <PagePeel theme="dark" />
</div>`,
    composition: `PagePeel
├── Blueprint, under the page
│   ├── App window, drawn in outline
│   └── Labels × 3 (Backend, Queue, Daemon)
├── Page, cut along the fold
│   └── App window
│       ├── Sidebar (avatar, nav)
│       └── Chat (question, answer, composer)
├── Turned-up corner
└── Handle (a button: click, Enter, Space or drag)`,
    api: [
      {
        name: "PagePeel",
        description:
          "Client component, 432px tall and as wide as its parent. The corner moves on the original's springs; with reduced motion it jumps and the labels hold still. Like the original, its insets follow the nearest container with container-type: inline-size: 48px from 601px wide, and the labels sit higher from 961px.",
        props: [
          ["theme", `"dark" | "light"`, `"dark"`, "The original follows the visitor's system setting; both sets of colours are its own."],
          ["nav", "string[]", `["Dashboard", "Chat", "Team"]`, "The sidebar's items."],
          ["current", "number", "1", "Index of the selected sidebar item."],
          ["question", "string", `"how many incidents on my app today?"`, "The visitor's message."],
          ["answer", "string", "The original's reply", "The app's reply under it."],
          ["placeholder", "string", `"Ask a follow up…"`, "The composer's placeholder."],
        ],
      },
    ],
    examples: [
      {
        id: "dark",
        title: "Dark",
        description: "Hover to lift the corner. Click, press Enter, or drag the corner past halfway to turn the page over; do it again to lay it flat.",
        code: `<PagePeel />`,
        layout: { align: "stretch" },
        preview: (
          <div className={pagePeelStyles.preview}>
            <PagePeel />
          </div>
        ),
      },
      {
        id: "light",
        title: "Light",
        code: `<PagePeel theme="light" />`,
        layout: { align: "stretch" },
        preview: (
          <div className={pagePeelStyles.preview} data-theme="light">
            <PagePeel theme="light" />
          </div>
        ),
      },
    ],
    // vercel.com follows the visitor's system theme, so the frame does too; compare.mjs
    // --scheme checks each mode against the original's.
    frame: (
      <>
        {(["light", "dark"] as const).map((theme) => (
          <div key={theme} className={pagePeelStyles.frame} data-theme={theme}>
            <div className={pagePeelStyles.page}>
              <div className={pagePeelStyles.grid}>
                <div className={pagePeelStyles.slot}>
                  <PagePeel theme={theme} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    ),
    origin: {
      site: "Vercel",
      url: "https://vercel.com/backends",
      capturedOn: "2026-11-04",
      selector: "body > div:nth-of-type(2) > div > main > div > section:nth-of-type(1) > div > div:nth-of-type(2) > div",
    },
    substitutions: [
      ["Python logo on the Backend label; Vercel's Geist icons for Queue, Daemon and send", "Line icons drawn for this rebuild: braces, a list, a loop and an arrow", "Third-party logos and icons aren't copied."],
      ["Geist and Geist Mono from Vercel's build", "Geist and Geist Mono from Google Fonts", "The same free (OFL) typefaces, loaded with next/font."],
      ["Motion springs and tween", "A requestAnimationFrame spring and tween with the same stiffness, damping, mass, duration and curve", "No new dependency."],
      ["Vercel's lifecycle helper decides when the card is active", "Active while on screen, with the page visible and motion allowed", "The helper isn't public; this is what it was seen to do."],
      ["Follows the visitor's system theme", "theme prop, dark by default", "Collected components take their mode as a prop; the frame still follows the system, as the original page does."],
      ["No visible keyboard focus: the handle hides its outline, and its focus-ring class isn't defined in the site's CSS", "The site's own focus ring on keyboard focus (2px in the window colour, then 2px of blue), and a transparent outline that shows in forced colours", "Keyboard users need to see where focus is."],
    ],
    fidelity: [
      ["1440px · rest and hover, light and dark", "0% of pixels differ"],
      ["768px · rest and hover, light and dark", "0% of pixels differ"],
      ["390px · rest, light and dark", "0% of pixels differ"],
      ["390px · hover, light and dark", "0.01% of pixels differ (the redrawn send arrow)"],
      ["1440px · keyboard focus, with a 12px margin", "1.4% of pixels differ: the focus ring, which the original doesn't draw"],
      ["768px and 390px · open, light and dark", "0.13–0.15% of pixels differ on the card (the redrawn icons)"],
      ["1440px · open, mid-drag, after a drag", "0.22%, 0.18% and 0.42% of pixels differ (the redrawn icons, and the labels mid-float)"],
      ["Corner motion", "10–90% of a move in 191–192ms, against 184–195ms; 99% in 348–358ms, against 343–357ms; no overshoot on either"],
      ["Intro peek", "Peaks at 866ms against 865ms, dips past rest at 1233ms against 1223ms, and settles at 1858ms against 1848ms"],
      ["Reduced motion", "Same as the original: no peek, the labels hold still, and the corner jumps"],
    ],
  },
  {
    slug: "model-switcher",
    icon: <CodeCardIcon />,
    name: "Model Switcher",
    description:
      "A code sample with a tab for each of five AI SDK capabilities. Pick a model from the list beside it, or flip the AI Gateway switch, and the code rewrites itself; whatever a new model changed glows amber and fades. Below 961px, provider icons under the card take the list's place.",
    source: ["components/collected/ModelSwitcher.tsx", "components/collected/ModelSwitcher.module.css"],
    importCode: `import ModelSwitcher from "@/components/collected/ModelSwitcher";`,
    usage: `<div style={{ containerType: "inline-size" }}>
  <ModelSwitcher theme="dark" />
</div>`,
    composition: `ModelSwitcher
├── Card
│   ├── Tabs × 5 (Text, Image, Speech, Transcription, Video)
│   └── Code block
│       ├── Copy button (shows on hover or focus)
│       ├── Lines, each with a number that puts it in the URL
│       └── Fade at the bottom
├── AI Gateway switch (from 961px)
├── Provider icons (below 961px)
└── Model list (from 961px)
    ├── Search
    └── Models, or a link to AI Gateway when none match`,
    api: [
      {
        name: "ModelSwitcher",
        description:
          "Client component, as wide as its parent. Like the original, its layout follows the nearest container with container-type: inline-size: from 961px the card rises 32px, the gateway switch shows under it, and the model list hangs 40px past its left edge and 142px below it, so leave that room.",
        props: [
          ["theme", `"dark" | "light"`, `"dark"`, "The original follows the visitor's system setting; both sets of colours are its own."],
          ["capabilities", "Capability[]", "The original's five", "Each tab's label, the function its code calls, its input and log, and its models as [name, provider, id]."],
          ["defaultGateway", "boolean", "true", "Whether the AI Gateway switch starts on. On, the model is a string; off, the code imports the provider's package."],
        ],
      },
    ],
    examples: [
      {
        id: "dark",
        title: "Dark",
        description: "Pick a model to see what changes in the code, flip the switch to call the provider directly, or search the list. Click a line number to put that line in the URL.",
        code: `<ModelSwitcher />`,
        layout: { align: "stretch" },
        preview: (
          <div className={modelSwitcherStyles.preview}>
            <div className={modelSwitcherStyles.stage}>
              <ModelSwitcher />
            </div>
          </div>
        ),
      },
      {
        id: "light",
        title: "Light",
        code: `<ModelSwitcher theme="light" />`,
        layout: { align: "stretch" },
        preview: (
          <div className={modelSwitcherStyles.preview} data-theme="light">
            <div className={modelSwitcherStyles.stage}>
              <ModelSwitcher theme="light" />
            </div>
          </div>
        ),
      },
    ],
    // vercel.com follows the visitor's system theme, so the frame does too; compare.mjs
    // --scheme checks each mode against the original's.
    frame: (
      <>
        {(["light", "dark"] as const).map((theme) => (
          <div key={theme} className={modelSwitcherStyles.frame} data-theme={theme}>
            <div className={modelSwitcherStyles.page}>
              <section className={modelSwitcherStyles.section}>
                <div className={modelSwitcherStyles.grid}>
                  <ModelSwitcher theme={theme} />
                </div>
              </section>
            </div>
          </div>
        ))}
      </>
    ),
    origin: {
      site: "Vercel",
      url: "https://vercel.com/ai-sdk",
      capturedOn: "2026-11-04",
      selector: "body > div:nth-of-type(2) > div > main > div > section > div > div:nth-of-type(2)",
    },
    substitutions: [
      [
        "Provider logos in the model list and the phone icon row",
        "Each provider's initial on a small tile, with its name as a tooltip in the icon row. Mistral, Meta and Moonshot AI share M; Anthropic, Amazon and Alibaba share A; Black Forest Labs and ByteDance share B",
        "Third-party logos aren't copied.",
      ],
      ["Vercel's Geist icons for search, copy and the check marks", "Line icons drawn for this rebuild", "Their icons aren't copied."],
      ["Geist and Geist Mono from Vercel's build", "Geist and Geist Mono from Google Fonts", "The same free (OFL) typefaces, loaded with next/font."],
      ["Prism highlights the code", "The code is written as tokens, split where Prism splits them and in the same colours", "No new dependency."],
      ["Follows the visitor's system theme", "theme prop, dark by default", "Collected components take their mode as a prop; the frame still follows the system, as the original page does."],
      [
        "In light mode, line numbers in #a8a8a8, and the search placeholder and the empty list's text in #7d7d7d, on white",
        "#767676 for all three; dark mode's colours pass and are unchanged",
        "Quiet text needs 4.5:1 contrast; these reach 2.4:1 and 4.1:1.",
      ],
      [
        "The highlighted line's number stays grey, at 3.6:1 on the amber line in dark mode",
        "It turns to the text colour, as a number does on hover",
        "Quiet text needs 4.5:1 contrast on its surface.",
      ],
      ["The search field takes focus when the page loads", "It doesn't", "Taking focus on load would pull the docs page's focus into the demo."],
      [
        "No visible keyboard focus on the gateway switch: its ring class sets a shadow as a colour, which the browser drops",
        "Vercel's own focus ring around the track (2px of the card colour, then 2px of blue)",
        "Keyboard users need to see where focus is.",
      ],
      [
        "Model options outside a listbox, and the code block named on a plain div",
        "The options in a listbox named Models, and the code block as a named group",
        "Screen readers ignore a role or name the element can't carry.",
      ],
      ["With reduced motion, the copy check still scales in", "It only fades", "Reduced motion is honoured."],
      ["Links to /ai-gateway and /ai-gateway/models", "The same pages as full vercel.com links", "Relative links would point into this site."],
      ["“Copied!” announced from a live region added to the page's body", "The same announcement from a live region inside the component", "The component doesn't touch the page around it."],
    ],
    fidelity: [
      [
        "1440px · rest, light and dark",
        "0.58% and 0.53% of pixels differ: the provider tiles, the redrawn icons, light mode's line numbers, and “AI Gateway”, which Google's Geist sets 2.4px narrower",
      ],
      ["768px · rest, light and dark", "0.65% and 0.58% of pixels differ"],
      ["390px · rest, light and dark", "1.09% and 1.08% of pixels differ (the provider tiles fill more of the frame)"],
      ["1440px and 390px · hover, light and dark", "0.62% and 1.17% of pixels differ in light, 0.57% and 1.16% in dark"],
      ["1440px · keyboard focus, with a 12px margin", "0.53% and 0.49% of pixels differ; the copy button's focus ring matches"],
      ["Layout", "Every box measured matches at 1440, 768 and 390px: tabs, code lines, copy button, switch, model list and options, and phone icons"],
      ["Code", "All 43 models on the five tabs, with the gateway on and off, give the original's text and token colours exactly"],
      ["Amber glow", "Lights the same tokens with the gateway on and off; its opacity reads 0.279, 0.158 and 0.066 at 20, 150 and 300ms, against 0.278, 0.157 and 0.066"],
      [
        "Behaviour",
        "Matches in search, the empty list, copy (text, announcement, check for 1s), line anchors through switch flips, model and tab changes, keyboard order, and the phone icons",
      ],
    ],
  },
];

export const collectedBySlug = new Map(collectedDocs.map((doc) => [doc.slug, doc]));
