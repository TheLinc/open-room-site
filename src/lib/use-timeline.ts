"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

function same<T>(a: T, b: T) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// Drives a scripted animation: calls stateAt with the ms since mount on every
// animation frame and re-renders only when the state changes. Under reduced
// motion it holds the given still frame instead. `elapsed` reads the same
// clock without a render, for canvases that draw between state changes.
export function useTimeline<T>(
  stateAt: (ms: number) => T,
  still: () => T,
): { state: T; reduced: boolean; elapsed: () => number } {
  const reduced = usePrefersReducedMotion();
  const [live, setLive] = useState<T>(() => stateAt(0));
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    startRef.current = start;
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

  const elapsed = useCallback(
    () =>
      startRef.current === null ? 0 : performance.now() - startRef.current,
    [],
  );

  return { state: reduced ? still() : live, reduced, elapsed };
}
