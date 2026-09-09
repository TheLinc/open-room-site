"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CrewFace } from "@/components/crew-face";
import { BellIcon, FileIcon } from "@/components/icons";
import { crewById, type CrewId } from "@/lib/crew";
import { copy } from "@/lib/copy";

type FeatureId = (typeof copy.features.items)[number]["id"];

// The feature tour: a list you scroll on the right, and on the left one
// panel that stays put while what it shows changes to match the item you
// are reading. Each panel is the feature itself, drawn small.

function VoicePanel({ color }: { color: string }) {
  return (
    <div className="grid gap-3">
      {[
        { who: "hey Bit,", rest: "run the tests" },
        { who: "hey Loop,", rest: "draft the release notes" },
        { who: "hey Clawd,", rest: "what is the API returning?" },
      ].map((l, i) => (
        <p
          key={l.who}
          className="inline-flex items-center gap-2 justify-self-start rounded-xl bg-line-soft px-3.5 py-2 text-[14px] text-ink"
          style={{ marginLeft: i * 18 }}
        >
          <span
            className="whitespace-nowrap font-medium"
            style={{
              color: [crewById.bit, crewById.loop, crewById.clawd][i].color,
            }}
          >
            {l.who}
          </span>
          {l.rest}
        </p>
      ))}
      <p className="mt-2 flex items-center gap-2 text-[13px] text-muted">
        <kbd>Ctrl</kbd>
        <kbd>Space</kbd>
        <span>does the same without a wake word</span>
        <i className="sr-only">{color}</i>
      </p>
    </div>
  );
}

function BackgroundPanel({ color }: { color: string }) {
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 rounded-panel border border-line bg-card p-3 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_30px_-16px_rgb(0_0_0/0.25)]">
        <CrewFace id="block" size={32} className="pixel row-span-2" />
        <div className="flex items-center gap-2 text-[13px] font-medium">
          Block
          <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-normal text-muted">
            <BellIcon size={11} /> 2 min
          </span>
        </div>
        <p className="text-[13px] text-ink-2">
          Staging is live. Two files in ci/ changed.
        </p>
      </div>
      <p className="flex items-center gap-2.5 pl-1 text-[13px] text-muted">
        <span
          className="voice-meter is-playing inline-flex h-[12px] items-end gap-[2px]"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4].map((n) => (
            <i
              key={n}
              className="block h-[7px] w-[2px] rounded-sm"
              style={{ background: color, "--n": n } as CSSProperties}
            />
          ))}
        </span>
        Staging is live.
      </p>
    </div>
  );
}

