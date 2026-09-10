import type { CSSProperties } from "react";
import { Button, Field, Input, Sheet, ThreadRow } from "@/components/app-parts";
import {
  ArrowUpIcon,
  FolderIcon,
  LoaderIcon,
  MicIcon,
  PaperclipIcon,
  TerminalIcon,
} from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { crew, crewById } from "@/lib/crew";
import { copy } from "@/lib/copy";

// Three moves, each shown as the thing itself, drawn from the app: the
// editor sheet you fill in, the composer and the agent list, the reply that
// comes back with a question. Different objects, not three copies of one card.

// The editor's colour swatches, in the app's own palette.
const swatches = [
  "#f59e0b",
  "#10b981",
  "#0ea5e9",
  "#8b5cf6",
  "#f43f5e",
  "#84cc16",
  "#06b6d4",
  "#f97316",
];

function NameDemo() {
  return (
    <Sheet>
      <Field label="Name">
        <Input>Terminal</Input>
      </Field>
      <Field
        label="Colour"
        hint="Identifies the agent in the sidebar and while it is listening."
      >
        <span className="flex items-center gap-2 py-0.5">
          {swatches.map((c, i) => (
            <i
              key={c}
              className={`h-[18px] w-[18px] rounded-full ${i === 1 ? "ring-2 ring-ink ring-offset-2 ring-offset-card" : ""}`}
              style={{ background: c }}
            />
          ))}
        </span>
      </Field>
      <Field label="Workspace folder">
        <span className="flex gap-2">
          <Input mono className="flex-1">
            C:\work\infra
          </Input>
          <Button>
            <FolderIcon size={13} />
            Browse
          </Button>
        </span>
      </Field>
      <span className="sr-only">
        Terminal set up with a colour, a voice and a folder
      </span>
    </Sheet>
  );
}

function SayDemo() {
  const block = crewById.block;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-11 items-center gap-2.5 rounded-[14px] border border-line bg-card px-3 text-[13px] text-ink">
        <PaperclipIcon size={14} className="text-muted" />
        <span className="flex-1 truncate">
          <span
            className="whitespace-nowrap font-medium"
            style={{ color: block.color }}
          >
            hey Block,
          </span>{" "}
          check the CI pipeline
        </span>
        <MicIcon size={15} className="text-muted" />
        <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-white">
          <ArrowUpIcon size={13} />
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 self-end text-[13px] text-muted">
        or hold
        <kbd>Ctrl</kbd>
        <kbd>Shift</kbd>
        <kbd>Space</kbd>
        and say it
      </div>
      <ul className="mt-1 grid w-[min(100%,230px)] gap-0.5 rounded-panel border border-line bg-card p-2">
        {crew.map((m) => {
          const on = m.id === "block";
          return (
            <li
              key={m.id}
              className={`grid h-8 grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-lg px-2 text-[13px] ${on ? "bg-line-soft text-ink" : "text-ink-2"}`}
            >
              <i
                className="h-[9px] w-[9px] rounded-full"
                style={{ background: m.color }}
              />
              <span>{m.name}</span>
              {on ? (
                <LoaderIcon
                  size={12}
                  className="animate-spin text-muted motion-reduce:animate-none"
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BackDemo() {
  const terminal = crewById.terminal;
  return (
    <div className="flex flex-col gap-3">
      <Sheet className="gap-3 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_30px_-16px_rgb(0_0_0/0.25)]">
        <p className="text-[13px] leading-[1.5] text-ink">
          Two files changed in{" "}
          <span className="font-mono text-[12px]">ci/</span>. Want the diff?
        </p>
        <ThreadRow icon={<TerminalIcon size={13} />}>
          <span className="text-muted">Turn complete · 2 turns · $0.0186</span>
        </ThreadRow>
      </Sheet>
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
              <div className="flex flex-col justify-end md:min-h-[300px]">
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
