"use client";

import { Source_Sans_3 } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { sampleStories } from "@/lib/collected/customerStories";
import styles from "./CustomerStories.module.css";

const sourceSans = Source_Sans_3({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export type CustomerStory = {
  company: string;
  /** Short label for the collapsed card. */
  mark: string;
  title?: string;
  logo?: { src: string; width: number; height: number };
  summary: string;
  quote?: string;
  highlight?: string;
  stats: { value: string; label: string }[];
  person: { name: string; role: string; initials: string };
  href?: string;
};

type Props = {
  stories?: CustomerStory[];
  /** The original site is light. Dark is the collected counterpart. */
  theme?: "light" | "dark";
  /** Story to open first. The default is the second on wide layouts and the first on compact layouts. */
  initialIndex?: number;
};

function StoryLogo({ logo }: { logo: NonNullable<CustomerStory["logo"]> }) {
  return <Image {...logo} className={styles.logo} alt="" />;
}

function Arrow() {
  return (
    <svg className={styles.arrow} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M5.75 9.25 9.25 6l-3.5-3.25M9.25 6h-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M10 4.25 6 8l4 3.75" : "M6 4.25 10 8l-4 3.75"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StoryBody({ story, active }: { story: CustomerStory; active: boolean }) {
  return (
    <div className={styles.body} inert={!active} aria-hidden={!active || undefined}>
      <div className={styles.heading}>
        {story.logo && <StoryLogo logo={story.logo} />}
        <h3 className={styles.mark}>{story.title ?? story.mark}</h3>
      </div>
      <div className={styles.details}>
        <div className={styles.copy}>
          <p className={styles.summary}>{story.summary}</p>
          {story.quote && <blockquote className={styles.quote}>{story.quote}</blockquote>}
          {story.highlight && <p className={styles.quote}>{story.highlight}</p>}
        </div>
        {story.stats.length > 0 && (
          <dl className={styles.stats}>
            {story.stats.map(({ label, value }) => (
              <div className={styles.stat} key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.person}>
          <span className={styles.avatar} aria-hidden="true">{story.person.initials}</span>
          <div>
            <p className={styles.name}>{story.person.name}</p>
            <p className={styles.role}>{story.person.role}</p>
          </div>
        </div>
        {story.href && (
          <Link className={styles.read} href={story.href} prefetch={false} aria-label={`Read the ${story.title ?? story.company} case study`}>
            Read case study <Arrow />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function CustomerStories({ stories = sampleStories, theme = "light", initialIndex }: Props) {
  const [selected, setSelected] = useState(initialIndex ?? 1);
  const [navigated, setNavigated] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const active = Math.max(0, Math.min(stories.length - 1, selected));
  const story = stories[active];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width === 0) return;
      if (initialIndex === undefined && width < 800) setSelected(0);
      observer.disconnect();
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [initialIndex]);

  if (!story) return null;

  function go(index: number) {
    if (index < 0 || index >= stories.length || index === active) return;
    setNavigated(true);
    setSelected(index);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const offset = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
    if (!offset) return;
    event.preventDefault();
    if (event.target instanceof HTMLElement && event.target.closest("article")) {
      rootRef.current?.focus({ preventScroll: true });
    }
    go(active + offset);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    swiped.current = false;
    if (event.pointerType === "touch" && event.isPrimary) touch.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!touch.current || !event.isPrimary) return;
    const dx = event.clientX - touch.current.x;
    const dy = event.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swiped.current = true;
      go(active - Math.sign(dx));
    }
  }

  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!swiped.current || event.detail === 0) return;
    swiped.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${sourceSans.className}`}
      data-collected="customer-stories"
      data-theme={theme}
      data-navigated={navigated || undefined}
      role="region"
      aria-label="Customer stories"
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      <div
        className={styles.stage}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { touch.current = null; }}
        onClickCapture={onClickCapture}
      >
        {stories.map((item, index) => {
          const offset = index - active;
          const open = offset === 0;
          return (
            <article
              key={item.company}
              className={styles.card}
              data-active={open || undefined}
              style={{
                "--offset": offset,
                "--direction": Math.sign(offset),
                "--distance": Math.max(0, Math.abs(offset) - 1),
              } as CSSProperties}
            >
              <div className={styles.face} aria-hidden="true" />
              <StoryBody story={item} active={open} />
              {Math.abs(offset) === 1 && (
                <button
                  type="button"
                  className={styles.closed}
                  aria-label={`Show ${item.title ?? item.company}`}
                  onClick={(event) => {
                    if (event.detail === 0) rootRef.current?.focus({ preventScroll: true });
                    go(index);
                  }}
                >
                  {item.logo ? <StoryLogo logo={item.logo} /> : item.mark}
                </button>
              )}
            </article>
          );
        })}
      </div>

      {stories.length > 1 && (
        <div className={styles.nav}>
          <button type="button" className={styles.ctrl} aria-label="Previous story" aria-disabled={active === 0} onClick={() => go(active - 1)}>
            <Chevron dir="left" />
          </button>
          <p className={styles.position} aria-live="polite">
            <span className={styles.srOnly}>{story.company}, story </span>
            {active + 1} <span aria-hidden="true">/</span><span className={styles.srOnly}>of</span> {stories.length}
          </p>
          <div className={styles.picker} role="group" aria-label="Choose a case study">
            {stories.map((item, index) => (
              <button
                key={item.company}
                type="button"
                className={styles.pick}
                aria-label={item.title ?? item.company}
                aria-current={index === active ? "true" : undefined}
                onClick={() => go(index)}
              >
                {item.logo ? <StoryLogo logo={item.logo} /> : item.mark.slice(0, 2)}
              </button>
            ))}
          </div>
          <button type="button" className={styles.ctrl} aria-label="Next story" aria-disabled={active === stories.length - 1} onClick={() => go(active + 1)}>
            <Chevron dir="right" />
          </button>
        </div>
      )}
    </div>
  );
}
