"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { CrewFace } from "@/components/crew-face";
import { crew, crewById, type CrewId } from "@/lib/crew";
import { type Exchange, type HeroState } from "@/lib/hero-script";

// Each agent's folder: the thing that makes it a separate Claude Code session.
const folders: Record<CrewId, string> = {
  clawd: "~/work/api",
  bit: "~/work/web",
  terminal: "~/work/infra",
  block: "~/work/ci",
  loop: "~/work/docs",
};

type Item =
  | {
      kind: "you";
      at: number;
      agent: CrewId;
      text: string;
      wake: string;
      said: number;
    }
  | {
      kind: "agent";
      at: number;
      agent: CrewId;
      text: string;
      ask: boolean;
      playing: boolean;
    };

function itemsOf(exchanges: Exchange[]): Item[] {
  const items: Item[] = [];
  for (const ex of exchanges) {
    items.push({
      kind: "you",
      at: ex.at,
      agent: ex.agent,
      text: ex.text,
      wake: ex.wake,
      said: ex.said,
    });
    for (const r of ex.replies)
      items.push({
        kind: "agent",
        at: r.at,
        agent: ex.agent,
        text: r.text,
        ask: r.ask,
        playing: r.playing,
      });
  }
  return items.sort((a, b) => a.at - b.at);
}

function railStatus(state: HeroState, id: CrewId): string {
  if (state.glancing === id) return "listening";
  const ex = [...state.exchanges].reverse().find((e) => e.agent === id);
  if (ex && ex.status === "asking") return "asking";
  if (ex && ex.status === "listening") return "listening";
  return state.desks[id];
}

/** The line you are saying, typed out as it is heard. */
function micLine(state: HeroState): { text: string; agent: CrewId } | null {
  const live = state.exchanges.find((e) => e.said < e.text.length);
  return live
    ? { text: live.text.slice(0, live.said), agent: live.agent }
    : null;
}

