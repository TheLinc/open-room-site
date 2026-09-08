import { crew, type CrewId } from "@/lib/crew";

/**
 * The hero's timeline. A spoken line travels along a path into the named
 * agent's screen, the agent starts working, and replies come back as
 * bubbles. Times are ms from loop start; the loop is LOOP_MS long.
 */

export type Phase = "travel" | "absorb";
export type Status = "idle" | "working" | "done";

export interface Talk {
  agent: CrewId;
  text: string;
  phase: Phase;
  /** Progress through the phase, 0 to 1. */
  t: number;
}

export interface AgentState {
  status: Status;
  reply: string | null;
}

export interface CrewState {
  talk: Talk | null;
  agents: Record<CrewId, AgentState>;
  fading: boolean;
  /** Milliseconds into the current loop, for things that move continuously. */
  time: number;
}

export interface Line {
  agent: CrewId;
  text: string;
  /** When the line is said, ms into the loop. */
  at: number;
}

export const TRAVEL_MS = 3000;
/** After arriving, the line is taken in (typed, dropped) for this long before the agent is working. */
export const ABSORB_MS = 1500;
/** Typing speed in the terminal card, ms per character. */
export const CHAR_MS = 40;
export const LOOP_MS = 20000;
export const FADE_AT_MS = 19200;

type Event =
  | { at: number; kind: "say"; agent: CrewId; text: string }
  | { at: number; kind: "status"; agent: CrewId; status: Status }
  | { at: number; kind: "reply"; agent: CrewId; text: string };

const said = (at: number, agent: CrewId, text: string): Event[] => [
  { at, kind: "say", agent, text },
  { at: at + TRAVEL_MS + ABSORB_MS, kind: "status", agent, status: "working" },
];

export const SCRIPT: Event[] = [
  ...said(600, "bit", "hey Bit, run the tests"),
  ...said(6000, "block", "hey Block, what's the status of my CI pipeline?"),
  { at: 10800, kind: "reply", agent: "block", text: "Let me check that for you." },
  { at: 13800, kind: "reply", agent: "block", text: "The CI pipeline ran successfully." },
  { at: 13800, kind: "status", agent: "block", status: "done" },
  { at: 16000, kind: "reply", agent: "bit", text: "Tests passed, all green." },
  { at: 16000, kind: "status", agent: "bit", status: "done" },
];

function idle(): Record<CrewId, AgentState> {
  return Object.fromEntries(crew.map((c) => [c.id, { status: "idle", reply: null }])) as Record<
    CrewId,
    AgentState
  >;
}

export function stateAt(elapsedMs: number): CrewState {
  const t = ((elapsedMs % LOOP_MS) + LOOP_MS) % LOOP_MS;
  const agents = idle();
  let talk: Talk | null = null;

  for (const ev of SCRIPT) {
    if (ev.at > t) break;
    switch (ev.kind) {
      case "say": {
        const since = t - ev.at;
        if (since < TRAVEL_MS) talk = { agent: ev.agent, text: ev.text, phase: "travel", t: since / TRAVEL_MS };
        else if (since < TRAVEL_MS + ABSORB_MS)
          talk = { agent: ev.agent, text: ev.text, phase: "absorb", t: (since - TRAVEL_MS) / ABSORB_MS };
        else talk = null;
        break;
      }
      case "status":
        agents[ev.agent] = { ...agents[ev.agent], status: ev.status };
        break;
      case "reply":
        agents[ev.agent] = { ...agents[ev.agent], reply: ev.text };
        break;
    }
  }

  return { talk, agents, fading: t >= FADE_AT_MS, time: t };
}

/** The spoken lines in order, for flows that lay the whole script out at once. */
export const lines: Line[] = SCRIPT.flatMap((ev) => (ev.kind === "say" ? [{ agent: ev.agent, text: ev.text, at: ev.at }] : []));

/** One busy frame for people who asked for less motion. */
export function reducedMotionState(): CrewState {
  return { ...stateAt(11500), talk: null, fading: false };
}
