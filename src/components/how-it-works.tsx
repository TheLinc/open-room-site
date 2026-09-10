import type { CSSProperties } from "react";
import { Reveal } from "@/components/reveal";
import { Shot } from "@/components/shot";
import { crewById } from "@/lib/crew";
import { copy } from "@/lib/copy";
import editorName from "@/assets/app/editor-name.png";
import editorColourFolder from "@/assets/app/editor-colour-folder.png";
import composer from "@/assets/app/composer.png";
import sidebar from "@/assets/app/sidebar.png";
import reply from "@/assets/app/reply.png";

// Three moves, each shown as the thing itself, captured from the app: the
// agent sheet you fill in, the line you type or say, the reply that comes
// back with a question. Different objects, not three copies of one card.

function NameDemo() {
  return (
    <div className="grid gap-3 rounded-panel border border-line bg-card p-3">
      <Shot
        src={editorName}
        alt="The agent editor's Name field, filled in with Terminal"
        frame={false}
      />
      <Shot
        src={editorColourFolder}
        alt="The editor's colour swatches with green chosen, and the workspace folder field"
        frame={false}
      />
    </div>
  );
}

function SayDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Shot
        src={composer}
        alt="The app's composer with the line hey Block, check the CI pipeline typed in, a microphone button beside it"
        frame={false}
      />
      <div className="flex flex-wrap items-center gap-2 self-end text-[13px] text-muted">
        or hold
        <kbd>Ctrl</kbd>
        <kbd>Shift</kbd>
        <kbd>Space</kbd>
        and say it
      </div>
      <Shot
        src={sidebar}
        alt="The agent list with Block selected and a spinner beside its name while it works"
        className="mt-1 max-w-[230px]"
        sizes="230px"
      />
    </div>
  );
}

function BackDemo() {
  const block = crewById.block;
  return (
    <div className="flex flex-col gap-3">
      <Shot
        src={reply}
        alt="Block's reply: top-level folders build, docs, resources, scripts, src. Which one should I look into next? Then a row reading turn complete, 3 turns, $0.0422"
      />
      <p className="flex items-center gap-2.5 self-start pl-1 text-[13px] text-muted">
        <span
          className="voice-meter is-playing inline-flex h-[12px] items-end gap-[2px]"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4].map((n) => (
            <i
              key={n}
              className="block h-[7px] w-[2px] rounded-sm"
              style={{ background: block.color, "--n": n } as CSSProperties}
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
