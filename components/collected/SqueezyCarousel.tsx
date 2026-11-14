"use client";

import { Hanken_Grotesk } from "next/font/google";
import Image, { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import styles from "./SqueezyCarousel.module.css";

const hanken = Hanken_Grotesk({ subsets: ["latin"] });

export type SqueezyCarouselItem = {
  /** Should suit a 16:9 crop; narrow panels show its centre. */
  src: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  /** Moves the image sideways (px) while the panel is collapsed, to keep its subject in view. */
  collapsedOffsetX?: number;
};

const DEFAULT_ITEMS: SqueezyCarouselItem[] = [
  {
    src: "/demo/art/steps.webp",
    title: "Businesses on Stripe generated $1.9T in 2025.",
    description:
      "Our annual letter explores the trends defining the internet economy—including steeper growth for newer businesses, faster international expansion, stablecoin progress, agentic commerce, and more.",
    cta: "Read the letter",
    href: "https://stripe.com/annual-updates/2025",
  },
  {
    src: "/demo/art/orbit.webp",
    title: "150K+ users have their best day ever on Stripe.",
    description:
      "From Black Friday through Cyber Monday 2025, Stripe processed more than $40B for businesses while maintaining a 99.9999% uptime.",
    cta: "See the numbers",
    href: "https://stripe.com/newsroom/news/bfcm2025",
  },
  {
    src: "/demo/art/horizon.webp",
    title: "Tidemark’s vertical and SMB SaaS benchmark report.",
    description:
      "Learn what’s driving growth in vertical SaaS in 2025—going multiproduct, embedding fintech, and integrating AI into the core of their products.",
    cta: "Get the data",
    href: "https://stripe.com/lp/vertical-saas-benchmark-2025",
  },
  {
    src: "/demo/art/ribbon.webp",
    title: "Shopify’s Tobi Lütke sits down with John Collison.",
    description:
      "Hear them discuss the choices that shaped Shopify and Stripe, the future of commerce, and their advice for founders.",
    cta: "Watch video",
    href: "https://www.youtube.com/watch?v=eMSqlQMk480",
  },
  {
    src: "/demo/art/canopy.webp",
    title: "New tools to process payments outside app stores.",
    description:
      "New regulations mean new opportunities. Read how Stripe can help you process payments outside of the iOS and Android app stores, giving you more control and helping grow your revenue.",
    cta: "Learn how",
    href: "https://stripe.com/use-cases/in-app-payments",
  },
  {
    src: "/demo/art/echo.webp",
    title: "Crypto.com partners with Stripe to enable better crypto payments.",
    description:
      "Learn how the partnership can help you tap into a new global customer base by letting customers pay with their crypto balance directly at checkout.",
    cta: "View announcement",
    href: "https://stripe.com/customers/crypto-com-spotlight",
  },
  {
    src: "/demo/art/prism.webp",
    title: "Make your products shoppable through AI platforms.",
    description:
      "Find out how the Agentic Commerce Protocol (ACP) allows any business to accept purchases from AI platforms without requiring any major technical changes.",
    cta: "Read more",
    href: "https://stripe.com/blog/introducing-our-agentic-commerce-solutions",
  },
  {
    src: "/demo/art/tide.webp",
    title: "How leading retailers unify customer experiences and drive growth.",
    description:
      "Get insights into how other brands have unified their online and in-store experiences and optimized their checkouts for a seamless shopping experience.",
    cta: "Get the report",
    href: "https://stripe.com/lp/how-retailers-drive-growth",
  },
];

// All read from the original. Fractions share out the width left over beside a 16:9 first panel:
// the first panel gives some back (negative) and the next three take it.
const LARGE_GAP = 16;
const SMALL_GAP = 8;
const SLIVER_WIDTH = 8;
const SLIVER_HOVER_GROWTH = 3;
const SLIDE_STEP = SLIVER_WIDTH + LARGE_GAP;
const RADIUS = 6;
const REST = [-0.06, 0.61, 0.3, 0.15];
const SQUEEZED = [-0.12, 0.59, 0.28, 0.13];
const STRETCHED = [0, 0.71, 0.4, 0.25];
const DURATION = 1000;
const REDUCED_DURATION = 200;

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));
const mix = (from: number, to: number, t: number) => from + (to - from) * t;

