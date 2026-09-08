import { describe, expect, test } from "vitest";
import { ABSORB_MS, LOOP_MS, TRAVEL_MS, reducedMotionState, stateAt } from "@/lib/crew-script";

describe("crew script", () => {
  test("starts with everyone idle and nothing said", () => {
    const s = stateAt(0);
    expect(s.talk).toBeNull();
    expect(Object.values(s.agents).every((a) => a.status === "idle" && a.reply === null)).toBe(true);
  });

  test("the first line travels toward Bit, then is absorbed, then Bit is working", () => {
    const start = 600;
    const travelling = stateAt(start + TRAVEL_MS / 2);
    expect(travelling.talk).toMatchObject({ agent: "bit", phase: "travel" });
    expect(travelling.talk!.t).toBeCloseTo(0.5, 1);
    expect(travelling.agents.bit.status).toBe("idle");

    const absorbing = stateAt(start + TRAVEL_MS + ABSORB_MS / 2);
    expect(absorbing.talk).toMatchObject({ agent: "bit", phase: "absorb" });

    const after = stateAt(start + TRAVEL_MS + ABSORB_MS + 50);
    expect(after.talk).toBeNull();
    expect(after.agents.bit.status).toBe("working");
  });

  test("Block answers twice and ends up done while Bit reports back", () => {
    const mid = stateAt(11000);
    expect(mid.agents.block.reply).toBe("Let me check that for you.");
    const late = stateAt(16500);
    expect(late.agents.block.status).toBe("done");
    expect(late.agents.block.reply).toBe("The CI pipeline ran successfully.");
    expect(late.agents.bit.status).toBe("done");
    expect(late.agents.bit.reply).toBe("Tests passed, all green.");
  });

  test("fades before the loop restarts and wraps around", () => {
    expect(stateAt(LOOP_MS - 100).fading).toBe(true);
    expect(stateAt(LOOP_MS + 10).fading).toBe(false);
    expect(stateAt(LOOP_MS + 10).talk).toBeNull();
  });

  test("reduced motion holds a busy frame with no fade", () => {
    const s = reducedMotionState();
    expect(s.fading).toBe(false);
    expect(s.talk).toBeNull();
    expect(s.agents.block.reply).toBeTruthy();
  });
});
