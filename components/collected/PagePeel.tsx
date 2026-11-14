"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import styles from "./PagePeel.module.css";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--pp-mono" });

type Vec = { x: number; y: number };
type Size = { w: number; h: number };
type Spring = { type: "spring"; stiffness: number; damping: number; mass: number };
type Tween = { type: "tween"; duration: number; ease: [number, number, number, number] };

// All from the original. A pull is how far the corner is drawn in from the bottom right, in
// px; the fold runs halfway between the corner and where its tip lands.
const REST: Vec = { x: 112, y: 112 };
const LIFTED: Vec = { x: 176, y: 136 };
const PEEK: Vec = { x: 216, y: 152 };
const SETTLE: Spring = { type: "spring", stiffness: 240, damping: 28, mass: 0.9 };
const PEEK_OUT: Tween = { type: "tween", duration: 900, ease: [0.22, 1, 0.36, 1] };
const PEEK_BACK: Spring = { type: "spring", stiffness: 120, damping: 11, mass: 1 };
const PEEK_DELAY = 600;
// A press that moves less than this (in px, across and down) is a click.
const CLICK_SLOP = 4;
const openPull = ({ w, h }: Size): Vec => ({ x: 1.05 * w, y: 0.35 * h });
const clampPull = ({ x, y }: Vec, { w, h }: Size): Vec => ({
  x: Math.min(1.3 * w, Math.max(REST.x, x)),
  y: Math.min(h, Math.max(REST.y, y)),
});
const length = ({ x, y }: Vec) => Math.hypot(x, y);
const FALLBACK_SIZE: Size = { w: 600, h: 432 };
// A spring is done within half a pixel and two pixels a second of its target.
const REST_DELTA = 0.5;
const REST_SPEED = 2;

/** The fold for a pull: its unit direction and the point halfway along it. */
function fold(pull: Vec, { w, h }: Size) {
  const reach = length(pull);
  return { n: { x: pull.x / reach, y: pull.y / reach }, mid: { x: w - pull.x / 2, y: h - pull.y / 2 }, reach };
}

/** The card's box cut along the fold: the page side (-1) or the corner side (1). */
function cut({ w, h }: Size, mid: Vec, n: Vec, side: 1 | -1): Vec[] {
  const box = [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h }];
  const beyond = (p: Vec) => side * ((p.x - mid.x) * n.x + (p.y - mid.y) * n.y);
  const kept: Vec[] = [];
  box.forEach((a, i) => {
    const b = box[(i + 1) % box.length];
    const da = beyond(a);
    const db = beyond(b);
    if (da >= 0) kept.push(a);
    if (da >= 0 !== db >= 0) {
      const t = da / (da - db);
      kept.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  });
  return kept;
}

// Measured from the far edges, so the shape holds before the card has been measured.
const fromEdge = (value: number, size: number) =>
  value <= 0.01 ? "0" : size - value <= 0.01 ? "100%" : `calc(100% - ${(size - value).toFixed(2)}px)`;
const polygon = (points: Vec[], { w, h }: Size) => `polygon(${points.map((p) => `${fromEdge(p.x, w)} ${fromEdge(p.y, h)}`).join(", ")})`;

/** Styles for the page (clipped along the fold) and the corner turned over it. */
function peel(pull: Vec, size: Size) {
  const { n, mid, reach } = fold(pull, size);
  // The flap is the cut-off corner mirrored across the fold. Its shading runs from the corner
  // out to the fold, half a pull away, and turns over with it.
  const at = (inset: number) => `${(reach / 2 - inset).toFixed(2)}px`;
  const angle = ((Math.atan2(-n.x, n.y) * 180) / Math.PI).toFixed(2);
  const xx = (1 - 2 * n.x * n.x).toFixed(4);
  const xy = (-2 * n.x * n.y).toFixed(4);
  const yy = (1 - 2 * n.y * n.y).toFixed(4);
  return {
    page: polygon(cut(size, mid, n, -1), size),
    flap: polygon(cut(size, mid, n, 1), size),
    shade: `linear-gradient(${angle}deg, var(--pp-peel-paper) ${at(56)}, var(--pp-peel-shade) ${at(18)}, var(--pp-peel-highlight) ${at(3)}, var(--pp-peel-crease) ${at(0)})`,
    turn: `translate(${-pull.x}px, ${-pull.y}px) matrix(${xx}, ${xy}, ${xy}, ${yy}, 0, 0)`,
  };
}

