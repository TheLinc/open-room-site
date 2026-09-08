import { describe, expect, test } from "vitest";
import { calledAgent, micAt, transcriptAt } from "@/components/lamp/app-window";
import { ABSORB_MS, CHAR_MS, TRAVEL_MS, lines } from "@/lib/crew-script";
import { crewFaces } from "@/lib/crew-faces";

describe("crew faces", () => {
  test("every face has two eyes and consistent row widths", () => {
    for (const f of crewFaces) {
      expect(f.rows).toHaveLength(f.height);
      for (const r of f.rows) expect(r).toHaveLength(f.width);
      expect(f.rows.join("").split("w").length - 1).toBe(2);
    }
  });
});

describe("app window", () => {
  const bit = lines.find((l) => l.agent === "bit")!;

  test("the mic bar types the line while it is being said", () => {
    expect(micAt(bit.at - 1).listening).toBe(false);
    const mid = micAt(bit.at + CHAR_MS * 7);
    expect(mid.listening).toBe(true);
    expect(mid.text).toBe(bit.text.slice(0, 7));
    expect(mid.agent).toBe("bit");
  });

  test("your line lands in the transcript when the mic hands it over", () => {
    expect(transcriptAt(bit.at + TRAVEL_MS - 1)).toHaveLength(0);
    const after = transcriptAt(bit.at + TRAVEL_MS);
    expect(after).toEqual([
      { kind: "you", at: bit.at + TRAVEL_MS, text: bit.text, agent: "bit" },
    ]);
  });

  test("replies follow in order and the called agent is marked", () => {
    const late = transcriptAt(14000);
    expect(late.map((i) => i.kind)).toEqual(["you", "you", "agent", "agent"]);
    expect(calledAgent(bit.at + TRAVEL_MS + 10)).toBe("bit");
    expect(calledAgent(bit.at + TRAVEL_MS + ABSORB_MS + 10)).toBeNull();
  });
});
