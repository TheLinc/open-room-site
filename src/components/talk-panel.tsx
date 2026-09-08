"use client";

import type { AgentColor, HeroState } from "@/lib/hero-script";

const dotColor: Record<AgentColor, string> = {
  teal: "bg-agent-teal",
  red: "bg-agent-red",
};

// The line you are saying to the room, typed out under it. Replies come back as
// speech bubbles in the room itself.
export function TalkPanel({ state }: { state: HeroState }) {
  const typing = state.talk !== null && state.talk.typed.length < state.talk.full.length;

  return (
    <div
      aria-hidden="true"
      className={`min-h-6 font-mono text-sm transition-opacity duration-500 ${
        state.fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="flex min-h-6 items-center gap-2 text-foreground">
        {state.talk ? (
          <>
            <span className={`inline-block size-2 shrink-0 rounded-full ${dotColor[state.talk.color]}`} />
            <span>{state.talk.typed}</span>
            {typing ? (
              <span data-testid="caret" className="animate-pulse text-zinc-500">
                ▍
              </span>
            ) : null}
          </>
        ) : null}
      </p>
    </div>
  );
}
