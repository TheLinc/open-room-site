"use client";

import type { ReactNode } from "react";
import { copy } from "@/lib/copy";
import { useHeroState } from "@/lib/use-hero-state";
import { RoomLoop } from "@/components/room-loop";
import { RoomOverlay } from "@/components/room-overlay";
import { TalkPanel } from "@/components/talk-panel";

export function HeroLoop({ children }: { children: ReactNode }) {
  const { state, reduced } = useHeroState();

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-8">
      <div className="order-2 flex flex-col gap-6 lg:order-1 lg:col-span-3">
        <p className="text-sm text-zinc-400">{copy.eyebrow}</p>
        {children}
      </div>
      <div className="order-1 flex flex-col gap-2 lg:order-2 lg:col-span-2">
        {/* Status labels and speech bubbles float over the agents; the line you
            say to the room is typed out underneath it. */}
        <div className="relative">
          <RoomLoop reduced={reduced} />
          <RoomOverlay state={state} />
        </div>
        <div className="px-[7%]">
          <TalkPanel state={state} />
        </div>
      </div>
    </div>
  );
}
