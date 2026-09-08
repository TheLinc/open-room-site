"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

function same<T>(a: T, b: T) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// Drives a scripted animation: calls stateAt with the ms since mount on every
// animation frame and re-renders only when the state changes. Under reduced
// motion it holds the given still frame instead.
export function useTimeline<T>(stateAt: (ms: number) => T, still: () => T): { state: T; reduced: boolean } {
  const reduced = usePrefersReducedMotion();
  const [live, setLive] = useState<T>(() => stateAt(0));

  useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    let last = stateAt(0);
    let raf = 0;
    const tick = (now: number) => {
      const next = stateAt(now - start);
      if (!same(last, next)) {
        last = next;
        setLive(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, stateAt]);

  return { state: reduced ? still() : live, reduced };
}
