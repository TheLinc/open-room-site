import type { CrewId } from "@/lib/crew";

/**
 * The hero's script. Plays once, about twenty-five seconds, and rests on the
 * finished conversation. It drives three things from one clock: the thread
 * in the app window, the ripples through the pixel field, and the crew at
 * their desks. Every line traces to a real capability in the app README.
 */

export const CHAR_MS = 40;
/** After the last character, how long before the agent starts working. */
export const LAND_MS = 400;
export const END_MS = 26000;
/** A reply is "being spoken" for this long after it lands. */
export const SPOKEN_MS = 2200;
/** How long a ripple takes to travel from the pill to the desk row. */
export const RIPPLE_MS = 700;
/** How long an agent glances up once the ripple reaches it. */
export const GLANCE_MS = 1400;

export type HeroEvent =
  | { at: number; kind: "say"; agent: CrewId; text: string }
  | { at: number; kind: "reply"; agent: CrewId; text: string; ask?: boolean }
  | { at: number; kind: "done"; agent: CrewId };

export const SCRIPT: HeroEvent[] = [
  { at: 800, kind: "say", agent: "bit", text: "hey Bit, run the tests" },
  {
    at: 4700,
    kind: "say",
    agent: "block",
    text: "hey Block, what's the status of my CI pipeline?",
  },
  { at: 8200, kind: "reply", agent: "block", text: "Let me check that." },
  {
    at: 10700,
    kind: "reply",
    agent: "block",
    text: "CI is green. Deploy to staging?",
    ask: true,
  },
  { at: 12700, kind: "say", agent: "block", text: "yes, go ahead" },
  { at: 14700, kind: "reply", agent: "bit", text: "Tests passed, 42 green." },
  { at: 14700, kind: "done", agent: "bit" },
  {
    at: 17200,
    kind: "say",
    agent: "terminal",
    text: "hey Terminal, what did Block change?",
  },
  {
    at: 20700,
    kind: "reply",
    agent: "terminal",
    text: "Two files in ci/. Want the diff?",
    ask: true,
  },
  { at: 23200, kind: "reply", agent: "block", text: "Staging is live." },
  { at: 23200, kind: "done", agent: "block" },
];

export type RowStatus = "listening" | "working" | "asking" | "done" | "";

export interface HeroReply {
  text: string;
  at: number;
  ask: boolean;
  /** Still being spoken aloud. */
  playing: boolean;
}

export interface Exchange {
  agent: CrewId;
  at: number;
  text: string;
  /** "hey Bit," or "" when the line has no wake word. */
  wake: string;
  /** Characters spoken so far. */
  said: number;
  /** The agent has been addressed: its row shows. */
  called: boolean;
  status: RowStatus;
  replies: HeroReply[];
}

export interface Ripple {
  agent: CrewId;
  /** When it started, ms into the run. */
  at: number;
}

export interface HeroState {
  time: number;
  ended: boolean;
  /** A line is being spoken right now. */
  speaking: boolean;
  /** The agent the line being spoken is addressed to; the pill takes its colour. */
  speakingTo: CrewId | null;
  /** The agent whose name was just said, glancing up from its desk. */
  glancing: CrewId | null;
  /** Ripples that started recently, newest last. */
  ripples: Ripple[];
  /** Each agent's status at its desk. */
  desks: Record<CrewId, "idle" | "working" | "done">;
  exchanges: Exchange[];
}

/** Splits "hey Block, run the tests" into the wake word and the rest. */
export function splitWake(text: string): [string, string] {
  const m = /^(hey \w+,?)(.*)$/i.exec(text);
  return m ? [m[1], m[2]] : ["", text];
}

export function saidCount(text: string, at: number, time: number): number {
  if (time < at) return 0;
  return Math.min(text.length, Math.floor((time - at) / CHAR_MS));
}

function landsAt(ev: { at: number; text: string }): number {
  return ev.at + ev.text.length * CHAR_MS + LAND_MS;
}

/** When the wake word of a line has been fully said. */
function calledAt(ev: { at: number; text: string }): number {
  const [wake] = splitWake(ev.text);
  return ev.at + (wake ? wake.length : 3) * CHAR_MS;
}

const AGENTS: CrewId[] = ["clawd", "bit", "terminal", "block", "loop"];

export function heroStateAt(elapsedMs: number): HeroState {
  const time = Math.min(Math.max(0, elapsedMs), END_MS);
  const says = SCRIPT.filter(
    (e): e is Extract<HeroEvent, { kind: "say" }> =>
      e.kind === "say" && e.at <= time,
  );
  const done = new Set(CHAT_DONE(time));

  const exchanges: Exchange[] = says.map((say, i) => {
    const [wake] = splitWake(say.text);
    const said = saidCount(say.text, say.at, time);
    const called = time >= calledAt(say);
    const next = says.slice(i + 1).find((s) => s.agent === say.agent);
    const to = next ? next.at : Infinity;
    const replies: HeroReply[] = SCRIPT.flatMap((e) =>
      e.kind === "reply" &&
      e.agent === say.agent &&
      e.at >= say.at &&
      e.at < to &&
      e.at <= time
        ? [
            {
              text: e.text,
              at: e.at,
              ask: Boolean(e.ask),
              playing: time - e.at < SPOKEN_MS,
            },
          ]
        : [],
    );
    let status: RowStatus;
    if (next) status = "";
    else if (done.has(say.agent)) status = "done";
    else if (replies.length && replies[replies.length - 1].ask)
      status = "asking";
    else if (time >= landsAt(say)) status = "working";
    else status = "listening";
    return {
      agent: say.agent,
      at: say.at,
      text: say.text,
      wake,
      said,
      called,
      status,
      replies,
    };
  });

  const spoken = says.find(
    (s) => time >= s.at && time < s.at + s.text.length * CHAR_MS,
  );
  const speaking = Boolean(spoken);
  const speakingTo = spoken ? spoken.agent : null;

  // The ripple leaves the pill the moment the name is out; the agent glances
  // up when it arrives at the desks.
  let glancing: CrewId | null = null;
  const ripples: Ripple[] = [];
  for (const s of says) {
    const at = calledAt(s);
    if (time >= at + RIPPLE_MS && time < at + RIPPLE_MS + GLANCE_MS)
      glancing = s.agent;
    if (time >= at) ripples.push({ agent: s.agent, at });
  }

  const desks = Object.fromEntries(
    AGENTS.map((id) => [id, "idle"]),
  ) as HeroState["desks"];
  for (const s of says) if (time >= landsAt(s)) desks[s.agent] = "working";
  for (const id of done) desks[id] = "done";

  return {
    time,
    ended: time >= END_MS,
    speaking,
    speakingTo,
    glancing,
    ripples,
    desks,
    exchanges,
  };
}

function CHAT_DONE(time: number): CrewId[] {
  return SCRIPT.filter((e) => e.kind === "done" && e.at <= time).map(
    (e) => e.agent,
  );
}

/** The finished conversation, for reduced motion and after the run. */
export function heroStill(): HeroState {
  return { ...heroStateAt(END_MS), ripples: [] };
}