type Card = {
  item: number;
  column: number;
  x: number;
  width: number;
  gap: number;
  shift: number;
  from: { width: number; gap: number; shift: number };
  to: { width: number; gap: number; shift: number };
};

// Draws the panels on a canvas, like the original. Panels are added off the row's ends as it
// moves and trimmed when it settles, so it loops without duplicating DOM.
function createStage(canvas: HTMLCanvasElement, items: SqueezyCarouselItem[], reduced: boolean, onColumnClick: (column: number) => void) {
  const context = canvas.getContext("2d")!;
  const dpr = window.devicePixelRatio || 1;
  const duration = reduced ? REDUCED_DURATION : DURATION;
  const slivers = Math.max(1, Math.min(items.length - 4, 3));
  const totalGap = SMALL_GAP * slivers + LARGE_GAP * 3;

  let frame = 0;
  let startedAt = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let firstWidth = 0;
  let shared = 0;
  let hovered = -1;
  let fractions = REST;
  let columnOffset = 0;
  let rowX = 0;
  let rowFrom = 0;
  let rowTo = 0;
  let growth = 0;
  let growthFrom = 0;
  let growthTo = 0;

  const widthOf = (column: number) => {
    if (column < 0 || column > 3) return SLIVER_WIDTH + (hovered === column ? growthTo : 0);
    const portion = (shared - growthTo) * fractions[column];
    return column === 0 ? firstWidth + portion : portion;
  };
  const gapOf = (column: number) => (column < 4 ? LARGE_GAP : SMALL_GAP);
  const shiftOf = (column: number, item: number) => (column === 0 ? 0 : items[item].collapsedOffsetX ?? 0);

  const images = items.map((item) => {
    const { props } = getImageProps({ src: item.src, alt: "", width: 866, height: 487, sizes: "866px" });
    const image = new window.Image();
    image.onload = () => draw();
    image.sizes = "866px";
    if (props.srcSet) image.srcset = props.srcSet;
    image.src = props.src;
    return image;
  });

  const blank = () => ({ width: 0, gap: 0, shift: 0 });
  let cards: Card[] = Array.from({ length: 4 + slivers }, (_, index) => {
    const item = index % items.length;
    return { item, column: index, x: 0, width: 0, gap: gapOf(index), shift: shiftOf(index, item), from: blank(), to: blank() };
  });

  function drawCard({ item, x, width, shift }: Card) {
    const image = images[item];
    if (!image.complete || !image.naturalWidth) return;
    // The image is sized to cover the fully open panel, then stays centred however narrow it gets.
    const scale = Math.max(firstWidth / image.naturalWidth, canvasHeight / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    context.save();
    context.beginPath();
    context.roundRect(x, 0, width, canvasHeight, Math.max(0, Math.min(RADIUS, Math.min(width, canvasHeight) / 2)));
    context.clip();
    context.drawImage(image, x + width / 2 - drawWidth / 2 - shift, (canvasHeight - drawHeight) / 2, drawWidth, drawHeight);
    context.restore();
  }

  function draw() {
    cards.forEach((card, index) => {
      card.x = index === 0 ? rowX : cards[index - 1].x + cards[index - 1].width + card.gap;
    });
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    cards.forEach((card) => {
      if (card.x + card.width >= 0 && card.x <= canvasWidth) drawCard(card);
    });
  }

  function tick(now: number) {
    const t = easeOutExpo(Math.min((now - startedAt) / duration, 1));
    rowX = mix(rowFrom, rowTo, t);
    growth = mix(growthFrom, growthTo, t);
    cards.forEach((card) => {
      card.width = mix(card.from.width, card.to.width, t);
      card.gap = mix(card.from.gap, card.to.gap, t);
      card.shift = mix(card.from.shift, card.to.shift, t);
    });
    draw();
    if (t < 1) {
      frame = requestAnimationFrame(tick);
      return;
    }
    const first = cards.findIndex((card) => card.column === 0);
    cards = cards.slice(first, first + 4 + slivers);
    columnOffset = 0;
    rowX = 0;
    draw();
  }

  function animate(backSteps = 0) {
    rowFrom = rowX - backSteps * SLIDE_STEP;
    rowTo = columnOffset * SLIDE_STEP;
    growthFrom = growth;
    growthTo = !reduced && hovered > 3 ? SLIVER_HOVER_GROWTH : 0;
    cards.forEach((card) => {
      card.from = { width: card.width, gap: card.gap, shift: card.shift };
      card.to = { width: widthOf(card.column), gap: gapOf(card.column), shift: shiftOf(card.column, card.item) };
    });
    startedAt = performance.now();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  }

  const renumber = () => cards.forEach((card, index) => (card.column = index + columnOffset));

  function setHovered(column: number) {
    hovered = column;
    fractions =
      column >= 0 && column <= 3 && !reduced
        ? REST.map((_, index) => (index === column ? STRETCHED[index] : SQUEEZED[index]))
        : REST;
    canvas.style.cursor = column >= 0 ? "pointer" : "default";
    animate();
  }

  const onMove = (event: MouseEvent) => {
    const column = cards.find((card) => card.x <= event.offsetX && event.offsetX <= card.x + card.width)?.column ?? -1;
    if (column >= 0 && column !== hovered) setHovered(column);
  };
  const onLeave = () => setHovered(-1);
  const onClick = () => {
    if (hovered > 0) onColumnClick(hovered);
  };

  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvasWidth = width;
    canvasHeight = height;
    context.scale(dpr, dpr);
    firstWidth = height * (16 / 9);
    shared = width - firstWidth - totalGap - SLIVER_WIDTH * slivers;
    cancelAnimationFrame(frame);
    cards.forEach((card) => {
      card.width = widthOf(card.column);
      card.gap = gapOf(card.column);
    });
    draw();
  }

  resize();
  canvas.addEventListener("mouseenter", onMove);
  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("mouseleave", onLeave);
  canvas.addEventListener("click", onClick);

  return {
    resize,
    next(steps: number) {
      for (let step = 0; step < steps; step += 1) {
        const item = (cards[cards.length - 1].item + 1) % items.length;
        cards.push({ item, column: 0, x: 0, width: SLIVER_WIDTH, gap: SMALL_GAP, shift: items[item].collapsedOffsetX ?? 0, from: blank(), to: blank() });
      }
      columnOffset -= steps;
      renumber();
      animate();
    },
    previous(steps: number) {
      for (let step = 0; step < steps; step += 1) {
        const item = (cards[0].item - 1 + items.length) % items.length;
        cards.unshift({ item, column: 0, x: 0, width: SLIVER_WIDTH, gap: LARGE_GAP, shift: 0, from: blank(), to: blank() });
      }
      renumber();
      animate(steps);
    },
    dispose() {
      cancelAnimationFrame(frame);
      images.forEach((image) => (image.onload = null));
      canvas.removeEventListener("mouseenter", onMove);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
    },
  };
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={direction === "right" ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M8.7 2.5 3.2 8l5.5 5.5M3.6 8H14.2" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function Cta({ item, tabbable, onKeyDown, onFocus, linkRef }: {
  item: SqueezyCarouselItem;
  tabbable?: boolean;
  onKeyDown?: (event: KeyboardEvent) => void;
  onFocus?: () => void;
  linkRef?: (node: HTMLAnchorElement | null) => void;
}) {
  return (
    <a ref={linkRef} className={styles.cta} href={item.href} target="_blank" rel="noreferrer" tabIndex={tabbable === false ? -1 : 0} onKeyDown={onKeyDown} onFocus={onFocus}>
      {item.cta}
      <svg className={styles.chevron} width="5" height="8" viewBox="0 0 5 8" fill="none" aria-hidden="true">
        <path d="M.6.6 4 4 .6 7.4" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    </a>
  );
}

