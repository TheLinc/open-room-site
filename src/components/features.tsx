"use client";

import { useEffect, useRef, useState } from "react";
import {
  Button,
  Field,
  Input,
  Select,
  Sheet,
  Switch,
} from "@/components/app-parts";
import { CrewFace } from "@/components/crew-face";
import {
  ChevronIcon,
  CloseIcon,
  GaugeIcon,
  MessagePlusIcon,
  PencilIcon,
  SlidersIcon,
  VolumeIcon,
} from "@/components/icons";
import { crewById, type CrewId } from "@/lib/crew";
import { copy } from "@/lib/copy";

type FeatureId = (typeof copy.features.items)[number]["id"];

// The feature tour: a list you scroll on the right, and on the left one
// panel that stays put while what it shows changes to match the item you
// are reading. Each panel is the feature itself, drawn from the app.

function VoicePanel() {
  return (
    <Sheet>
      <p className="text-[13px] font-medium">Voice input</p>
      <Field
        label="Enable push-to-talk"
        hint="Hold the shortcut, say the job, let go."
        control={<Switch on label="Enable push-to-talk" />}
      />
      <Field
        label="Wake words"
        hint="Keeps the microphone open and listens for hey and a name."
        control={<Switch on label="Wake words" />}
      />
      <Field
        label="Push-to-talk shortcut"
        hint="Press once to start talking, again to send. Esc discards."
      >
        <span className="flex items-center gap-2">
          <Input mono className="flex-1">
            Ctrl+Shift+Space
          </Input>
          <CloseIcon size={13} className="text-muted" />
        </span>
      </Field>
    </Sheet>
  );
}

function BackgroundPanel() {
  return (
    <Sheet>
      <Field
        label="Show notifications"
        hint="A desktop notification when this agent reports in."
        control={<Switch on label="Show notifications" />}
      />
      <Field
        label="Speak aloud"
        hint="Read this agent's updates out loud, in its own voice."
        control={<Switch on label="Speak aloud" />}
      />
      <Field label="Voice">
        <span className="flex gap-2">
          <Select className="flex-1">Ava</Select>
          <Button>
            <VolumeIcon size={13} />
            Preview
          </Button>
        </span>
      </Field>
    </Sheet>
  );
}

function PermissionsPanel({ color }: { color: string }) {
  const rows: [string, "Ask every time" | "Always allow" | "Never allow"][] = [
    ["Read", "Always allow"],
    ["Edit", "Ask every time"],
    ["Bash", "Ask every time"],
    ["WebFetch", "Never allow"],
  ];
  return (
    <Sheet>
      <Field label="Permission mode">
        <Select>Default: act, asking when needed</Select>
      </Field>
      <div className="grid gap-2 border-t border-line pt-3.5">
        <p className="text-[13px] font-medium">Tools</p>
        {rows.map(([tool, mode]) => (
          <div
            key={tool}
            className="grid grid-cols-[1fr_auto] items-center gap-3"
          >
            <span className="font-mono text-[12px]">{tool}</span>
            <Select className="w-[140px]">
              <span
                style={
                  mode === "Always allow"
                    ? { color }
                    : mode === "Never allow"
                      ? { color: crewById.block.color }
                      : undefined
                }
              >
                {mode}
              </span>
            </Select>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

function MemoryPanel() {
  return (
    <div className="grid gap-3">
      <p className="flex items-center gap-3 px-1 text-[12px] text-muted">
        <span className="h-px flex-1 bg-line" />
        Resumed · last active 23 hours ago
        <span className="h-px flex-1 bg-line" />
      </p>
      <div className="overflow-hidden rounded-panel border border-line bg-card text-[13px] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_30px_-16px_rgb(0_0_0/0.25)]">
        <p className="flex items-center gap-2 border-b border-line px-3 py-2.5">
          <MessagePlusIcon size={14} className="text-muted" />
          New conversation
        </p>
        {[
          ["Draft the release notes for 0.4", "23 hours ago"],
          ["Fix the changelog links", "4 days ago"],
        ].map(([title, when], i) => (
          <div
            key={title}
            className={`grid gap-0.5 px-3 py-2.5 ${i === 0 ? "bg-line-soft" : ""}`}
          >
            <span className="truncate text-ink">{title}</span>
            <span className="text-[12px] text-muted">{when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CostPanel({ color }: { color: string }) {
  return (
    <div className="grid gap-3">
      <div
        className="flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px]"
        style={{
          borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
          background: `color-mix(in srgb, ${color} 6%, white)`,
          color: `color-mix(in srgb, ${color} 80%, black)`,
        }}
      >
        <GaugeIcon size={13} />
        Approaching 5-hour limit · resets 2:30 PM
      </div>
      <Sheet className="gap-3">
        <div className="flex items-center gap-2.5">
          <i
            className="h-[9px] w-[9px] shrink-0 rounded-full"
            style={{ background: color }}
          />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center gap-2 text-[13px]">
              <b className="font-medium">Clawd</b>
              <span className="truncate text-ink-2">API status</span>
              <ChevronIcon size={11} className="shrink-0 text-muted" />
            </div>
            <div className="mt-0.5 text-[11px] text-muted">
              Ready · 3 turns · $0.0412
            </div>
          </div>
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[11px]"
            style={{
              background: `color-mix(in srgb, ${color} 10%, white)`,
              color: `color-mix(in srgb, ${color} 80%, black)`,
            }}
          >
            <GaugeIcon size={12} />
            78% of 200K
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-ink-2">
          <span className="inline-flex items-center gap-1.5">
            <SlidersIcon size={12} className="text-muted" />
            Opus 5
            <ChevronIcon size={11} className="text-muted" />
          </span>
          <span className="text-muted">· high effort</span>
          <span className="ml-auto inline-flex h-7 items-center gap-1.5 rounded-md border border-line px-2 text-[12px] font-medium text-ink">
            <PencilIcon size={11} />
            Edit
          </span>
        </div>
      </Sheet>
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
              className="relative min-h-[380px] rounded-[18px] border border-line p-8 pb-14 transition-colors duration-500"
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
