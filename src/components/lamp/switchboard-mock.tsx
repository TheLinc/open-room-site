"use client";

import type { CSSProperties } from "react";
import { CrewFace } from "@/components/crew-face";
import { crew, crewById, type CrewId } from "@/lib/crew";
import type { HeroGeometry } from "@/components/lamp/use-hero-geometry";

// A still of the switchboard, in the two-column hero. The pill in the
// headline is the hub: your words come in from the page's left edge and
// vanish into it, and the command alone leaves its top-right corner on an
// arc over the headline, down into the row of the agent you named.

type Frame = {
  incoming: string;
  lit: CrewId;
  command: string;
  status: Partial<Record<CrewId, "listening" | "working" | "done">>;
  reply?: { agent: CrewId; text: string };
};

export const switchboardFrame: Frame = {
  incoming: "hey Block, what's the status of my CI pipeline?",
  lit: "block",
  command: "what's the status of my CI pipeline?",
  status: { bit: "done", block: "working" },
  reply: { agent: "bit", text: "Tests passed, all green." },
};

// The five agents, one row each, beside the copy.
export function SwitchboardRows({
  frame = switchboardFrame,
}: {
  frame?: Frame;
}) {
  return (
    <ul className="sb-rows" aria-label="Your agents">
      {crew.map((m) => {
        const status = frame.status[m.id] ?? "idle";
        const reply = frame.reply?.agent === m.id ? frame.reply : null;
        return (
          <li
            key={m.id}
            className={`sb-row is-${status}`}
            data-agent={m.id}
            style={
              {
                "--agent": m.color,
                "--agent-screen": m.screen,
              } as CSSProperties
            }
          >
            <CrewFace id={m.id} size={30} className="sb-face" />
            <span className="sb-row-text">
              <b>{m.name}</b>
              <small>
                <i />
                {status === "idle" ? "idle" : status}
              </small>
            </span>
            {reply ? <span className="sb-reply">{reply.text}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

/** The arc from the pill's top-right corner over the headline into a row. */
export function arcPath(
  pill: { x: number; y: number; top: number; right: number },
  headlineTop: number,
  row: { x: number; y: number },
): string {
  const x0 = pill.right - 14;
  const y0 = pill.top + 4;
  // Every lane clears the headline by the same margin, whatever row it ends on.
  const apex = Math.max(16, Math.min(headlineTop - 72, row.y - 120));
  const dx = row.x - x0;
  return `M ${x0},${y0} C ${x0 + dx * 0.28},${apex} ${row.x - dx * 0.3},${apex + 10} ${row.x},${row.y}`;
}

/** The run in from the page's left edge into the pill's left side. */
export function inPath(pill: { x: number; left: number; y: number }): string {
  const x1 = pill.left + 26;
  return `M -320,${pill.y + 18} C -120,${pill.y + 18} ${pill.left - 90},${pill.y - 10} ${x1},${pill.y + 3}`;
}

// The words and lanes, on one SVG over the hero.
export function SwitchboardArc({
  geo,
  frame = switchboardFrame,
}: {
  geo: HeroGeometry | null;
  frame?: Frame;
}) {
  if (!geo || !geo.pillBox || !geo.headline) return null;
  const pill = geo.pillBox;
  const lit = crewById[frame.lit];
  return (
    <svg className="sb-overlay" aria-hidden="true" focusable="false">
      <defs>
        <path id="sb-in" d={inPath(pill)} />
        {crew.map((m) => {
          const row = geo.targets[m.id];
          return row ? (
            <path
              key={m.id}
              id={`sb-lane-${m.id}`}
              d={arcPath(pill, geo.headline!.top, row)}
            />
          ) : null;
        })}
      </defs>
      {crew.map((m) => (
        <use
          key={m.id}
          href={`#sb-lane-${m.id}`}
          className={`sb-lane ${m.id === frame.lit ? "is-lit" : ""}`}
          style={{ stroke: m.id === frame.lit ? lit.color : undefined }}
        />
      ))}
      <use href="#sb-in" className="sb-lane sb-lane-in" />
      <text className="sb-text sb-text-in" dy="-6">
        <textPath href="#sb-in" startOffset="100%" textAnchor="end">
          {frame.incoming}
        </textPath>
      </text>
      <text className="sb-text sb-text-out" dy="-7" style={{ fill: lit.color }}>
        <textPath href={`#sb-lane-${frame.lit}`} startOffset="22%">
          {frame.command}
        </textPath>
      </text>
    </svg>
  );
}
