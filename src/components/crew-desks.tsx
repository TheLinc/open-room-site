"use client";

import type { CSSProperties } from "react";
import { crewById, type CrewId } from "@/lib/crew";
import { layersOf, type SpriteLayers } from "@/lib/crew-layers";
import {
  crewRowWidth,
  crewSprites,
  spriteSeat,
  spriteSeatDark,
  spriteWood,
  type Sprite,
} from "@/lib/crew-sprites";

export type DeskStatus = "idle" | "working" | "done";

const furnitureColor: Record<string, string> = {
  k: spriteWood,
  t: spriteSeat,
  s: spriteSeatDark,
};

type Slot = { sprite: Sprite; layers: SpriteLayers; id: CrewId };

const slots: Slot[] = crewSprites.map((sprite) => ({
  sprite,
  layers: layersOf(sprite),
  id: sprite.id as CrewId,
}));

export const DESKS_W = crewRowWidth;
export const DESKS_H = slots[0].sprite.height;

/** Centre of each agent's screen, as a fraction of the row's width. */
export const deskCentre: Record<CrewId, number> = Object.fromEntries(
  slots.map((s) => [
    s.id,
    (s.sprite.x + s.layers.screen.x + s.layers.screen.w / 2) / DESKS_W,
  ]),
) as Record<CrewId, number>;

// A working screen goes dark in the agent's hue, so the head in front of it
// stays a clear silhouette and the output reads as light on a monitor.
function litScreen(color: string): string {
  return `color-mix(in srgb, ${color} 30%, #1c1913)`;
}

// Lines of output on a busy screen: every other row, ragged widths.
function outputLines(screen: SpriteLayers["screen"]) {
  const widths = [0.75, 0.45, 0.9, 0.6];
  const lines: { y: number; w: number }[] = [];
  for (let i = 0; i < widths.length; i++) {
    const y = screen.y + 1 + i * 2;
    if (y >= screen.y + screen.h - 1) break;
    lines.push({ y, w: Math.max(2, Math.round((screen.w - 2) * widths[i])) });
  }
  return lines;
}

function Runs({
  runs,
  fill,
  prefix,
}: {
  runs: { x: number; y: number; w: number }[];
  fill: string;
  prefix: string;
}) {
  return (
    <>
      {runs.map((r, i) => (
        <rect
          key={`${prefix}${i}`}
          x={r.x}
          y={r.y}
          width={r.w}
          height={1}
          fill={fill}
        />
      ))}
    </>
  );
}

// One agent at its desk: furniture, screen, body and two hands as crisp
// rects. The hands type in two frames; a glance shifts the body one cell and
// shows two eyes at the edge of the head.
function Agent({
  slot,
  status,
  glancing,
  index,
}: {
  slot: Slot;
  status: DeskStatus;
  glancing: boolean;
  index: number;
}) {
  const { sprite, layers } = slot;
  const member = crewById[slot.id];
  const style = { "--delay": `${index * 90}ms` } as CSSProperties;
  const lines = status === "idle" ? [] : outputLines(layers.screen);
  const cursorY = layers.screen.y + 1 + lines.length * 2;
  const head = layers.head;
  return (
    <g
      transform={`translate(${sprite.x} 0)`}
      className={`crew-agent is-${status} ${glancing ? "is-glancing" : ""}`}
      style={style}
    >
      <rect
        className="crew-screen"
        x={layers.screen.x}
        y={layers.screen.y}
        width={layers.screen.w}
        height={layers.screen.h}
        fill={status === "idle" ? member.screen : litScreen(member.color)}
        style={{ transition: "fill 300ms steps(1)" }}
      />
      <g className="crew-output">
        {lines.map((l, i) => (
          <rect
            key={i}
            x={layers.screen.x + 1}
            y={l.y}
            width={l.w}
            height={1}
            fill={member.screen}
            style={{ "--i": i } as CSSProperties}
          />
        ))}
        {status === "working" && cursorY < layers.screen.y + layers.screen.h ? (
          <rect
            className="crew-cursor"
            x={layers.screen.x + 1}
            y={cursorY}
            width={2}
            height={1}
            fill={member.screen}
          />
        ) : null}
      </g>
      {layers.furniture.map((r, i) => (
        <rect
          key={`f${i}`}
          x={r.x}
          y={r.y}
          width={r.w}
          height={1}
          fill={furnitureColor[r.ch]}
        />
      ))}
      <Runs runs={layers.body} fill={member.color} prefix="b" />
      <g className="crew-hand crew-hand-l">
        <Runs runs={layers.handL} fill={member.color} prefix="l" />
      </g>
      <g className="crew-hand crew-hand-r">
        <Runs runs={layers.handR} fill={member.color} prefix="r" />
      </g>
      {glancing ? (
        <g className="crew-eyes">
          <rect
            x={head.x + head.w - 3}
            y={head.y + 3}
            width={1}
            height={1}
            fill="#ffffff"
          />
          <rect
            x={head.x + head.w - 2}
            y={head.y + 3}
            width={1}
            height={1}
            fill="#1c1913"
          />
          <rect
            x={head.x + head.w - 6}
            y={head.y + 3}
            width={1}
            height={1}
            fill="#ffffff"
          />
          <rect
            x={head.x + head.w - 5}
            y={head.y + 3}
            width={1}
            height={1}
            fill="#1c1913"
          />
        </g>
      ) : null}
    </g>
  );
}

/** The five agents at their desks, seen from behind, drawn from the traced
 *  sprites. No labels: the window below names them. */
export function CrewDesks({
  desks,
  glancing,
  className,
}: {
  desks: Record<CrewId, DeskStatus>;
  glancing: CrewId | null;
  className?: string;
}) {
  return (
    <svg
      className={`pixel ${className ?? ""}`}
      viewBox={`0 0 ${DESKS_W} ${DESKS_H}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {slots.map((slot, i) => (
        <Agent
          key={slot.id}
          slot={slot}
          status={desks[slot.id]}
          glancing={glancing === slot.id}
          index={i}
        />
      ))}
    </svg>
  );
}
