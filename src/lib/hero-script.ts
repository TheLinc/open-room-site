export type AgentColor = "teal" | "red";
export type PipStatus = "working" | "done";

export interface Pip {
  name: string;
  color: AgentColor;
  status: PipStatus;
}

export interface Reply {
  name: string;
  color: AgentColor;
  text: string;
}

export interface Talk {
  color: AgentColor;
  typed: string;
  full: string;
}

export interface HeroState {
  talk: Talk | null;
  replies: Reply[];
  pips: Pip[];
  fading: boolean;
}

export const CHAR_MS = 45;
export const LOOP_MS = 18000;
export const FADE_AT_MS = 17400;

export type ScriptEvent =
  | { at: number; kind: "pips"; pips: Pip[] }
  | { at: number; kind: "reply"; reply: Reply }
  | { at: number; kind: "talk"; color: AgentColor; text: string };

const atlasWorking: Pip = { name: "Atlas", color: "red", status: "working" };
const junoWorking: Pip = { name: "Juno", color: "teal", status: "working" };
const atlasDone: Pip = { name: "Atlas", color: "red", status: "done" };

// Times in ms from loop start. A talk event replaces the current talk line and types
// it out from that moment; replies accumulate until the loop restarts.
export const SCRIPT: ScriptEvent[] = [
  { at: 0, kind: "pips", pips: [atlasWorking] },
  { at: 1000, kind: "talk", color: "teal", text: "hey Juno, run the tests" },
  { at: 4000, kind: "pips", pips: [atlasWorking, junoWorking] },
  { at: 6000, kind: "talk", color: "red", text: "hey Atlas, what's the status of my CI pipeline?" },
  { at: 9500, kind: "reply", reply: { name: "Atlas", color: "red", text: "Let me check that for you." } },
  {
    at: 13500,
    kind: "reply",
    reply: { name: "Atlas", color: "red", text: "The CI pipeline ran successfully." },
  },
  { at: 13500, kind: "pips", pips: [atlasDone, junoWorking] },
];

export function stateAt(elapsedMs: number): HeroState {
  const t = ((elapsedMs % LOOP_MS) + LOOP_MS) % LOOP_MS;
  let pips: Pip[] = [];
  let talk: Talk | null = null;
  const replies: Reply[] = [];

  for (const ev of SCRIPT) {
    if (ev.at > t) break;
    switch (ev.kind) {
      case "pips":
        pips = ev.pips;
        break;
      case "reply":
        replies.push(ev.reply);
        break;
      case "talk": {
        const chars = Math.min(ev.text.length, Math.floor((t - ev.at) / CHAR_MS));
        talk = { color: ev.color, typed: ev.text.slice(0, chars), full: ev.text };
        break;
      }
    }
  }

  return { talk, replies, pips, fading: t >= FADE_AT_MS };
}

export function reducedMotionState(): HeroState {
  return { ...stateAt(3000), fading: false };
}
