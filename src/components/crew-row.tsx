"use client";

import type { CSSProperties } from "react";
import { crewById, type CrewId } from "@/lib/crew";
import { layersOf, type SpriteLayers } from "@/lib/crew-layers";
import type { CrewState, Status } from "@/lib/crew-script";
import {
  crewRowWidth,
  crewSprites,
  spriteSeat,
  spriteSeatDark,
  spriteWood,
  type Sprite,
} from "@/lib/crew-sprites";

// Room under the chairs for the name labels, in cells.
const PAD_BOTTOM = 6;

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
const H = slots[0].sprite.height;
const W = crewRowWidth;
const VIEW_H = H + PAD_BOTTOM;

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

// One agent: furniture, screen, body and two hands, drawn as crisp rects.
function AgentSprite({
  slot,
  status,
  listening,
  index,
}: {
  slot: Slot;
  status: Status;
  listening: boolean;
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
      className={`crew-agent is-${status} ${listening ? "is-listening" : ""}`}
      style={style}
    >
      <rect
        className="crew-screen"
        data-agent={slot.id}
        x={layers.screen.x}
        y={layers.screen.y}
        width={layers.screen.w}
        height={layers.screen.h}
        fill={member.screen}
      />
      <g className="crew-output">
        {lines.map((l, i) => (
          <rect
            key={i}
            x={layers.screen.x + 1}
            y={l.y}
            width={l.w}
            height={1}
            fill={member.color}
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
            fill={member.color}
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
      {layers.body.map((r, i) => (
        <rect
          key={`b${i}`}
          x={r.x}
          y={r.y}
          width={r.w}
          height={1}
          fill={member.color}
        />
      ))}
      <g className="crew-hand crew-hand-l">
        {layers.handL.map((r, i) => (
          <rect
            key={`l${i}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={1}
            fill={member.color}
          />
        ))}
      </g>
      <g className="crew-hand crew-hand-r">
        {layers.handR.map((r, i) => (
          <rect
            key={`r${i}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={1}
            fill={member.color}
          />
        ))}
      </g>
      {/* When its name is said the agent glances over its shoulder: the body
          shifts a cell and two eyes show at the edge of the head. */}
      {listening ? (
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

export function CrewRow({
  state,
  alt,
  listening = null,
  bubbles = true,
}: {
  state: CrewState;
  alt: string;
  /** The agent whose name was just said, glancing round. */
  listening?: CrewId | null;
  /** Show replies as bubbles above the monitors. Off when a card shows them. */
  bubbles?: boolean;
}) {
  return (
    <div
      className={`crew ${state.fading ? "is-fading" : ""}`}
      role="img"
      aria-label={alt}
    >
      <div className="crew-stage">
        <svg
          className="crew-svg"
          viewBox={`0 0 ${W} ${VIEW_H}`}
          shapeRendering="crispEdges"
          aria-hidden="true"
          focusable="false"
        >
          {slots.map((slot, i) => (
            <AgentSprite
              key={slot.id}
              slot={slot}
              status={state.agents[slot.id].status}
              listening={listening === slot.id}
              index={i}
            />
          ))}
        </svg>

        {/* Names and status under the desks, replies above the monitors. */}
        <div className="crew-overlay" aria-hidden="true">
          {slots.map((slot) => {
            const member = crewById[slot.id];
            const agent = state.agents[slot.id];
            const s = slot.layers.screen;
            const left = `${((slot.sprite.x + s.x + s.w / 2) / W) * 100}%`;
            const top = `${(s.y / VIEW_H) * 100}%`;
            const bottom = `${((H + 1.2) / VIEW_H) * 100}%`;
            const tint = {
              "--agent": member.color,
              "--agent-screen": member.screen,
            } as CSSProperties;
            return (
              <div key={slot.id} style={tint}>
                <span
                  className={`crew-name is-${agent.status}`}
                  style={{ left, top: bottom }}
                >
                  {member.name}
                  {listening === slot.id ? (
                    <span className="crew-status">
                      <i /> listening
                    </span>
                  ) : agent.status !== "idle" ? (
                    <span className="crew-status">
                      <i /> {agent.status}
                    </span>
                  ) : null}
                </span>
                {bubbles && agent.reply ? (
                  <p
                    key={agent.reply}
                    className="crew-bubble"
                    style={{ left, top }}
                  >
                    {agent.reply}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
