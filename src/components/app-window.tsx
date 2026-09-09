"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { CrewFace } from "@/components/crew-face";
import {
  ArrowUpIcon,
  BrainIcon,
  ChevronIcon,
  GearIcon,
  MicIcon,
  PaperclipIcon,
  PencilIcon,
  PlusIcon,
  ShieldIcon,
  SlidersIcon,
  TerminalIcon,
  WrenchIcon,
} from "@/components/icons";
import { crew, crewById, type CrewId } from "@/lib/crew";
import {
  TOOL_ROWS,
  TURNS,
  landsAt,
  type Exchange,
  type HeroState,
} from "@/lib/hero-script";
import logo from "@/assets/brand/logo.png";

// Each agent's folder: the thing that makes it a separate Claude Code session.
const folders: Record<CrewId, string> = {
  clawd: "~/work/api",
  bit: "~/work/web",
  terminal: "~/work/infra",
  block: "~/work/ci",
  loop: "~/work/docs",
};

/** The conversation's title, as the app derives one from the first line. */
function titleOf(ex: Exchange | undefined): string {
  if (!ex || !ex.landed) return "New conversation";
  const rest = ex.text.slice(ex.wake.length).trim().replace(/[?.]$/, "");
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

function statusLine(ex: Exchange | undefined, id: CrewId): string {
  if (!ex || !ex.landed) return "Not running";
  const { turns, cost } = TURNS[id];
  if (ex.status === "done") return `Ready · ${turns} turns · ${cost}`;
  const seen = ex.replies.length;
  return seen ? `Working · ${seen + 1} turns` : "Working";
}

function Row({
  icon,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-8 items-center gap-2 rounded-md border border-line px-2.5 text-[12px] text-ink-2 ${className}`}
    >
      <span className="text-muted">{icon}</span>
      {children}
    </div>
  );
}

// The Open Room window as the app draws it in its light theme: agents down
// the side, one conversation per agent, tool rows and a permission card in
// the thread, the composer along the bottom. The hero script plays inside.
export function AppWindow({ state }: { state: HeroState }) {
  const id = state.selected;
  const member = crewById[id];
  const ex = [...state.exchanges].reverse().find((e) => e.agent === id);
  const line = state.exchanges.find(
    (e) => e.agent === id && e.said < e.text.length,
  );
  const landed = ex && ex.landed ? ex : undefined;
  const thinking = landed && state.time >= landsAt(landed) + 300;
  const toolRow = landed && state.time >= landsAt(landed) + 900;
  const latestAt = landed
    ? Math.max(
        landed.at,
        ...landed.replies.map((r) => r.at),
        ...landed.replies.map((r) => r.permission?.allowedAt ?? 0),
      )
    : 0;

  // The thread starts at the top, like the app, and slides up smoothly once
  // it outgrows the frame so the newest line stays in view.
  const frameRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const frame = frameRef.current;
    const list = listRef.current;
    if (!frame || !list) return;
    const over = Math.max(0, list.scrollHeight - frame.clientHeight);
    list.style.transform = `translateY(${-over}px)`;
  }, [id, latestAt, thinking, toolRow]);

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_30px_60px_-30px_rgb(0_0_0/0.25)]">
      <div className="flex h-9 items-center gap-2 border-b border-line px-3 text-[12px] text-ink">
        <Image
          src={logo}
          alt=""
          className="brightness-0"
          style={{ height: 14, width: "auto" }}
        />
        Open Room
      </div>

      <div className="grid h-[340px] md:grid-cols-[212px_1fr]">
        <aside className="hidden border-r border-line p-2 md:block">
          <div className="flex justify-end gap-1 px-1 pb-2 pt-1 text-muted">
            <span className="grid h-6 w-6 place-items-center rounded-md">
              <PlusIcon size={14} />
            </span>
            <span className="grid h-6 w-6 place-items-center rounded-md">
              <GearIcon size={14} />
            </span>
          </div>
          <ul className="grid gap-0.5">
            {crew.map((m) => {
              const on = m.id === id;
              const lit = state.desks[m.id] !== "idle";
              return (
                <li
                  key={m.id}
                  className={`grid grid-cols-[22px_1fr_auto] items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors duration-300 ${on ? "bg-line-soft text-ink" : "text-ink-2"}`}
                >
                  <CrewFace id={m.id} size={22} className="pixel" />
                  <span>{m.name}</span>
                  <i
                    className="h-[6px] w-[6px] rounded-full transition-opacity duration-300"
                    style={{ background: m.color, opacity: lit ? 1 : 0 }}
                  />
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="flex min-h-0 flex-col">
          <header className="flex items-center gap-3 border-b border-line px-4 py-2.5">
            <i
              className="h-[9px] w-[9px] rounded-full"
              style={{ background: member.color }}
            />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-2 text-[13px]">
                <b className="font-medium">{member.name}</b>
                <span className="truncate text-ink-2">{titleOf(ex)}</span>
                <ChevronIcon size={12} className="shrink-0 text-muted" />
              </div>
              <div className="mt-0.5 text-[11px] text-muted">
                {statusLine(ex, id)}
              </div>
            </div>
            <span className="hidden items-center gap-1.5 text-[12px] text-ink-2 sm:inline-flex">
              <SlidersIcon size={12} className="text-muted" />
              Sonnet 5
              <ChevronIcon size={11} className="text-muted" />
            </span>
            <span className="hidden h-7 items-center gap-1.5 rounded-md border border-line px-2.5 text-[12px] font-medium sm:inline-flex">
              <PencilIcon size={12} />
              Edit
            </span>
          </header>

          <div
            ref={frameRef}
            className="min-h-0 flex-1 overflow-hidden"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 24px)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 24px)",
            }}
          >
            {landed ? (
              <div
                key={id}
                ref={listRef}
                className="flex flex-col gap-2.5 px-4 pb-3 pt-3.5 transition-transform duration-500 ease-out"
              >
                <p
                  className="thread-in max-w-[80%] self-end rounded-xl bg-line-soft px-3 py-2 text-[13px] leading-[1.45] text-ink"
                  style={{ "--agent": member.color } as CSSProperties}
                >
                  {landed.wake ? (
                    <span
                      className="whitespace-nowrap font-medium"
                      style={{ color: member.color }}
                    >
                      {landed.wake}
                    </span>
                  ) : null}
                  {landed.text.slice(landed.wake.length)}
                </p>
                {thinking ? (
                  <Row icon={<BrainIcon size={13} />} className="thread-in">
                    Thinking
                  </Row>
                ) : null}
                {toolRow ? (
                  <Row icon={<WrenchIcon size={13} />} className="thread-in">
                    <span className="font-mono text-[11.5px]">
                      {TOOL_ROWS[id]}
                    </span>
                  </Row>
                ) : null}
                {landed.replies.map((r) => (
                  <div key={r.at} className="thread-in grid gap-2.5">
                    <p className="text-[13px] leading-[1.5] text-ink">
                      {r.text}
                      {r.playing ? (
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
                                  background: member.color,
                                  "--n": n,
                                } as CSSProperties
                              }
                            />
                          ))}
                        </span>
                      ) : null}
                    </p>
                    {r.permission && !r.permission.allowedAt ? (
                      <div className="rounded-lg border border-[#e6c46a] bg-[#fffbeb] p-3">
                        <div className="flex items-center gap-2 text-[13px] font-medium">
                          <ShieldIcon size={14} className="text-[#b58a1e]" />
                          {member.name} wants to use {r.permission.tool}
                        </div>
                        <div className="mt-1.5 rounded-md border border-line bg-card px-2.5 py-1.5 font-mono text-[11.5px] text-ink-2">
                          {r.permission.command}
                        </div>
                        <p className="mt-1.5 text-[11px] text-muted">
                          This command requires approval
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          <span className="rounded-md bg-ink px-2.5 py-1 text-[11.5px] font-medium text-white">
                            Allow once
                          </span>
                          <span className="rounded-md border border-line bg-card px-2.5 py-1 text-[11.5px] font-medium text-ink-2">
                            Allow for this session
                          </span>
                          <span className="rounded-md px-2.5 py-1 text-[11.5px] font-medium text-ink-2">
                            Decline
                          </span>
                        </div>
                      </div>
                    ) : null}
                    {r.permission && r.permission.allowedAt ? (
                      <Row
                        icon={<WrenchIcon size={13} />}
                        className="thread-in"
                      >
                        <span className="font-mono text-[11.5px]">
                          {r.permission.tool}
                        </span>
                        <span className="truncate font-mono text-[11.5px] text-muted">
                          {r.permission.command}
                        </span>
                        <span className="ml-auto text-[11px] text-muted">
                          allowed once
                        </span>
                      </Row>
                    ) : null}
                  </div>
                ))}
                {landed.status === "done" ? (
                  <Row icon={<TerminalIcon size={13} />} className="thread-in">
                    <span className="text-muted">
                      Turn complete · {TURNS[id].turns} turns · {TURNS[id].cost}
                    </span>
                  </Row>
                ) : null}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-1 px-6 text-center">
                <p className="text-[13px] text-ink-2">
                  Nothing yet. Ask {member.name} to do something.
                </p>
                <p className="text-[11px] text-muted">
                  It runs in <span className="font-mono">{folders[id]}</span>
                </p>
              </div>
            )}
          </div>

          <div className="m-3 mt-2 flex h-11 items-center gap-2.5 rounded-[10px] border border-line bg-card px-3">
            <PaperclipIcon size={14} className="text-muted" />
            <span
              className={`flex-1 truncate text-[13px] ${line ? "text-ink" : "text-muted"}`}
            >
              {line ? (
                <>
                  {line.said >= line.wake.length ? (
                    <span
                      className="whitespace-nowrap font-medium"
                      style={{ color: crewById[line.agent].color }}
                    >
                      {line.wake}
                    </span>
                  ) : (
                    line.text.slice(0, line.said)
                  )}
                  {line.said >= line.wake.length
                    ? line.text.slice(line.wake.length, line.said)
                    : null}
                  <span className="crew-cursor ml-px inline-block h-[1em] w-[2px] translate-y-[2px] bg-ink" />
                </>
              ) : (
                `Ask ${member.name} to do something…`
              )}
            </span>
            <MicIcon
              size={15}
              className={`transition-colors duration-300 ${line ? "text-bit" : "text-muted"}`}
            />
            <span className="grid h-7 w-7 place-items-center rounded-full bg-line-soft text-ink-2">
              <ArrowUpIcon size={13} />
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