// The Open Room window, drawn in its own register: agents down the side,
// the conversation in the middle, the mic along the bottom. The hero script
// plays inside it.
export function AppWindow({ state }: { state: HeroState }) {
  const items = itemsOf(state.exchanges);
  const mic = micLine(state);
  const latest = items[items.length - 1];

  // The thread starts at the top, like a real conversation, and slides up
  // smoothly once it outgrows the frame so the newest line stays in view.
  const frameRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const frame = frameRef.current;
    const list = listRef.current;
    if (!frame || !list) return;
    const over = Math.max(0, list.scrollHeight - frame.clientHeight);
    list.style.transform = `translateY(${-over}px)`;
  }, [items.length, state.exchanges]);

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_30px_60px_-30px_rgb(0_0_0/0.25)]">
      <div className="flex h-10 items-center gap-3 border-b border-line px-3.5 text-xs text-muted">
        <span className="inline-flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-line" />
          <i className="h-2.5 w-2.5 rounded-full bg-line" />
          <i className="h-2.5 w-2.5 rounded-full bg-line" />
        </span>
        <b className="flex-1 text-center font-medium text-ink-2">Open Room</b>
        <span
          className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${mic ? "text-bit" : "text-muted"}`}
        >
          <i
            className={`h-[7px] w-[7px] rounded-full ${mic ? "bg-bit shadow-[0_0_0_3px_rgb(40_136_136/0.2)]" : "bg-line"}`}
          />
          {mic ? "listening" : "ready"}
        </span>
      </div>

      <div className="grid h-[340px] md:grid-cols-[224px_1fr]">
        <aside className="hidden border-r border-line bg-[#fcfcfd] p-2.5 md:block">
          <div className="px-2 pb-2 pt-1.5 text-[11px] font-medium text-muted">
            Agents
          </div>
          <ul className="grid gap-0.5">
            {crew.map((m) => {
              const status = railStatus(state, m.id);
              const lit = status !== "idle";
              return (
                <li
                  key={m.id}
                  className="grid grid-cols-[26px_1fr_auto] items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-300"
                  style={{
                    background: lit
                      ? `color-mix(in srgb, ${m.color} 9%, transparent)`
                      : "transparent",
                  }}
                >
                  <CrewFace id={m.id} size={26} className="pixel" />
                  <span className="grid leading-[1.15]">
                    <b className="text-[13px] font-medium">{m.name}</b>
                    <small className="font-mono text-[10.5px] text-muted">
                      {folders[m.id]}
                    </small>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted">
                    {lit ? status : ""}
                    <i
                      className="h-[7px] w-[7px] rounded-full transition-colors duration-300"
                      style={{
                        background: lit ? m.color : "var(--color-line)",
                      }}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="flex min-h-0 flex-col">
          <div
            ref={frameRef}
            className="min-h-0 flex-1 overflow-hidden"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 28px)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 28px)",
            }}
          >
            <ol
              ref={listRef}
              className="flex flex-col gap-3.5 px-5 pb-3 pt-4 transition-transform duration-500 ease-out"
            >
              {items.map((item) => {
                const m = crewById[item.agent];
                const fresh = item === latest;
                const tint = { "--agent": m.color } as CSSProperties;
                if (item.kind === "you") {
                  const wakeLen = item.wake.length;
                  const shownWake = item.text.slice(
                    0,
                    Math.min(item.said, wakeLen),
                  );
                  const shownRest = item.text.slice(wakeLen, item.said);
                  return (
                    <li
                      key={`you:${item.at}`}
                      className={`grid max-w-[78%] gap-1 self-end text-right ${fresh ? "thread-in" : ""}`}
                      style={tint}
                    >
                      <span className="font-mono text-[11px] text-muted">
                        You
                      </span>
                      <p className="inline-block rounded-xl rounded-br-[4px] bg-ink px-3 py-2 text-left text-sm leading-[1.4] text-white">
                        {shownWake ? (
                          <span
                            className="whitespace-nowrap font-medium"
                            style={{
                              color: `color-mix(in srgb, ${m.color} 55%, white)`,
                            }}
                          >
                            {shownWake}
                          </span>
                        ) : null}
                        {shownRest}
                        {item.said < item.text.length ? (
                          <span className="crew-cursor ml-px inline-block h-[1em] w-[2px] translate-y-[2px] bg-white" />
                        ) : null}
                      </p>
                    </li>
                  );
                }
                return (
                  <li
                    key={`agent:${item.at}`}
                    className={`grid max-w-[78%] grid-cols-[22px_1fr] gap-x-2.5 gap-y-1 ${fresh ? "thread-in" : ""}`}
                    style={tint}
                  >
                    <CrewFace
                      id={item.agent}
                      size={22}
                      className="pixel row-span-2 mt-4"
                    />
                    <span className="font-mono text-[11px] text-muted">
                      {m.name}
                    </span>
                    <p className="inline-block justify-self-start rounded-xl rounded-bl-[4px] border border-line bg-card px-3 py-2 text-sm leading-[1.4] text-ink">
                      {item.text}
                      {item.playing ? (
                        <span
                          className="voice-meter is-playing ml-2 inline-flex h-[10px] items-end gap-[2px] align-middle"
                          aria-hidden="true"
                        >
                          {[0, 1, 2, 3].map((n) => (
                            <i
                              key={n}
                              className="block h-[6px] w-[2px] rounded-sm"
                              style={
                                {
                                  background: m.color,
                                  "--n": n,
                                } as CSSProperties
                              }
                            />
                          ))}
                        </span>
                      ) : null}
                      {item.ask && !item.playing ? (
                        <span className="mt-2 flex gap-1.5">
                          <span className="rounded-md bg-ink px-2 py-0.5 text-[11px] font-medium text-white">
                            Yes
                          </span>
                          <span className="rounded-md border border-line px-2 py-0.5 text-[11px] font-medium text-ink-2">
                            Not yet
                          </span>
                        </span>
                      ) : null}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="m-3 mt-2 flex h-11 items-center gap-2.5 rounded-[10px] border border-line bg-ground px-3">
            <span
              className="inline-flex h-[14px] items-center gap-[3px]"
              aria-hidden="true"
            >
              {[0, 1, 2, 3, 4].map((n) => (
                <i
                  key={n}
                  className={`block w-[2px] rounded-sm transition-[height,background-color] duration-300 ${mic ? "bg-bit" : "bg-line"}`}
                  style={{ height: mic ? `${6 + ((n * 7) % 9)}px` : "6px" }}
                />
              ))}
            </span>
            <span
              className={`flex-1 truncate text-[13px] ${mic ? "text-ink" : "text-muted"}`}
            >
              {mic ? mic.text : "Say hey and a name, or hold the hotkey"}
            </span>
            <kbd className="hidden text-muted sm:inline">Ctrl Space</kbd>
          </div>
        </section>
      </div>
    </div>
  );
}
