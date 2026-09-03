import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("@/lib/room-frames", () => ({
  restFrame: { src: "/F1.webp", width: 1440, height: 1440 },
}));

import { RoomLoop } from "@/components/room-loop";

describe("RoomLoop", () => {
  test("plays the loop muted, looping and inline with both encodes", () => {
    const { container } = render(<RoomLoop reduced={false} />);
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video!.muted).toBe(true);
    expect(video!.loop).toBe(true);
    expect(video!.hasAttribute("playsinline")).toBe(true);
    expect(video!.getAttribute("poster")).toBe("/F1.webp");
    const sources = Array.from(container.querySelectorAll("source")).map((s) => s.getAttribute("src"));
    expect(sources).toEqual(["/room/loop.webm", "/room/loop.mp4"]);
  });

  test("shows the rest frame instead under reduced motion", () => {
    const { container } = render(<RoomLoop reduced={true} />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")).not.toBeNull();
  });
});
