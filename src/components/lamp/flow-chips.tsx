"use client";

import type { CSSProperties } from "react";
import type { Talk } from "@/lib/crew-script";
import type { HeroGeometry } from "@/components/lamp/use-hero-geometry";

export const CHIP_GAP_MS = 130;
export const CHIP_FLIGHT_MS = 1100;

// Word chips. The sentence leaves the pill one word at a time, each word an
// upright chip that arcs down beside the copy and lands in a line above the
// named agent's monitor. The line then drops into the screen. Chips never
// rotate, so the arc can go anywhere and every word stays readable.
export function WordChips({ talk, geo }: { talk: Talk; geo: HeroGeometry }) {
  const target = geo.targets[talk.agent];
  if (!target) return null;

  const o = geo.pill;
  const dest = { x: target.x, y: target.y - 62 };
  const words = talk.text.split(" ");
  const narrow = geo.width < 700;
  // Swing out toward the side the desk is on, wide enough to clear the copy.
  const side = dest.x < o.x ? -1 : 1;
  const dx = narrow
    ? side * geo.width * 0.45
    : side * Math.max(260, geo.width * 0.3);
  const path = `M ${o.x},${o.y} C ${o.x + dx * 1.1},${o.y + 60} ${dest.x + dx * 0.9},${dest.y - 140} ${dest.x},${dest.y}`;

  return (
    <div className="lamp-flow" aria-hidden="true">
      {words.map((w, i) => (
        <span
          key={i}
          className="lamp-chip"
          style={
            {
              offsetPath: `path("${path}")`,
              animationDelay: `${i * CHIP_GAP_MS}ms`,
              animationDuration: `${CHIP_FLIGHT_MS}ms`,
            } as CSSProperties
          }
        >
          {w}
        </span>
      ))}
      <p
        className={`lamp-said ${talk.phase === "absorb" ? "is-absorbing" : ""}`}
        style={
          {
            left: dest.x,
            top: dest.y,
            "--drop": `${target.y - dest.y}px`,
          } as CSSProperties
        }
      >
        {words.map((w, i) => (
          <span
            key={i}
            style={{
              animationDelay: `${i * CHIP_GAP_MS + CHIP_FLIGHT_MS - 120}ms`,
            }}
          >
            {w}{" "}
          </span>
        ))}
      </p>
    </div>
  );
}
