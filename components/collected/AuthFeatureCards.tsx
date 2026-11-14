"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./AuthFeatureCards.module.css";

type Copy = { title: string; description: string };
type Cards = readonly [Copy, Copy, Copy];
type Props = {
  theme?: "dark" | "light";
  heading?: string;
  headingAccent?: string;
  description?: string;
  cards?: Cards;
  intervalMs?: number;
};

const defaultCards: Cards = [
  { title: "All the social providers", description: "Let people sign in with accounts they already use. Offer social login alongside email sign-in." },
  { title: "Fully integrated", description: "Manage sign-in, account recovery, and user access together with built-in authorization." },
  { title: "Own your data", description: "Store user records in your database. Choose where to host them and control access row by row." },
];

const providerMarks = [
  "M4 7h16v11H4z M4 8l8 6 8-6",
  "M12 4v16M4 12h16M6 6l12 12M18 6L6 18",
  "M5 10a7 7 0 0 1 14 0M8 13v-3a4 4 0 0 1 8 0v5m-5 5c2-2 2-5 2-9M6 13c0 3-1 4-2 5m15-6v4c0 2-1 3-2 4",
  "M5 5h5v5H5z M14 5h5v5h-5z M5 14h5v5H5z M14 14h5v5h-5z",
  "M10 14l4-4m-6 6-1 1a3 3 0 0 1-4-4l4-4a3 3 0 0 1 4 0m5-1 1-1a3 3 0 0 1 4 4l-4 4a3 3 0 0 1-4 0",
  "M12 3l8 5v8l-8 5-8-5V8z M8 12l3 3 5-6",
  "M7 10V8a5 5 0 0 1 10 0v2M5 10h14v10H5z M12 14v2",
  "M4 12c3-6 13-6 16 0-3 6-13 6-16 0Z M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
  "M9 14a5 5 0 1 1 4-5L21 17l-3 3-2-2-2 2-4-5z",
  "M4 5h16v14H4z M8 9h4m-4 5h8",
  "M12 3l8 9-8 9-8-9z M8 12h8",
  "M4 17l4-6 3 3 4-7 5 10z",
  "M4 4h16v12H9l-5 4z M8 9h8m-8 3h5",
  "M6 8h12M4 12h16M8 16h8",
  "M12 4v16m-6-4 12-8m-12 0 12 8",
];

const stops = [[0, 0], [-3, 2], [1, -2], [-3, -3], [1, -2], [-1, 3]];
const tiles = Array.from({ length: 13 * 13 }, (_, index) => ({
  index,
  x: index % 13 - 6,
  y: Math.floor(index / 13) - 6,
  mark: providerMarks[index % providerMarks.length],
}));

