"use client";

import { useEffect, useState, type RefObject } from "react";
import type { CrewId } from "@/lib/crew";

export type Point = { x: number; y: number };

export interface HeroGeometry {
  width: number;
  /** Bottom centre of the voice pill. */
  pill: Point;
  /** The pill's box, for lanes that leave it from a corner. */
  pillBox: {
    x: number;
    y: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
  } | null;
  /** The headline's box, so lanes can clear it. */
  headline: { top: number; right: number } | null;
  /** Vertical centre of the stream lane, if the hero has one. */
  laneY: number | null;
  /** Where each agent is: the centre of its screen, or the left edge of its row. */
  targets: Partial<Record<CrewId, Point>>;
}

// Measures where things are inside the hero, in hero pixels, and again
// whenever it resizes or the fonts arrive. A plain effect rather than a
// layout effect: the hero's ref belongs to the parent, which React attaches
// after children's layout effects have run.
export function useHeroGeometry(
  heroRef: RefObject<HTMLElement | null>,
  pillRef: RefObject<HTMLElement | null>,
): HeroGeometry | null {
  const [geo, setGeo] = useState<HeroGeometry | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const measure = () => {
      const h = hero.getBoundingClientRect();
      const pill = pillRef.current;
      const p = pill?.getBoundingClientRect();
      const lane = hero.querySelector(".lamp-lane")?.getBoundingClientRect();
      const headline = hero.querySelector(".lamp-h1")?.getBoundingClientRect();
      const targets: HeroGeometry["targets"] = {};
      hero
        .querySelectorAll<SVGRectElement>(".crew-screen[data-agent]")
        .forEach((el) => {
          const r = el.getBoundingClientRect();
          targets[el.dataset.agent as CrewId] = {
            x: r.left + r.width / 2 - h.left,
            y: r.top + r.height / 2 - h.top,
          };
        });
      hero
        .querySelectorAll<HTMLElement>(".sb-row[data-agent]")
        .forEach((el) => {
          const r = el.getBoundingClientRect();
          targets[el.dataset.agent as CrewId] = {
            x: r.left - h.left - 10,
            y: r.top + r.height / 2 - h.top,
          };
        });
      setGeo({
        width: h.width,
        pill: p
          ? { x: p.left + p.width / 2 - h.left, y: p.bottom - h.top }
          : { x: 0, y: 0 },
        pillBox: p
          ? {
              x: p.left + p.width / 2 - h.left,
              y: p.top + p.height / 2 - h.top,
              top: p.top - h.top,
              left: p.left - h.left,
              right: p.right - h.left,
              bottom: p.bottom - h.top,
            }
          : null,
        headline: headline
          ? { top: headline.top - h.top, right: headline.right - h.left }
          : null,
        laneY: lane ? lane.top + lane.height / 2 - h.top : null,
        targets,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [heroRef, pillRef]);

  return geo;
}