/** Whether a point on the card lies on the turned-up corner. */
function onFlap(point: Vec, pull: Vec, size: Size) {
  const { n, mid } = fold(pull, size);
  const beyond = (point.x - mid.x) * n.x + (point.y - mid.y) * n.y;
  if (beyond > 0) return false;
  // Where this part of the flap sat before the corner turned over
  const x = point.x - 2 * beyond * n.x;
  const y = point.y - 2 * beyond * n.y;
  return x >= 0 && x <= size.w && y >= 0 && y <= size.h;
}

function cubicBezier([x1, y1, x2, y2]: Tween["ease"]) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const curveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const curveY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (progress: number) => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;
    let t = progress;
    for (let i = 0; i < 8; i++) {
      const error = curveX(t) - progress;
      if (Math.abs(error) < 1e-6) return curveY(t);
      const slope = slopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= error / slope;
    }
    let low = 0;
    let high = 1;
    t = progress;
    while (high - low > 1e-6) {
      if (curveX(t) < progress) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return curveY(t);
  };
}

const INITIAL = peel(REST, { w: 10000, h: 10000 });

const icon = (path: ReactNode, size: number) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {path}
  </svg>
);

// The backend's parts on the blueprint, placed as on the original.
const CALLOUTS = [
  {
    label: "Backend",
    path: <path d="M5.5 2.75c-1.4 0-2 .6-2 1.9v1.6c0 .9-.45 1.45-1.5 1.75 1.05.3 1.5.85 1.5 1.75v1.6c0 1.3.6 1.9 2 1.9M10.5 2.75c1.4 0 2 .6 2 1.9v1.6c0 .9.45 1.45 1.5 1.75-1.05.3-1.5.85-1.5 1.75v1.6c0 1.3-.6 1.9-2 1.9" />,
    style: { left: "64%", top: "calc(-6% + var(--callout-shift))", animationDelay: "-1.4s" },
  },
  {
    label: "Queue",
    path: <path d="M2.75 4h7.5M2.75 8h7.5M2.75 12h4.5M13 3.5v8.75M10.75 10 13 12.25 15.25 10" />,
    style: { left: "46%", top: "calc(60% + var(--callout-shift))" },
  },
  {
    label: "Daemon",
    path: <path d="M13.25 8A5.25 5.25 0 1 1 11.7 4.3M13.25 1.75V4.5H10.5" />,
    style: { left: "calc(82% + var(--daemon-shift))", top: "calc(34% + var(--callout-shift))", animationDelay: "-0.75s" },
  },
] satisfies { label: string; path: ReactNode; style: CSSProperties }[];

const SEND = <path d="M8 13.25V2.75M3.5 7.25 8 2.75l4.5 4.5" />;

type Content = { nav: string[]; current: number; question: string; answer: string; placeholder: string };

function AppWindow({ nav, current, question, answer, placeholder, plan }: Content & { plan?: boolean }) {
  return (
    <div className={`${styles.window} ${plan ? styles.plan : ""}`}>
      <aside className={styles.side}>
        <div className={styles.brand}>
          <span className={styles.avatar} />
        </div>
        <nav className={styles.nav}>
          {nav.map((item, index) => (
            <span key={item} className={styles.navItem} data-current={index === current || undefined}>
              {item}
            </span>
          ))}
        </nav>
      </aside>
      <section className={styles.chat}>
        <p className={styles.question}>{question}</p>
        <p className={styles.answer}>{answer}</p>
        <div className={styles.composer}>
          <span className={styles.placeholder}>{placeholder}</span>
          <span className={styles.send}>{icon(SEND, 16)}</span>
        </div>
      </section>
    </div>
  );
}

type Props = Partial<Content> & { theme?: "dark" | "light" };

