"use client";

import { useRef } from "react";
import { CrewRow } from "@/components/crew-row";
import { AppWindow, micAt } from "@/components/lamp/app-window";
import { ChatMock } from "@/components/lamp/flow-chat";
import { WordChips } from "@/components/lamp/flow-chips";
import { StreamLane, streamIsSpeaking } from "@/components/lamp/flow-stream";
import {
  TerminalCards,
  listeningAgent,
  terminalIsTyping,
} from "@/components/lamp/flow-terminal";
import {
  SwitchboardArc,
  SwitchboardRows,
} from "@/components/lamp/switchboard-mock";
import { useHeroGeometry } from "@/components/lamp/use-hero-geometry";
import { VoicePill } from "@/components/lamp/voice-pill";
import { WaitlistForm, type WaitlistLook } from "@/components/waitlist-form";
import { copy } from "@/lib/copy";
import { chatStateAt, chatStill } from "@/lib/chat-script";
import { reducedMotionState, stateAt } from "@/lib/crew-script";
import { useTimeline } from "@/lib/use-timeline";

export type Flow =
  "chips" | "stream" | "terminal" | "app" | "switchboard" | "chat";

const EMPHASIS = "without leaving your window.";

// The headline is set in a single-weight serif, so the emphasis is italic on
// the second half. Returns [roman, italic]; the italic part is empty when the
// phrase isn't there.
export function splitHeadline(headline: string): [string, string] {
  const at = headline.indexOf(EMPHASIS);
  if (at < 0) return [headline, ""];
  return [headline.slice(0, at), headline.slice(at)];
}

// The first word is the verb, "Talk", which the pill stands in for.
export function splitVerb(roman: string): [string, string] {
  const space = roman.indexOf(" ");
  if (space < 0) return [roman, ""];
  return [roman.slice(0, space), roman.slice(space)];
}

const lampLook: WaitlistLook = {
  input: "lamp-input",
  button: "lamp-btn",
  note: "lamp-note",
  error: "lamp-note is-error",
  status: "lamp-status",
};

export function LampHero({ flow = "chips" }: { flow?: Flow }) {
  const { state } = useTimeline(stateAt, reducedMotionState);
  // The chat has its own script: it plays once and rests.
  const { state: chat } = useTimeline(chatStateAt, chatStill);
  const [roman, italic] = splitHeadline(copy.headline);
  const [verb, rest] = splitVerb(roman);
  const heroRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const geo = useHeroGeometry(heroRef, pillRef);

  const streaming = geo !== null && streamIsSpeaking(geo, state.time);
  const speaking =
    flow === "stream"
      ? streaming
      : flow === "terminal"
        ? streaming || terminalIsTyping(state.time)
        : flow === "app"
          ? micAt(state.time).listening
          : flow === "switchboard"
            ? true
            : flow === "chat"
              ? chat.speaking
              : state.talk?.phase === "travel" && state.talk.t < 0.75;
  const listening = flow === "terminal" ? listeningAgent(state.time) : null;
  const switchboard = flow === "switchboard";

  return (
    <section
      ref={heroRef}
      className={`lamp-hero is-${flow}`}
      aria-labelledby="lamp-headline"
    >
      <p className="sr-only">{copy.crew.narration}</p>

      <div className="lamp-copy">
        {/* In the switchboard layout the eyebrow moves under the trust line,
            out of the arc's way. */}
        {!switchboard ? <p className="lamp-eyebrow">{copy.eyebrow}</p> : null}
        <h1 id="lamp-headline" className="lamp-h1">
          <VoicePill ref={pillRef} word={verb} speaking={speaking} />
          {rest}
          {italic ? <em>{italic}</em> : null}
        </h1>
        <p className="lamp-lead">{copy.subheadline}</p>
        <div className="lamp-form">
          <WaitlistForm look={lampLook} />
        </div>
        <p className="lamp-trust">{copy.trust}</p>
        {switchboard ? <p className="lamp-eyebrow">{copy.eyebrow}</p> : null}
      </div>

      {flow === "stream" ? <StreamLane state={state} geo={geo} /> : null}
      {flow === "terminal" ? (
        <StreamLane state={state} geo={geo} arrival="fade" />
      ) : null}

      {switchboard ? (
        /* A still: the agents beside the copy, the arc drawn over the hero. */
        <SwitchboardRows />
      ) : flow === "chat" ? (
        /* The conversation beside the copy, no chrome. */
        <ChatMock state={chat} />
      ) : flow === "app" ? (
        /* The product itself, drawn, with the script playing inside it. */
        <div className="lamp-stage lamp-stage-app">
          <AppWindow state={state} />
        </div>
      ) : (
        /* The crew at their desks, backs to you. What you say goes into the
           screen of whoever you named. */
        <div className="lamp-stage">
          <CrewRow
            state={state}
            alt={copy.crew.alt}
            listening={listening}
            bubbles={flow !== "terminal"}
          />
        </div>
      )}

      {flow === "terminal" ? <TerminalCards state={state} geo={geo} /> : null}
      {switchboard ? <SwitchboardArc geo={geo} /> : null}
      {flow === "chips" && state.talk && geo ? (
        <WordChips
          key={`${state.talk.agent}:${state.talk.text}`}
          talk={state.talk}
          geo={geo}
        />
      ) : null}
    </section>
  );
}
