import { describe, expect, test } from "vitest";
import {
  CHAR_MS,
  FADE_AT_MS,
  LOOP_MS,
  SCRIPT,
  reducedMotionState,
  stateAt,
} from "@/lib/hero-script";

describe("hero script", () => {
  test("events are sorted by time", () => {
    const times = SCRIPT.map((e) => e.at);
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  test("opens with Atlas already working and nothing said", () => {
    const s = stateAt(0);
    expect(s.talk).toBeNull();
    expect(s.replies).toEqual([]);
    expect(s.pips).toEqual([{ name: "Atlas", color: "red", status: "working" }]);
    expect(s.fading).toBe(false);
  });

  test("types the first line at 45 ms per character", () => {
    expect(stateAt(1000).talk).toEqual({ color: "teal", typed: "", full: "hey Juno, run the tests" });
    expect(stateAt(1000 + 7 * CHAR_MS).talk?.typed).toBe("hey Jun");
    expect(stateAt(1000 + 8 * CHAR_MS).talk?.typed).toBe("hey Juno");
    expect(stateAt(3000).talk?.typed).toBe("hey Juno, run the tests");
  });

  test("both work at four seconds", () => {
    expect(stateAt(4000).pips.map((p) => p.name)).toEqual(["Atlas", "Juno"]);
  });

  test("asks Atlas while he works", () => {
    expect(stateAt(6000).talk).toEqual({
      color: "red",
      typed: "",
      full: "hey Atlas, what's the status of my CI pipeline?",
    });
    expect(stateAt(6000).pips).toHaveLength(2);
  });

  test("Atlas answers immediately, then reports", () => {
    expect(stateAt(9500).replies).toEqual([
      { name: "Atlas", color: "red", text: "Let me check that for you." },
    ]);
    const report = stateAt(13500);
    expect(report.replies.map((r) => r.text)).toEqual([
      "Let me check that for you.",
      "The CI pipeline ran successfully.",
    ]);
    expect(report.pips).toEqual([
      { name: "Atlas", color: "red", status: "done" },
      { name: "Juno", color: "teal", status: "working" },
    ]);
  });

  test("fades near the end and wraps", () => {
    expect(stateAt(FADE_AT_MS - 1).fading).toBe(false);
    expect(stateAt(FADE_AT_MS).fading).toBe(true);
    expect(stateAt(LOOP_MS)).toEqual(stateAt(0));
    expect(stateAt(LOOP_MS + 1360)).toEqual(stateAt(1360));
  });

  test("reduced motion shows the first line complete and never fades", () => {
    const s = reducedMotionState();
    expect(s.talk?.typed).toBe("hey Juno, run the tests");
    expect(s.fading).toBe(false);
  });
});
