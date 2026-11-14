"use client";

import { Reddit_Sans } from "next/font/google";
import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./LovableFeatureCards.module.css";

const redditSans = Reddit_Sans({ subsets: ["latin"], display: "swap" });

type Feature = { title: string; description: string };
type Features = readonly [Feature, Feature, Feature];

type Props = {
  features?: Features;
  theme?: "light" | "dark";
  animated?: boolean;
};

const featuresFromReference: Features = [
  {
    title: "You bring the idea. Lovable brings it to life.",
    description: "Describe what you want in plain language. Watch as Lovable builds production-grade software with you in real time.",
  },
  {
    title: "Refine your design and deploy",
    description: "Iterate on your creation until you’re happy with the finished product. Then ship your idea and start using it immediately.",
  },
  {
    title: "Depend on Lovable, from end to end",
    description: "Lovable handles your end-to-end infrastructure – from hosting and authentication to payments and integrations.",
  },
];

const tools = [
  { label: "Analytics", path: "M4 4v15h16M7 14l4-4 3 2 5-6" },
  { label: "Cloud", path: "M7 19a4.5 4.5 0 0 1-1.2-8.8A5.8 5.8 0 0 1 17 9a5 5 0 0 1 0 10Z" },
  { label: "Connectors", path: "M9 6a3 3 0 1 0-6 0 3 3 0 0 0 6 0Zm12 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0ZM9 18a3 3 0 1 0-6 0 3 3 0 0 0 6 0Zm0 0h4a5 5 0 0 0 5-5V9" },
  { label: "Security", path: "M12 2 4 6v5c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V6Z" },
  { label: "Agent integrations", path: "m10 4-6 6a2.8 2.8 0 0 0 0 4l6 6a2.8 2.8 0 0 0 4 0l6-6a2.8 2.8 0 0 0 0-4l-6-6a2.8 2.8 0 0 0-4 0Z" },
  { label: "Payments", path: "M6 5h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3ZM3 10h18M7 15h4" },
  { label: "SEO & AI search", path: "M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-2 6 5 5" },
];

function Glyph({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

function PromptIllustration() {
  return (
    <div className={styles.promptScene}>
      <div className={styles.promptWindow}>
        <span className={styles.caret} />
        <span className={styles.promptText}>Create an online store...</span>
      </div>
    </div>
  );
}

function EditorIllustration() {
  return (
    <div className={styles.editorScene}>
      <div className={styles.editorWindow}>
        <div className={styles.toolbar}>
          <span className={styles.previewPill}>
            <Glyph path="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />
            Preview
          </span>
          <span className={styles.toolbarIcons}>
            <Glyph path="M6 3h8l4 4v14H6zM13 3v5h5M9 12h6m-6 4h6" />
            <Glyph path="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" />
            <Glyph path="m3 7 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5m-18 5 9 5 9-5" />
          </span>
        </div>
        <div className={styles.editorPage}>
          <span className={styles.mockHeading}>Bug tracking for teams<br />that ship fast</span>
          <p>Purpose-built for engineering teams. Triage, track,<br />and resolve issues without slowing down.</p>
          <span className={styles.mockButton}>Get started for free</span>
        </div>
      </div>
      <div className={styles.selection}>
        <span className={styles.headingTag}>h1</span>
        <svg className={styles.pointer} viewBox="0 0 20 24">
          <path d="M2 1.7 17.5 17l-8.3-.6-6.2 5.3Z" fill="#171717" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function CloudIllustration() {
  return (
    <div className={styles.cloudScene}>
      <div className={styles.cloudWindow}>
        <div className={styles.cloudMenu}>
          {tools.map(({ label, path }) => (
            <div className={styles.cloudRow} key={label} data-selected={label === "Cloud" ? "" : undefined}>
              <Glyph path={path} />
              {label}
            </div>
          ))}
        </div>
        <div className={styles.cloudCanvas} />
      </div>
    </div>
  );
}

const illustrations: readonly ReactNode[] = [<PromptIllustration key="prompt" />, <EditorIllustration key="editor" />, <CloudIllustration key="cloud" />];

export default function LovableFeatureCards({ features = featuresFromReference, theme = "light", animated = true }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (!animated || !root.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasEntered(true);
        observer.disconnect();
      }
    });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <div ref={root} className={`${styles.root} ${redditSans.className}`} data-theme={theme} data-animate={animated && hasEntered ? "" : undefined} data-collected="lovable-feature-cards">
      <div className={styles.grid}>
        {features.map(({ title, description }, index) => (
          <article className={styles.card} key={index}>
            <div className={styles.illustration} aria-hidden="true">{illustrations[index]}</div>
            <div className={styles.copy}>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
