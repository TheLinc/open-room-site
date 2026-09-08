import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/lib/room-frames", () => ({
  agentSpots: { Juno: { x: 0.3, y: 0.4 }, Atlas: { x: 0.5, y: 0.35 } },
}));

import { RoomOverlay } from "@/components/room-overlay";
import { stateAt } from "@/lib/hero-script";

describe("RoomOverlay", () => {
  afterEach(cleanup);

  test("puts each agent's status above its spot in the room", () => {
    render(<RoomOverlay state={stateAt(13500)} />);
    const atlas = screen.getByText("Atlas · done");
    expect(atlas.style.left).toBe("50%");
    expect(atlas.style.top).toBe("35%");
    expect(screen.getByText("Juno · working").style.left).toBe("30%");
  });

  test("shows only the latest reply from each agent as a bubble at its spot", () => {
    render(<RoomOverlay state={stateAt(13500)} />);
    expect(screen.queryByText("Let me check that for you.")).toBeNull();
    const bubble = screen.getByText("The CI pipeline ran successfully.");
    expect(bubble.style.left).toBe("50%");
    expect(screen.getAllByTestId("bubble").length).toBe(1);
  });

  test("skips agents with no spot and fades at the end", () => {
    const state = {
      ...stateAt(17500),
      pips: [{ name: "Nobody", color: "teal" as const, status: "working" as const }],
    };
    const { container } = render(<RoomOverlay state={state} />);
    expect(screen.queryAllByTestId("pip").length).toBe(0);
    expect((container.firstElementChild as HTMLElement).className).toContain("opacity-0");
  });
});