export default function PagePeel({
  theme = "dark",
  nav = ["Dashboard", "Chat", "Team"],
  current = 1,
  question = "how many incidents on my app today?",
  answer = "5 incidents took place between 12:31 pm and 1:13 pm. Let me know how you’d like to address them.",
  placeholder = "Ask a follow up…",
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const flap = useRef<HTMLDivElement>(null);
  const size = useRef<Size>(FALLBACK_SIZE);
  const pull = useRef<Vec>({ ...REST });
  const velocity = useRef<Vec>({ x: 0, y: 0 });
  const run = useRef<{ frame: number; end: (finished: boolean) => void } | null>(null);
  const drag = useRef<{ id: number; x: number; y: number; from: Vec; movedAt: number } | null>(null);
  const hovered = useRef(false);
  const isOpen = useRef(false);
  const reduced = useRef(false);
  const peeked = useRef(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [moving, setMoving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [overFlap, setOverFlap] = useState(false);

  const paint = useCallback(() => {
    const styled = peel(pull.current, size.current);
    if (page.current) page.current.style.clipPath = styled.page;
    if (flap.current) {
      flap.current.style.clipPath = styled.flap;
      flap.current.style.backgroundImage = styled.shade;
      flap.current.style.transform = styled.turn;
    }
  }, []);

  const stop = useCallback(() => {
    const current = run.current;
    if (!current) return;
    run.current = null;
    cancelAnimationFrame(current.frame);
    current.end(false);
  }, []);

  // Moves the corner to a pull, carrying on from its current speed. Resolves true if it got
  // there, false if something else moved it first.
  const animateTo = useCallback(
    (target: Vec, motion: Spring | Tween = SETTLE) =>
      new Promise<boolean>((resolve) => {
        stop();
        if (reduced.current) {
          pull.current = { ...target };
          velocity.current = { x: 0, y: 0 };
          paint();
          resolve(true);
          return;
        }
        setMoving(true);
        const from = { ...pull.current };
        const ease = motion.type === "tween" ? cubicBezier(motion.ease) : null;
        let start = -1;
        let last = 0;
        const entry = {
          frame: 0,
          end: (finished: boolean) => {
            if (finished) setMoving(false);
            resolve(finished);
          },
        };
        const tick = (now: number) => {
          if (start < 0) start = last = now;
          const elapsed = Math.min(now - last, 64) / 1000;
          last = now;
          let done: boolean;
          if (motion.type === "tween") {
            const progress = Math.min(1, (now - start) / motion.duration);
            const eased = ease!(progress);
            const next = { x: from.x + (target.x - from.x) * eased, y: from.y + (target.y - from.y) * eased };
            if (elapsed > 0) velocity.current = { x: (next.x - pull.current.x) / elapsed, y: (next.y - pull.current.y) / elapsed };
            pull.current = next;
            done = progress >= 1;
          } else {
            // Mass on a damped spring, stepped a millisecond at a time
            const { stiffness, damping, mass } = motion;
            const steps = Math.max(1, Math.round(elapsed * 1000));
            const step = elapsed / steps;
            const p = { ...pull.current };
            const v = { ...velocity.current };
            for (let i = 0; i < steps; i++) {
              for (const axis of ["x", "y"] as const) {
                v[axis] += ((-stiffness * (p[axis] - target[axis]) - damping * v[axis]) / mass) * step;
                p[axis] += v[axis] * step;
              }
            }
            done = (["x", "y"] as const).every((axis) => Math.abs(p[axis] - target[axis]) <= REST_DELTA && Math.abs(v[axis]) <= REST_SPEED);
            pull.current = p;
            velocity.current = v;
          }
          if (done) {
            pull.current = { ...target };
            velocity.current = { x: 0, y: 0 };
          }
          paint();
          if (!done) {
            entry.frame = requestAnimationFrame(tick);
            return;
          }
          run.current = null;
          entry.end(true);
        };
        entry.frame = requestAnimationFrame(tick);
        run.current = entry;
      }),
    [paint, stop],
  );

  // Open, lifted under the pointer, or at rest.
  const settle = useCallback(() => {
    void animateTo(isOpen.current ? openPull(size.current) : hovered.current ? LIFTED : REST);
  }, [animateTo]);

  const toggle = useCallback(
    (next: boolean) => {
      isOpen.current = next;
      setOpen(next);
      settle();
    },
    [settle],
  );

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const resize = new ResizeObserver(([entry]) => {
      size.current = { w: entry.contentRect.width, h: entry.contentRect.height };
      paint();
    });
    resize.observe(element);
    // Active while on screen, with the page visible and motion allowed: the labels float, and
    // the corner peeks once.
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      reduced.current = media.matches;
      setActive(visible && !document.hidden && !media.matches);
    };
    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    view.observe(element);
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    sync();
    return () => {
      resize.disconnect();
      view.disconnect();
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
    };
  }, [paint]);

  useEffect(() => stop, [stop]);

  // The first time it's active, the corner lifts a little further and springs back.
  useEffect(() => {
    if (!active || peeked.current) return;
    const timer = window.setTimeout(() => {
      peeked.current = true;
      if (hovered.current || drag.current || isOpen.current) return;
      void animateTo(PEEK, PEEK_OUT).then((finished) => {
        if (!finished || drag.current) return;
        if (isOpen.current) settle();
        else void animateTo(hovered.current ? LIFTED : REST, PEEK_BACK);
      });
    }, PEEK_DELAY);
    return () => window.clearTimeout(timer);
  }, [active, animateTo, settle]);

  const endDrag = (event: PointerEvent<HTMLButtonElement>) => {
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    stop();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, from: { ...pull.current }, movedAt: performance.now() };
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const box = root.current?.getBoundingClientRect();
    if (!box) return;
    const held = drag.current;
    if (!held) {
      setOverFlap(onFlap({ x: event.clientX - box.left, y: event.clientY - box.top }, pull.current, size.current));
      return;
    }
    if (held.id !== event.pointerId) return;
    // Dragged off the card: the page turns all the way over.
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) {
      endDrag(event);
      hovered.current = false;
      toggle(true);
      return;
    }
    const next = clampPull({ x: held.from.x + held.x - event.clientX, y: held.from.y + held.y - event.clientY }, size.current);
    const now = performance.now();
    const elapsed = (now - held.movedAt) / 1000;
    if (elapsed > 0) velocity.current = { x: (next.x - pull.current.x) / elapsed, y: (next.y - pull.current.y) / elapsed };
    held.movedAt = now;
    pull.current = next;
    paint();
  };

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const held = drag.current;
    if (!held || held.id !== event.pointerId) return;
    endDrag(event);
    if (Math.abs(held.x - event.clientX) + Math.abs(held.y - event.clientY) < CLICK_SLOP) {
      toggle(!isOpen.current);
      return;
    }
    // A pointer that stopped before letting go has no speed to hand on
    if (performance.now() - held.movedAt > 30) velocity.current = { x: 0, y: 0 };
    toggle(length(pull.current) > (length(LIFTED) + length(openPull(size.current))) / 2);
  };

  // Pointer presses are handled above; this is Enter and Space.
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) toggle(!isOpen.current);
  };

  return (
    <div
      ref={root}
      className={`${geist.className} ${geistMono.variable} ${styles.root}`}
      data-collected="page-peel"
      data-theme={theme}
      data-open={open}
      data-active={active || undefined}
      data-moving={moving || dragging || undefined}
    >
      <div className={styles.layers} aria-hidden="true">
        <div className={styles.under}>
          <div className={styles.blueprint}>
            <div className={styles.stage}>
              <AppWindow plan nav={nav} current={current} question={question} answer={answer} placeholder={placeholder} />
              <div className={styles.callouts}>
                {CALLOUTS.map(({ label, path, style }) => (
                  <div key={label} className={styles.callout} style={style}>
                    {icon(path, 20)}
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div ref={page} className={styles.top} style={{ clipPath: INITIAL.page }}>
          <div className={styles.paper}>
            <div className={styles.stage}>
              <AppWindow nav={nav} current={current} question={question} answer={answer} placeholder={placeholder} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.flapClip} aria-hidden="true">
        <div
          ref={flap}
          className={styles.flap}
          style={{ clipPath: INITIAL.flap, backgroundImage: INITIAL.shade, transform: INITIAL.turn }}
        />
      </div>
      <button
        type="button"
        className={styles.handle}
        aria-label={open ? "Flatten the page corner" : "Peel back the page corner"}
        aria-pressed={open}
        data-cursor={dragging ? "grabbing" : overFlap ? "grab" : undefined}
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerEnter={() => {
          hovered.current = true;
          if (!drag.current) settle();
        }}
        onPointerLeave={() => {
          hovered.current = false;
          setOverFlap(false);
          if (!drag.current) settle();
        }}
      />
    </div>
  );
}
