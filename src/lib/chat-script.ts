import type { CrewId } from "@/lib/crew";

/**
 * The chat hero's script. Plays once, about twenty-six seconds, and rests on
 * the finished conversation. Five exchanges across three agents: a plain
 * command, a status question, an agent asking back and you answering with
 * no wake word, two agents busy at once, and an agent finishing late.
 */

export const CHAT_CHAR_MS = 40;
/** After the last character, how long before the agent starts working. */
export const CHAT_LAND_MS = 400;
export const CHAT_END_MS = 26000;
/** A reply is "being spoken" for this long after it lands. */
export const CHAT_SPOKEN_MS = 2200;

export type ChatEvent =
  | { at: number; kind: "say"; agent: CrewId; text: string }
  | { at: number; kind: "reply"; agent: CrewId; text: string; ask?: boolean }
  | { at: number; kind: "done"; agent: CrewId };

export const CHAT_SCRIPT: ChatEvent[] = [
  { at: 600, kind: "say", agent: "bit", text: "hey Bit, run the tests" },
  {
    at: 4500,
    kind: "say",
    agent: "block",
    text: "hey Block, what's the status of my CI pipeline?",
  },
  { at: 8000, kind: "reply", agent: "block", text: "Let me check that." },
  {
    at: 10500,
    kind: "reply",
    agent: "block",
    text: "CI is green. Deploy to staging?",
    ask: true,
  },
  { at: 12500, kind: "say", agent: "block", text: "yes, go ahead" },
  { at: 14500, kind: "reply", agent: "bit", text: "Tests passed, 42 green." },
  { at: 14500, kind: "done", agent: "bit" },
  {
    at: 17000,
    kind: "say",
    agent: "terminal",
    text: "hey Terminal, what did Block change?",
  },
  {
    at: 20500,
    kind: "reply",
    agent: "terminal",
    text: "Two files in ci/. Want the diff?",
    ask: true,
  },
  { at: 23000, kind: "reply", agent: "block", text: "Staging is live." },
  { at: 23000, kind: "done", agent: "block" },
];

export type RowStatus = "listening" | "working" | "asking" | "done" | "";

export interface ChatReply {
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
  replies: ChatReply[];
}

export interface ChatState {
  time: number;
  ended: boolean;
  /** A line is being spoken right now. */
  speaking: boolean;
  exchanges: Exchange[];
}

/** Splits "hey Block, run the tests" into the wake word and the rest. */
export function splitWake(text: string): [string, string] {
  const m = /^(hey \w+,?)(.*)$/i.exec(text);
  return m ? [m[1], m[2]] : ["", text];
}

export function saidCount(text: string, at: number, time: number): number {
  if (time < at) return 0;
  return Math.min(text.length, Math.floor((time - at) / CHAT_CHAR_MS));
}

function landsAt(ev: { at: number; text: string }): number {
  return ev.at + ev.text.length * CHAT_CHAR_MS + CHAT_LAND_MS;
}

export function chatStateAt(elapsedMs: number): ChatState {
  const time = Math.min(Math.max(0, elapsedMs), CHAT_END_MS);
  const says = CHAT_SCRIPT.filter(
    (e): e is Extract<ChatEvent, { kind: "say" }> =>
      e.kind === "say" && e.at <= time,
  );
  const done = new Set(
    CHAT_SCRIPT.filter((e) => e.kind === "done" && e.at <= time).map(
      (e) => e.agent,
    ),
  );

  const exchanges: Exchange[] = says.map((say, i) => {
    const [wake] = splitWake(say.text);
    const said = saidCount(say.text, say.at, time);
    const called = wake ? said >= wake.length : said >= 3;
    const next = says.slice(i + 1).find((s) => s.agent === say.agent);
    const window = { from: say.at, to: next ? next.at : Infinity };
    const replies: ChatReply[] = CHAT_SCRIPT.flatMap((e) =>
      e.kind === "reply" &&
      e.agent === say.agent &&
      e.at >= window.from &&
      e.at < window.to &&
      e.at <= time
        ? [
            {
              text: e.text,
              at: e.at,
              ask: Boolean(e.ask),
              playing: time - e.at < CHAT_SPOKEN_MS,
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

  const speaking = says.some(
    (s) => time >= s.at && time < s.at + s.text.length * CHAT_CHAR_MS,
  );
  return { time, ended: time >= CHAT_END_MS, speaking, exchanges };
}

/** The finished conversation, for reduced motion and after the run. */
export function chatStill(): ChatState {
  return chatStateAt(CHAT_END_MS);
}
