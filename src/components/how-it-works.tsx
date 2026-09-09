import type { CSSProperties } from "react";
import { CrewFace } from "@/components/crew-face";
import { BellIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { crew, crewById } from "@/lib/crew";
import { copy } from "@/lib/copy";

// Three moves, each shown as the thing itself: the agent sheet you fill in,
// the line you say, the reply that finds you. Different objects, not three
// copies of one card.

function NameDemo() {
  const bit = crewById.bit;
  return (
    <div className="rounded-panel border border-line bg-card p-4">
      <div className="flex items-center gap-3">
        <CrewFace id="bit" size={36} className="pixel" />
        <div className="grid flex-1 gap-1">
          <div className="h-8 rounded-lg border border-line bg-ground px-3 text-[13px] leading-8 text-ink">
            Bit
          </div>
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[13px]">
        <dt className="text-muted">Colour</dt>
        <dd className="flex items-center gap-1.5">
          {crew.map((m) => (
            <i
              key={m.id}
              className={`h-4 w-4 rounded-full ${m.id === "bit" ? "ring-2 ring-ink ring-offset-2 ring-offset-card" : ""}`}
              style={{ background: m.color }}
            />
          ))}
        </dd>
        <dt className="text-muted">Voice</dt>
        <dd className="text-ink">Ava</dd>
        <dt className="text-muted">Folder</dt>
        <dd className="font-mono text-[12px] text-ink">~/work/web</dd>
      </dl>
      <div className="mt-3 rounded-lg border border-line bg-ground p-3 font-mono text-[11.5px] leading-[1.6] text-ink-2">
        <span className="text-muted"># AGENT.md</span>
        <br />
        You run the web app tests and
        <br />
        keep the build green.
      </div>
      <span className="sr-only">
        {bit.name} set up with a colour, a voice and a folder
      </span>
    </div>
  );
}

function SayDemo() {
  const block = crewById.block;
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2.5 self-end rounded-xl rounded-br-[4px] bg-ink px-3.5 py-2.5 text-[15px] text-white">
        <span
          className="whitespace-nowrap font-medium"
          style={{ color: `color-mix(in srgb, ${block.color} 55%, white)` }}
        >
          hey Block,
        </span>
        check the CI pipeline
      </p>
      <div className="flex items-center gap-2 self-end text-[13px] text-muted">
        or hold
        <kbd>Ctrl</kbd>
        <kbd>Space</kbd>
        or type it
      </div>
      <div className="mt-2 flex items-center gap-3 self-start rounded-lg border border-line bg-card py-2 pl-2 pr-3">
        <CrewFace id="block" size={28} className="pixel" />
        <span className="text-[13px]">
          <b className="font-medium">Block</b>
          <span
            className="ml-2 inline-flex items-center gap-1.5 font-mono text-[11px]"
            style={{ color: block.color }}
          >
            <i
              className="h-[7px] w-[7px] rounded-full"
              style={{ background: block.color }}
            />
            working
          </span>
        </span>
      </div>
    </div>
  );
}

function BackDemo() {
  const terminal = crewById.terminal;
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 rounded-panel border border-line bg-card p-3 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_30px_-16px_rgb(0_0_0/0.25)]">
        <CrewFace id="terminal" size={32} className="pixel row-span-2" />
        <div className="flex items-center gap-2 text-[13px] font-medium">
          Terminal
          <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-normal text-muted">
            <BellIcon size={11} /> now
          </span>
        </div>
        <p className="text-[13px] text-ink-2">
          Two files in ci/ changed. Want the diff?
        </p>
        <div className="col-start-2 mt-2 flex gap-1.5">
          <span className="rounded-md bg-ink px-2.5 py-1 text-[11px] font-medium text-white">
            Show me
          </span>
          <span className="rounded-md border border-line px-2.5 py-1 text-[11px] font-medium text-ink-2">
            Later
          </span>
        </div>
      </div>
      <p className="flex items-center gap-2.5 self-start pl-1 text-[13px] text-muted">
        <span
          className="voice-meter is-playing inline-flex h-[12px] items-end gap-[2px]"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4].map((n) => (
            <i
              key={n}
              className="block h-[7px] w-[2px] rounded-sm"
              style={{ background: terminal.color, "--n": n } as CSSProperties}
            />
          ))}
        </span>
        or said out loud, in its own voice
      </p>
    </div>
  );
}

const demos = { name: NameDemo, say: SayDemo, back: BackDemo } as const;

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-[1120px] px-6 pt-32 md:pt-40">
      <Reveal className="max-w-[40ch]">
        <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.03em] md:text-[44px]">
          {copy.how.title}
        </h2>
        <p className="mt-4 text-[17px] leading-[1.5] text-muted">
          {copy.how.lead}
        </p>
      </Reveal>
      <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
        {copy.how.steps.map((step, i) => {
          const Demo = demos[step.id];
          return (
            <Reveal
              as="li"
              key={step.id}
              delay={i * 90}
              className="flex flex-col"
            >
              <div className="flex flex-col justify-end md:min-h-[260px]">
                <Demo />
              </div>
              <h3 className="mt-7 text-[20px] font-medium tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.55] text-ink-2">
                {step.body}
              </p>
              <p className="mt-3 text-[13px] text-muted">{step.source}</p>
            </Reveal>
          );
        })}
      </ol>
      <p className="mt-10 font-mono text-xs text-muted">{copy.how.caption}</p>
    </section>
  );
}
