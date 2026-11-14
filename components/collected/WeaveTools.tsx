"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./WeaveTools.module.css";

const tools = [
  { id: "crop", label: "Crop", side: "left", x: 7.8, y: 7.7, width: 7 },
  { id: "invert", label: "Invert", side: "left", x: 32.9, y: 21.4, width: 7.85 },
  { id: "outpaint", label: "Outpaint", side: "left", x: 22.9, y: 34.9, width: 7.85 },
  { id: "inpaint", label: "Inpaint", side: "left", x: 11.4, y: 48.5, width: 7.85 },
  { id: "mask", label: "Mask Extractor", side: "left", x: 33.8, y: 62, width: 10 },
  { id: "upscale", label: "Upscale", side: "left", x: 21.4, y: 75.6, width: 7.85 },
  { id: "depth", label: "Z Depth Extractor", side: "right", x: 67.1, y: 75.6, width: 11.5 },
  { id: "describe", label: "Image Describer", side: "right", x: 74.8, y: 40.6, width: 10.54 },
  { id: "channels", label: "Channels", side: "right", x: 83.8, y: 26.4, width: 7.85 },
  { id: "painter", label: "Painter", side: "right", x: 91.2, y: 7.7, width: 7.85 },
  { id: "relight", label: "Relight", side: "right", x: 89.4, y: 62, width: 7.85 },
] as const;

type Tool = (typeof tools)[number]["id"];
type Scene = Tool | "default";

const mobileTools: { id: Scene; label: string }[] = [
  { id: "inpaint", label: "Inpaint" },
  { id: "default", label: "Default" },
  { id: "describe", label: "Describer" },
  { id: "outpaint", label: "Outpaint" },
  { id: "channels", label: "Channels" },
  { id: "upscale", label: "Upscale" },
  { id: "depth", label: "Z Depth" },
  { id: "relight", label: "Relight" },
  { id: "painter", label: "Painter" },
  { id: "crop", label: "Crop" },
  { id: "invert", label: "Invert" },
];

const desktopScenes: Scene[] = ["default", ...tools.map(({ id }) => id)];
const defaultImage = "/demo/art/ceramic.webp";
const defaultDescription = "A dark green ceramic vessel sits on a pale pedestal. A warm diagonal beam gives the scene a bright background and a soft shadow.";

type Props = {
  theme?: "light" | "dark";
  heading?: string;
  subheading?: string;
  image?: string;
  description?: string;
};

function Artwork({ scene, image, description }: { scene: Scene; image: string; description: string }) {
  const label = scene === "default" ? description
    : `${tools.find(({ id }) => id === scene)?.label} preview. ${description}`;

  return (
    <div className={styles.artwork} role="img" aria-label={label} data-scene={scene}>
      <div className={styles.image} aria-hidden="true">
        {image && <Image src={image} alt="" fill unoptimized sizes="(max-width: 767px) 100vw, 394px" />}
      </div>
      {scene === "crop" && (
        <div className={styles.cropWindow} aria-hidden="true">
          {image && <Image src={image} alt="" fill unoptimized sizes="394px" />}
        </div>
      )}
      {(scene === "inpaint" || scene === "mask" || scene === "upscale") && (
        <div className={styles.detail} aria-hidden="true">
          {image && <Image src={image} alt="" fill unoptimized sizes="394px" />}
        </div>
      )}
      {scene === "channels" && (
        <div className={styles.channels} aria-hidden="true">
          {["warm", "blue", "green"].map((channel) => (
            <div key={channel} data-channel={channel}>
              {image && <Image src={image} alt="" fill unoptimized sizes="394px" />}
            </div>
          ))}
        </div>
      )}
      {scene === "describe" && <p className={styles.description} aria-hidden="true">{description}</p>}
    </div>
  );
}

