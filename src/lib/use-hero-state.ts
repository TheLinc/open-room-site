"use client";

import { reducedMotionState, stateAt, type HeroState } from "@/lib/hero-script";
import { useTimeline } from "@/lib/use-timeline";

// The dark site's room hero: status pips, replies and the typed line.
export function useHeroState(): { state: HeroState; reduced: boolean } {
  return useTimeline(stateAt, reducedMotionState);
}
