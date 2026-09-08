import { describe, expect, test } from "vitest";
import { CHAT_VISIBLE, feedAt } from "@/components/lamp/flow-chat";
import { chatStateAt, chatStill } from "@/lib/chat-script";

describe("chat feed", () => {
  test("shows at most three exchanges, plus the one leaving for half a second", () => {
    const justAfterFourth = feedAt(chatStateAt(17000 + 100));
    expect(justAfterFourth).toHaveLength(CHAT_VISIBLE + 1);
    expect(justAfterFourth[0].leaving).toBe(true);
    expect(justAfterFourth[0].exchange.at).toBe(600);

    const settled = feedAt(chatStateAt(17000 + 2000));
    expect(settled).toHaveLength(CHAT_VISIBLE);
    expect(settled.every((f) => !f.leaving)).toBe(true);
  });

  test("rests on the last three exchanges", () => {
    const end = feedAt(chatStill());
    expect(end.map((f) => f.exchange.agent)).toEqual([
      "block",
      "block",
      "terminal",
    ]);
  });
});