function Providers({ intervalMs }: { intervalMs: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const schedule = () => {
      clearInterval(timer);
      if (visible && !reduced.matches && intervalMs > 0) {
        timer = setInterval(() => setStep((current) => (current + 1) % stops.length), intervalMs);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    observer.observe(element);
    reduced.addEventListener("change", schedule);
    return () => {
      clearInterval(timer);
      observer.disconnect();
      reduced.removeEventListener("change", schedule);
    };
  }, [intervalMs]);

  const [x, y] = stops[step];
  return (
    <div ref={ref} className={styles.providerArt} data-art="providers" aria-hidden="true">
      <div className={styles.providerGrid} data-step={step} style={{ transform: `translate(${x * 58}px, ${y * 58}px)` }}>
        {tiles.map((tile) => (
          <span key={tile.index} className={styles.tile} data-highlight={tile.x === -x && tile.y === -y}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d={tile.mark} />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

function Forms() {
  return (
    <div className={styles.formArt} data-art="forms" aria-hidden="true">
      <div className={styles.formCollage}>
        <div className={styles.sideForms}>
          <div className={styles.mockPanel}>
            <strong>Alex Parker</strong>
            <span>alex@example.com</span>
            <div className={styles.mockField}>Display name</div>
            <div className={styles.mockField}>Email address</div>
            <small>Connected account</small>
          </div>
          <div className={styles.mockPanel}>
            <strong>Profile</strong>
            <div className={styles.mockField}>Update details</div>
          </div>
        </div>
        <div className={styles.centerForms}>
          <div className={`${styles.mockPanel} ${styles.signup}`}>
            <div className={styles.accountMark}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5 9-10" />
              </svg>
            </div>
            <div><strong>Create an account</strong><span>Welcome. Enter your details to begin.</span></div>
            <div className={styles.mockActions}>
              <span>Continue with email</span>
              <span>Continue with single sign-on</span>
            </div>
          </div>
          <div className={`${styles.mockPanel} ${styles.reset}`}>
            <strong>Reset your password</strong>
            <div>New password<div className={styles.mockField}>••••••••</div></div>
            <div className={styles.mockSubmit}>Update password</div>
          </div>
        </div>
        <div className={styles.sideForms}>
          <div className={styles.mockPanel}>
            <div className={styles.mockField}>A　 Active users</div>
            <div className={styles.mockField}>M　 Members</div>
          </div>
          <div className={`${styles.mockPanel} ${styles.session}`}>
            Session
            <small>access granted</small><small>token verified</small><small>user.email</small><small>user.role</small>
          </div>
          <div className={styles.mockPanel}>Two-factor settings</div>
        </div>
      </div>
    </div>
  );
}

const shieldOutline = "M82 17Q88 11 94 17C111 31 127 37 140 37Q147 37 147 45V92C147 124 127 149 90 161Q88 162 86 161C49 149 29 124 29 92V45Q29 37 36 37C49 37 65 31 82 17Z";

// Separate the checkerboard into layers so the fill changes density without moving the pixels.
const pixelLayers = Array.from({ length: 4 }, () => "");
for (let y = 0; y < 44; y++) {
  for (let x = 0; x < 44; x++) {
    const patch = Math.floor(x / 5) + Math.floor(y / 4) * 9;
    const group = (patch ^ (patch >>> 2)) % pixelLayers.length;
    const noise = Math.imul(y * 44 + x + 1, 0x45d9f3b);
    if ((x + y) % 2 === 0 || ((noise ^ (noise >>> 16)) & 15) < 4) {
      pixelLayers[group] += `M${x * 4} ${y * 4}h4v4h-4z`;
    }
  }
}

function Shield() {
  const clip = useId();
  return (
    <div className={styles.shieldArt} data-art="shield" aria-hidden="true">
      <svg className={styles.guides} viewBox="0 0 480 480" fill="none" stroke="currentColor">
        <path d="M0 240H480M240 0V480M40 40L440 440M440 40L40 440" />
        <rect x="90" y="70" width="300" height="340" rx="28" />
        {[100, 140, 180].map((radius) => <circle key={radius} cx="240" cy="240" r={radius} />)}
        <g className={styles.shieldGlow}>
          <circle cx="240" cy="240" r="140" />
          <path d="M0 240H480M240 0V480" />
        </g>
      </svg>
      <svg className={styles.shield} viewBox="0 0 176 176" fill="none">
        <defs><clipPath id={clip}><path d={shieldOutline} /></clipPath></defs>
        <g className={styles.shieldPixels} clipPath={`url(#${clip})`} fill="currentColor" shapeRendering="crispEdges">
          {pixelLayers.map((path, index) => <path key={index} d={path} style={{ animationDelay: `${index * -0.38}s` }} />)}
        </g>
        <path d={shieldOutline} stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </div>
  );
}

export default function AuthFeatureCards({
  theme = "dark",
  heading = "Everything you need",
  headingAccent = "for user authentication",
  description = "Offer social sign-in, passwords, magic links, and phone verification with fine-grained access controls for every user.",
  cards = defaultCards,
  intervalMs = 5000,
}: Props) {
  const illustrations = [<Providers key="providers" intervalMs={intervalMs} />, <Forms key="forms" />, <Shield key="shield" />];
  return (
    <section className={styles.root} data-collected="auth-feature-cards" data-theme={theme} aria-label="Authentication features">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2>{heading} <span>{headingAccent}</span></h2>
          <p>{description}</p>
        </header>
        <div className={styles.cards}>
          {cards.map(({ title, description }, index) => (
            <article className={styles.card} key={index}>
              {illustrations[index]}
              <div className={styles.caption}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