function Stage({ scenes, active, image, description }: { scenes: readonly Scene[]; active: Scene; image: string; description: string }) {
  return (
    <div className={styles.stage} data-active={active}>
      {scenes.map((scene) => (
        <div key={scene} className={styles.layer} data-visible={active === scene} aria-hidden={active !== scene}>
          <Artwork scene={scene} image={image} description={description} />
        </div>
      ))}
    </div>
  );
}

export default function WeaveTools({
  theme = "light",
  heading = "With all the professional tools you rely on",
  subheading = "In one seamless workflow",
  image = defaultImage,
  description = defaultDescription,
}: Props) {
  const [hovered, setHovered] = useState<Tool | null>(null);
  const [focused, setFocused] = useState<Tool | null>(null);
  const [tapped, setTapped] = useState<Tool | null>(null);
  const [mobile, setMobile] = useState<Scene>("default");
  const active = hovered ?? focused ?? tapped ?? "default";
  const rail = useRef<HTMLDivElement>(null);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);

  function center(button: HTMLButtonElement, smooth: boolean) {
    const track = rail.current;
    if (!track || !track.clientWidth) return;
    const middle = track.getBoundingClientRect().left + track.clientWidth / 2;
    const target = button.getBoundingClientRect();
    const left = track.scrollLeft + target.left + target.width / 2 - middle;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left, behavior: smooth && !reduced ? "smooth" : "instant" });
  }

  useEffect(() => {
    const track = rail.current;
    if (!track) return;
    const observer = new ResizeObserver(() => {
      const selected = track.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
      if (selected) center(selected, false);
    });
    observer.observe(track);
    return () => {
      observer.disconnect();
      if (settle.current) clearTimeout(settle.current);
    };
  }, []);

  function followScroll() {
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const track = rail.current;
      if (!track?.clientWidth) return;
      const middle = track.getBoundingClientRect().left + track.clientWidth / 2;
      let closest: HTMLButtonElement | undefined;
      let distance = Infinity;
      for (const button of track.querySelectorAll<HTMLButtonElement>("button")) {
        const box = button.getBoundingClientRect();
        const offset = Math.abs(box.left + box.width / 2 - middle);
        if (offset < distance) {
          closest = button;
          distance = offset;
        }
      }
      if (closest) setMobile(closest.dataset.scene as Scene);
    }, 110);
  }

  return (
    <section className={styles.root} data-collected="weave-tools" data-theme={theme} aria-label="Professional tools">
      <div className={styles.layout}>
        <div className={styles.grid} aria-hidden="true" />
        <header className={styles.header}>
          <h2>{heading}</h2>
          <p>{subheading}</p>
        </header>
        <div className={styles.desktop}>
          <Stage scenes={desktopScenes} active={active} image={image} description={description} />
          <div className={styles.chips} role="group" aria-label="Tool previews" data-previewing={active !== "default"}>
            {tools.map(({ id, label, side, x, y, width }) => (
              <button
                key={id}
                type="button"
                className={styles.chip}
                data-side={side}
                aria-pressed={active === id}
                style={{ left: `${x}%`, top: `${y}%`, minWidth: `${width / 0.895}%` }}
                onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(id); }}
                onPointerLeave={() => setHovered(null)}
                onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setFocused(id); }}
                onBlur={() => setFocused(null)}
                onClick={(event) => {
                  if (event.detail === 0) setFocused(id);
                  else if (window.matchMedia("(hover: none)").matches) setTapped((current) => current === id ? null : id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setHovered(null);
                    setFocused(null);
                    setTapped(null);
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.mobile}>
          <Stage scenes={mobileTools.map(({ id }) => id)} active={mobile} image={image} description={description} />
          <div ref={rail} className={styles.rail} role="group" aria-label="Swipe through tool previews" onScroll={followScroll}>
            {mobileTools.map(({ id, label }) => (
              <button key={id} className={styles.chip} type="button" data-scene={id} aria-pressed={mobile === id} onClick={(event) => {
                setMobile(id);
                center(event.currentTarget, true);
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
