import { describe, expect, test } from "vitest";
import { crewSprites } from "@/lib/crew-sprites";
import { layersOf, runsOf } from "@/lib/crew-layers";

describe("runsOf", () => {
  test("merges horizontal neighbours into one rect", () => {
    expect(
      runsOf([
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 4, y: 0 },
        { x: 1, y: 1 },
      ]),
    ).toEqual([
      { x: 1, y: 0, w: 2 },
      { x: 4, y: 0, w: 1 },
      { x: 1, y: 1, w: 1 },
    ]);
  });
});

describe("layersOf", () => {
  test.each(crewSprites.map((s) => [s.id, s] as const))("%s has a screen, a body and two hands", (_, sprite) => {
    const l = layersOf(sprite);
    expect(l.screen.w).toBeGreaterThan(8);
    expect(l.screen.h).toBeGreaterThan(5);
    expect(l.body.length).toBeGreaterThan(10);
    expect(l.handL.length).toBeGreaterThan(0);
    expect(l.handR.length).toBeGreaterThan(0);
    expect(l.furniture.length).toBeGreaterThan(10);
    expect(l.head.w).toBeGreaterThan(6);
    expect(l.head.y).toBeLessThan(l.deskRow - 4);
    // Hands sit at desk height, on opposite sides of the chair.
    for (const c of l.handL) expect(c.x).toBeLessThan(l.screen.x + l.screen.w / 2);
    for (const c of l.handR) expect(c.x).toBeGreaterThan(l.screen.x + l.screen.w / 2);
  });

  test("keeps stray screen-coloured cells out of the screen", () => {
    const bit = crewSprites.find((s) => s.id === "bit")!;
    const l = layersOf(bit);
    // The screen box stops above the desk; nothing pale is drawn below it.
    expect(l.screen.y + l.screen.h).toBeLessThan(l.deskRow);
  });
});