type Props = {
  title?: string;
  subtitle?: string;
  /** At least five. Up to seven show at once; more wait off-canvas and loop. */
  items?: SqueezyCarouselItem[];
  theme?: "light" | "dark";
};

export default function SqueezyCarousel({
  title = "What’s happening",
  subtitle = "See the latest from Stripe.",
  items = DEFAULT_ITEMS,
  theme = "light",
}: Props) {
  const [active, setActive] = useState(0);
  const refocus = useRef(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<ReturnType<typeof createStage> | null>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const scroller = useRef<HTMLUListElement>(null);

  const next = useCallback(
    (steps: number) => {
      stage.current?.next(steps);
      setActive((index) => (index + steps) % items.length);
    },
    [items.length],
  );
  const previous = useCallback(
    (steps: number) => {
      stage.current?.previous(steps);
      setActive((index) => (index - steps + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const created = createStage(element, items, reduced, next);
    stage.current = created;
    let timer = 0;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(created.resize, 150);
    });
    observer.observe(element);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      created.dispose();
      stage.current = null;
    };
  }, [items, next]);

  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    links.current[active]?.focus();
  }, [active]);

  // Phones: each card scales, parallaxes, and fades with its distance from the snap point.
  useEffect(() => {
    const list = scroller.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const center = list.scrollLeft + list.clientWidth / 2;
      for (const child of Array.from(list.children) as HTMLElement[]) {
        const distance = (child.offsetLeft + child.offsetWidth / 2 - center) / (child.offsetWidth + 16);
        child.style.setProperty("--progress", String(Math.max(-1, Math.min(1, distance))));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    list.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      list.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const onCtaKey = (event: KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    refocus.current = true;
    if (event.key === "ArrowLeft") previous(1);
    else next(1);
  };

  return (
    <section className={`${hanken.className} ${styles.root}`} data-collected="squeezy-carousel" data-theme={theme}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.controls} role="group" aria-label="Carousel navigation">
          <button type="button" className={styles.control} aria-label="Previous slide" onClick={() => previous(1)}>
            <Arrow direction="left" />
          </button>
          <button type="button" className={styles.control} aria-label="Next slide" onClick={() => next(1)}>
            <Arrow direction="right" />
          </button>
        </div>
      </header>

      <div className={styles.stage}>
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
        <div className={styles.details}>
          {items.map((item, index) => (
            <div
              key={item.title}
              className={styles.detail}
              aria-hidden={index !== active}
              style={{ transform: `translateX(${-100 * index}%)`, opacity: index === active ? 1 : 0, pointerEvents: index === active ? "auto" : "none" }}
            >
              <div className={styles.copy}>
                <h3 className={styles.lead}>{item.title}</h3> <p className={styles.rest}>{item.description}</p>
              </div>
              <Cta
                item={item}
                tabbable={index === active}
                onKeyDown={onCtaKey}
                onFocus={() => index !== active && (index > active ? next(index - active) : previous(active - index))}
                linkRef={(node) => {
                  links.current[index] = node;
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.live} aria-live="polite" aria-atomic="true">
        {`Item ${active + 1} of ${items.length}: ${items[active].title}`}
      </div>

      <ul ref={scroller} className={styles.scroller}>
        {items.map((item) => (
          <li key={item.title} className={styles.slide}>
            <div className={styles.media}>
              <Image className={styles.mediaImage} src={item.src} alt="" fill sizes="100vw" draggable={false} />
            </div>
            <p className={styles.slideCopy}>
              <span className={styles.lead}>{item.title}</span> <span className={styles.rest}>{item.description}</span>
            </p>
            <div className={styles.slideLink}>
              <Cta item={item} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
