"use client";

import type { CSSProperties } from "react";
import { ABSORB_MS, TRAVEL_MS, lines, type CrewState } from "@/lib/crew-script";
import type { HeroGeometry } from "@/components/lamp/use-hero-geometry";

/** How fast the stream moves, in hero pixels per second. */
export const STREAM_SPEED = 200;

// Where a line's centre is at a moment in the loop: it arrives over its
// agent's desk exactly when the script says the agent starts working, and
// before that it is to the left, moving right at a steady speed.
export function lineX(
  targetX: number,
  arrivalMs: number,
  timeMs: number,
): number {
  return targetX - (STREAM_SPEED * (arrivalMs - timeMs)) / 1000;
}

export function streamIsSpeaking(geo: HeroGeometry, time: number): boolean {
  return lines.some((line) => {
    const t = geo.targets[line.agent];
    if (!t) return false;
    const arrival = line.at + TRAVEL_MS;
    const x = lineX(t.x, arrival, time);
    const half = line.text.length * 4.6;
    return time < arrival && x - half < 0 && x + half > -8;
  });
}

// The continuous stream. One lane runs between the copy and the desks and
// everything you say moves through it left to right without stopping. When
// a line reaches the desk of the agent it names, it drops into that screen
// and the stream carries on.
export function StreamLane({
  state,
  geo,
  arrival: arrivalStyle = "drop",
}: {
  state: CrewState;
  geo: HeroGeometry | null;
  /** What a line does when it reaches its desk: drop into the screen, or fade while a card takes it. */
  arrival?: "drop" | "fade";
}) {
  return (
    <div className="lamp-lane" aria-hidden="true">
      {geo && geo.laneY !== null
        ? lines.map((line) => {
            const t = geo.targets[line.agent];
            if (!t) return null;
            const arrival = line.at + TRAVEL_MS;
            if (state.time >= arrival + ABSORB_MS) return null;
            const x = lineX(t.x, arrival, state.time);
            if (x + line.text.length * 6 < 0) return null;
            const arrived = state.time >= arrival;
            const cls = arrived
              ? arrivalStyle === "drop"
                ? "is-dropping"
                : "is-fading"
              : "";
            return (
              <span
                key={`${line.agent}:${line.at}`}
                className={`lamp-stream-line ${cls}`}
                style={
                  {
                    left: x,
                    "--drop": `${t.y - geo.laneY!}px`,
                  } as CSSProperties
                }
              >
                {line.text}
              </span>
            );
          })
        : null}
    </div>
  );
}
