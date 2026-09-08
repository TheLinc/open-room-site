"use client";

import type { CSSProperties } from "react";
import type { AgentColor, HeroState, Reply } from "@/lib/hero-script";
import { agentSpots } from "@/lib/room-frames";

const dotColor: Record<AgentColor, string> = {
  teal: "bg-agent-teal",
  red: "bg-agent-red",
};

const bubbleColor: Record<AgentColor, string> = {
  teal: "var(--color-agent-teal)",
  red: "var(--color-agent-red)",
};

// The last thing each agent said, so a bubble never stacks on itself.
function latestByAgent(replies: Reply[]): Reply[] {
  const seen = new Map<string, Reply>();
  for (const r of replies) seen.set(r.name, r);
  return [...seen.values()];
}

// What floats over the room: a status label above each agent's head and a
// speech bubble for whatever that agent said last.
export function RoomOverlay({ state }: { state: HeroState }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 font-mono text-xs transition-opacity duration-500 ${
        state.fading ? "opacity-0" : "opacity-100"
      }`}
    >
      {state.pips.map((p) => {
        const spot = agentSpots[p.name];
        if (!spot) return null;
        return (
          <span
            key={p.name}
            data-testid="pip"
            className="room-pill absolute flex -translate-x-1/2 -translate-y-full items-center gap-1.5 px-2 py-0.5 text-zinc-300"
            style={
              {
                left: `${spot.x * 100}%`,
                top: `${spot.y * 100}%`,
                "--bubble": bubbleColor[p.color],
              } as CSSProperties
            }
          >
            <span
              className={`inline-block size-1.5 rounded-full ${dotColor[p.color]} ${
                p.status === "working" ? "animate-pulse" : ""
              }`}
            />
            {`${p.name} · ${p.status}`}
          </span>
        );
      })}

      {latestByAgent(state.replies).map((r) => {
        const spot = agentSpots[r.name];
        if (!spot) return null;
        const style = {
          left: `${spot.x * 100}%`,
          top: `${spot.y * 100}%`,
          "--bubble": bubbleColor[r.color],
        } as CSSProperties;
        return (
          <p
            key={`${r.name}:${r.text}`}
            data-testid="bubble"
            className="speech-bubble max-w-[62%] px-3.5 py-2 font-sans text-[13px] leading-snug text-zinc-100"
            style={style}
          >
            {r.text}
          </p>
        );
      })}
    </div>
  );
}
