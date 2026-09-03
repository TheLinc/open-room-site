"use client";

import { useEffect, useState, type ReactNode } from "react";
import { copy } from "@/lib/copy";
import { reducedMotionState, stateAt, type HeroState } from "@/lib/hero-script";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { RoomLoop } from "@/components/room-loop";
import { TalkPanel } from "@/components/talk-panel";

function same(a: HeroState, b: HeroState) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function HeroLoop({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [live, setLive] = useState<HeroState>(() => stateAt(0));
  const state = reduced ? reducedMotionState() : live;

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
  }, [reduced]);

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-8">
      <div className="order-2 flex flex-col gap-6 lg:order-1 lg:col-span-3">
        <p className="text-sm text-zinc-400">{copy.eyebrow}</p>
        <TalkPanel state={state} />
        {children}
      </div>
      <div className="order-1 lg:order-2 lg:col-span-2">
        <RoomLoop reduced={reduced} />
      </div>
    </div>
  );
}
