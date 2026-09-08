"use client";

import type { CSSProperties } from "react";
import { CrewFace } from "@/components/crew-face";
import { crew, crewById, type CrewId } from "@/lib/crew";
import {
  ABSORB_MS,
  CHAR_MS,
  SCRIPT,
  TRAVEL_MS,
  lines,
  type CrewState,
} from "@/lib/crew-script";

// Each agent's folder, the thing that makes it a separate agent in Claude Code.
const folders: Record<CrewId, string> = {
  clawd: "~/work/api",
  bit: "~/work/web",
  terminal: "~/work/infra",
  block: "~/work/ci",
  loop: "~/work/docs",
};

export type TranscriptItem =
  | { kind: "you"; at: number; text: string; agent: CrewId }
  | { kind: "agent"; at: number; text: string; agent: CrewId };

/** Everything said so far this loop, in order. Your lines land when the mic
 *  bar hands them over; replies land when the script says. */
export function transcriptAt(time: number): TranscriptItem[] {
  const items: TranscriptItem[] = [];
  for (const line of lines) {
    const at = line.at + TRAVEL_MS;
    if (time >= at)
      items.push({ kind: "you", at, text: line.text, agent: line.agent });
  }
  for (const ev of SCRIPT) {
    if (ev.kind === "reply" && time >= ev.at)
      items.push({ kind: "agent", at: ev.at, text: ev.text, agent: ev.agent });
  }
  return items.sort((a, b) => a.at - b.at);
}

/** What the mic bar shows: the line being spoken, typed out as it is heard. */
export function micAt(time: number): {
  listening: boolean;
  text: string;
  agent: CrewId | null;
} {
  for (const line of lines) {
    if (time >= line.at && time < line.at + TRAVEL_MS) {
      const typed = Math.min(
        line.text.length,
        Math.floor((time - line.at) / CHAR_MS),
      );
      return {
        listening: true,
        text: line.text.slice(0, typed),
        agent: line.agent,
      };
    }
  }
  return { listening: false, text: "", agent: null };
}

/** The agent whose name was just said, before it starts working. */
export function calledAgent(time: number): CrewId | null {
  for (const line of lines) {
    const at = line.at + TRAVEL_MS;
    if (time >= at && time < at + ABSORB_MS) return line.agent;
  }
  return null;
}

// The Open Room window: agents down the side, the conversation in the
// middle, the mic along the bottom. This is the product, drawn, with the
// script playing inside it.
export function AppWindow({ state }: { state: CrewState }) {
  const items = transcriptAt(state.time);
  const mic = micAt(state.time);
  const called = calledAgent(state.time);
  const latest = items[items.length - 1];

  return (
    <div
      className={`app ${state.fading ? "is-fading" : ""}`}
      aria-hidden="true"
    >
      <div className="app-titlebar">
        <span className="app-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="app-title">Open Room</span>
        <span className={`app-mic-state ${mic.listening ? "is-on" : ""}`}>
          <i /> {mic.listening ? "listening" : "ready"}
        </span>
      </div>

      <div className="app-body">
        <aside className="app-rail">
          <div className="app-rail-head">Agents</div>
          {crew.map((m) => {
            const a = state.agents[m.id];
            const status = called === m.id ? "listening" : a.status;
            const tint = { "--agent": m.color } as CSSProperties;
            return (
              <div key={m.id} className={`app-agent is-${status}`} style={tint}>
                <CrewFace id={m.id} size={26} className="app-agent-face" />
                <span className="app-agent-text">
                  <b>{m.name}</b>
                  <small>{folders[m.id]}</small>
                </span>
                <span className="app-agent-status">
                  <i />
                  {status === "idle" ? "" : status}
                </span>
              </div>
            );
          })}
        </aside>

        <section className="app-main">
          <ol className="app-transcript">
            {items.map((item) => {
              const m = crewById[item.agent];
              const tint = {
                "--agent": m.color,
                "--agent-screen": m.screen,
              } as CSSProperties;
              const fresh = item === latest && state.time - item.at < 2600;
              return item.kind === "you" ? (
                <li
                  key={`you:${item.at}`}
                  className="app-msg is-you"
                  style={tint}
                >
                  <span className="app-msg-who">You</span>
                  <p className="app-msg-text">{item.text}</p>
                </li>
              ) : (
                <li
                  key={`agent:${item.at}`}
                  className="app-msg is-agent"
                  style={tint}
                >
                  <CrewFace
                    id={item.agent}
                    size={22}
                    className="app-msg-face"
                  />
                  <span className="app-msg-who">{m.name}</span>
                  <p className="app-msg-text">{item.text}</p>
                  <span
                    className={`app-msg-voice ${fresh ? "is-playing" : ""}`}
                  >
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <em>{fresh ? "speaking" : "spoken"}</em>
                  </span>
                </li>
              );
            })}
          </ol>

          <div className={`app-micbar ${mic.listening ? "is-on" : ""}`}>
            <span className="app-wave">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <i key={i} style={{ "--n": i } as CSSProperties} />
              ))}
            </span>
            {mic.listening ? (
              <span className="app-mic-text">
                {mic.text}
                <span className="app-caret" />
              </span>
            ) : (
              <span className="app-mic-hint">
                Say <b>hey</b> and a name, or hold <kbd>⌥ Space</kbd>
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
