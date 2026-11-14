"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import styles from "./CardSwap.module.css";

const inter = Inter({ subsets: ["latin"] });

export type CardSwapCard = { src: string; label: string };

const DEFAULT_CARDS: CardSwapCard[] = [
  { src: `/demo/art/orbit.webp`, label: "Orbit" },
  { src: `/demo/art/steps.webp`, label: "Steps" },
  { src: `/demo/art/ribbon.webp`, label: "Ribbon" },
  { src: `/demo/art/horizon.webp`, label: "Horizon" },
];

// All measured on the original.
const TAP_DISTANCE = 5; // A release within this many px counts as a press.
const FLING_DISTANCE = 70; // Swaps between 60px and 80px of travel on the original.
const DRAG_LIMIT = 160; // The card follows the pointer, easing out towards this many px.
const DRAG_ROTATION = 0.05; // Degrees of rotation per px of horizontal travel.

// Each card behind the front one sits this much further right, up and back.
const DEPTH = { x: 34, y: -26, z: -70 };
const SKEW_DEG = 6;

const depthTransform = (depth: number) =>
  `translate3d(${DEPTH.x * depth}px, ${DEPTH.y * depth}px, ${DEPTH.z * depth}px) skewY(${SKEW_DEG}deg)`;

// From the stylesheet: the front card sits 30px in and 24px up from the bottom
// of its box (which is 104px taller than the card), under a 1000px perspective.
const STAGE = { left: 30, top: 80 };
const PERSPECTIVE = 1000;
const ORIGINAL_CARD = { width: 196, height: 246 };

/**
 * Each card's outline as the deck draws it, in CardSwap's box at scale 1:
 * one per place in the deck, front first, each as four corners clockwise
 * from the top left. Lets a parent keep things clear of the deck itself.
 * Not in the original.
 */
export function deckCorners(count: number, cardSize = ORIGINAL_CARD) {
  const { width, height } = cardSize;
  const origin = { x: (width * 150) / 196, y: (height * 95) / 246 };
  const skew = Math.tan((SKEW_DEG * Math.PI) / 180);
  return Array.from({ length: count }, (_, depth) => {
    const shrink = PERSPECTIVE / (PERSPECTIVE - DEPTH.z * depth);
    return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([cx, cy]) => {
      // skewY turns about the card's centre, then the card steps back.
      const x = width / 2 + (cx * width) / 2 + DEPTH.x * depth;
      const y = height / 2 + (cy * height) / 2 + ((cx * width) / 2) * skew + DEPTH.y * depth;
      return {
        x: STAGE.left + origin.x + (x - origin.x) * shrink,
        y: STAGE.top + origin.y + (y - origin.y) * shrink,
      };
    });
  });
}

/**
 * The part of CardSwap's box (at scale 1) that a deck of `count` cards of
 * `cardSize` covers once each card is skewed, pushed back and seen in
 * perspective. Lets a parent centre and fit the deck itself, not the box.
 * Not in the original.
 */
