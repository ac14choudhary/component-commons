"use client";

import { Hanken_Grotesk } from "next/font/google";
import { useEffect, useRef, useState, type ReactNode, type TransitionEvent } from "react";
import styles from "./SystemsDiagram.module.css";

const hanken = Hanken_Grotesk({ subsets: ["latin"] });

type Mark = { color: string; ink: string; shape: ReactNode };

// Abstract tiles in place of the original's third-party logos.
const circle = <circle cx="12" cy="12" r="6.5" />;
const square = <rect x="6" y="6" width="12" height="12" rx="2.5" />;
const triangle = <path d="M12 5.5 19 18H5Z" />;
const diamond = <path d="m12 4.5 7.5 7.5-7.5 7.5L4.5 12Z" />;
const ring = <path fillRule="evenodd" d="M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" />;
const bars = <path d="M6 6h3v12H6Zm4.5 3h3v9h-3Zm4.5-5h3v14h-3Z" />;

const MARKS: Mark[] = [
  { color: "#ffd84d", ink: "#2b2300", shape: circle },
  { color: "#22b8e6", ink: "#fff", shape: bars },
  { color: "#ffffff", ink: "#1f6feb", shape: ring },
  { color: "#ff6a3d", ink: "#fff", shape: diamond },
  { color: "#e6e6f0", ink: "#3f3f55", shape: square },
  { color: "#2fa84f", ink: "#fff", shape: triangle },
  { color: "#1f6feb", ink: "#fff", shape: square },
  { color: "#111118", ink: "#fff", shape: diamond },
  { color: "#ef4d5f", ink: "#fff", shape: ring },
  { color: "#ffffff", ink: "#6c47ff", shape: bars },
  { color: "#7c5cff", ink: "#fff", shape: circle },
  { color: "#14b8a6", ink: "#fff", shape: triangle },
];

// All from the original: which tile shows what in each of the four scenes.
const TILES: (number | null)[][] = [
  [null, 0, null, 7],
  [6, 1, 11, 1],
  [9, 2, 3, 6],
  [null, 3, null, null],
  [2, 8, 4, 9],
  [8, 5, 10, 8],
];
const PIPELINE = [1, 9, 6, 2];
const SYSTEMS = ["ERP", "CRM", "Subscriptions", "Legacy billing", "Booking system"];
const SCENES = [
  { systems: [0, 1, 2, 3, 4], psps: [0, 1, 2, 3] },
  { systems: [1, 4], psps: [] as number[] },
  { systems: [1, 2, 4], psps: [1, 2] },
  { systems: [0, 2, 3, 4], psps: [0, 1, 2] },
];
const PSP_PATHS = [
  "M81.0576 0.342323C81.0576 13.3582 81.0576 11.8288 81.0576 18.4909C81.0576 22.9092 77.4759 26.4913 73.0577 26.4913L28.511 26.4915C24.0927 26.4916 20.511 30.0733 20.511 34.4915L20.511 59.9819",
  "M90.5 0L90.5 41.1113C90.5 45.5393 86.9031 49.125 82.4751 49.1113L78.5874 49.0992C74.1594 49.0854 70.5625 52.6712 70.5625 57.0992L70.5625 59.938",
  "M100.5 0L100.5 41.1113C100.5 45.5393 104.097 49.125 108.525 49.1113L112.413 49.0992C116.841 49.0854 120.437 52.6712 120.437 57.0992L120.437 59.938",
  "M109.942 0.342323C109.942 13.3582 109.942 11.8288 109.942 18.4909C109.942 22.9092 113.524 26.4913 117.942 26.4913L162.489 26.4915C166.907 26.4916 170.489 30.0733 170.489 34.4915L170.489 59.9819",
];
const FIRST_DELAY = 1000;
const SCENE_DURATION = 4000;
const FLIP_STAGGER = 300;

function Face({ mark }: { mark: number | null }) {
  if (mark === null) return <span className={styles.placeholder} />;
  const { color, ink, shape } = MARKS[mark];
  return (
    <span className={styles.mark} style={{ background: color, color: ink }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{shape}</svg>
    </span>
  );
}

// Turns half a revolution each scene. The face turned away gets its next mark once the turn ends.
function Tile({ items, scene, delay }: { items: (number | null)[]; scene: number; delay: number }) {
  const flipper = useRef<HTMLDivElement>(null);
  const [front, setFront] = useState(0);
  const [back, setBack] = useState(1);

  useEffect(() => {
    if (scene === 0) return;
    const timer = window.setTimeout(() => {
      if (flipper.current) flipper.current.style.transform = `rotateX(${180 * scene}deg)`;
    }, delay);
    return () => window.clearTimeout(timer);
  }, [scene, delay]);

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.propertyName !== "transform" || event.target !== flipper.current) return;
    const next = (scene + 1) % items.length;
    if (scene % 2 === 0) setBack(next);
    else setFront(next);
  };

  return (
    <div className={styles.tile}>
      <div ref={flipper} className={styles.flipper} onTransitionEnd={onTransitionEnd}>
        <div className={styles.front}><Face mark={items[front]} /></div>
        <div className={styles.back}><Face mark={items[back]} /></div>
      </div>
    </div>
  );
}

const Block = ({ children, middle }: { children: ReactNode; middle?: boolean }) => (
  <div className={`${styles.block} ${middle ? styles.blockMiddle : ""}`}>{children}</div>
);

type Props = {
  title?: string;
  description?: string;
  theme?: "dark" | "light";
};

