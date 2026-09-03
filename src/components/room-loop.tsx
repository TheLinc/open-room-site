"use client";

import Image from "next/image";
import { copy } from "@/lib/copy";
import { restFrame } from "@/lib/room-frames";

// The hero room. A silent five second loop of the agents typing, cut to the same
// square as the stills. Under reduced motion it is the rest frame instead.
export function RoomLoop({ reduced }: { reduced: boolean }) {
  if (reduced) {
    return (
      <div className="room-fade aspect-square w-full">
        <Image
          src={restFrame}
          alt={copy.roomAlt}
          preload
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="h-auto w-full"
        />
      </div>
    );
  }

  return (
    <div className="room-fade aspect-square w-full">
      <video
        className="h-full w-full object-contain"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={restFrame.src}
        aria-label={copy.roomAlt}
      >
        <source src="/room/loop.webm" type="video/webm" />
        <source src="/room/loop.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
