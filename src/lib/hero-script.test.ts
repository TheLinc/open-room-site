import { describe, expect, test } from "vitest";
import {
  CHAR_MS,
  END_MS,
  GLANCE_MS,
  RIPPLE_MS,
  heroStateAt,
  heroStill,
  splitWake,
} from "@/lib/hero-script";

describe("hero script", () => {
  test("splits the wake word from the rest of the line", () => {
    expect(splitWake("hey Bit, run the tests")).toEqual([
      "hey Bit,",
      " run the tests",
    ]);
    expect(splitWake("yes, go ahead")).toEqual(["", "yes, go ahead"]);
  });

  test("saying a name starts a ripple and a glance, then the agent works", () => {
    const before = heroStateAt(800 + CHAR_MS * 3);
    expect(before.speaking).toBe(true);
    expect(before.speakingTo).toBe("bit");
    expect(before.ripples).toEqual([]);
    expect(before.glancing).toBeNull();

    const named = heroStateAt(800 + CHAR_MS * 8 + 10);
    expect(named.ripples).toEqual([{ agent: "bit", at: 800 + CHAR_MS * 8 }]);
    expect(named.glancing).toBeNull();
    expect(heroStateAt(800 + CHAR_MS * 8 + RIPPLE_MS).glancing).toBe("bit");
    expect(named.desks.bit).toBe("idle");

    expect(
      heroStateAt(800 + CHAR_MS * 8 + RIPPLE_MS + GLANCE_MS + 10).glancing,
    ).toBeNull();
    expect(heroStateAt(2600).desks.bit).toBe("working");
  });

  test("an agent that asks back is marked asking, and the answer routes to it without a wake word", () => {
    const asked = heroStateAt(11200);
    const block = asked.exchanges.find((x) => x.agent === "block")!;
    expect(block.status).toBe("asking");
    const answered = heroStateAt(13700);
    expect(answered.exchanges[2]).toMatchObject({
      agent: "block",
      wake: "",
      called: true,
    });
    expect(answered.exchanges[1].status).toBe("");
  });

  test("two agents work at once and finish in their own time", () => {
    const mid = heroStateAt(13800);
    expect(mid.desks.bit).toBe("working");
    expect(mid.desks.block).toBe("working");
    const late = heroStateAt(15200);
    expect(late.desks.bit).toBe("done");
    expect(late.exchanges[0].replies[0].playing).toBe(true);
    expect(heroStateAt(18000).exchanges[0].replies[0].playing).toBe(false);
  });

  test("plays once and rests on the finished conversation with no ripples", () => {
    const end = heroStateAt(END_MS + 5000);
    expect(end.ended).toBe(true);
    expect(end.time).toBe(END_MS);
    expect(end.exchanges).toHaveLength(4);
    expect(end.desks).toEqual({
      clawd: "idle",
      bit: "done",
      terminal: "working",
      block: "done",
      loop: "idle",
    });
    expect(heroStill().ripples).toEqual([]);
    expect(heroStill().exchanges).toEqual(end.exchanges);
  });
});
