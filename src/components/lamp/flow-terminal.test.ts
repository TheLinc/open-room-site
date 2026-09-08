import { describe, expect, test } from "vitest";
import {
  listeningAgent,
  terminalIsTyping,
  typedCount,
} from "@/components/lamp/flow-terminal";
import { ABSORB_MS, CHAR_MS, TRAVEL_MS, lines } from "@/lib/crew-script";

describe("terminal cards", () => {
  const bit = lines.find((l) => l.agent === "bit")!;
  const arrival = bit.at + TRAVEL_MS;

  test("types one character per tick after the line arrives, then stops", () => {
    expect(typedCount(bit.text, arrival, arrival - 1)).toBe(0);
    expect(typedCount(bit.text, arrival, arrival + CHAR_MS * 5)).toBe(5);
    expect(typedCount(bit.text, arrival, arrival + 60000)).toBe(
      bit.text.length,
    );
  });

  test("the named agent listens while its line is taken in", () => {
    expect(listeningAgent(arrival - 1)).toBeNull();
    expect(listeningAgent(arrival + 100)).toBe("bit");
    expect(listeningAgent(arrival + ABSORB_MS + 1)).toBeNull();
  });

  test("the pill keeps moving while a card types", () => {
    expect(terminalIsTyping(arrival + 100)).toBe(true);
    expect(terminalIsTyping(arrival + bit.text.length * CHAR_MS + 10)).toBe(
      false,
    );
  });
});