export function deckBounds(count: number, cardSize = ORIGINAL_CARD) {
  const corners = deckCorners(count, cardSize).flat();
  const xs = corners.map((corner) => corner.x);
  const ys = corners.map((corner) => corner.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return { x: left, y: top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
}

type Props = {
  cards?: CardSwapCard[];
  theme?: "dark" | "light";
  /** Swap by itself every `delay` milliseconds. Pauses while hovered. */
  auto?: boolean;
  delay?: number;
  /** Render scale. Defaults to the `--csw-scale` custom property, or 1. */
  scale?: number;
  /** Show each card's label. Hide them when the deck is drawn too small to read. */
  labels?: boolean;
  /** Called with the front card's index whenever a different card comes to the front. */
  onFrontChange?: (index: number) => void;
  /** Draws a card's face in place of its image, for faces that move. */
  face?: (card: CardSwapCard, index: number) => ReactNode;
  /** The card's size at scale 1. Defaults to the original's 196 × 246 portrait card. */
  cardSize?: { width: number; height: number };
};

export default function CardSwap({
  cards = DEFAULT_CARDS,
  theme = "dark",
  auto = false,
  delay = 4000,
  scale,
  labels = true,
  onFrontChange,
  face,
  cardSize,
}: Props) {
  // order[0] is the front card; values index into `cards`.
  const [order, setOrder] = useState(() => cards.map((_, index) => index));
  const [hovered, setHovered] = useState(false);
  const drag = useRef<{ x: number; y: number; dx: number; dy: number } | null>(null);
  const refocus = useRef(false);
  const cardElements = useRef<(HTMLDivElement | null)[]>([]);

  const swap = () => setOrder((current) => [...current.slice(1), current[0]]);

  useEffect(() => {
    if (!auto || hovered) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => {
      if (!motion.matches) swap();
    }, delay);
    return () => window.clearInterval(timer);
  }, [auto, delay, hovered]);

  useEffect(() => {
    onFrontChange?.(order[0]);
  }, [order, onFrontChange]);

  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    cardElements.current[order[0]]?.focus();
  }, [order]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.style.transition = "none";
    drag.current = { x: event.clientX, y: event.clientY, dx: 0, dy: 0 };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current.dx = dx;
    drag.current.dy = dy;
    const x = DRAG_LIMIT * Math.tanh(dx / DRAG_LIMIT);
    const y = DRAG_LIMIT * Math.tanh(dy / DRAG_LIMIT);
    event.currentTarget.style.transform = `var(--t) translate(${x}px, ${y}px) rotate(${x * DRAG_ROTATION}deg)`;
  };

  const release = (event: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    if (!drag.current) return;
    const distance = Math.hypot(drag.current.dx, drag.current.dy);
    drag.current = null;
    // Clearing both lets the stylesheet's transition carry the card from where it was dropped.
    event.currentTarget.style.transition = "";
    event.currentTarget.style.transform = "";
    if (!cancelled && (distance < TAP_DISTANCE || distance >= FLING_DISTANCE)) swap();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    refocus.current = true;
    swap();
  };

  return (
    <div
      className={`${styles.root} ${inter.className}`}
      data-collected="card-swap"
      data-theme={theme}
      style={
        {
          ...(scale !== undefined && { "--csw-scale": scale }),
          // The perspective keeps its place on the card: 150px and 95px into the original's.
          ...(cardSize && {
            "--csw-card-w": `${cardSize.width}px`,
            "--csw-card-h": `${cardSize.height}px`,
            "--csw-origin-x": `${(cardSize.width * 150) / 196}px`,
            "--csw-origin-y": `${(cardSize.height * 95) / 246}px`,
          }),
        } as CSSProperties
      }
    >
      <div
        className={styles.scaler}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <div className={styles.stage}>
          {cards.map((card, index) => {
            const depth = order.indexOf(index);
            const front = depth === 0;
            return (
              <div
                key={card.src}
                ref={(element) => {
                  cardElements.current[index] = element;
                }}
                className={styles.card}
                data-front={front || undefined}
                style={{ zIndex: cards.length - depth, "--t": depthTransform(depth) } as CSSProperties}
                {...(front && {
                  role: "button",
                  tabIndex: 0,
                  "aria-label": labels ? undefined : card.label,
                  onPointerDown,
                  onPointerMove,
                  onPointerUp: (event: PointerEvent<HTMLDivElement>) => release(event, false),
                  onPointerCancel: (event: PointerEvent<HTMLDivElement>) => release(event, true),
                  onKeyDown,
                })}
              >
                {face ? (
                  <div className={styles.photo}>{face(card, index)}</div>
                ) : (
                  <Image className={styles.photo} src={card.src} alt="" width={490} height={615} sizes="320px" draggable={false} />
                )}
                {labels && <div className={styles.tag}>{card.label}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
