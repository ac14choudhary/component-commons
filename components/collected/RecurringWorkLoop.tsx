"use client";

import { IBM_Plex_Mono } from "next/font/google";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { dotDiameter, dotPitch } from "@/lib/dotGridGeometry";
import styles from "./RecurringWorkLoop.module.css";

const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: "500" });

type Trigger = { cadence: string; task: string };
type Triggers = readonly [Trigger, Trigger, Trigger];

type Props = {
  title?: string;
  description?: string;
  triggers?: Triggers;
  theme?: "light" | "dark";
  animated?: boolean;
};

const defaultTriggers: Triggers = [
  { cadence: "Triggered", task: "triage check" },
  { cadence: "Weekly", task: "review" },
  { cadence: "Daily", task: "summary" },
];

const dots = Array.from({ length: 25 }, (_, index) => ({
  x: index % 5,
  y: Math.floor(index / 5),
}));

const cycleMs = 8000;
const frameMs = 120;
const triggerStaggerMs = 150;
const runFrameCount = 32;

const agentOrder = [0, 1, 2, 5, 6, 7, 8, 10, 11, 15, 16, 17, 20, 21, 22, 23];
const agentFrames = agentOrder.map((_, frame) => agentOrder.slice(0, frame + 1));
const cross = (center: number) => [center - 5, center - 1, center, center + 1, center + 5];
const scopeBox = [0, 1, 2, 5, 7, 10, 11, 12];
const scopeFrames = [
  cross(17), cross(16), cross(11), cross(6), scopeBox, [], scopeBox, [],
  cross(7), cross(8), cross(13), cross(18),
];

// Each row describes one measured 5×5 Pong frame. Only the bright dots move.
const pongFrames = [
  "..... #...# ##..# #...# .....",
  "..... #.... #...# #.#.# ....#",
  "..... #.... #...# #...# ...##",
  "..... #.... #...# #.#.# ....#",
  "#.... #.... ##..# ....# ....#",
  "#.... #.#.# #...# ....# .....",
  "#..## #...# #...# ..... .....",
  "....# #.#.# #...# #.... .....",
].map((frame) => [...frame.replaceAll(" ", "")].flatMap((dot, index) => dot === "#" ? [index] : []));

const distances = dots.map(({ x, y }) => Math.abs(x - 2) + Math.abs(y - 2));
const clearFrames = [[0], [1], [0, 2], [1, 3], [0, 2, 4], [1, 3], [2, 4], [3], [4]]
  .map((rings) => distances.flatMap((distance, index) => rings.includes(distance) ? [index] : []));

const dotTimelines = [pongFrames, scopeFrames, agentFrames].map((pattern, tile) => {
  const frames = [
    ...Array.from({ length: runFrameCount }, (_, frame) => pattern[frame % pattern.length]),
    ...clearFrames,
    [],
  ];
  const startMs = 730 + (2 - tile) * triggerStaggerMs;

  return dots.map((_, dot) => {
    const stops: string[] = [];
    let bright = false;
    let since = 0;

    frames.forEach((frame, index) => {
      const next = frame.includes(dot);
      if (next === bright) return;
      const position = (startMs + index * frameMs) / (cycleMs / 100);
      stops.push(`${Number(bright)} ${since}% ${position}%`);
      bright = next;
      since = position;
    });

    stops.push(`0 ${since}% 100%`);
    return stops.length > 1 ? `linear(${stops.join(", ")})` : "linear(0, 0)";
  });
});

