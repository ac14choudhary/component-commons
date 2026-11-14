"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./MediaMask.module.css";

export type MediaMaskProps = {
  /** Optional initials in place of the geometric cutout. */
  letters?: string;
  theme?: "light" | "dark";
  /** Show a still preview without playback controls. */
  paused?: boolean;
  label?: string;
  /** Optional video to show through the mark. */
  videoSrc?: string;
  poster?: string;
};

const normalize = `scale(${1 / 720} ${1 / 360})`;
const facets = "M48 180 212 16 376 180 212 344Z M274 180 438 16 508 86 344 250Z M378 280 542 116 672 246 578 340Z";

export default function MediaMask({
  letters,
  theme = "dark",
  paused = false,
  label = "Geometric media mask",
  videoSrc,
  poster,
}: MediaMaskProps) {
  const id = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stopped, setStopped] = useState(false);
  const isPaused = paused || stopped;
  const initials = Array.from(letters?.trim().toUpperCase() ?? "").slice(0, 2).join("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (isPaused || motion.matches) video.pause();
      else void video.play().catch(() => {
        // The procedural media layer still works if playback is unavailable.
      });
    };

    syncPlayback();
    motion.addEventListener("change", syncPlayback);
    return () => {
      motion.removeEventListener("change", syncPlayback);
      video.pause();
    };
  }, [isPaused, videoSrc]);

  return (
    <figure className={styles.root} data-collected="media-mask" data-theme={theme} data-paused={isPaused || undefined}>
      <div className={styles.stage} aria-hidden="true">
        <svg className={styles.definitions} width="0" height="0" focusable="false">
          <defs>
            <clipPath id={id} clipPathUnits="objectBoundingBox">
              {initials ? (
                <text className={styles.initials} transform={normalize} x="360" y="296" textAnchor="middle">
                  {initials}
                </text>
              ) : (
                <path d={facets} transform={normalize} />
              )}
            </clipPath>
          </defs>
        </svg>
        <div className={styles.window} style={{ clipPath: `url("#${id}")` }}>
          <div className={styles.media} />
          {videoSrc && <video ref={videoRef} className={styles.video} src={videoSrc} poster={poster} loop muted playsInline preload="metadata" />}
        </div>
      </div>
      <figcaption className={styles.srOnly}>{label}</figcaption>
      {!paused && (
        <button className={styles.toggle} type="button" onClick={() => setStopped(!stopped)}>
          {stopped ? "Play motion" : "Pause motion"}
        </button>
      )}
    </figure>
  );
}
