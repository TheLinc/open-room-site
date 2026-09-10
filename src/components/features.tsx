"use client";

import { useEffect, useRef, useState } from "react";
import { CrewFace } from "@/components/crew-face";
import { Shot } from "@/components/shot";
import { crewById, type CrewId } from "@/lib/crew";
import { copy } from "@/lib/copy";
import settingsVoice from "@/assets/app/settings-voice.png";
import editorVoice from "@/assets/app/editor-voice.png";
import editorPermissions from "@/assets/app/editor-permissions.png";
import resumed from "@/assets/app/resumed.png";
import conversations from "@/assets/app/conversations.png";
import modelChip from "@/assets/app/model-chip.png";
import turnComplete from "@/assets/app/turn-complete.png";

type FeatureId = (typeof copy.features.items)[number]["id"];

// The feature tour: a list you scroll on the right, and on the left one
// panel that stays put while what it shows changes to match the item you
// are reading. Each panel is the feature itself, captured from the app.

function VoicePanel() {
  return (
    <Shot
      src={settingsVoice}
      alt="Settings, voice input: switches for push-to-talk and wake words, a microphone picker, and the push-to-talk shortcut Control Shift Space"
    />
  );
}

function BackgroundPanel() {
  return (
    <Shot
      src={editorVoice}
      alt="An agent's voice settings: show notifications on, speak aloud on, an engine picker set to the system voices, and a voice picker with a preview button"
    />
  );
}

function PermissionsPanel() {
  return (
    <Shot
      src={editorPermissions}
      alt="An agent's permissions: a permission mode picker set to default, then one row per tool, Read, Glob and Grep set to always allow, Write, Edit and Bash set to ask every time"
    />
  );
}

function MemoryPanel() {
  return (
    <div className="grid gap-3">
      <Shot
        src={resumed}
        alt="A divider in the thread reading resumed, last active 23 hours ago"
        frame={false}
        className="px-1"
      />
      <Shot
        src={conversations}
        alt="The conversation list for an agent: new conversation, then review package.json for project overview, 23 hours ago"
      />
    </div>
  );
}

function CostPanel() {
  return (
    <div className="grid gap-3">
      <Shot
        src={modelChip}
        alt="The model picker in the pane header, reading Haiku 4.5"
        className="max-w-[132px]"
        sizes="132px"
      />
      <Shot
        src={turnComplete}
        alt="A row at the end of a turn reading turn complete, 3 turns, $0.0422"
      />
    </div>
  );
}

const panels: Record<FeatureId, () => React.JSX.Element> = {
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
                <Panel />
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
                      return <P />;
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