function LoopDiagram({ triggers, compact }: { triggers: Triggers; compact?: boolean }) {
  const maskId = useId();
  const width = compact ? 328 : 1136;
  const height = compact ? 405 : 401;
  const panelWidth = compact ? 328 : 255;
  const tileSize = compact ? 80 : 96;
  const tileY = compact ? 256 : 226;
  const entryY = tileY - 20;
  const exitY = tileY + tileSize + (compact ? 20 : 22);
  const returnX = compact ? 16 : 128;
  const returnY = height - 1;

  const routes = triggers.map((trigger, index) => {
    const x = compact ? 280 - index * 100 : 1088 - index * 236;
    const rowY = 34 + index * 56;
    const startX = compact ? x : panelWidth + 20;
    const startY = compact ? 196 : rowY;
    const outgoing = compact
      ? `M${x} ${startY} V${entryY}`
      : `M${startX} ${startY} H${x - 30} C${x - 13} ${rowY} ${x} ${rowY + 13} ${x} ${rowY + 30} V${entryY}`;
    const bend = `M${x} ${exitY} V${returnY - 29} C${x} ${returnY - 13} ${x - 13} ${returnY} ${x - 30} ${returnY}`;
    const returning = `${bend} H${returnX + 30} C${returnX + 13} ${returnY} ${returnX} ${returnY - 13} ${returnX} ${returnY - 29} V203`;
    const returnSegment = index === 2 ? returning : `${bend} H${x - (compact ? 129 : 267)}`;

    return { ...trigger, x, rowY, startX, startY, outgoing, returning, returnSegment, stagger: index * triggerStaggerMs };
  });

  return (
    <svg
      className={compact ? styles.compact : styles.wide}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId} x="0" y="0" width={width} height={height} maskUnits="userSpaceOnUse">
          <g fill="none" stroke="white" strokeLinecap="round">
            {routes.map(({ outgoing, returnSegment }, index) => (
              <g key={index}>
                <path d={outgoing} />
                <path d={returnSegment} strokeDasharray="3 5" />
              </g>
            ))}
          </g>
        </mask>
      </defs>

      <g className={styles.wires}>
        {routes.map(({ outgoing, returnSegment }, index) => (
          <g key={index}>
            <path className={styles.outline} d={outgoing} />
            <path className={styles.returnLine} d={returnSegment} />
          </g>
        ))}
      </g>
      <g className={styles.endpoints}>
        {routes.map(({ x, startX, startY }, index) => (
          <g key={index}>
            <circle cx={startX} cy={startY} r="2" />
            <circle cx={x} cy={exitY} r="2" />
            <path d={`M${x - 3} ${entryY - 5} h6 l-3 6 z`} />
          </g>
        ))}
        <path d={`M${returnX - 3} 208 h6 l-3 -6 z`} />
      </g>
      <g className={styles.pulses} mask={`url(#${maskId})`}>
        {routes.map(({ outgoing, returning, stagger }, index) => (
          <g key={index} style={{ "--stagger": `${stagger}ms` } as CSSProperties}>
            <path className={styles.outPulse} d={outgoing} pathLength="1" />
            <path className={styles.backPulse} d={returning} pathLength="1" />
          </g>
        ))}
      </g>

      <rect className={styles.panelOutline} x=".5" y=".5" width={panelWidth - 1} height="179" rx="14.5" />
      {routes.map(({ cadence, task, rowY, x, stagger }, tile) => {
        const textLength = `${cadence} ${task}`.length * 7.2;
        return (
          <g key={rowY} style={{ "--stagger": `${stagger}ms` } as CSSProperties}>
            <rect className={styles.trigger} x="12.5" y={rowY - 21.5} width={panelWidth - 25} height="43" rx="7.5" />
            <g className={styles.loopGlyph} transform={`translate(36 ${rowY})`}>
              <ellipse rx="7.9" ry="3.7" transform="rotate(45)" />
              <ellipse rx="7.9" ry="3.7" transform="rotate(-45)" />
            </g>
            <text
              className={styles.label}
              x="56"
              y={rowY + 4}
              textLength={textLength > panelWidth - 72 ? panelWidth - 72 : undefined}
              lengthAdjust="spacingAndGlyphs"
            >
              {cadence} <tspan className={styles.task}>{task}</tspan>
            </text>

            <g transform={`translate(${x - tileSize / 2} ${tileY})`}>
              <rect className={styles.tileOutline} x=".5" y=".5" width={tileSize - 1} height={tileSize - 1} rx={tileSize * 0.12} />
              <rect className={styles.tile} x={tileSize / 2 - 35.5} y={tileSize / 2 - 35.5} width="71" height="71" rx="3.5" />
              <g data-loop-tile={tile} transform={`translate(${tileSize / 2 - 27} ${tileSize / 2 - 27})`}>
                {dots.map(({ x, y }, index) => (
                  <circle
                    className={styles.dot}
                    key={index}
                    cx={dotDiameter / 2 + x * dotPitch}
                    cy={dotDiameter / 2 + y * dotPitch}
                    r={dotDiameter / 2}
                    style={{ "--dot-timeline": dotTimelines[tile][index] } as CSSProperties}
                  />
                ))}
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

export default function RecurringWorkLoop({
  title = "Put recurring work on a loop.",
  description = "Run agents on a schedule or when work matches your criteria. Each loop keeps its run history as context, so every pass builds on the last.",
  triggers = defaultTriggers,
  theme = "dark",
  animated = true,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !animated) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(root);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <figure
      ref={rootRef}
      className={styles.root}
      data-collected="recurring-work-loop"
      data-theme={theme}
      data-running={animated && visible && !paused ? "" : undefined}
      data-static={!animated ? "" : undefined}
      style={{ "--cycle": `${cycleMs}ms` } as CSSProperties}
    >
      <span className={styles.border} aria-hidden="true" />
      <div className={`${styles.illustration} ${mono.className}`}>
        <LoopDiagram triggers={triggers} />
        <LoopDiagram triggers={triggers} compact />
      </div>

      {animated && (
        <button
          className={styles.playback}
          type="button"
          aria-label={paused ? "Play diagram animation" : "Pause diagram animation"}
          onClick={() => setPaused((value) => !value)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            {paused ? <path d="M5 2.5 11 7l-6 4.5z" /> : <path d="M4 3h2v8H4zm4 0h2v8H8z" />}
          </svg>
        </button>
      )}
      <figcaption className={styles.caption}>
        <p className={styles.lead}>{title}</p>
        <p className={styles.description}>{description}</p>
        <span className={styles.srOnly}>
          {triggers.map(({ cadence, task }) => `${cadence} ${task}`).join(", ")}.
          Each trigger sends work to an agent and receives its result.
        </span>
      </figcaption>
    </figure>
  );
}
