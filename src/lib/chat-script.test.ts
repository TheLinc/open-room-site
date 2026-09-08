import { describe, expect, test } from "vitest";
import {
  CHAT_CHAR_MS,
  CHAT_END_MS,
  chatStateAt,
  chatStill,
  splitWake,
} from "@/lib/chat-script";

describe("chat script", () => {
  test("splits the wake word from the rest of the line", () => {
    expect(splitWake("hey Bit, run the tests")).toEqual([
      "hey Bit,",
      " run the tests",
    ]);
    expect(splitWake("yes, go ahead")).toEqual(["", "yes, go ahead"]);
  });

  test("an agent is called once its name is said, then works after the line lands", () => {
    const early = chatStateAt(600 + CHAT_CHAR_MS * 3);
    expect(early.exchanges[0].called).toBe(false);
    expect(early.speaking).toBe(true);
    const named = chatStateAt(600 + CHAT_CHAR_MS * 9);
    expect(named.exchanges[0].called).toBe(true);
    expect(named.exchanges[0].status).toBe("listening");
    expect(chatStateAt(2500).exchanges[0].status).toBe("working");
  });

  test("an agent that asks back is marked asking, and the answer routes to it without a wake word", () => {
    const asked = chatStateAt(11000);
    const block = asked.exchanges.find((x) => x.agent === "block")!;
    expect(block.status).toBe("asking");
    expect(block.replies.map((r) => r.text)).toEqual([
      "Let me check that.",
      "CI is green. Deploy to staging?",
    ]);

    const answered = chatStateAt(13500);
    expect(answered.exchanges).toHaveLength(3);
    const followUp = answered.exchanges[2];
    expect(followUp.agent).toBe("block");
    expect(followUp.wake).toBe("");
    expect(followUp.called).toBe(true);
    // The earlier Block exchange goes quiet once a later one takes over.
    expect(answered.exchanges[1].status).toBe("");
  });

  test("two agents are busy at once, then finish in their own time", () => {
    const mid = chatStateAt(13500);
    expect(mid.exchanges[0].status).toBe("working");
    expect(mid.exchanges[2].status).toBe("working");
    const late = chatStateAt(15000);
    expect(late.exchanges[0].status).toBe("done");
    expect(late.exchanges[0].replies[0].playing).toBe(true);
    expect(chatStateAt(18000).exchanges[0].replies[0].playing).toBe(false);
  });

  test("plays once and rests on the finished conversation", () => {
    const end = chatStateAt(CHAT_END_MS + 5000);
    expect(end.ended).toBe(true);
    expect(end.time).toBe(CHAT_END_MS);
    expect(end.exchanges).toHaveLength(4);
    expect(end.exchanges.at(-1)!.agent).toBe("terminal");
    expect(end.exchanges.at(-1)!.status).toBe("asking");
    expect(chatStill()).toEqual(end);
  });
});
