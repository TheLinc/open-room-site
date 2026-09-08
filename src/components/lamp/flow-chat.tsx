"use client";

import type { CSSProperties } from "react";
import { CrewFace } from "@/components/crew-face";
import { crewById } from "@/lib/crew";
import { splitWake, type ChatState, type Exchange } from "@/lib/chat-script";

/** How many exchanges stay on screen; older ones slide away. */
export const CHAT_VISIBLE = 3;
const LEAVE_MS = 550;

/** The exchanges to render: the visible ones, plus the one on its way out. */
export function feedAt(
  state: ChatState,
): { exchange: Exchange; leaving: boolean }[] {
  const all = state.exchanges;
  const visible = all.slice(-CHAT_VISIBLE);
  const newest = all[all.length - 1];
  const bumped =
    all.length > CHAT_VISIBLE ? all[all.length - CHAT_VISIBLE - 1] : null;
  const leaving =
    bumped && newest && state.time - newest.at < LEAVE_MS ? bumped : null;
  return [
    ...(leaving ? [{ exchange: leaving, leaving: true }] : []),
    ...visible.map((exchange) => ({ exchange, leaving: false })),
  ];
}

// The conversation beside the copy: what you say, with the wake word in the
// colour of the agent it wakes, and that agent's row lit beneath it with its
// status and replies. A live feed: three exchanges showing, older ones
// sliding away as new ones arrive. Plays once and rests.
export function ChatMock({ state }: { state: ChatState }) {
  return (
    <div className={`chat ${state.ended ? "is-ended" : ""}`} aria-hidden="true">
      {feedAt(state).map(({ exchange: x, leaving }) => {
        const m = crewById[x.agent];
        const [wake, rest] = splitWake(x.text);
        const typing = x.said < x.text.length;
        const wakeShown = x.text.slice(0, Math.min(x.said, wake.length));
        const restShown =
          x.said > wake.length ? rest.slice(0, x.said - wake.length) : "";
        const tint = {
          "--agent": m.color,
          "--agent-screen": m.screen,
        } as CSSProperties;
        return (
          <div
            key={x.at}
            className={`chat-exchange ${leaving ? "is-leaving" : ""}`}
            style={tint}
          >
            <p className="chat-you">
              <span className="chat-who">
                You
                {!wake && x.called ? (
                  <span className="chat-route">to {m.name}</span>
                ) : null}
              </span>
              <span className="chat-text">
                <span
                  className={`chat-wake ${x.called && wake ? "is-called" : ""}`}
                >
                  {wakeShown}
                </span>
                {restShown}
                {typing ? <span className="chat-caret" /> : null}
              </span>
            </p>
            {x.called ? (
              <div className={`chat-agent is-${x.status || "quiet"}`}>
                <CrewFace id={x.agent} size={30} className="chat-face" />
                <span className="chat-agent-text">
                  <b>{m.name}</b>
                  {x.status ? (
                    <small>
                      <i />
                      {x.status === "asking" ? "asks you" : x.status}
                    </small>
                  ) : null}
                </span>
                {x.replies.length || x.status === "working" ? (
                  <ul className="chat-replies">
                    {x.replies.map((r) => (
                      <li key={r.at} className={r.ask ? "is-ask" : ""}>
                        {r.text}
                        <span
                          className={`chat-voice ${r.playing ? "is-playing" : ""}`}
                        >
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                        </span>
                      </li>
                    ))}
                    {x.status === "working" ? (
                      <li className="chat-dots">
                        <i />
                        <i />
                        <i />
                      </li>
                    ) : null}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