function PermissionsPanel({ color }: { color: string }) {
  const rows: [string, "ask" | "always" | "never"][] = [
    ["Read files", "always"],
    ["Edit files", "ask"],
    ["Run commands", "ask"],
    ["Push to remote", "never"],
  ];
  return (
    <div className="overflow-hidden rounded-panel border border-line bg-card">
      {rows.map(([tool, mode]) => (
        <div
          key={tool}
          className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-line-soft px-3.5 py-2.5 text-[13px] last:border-b-0"
        >
          <span className="font-mono text-[12px]">{tool}</span>
          <span className="inline-flex rounded-md border border-line bg-ground p-0.5 text-[11px]">
            {(["ask", "always", "never"] as const).map((m) => (
              <span
                key={m}
                className={`rounded-[5px] px-2 py-0.5 ${m === mode ? "bg-card text-ink shadow-[0_1px_2px_rgb(0_0_0/0.08)]" : "text-muted"}`}
                style={
                  m === mode && m === "never"
                    ? { color: crewById.block.color }
                    : m === mode && m === "always"
                      ? { color }
                      : undefined
                }
              >
                {m === "ask" ? "Ask" : m === "always" ? "Always" : "Never"}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

function MemoryPanel({ color }: { color: string }) {
  return (
    <div className="rounded-panel border border-line bg-card p-4 font-mono text-[12px] leading-[1.7] text-ink-2">
      <p className="flex items-center gap-1.5 text-muted">
        <FileIcon size={12} /> WORKLOG.md
      </p>
      <p className="mt-2">
        <span style={{ color }}>## Yesterday</span>
        <br />
        Rewrote the release notes for 0.4.
        <br />
        Open question: keep the beta tag?
      </p>
      <p className="mt-2">
        <span style={{ color }}>## Today</span>
        <br />
        Picked up the beta tag question
        <br />
        <span className="crew-cursor inline-block h-[1em] w-[6px] translate-y-[3px] bg-ink-2" />
      </p>
    </div>
  );
}

function CostPanel({ color }: { color: string }) {
  return (
    <div className="grid gap-3">
      <div
        className="flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[13px]"
        style={{
          borderColor: color,
          background: `color-mix(in srgb, ${color} 8%, white)`,
        }}
      >
        <i className="h-2 w-2 rounded-full" style={{ background: color }} />
        <span>Rate limit resets in 2h 10m</span>
      </div>
      <div className="rounded-panel border border-line bg-card p-3.5">
        <div className="flex items-center gap-2.5">
          <CrewFace id="clawd" size={28} className="pixel" />
          <span className="text-[13px] font-medium">Clawd</span>
          <span className="ml-auto inline-flex gap-1.5 font-mono text-[11px] text-muted">
            <span className="rounded-md border border-line px-1.5 py-0.5">
              opus
            </span>
            <span className="rounded-md border border-line px-1.5 py-0.5">
              high
            </span>
            <span className="rounded-md border border-line px-1.5 py-0.5">
              ask
            </span>
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3 text-[12px] text-muted">
          <span className="font-mono">context</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-soft">
            <span
              className="block h-full w-[38%] rounded-full"
              style={{ background: color }}
            />
          </span>
          <span className="font-mono tabular-nums">38%</span>
        </div>
      </div>
    </div>
  );
}

const panels: Record<FeatureId, (p: { color: string }) => React.JSX.Element> = {
  voice: VoicePanel,
  background: BackgroundPanel,
  permissions: PermissionsPanel,
  memory: MemoryPanel,
  cost: CostPanel,
};

export function Features() {
  const [active, setActive] = useState<FeatureId>("voice");
  const itemRefs = useRef<Partial<Record<FeatureId, HTMLLIElement>>>({});

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting)
            setActive(e.target.getAttribute("data-id") as FeatureId);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of Object.values(itemRefs.current)) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  const item =
    copy.features.items.find((i) => i.id === active) ?? copy.features.items[0];
  const member = crewById[item.agent as CrewId];
  const Panel = panels[item.id];

  return (
    <section
      id="features"
      className="mx-auto max-w-[1120px] px-6 pt-32 md:pt-40"
    >
      <div className="max-w-[40ch]">
        <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.03em] md:text-[44px]">
          {copy.features.title}
        </h2>
        <p className="mt-4 text-[17px] leading-[1.5] text-muted">
          {copy.features.lead}
        </p>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
        <div className="hidden md:block">
          <div className="sticky top-28">
            <div
              className="relative min-h-[380px] rounded-[18px] border border-line p-8 transition-colors duration-500"
              style={{
                background: `color-mix(in srgb, ${member.color} 6%, var(--color-card))`,
              }}
            >
              <div className="absolute right-6 top-6">
                <CrewFace id={member.id} size={40} className="pixel" />
              </div>
              <p className="text-[13px] text-muted">{member.name}</p>
              <div key={item.id} className="thread-in mt-8 max-w-[340px]">
                <Panel color={member.color} />
              </div>
              <p className="absolute bottom-5 left-8 font-mono text-[11px] text-muted">
                {copy.features.caption}
              </p>
            </div>
          </div>
        </div>

        <ol className="grid">
          {copy.features.items.map((f) => {
            const m = crewById[f.agent as CrewId];
            const on = f.id === active;
            return (
              <li
                key={f.id}
                data-id={f.id}
                ref={(el) => {
                  itemRefs.current[f.id] = el ?? undefined;
                }}
                className="grid grid-cols-[28px_1fr] gap-x-4 border-t border-line py-8 first:border-t-0 md:py-10"
              >
                <CrewFace
                  id={m.id}
                  size={28}
                  className={`pixel mt-0.5 transition-opacity duration-300 ${on ? "opacity-100" : "opacity-60 md:opacity-40"}`}
                />
                <div
                  className={`transition-opacity duration-300 ${on ? "opacity-100" : "md:opacity-75"}`}
                >
                  <h3 className="text-[22px] font-medium leading-[1.2] tracking-[-0.02em]">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 max-w-[46ch] text-[15px] leading-[1.55] text-ink-2">
                    {f.body}
                  </p>
                  <p className="mt-3 text-[13px] text-muted">{f.detail}</p>
                  <div className="mt-5 md:hidden">
                    {(() => {
                      const P = panels[f.id];
                      return <P color={m.color} />;
                    })()}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mt-6 font-mono text-xs text-muted md:hidden">
        {copy.features.caption}
      </p>
    </section>
  );
}
