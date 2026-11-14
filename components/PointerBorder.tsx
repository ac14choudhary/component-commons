"use client";

import { useEffect, useRef } from "react";
import styles from "./PointerBorder.module.css";

type PointerPosition = Pick<PointerEvent, "pointerType" | "clientX" | "clientY">;

export function trackBorderPointer(host: HTMLElement, { pointerType, clientX, clientY }: PointerPosition) {
  if (pointerType === "touch") return;
  const bounds = host.getBoundingClientRect();
  if (clientX < bounds.left || clientX > bounds.right || clientY < bounds.top || clientY > bounds.bottom) {
    clearBorderPointer(host);
    return;
  }
  host.style.setProperty("--pointer-border-x", `${clientX - bounds.left}px`);
  host.style.setProperty("--pointer-border-y", `${clientY - bounds.top}px`);
  if (!host.hasAttribute("data-pointer")) host.dataset.pointer = "";
}

export function clearBorderPointer(host: HTMLElement, resetPosition = false) {
  delete host.dataset.pointer;
  if (resetPosition) {
    host.style.removeProperty("--pointer-border-x");
    host.style.removeProperty("--pointer-border-y");
  }
}

/** Decorative layer for a positioned card with a 1px border. */
export default function PointerBorder({ trackParent = true }: { trackParent?: boolean }) {
  const layer = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = layer.current?.parentElement;
    if (!trackParent || !host) return;
    const onPointer = (event: PointerEvent) => trackBorderPointer(host, event);
    const onExit = () => clearBorderPointer(host);
    host.addEventListener("pointerenter", onPointer);
    host.addEventListener("pointermove", onPointer);
    host.addEventListener("pointerleave", onExit);
    host.addEventListener("pointercancel", onExit);
    return () => {
      host.removeEventListener("pointerenter", onPointer);
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onExit);
      host.removeEventListener("pointercancel", onExit);
      clearBorderPointer(host, true);
    };
  }, [trackParent]);

  return <span ref={layer} aria-hidden="true" data-pointer-border="" className={styles.layer} />;
}