export default function SystemsDiagram({
  title = "Connect to existing systems.",
  description = "Orchestrate payments across multiple processors, build custom workflows, and connect to third parties using APIs, partner apps, or prebuilt integrations.",
  theme = "dark",
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  // Counts up forever; tiles rotate by it, and the scene is its remainder.
  const [step, setStep] = useState(0);
  const scene = SCENES[step % SCENES.length];

  useEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let timeout = 0;
    let interval = 0;
    const stop = () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
    const sync = () => {
      stop();
      if (!visible || document.hidden) return;
      timeout = window.setTimeout(() => {
        setStep((value) => value + 1);
        interval = window.setInterval(() => setStep((value) => value + 1), SCENE_DURATION);
      }, FIRST_DELAY);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // Tiles that change flip one after another; tiles empty in both scenes don't count.
  let flipping = 0;
  const delays = TILES.map((items) => {
    const previous = items[(step + items.length - 1) % items.length];
    const current = items[step % items.length];
    return previous !== null || current !== null ? FLIP_STAGGER * flipping++ : 0;
  });

  const system = (index: number) => (
    <div key={SYSTEMS[index]} className={styles.slot} data-on={scene.systems.includes(index) || undefined}>
      <div className={styles.system}>{SYSTEMS[index]}</div>
    </div>
  );

  return (
    <section className={`${hanken.className} ${styles.root}`} data-collected="systems-diagram" data-theme={theme}>
      <div className={styles.intro}>
        <h3 className={styles.lead}>{title}</h3> <p className={styles.description}>{description}</p>
      </div>

      <div ref={root} className={styles.diagram}>
        <div className={styles.dots} />
        <figure className={styles.figure}>
          <figcaption className={styles.srOnly}>
            Diagram of a central platform connected to business systems such as ERP, CRM, and subscriptions through SDK,
            Event Destinations, App Marketplace, Data Pipeline, and Orchestration.
          </figcaption>
          <svg className={styles.centerPath} width="1000" height="386" viewBox="0 0 1000 386" fill="none" aria-hidden="true">
            <path d="M1000 194H0" className={styles.line} strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          </svg>
          <svg className={styles.centerPathMobile} width="592" height="83" viewBox="0 0 592 83" fill="none" aria-hidden="true">
            <path d="M0 1h529.645c4.661 0 8.441 3.582 8.441 8v74" className={styles.line} strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          </svg>

          <div className={styles.chartLeft}>
            <div className={styles.apps} aria-hidden="true">
              {TILES.map((items, index) => (
                <Tile key={index} items={items} scene={step} delay={delays[index]} />
              ))}
            </div>
          </div>

          <div className={styles.chartCenter}>
            <div className={styles.systems}>
              <div className={styles.rowOne}>{[0, 1, 2].map(system)}</div>
              <div className={styles.rowTwo}>{[3, 4].map(system)}</div>
            </div>

            <div className={styles.layoutTop} aria-hidden="true">
              <svg className={styles.connections} width="313" height="215" viewBox="0 0 313 215" fill="none">
                <path d="M1 0V96.976C1 101.395 4.582 104.976 9 104.976H118.527H148.372C152.79 104.976 156.372 108.558 156.372 112.976V214.258" className={styles.line} strokeDasharray="2 2" />
                <path d="M311.671 0V96.976C311.671 101.395 308.09 104.976 303.671 104.976H194.144H164.3C159.882 104.976 156.3 108.558 156.3 112.976V114.258" className={styles.line} strokeDasharray="2 2" />
              </svg>
              <svg className={styles.connectionsMobile} width="190" height="340" viewBox="0 0 190 340" fill="none">
                <path d="M1.00027 0L1 158.584C0.999992 163.002 4.58172 166.584 9 166.584H72.0989H86.9932C91.4114 166.584 94.9932 170.165 94.9932 174.584V340" className={styles.line} strokeDasharray="2 2" />
                <path d="M189 0V158.584C189 163.002 185.418 166.584 181 166.584H117.901H103.007C98.5886 166.584 95.0068 170.165 95.0068 174.584V181.313" className={styles.line} strokeDasharray="2 2" />
              </svg>
              <div className={styles.anchor}>
                <Block>SDK</Block>
                <Block>Event Destinations</Block>
              </div>
            </div>

            <div className={styles.layoutMiddle}>
              <a className={styles.link} href="https://marketplace.stripe.com/" target="_blank" rel="noreferrer">
                App Marketplace
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 2H2.5A1.5 1.5 0 0 0 1 3.500v6A1.500 1.500 0 0 0 2.500 11h6A1.500 1.500 0 0 0 10 9.500V8M7 1h4v4M11 1 5 7" />
                </svg>
              </a>
              <div aria-hidden="true"><Block middle>Data Pipeline</Block></div>
            </div>

            <div className={styles.hub} aria-hidden="true">
              <span className={styles.hubCenter}>core</span>
            </div>

            <div className={styles.layoutBottom} aria-hidden="true">
              <Block>Orchestration</Block>
            </div>

            <svg className={styles.pspPaths} width="191" height="102" viewBox="0 0 191 102" fill="none" aria-hidden="true">
              {PSP_PATHS.map((path, index) => (
                <path key={path} className={styles.pspPath} data-on={scene.psps.includes(index) || undefined} d={path} strokeDasharray="120" />
              ))}
              {PSP_PATHS.map((path) => (
                <path key={path} className={styles.pspBase} d={path} strokeDasharray="2 2" />
              ))}
            </svg>

            <div className={styles.psps} aria-hidden="true">
              {PSP_PATHS.map((path, index) => (
                <div key={path} className={styles.pspSlot} data-on={scene.psps.includes(index) || undefined}>
                  <div className={styles.psp}>PSP</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.chartRight} aria-hidden="true">
            <Tile items={PIPELINE} scene={step} delay={0} />
          </div>
        </figure>
      </div>
    </section>
  );
}
