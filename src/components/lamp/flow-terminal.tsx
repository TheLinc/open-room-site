"use client";

import type { CSSProperties } from "react";
import { crewById, type CrewId } from "@/lib/crew";
import {
  ABSORB_MS,
  CHAR_MS,
  TRAVEL_MS,
  lines,
  type CrewState,
} from "@/lib/crew-script";
import type { HeroGeometry } from "@/components/lamp/use-hero-geometry";

/** How many characters of a line have been typed at a moment in the loop. */
export function typedCount(
  text: string,
  arrivalMs: number,
  timeMs: number,
): number {
  if (timeMs < arrivalMs) return 0;
  return Math.min(text.length, Math.floor((timeMs - arrivalMs) / CHAR_MS));
}

/** The agent whose name was just said and is turning round, if any. */
export function listeningAgent(time: number): CrewId | null {
  for (const line of lines) {
    const arrival = line.at + TRAVEL_MS;
    if (time >= arrival && time < arrival + ABSORB_MS) return line.agent;
  }
  return null;
}

/** True while a card is typing, so the pill's bars keep moving. */
export function terminalIsTyping(time: number): boolean {
  return lines.some((line) => {
    const arrival = line.at + TRAVEL_MS;
    return time >= arrival && time < arrival + line.text.length * CHAR_MS;
  });
}

// Terminal cards. When a line reaches an agent's desk it types into a small
// terminal above that desk, the way dictation lands in Claude Code. Replies
// print underneath in the agent's colour. Nothing flies anywhere.
export function TerminalCards({
  state,
  geo,
}: {
  state: CrewState;
  geo: HeroGeometry | null;
}) {
  if (!geo) return null;
  return (
    <div className="lamp-terminals" aria-hidden="true">
      {lines.map((line) => {
        const t = geo.targets[line.agent];
        if (!t) return null;
        const arrival = line.at + TRAVEL_MS;
        if (state.time < arrival) return null;
        const member = crewById[line.agent];
        const agent = state.agents[line.agent];
        const typed = typedCount(line.text, arrival, state.time);
        const typing = typed < line.text.length;
        const style = {
          left: t.x,
          top: t.y - 54,
          "--agent": member.color,
          "--agent-screen": member.screen,
        } as CSSProperties;
        return (
          <div
            key={`${line.agent}:${line.at}`}
            className={`lamp-term is-${agent.status}`}
            style={style}
          >
            <div className="lamp-term-bar">
              <span className="lamp-term-dot" />
              <span>{member.name}</span>
              <span className="lamp-term-app">claude</span>
            </div>
            <p className="lamp-term-line">
              <span className="lamp-term-prompt">&gt;</span>{" "}
              {line.text.slice(0, typed)}
              {typing ? <span className="lamp-term-caret" /> : null}
            </p>
            {!typing && agent.status === "working" && !agent.reply ? (
              <p className="lamp-term-line is-muted">
                <span className="lamp-term-spin" /> working
              </p>
            ) : null}
            {agent.reply ? (
              <p key={agent.reply} className="lamp-term-line is-reply">
                {agent.reply}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
