"use client";

import type { AgentColor, HeroState } from "@/lib/hero-script";

const textColor: Record<AgentColor, string> = {
  teal: "text-agent-teal",
  red: "text-agent-red",
};

const dotColor: Record<AgentColor, string> = {
  teal: "bg-agent-teal",
  red: "bg-agent-red",
};

export function TalkPanel({ state }: { state: HeroState }) {
  const typing = state.talk !== null && state.talk.typed.length < state.talk.full.length;

  return (
    <div
      aria-hidden="true"
      className={`min-h-32 font-mono text-sm transition-opacity duration-500 md:text-base ${
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

      <ul className="mt-2 space-y-1">
        {state.replies.map((r) => (
          <li key={r.text} className={textColor[r.color]}>
            {r.name}: <span className="text-zinc-300">{r.text}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-3 flex flex-wrap gap-2">
        {state.pips.map((p) => (
          <li
            key={p.name}
            className="flex items-center gap-1.5 rounded-full border border-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
          >
            <span
              className={`inline-block size-1.5 rounded-full ${dotColor[p.color]} ${
                p.status === "working" ? "animate-pulse" : ""
              }`}
            />
            {`${p.name} · ${p.status}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
